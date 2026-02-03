const { createClient } = require("@supabase/supabase-js");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

function json(status, obj){
  return { statusCode: status, headers: { ...corsHeaders, "Content-Type": "application/json" }, body: JSON.stringify(obj) };
}

async function requireUser({ token, supabaseAdmin }){
  if (!token) throw new Error("Missing Authorization bearer token");
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data || !data.user) throw new Error("Invalid session");
  return data.user;
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

    const user = await requireUser({ token, supabaseAdmin });

    const payload = JSON.parse(event.body || "{}");
    const audit_id = String(payload.audit_id || "").trim();
    if (!audit_id) throw new Error("Missing audit_id");
    const email = String(user.email || "").trim().toLowerCase();
    if (!email) throw new Error("User has no email");

    // Find pending invite
    const { data: invite, error: invErr } = await supabaseAdmin
      .from("v8_audit_invites")
      .select("*")
      .eq("audit_id", audit_id)
      .eq("email", email)
      .maybeSingle();
    if (invErr) throw invErr;
    if (!invite) return json(404, { error: "No pending invite for this user" });

    const role = String(invite.role || "auditor").trim().toLowerCase();

    // Grant collaborator access
    const { error: upErr } = await supabaseAdmin
      .from("v8_audit_collaborators")
      .upsert({
        audit_id,
        user_id: user.id,
        user_email: email,
        role,
        added_by: invite.invited_by || null
      }, { onConflict: "audit_id,user_id" });
    if (upErr) throw upErr;

    // Mark invite accepted
    const now = new Date().toISOString();
    const { error: accErr } = await supabaseAdmin
      .from("v8_audit_invites")
      .update({ accepted_at: now, accepted_by: user.id })
      .eq("audit_id", audit_id)
      .eq("email", email);
    if (accErr) throw accErr;

    return json(200, { ok: true, audit_id, role });
  }catch(e){
    return json(400, { error: e.message || String(e) });
  }
};
