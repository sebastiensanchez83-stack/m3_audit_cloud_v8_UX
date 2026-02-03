/**
 * Netlify Function: update-cert-levels
 * Purpose: Admin imports/updates certification thresholds (global floor + pillar floor) used in reports.
 * Auth: Requires Bearer access token (Supabase session) AND user must be admin (v8_admins).
 *
 * Expected JSON body:
 * {
 *   "levels":[
 *     {"level_key":"horizon","label":"Horizon","global_floor":0.6,"pillar_floor":0.5,"sort_order":1},
 *     {"level_key":"regatta","label":"Regatta","global_floor":0.7,"pillar_floor":0.6,"sort_order":2},
 *     ...
 *   ]
 * }
 */
const { createClient } = require("@supabase/supabase-js");

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "authorization, content-type",
      "access-control-allow-methods": "POST, OPTIONS",
    },
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json(200, { ok: true });

  try {
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!SUPABASE_URL) return json(500, { ok: false, error: "Missing env: SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)" });
    if (!SERVICE_ROLE) return json(500, { ok: false, error: "Missing env: SUPABASE_SERVICE_ROLE_KEY" });

    const authHeader = event.headers.authorization || event.headers.Authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!token) return json(401, { ok: false, error: "Missing Authorization: Bearer <access_token>" });

    const sbAdmin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Validate token -> get user
    const { data: userData, error: userErr } = await sbAdmin.auth.getUser(token);
    if (userErr || !userData?.user) return json(401, { ok: false, error: "Invalid/expired token", details: userErr?.message });

    const userId = userData.user.id;

    // Check admin flag
    const { data: adminRow, error: adminErr } = await sbAdmin
      .from("v8_admins")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (adminErr) return json(500, { ok: false, error: "Admin check failed", details: adminErr.message });
    if (!adminRow) return json(403, { ok: false, error: "Admin only" });

    let body = {};
    try { body = JSON.parse(event.body || "{}"); } catch (_) {}
    const levels = Array.isArray(body.levels) ? body.levels : [];
    if (!levels.length) return json(400, { ok: false, error: "Body must include levels[]" });

    // Normalize + validate
    const normalized = levels.map((x, idx) => {
      const level_key = String(x.level_key || x.key || x.label || "").trim().toLowerCase();
      const label = String(x.label || x.name || level_key).trim() || level_key;
      const global_floor = Number(x.global_floor);
      const pillar_floor = Number(x.pillar_floor);
      const sort_order = Number.isFinite(Number(x.sort_order)) ? Number(x.sort_order) : (idx + 1);
      if (!level_key) throw new Error(`levels[${idx}].level_key is required`);
      if (!Number.isFinite(global_floor) || global_floor < 0 || global_floor > 1) throw new Error(`levels[${idx}].global_floor must be between 0 and 1`);
      if (!Number.isFinite(pillar_floor) || pillar_floor < 0 || pillar_floor > 1) throw new Error(`levels[${idx}].pillar_floor must be between 0 and 1`);
      return { level_key, label, global_floor, pillar_floor, sort_order, is_active: true };
    });

    // Upsert levels
    const { error: upErr } = await sbAdmin
      .from("v8_certification_levels")
      .upsert(normalized, { onConflict: "level_key" });

    if (upErr) return json(500, { ok: false, error: "Upsert failed", details: upErr.message });

    // Deactivate any level not provided (keep table clean)
    const keys = normalized.map(x => x.level_key);
    const { error: deErr } = await sbAdmin
      .from("v8_certification_levels")
      .update({ is_active: false })
      .not("level_key", "in", `(${keys.map(k => `"${k.replace(/"/g,'\\"')}"`).join(",")})`);

    // deErr isn't fatal
    return json(200, { ok: true, count: normalized.length, deactivated: !!deErr ? "partial" : "ok" });
  } catch (e) {
    return json(500, { ok: false, error: "Server error", details: String(e && e.message ? e.message : e) });
  }
};
