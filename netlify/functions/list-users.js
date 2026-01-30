const { createClient } = require('@supabase/supabase-js');

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

function getBearerToken(event) {
  const auth = event.headers.authorization || event.headers.Authorization || '';
  const m = auth.match(/^Bearer\s+(.+)$/i);
  return m ? m[1] : null;
}

async function requireAdmin(supabaseAdmin, token) {
  if (!token) return { ok: false, error: 'Missing bearer token' };

  const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
  if (userErr || !userData?.user?.id) return { ok: false, error: 'Invalid token' };

  const userId = userData.user.id;
  const { data: adminRow, error: adminErr } = await supabaseAdmin
    .from('v8_admins')
    .select('user_id,is_admin')
    .eq('user_id', userId)
    .maybeSingle();

  if (adminErr) return { ok: false, error: adminErr.message };
  if (!adminRow?.is_admin) return { ok: false, error: 'Not admin' };

  return { ok: true, userId };
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') return json(405, { ok: false, error: 'Method not allowed' });

    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!SUPABASE_URL || !SERVICE_ROLE) return json(500, { ok: false, error: 'Missing env (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)' });

    const token = getBearerToken(event);
    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { persistSession: false },
      global: { headers: token ? { Authorization: `Bearer ${token}` } : {} },
    });

    const adminCheck = await requireAdmin(supabaseAdmin, token);
    if (!adminCheck.ok) return json(403, { ok: false, error: adminCheck.error });

    const payload = event.body ? JSON.parse(event.body) : {};
    const page = Math.max(1, Number(payload.page || 1));
    const perPage = Math.min(100, Math.max(1, Number(payload.per_page || 50)));

    const { data: listData, error: listErr } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
    if (listErr) return json(500, { ok: false, error: listErr.message });

    const users = listData?.users || [];

    // Admin flags
    const { data: admins, error: adminsErr } = await supabaseAdmin
      .from('v8_admins')
      .select('user_id,is_admin');
    if (adminsErr) return json(500, { ok: false, error: adminsErr.message });

    const adminSet = new Set((admins || []).filter(r => r.is_admin).map(r => r.user_id));

    const out = users.map(u => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at || null,
      is_admin: adminSet.has(u.id),
    }));

    return json(200, { ok: true, users: out, page, per_page: perPage });
  } catch (e) {
    return json(500, { ok: false, error: e.message || String(e) });
  }
};
