const fs = require('fs');
const path = require('path');

const env = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET:
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "audit-photos",
  APP_URL: process.env.APP_URL || "",
  REPORT_LINK_DEFAULT_TTL_DAYS: String(process.env.REPORT_LINK_DEFAULT_TTL_DAYS || "90"),
};

// Normalize APP_URL (ensure trailing slash)
if (env.APP_URL && !env.APP_URL.endsWith('/')) env.APP_URL += '/';

const out = `// Auto-generated at build time (Netlify).\nwindow.__ENV = ${JSON.stringify(env, null, 2)};\n`;

fs.writeFileSync(path.join(process.cwd(), 'env.js'), out, { encoding: 'utf-8' });
console.log('[build-env] wrote env.js');

// Soft validation (warn, don't fail) – keeps local/offline usage possible.
const missing = [];
if (!env.NEXT_PUBLIC_SUPABASE_URL) missing.push('NEXT_PUBLIC_SUPABASE_URL');
if (!env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
if (!env.APP_URL) missing.push('APP_URL');
if (missing.length) {
  console.warn('[build-env] WARNING: missing env vars:', missing.join(', '));
}
