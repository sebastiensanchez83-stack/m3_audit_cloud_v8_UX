const { createClient } = require("@supabase/supabase-js");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

function json(status, obj){
  return { statusCode: status, headers: { ...corsHeaders, "Content-Type": "application/json" }, body: JSON.stringify(obj) };
}

async function requireAdmin({ token, supabaseAdmin }){
  if (!token) throw new Error("Missing Authorization bearer token");
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data || !data.user) throw new Error("Invalid session");
  const user = data.user;

  const { data: adminRow, error: adminErr } = await supabaseAdmin
    .from("v8_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (adminErr) throw adminErr;
  if (!adminRow) throw new Error("Admin only");
  return user;
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: corsHeaders, body: "" };
  if (event.httpMethod !== "POST") return json(405, { error: "Method Not Allowed" });

  try{
    const url = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");

    const token = (event.headers.authorization || event.headers.Authorization || "").replace(/^Bearer\s+/i, "");
    const supabaseAdmin = createClient(url, serviceKey);

    await requireAdmin({ token, supabaseAdmin });

    const payload = JSON.parse(event.body || "{}");
    const audit_id = String(payload.audit_id || "").trim();
    if (!audit_id) throw new Error("Missing audit_id");

    const { data: collaborators, error: cErr } = await supabaseAdmin
      .from("v8_audit_collaborators")
      .select("audit_id,user_id,user_email,role,created_at,added_by")
      .eq("audit_id", audit_id)
      .order("created_at", { ascending: true });
    if (cErr) throw cErr;

    const { data: invites, error: iErr } = await supabaseAdmin
      .from("v8_audit_invites")
      .select("audit_id,email,role,created_at,accepted_at,invited_by,accepted_by")
      .eq("audit_id", audit_id)
      .order("created_at", { ascending: true });
    if (iErr) throw iErr;

    return json(200, { ok: true, collaborators: collaborators || [], invites: invites || [] });
  }catch(e){
    return json(400, { error: e.message || String(e) });
  }
};
