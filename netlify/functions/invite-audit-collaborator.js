const { createClient } = require("@supabase/supabase-js");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

function json(status, obj){
  return { statusCode: status, headers: { ...corsHeaders, "Content-Type": "application/json" }, body: JSON.stringify(obj) };
}

async function requireUserAndMaybeAdmin({ token, supabaseAdmin, requireAdmin }){
  if (!token) throw new Error("Missing Authorization bearer token");
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data || !data.user) throw new Error("Invalid session");
  const user = data.user;

  if (requireAdmin){
    const { data: adminRow, error: adminErr } = await supabaseAdmin
      .from("v8_admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (adminErr) throw adminErr;
    if (!adminRow) throw new Error("Admin only");
  }
  return user;
}

async function findUserIdByEmail(supabaseAdmin, email){
  const needle = String(email || "").trim().toLowerCase();
  if (!needle) return null;
  let page = 1;
  const perPage = 200;
  for (let i=0; i<20; i++){
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const users = (data && data.users) ? data.users : [];
    const hit = users.find(u => String(u.email || "").toLowerCase() === needle);
    if (hit) return hit.id;
    if (users.length < perPage) break;
    page += 1;
  }
  return null;
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: corsHeaders, body: "" };
  if (event.httpMethod !== "POST") return json(405, { error: "Method Not Allowed" });

  try{
    const url = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");

    const appUrl = process.env.APP_URL || "https://audit.m3monaco.com";

    const token = (event.headers.authorization || event.headers.Authorization || "").replace(/^Bearer\s+/i, "");
    const supabaseAdmin = createClient(url, serviceKey);

    const adminUser = await requireUserAndMaybeAdmin({ token, supabaseAdmin, requireAdmin: true });

    const payload = JSON.parse(event.body || "{}");
    const audit_id = String(payload.audit_id || "").trim();
    const email = String(payload.email || "").trim().toLowerCase();
    const role = String(payload.role || "auditor").trim().toLowerCase();

    if (!audit_id) throw new Error("Missing audit_id");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Invalid email");
    if (!["auditor","viewer","lead","admin"].includes(role)) throw new Error("Invalid role");

    // Confirm audit exists
    const { data: auditRow, error: auditErr } = await supabaseAdmin
      .from("v8_audits")
      .select("audit_id")
      .eq("audit_id", audit_id)
      .maybeSingle();
    if (auditErr) throw auditErr;
    if (!auditRow) return json(404, { error: "Audit not found" });

    const existingUserId = await findUserIdByEmail(supabaseAdmin, email);

    if (existingUserId){
      // Direct grant (no need for auth invite)
      const { error: upErr } = await supabaseAdmin
        .from("v8_audit_collaborators")
        .upsert({
          audit_id,
          user_id: existingUserId,
          user_email: email,
          role,
          added_by: adminUser.id
        }, { onConflict: "audit_id,user_id" });
      if (upErr) throw upErr;

      // Keep a trace in invites (marked accepted)
      const now = new Date().toISOString();
      await supabaseAdmin
        .from("v8_audit_invites")
        .upsert({
          audit_id,
          email,
          role,
          invited_by: adminUser.id,
          accepted_at: now,
          accepted_by: existingUserId
        }, { onConflict: "audit_id,email" });

      return json(200, { ok: true, mode: "direct", user_id: existingUserId });
    }

    // Create/refresh pending invite row
    const { error: invErr } = await supabaseAdmin
      .from("v8_audit_invites")
      .upsert({
        audit_id,
        email,
        role,
        invited_by: adminUser.id,
        accepted_at: null,
        accepted_by: null
      }, { onConflict: "audit_id,email" });
    if (invErr) throw invErr;

    // Send Supabase user invite (password set via update-password page)
    const redirectTo = `${appUrl}?flow=invite&audit_id=${encodeURIComponent(audit_id)}`;
    const { data: invData, error: mailErr } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo,
      data: { role: "auditor" }
    });
    if (mailErr) throw mailErr;

    return json(200, { ok: true, mode: "email", redirectTo, invited: invData || true });
  }catch(e){
    return json(400, { error: e.message || String(e) });
  }
};
