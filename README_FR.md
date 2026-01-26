# M3 Audit – UX V8 + Online (Supabase)

Cette version **garde l'UX V8 originale** (standalone), mais ajoute :
- Connexion (Supabase Auth)
- Sauvegarde + synchro des audits en ligne (table `v8_audits`)
- Liens **publics** de rapport (TTL) : `#/public/<token>`
- Photos dans Supabase Storage (bucket `audit-photos`) avec URLs publiques

---

## Setup Supabase (obligatoire pour le mode en ligne)

1) **Créer la base** : exécute `supabase/schema.sql` dans Supabase Studio → SQL Editor.

2) **Storage photos**
- Crée le bucket `audit-photos` et mets-le en **public**.
- Applique des policies pour autoriser :
  - upload/update/delete uniquement dans le dossier de l'utilisateur (`<uid>/...`)
  - lecture publique (ou bucket public)

Exemple SQL (à exécuter en owner / SQL editor) :
```sql
insert into storage.buckets (id, name, public)
values ('audit-photos','audit-photos',true)
on conflict (id) do nothing;

create policy "audit-photos: public read"
on storage.objects for select
using (bucket_id = 'audit-photos');

create policy "audit-photos: authenticated upload to own folder"
on storage.objects for insert to authenticated
with check (bucket_id = 'audit-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "audit-photos: authenticated update own folder"
on storage.objects for update to authenticated
using (bucket_id = 'audit-photos' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'audit-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "audit-photos: authenticated delete own folder"
on storage.objects for delete to authenticated
using (bucket_id = 'audit-photos' and (storage.foldername(name))[1] = auth.uid()::text);
```

3) **Auth**
- Active Email/Password dans Supabase Auth.

---

## Setup Netlify

Dans Netlify → Site settings → Environment variables :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` = `audit-photos`
- `APP_URL` = l'URL finale du site (ex: `https://audit.m3monaco.com/`)
- `REPORT_LINK_DEFAULT_TTL_DAYS` = `90` (ou autre)

Build : `npm run build` (génère `env.js`), Publish : `.`

---

# M3 Audit – Standalone (No npm / No Node)

## What this is
A standalone web app (plain HTML/CSS/JS) built from the Excel template:
`M3_Audit_v4_CYC_Club&Sailing_v1_SS.xlsx` (sheet **Audit**).

- No installation
- No `npm`
- Works on desktop + tablet/phone
- Stores audits locally in the browser (IndexedDB)
- Photo capture via phone camera (file input capture) + watermark (EU datetime, criterion ref, photo ID)

## How to run (choose one)

### Option A — VS Code Live Server (easiest)
1. Install VS Code
2. Install extension: **Live Server**
3. Open this folder, right click `index.html` → **Open with Live Server**
4. On your phone/tablet (same Wi‑Fi): open the LAN URL shown by Live Server.

### Option B — Netlify Drop (HTTPS + installable like an app)
1. Go to Netlify Drop (drag-and-drop deploy)
2. Drag the whole folder
3. Open the HTTPS URL on your phone/tablet
4. (Optional) “Add to Home Screen” to use it like an app.

### Option C — Any static hosting / server
Serve this folder as static files.

## Data
- Saved locally in your browser (IndexedDB)
- Export/Import JSON is available in the app (backup / transfer)

## Notes
- True camera video access (getUserMedia) needs HTTPS. The current version uses *file input capture* which works on most mobile browsers even without HTTPS.
- Dans la vue **Audit**, tu peux filtrer rapidement par **Facility** (Marina / Yacht Club / Sailing School) et/ou par **Pilier**, et activer “**Réduire sections**” pour limiter le scroll sur site.

---

## Utilisation sur tablette Android (recommandé)

### Option A — Héberger en HTTPS (caméra plus fiable)
- Déploie ce dossier sur Netlify / Vercel (drag & drop sur Netlify Drop).
- Ouvre l’URL en **Chrome**.
- Menu ⋮ → **Ajouter à l’écran d’accueil** → tu as une “appli” dédiée.

### Option B — Offline (sans internet)
- Utilise une app serveur local (ex: “Simple HTTP Server”) et pointe vers ce dossier.
- Ouvre l’URL locale dans Chrome.
- Si l’accès caméra est limité en HTTP, utilise le bouton “photo” (upload) : l’app watermarke quand même.

### Backup (fortement conseillé)
Dans la page **Rapport**, utilise **Export JSON** régulièrement.

