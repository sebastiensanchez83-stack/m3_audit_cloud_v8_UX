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
    const targetUserId = payload.user_id;
    const role = String(payload.role || '').toLowerCase(); // 'admin' or 'auditor'

    if (!targetUserId) return json(400, { ok: false, error: 'Missing user_id' });
    if (!['admin', 'auditor'].includes(role)) return json(400, { ok: false, error: 'Invalid role' });

    if (role === 'admin') {
      const { error } = await supabaseAdmin
        .from('v8_admins')
        .upsert({ user_id: targetUserId, is_admin: true }, { onConflict: 'user_id' });
      if (error) return json(500, { ok: false, error: error.message });
    } else {
      // demote => remove from v8_admins (or set is_admin false)
      const { error } = await supabaseAdmin
        .from('v8_admins')
        .delete()
        .eq('user_id', targetUserId);
      if (error) return json(500, { ok: false, error: error.message });
    }

    return json(200, { ok: true });
  } catch (e) {
    return json(500, { ok: false, error: e.message || String(e) });
  }
};
