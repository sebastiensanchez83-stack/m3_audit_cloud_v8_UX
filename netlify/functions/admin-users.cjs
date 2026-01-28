// Netlify Function: Admin user management for Supabase
// Secure by default: requires a valid Supabase session JWT AND the caller must be role=admin in public.user_roles.

const json = (statusCode, body, extraHeaders={}) => ({
  statusCode,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    ...extraHeaders,
  },
  body: JSON.stringify(body),
});

const getEnv = () => {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const APP_URL = process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (!SUPABASE_URL) throw new Error('Missing env: NEXT_PUBLIC_SUPABASE_URL');
  if (!ANON_KEY) throw new Error('Missing env: NEXT_PUBLIC_SUPABASE_ANON_KEY');
  if (!SERVICE_KEY) throw new Error('Missing env: SUPABASE_SERVICE_ROLE_KEY');
  return { SUPABASE_URL, ANON_KEY, SERVICE_KEY, APP_URL };
};

const supaFetch = async (url, { method='GET', headers={}, body } = {}) => {
  const res = await fetch(url, { method, headers, body });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
  if (!res.ok) {
    const msg = data?.msg || data?.message || data?.error || text || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
};

const getBearer = (event) => {
  const h = event.headers || {};
  const auth = h.authorization || h.Authorization || '';
  const m = auth.match(/^Bearer\s+(.+)$/i);
  return m ? m[1] : null;
};

const getCallerUser = async (env, jwt) => {
  // Validate the JWT by calling /auth/v1/user with anon key
  const url = `${env.SUPABASE_URL}/auth/v1/user`;
  return await supaFetch(url, {
    method: 'GET',
    headers: {
      apikey: env.ANON_KEY,
      authorization: `Bearer ${jwt}`,
    },
  });
};

const getRole = async (env, userId) => {
  const url = `${env.SUPABASE_URL}/rest/v1/user_roles?select=role&user_id=eq.${encodeURIComponent(userId)}&limit=1`;
  const rows = await supaFetch(url, {
    method: 'GET',
    headers: {
      apikey: env.SERVICE_KEY,
      authorization: `Bearer ${env.SERVICE_KEY}`,
    },
  });
  return rows?.[0]?.role || 'auditor';
};

const requireAdmin = async (env, event) => {
  const jwt = getBearer(event);
  if (!jwt) throw Object.assign(new Error('Missing Authorization Bearer token'), { status: 401 });
  const caller = await getCallerUser(env, jwt);
  const role = await getRole(env, caller.id);
  if (role !== 'admin') throw Object.assign(new Error('Forbidden: admin required'), { status: 403 });
  return { jwt, caller, role };
};

const listUsers = async (env) => {
  // List users via GoTrue admin endpoint
  const url = `${env.SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=200`;
  const out = await supaFetch(url, {
    method: 'GET',
    headers: {
      apikey: env.SERVICE_KEY,
      authorization: `Bearer ${env.SERVICE_KEY}`,
    },
  });
  const users = out?.users || out || [];

  // Fetch roles table once
  const rolesRows = await supaFetch(`${env.SUPABASE_URL}/rest/v1/user_roles?select=user_id,role&limit=1000`, {
    method: 'GET',
    headers: { apikey: env.SERVICE_KEY, authorization: `Bearer ${env.SERVICE_KEY}` },
  });
  const rolesById = {};
  for (const r of (rolesRows || [])) rolesById[r.user_id] = r.role;

  return { users, rolesById };
};

const upsertRole = async (env, userId, role) => {
  const allowed = new Set(['admin','auditor','viewer']);
  if (!allowed.has(role)) throw Object.assign(new Error('Invalid role'), { status: 400 });

  // UPSERT role row
  const url = `${env.SUPABASE_URL}/rest/v1/user_roles`;
  await supaFetch(url, {
    method: 'POST',
    headers: {
      apikey: env.SERVICE_KEY,
      authorization: `Bearer ${env.SERVICE_KEY}`,
      'content-type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify([{ user_id: userId, role }]),
  });
};

const banUser = async (env, userId, ban) => {
  const url = `${env.SUPABASE_URL}/auth/v1/admin/users/${encodeURIComponent(userId)}`;
  const body = ban ? { ban_duration: '87600h' } : { ban_duration: 'none' };
  await supaFetch(url, {
    method: 'PUT',
    headers: {
      apikey: env.SERVICE_KEY,
      authorization: `Bearer ${env.SERVICE_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};

const inviteUser = async (env, email, role, sendEmail) => {
  if (!email || !email.includes('@')) throw Object.assign(new Error('Invalid email'), { status: 400 });
  if (!role) role = 'auditor';

  // 1) Optionally trigger GoTrue invite email (requires SMTP properly set on Supabase project)
  if (sendEmail) {
    await supaFetch(`${env.SUPABASE_URL}/auth/v1/invite`, {
      method: 'POST',
      headers: {
        apikey: env.SERVICE_KEY,
        authorization: `Bearer ${env.SERVICE_KEY}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
  }

  // 2) Always generate an action link so you have a fallback (copy/paste)
  const gen = await supaFetch(`${env.SUPABASE_URL}/auth/v1/admin/generate_link`, {
    method: 'POST',
    headers: {
      apikey: env.SERVICE_KEY,
      authorization: `Bearer ${env.SERVICE_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      type: 'invite',
      email,
      redirect_to: env.APP_URL || undefined,
    }),
  });

  // 3) Ensure role row exists once they accept the invite (we can create now using user id if present)
  // generate_link may return a user object or an id depending on version; best effort.
  const userId = gen?.user?.id || gen?.user_id || null;
  if (userId) {
    await upsertRole(env, userId, role);
  }

  return { action_link: gen?.action_link || gen?.actionLink || null, user_id: userId };
};

exports.handler = async (event) => {
  try {
    const env = getEnv();
    await requireAdmin(env, event);

    const action = (event.queryStringParameters?.action || '').trim();

    if (event.httpMethod === 'GET') {
      // default action
      if (!action || action === 'listUsers') {
        const out = await listUsers(env);
        return json(200, out);
      }
      return json(400, { error: 'Unknown action' });
    }

    // POST: action + payload
    const payload = event.body ? JSON.parse(event.body) : {};

    if (action === 'setRole') {
      await upsertRole(env, payload.user_id, payload.role);
      return json(200, { ok: true });
    }
    if (action === 'banUser') {
      await banUser(env, payload.user_id, true);
      return json(200, { ok: true });
    }
    if (action === 'unbanUser') {
      await banUser(env, payload.user_id, false);
      return json(200, { ok: true });
    }
    if (action === 'inviteUser') {
      const out = await inviteUser(env, payload.email, payload.role, !!payload.send_email);
      return json(200, out);
    }

    return json(400, { error: 'Unknown action' });
  } catch (e) {
    const status = e.status || 500;
    return json(status, { error: e.message || String(e) });
  }
};
