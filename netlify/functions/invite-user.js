// Netlify Function: invite-user
// Requires env vars on Netlify:
// - SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)
// - SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)
// - SUPABASE_SERVICE_ROLE_KEY
//
// Client must send Authorization: Bearer <access_token>
// Body: { email: string, role: "auditor" | "admin" }

const json = (statusCode, bodyObj) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(bodyObj),
});

async function sbFetch(url, { method="GET", headers={}, body } = {}) {
  const res = await fetch(url, { method, headers, body });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  return { res, data, text };
}

async function rpcBool(supabaseUrl, rpcName, apikey, bearerToken) {
  const { res, data } = await sbFetch(`${supabaseUrl}/rest/v1/rpc/${rpcName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": apikey,
      "Authorization": `Bearer ${bearerToken}`,
    },
    body: "{}",
  });
  if (!res.ok) return { ok: false, value: false, error: data?.message || data?.error || `RPC ${rpcName} failed` };
  return { ok: true, value: Boolean(data) };
}

async function rpcTextWithServiceRole(supabaseUrl, rpcName, serviceRoleKey) {
  const { res, data } = await sbFetch(`${supabaseUrl}/rest/v1/rpc/${rpcName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": serviceRoleKey,
      "Authorization": `Bearer ${serviceRoleKey}`,
    },
    body: "{}",
  });
  if (!res.ok) return { ok: false, value: null, error: data?.message || data?.error || `RPC ${rpcName} failed` };
  // PostgREST may return JSON string, e.g. "user_id"
  return { ok: true, value: (typeof data === "string" ? data : String(data)) };
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
      return json(500, { error: "Missing env vars: SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY" });
    }

    const authHeader = event.headers.authorization || event.headers.Authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!token) return json(401, { error: "Missing bearer token" });

    let body = {};
    try { body = JSON.parse(event.body || "{}"); } catch { body = {}; }
    const email = String(body.email || "").trim().toLowerCase();
    const role = String(body.role || "auditor").trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { error: "Invalid email" });
    if (!["auditor", "admin"].includes(role)) return json(400, { error: "Invalid role" });

    // Verify caller is admin (RPC created by your previous SQL patch)
    const adminCheck = await rpcBool(SUPABASE_URL, "is_v8_admin", SUPABASE_ANON_KEY, token);
    if (!adminCheck.ok) return json(500, { error: "Cannot verify admin (is_v8_admin RPC missing?)" });
    if (!adminCheck.value) return json(403, { error: "Not authorized" });

    // Invite via GoTrue Admin endpoint
    const inviteResp = await sbFetch(`${SUPABASE_URL}/auth/v1/invite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ email }),
    });

    if (!inviteResp.res.ok) {
      const msg = inviteResp.data?.msg || inviteResp.data?.message || inviteResp.data?.error || "Invite failed";
      return json(inviteResp.res.status || 400, { error: msg, details: inviteResp.data });
    }

    const invitedUser = inviteResp.data?.user || inviteResp.data;
    const invitedId = invitedUser?.id;

    let adminInserted = false;
    if (role === "admin" && invitedId) {
      // Determine uid column name in v8_admins (RPC created by your previous SQL patch)
      const uidColResp = await rpcTextWithServiceRole(SUPABASE_URL, "_v8_admins_uid_col", SUPABASE_SERVICE_ROLE_KEY);
      const uidCol = uidColResp.ok && uidColResp.value ? uidColResp.value.replace(/"/g, "") : "user_id";

      const payload = { [uidCol]: invitedId };
      const upsertResp = await sbFetch(`${SUPABASE_URL}/rest/v1/v8_admins?on_conflict=${encodeURIComponent(uidCol)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_SERVICE_ROLE_KEY,
          "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Prefer": "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify(payload),
      });

      if (!upsertResp.res.ok) {
        return json(500, { error: "Invite sent but failed to grant admin", details: upsertResp.data });
      }
      adminInserted = true;
    }

    return json(200, {
      ok: true,
      invited: { id: invitedId, email },
      roleGranted: role === "admin" ? (adminInserted ? "admin" : "pending") : "auditor",
    });
  } catch (e) {
    return json(500, { error: e?.message || String(e) });
  }
};
