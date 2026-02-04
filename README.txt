M3 Audit Tool — Consolidated Bundle (v2.6.1)

CONTENTS
- app.js  (root) : Main app (includes: collaboration locks/RPC, certification level title, NC filters, Client Report v2 with per-pillar Top5+NC, editable Action Plan UI)
- netlify/functions/update-cert-levels.js : Admin import/update of certification thresholds
- supabase/certification_levels_patch.sql : Table + RLS + default seed for certification levels
- supabase/action_plan_patch.sql : Table + RLS for fully editable action plan items

INSTALL (minimal builds)
1) Repo:
   - Replace root app.js with this one
   - Add/merge netlify/functions/update-cert-levels.js
2) Supabase (run once if not already applied):
   - Run supabase/certification_levels_patch.sql
   - Run supabase/action_plan_patch.sql
3) Netlify:
   - Deploy
   - Hard refresh (Ctrl+F5)

REQUIRED NETLIFY ENV
- SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)
- SUPABASE_SERVICE_ROLE_KEY
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- APP_URL=https://audit.m3monaco.com
