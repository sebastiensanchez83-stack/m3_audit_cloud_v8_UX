
/* M3 Audit – Standalone (no npm)
   Data model is stored in IndexedDB.
*/
const APP_VERSION = "standalone-2.5";
const DB_NAME = "m3_audit_standalone";
const DB_VERSION = 1;
const STORE_AUDITS = "audits";

/* ---------- i18n (FR/EN) ---------- */
const I18N = {
  fr: {
    appTitle: "M3 Smart Sustainable Standard - Audit Tool",
    appSubtitle: "Audit M3 Standard 2026.1",
    localDataHint: "Données locales (navigateur)",
    onlineDataHint: "Données en ligne (compte)",
    footerHint: "Rapport: Imprimer → PDF • Backup: exporter ‘Audit project’",
    home: "Accueil",
    open: "Ouvrir",
    delete: "Supprimer",
    confirmDelete: "Supprimer cet audit local ?",
    auditsExisting: "Audits existants",
    backupsLocal: "sauvegarde(s) locale(s)",
    noAuditYet: "Aucun audit sauvegardé pour l’instant.",
    newAudit: "Nouvel audit",
    storedLocally: "Tout est stocké localement sur cet appareil (IndexedDB).",
    storedOnline: "Tout est synchronisé en ligne sur votre compte.",
    sitePlaceholder: "Ex: Marina XYZ",
    auditorPlaceholder: "Ex: Seb",
    siteLabel: "Site / Marina",
    auditorLabel: "Auditeur",
    createAudit: "Créer un audit",
    loginTitle: "Connexion",
    loginSubtitle: "Accès en ligne sécurisé",
    emailLabel: "Email",
    passwordLabel: "Mot de passe",
    signingIn: "Connexion...",
    signIn: "Se connecter",
    signUp: "Créer un compte",

    forgotPassword: "Mot de passe oublié ?",
    resetPasswordTitle: "Réinitialiser le mot de passe",
    resetPasswordSubtitle: "Recevez un lien par email",
    sendResetLink: "Envoyer le lien",
    resetEmailSent: "Si un compte existe pour cet email, un lien de réinitialisation vient d’être envoyé.",
    updatePasswordTitle: "Définir un nouveau mot de passe",
    updatePasswordSubtitle: "Choisissez un nouveau mot de passe pour votre compte",
    updatePasswordBtn: "Mettre à jour",
    passwordMismatch: "Les mots de passe ne correspondent pas.",
    passwordTooShort: "Mot de passe trop court (8 caractères minimum).",
    passwordUpdated: "Mot de passe mis à jour. Vous pouvez vous reconnecter.",
    backToLogin: "Retour connexion",
    invalidRecoveryLink: "Lien de récupération invalide ou expiré. Recommencez la procédure.",
    signOut: "Se déconnecter",
    signedIn: "Connecté",
    signedOut: "Déconnecté",
    shareReport: "Partager",
    shareLinkPrompt: "Lien de rapport (expire le {date})",
    linkCopied: "Lien copié",
    openApp: "Ouvrir l'app",
    reportLinkInvalid: "Lien invalide ou expiré",
    reportLinkExpired: "Ce lien a expiré ou n'existe pas.",
    publicReportTitle: "Rapport (lien public)",
    publicReportSubtitle: "Accès lecture seule",

    facilitiesAudited: "Facilities auditées",
    facilitiesHelp: "Sélectionne les périmètres réellement audités. L’audit sera validable uniquement sur ce périmètre.",
    selectOneFacility: "Sélectionne au moins une facility à auditer.",
    importBackupTitle: "Importer une sauvegarde",
    chooseAuditProject: "Choisis un fichier d’export ‘Audit project’.",
    invalidExport: "Export incompatible.",
    invalidJson: "Fichier invalide.",
    importAuditProject: "Importer Audit project",
    exportAuditProject: "Exporter Audit project",
    exportExcel: "Exporter Excel (format audit)",
    auditNotValidated: "Audit non validé : export Excel bloqué",
    report: "Rapport",
    reportLocked: "Le rapport est verrouillé tant que tous les critères ne sont pas évalués (Score ou N/A).",
    reportUnlocked: "Rapport déverrouillé.",
    nav: "Navigation",
    completion: "Complétion",
    toComplete: "À compléter",
    done100: "100% complété",
    modeVisit: "Mode visite (Facilities)",
    modeStructure: "Mode structure (Pillar → ParentGroup)",
    searchPh: "Rechercher (ID, titre, facility, pillar, parent group)…",
    reset: "Réinitialiser",
    reduceSections: "Réduire sections",
    pillar: "Pilier",
    facilities: "Facilities",
    all: "Tous",
    allPillars: "Tous les piliers",
    status: "Statut",
    statusAll: "Tous",
    statusTodo: "À faire",
    statusDone: "Complété",
    statusNC: "NC uniquement",
    statusNA: "N/A uniquement",
    noneResult: "Aucun résultat",
    noneResultHint: "Aucun critère ne correspond à la recherche / filtres actuels.",
    resetFilters: "Réinitialiser filtres",
    remaining: "Reste à compléter",
    nothingToDo: "Rien à compléter.",
    evaluate: "Évaluer",
    edit: "Modifier",
    ok: "OK",
    todo: "À faire",
    notSet: "Non renseigné",
    criterionNotFound: "Critère introuvable.",
    score: "Score",
    na: "N/A",
    naHint: "(non applicable)",
    naJustif: "Justification N/A",
    comments: "Commentaires",
    gapObserved: "Gap observed (obligatoire si NC)",
    corrective: "Action / corrective measure (obligatoire si NC)",
    evidenceRef: "Evidence ref",
    docId: "Doc ID",
    naReasonPh: "Pourquoi ce critère est non applicable ? (obligatoire si N/A)",
    commentsPh: "Observations / contexte / preuves vues sur site...",
    gapPh: "Décrire précisément l'écart observé (obligatoire si NC)",
    actionPh: "Mesure corrective / action recommandée (obligatoire si NC)",
    evidencePh: "Référence preuve (ex: photo P-00012, doc, lien, registre... )",
    docIdPh: "ID document / ID registre / réf interne",
    photos: "Photos (preuve)",
    photosHint: "La photo est automatiquement horodatée (EU) + reliée au critère + Photo_ID.",
    noPhotos: "Aucune photo.",
    back: "Retour",
    saveNext: "Enregistrer & suivant",
    prev: "◀︎ Précédent",
    next: "Suivant ▶︎",
    viewAudit: "Vue audit",
    checklistTitle: "Informations à vérifier (référentiel)",
    checklistHint: "À utiliser comme checklist pendant la visite.",
    scoringGuideTitle: "Guide de notation 0–5 (méthodologie & exemples)",
    evalMandatory: "Évaluation (obligatoire)",
    naRequiresReason: "N/A exige une justification.",
    needScoreOrNA: "Renseigne un score (0–5) ou coche N/A.",
    ncGapRequired: "NC: le champ 'Gap observed' est obligatoire.",
    ncActionRequired: "NC: le champ 'Action / corrective measure' est obligatoire.",
    toastSaved: "Critère enregistré",
    tipBackup: "Astuce: export ‘Audit project’ sur la page Rapport pour sécuriser un backup.",
    reportTitle: "Rapport",
    reportSummary: "Résumé",
    reportScoresPillar: "Scores par pilier",
    reportScoresFacilities: "Scores par Facilities",
    reportNC: "Registre NC",
    overallWeightedScore: "Score pondéré global",
    criteriaLabel: "Critères",
    ncLabel: "NC",
    scoreLabel: "Score",
    noNC: "Aucune NC.",
    scoreDefinition: "Définition: Score% = Σ(weight*score) / (5*Σ(weight))",
    errorTitle: "Erreur",
    printPdf: "Imprimer / PDF",
    exportHtml: "Exporter HTML",
    lockedTitle: "Rapport verrouillé",
    lockedAction: "Action requise",
    lockedExplain: "Le rapport est disponible uniquement lorsque 100% des critères sont renseignés (Score ou N/A).",
    backToAudit: "Revenir à l’audit",
    pdfTip: "Astuce PDF : Chrome/Edge → Imprimer → Enregistrer en PDF.",
    exportFilenameBase: "M3_Audit",
    auditNotFoundTitle: "Audit introuvable",
    auditNotFoundBody: "Cet audit n’existe pas (ou a été supprimé).",
    updatedLabel: "Maj",
  },
  en: {
    appTitle: "M3 Smart Sustainable Standard - Audit Tool",
    appSubtitle: "Audit M3 Standard 2026.1",
    localDataHint: "Local data (browser)",
    onlineDataHint: "Online data (account)",
    footerHint: "Report: Print → PDF • Backup: export ‘Audit project’",
    home: "Home",
    open: "Open",
    delete: "Delete",
    confirmDelete: "Delete this local audit?",
    auditsExisting: "Existing audits",
    backupsLocal: "local backup(s)",
    noAuditYet: "No saved audit yet.",
    newAudit: "New audit",
    storedLocally: "Everything is stored locally on this device (IndexedDB).",
    storedOnline: "Everything is synced online to your account.",
    sitePlaceholder: "e.g., Marina XYZ",
    auditorPlaceholder: "e.g., Seb",
    siteLabel: "Site / Marina",
    auditorLabel: "Auditor",
    createAudit: "Create audit",
    loginTitle: "Sign in",
    loginSubtitle: "Secure online access",
    emailLabel: "Email",
    passwordLabel: "Password",
    signingIn: "Signing in...",
    signIn: "Sign in",
    signUp: "Create account",

    forgotPassword: "Forgot password?",
    resetPasswordTitle: "Reset password",
    resetPasswordSubtitle: "Receive a reset link by email",
    sendResetLink: "Send reset link",
    resetEmailSent: "If an account exists for this email, a reset link has been sent.",
    updatePasswordTitle: "Set a new password",
    updatePasswordSubtitle: "Choose a new password for your account",
    updatePasswordBtn: "Update password",
    passwordMismatch: "Passwords do not match.",
    passwordTooShort: "Password is too short (minimum 8 characters).",
    passwordUpdated: "Password updated. Please sign in again.",
    backToLogin: "Back to sign in",
    invalidRecoveryLink: "Invalid or expired recovery link. Please restart the process.",
    signOut: "Sign out",
    signedIn: "Signed in",
    signedOut: "Signed out",
    shareReport: "Share",
    shareLinkPrompt: "Report link (expires {date})",
    linkCopied: "Link copied",
    openApp: "Open app",
    reportLinkInvalid: "Invalid or expired link",
    reportLinkExpired: "This link has expired or does not exist.",
    publicReportTitle: "Report (public link)",
    publicReportSubtitle: "Read-only access",

    loginTitle: "Sign in",
    loginSubtitle: "Secure access (account).",
    emailLabel: "Email",
    passwordLabel: "Password",
    signingIn: "Signing in…",
    signIn: "Sign in",
    signUp: "Create account",
    signOut: "Sign out",
    signedIn: "Signed in",
    signedOut: "Signed out",
    shareReport: "Share",
    shareLinkPrompt: "Report link (expires {date})",
    linkCopied: "Link copied",
    publicReportTitle: "Report (shared link)",
    publicReportSubtitle: "Read-only access",
    reportLinkInvalid: "Invalid or expired link.",
    reportLinkExpired: "This report link has expired.",
    openApp: "Open app",
    facilitiesAudited: "Audited facilities",
    facilitiesHelp: "Select the facilities actually audited. Validation will apply only to this perimeter.",
    selectOneFacility: "Select at least one facility.",
    importBackupTitle: "Import backup",
    chooseAuditProject: "Choose an exported 'Audit project' file.",
    invalidExport: "Incompatible export.",
    invalidJson: "Invalid file.",
    importAuditProject: "Import Audit project",
    exportAuditProject: "Export Audit project",
    exportExcel: "Export Excel (audit format)",
    auditNotValidated: "Audit not validated: Excel export blocked",
    report: "Report",
    reportLocked: "The report stays locked until all criteria are answered (Score or N/A).",
    reportUnlocked: "Report unlocked.",
    nav: "Navigation",
    completion: "Completion",
    toComplete: "To complete",
    done100: "100% complete",
    modeVisit: "Site walk (Facilities)",
    modeStructure: "Structure (Pillar → ParentGroup)",
    searchPh: "Search (ID, title, facility, pillar, parent group)…",
    reset: "Reset",
    reduceSections: "Collapse sections",
    pillar: "Pillar",
    facilities: "Facilities",
    all: "All",
    allPillars: "All pillars",
    status: "Status",
    statusAll: "All",
    statusTodo: "To do",
    statusDone: "Completed",
    statusNC: "NC only",
    statusNA: "N/A only",
    noneResult: "No results",
    noneResultHint: "No criterion matches the current search / filters.",
    resetFilters: "Reset filters",
    remaining: "Remaining",
    nothingToDo: "Nothing remaining.",
    evaluate: "Assess",
    edit: "Edit",
    ok: "OK",
    todo: "To do",
    notSet: "Not set",
    criterionNotFound: "Criterion not found.",
    score: "Score",
    na: "N/A",
    naHint: "(not applicable)",
    naJustif: "N/A justification",
    comments: "Comments",
    gapObserved: "Gap observed (required if NC)",
    corrective: "Corrective action (required if NC)",
    evidenceRef: "Evidence ref",
    docId: "Doc ID",
    naReasonPh: "Why is this criterion not applicable? (required if N/A)",
    commentsPh: "Notes / context / evidence seen on-site...",
    gapPh: "Describe the observed gap precisely (required if NC)",
    actionPh: "Corrective action / recommendation (required if NC)",
    evidencePh: "Evidence reference (e.g., photo P-00012, doc, link, logbook...)",
    docIdPh: "Document ID / registry ID / internal reference",
    photos: "Photos (evidence)",
    photosHint: "Photos are automatically EU-timestamped + linked to the criterion + Photo_ID.",
    noPhotos: "No photos.",
    back: "Back",
    saveNext: "Save & next",
    prev: "◀︎ Previous",
    next: "Next ▶︎",
    viewAudit: "Audit view",
    checklistTitle: "What to verify (reference)",
    checklistHint: "Use as a checklist during the site walk.",
    scoringGuideTitle: "Scoring guide 0–5 (method & examples)",
    evalMandatory: "Assessment (required)",
    naRequiresReason: "N/A requires a justification.",
    needScoreOrNA: "Set a score (0–5) or check N/A.",
    ncGapRequired: "NC: 'Gap observed' is required.",
    ncActionRequired: "NC: 'Corrective action' is required.",
    toastSaved: "Criterion saved",
    tipBackup: "Tip: export 'Audit project' from the Report page to keep a backup.",
    reportTitle: "Report",
    reportSummary: "Summary",
    reportScoresPillar: "Scores by pillar",
    reportScoresFacilities: "Scores by facility",
    reportNC: "NC register",
    overallWeightedScore: "Overall weighted score",
    criteriaLabel: "Criteria",
    ncLabel: "NC",
    scoreLabel: "Score",
    noNC: "No NC.",
    scoreDefinition: "Definition: Score% = Σ(weight*score) / (5*Σ(weight))",
    errorTitle: "Error",
    printPdf: "Print / PDF",
    exportHtml: "Export HTML",
    lockedTitle: "Report locked",
    lockedAction: "Action required",
    lockedExplain: "Report is available only when 100% of criteria are answered (Score or N/A).",
    backToAudit: "Back to audit",
    pdfTip: "PDF tip: Chrome/Edge → Print → Save as PDF.",
    exportFilenameBase: "M3_Audit",
    auditNotFoundTitle: "Audit not found",
    auditNotFoundBody: "This audit does not exist (or was deleted).",
    updatedLabel: "Updated",
  }
};

function getLang(){
  const saved = localStorage.getItem("m3_lang");
  if (saved === "fr" || saved === "en") return saved;
  const nav = (navigator.language||"fr").toLowerCase();
  return nav.startsWith("en") ? "en" : "fr";
}
let LANG = getLang();
function setLang(lang){
  LANG = (lang === "en") ? "en" : "fr";
  try{ localStorage.setItem("m3_lang", LANG); }catch(e){}
  document.documentElement.lang = LANG;
  route();
}
function t(key){
  const d = I18N[LANG] || I18N.fr;
  return (d && d[key]) ? d[key] : (I18N.fr[key] || key);
}

const SCORING_GUIDE = {
  fr: [
    { score: 5, label: "Excellence / best practice (preuve claire, déployé, contrôlé)" },
    { score: 4, label: "Conforme et robuste (déployé et cohérent, preuves disponibles)" },
    { score: 3, label: "Partiellement conforme (présent mais incomplet / inégal)" },
    { score: 2, label: "Faible (intention / éléments dispersés, preuves insuffisantes)" },
    { score: 1, label: "Très faible (quasi absent, non maîtrisé)" },
    { score: 0, label: "Absent / non mis en œuvre" },
  ],
  en: [
    { score: 5, label: "Excellence / best practice (clear evidence, deployed, controlled)" },
    { score: 4, label: "Compliant & robust (deployed and consistent, evidence available)" },
    { score: 3, label: "Partially compliant (present but incomplete / uneven)" },
    { score: 2, label: "Weak (intent or scattered elements, insufficient evidence)" },
    { score: 1, label: "Very weak (almost absent, not controlled)" },
    { score: 0, label: "Absent / not implemented" },
  ]
};

function ncLevelFromScore(score){
  if (score === null || score === undefined) return "";
  if (score < 1.5) return "Major";
  if (score < 2.5) return "Minor";
  if (score < 3.5) return "Observation";
  return "OK";
}

function formatEU(d){
  const pad = (n)=> String(n).padStart(2,"0");
  return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function h(tag, attrs={}, ...children){
  const e = document.createElement(tag);
  for (const [k,v] of Object.entries(attrs||{})){
    if (k === "class") e.className = v;
    else if (k === "html") e.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") e.addEventListener(k.slice(2).toLowerCase(), v);
    else if (typeof v === "boolean"){
      // Important: boolean attributes must NOT be set when false ("disabled=\"false\"" is still disabled)
      if (k === "disabled") e.disabled = v;
      else if (k === "checked") e.checked = v;
      else if (k === "selected") e.selected = v;
      else if (v) e.setAttribute(k, "");
    }
    else if (v !== undefined && v !== null) e.setAttribute(k, String(v));
  }
  for (const c of children){
    if (c === null || c === undefined) continue;
    if (typeof c === "string") e.appendChild(document.createTextNode(c));
    else e.appendChild(c);
  }
  return e;
}

function setRoot(node){
  const app = document.getElementById("app");
  app.innerHTML = "";
  app.appendChild(node);
}

/* ---------- Toast (ephemeral confirmation) ---------- */
let TOAST_HOST = null;
function ensureToastHost(){
  if (TOAST_HOST) return TOAST_HOST;
  TOAST_HOST = document.getElementById("toastHost");
  if (!TOAST_HOST){
    TOAST_HOST = document.createElement("div");
    TOAST_HOST.id = "toastHost";
    document.body.appendChild(TOAST_HOST);
  }
  return TOAST_HOST;
}

function showToast(message){
  const host = ensureToastHost();
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  host.appendChild(el);
  // animate in
  requestAnimationFrame(()=> el.classList.add("show"));
  setTimeout(()=>{
    el.classList.remove("show");
    setTimeout(()=> el.remove(), 250);
  }, 1200);
}

function updateFooter(){
  const ft = document.getElementById("footerText");
  const dataHint = (typeof ONLINE_ENABLED !== "undefined" && ONLINE_ENABLED) ? t("onlineDataHint") : t("localDataHint");
  if (ft) ft.textContent = `${dataHint} • ${t("footerHint")}`;
  const fh = document.getElementById("footerHome");
  if (fh) fh.textContent = t("home");
}

function topBar({title, subtitle, right}){
  const langSel = h(
    "select",
    {
      style: "min-width:86px",
      onchange: (e)=> setLang(e.target.value)
    },
    h("option",{value:"fr"},"FR"),
    h("option",{value:"en"},"EN")
  );
  langSel.value = LANG;
  return h("div",{class:"topbar"},
    h("div",{class:"topbar-inner"},
      h("div",{class:"brandRow"},
        h("img",{class:"brandLogo", src:"./assets/logo.png", alt:"M3"}),
        h("div",{class:"brandText"},
          h("div",{class:"brandTitle"}, title || t("appTitle")),
          subtitle ? h("div",{class:"brandSub"}, subtitle) : h("div",{class:"brandSub"}, t("appSubtitle"))
        )
      ),
      (function(){
        const online = (typeof ONLINE_ENABLED !== "undefined" && ONLINE_ENABLED);
        const authBtn = !online ? null : (AUTH && AUTH.user
          ? h("button",{class:"btn btn--ghost", onclick: async ()=>{ await signOut(); showToast(t("signedOut")); go("#/login"); }}, t("signOut"))
          : h("a",{class:"btn btn--ghost", href:"#/login"}, t("signIn"))
        );
        return h("div",{class:"topActions"}, langSel, right || h("div",{}), authBtn || h("div",{}));
      })()
    )
  );
}

function uuid(){
  if (crypto && crypto.randomUUID) return crypto.randomUUID();
  // fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c=>{
    const r = Math.random()*16|0, v = c === "x" ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

/* ---------- IndexedDB ---------- */
function openDB(){
  return new Promise((resolve, reject)=>{
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (ev)=>{
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_AUDITS)){
        const store = db.createObjectStore(STORE_AUDITS, { keyPath: "auditId" });
        store.createIndex("updatedAtISO","updatedAtISO",{unique:false});
      }
    };
    req.onsuccess = ()=> resolve(req.result);
    req.onerror = ()=> reject(req.error);
  });
}

async function idbPutAudit(audit){
  const db = await openDB();
  return new Promise((resolve,reject)=>{
    const tx = db.transaction(STORE_AUDITS,"readwrite");
    tx.objectStore(STORE_AUDITS).put(audit);
    tx.oncomplete = ()=> resolve(true);
    tx.onerror = ()=> reject(tx.error);
  });
}

async function idbGetAudit(auditId){
  const db = await openDB();
  return new Promise((resolve,reject)=>{
    const tx = db.transaction(STORE_AUDITS,"readonly");
    const req = tx.objectStore(STORE_AUDITS).get(auditId);
    req.onsuccess = ()=> resolve(req.result || null);
    req.onerror = ()=> reject(req.error);
  });
}

async function idbListAudits(){
  const db = await openDB();
  return new Promise((resolve,reject)=>{
    const tx = db.transaction(STORE_AUDITS,"readonly");
    const store = tx.objectStore(STORE_AUDITS);
    const req = store.getAll();
    req.onsuccess = ()=> {
      const all = (req.result || []).sort((a,b)=> (b.updatedAtISO||"").localeCompare(a.updatedAtISO||""));
      resolve(all);
    };
    req.onerror = ()=> reject(req.error);
  });
}

async function idbDeleteAudit(auditId){
  const db = await openDB();
  return new Promise((resolve,reject)=>{
    const tx = db.transaction(STORE_AUDITS,"readwrite");
    tx.objectStore(STORE_AUDITS).delete(auditId);
    tx.oncomplete = ()=> resolve(true);
    tx.onerror = ()=> reject(tx.error);
  });
}

/* ---------- Supabase (optional online mode) ---------- */
const ENV = (typeof window !== 'undefined' ? (window.__ENV || {}) : {});
const SUPABASE_URL = ENV.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const SUPABASE_BUCKET = ENV.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "audit-photos";
const APP_URL = (ENV.APP_URL || "").endsWith('/') ? (ENV.APP_URL || "") : ((ENV.APP_URL || "") ? (ENV.APP_URL || "") + '/' : "");
const REPORT_TTL_DAYS = Number.parseInt(ENV.REPORT_LINK_DEFAULT_TTL_DAYS || "90", 10);

function appBaseUrl(){
  // Prefer configured APP_URL (ends with /), fallback to current origin/path
  if (APP_URL) return APP_URL;
  const base = window.location.origin + window.location.pathname;
  return base.endsWith('/') ? base : base + '/';
}

function getParamAnywhere(key){
  try{
    const u = new URL(window.location.href);
    const v1 = u.searchParams.get(key);
    if (v1) return v1;
  }catch{}
  const h = window.location.hash || "";
  const idx = h.indexOf("?");
  if (idx >= 0){
    const qs = new URLSearchParams(h.slice(idx + 1));
    const v2 = qs.get(key);
    if (v2) return v2;
  }
  return null;
}

async function ensureRecoverySession(){
  const sb = await initSupabase();
  if (!sb) throw new Error('Supabase non configuré');

  // Already have a session
  const { data: sessData } = await sb.auth.getSession();
  if (sessData?.session){
    AUTH.session = sessData.session;
    AUTH.user = sessData.session.user || null;
    return sessData.session;
  }

  // PKCE flow (code)
  const code = getParamAnywhere("code");
  if (code){
    const { data, error } = await sb.auth.exchangeCodeForSession(code);
    if (error) throw error;
    AUTH.session = data.session;
    AUTH.user = data.session?.user || null;
    // Clean URL (remove query-like params after hash)
    try{
      const cleanHash = (window.location.hash || '').split('?')[0];
      window.history.replaceState({}, document.title, window.location.pathname + cleanHash);
    }catch{}
    return data.session;
  }

  // Fallback (token-based links)
  const access_token = getParamAnywhere("access_token");
  const refresh_token = getParamAnywhere("refresh_token");
  if (access_token && refresh_token){
    const { data, error } = await sb.auth.setSession({ access_token, refresh_token });
    if (error) throw error;
    AUTH.session = data.session;
    AUTH.user = data.session?.user || null;
    try{
      const cleanHash = (window.location.hash || '').split('?')[0];
      window.history.replaceState({}, document.title, window.location.pathname + cleanHash);
    }catch{}
    return data.session;
  }

  return null;
}


const ONLINE_ENABLED = !!(SUPABASE_URL && SUPABASE_ANON_KEY && typeof window !== 'undefined' && window.supabase && window.supabase.createClient);

let SB = null;
let AUTH = { session: null, user: null };

async function initSupabase(){
  if (!ONLINE_ENABLED) return null;
  if (SB) return SB;
  SB = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
  // keep local auth state updated
  SB.auth.onAuthStateChange((_event, session)=>{
    AUTH.session = session;
    AUTH.user = session?.user || null;
    // If user signs out, bounce to login (unless on public or auth routes)
    const parts = parseHash();
    const open = new Set(['login','forgot-password','update-password']);
    if (!session && parts[0] !== 'public' && !open.has(parts[0])){
      go('#/login');
    }
});
  // initial
  const { data } = await SB.auth.getSession();
  AUTH.session = data.session;
  AUTH.user = data.session?.user || null;
  return SB;
}

async function refreshSession(){
  const sb = await initSupabase();
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  AUTH.session = data.session;
  AUTH.user = data.session?.user || null;
  return data.session;
}

async function signInWithEmail(email, password){
  const sb = await initSupabase();
  if (!sb) throw new Error('Supabase non configuré');
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  AUTH.session = data.session;
  AUTH.user = data.session?.user || null;
  return data.session;
}

async function signUpWithEmail(email, password){
  const sb = await initSupabase();
  if (!sb) throw new Error('Supabase non configuré');
  const { data, error } = await sb.auth.signUp({ email, password });
  if (error) throw error;
  AUTH.session = data.session;
  AUTH.user = data.session?.user || null;
  return data.session;
}

async function signOut(){
  const sb = await initSupabase();
  if (!sb) return;
  await sb.auth.signOut();
  AUTH.session = null;
  AUTH.user = null;
}

async function sbRequireUser(){
  await refreshSession();
  if (!AUTH.user) throw new Error(t('mustLogin'));
  return AUTH.user;
}

// ---- Online DB operations (Supabase) ----
async function sbUpsertAudit(audit){
  const sb = await initSupabase();
  if (!sb) throw new Error('Supabase non configuré');
  const user = await sbRequireUser();

  const facilities = (audit.meta && Array.isArray(audit.meta.facilitiesAudited)) ? audit.meta.facilitiesAudited : [];

  const payload = {
    user_id: user.id,
    audit_id: audit.auditId,
    site_name: audit.meta?.siteName || null,
    auditor_name: audit.meta?.auditorName || null,
    facilities,
    criteria_version: audit.criteriaVersion || audit.meta?.criteriaVersion || null,
    data: audit
  };

  const { error } = await sb.from('v8_audits').upsert(payload, { onConflict: 'user_id,audit_id' });
  if (error) throw error;
  return true;
}

async function sbGetAudit(auditId){
  const sb = await initSupabase();
  if (!sb) throw new Error('Supabase non configuré');
  const user = await sbRequireUser();
  const { data, error } = await sb
    .from('v8_audits')
    .select('data')
    .eq('user_id', user.id)
    .eq('audit_id', auditId)
    .maybeSingle();
  if (error) throw error;
  return data?.data || null;
}

async function sbListAudits(){
  const sb = await initSupabase();
  if (!sb) throw new Error('Supabase non configuré');
  const user = await sbRequireUser();
  const { data, error } = await sb
    .from('v8_audits')
    .select('audit_id, site_name, auditor_name, facilities, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(r => ({
    auditId: r.audit_id,
    meta: {
      siteName: r.site_name || '',
      auditorName: r.auditor_name || '',
      facilitiesAudited: Array.isArray(r.facilities) ? r.facilities : []
    },
    updatedAtISO: r.updated_at || ''
  }));
}

async function sbDeleteAudit(auditId){
  const sb = await initSupabase();
  if (!sb) throw new Error('Supabase non configuré');
  const user = await sbRequireUser();
  const { error } = await sb
    .from('v8_audits')
    .delete()
    .eq('user_id', user.id)
    .eq('audit_id', auditId);
  if (error) throw error;
  return true;
}

async function sbCreateReportLink(auditId){
  const sb = await initSupabase();
  if (!sb) throw new Error('Supabase non configuré');
  const user = await sbRequireUser();
  const ttl = Number.isFinite(REPORT_TTL_DAYS) ? REPORT_TTL_DAYS : 90;
  const expires = new Date(Date.now() + ttl * 24 * 3600 * 1000);
  const token = uuid();

  const { error } = await sb
    .from('v8_report_links')
    .insert({ token, user_id: user.id, audit_id: auditId, expires_at: expires.toISOString() });
  if (error) throw error;

  const base = APP_URL || (location.origin + location.pathname.replace(/\/[^\/]*$/, '/') );
  return { token, url: `${base}#/public/${token}`, expiresAtISO: expires.toISOString() };
}

async function sbGetPublicReport(token){
  const sb = await initSupabase();
  if (!sb) throw new Error('Supabase non configuré');
  const { data, error } = await sb.rpc('get_v8_report', { p_token: token });
  if (error) throw error;
  return data || null;
}


async function sbUploadPhoto(auditId, criterionId, photoId, dataUrl){
  const sb = await initSupabase();
  const user = AUTH.user || (await sb.auth.getUser()).data.user;
  if (!user) throw new Error('Not authenticated');
  const ext = 'jpg';
  const filePath = `${user.id}/${auditId}/${criterionId}/${photoId}.${ext}`;
  const blob = dataUrlToBlob(dataUrl);
  const { error } = await sb.storage
    .from(SUPABASE_BUCKET)
    .upload(filePath, blob, { contentType: 'image/jpeg', upsert: true });
  if (error) throw error;
  const { data } = sb.storage.from(SUPABASE_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

// ---- Unified DB API used by the app ----
async function dbPutAudit(audit){
  if (ONLINE_ENABLED) return sbUpsertAudit(audit);
  return idbPutAudit(audit);
}

async function dbGetAudit(auditId){
  if (ONLINE_ENABLED) return sbGetAudit(auditId);
  return idbGetAudit(auditId);
}

async function dbListAudits(){
  if (ONLINE_ENABLED) return sbListAudits();
  return idbListAudits();
}

async function dbDeleteAudit(auditId){
  if (ONLINE_ENABLED) return sbDeleteAudit(auditId);
  return idbDeleteAudit(auditId);
}

/* ---------- Criteria ---------- */
let CRITERIA_DB = null;
async function loadCriteriaDB(){
  if (CRITERIA_DB) return CRITERIA_DB;

  const urls = ["./data/criteria.json", "./criteria.json"];
  let lastErr = null;

  for (const url of urls){
    try{
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      CRITERIA_DB = await res.json();
      return CRITERIA_DB;
    }catch(e){
      lastErr = e;
    }
  }

  throw new Error("Impossible de charger criteria.json (ou data/criteria.json). " + (lastErr ? String(lastErr) : ""));
}

function groupBy(arr, keyFn){
  const m = new Map();
  for (const it of arr){
    const k = keyFn(it);
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(it);
  }
  return m;
}

function answered(resp){
  if (!resp) return false;
  if (resp.na === true) return true;
  return resp.score !== null && resp.score !== undefined;
}

function computeProgress(criteria, responses, keyFn){
  const m = groupBy(criteria, keyFn);
  const out = [];
  for (const [k, list] of m.entries()){
    const done = list.filter(c=> answered(responses[c.id])).length;
    const total = list.length;
    out.push({ key: k, done, total, pct: total ? Math.round(done/total*100) : 0 });
  }
  out.sort((a,b)=> b.total - a.total);
  return out;
}

function computeWeightedScore(criteria, responses, filterFn){
  let sumW = 0;
  let sumPts = 0;
  for (const c of criteria){
    if (filterFn && !filterFn(c)) continue;
    const r = responses[c.id];
    if (!r || r.na) continue;
    if (r.score === null || r.score === undefined) continue;
    const w = Number.isFinite(c.weight) ? c.weight : 1;
    sumW += w;
    sumPts += w * r.score;
  }
  const pct = sumW ? (sumPts / (5 * sumW)) * 100 : 0;
  return { sumW, sumPts, pct: Math.round(pct*100)/100 };
}

function tagClass(level){
  if (level === "OK") return "pill tag-ok";
  if (level === "Observation") return "pill tag-obs";
  if (level === "Minor") return "pill tag-minor";
  if (level === "Major") return "pill tag-major";
  return "pill";
}

function downloadText(filename, text, mime="text/plain"){
  const blob = new Blob([text], {type: mime+";charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=> URL.revokeObjectURL(url), 2000);
}

function csvEscape(v){
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\n\r;]/.test(s)) return `"${s.replace(/"/g,'""')}"`;
  return s;
}
function toCSV(headers, rows){
  const sep = ";";
  const lines = [];
  lines.push(headers.map(csvEscape).join(sep));
  for (const r of rows){
    lines.push(headers.map(h=> csvEscape(r[h])).join(sep));
  }
  return "\ufeff" + lines.join("\r\n");
}
function toExcelXml(headers, rows, sheetName="Audit"){
  // Minimal SpreadsheetML 2003 (.xls) – opens in Excel without external libs.
  const esc = (s)=> String(s??"")
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const xmlHeader = `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>`;
  const workbookOpen = `<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
    xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:x="urn:schemas-microsoft-com:office:excel"
    xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
    xmlns:html="http://www.w3.org/TR/REC-html40">`;
  const styles = `<Styles>
    <Style ss:ID="sHeader"><Font ss:Bold="1"/><Alignment ss:Horizontal="Center"/></Style>
    <Style ss:ID="sText"><NumberFormat ss:Format="@"/></Style>
  </Styles>`;
  const wsOpen = `<Worksheet ss:Name="${esc(sheetName)}"><Table>`;
  const headerRow = `<Row>${headers.map(h=> `<Cell ss:StyleID="sHeader"><Data ss:Type="String">${esc(h)}</Data></Cell>`).join("")}</Row>`;
  const bodyRows = rows.map(r=>{
    return `<Row>${headers.map(h=>{
      const v = r[h];
      const isNum = typeof v === "number" && Number.isFinite(v);
      const type = isNum ? "Number" : "String";
      const val = isNum ? String(v) : esc(String(v??""));
      return `<Cell ss:StyleID="sText"><Data ss:Type="${type}">${val}</Data></Cell>`;
    }).join("")}</Row>`;
  }).join("");
  const wsClose = `</Table></Worksheet>`;
  const workbookClose = `</Workbook>`;
  return xmlHeader + workbookOpen + styles + wsOpen + headerRow + bodyRows + wsClose + workbookClose;
}
function formatDateEU(iso){
  try{
    const d = iso ? new Date(iso) : new Date();
    const pad = (n)=> String(n).padStart(2,"0");
    return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()}`;
  }catch(e){ return ""; }
}
function buildAuditExportRows(criteria, responses, meta){
  const headers = [
    "Criterion_ID","Pillar","ParentGroup","Facilities","Criterion","Description","Measurement","Unit","Threshold","Method",
    "Evidence required","Frequency","Owner","Weight","Fail_Safe","External requirement","Crosswalk (certifications)","Domain",
    "Gap observed","Action","Comments","Score (0–5)","Is_NA","Effective weight","Effective points","Finding","NC_Level",
    "Evidence_ref","Photo_ID","Doc_ID","Auditor","Audit_Date"
  ];
  const rows = [];
  for (const c of criteria){
    const r = responses[c.id] || {};
    const na = !!r.na;
    const score = (r.score===0 || r.score) ? r.score : null;
    const isNA = na ? "VRAI" : "FAUX";
    const w = Number.isFinite(c.weight) ? c.weight : 1;
    const effW = na ? 0 : w;
    const effPts = na ? 0 : (score===null ? 0 : (score/5)*w);
    let nc = na ? "" : (score===null ? "" : ncLevelFromScore(score));
    if (nc==="OK") nc="Ok";
    const photoIds = (r.photos||[]).map(p=> p.photoId).join(", ");
    const comments = (r.comments||"") + (na && r.naReason ? ((r.comments? " | ":"") + `N/A: ${r.naReason}`) : "");
    rows.push({
      "Criterion_ID": c.id,
      "Pillar": c.pillar || "",
      "ParentGroup": c.parentGroup || "",
      "Facilities": c.facility || "",
      "Criterion": c.title || "",
      "Description": c.description || "",
      "Measurement": c.measurement || "",
      "Unit": c.unit || "",
      "Threshold": c.threshold || "",
      "Method": c.method || "",
      "Evidence required": c.evidenceRequired || "",
      "Frequency": c.frequency || "",
      "Owner": c.owner || "",
      "Weight": w,
      "Fail_Safe": c.failSafe || "",
      "External requirement": c.externalRequirement || "",
      "Crosswalk (certifications)": c.crosswalk || "",
      "Domain": c.domain || "",
      "Gap observed": r.gapObserved || "",
      "Action": r.action || "",
      "Comments": comments || "",
      "Score (0–5)": score===null ? "" : score,
      "Is_NA": isNA,
      "Effective weight": effW,
      "Effective points": Math.round(effPts*100000)/100000,
      "Finding": "",
      "NC_Level": nc || "",
      "Evidence_ref": r.evidenceRef || "",
      "Photo_ID": photoIds || "",
      "Doc_ID": r.docId || "",
      "Auditor": (meta?.auditorName)||"",
      "Audit_Date": formatDateEU(meta?.createdAtISO)
    });
  }
  return { headers, rows };
}




/* ---------- Navigation context (filtered order) ----------
   Stores the current filtered + ordered criterion list (as displayed)
   so "Save" can automatically continue to the next item in the same context.
*/
function navStorageKey(auditId){ return `m3_nav_${auditId}`; }

function saveNavContext(auditId, ctx){
  try{ sessionStorage.setItem(navStorageKey(auditId), JSON.stringify(ctx)); }catch(e){}
}

function loadNavContext(auditId){
  try{
    const raw = sessionStorage.getItem(navStorageKey(auditId));
    if (!raw) return null;
    return JSON.parse(raw);
  }catch(e){ return null; }
}


/* ---------- Photo watermark ---------- */
async function watermarkDataUrl(fileBlob, lines){
  const img = await blobToImage(fileBlob);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img,0,0);
  const fontPx = Math.max(18, Math.round(canvas.width / 45));
  const padding = Math.round(fontPx * 0.7);
  const lineH = Math.round(fontPx * 1.35);
  const blockH = padding*2 + lineH*lines.length;

  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(0, canvas.height - blockH, canvas.width, blockH);
  ctx.fillStyle = "white";
  ctx.font = `${fontPx}px system-ui, -apple-system, Segoe UI, Roboto, Arial`;
  ctx.textBaseline = "top";

  let y = canvas.height - blockH + padding;
  for (const line of lines){
    ctx.fillText(line, padding, y);
    y += lineH;
  }
  return canvas.toDataURL("image/jpeg", 0.9);
}

function blobToImage(blob){
  return new Promise((resolve,reject)=>{
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = ()=>{ URL.revokeObjectURL(url); resolve(img); };
    img.onerror = reject;
    img.src = url;
  });
}

function dataUrlToBlob(dataUrl){
  const [head, b64] = String(dataUrl||"").split(',');
  const m = /data:(.*?);base64/.exec(head || "");
  const mime = m ? m[1] : 'image/jpeg';
  const binary = atob(b64 || "");
  const bytes = new Uint8Array(binary.length);
  for (let i=0; i<binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

/* ---------- Router ---------- */
function parseHash(){
  const raw = (location.hash || "#/").slice(1); // remove #
  const noQuery = raw.split("?")[0];
  const parts = noQuery.split("/").filter(Boolean);
  return parts;
}

function go(hash){
  location.hash = hash;
}

window.addEventListener("hashchange", ()=> route());

/* ---------- Views ---------- */
async function viewLogin(){
  if (!ONLINE_ENABLED){
    // No Supabase config → offline mode
    return go('#/');
  }
  await initSupabase();

  const email = h('input',{type:'email', placeholder:'name@domain.com', autocomplete:'email'});
  const pass = h('input',{type:'password', placeholder:'••••••••', autocomplete:'current-password'});

  const msg = h('div',{class:'small muted'});

  async function doSignIn(){
    msg.textContent = '';
    try{
      await signInWithEmail(email.value.trim(), pass.value);
      showToast(t('signedIn'));
      go('#/');
    }catch(e){
      msg.textContent = (e && e.message) ? e.message : String(e);
    }
  }

  async function doSignUp(){
    msg.textContent = '';
    try{
      await signUpWithEmail(email.value.trim(), pass.value);
      showToast(t('signedIn'));
      go('#/');
    }catch(e){
      msg.textContent = (e && e.message) ? e.message : String(e);
    }
  }

  const root = h('div',{},
    topBar({title: t('loginTitle'), subtitle: t('loginSubtitle')}),
    h('div',{class:'wrap'},
      h('div',{class:'card', style:'max-width:520px; margin:0 auto'},
        h('div',{class:'grid', style:'gap:12px'},
          h('div',{}, h('div',{class:'small muted'}, t('email')), email),
          h('div',{}, h('div',{class:'small muted'}, t('password')), pass),
          msg,
          h('div',{class:'row', style:'gap:10px; flex-wrap:wrap'},
            h('button',{class:'btn', onclick: doSignIn}, t('signIn')),
            h('button',{class:'btn btn--ghost', onclick: doSignUp}, t('signUp'))
          ),
          h('div',{class:'row-between', style:'margin-top:2px'}, h('a',{class:'link small', href:'#/forgot-password'}, t('forgotPassword'))),
          h('div',{class:'small muted'}, t('loginHint'))
        )
      )
    )
  );
  setRoot(root);
}


async function viewForgotPassword(){
  if (!ONLINE_ENABLED){
    return go('#/');
  }
  await initSupabase();

  const email = h('input',{type:'email', placeholder:'name@domain.com', autocomplete:'email'});
  const msg = h('div',{class:'small muted'});

  async function doSend(){
    msg.textContent = '';
    const e = email.value.trim();
    if (!e){
      msg.textContent = t('emailLabel') + " ?";
      return;
    }
    try{
      const sb = await initSupabase();
      const redirectTo = `${appBaseUrl()}#/update-password`;
      const { error } = await sb.auth.resetPasswordForEmail(e, { redirectTo });
      if (error) throw error;
      msg.textContent = t('resetEmailSent');
    }catch(err){
      msg.textContent = (err && err.message) ? err.message : String(err);
    }
  }

  const root = h('div',{},
    topBar({title: t('resetPasswordTitle'), subtitle: t('resetPasswordSubtitle'), right: h('div',{class:'row'}, h('a',{class:'btn btn--ghost', href:'#/login'}, t('backToLogin')))}),
    h('div',{class:'wrap'},
      h('div',{class:'card', style:'max-width:520px; margin:0 auto'},
        h('div',{class:'grid', style:'gap:12px'},
          h('div',{}, h('div',{class:'small muted'}, t('emailLabel')), email),
          msg,
          h('div',{class:'row', style:'gap:10px; flex-wrap:wrap'},
            h('button',{class:'btn', onclick: doSend}, t('sendResetLink')),
            h('a',{class:'btn btn--ghost', href:'#/login'}, t('backToLogin'))
          )
        )
      )
    )
  );
  setRoot(root);
}

async function viewUpdatePassword(){
  if (!ONLINE_ENABLED){
    return go('#/');
  }
  await initSupabase();

  const pass1 = h('input',{type:'password', placeholder:'••••••••', autocomplete:'new-password'});
  const pass2 = h('input',{type:'password', placeholder:'••••••••', autocomplete:'new-password'});
  const msg = h('div',{class:'small muted'});

  // Try to establish recovery session (via code/token)
  let session = null;
  try{
    session = await ensureRecoverySession();
  }catch(err){
    msg.textContent = (err && err.message) ? err.message : String(err);
  }

  async function doUpdate(){
    msg.textContent = '';
    const p1 = pass1.value || '';
    const p2 = pass2.value || '';
    if (p1.length < 8){
      msg.textContent = t('passwordTooShort');
      return;
    }
    if (p1 !== p2){
      msg.textContent = t('passwordMismatch');
      return;
    }
    try{
      const sb = await initSupabase();
      const { error } = await sb.auth.updateUser({ password: p1 });
      if (error) throw error;
      showToast(t('passwordUpdated'));
      // Safety: sign out, then ask user to sign in again
      await signOut();
      go('#/login');
    }catch(err){
      msg.textContent = (err && err.message) ? err.message : String(err);
    }
  }

  const body = session ? h('div',{class:'grid', style:'gap:12px'},
      h('div',{}, h('div',{class:'small muted'}, t('passwordLabel')), pass1),
      h('div',{}, h('div',{class:'small muted'}, t('passwordLabel')), pass2),
      msg,
      h('div',{class:'row', style:'gap:10px; flex-wrap:wrap'},
        h('button',{class:'btn', onclick: doUpdate}, t('updatePasswordBtn')),
        h('a',{class:'btn btn--ghost', href:'#/login'}, t('backToLogin'))
      )
    )
    : h('div',{class:'grid', style:'gap:12px'},
        h('div',{class:'small muted'}, t('invalidRecoveryLink')),
        h('div',{class:'row', style:'gap:10px; flex-wrap:wrap'},
          h('a',{class:'btn', href:'#/forgot-password'}, t('resetPasswordTitle')),
          h('a',{class:'btn btn--ghost', href:'#/login'}, t('backToLogin'))
        )
      );

  const root = h('div',{},
    topBar({title: t('updatePasswordTitle'), subtitle: t('updatePasswordSubtitle')}),
    h('div',{class:'wrap'},
      h('div',{class:'card', style:'max-width:520px; margin:0 auto'},
        body
      )
    )
  );
  setRoot(root);
}


async function viewStart(){
  const dbData = await loadCriteriaDB();
  const audits = await dbListAudits();

  const siteInput = h("input",{placeholder: t("sitePlaceholder")});
  const auditorInput = h("input",{placeholder: t("auditorPlaceholder")});
  const facilities = (dbData.facilities || ["Marina","Yacht Club","Sailing School"]);
  const facilityChecks = facilities.map(f => ({ f, el: h("input", {type:"checkbox", checked:true}) }));

  const facilitySelector = h("div",{class:"card card--soft", style:"margin-top:12px"},
    h("div",{class:"h3"}, t("facilitiesAudited")),
    h("div",{class:"small muted", style:"margin-top:6px"}, t("facilitiesHelp")),
    h("div",{class:"grid", style:"margin-top:10px; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:10px"},
      ...facilityChecks.map(x=> h("label",{class:"small row", style:"align-items:center; gap:10px; padding:8px 10px; border:1px solid var(--border); border-radius:12px; background:#fff"}, x.el, h("span",{style:"font-weight:800"}, x.f)))
    )
  );


  const createBtn = h("button",{class:"primary", onclick: async ()=>{
    const auditId = uuid();
    const selectedFacilities = facilityChecks.filter(x=>x.el.checked).map(x=>x.f);
    if (!selectedFacilities.length) return alert(t("selectOneFacility"));
    const now = new Date();
    const audit = {
      auditId,
      version: APP_VERSION,
      meta: {
        auditId,
        siteName: siteInput.value.trim() || "Unnamed site",
        auditorName: auditorInput.value.trim() || "Unnamed auditor",
        facilitiesAudited: selectedFacilities,
        createdAtISO: now.toISOString(),
      },
      criteriaVersion: dbData.version || "unknown",
      responses: {},   // criterionId -> response
      photoSeq: 1,
      updatedAtISO: now.toISOString(),
    };
    await dbPutAudit(audit);
    go(`#/audit/${auditId}`);
  }}, t("createAudit"));

  const importInput = h("input",{type:"file", accept:"application/json"});
  const importBtn = h("button",{onclick: async ()=>{
    const f = importInput.files && importInput.files[0];
    if (!f) return alert(t("chooseAuditProject"));
    const text = await f.text();
    let data;
    try{ data = JSON.parse(text); }catch(e){ return alert(t("invalidJson")); }
    if (!data.auditId || !data.meta || !data.responses) return alert(t("invalidExport"));
    data.updatedAtISO = new Date().toISOString();
    await dbPutAudit(data);
    go(`#/audit/${data.auditId}`);
  }}, t("importAuditProject"));

  const auditList = h("div",{class:"card"},
    h("div",{class:"row-between"},
      h("div",{class:"h3"}, t("auditsExisting")),
      h("div",{class:"small muted"}, `${audits.length} ${t("backupsLocal")}`)
    ),
    audits.length ? h("div",{class:"list"},
      ...audits.map(a=>{
        const meta = a.meta || {};
        const updated = a.updatedAtISO ? new Date(a.updatedAtISO).toLocaleString() : "";
        return h("div",{class:"item row-between"},
          h("div",{},
            h("div",{class:"h3"}, meta.siteName || "Unnamed site"),
            h("div",{class:"small muted"}, `${t("auditorLabel")}: ${meta.auditorName||"-"} • ${t("facilities")}: ${(meta.facilitiesAudited && meta.facilitiesAudited.length) ? meta.facilitiesAudited.join(", ") : t("all")} • Maj: ${updated}`)
          ),
          h("div",{class:"row"},
            h("button",{onclick: ()=> go(`#/audit/${a.auditId}`)}, t("open")),
            h("button",{onclick: async ()=>{
              if (!confirm(t("confirmDelete"))) return;
              await dbDeleteAudit(a.auditId);
              route();
            }}, t("delete")),
            h("button",{onclick: ()=> downloadText(`${t("exportFilenameBase")}_${(meta.siteName||"site").replaceAll(" ","_")}.json`, JSON.stringify(a,null,2), "application/json")}, t("exportAuditProject"))
          )
        );
      })
    ) : h("div",{class:"small muted", style:"margin-top:8px"}, t("noAuditYet"))
  );

  const root = h("div",{},
    topBar({title: t("appTitle"), subtitle:`${t("appSubtitle")} • ${dbData.criteria.length} ${LANG==="en"?"criteria":"critères"}`}),
    h("div",{class:"wrap grid"},
      h("div",{class:"card"},
        h("div",{class:"logoHero"}, h("img",{src:"./assets/logo.png", alt:"M3", class:"logoHeroImg"})),
        h("div",{class:"h2", style:"text-align:center"}, t("newAudit")),
        h("div",{class:"small muted", style:"margin-top:6px; text-align:center"}, (ONLINE_ENABLED ? t("storedOnline") : t("storedLocally"))),
        h("div",{class:"grid", style:"margin-top:12px; grid-template-columns:1fr; gap:10px"},
          h("label",{class:"small"}, t("siteLabel"), siteInput),
          h("label",{class:"small"}, t("auditorLabel"), auditorInput),
        ),
        facilitySelector,
        h("div",{class:"row", style:"margin-top:12px"}, createBtn),
        h("div",{class:"hr"}),
        h("div",{class:"h3"}, t("importBackupTitle")),
        h("div",{class:"row", style:"margin-top:8px"},
          h("div",{style:"flex:1; min-width:220px"}, importInput),
          importBtn
        )
      ),
      auditList
    )
  );
  setRoot(root);
}

function makeProgressCard(title, items){
  return h("div",{class:"card"},
    h("div",{class:"h3"}, title),
    h("div",{class:"grid", style:"margin-top:10px; gap:10px"},
      ...items.map(it =>
        h("div",{class:"card", style:"padding:10px"},
          h("div",{class:"row-between"},
            h("div",{class:"small", style:"font-weight:700"}, it.key),
            h("div",{class:"small muted"}, `${it.done}/${it.total} (${it.pct}%)`)
          ),
          h("div",{class:"bar", style:"margin-top:8px"},
            h("div",{style:`width:${it.pct}%`})
          )
        )
      )
    )
  );
}

async function viewAudit(auditId){
  const dbData = await loadCriteriaDB();
  const row = await dbGetAudit(auditId);
  if (!row) return setRoot(
    h("div",{},
      topBar({title: t("auditNotFoundTitle"), right:h("button",{onclick:()=>go("#/")}, t("home"))}),
      h("div",{class:"wrap"}, h("div",{class:"card"}, t("auditNotFoundBody")))
    )
  );

  const allCriteria = dbData.criteria;
  const auditedFacilities = (row.meta && Array.isArray(row.meta.facilitiesAudited) && row.meta.facilitiesAudited.length) ? row.meta.facilitiesAudited : (dbData.facilities || []);
  const criteria = (auditedFacilities && auditedFacilities.length) ? allCriteria.filter(c=> auditedFacilities.includes(c.facility || "")) : allCriteria;
  const responses = row.responses || {};
  const done = criteria.filter(c=> answered(responses[c.id])).length;
  const total = criteria.length;
  const pct = total ? Math.round(done/total*100) : 0;
  const allComplete = done === total;

  const modeSel = h("select",{},
    h("option",{value:"visit"}, t("modeVisit")),
    h("option",{value:"structure"}, t("modeStructure"))
  );
  modeSel.value = "visit";

  const searchInput = h("input",{placeholder: t("searchPh")});

  // Quick filters (Android-friendly)
  let selectedFacility = "__ALL__";
  let selectedPillar = "__ALL__";
  let selectedStatus = "__ALL__";
  let collapseSections = (window.matchMedia && window.matchMedia("(max-width: 720px)").matches) ? true : false;

  const facilityTabs = h("div",{class:"tabs"});
  const facilityBtns = new Map();
  function setFacility(v){
    selectedFacility = v;
    for (const [k, btn] of facilityBtns.entries()) btn.classList.toggle("active", k === v);
    renderList();
  }
  function addFacilityTab(label, value){
    const btn = h("button",{type:"button", class:"tab", onclick: ()=> setFacility(value)}, label);
    facilityBtns.set(value, btn);
    facilityTabs.appendChild(btn);
  }
  addFacilityTab(t("all"), "__ALL__");
  (auditedFacilities || []).forEach(f => addFacilityTab(f, f));
  // default active
  for (const [k, btn] of facilityBtns.entries()) btn.classList.toggle("active", k === "__ALL__");

  const pillarSel = h("select",{},
    h("option",{value:"__ALL__"}, t("allPillars")),
    ...(dbData.pillars || []).map(p => h("option",{value:p}, p))
  );
  const statusSel = h("select",{},
    h("option",{value:"__ALL__"}, t("statusAll")),
    h("option",{value:"TODO"}, t("statusTodo")),
    h("option",{value:"DONE"}, t("statusDone")),
    h("option",{value:"NC"}, t("statusNC")),
    h("option",{value:"NA"}, t("statusNA"))
  );
  statusSel.value = "__ALL__";
  statusSel.addEventListener("change", ()=>{
    selectedStatus = statusSel.value;
    renderList();
  });
  pillarSel.value = "__ALL__";
  pillarSel.addEventListener("change", ()=>{
    selectedPillar = pillarSel.value;
    renderList();
  });

  const collapseChk = h("input",{type:"checkbox"});
  collapseChk.checked = collapseSections;
  collapseChk.addEventListener("change", ()=>{
    collapseSections = !!collapseChk.checked;
    renderList();
  });

  function resetFilters(){
    searchInput.value = "";
    selectedFacility = "__ALL__";
    selectedPillar = "__ALL__";
    selectedStatus = "__ALL__";
    pillarSel.value = "__ALL__";
    statusSel.value = "__ALL__";
    for (const [k, btn] of facilityBtns.entries()) btn.classList.toggle("active", k === "__ALL__");
    renderList();
  }

  
  // Keep the "display order" of the currently filtered list, for auto-advance on Save
  let currentOrderedIds = criteria.map(x=>x.id);

  function persistNav(){
    const ctx = {
      mode: modeSel.value,
      q: searchInput.value.trim(),
      facility: selectedFacility,
      pillar: selectedPillar,
      status: selectedStatus,
      orderedIds: currentOrderedIds
    };
    saveNavContext(auditId, ctx);
  }

  function openCriterion(id){
    persistNav();
    go(`#/criterion/${auditId}/${encodeURIComponent(id)}`);
  }

const resetFiltersBtn = h("button",{type:"button", onclick: resetFilters}, t("reset"));

  const missing = criteria.filter(c=> !answered(responses[c.id])).slice(0, 120);

  const goReportBtn = h("button",{class:"primary", disabled: !allComplete, onclick: ()=> go(`#/report/${auditId}`)}, t("report"));
  const exportBtn = h("button",{onclick: ()=> downloadText(`${t("exportFilenameBase")}_${(row.meta.siteName||"site").replaceAll(" ","_")}.json`, JSON.stringify(row,null,2), "application/json")}, t("exportAuditProject"));

  const delBtn = h("button",{onclick: async ()=>{
    if (!confirm(t("confirmDelete"))) return;
    await dbDeleteAudit(auditId);
    go("#/");
  }}, t("delete"));

  function criterionRow(c){
    const r = responses[c.id];
    const isDone = answered(r);
    const scoreTxt = r?.na ? t("na") : (r?.score ?? "");
    const level = (r && !r.na && r.score!==null && r.score!==undefined) ? ncLevelFromScore(r.score) : "";

    const preview = h("div",{class:"itemPreview hidden"},
      h("div",{class:"small muted"}, `${c.facility} • ${c.pillar} • ${c.parentGroup}`),
      c.description ? h("div",{class:"small", style:"margin-top:8px; white-space:pre-wrap"}, c.description) : null,
      c.evidenceRequired ? h("div",{class:"small muted", style:"margin-top:8px; white-space:pre-wrap"}, c.evidenceRequired) : null,
      c.method ? h("div",{class:"small muted", style:"margin-top:8px; white-space:pre-wrap"}, c.method) : null
    );
    let expanded = false;
    const toggleBtn = h("button",{class:"iconBtn", type:"button", onclick:(ev)=>{
      ev.stopPropagation();
      expanded = !expanded;
      preview.classList.toggle("hidden", !expanded);
      toggleBtn.textContent = expanded ? "▴" : "▾";
    }}, "▾");

    const statusPill = level
      ? h("span",{class: tagClass(level)}, level)
      : h("span",{class:"pill"}, isDone ? t("ok") : t("todo"));

    const openBtn = h("button",{onclick: ()=> openCriterion(c.id)}, isDone ? t("edit") : t("evaluate"));

    return h("div",{class:"item"},
      h("div",{class:"row-between", style:"gap:10px"},
        h("div",{style:"flex:1; min-width:0"},
          h("div",{class:"itemTitle clamp2"}, `${c.id} — ${c.title}`)
        ),
        h("div",{class:"row", style:"flex-wrap:wrap"},
          statusPill,
          (scoreTxt!=="" ? h("span",{class:"pill"}, String(scoreTxt)) : null),
          toggleBtn,
          openBtn
        )
      ),
      preview
    );
  }

  function renderList(){
    const q = searchInput.value.trim().toLowerCase();
    let list = criteria;
    if (q){
      list = list.filter(c=>{
        const hay = `${c.id} ${c.title} ${c.pillar} ${c.parentGroup} ${c.facility}`.toLowerCase();
        return hay.includes(q);
      });
    }

    // Apply quick filters
    if (selectedFacility !== "__ALL__"){
      list = list.filter(c=> (c.facility || "—") === selectedFacility);
    }
    if (selectedPillar !== "__ALL__"){
      list = list.filter(c=> (c.pillar || "—") === selectedPillar);
    }
    if (selectedStatus !== "__ALL__"){
      list = list.filter(c=>{
        const r = responses[c.id];
        const isAns = answered(r);
        if (selectedStatus === "TODO") return !isAns;
        if (selectedStatus === "DONE") return isAns;
        if (selectedStatus === "NA") return !!(r && r.na);
        if (selectedStatus === "NC"){
          if (!r || r.na || r.score === null || r.score === undefined) return false;
          return ncLevelFromScore(r.score) !== "OK";
        }
        return true;
      });
    }
    const filterActive = !!q || selectedFacility !== "__ALL__" || selectedPillar !== "__ALL__" || selectedStatus !== "__ALL__";

    if (!list.length){
      currentOrderedIds = [];
      persistNav();
      listWrap.replaceChildren(
        h("div",{class:"card"},
          h("div",{class:"h3"}, t("noneResult")),
          h("div",{class:"small muted", style:"margin-top:8px"}, t("noneResultHint")),
          h("div",{class:"row", style:"margin-top:10px"},
            h("button",{type:"button", onclick: resetFilters}, t("resetFilters"))
          )
        )
      );
      return;
    }

    const mode = modeSel.value;

    // Compute the linear order exactly as displayed (sections + sorting),
    // so the criterion page can auto-advance within the same context.
    let orderedIds = [];
    if (mode === "visit"){
      const byFacilityTmp = groupBy(list, c=> c.facility || "—");
      const orderTmp = (auditedFacilities || dbData.facilities || []);
      const keysTmp = Array.from(byFacilityTmp.keys()).sort((a,b)=>{
        const ia = orderTmp.indexOf(a), ib = orderTmp.indexOf(b);
        if (ia === -1 && ib === -1) return a.localeCompare(b);
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia-ib;
      });
      for (const fac of keysTmp){
        const items = byFacilityTmp.get(fac) || [];
        for (const it of items) orderedIds.push(it.id);
      }
    } else {
      const byPillarTmp = groupBy(list, c=> c.pillar || "—");
      const orderTmp = dbData.pillars || [];
      const pillarsTmp = Array.from(byPillarTmp.keys()).sort((a,b)=>{
        const ia = orderTmp.indexOf(a), ib = orderTmp.indexOf(b);
        if (ia === -1 && ib === -1) return a.localeCompare(b);
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia-ib;
      });
      for (const p of pillarsTmp){
        const listP = byPillarTmp.get(p) || [];
        const byPG = groupBy(listP, c=> c.parentGroup || "—");
        const groups = Array.from(byPG.keys()).sort((a,b)=> a.localeCompare(b));
        for (const pg of groups){
          const items = byPG.get(pg) || [];
          for (const it of items) orderedIds.push(it.id);
        }
      }
    }
    currentOrderedIds = orderedIds.length ? orderedIds : list.map(x=>x.id);
    persistNav();

    if (mode === "visit"){
      const groups = computeProgress(list, responses, c=> c.facility || "—");
      const byFacility = groupBy(list, c=> c.facility || "—");
      const sections = [];
      // keep facility order from criteria.json if possible
      const order = (auditedFacilities || dbData.facilities || []);
      const keys = Array.from(byFacility.keys()).sort((a,b)=>{
        const ia = order.indexOf(a), ib = order.indexOf(b);
        if (ia === -1 && ib === -1) return a.localeCompare(b);
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia-ib;
      });
      for (const fac of keys){
        const items = byFacility.get(fac);
        const g = groups.find(x=> x.key===fac) || {done:0,total:items.length,pct:0};
        sections.push(
          h("details",{class:"card", open: (!collapseSections || filterActive) ? true : null},
            h("summary",{class:"row-between"},
              h("div",{class:"h3"}, fac),
              h("div",{class:"small muted"}, `${g.done}/${g.total} (${g.pct}%)`)
            ),
            h("div",{class:"bar", style:"margin-top:8px"}, h("div",{style:`width:${g.pct}%`})),
            h("div",{class:"list", style:"margin-top:10px"}, ...items.map(criterionRow))
          )
        );
      }
      listWrap.replaceChildren(...sections);
    } else {
      // structure: Pillar -> ParentGroup
      const byPillar = groupBy(list, c=> c.pillar || "—");
      const order = dbData.pillars || [];
      const pillars = Array.from(byPillar.keys()).sort((a,b)=>{
        const ia = order.indexOf(a), ib = order.indexOf(b);
        if (ia === -1 && ib === -1) return a.localeCompare(b);
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia-ib;
      });
      const sections = [];
      for (const p of pillars){
        const listP = byPillar.get(p);
        const byPG = groupBy(listP, c=> c.parentGroup || "—");
        const groups = Array.from(byPG.keys()).sort((a,b)=> a.localeCompare(b));
        const doneP = listP.filter(c=> answered(responses[c.id])).length;
        const pctP = listP.length ? Math.round(doneP/listP.length*100) : 0;
        sections.push(
          h("details",{class:"card", open: (!collapseSections || filterActive) ? true : null},
            h("summary",{class:"row-between"},
              h("div",{class:"h3"}, p),
              h("div",{class:"small muted"}, `${doneP}/${listP.length} (${pctP}%)`)
            ),
            ...groups.map(pg=>{
              const items = byPG.get(pg);
              // progress
              const donePg = items.filter(c=> answered(responses[c.id])).length;
              const pctPg = items.length ? Math.round(donePg/items.length*100) : 0;
              return h("div",{class:"card", style:"margin-top:10px; padding:10px"},
                h("div",{class:"row-between"},
                  h("div",{class:"h3"}, pg),
                  h("div",{class:"small muted"}, `${donePg}/${items.length} (${pctPg}%)`)
                ),
                h("div",{class:"bar", style:"margin-top:8px"}, h("div",{style:`width:${pctPg}%`})),
                h("div",{class:"list", style:"margin-top:10px"}, ...items.map(criterionRow))
              );
            })
          )
        );
      }
      listWrap.replaceChildren(...sections);
    }
  }

  const progressByFacility = computeProgress(criteria, responses, c=> c.facility || "—");
  const progressByPillar = computeProgress(criteria, responses, c=> c.pillar || "—");

  const listWrap = h("div",{class:"grid", style:"gap:12px"});

  searchInput.addEventListener("input", renderList);
  modeSel.addEventListener("change", renderList);

  const right = h("div",{class:"row"},
    h("button",{onclick: ()=>go("#/")}, t("home")),
    exportBtn,
    delBtn,
    goReportBtn
  );

  const root = h("div",{},
    topBar({
      title: `${row.meta.siteName} — Audit`,
      subtitle: `${t("auditorLabel")}: ${row.meta.auditorName} • ${t("facilities")}: ${(auditedFacilities && auditedFacilities.length) ? auditedFacilities.join(", ") : t("all")} • ${t("completion")}: ${done}/${total} (${pct}%)`,
      right
    }),
    h("div",{class:"wrap grid grid-2"},
      h("div",{class:"grid", style:"gap:12px"},
        h("div",{class:"card"},
          h("div",{class:"row-between"},
            h("div",{class:"h2"}, t("nav")),
            h("div",{class:"pill"}, allComplete ? t("done100") : t("toComplete"))
          ),
          h("div",{class:"row", style:"margin-top:10px"},
            h("div",{style:"min-width:260px; flex:1"}, modeSel),
            h("div",{style:"min-width:260px; flex:2"}, searchInput),
          ),
          h("div",{class:"row", style:"margin-top:12px; align-items:flex-start"},
            h("div",{style:"flex:2; min-width:260px"},
              h("div",{class:"small muted", style:"font-weight:800; margin-bottom:6px"}, t("facilities")),
              facilityTabs
            ),
            h("div",{style:"flex:2; min-width:260px"},
              h("div",{class:"small muted", style:"font-weight:800; margin-bottom:6px"}, t("pillar")),
              pillarSel
            ),
            h("div",{style:"flex:1; min-width:220px"},
              h("div",{class:"small muted", style:"font-weight:800; margin-bottom:6px"}, t("status")),
              statusSel
            ),
            h("div",{style:"display:flex; flex-direction:column; gap:10px; min-width:220px"},
              h("label",{class:"small row", style:"align-items:center; gap:8px"},
                collapseChk,
                h("span",{style:"font-weight:800"}, t("reduceSections"))
              ),
              resetFiltersBtn
            )
          ),
          h("div",{class:"bar", style:"margin-top:10px"}, h("div",{style:`width:${pct}%`})),
          h("div",{class:"small muted", style:"margin-top:6px"}, allComplete ? t("reportUnlocked") : t("reportLocked"))
        ),
        listWrap
      ),
      h("div",{class:"grid", style:"gap:12px"},
        makeProgressCard(LANG==="en"?"Completion by facility":"Complétion par Facilities", progressByFacility),
        makeProgressCard(LANG==="en"?"Completion by pillar":"Complétion par Pilier", progressByPillar),
        h("div",{class:"card"},
          h("div",{class:"row-between"},
            h("div",{class:"h3"}, t("remaining")),
            h("div",{class:"small muted"}, `${criteria.filter(c=>!answered(responses[c.id])).length} ${(LANG==="en")?"criterion":"critère"}(s)`) 
          ),
          h("div",{class:"list", style:"max-height:360px; overflow:auto; margin-top:10px"},
            ...(missing.length ? missing.map(c=>h("div",{class:"item row-between"},
              h("div",{class:"small"}, `${c.id} — ${c.title}`),
              h("button",{onclick: ()=> openCriterion(c.id)}, t("open"))
            )) : [h("div",{class:"small muted", style:"padding-top:10px"}, t("nothingToDo"))])
          )
        )
      )
    )
  );

  setRoot(root);
  renderList();
}

async function viewCriterion(auditId, criterionId){
  const dbData = await loadCriteriaDB();
  const row = await dbGetAudit(auditId);
  if (!row) return go("#/");

  const c = dbData.criteria.find(x=> x.id === criterionId);
  if (!c) return alert(t("criterionNotFound"));

  const responses = row.responses || {};
  const r0 = responses[criterionId] || null;

  // Navigation (prev/next in the CURRENT filtered order, if available)
  let ids = dbData.criteria.map(x=>x.id);
  const nav = loadNavContext(auditId);
  if (nav && Array.isArray(nav.orderedIds) && nav.orderedIds.length){
    if (nav.orderedIds.includes(criterionId)) ids = nav.orderedIds;
  }
  const idx = ids.indexOf(criterionId);
  const prevId = idx > 0 ? ids[idx-1] : null;
  const nextId = (idx >= 0 && idx < ids.length-1) ? ids[idx+1] : null;

  // --- Inputs ---
  let scoreValue = null; // number 0..5 or null
  const naChk = h("input",{type:"checkbox"});
  const naReason = h("textarea",{placeholder: t("naReasonPh")});
  const comments = h("textarea",{placeholder: t("commentsPh")});
  const gap = h("textarea",{placeholder: t("gapPh")});
  const action = h("textarea",{placeholder: t("actionPh")});
  const evidenceRef = h("input",{placeholder: t("evidencePh")});
  const docId = h("input",{placeholder: t("docIdPh")});

  const levelPill = h("span",{class:"pill"}, t("notSet"));

  // Score chips (better on Android)
  const scoreChips = h("div",{class:"scoreChips"});
  const chipBtns = [];
  function setScore(v){
    scoreValue = (v === null || v === undefined) ? null : Number(v);
    chipBtns.forEach((b, i)=>{
      b.classList.toggle("active", scoreValue === i);
    });
    updateLevelPill();
  }
  for (let s=0; s<=5; s++){
    const b = h("button",{class:"chip", type:"button", onclick: ()=> {
      if (naChk.checked) return;
      setScore(s);
    }}, String(s));
    chipBtns.push(b);
    scoreChips.appendChild(b);
  }

  function currentResp(){
    const na = !!naChk.checked;
    const score = na ? null : scoreValue;
    const naReasonVal = naReason.value.trim();
    const ncLevel = na ? "" : (score === null ? "" : ncLevelFromScore(score));
    return {
      na,
      score,
      naReason: naReasonVal,
      comments: comments.value.trim(),
      gapObserved: gap.value.trim(),
      action: action.value.trim(),
      evidenceRef: evidenceRef.value.trim(),
      docId: docId.value.trim(),
      ncLevel,
      photos: (responses[criterionId]?.photos || []),
      updatedAtISO: new Date().toISOString()
    };
  }

  function updateLevelPill(){
    const x = currentResp();
    if (x.na){
      levelPill.className = "pill";
      levelPill.textContent = t("na");
      return;
    }
    if (scoreValue === null){
      levelPill.className = "pill";
      levelPill.textContent = t("notSet");
      return;
    }
    const lvl = ncLevelFromScore(scoreValue);
    levelPill.className = tagClass(lvl);
    levelPill.textContent = lvl;
  }

  function validate(){
    const x = currentResp();
    const okAnswered = x.na || (x.score !== null);
    if (!okAnswered) return {ok:false, msg: t("needScoreOrNA")};
    if (x.na && !x.naReason) return {ok:false, msg: t("naRequiresReason")};

    // if NC, strongly require gap + action
    if (x.ncLevel && x.ncLevel !== "OK"){
      if (!x.gapObserved || x.gapObserved.length < 8) return {ok:false, msg: t("ncGapRequired")};
      if (!x.action || x.action.length < 8) return {ok:false, msg: t("ncActionRequired")};
    }
    return {ok:true, msg:"OK"};
  }

  async function onSave(){
    const v = validate();
    if (!v.ok) return alert(v.msg);

    const r = currentResp();
    const next = {...row};
    next.responses = next.responses || {};
    next.responses[criterionId] = {
      ...r,
      facility: c.facility,
      pillar: c.pillar,
      parentGroup: c.parentGroup,
      weight: c.weight
    };
    next.updatedAtISO = new Date().toISOString();
    await dbPutAudit(next);
    showToast(t("toastSaved"));
    // Auto-advance within the same filtered order
    if (nextId) return go(`#/criterion/${auditId}/${encodeURIComponent(nextId)}`);
    return go(`#/audit/${auditId}`);
  }

  // N/A toggling
  naChk.addEventListener("change", ()=>{
    const isNa = naChk.checked;
    naReason.disabled = !isNa ? true : false;
    chipBtns.forEach(b=> b.disabled = isNa);
    if (isNa) setScore(null);
    updateLevelPill();
  });

  // Photo capture (Android: input capture uses camera app)
  const photoInput = h("input",{type:"file", accept:"image/*", capture:"environment"});
  const photosWrap = h("div",{class:"photoGrid"});
  function computeNextPhotoId(){
    const seq = row.photoSeq || 1;
    return `P-${String(seq).padStart(5,"0")}`;
  }

  async function renderPhotos(){
    photosWrap.innerHTML = "";
    const ph = (responses[criterionId]?.photos || []);
    if (!ph.length){
      photosWrap.appendChild(h("div",{class:"small muted"}, t("noPhotos")));
      return;
    }
    for (const p of ph){
      photosWrap.appendChild(
        h("div",{class:"thumb"},
          h("img",{src:(p.url || p.dataUrl), alt:p.photoId}),
          h("div",{class:"cap"},
            h("div",{style:"font-weight:800"}, `${p.photoId} • ${formatEU(new Date(p.takenAtISO))}`),
            h("div",{class:"muted"}, `${p.facility} • ${p.criterionId}`)
          )
        )
      );
    }
  }

  photoInput.addEventListener("change", async ()=>{
    const f = photoInput.files && photoInput.files[0];
    if (!f) return;
    const now = new Date();
    const photoId = computeNextPhotoId();
    row.photoSeq = (row.photoSeq || 1) + 1;

    const blob = f.slice(0, f.size, f.type || "image/jpeg");
    const lines = [
      formatEU(now),
      `${c.facility} • ${c.id}`.slice(0, 80),
      `Photo_ID: ${photoId}`
    ];
    const dataUrl = await watermarkDataUrl(blob, lines);

    let photoUrl = null;
    if (ONLINE_ENABLED){
      try{ photoUrl = await sbUploadPhoto(auditId, c.id, photoId, dataUrl); }catch(e){ photoUrl = null; }
    }

    const next = {...row};
    next.responses = next.responses || {};
    const cur = next.responses[criterionId] || { photos: [] };
    const photos = (cur.photos || []);
    photos.push({
      photoId,
      criterionId: c.id,
      facility: c.facility,
      takenAtISO: now.toISOString(),
      ...(photoUrl ? { url: photoUrl } : { dataUrl })
    });
    next.responses[criterionId] = {...cur, photos};
    next.updatedAtISO = new Date().toISOString();
    await dbPutAudit(next);

    // refresh local snapshot
    responses[criterionId] = next.responses[criterionId];
    renderPhotos();
    photoInput.value = "";
  });

  // restore existing
  if (r0){
    naChk.checked = !!r0.na;
    scoreValue = (r0.score === null || r0.score === undefined) ? null : Number(r0.score);
    if (scoreValue !== null) chipBtns[scoreValue]?.classList.add("active");
    naReason.value = r0.naReason || "";
    comments.value = r0.comments || "";
    gap.value = r0.gapObserved || "";
    action.value = r0.action || "";
    evidenceRef.value = r0.evidenceRef || "";
    docId.value = r0.docId || "";
  }
  // apply NA state visuals
  naReason.disabled = !naChk.checked;
  chipBtns.forEach(b=> b.disabled = naChk.checked);
  if (naChk.checked) setScore(null); else updateLevelPill();

  // --- Cards ---
  const headerCard = h("div",{class:"card"},
    h("div",{class:"cardHeader"},
      h("div",{},
        h("div",{class:"h2"}, `${c.id} — ${c.title}`),
        h("div",{class:"small muted"}, `${c.facility} • ${c.pillar} • ${c.parentGroup}`),
        c.description ? h("div",{class:"small", style:"margin-top:10px; white-space:pre-wrap"}, c.description) : null
      ),
      levelPill
    )
  );

  function block(label, value){
    if (!value) return null;
    return h("div",{class:"details"},
      h("div",{class:"small muted", style:"font-weight:800; margin-bottom:6px"}, label),
      h("div",{class:"small", style:"white-space:pre-wrap"}, value)
    );
  }

  const checkCard = h("div",{class:"card card--soft"},
    h("div",{class:"h3"}, t("checklistTitle")),
    h("div",{class:"small muted", style:"margin-top:6px"}, t("checklistHint")),
    h("div",{class:"grid", style:"margin-top:12px"},
      c.evidenceRequired ? h("details",{class:"details", open:true},
        h("summary",{}, LANG==="en" ? "Expected evidence" : "Preuves attendues"),
        h("div",{class:"small", style:"white-space:pre-wrap; margin-top:10px"}, c.evidenceRequired)
      ) : null,
      c.method ? h("details",{class:"details"},
        h("summary",{}, LANG==="en" ? "Evaluation method" : "Méthodologie / méthode d'évaluation"),
        h("div",{class:"small", style:"white-space:pre-wrap; margin-top:10px"}, c.method)
      ) : null,
      (c.measurement || c.unit || c.threshold) ? h("div",{class:"details"},
        h("div",{class:"small muted", style:"font-weight:800; margin-bottom:6px"}, LANG==="en" ? "Measure / threshold" : "Mesure / seuil"),
        h("div",{class:"small"},
          `${c.measurement ? c.measurement : "—"}${c.unit ? " ("+c.unit+")" : ""}${c.threshold ? " • Threshold: "+c.threshold : ""}`
        )
      ) : null,
      c.frequency ? block(LANG==="en"?"Frequency":"Fréquence", c.frequency) : null,
      c.owner ? block(LANG==="en"?"Owner":"Owner / responsable", c.owner) : null,
      c.externalRequirement ? h("details",{class:"details"},
        h("summary",{}, LANG==="en" ? "External requirements" : "Exigences externes / compliance"),
        h("div",{class:"small", style:"white-space:pre-wrap; margin-top:10px"}, c.externalRequirement)
      ) : null,
      c.crosswalk ? h("details",{class:"details"},
        h("summary",{}, LANG==="en" ? "Related standards" : "Crosswalk / référentiels associés"),
        h("div",{class:"small", style:"white-space:pre-wrap; margin-top:10px"}, c.crosswalk)
      ) : null
    )
  );

  const guide = h("details",{class:"card"},
    h("summary",{}, t("scoringGuideTitle")),
    h("div",{class:"list", style:"margin-top:10px"},
      ...SCORING_GUIDE[LANG].map(g => h("div",{class:"item small"}, h("span",{class:"kbd"}, String(g.score)), " ", g.label))
    ),
    h("div",{class:"small muted", style:"margin-top:10px"},
      LANG==="en"
        ? "Auto NC: 0–1 → Major • 2 → Minor • 3 → Observation • 4–5 → OK. (If N/A: no NC.)"
        : "NC auto: 0–1 → Major • 2 → Minor • 3 → Observation • 4–5 → OK. (Si N/A, pas de NC.)"
    )
  );

  const evaluationCard = h("div",{class:"card"},
    h("div",{class:"h3"}, t("evalMandatory")),
    h("div",{class:"grid", style:"margin-top:12px; gap:12px"},
      h("div",{class:"row-between"},
        h("div",{}, h("div",{class:"small muted", style:"font-weight:800"}, t("score")), h("div",{class:"small muted"}, LANG==="en" ? "Tap a number" : "Tape un chiffre")),
        scoreChips
      ),
      h("label",{class:"small row", style:"align-items:center; gap:10px; margin-top:4px"},
        naChk, h("span",{style:"font-weight:800"}, t("na")), h("span",{class:"muted"}, t("naHint"))
      ),
      h("div",{}, h("div",{class:"small muted", style:"font-weight:800"}, t("naJustif")), naReason),
      h("div",{}, h("div",{class:"small muted", style:"font-weight:800"}, t("comments")), comments),
      h("div",{}, h("div",{class:"small muted", style:"font-weight:800"}, t("gapObserved")), gap),
      h("div",{}, h("div",{class:"small muted", style:"font-weight:800"}, t("corrective")), action),
      h("div",{class:"row", style:"gap:10px"},
        h("div",{style:"flex:1; min-width:240px"}, h("div",{class:"small muted", style:"font-weight:800"}, t("evidenceRef")), evidenceRef),
        h("div",{style:"flex:1; min-width:240px"}, h("div",{class:"small muted", style:"font-weight:800"}, t("docId")), docId)
      )
    )
  );

  const photoCard = h("div",{class:"card"},
    h("div",{class:"h3"}, t("photos")),
    h("div",{class:"small muted", style:"margin-top:6px"}, t("photosHint")),
    h("div",{class:"row", style:"margin-top:12px"},
      photoInput
    ),
    h("div",{style:"margin-top:12px"}, photosWrap)
  );
  renderPhotos();

  const backBtn = h("button",{onclick: ()=> go(`#/audit/${auditId}`)}, t("back"));
  const saveBtn = h("button",{class:"primary", onclick: onSave}, t("saveNext"));

  const prevBtn = h("button",{onclick: ()=> prevId ? go(`#/criterion/${auditId}/${encodeURIComponent(prevId)}`) : null, disabled: !prevId}, t("prev"));
  const nextBtn = h("button",{onclick: ()=> nextId ? go(`#/criterion/${auditId}/${encodeURIComponent(nextId)}`) : null, disabled: !nextId}, t("next"));

  const actions = h("div",{class:"sticky-actions wrap"},
    h("div",{class:"card row-between"},
      h("div",{class:"small muted"}, t("tipBackup")),
      h("div",{class:"row"},
        prevBtn,
        nextBtn,
        backBtn,
        saveBtn
      )
    )
  );

  const root = h("div",{},
    topBar({
      title: `${c.id} — ${LANG==="en"?"Audit":"Audit"}`,
      subtitle: `${row.meta.siteName} • ${row.meta.auditorName}`,
      right: h("div",{class:"row"},
        h("button",{onclick:()=>go(`#/audit/${auditId}`)}, t("viewAudit"))
      )
    }),
    h("div",{class:"wrap grid", style:"gap:14px"},
      headerCard,
      checkCard,
      guide,
      evaluationCard,
      photoCard
    ),
    actions
  );

  setRoot(root);
}

function renderBars(container, items){
  container.innerHTML = "";
  for (const it of items){
    container.appendChild(
      h("div",{class:"card", style:"padding:10px"},
        h("div",{class:"row-between"},
          h("div",{class:"small", style:"font-weight:700"}, it.label),
          h("div",{class:"small muted"}, `${it.pct.toFixed(2)}%`)
        ),
        h("div",{class:"bar", style:"margin-top:8px"}, h("div",{style:`width:${Math.max(0,Math.min(100,it.pct))}%`})),
        it.sub ? h("div",{class:"small muted", style:"margin-top:6px"}, it.sub) : null
      )
    );
  }
}

async function viewReport(auditId){
  const dbData = await loadCriteriaDB();
  const row = await dbGetAudit(auditId);
  if (!row) return go("#/");

  const allCriteria = dbData.criteria;
  const auditedFacilities = (row.meta && Array.isArray(row.meta.facilitiesAudited) && row.meta.facilitiesAudited.length)
    ? row.meta.facilitiesAudited
    : (dbData.facilities || []);

  const criteria = (auditedFacilities && auditedFacilities.length)
    ? allCriteria.filter(c=> auditedFacilities.includes(c.facility || ""))
    : allCriteria;

  const responses = row.responses || {};
  const missingCount = criteria.filter(c=> !answered(responses[c.id])).length;

  if (missingCount > 0){
    const missingMsg = (LANG === "en")
      ? `${missingCount} criterion(s) remaining to complete.`
      : `Il manque ${missingCount} critère(s) à compléter.`;

    return setRoot(h("div",{},
      topBar({
        title: t("lockedTitle"),
        subtitle: missingMsg,
        right: h("button",{onclick:()=>go(`#/audit/${auditId}`)}, t("back"))
      }),
      h("div",{class:"wrap"},
        h("div",{class:"card"},
          h("div",{class:"h2"}, t("lockedAction")),
          h("div",{class:"small", style:"margin-top:8px"}, t("lockedExplain")),
          h("div",{class:"row", style:"margin-top:12px"},
            h("button",{class:"primary", onclick:()=>go(`#/audit/${auditId}`)}, t("backToAudit"))
          )
        )
      )
    ));
  }

  // compute scores
  const overall = computeWeightedScore(criteria, responses);

  const byPillar = Array.from(groupBy(criteria, c=> c.pillar || "—").entries())
    .map(([k])=>{
      const s = computeWeightedScore(criteria, responses, c=> c.pillar===k);
      return { label: k, pct: s.pct, sub: `ΣW=${Math.round(s.sumW)} • ΣPts=${Math.round(s.sumPts)}` };
    })
    .sort((a,b)=> b.pct - a.pct);

  const byFacility = Array.from(groupBy(criteria, c=> c.facility || "—").entries())
    .map(([k])=>{
      const s = computeWeightedScore(criteria, responses, c=> c.facility===k);
      return { label: k, pct: s.pct, sub: `ΣW=${Math.round(s.sumW)} • ΣPts=${Math.round(s.sumPts)}` };
    })
    .sort((a,b)=> b.pct - a.pct);

  // NC register
  const ncItems = [];
  for (const c of criteria){
    const r = responses[c.id];
    if (!r || r.na) continue;
    if (r.score === null || r.score === undefined) continue;
    const lvl = ncLevelFromScore(r.score);
    if (lvl === "OK") continue;
    ncItems.push({ c, r, lvl });
  }

  const exportHTMLBtn = h("button",{onclick: ()=>{
    const html = buildReportHTML(row, dbData, LANG, overall, byPillar, byFacility, ncItems, criteria.length, auditedFacilities);
    const fn = `M3_Report_${(row.meta.siteName||"site").replaceAll(" ","_")}.html`;
    downloadText(fn, html, "text/html");
  }}, t("exportHtml"));

  const shareBtn = (!ONLINE_ENABLED) ? null : h("button",{onclick: async ()=>{
    try{
      const res = await sbCreateReportLink(auditId);
      const url = res.url;
      const exp = new Date(res.expiresAtISO);
      try{ await navigator.clipboard.writeText(url); }catch(e){}
      prompt(t("shareLinkPrompt").replace('{date}', formatEU(exp)), url);
      showToast(t("linkCopied"));
    }catch(e){
      alert((e && e.message) ? e.message : String(e));
    }
  }}, t("shareReport"));


  const printBtn = h("button",{onclick: ()=> window.print()}, t("printPdf"));
  const backBtn = h("button",{onclick: ()=> go(`#/audit/${auditId}`)}, t("back"));
  
const exportJsonBtn = h("button",{onclick: ()=> downloadText(`${t("exportFilenameBase")}_${(row.meta.siteName||"site").replaceAll(" ","_")}.json`, JSON.stringify(row,null,2), "application/json")}, t("exportAuditProject"));

const exportExcelBtn = h("button",{onclick: ()=>{
  if (missingCount > 0){
    showToast(t("auditNotValidated"));
    return;
  }
  const exp = buildAuditExportRows(criteria, responses, row.meta);
  const xls = toExcelXml(exp.headers, exp.rows, "Audit");
  const site = (row.meta.siteName||"site").replaceAll(" ","_");
  downloadText(`M3_Audit_${site}.xls`, xls, "application/vnd.ms-excel");
}}, t("exportExcel"));

  const pillarWrap = h("div",{class:"grid", style:"gap:10px"});
  const facilityWrap = h("div",{class:"grid", style:"gap:10px"});
  renderBars(pillarWrap, byPillar);
  renderBars(facilityWrap, byFacility);

  const ncWrap = h("div",{class:"list"});
  if (!ncItems.length){
    ncWrap.appendChild(h("div",{class:"small muted", style:"padding-top:10px"}, t("noNC")));
  } else {
    for (const it of ncItems){
      const photos = (it.r.photos||[]).map(p=> p.photoId).join(", ") || "—";
      ncWrap.appendChild(
        h("div",{class:"item"},
          h("div",{class:"row-between"},
            h("div",{class:"h3"}, `${it.c.id} — ${it.c.title}`),
            h("span",{class: tagClass(it.lvl)}, it.lvl)
          ),
          h("div",{class:"small muted"}, `${it.c.facility} • ${it.c.pillar} • ${it.c.parentGroup}`),
          h("div",{class:"small", style:"margin-top:8px; white-space:pre-wrap"}, it.r.gapObserved || ""),
          h("div",{class:"small", style:"margin-top:8px; white-space:pre-wrap"}, it.r.action ? ((LANG==="en"?"Action: ":"Action : ")+it.r.action) : ""),
          h("div",{class:"small muted", style:"margin-top:6px"}, `${LANG==="en"?"Photos":"Photos"}: ${photos}`)
        )
      );
    }
  }

  const root = h("div",{},
    topBar({
      title: `${t("reportTitle")} — ${row.meta.siteName}`,
      subtitle: `${t("auditorLabel")}: ${row.meta.auditorName} • ${t("facilities")}: ${(auditedFacilities && auditedFacilities.length) ? auditedFacilities.join(", ") : t("all")} • ${t("overallWeightedScore")}: ${overall.pct.toFixed(2)}%`,
      right: h("div",{class:"row"}, backBtn, exportJsonBtn, exportExcelBtn, exportHTMLBtn, shareBtn, printBtn)
    }),
    h("div",{class:"wrap grid", style:"gap:12px"},
      h("div",{class:"card"},
        h("div",{class:"h2"}, t("reportSummary")),
        h("div",{class:"row", style:"margin-top:10px"},
          h("span",{class:"pill"}, `${t("criteriaLabel")}: ${criteria.length}`),
          h("span",{class:"pill"}, `${t("ncLabel")}: ${ncItems.length}`),
          h("span",{class:"pill"}, `ΣW: ${Math.round(overall.sumW)}`),
          h("span",{class:"pill"}, `${t("scoreLabel")}: ${overall.pct.toFixed(2)}%`)
        ),
        h("div",{class:"small muted", style:"margin-top:10px"}, t("scoreDefinition"))
      ),
      h("div",{class:"card"},
        h("div",{class:"h2"}, t("reportScoresPillar")),
        h("div",{style:"margin-top:10px"}, pillarWrap)
      ),
      h("div",{class:"card"},
        h("div",{class:"h2"}, t("reportScoresFacilities")),
        h("div",{style:"margin-top:10px"}, facilityWrap)
      ),
      h("div",{class:"card"},
        h("div",{class:"h2"}, t("reportNC")),
        h("div",{style:"margin-top:10px"}, ncWrap)
      ),
      h("div",{class:"small muted"}, t("pdfTip"))
    )
  );

  setRoot(root);
}




async function viewPublicReport(token){
  const dbData = await loadCriteriaDB();
  let audit = null;
  try{
    audit = await sbGetPublicReport(token);
  }catch(e){
    audit = null;
  }

  if (!audit){
    const root = h('div',{},
      topBar({title: t('publicReportTitle'), subtitle: t('publicReportInvalidSubtitle'), right: h('div',{class:'row'}, h('a',{class:'btn', href:'#/login'}, t('signIn')) )}),
      h('div',{class:'wrap'}, h('div',{class:'card'},
        h('div',{class:'h2'}, t('publicReportInvalidTitle')),
        h('div',{class:'small', style:'margin-top:8px'}, t('publicReportInvalidBody'))
      ))
    );
    return setRoot(root);
  }

  const allCriteria = dbData.criteria;
  const auditedFacilities = (audit.meta && Array.isArray(audit.meta.facilitiesAudited) && audit.meta.facilitiesAudited.length) ? audit.meta.facilitiesAudited : (dbData.facilities || []);
  const criteria = (auditedFacilities && auditedFacilities.length) ? allCriteria.filter(c=> auditedFacilities.includes(c.facility || "")) : allCriteria;
  const responses = audit.responses || {};

  const overall = computeWeightedScore(criteria, responses);
  const byPillar = Array.from(groupBy(criteria, c=> c.pillar || "—").entries())
    .map(([k])=>{
      const s = computeWeightedScore(criteria, responses, c=> c.pillar===k);
      return { label: k, pct: s.pct, sub: `ΣW=${Math.round(s.sumW)} • ΣPts=${Math.round(s.sumPts)}` };
    })
    .sort((a,b)=> b.pct - a.pct);

  const byFacility = Array.from(groupBy(criteria, c=> c.facility || "—").entries())
    .map(([k])=>{
      const s = computeWeightedScore(criteria, responses, c=> c.facility===k);
      return { label: k, pct: s.pct, sub: `ΣW=${Math.round(s.sumW)} • ΣPts=${Math.round(s.sumPts)}` };
    })
    .sort((a,b)=> b.pct - a.pct);

  const ncItems = [];
  for (const c of criteria){
    const r = responses[c.id];
    if (!r || r.na) continue;
    if (r.score === null || r.score === undefined) continue;
    const lvl = ncLevelFromScore(r.score);
    if (lvl === "OK") continue;
    ncItems.push({ c, r, lvl });
  }

  const pillarWrap = h('div',{class:'grid', style:'gap:10px'});
  const facilityWrap = h('div',{class:'grid', style:'gap:10px'});
  renderBars(pillarWrap, byPillar);
  renderBars(facilityWrap, byFacility);

  const ncWrap = h('div',{class:'list'});
  if (!ncItems.length){
    ncWrap.appendChild(h('div',{class:'small muted', style:'padding-top:10px'}, t('noNC')));
  } else {
    for (const it of ncItems){
      const photos = (it.r.photos||[]).map(p=> p.photoId).join(", ") || "—";
      ncWrap.appendChild(
        h('div',{class:'item'},
          h('div',{class:'row-between'},
            h('div',{class:'h3'}, `${it.c.id} — ${it.c.title}`),
            h('span',{class: tagClass(it.lvl)}, it.lvl)
          ),
          h('div',{class:'small muted'}, `${it.c.facility} • ${it.c.pillar} • ${it.c.parentGroup}`),
          h('div',{class:'small', style:'margin-top:8px; white-space:pre-wrap'}, it.r.gapObserved || ""),
          h('div',{class:'small', style:'margin-top:8px; white-space:pre-wrap'}, it.r.action ? ((LANG==="en"?"Action: ":"Action : ")+it.r.action) : ""),
          h('div',{class:'small muted', style:'margin-top:6px'}, `${LANG==="en"?"Photos":"Photos"}: ${photos}`)
        )
      );
    }
  }

  const exportHTMLBtn = h('button',{onclick: ()=>{
    const html = buildReportHTML(audit, dbData, LANG, overall, byPillar, byFacility, ncItems, criteria.length, auditedFacilities);
    const fn = `M3_Report_${(audit.meta?.siteName||"site").replaceAll(" ","_")}.html`;
    downloadText(fn, html, 'text/html');
  }}, t('exportHtml'));

  const printBtn = h('button',{onclick: ()=> window.print()}, t('printPdf'));

  const root = h('div',{},
    topBar({
      title: `${t('reportTitle')} — ${(audit.meta?.siteName||'')}`,
      subtitle: `${t('facilities')}: ${(auditedFacilities && auditedFacilities.length) ? auditedFacilities.join(', ') : t('all')} • ${t('overallWeightedScore')}: ${overall.pct.toFixed(2)}%`,
      right: h('div',{class:'row'}, exportHTMLBtn, printBtn)
    }),
    h('div',{class:'wrap grid', style:'gap:12px'},
      h('div',{class:'card'},
        h('div',{class:'h2'}, t('reportSummary')),
        h('div',{class:'row', style:'margin-top:10px'},
          h('span',{class:'pill'}, `${t('criteriaLabel')}: ${criteria.length}`),
          h('span',{class:'pill'}, `${t('ncLabel')}: ${ncItems.length}`),
          h('span',{class:'pill'}, `ΣW: ${Math.round(overall.sumW)}`),
          h('span',{class:'pill'}, `${t('scoreLabel')}: ${overall.pct.toFixed(2)}%`)
        )
      ),
      h('div',{class:'card'}, h('div',{class:'h2'}, t('reportScoresPillar')), h('div',{style:'margin-top:10px'}, pillarWrap)),
      h('div',{class:'card'}, h('div',{class:'h2'}, t('reportScoresFacilities')), h('div',{style:'margin-top:10px'}, facilityWrap)),
      h('div',{class:'card'}, h('div',{class:'h2'}, t('reportNC')), h('div',{style:'margin-top:10px'}, ncWrap)),
      h('div',{class:'small muted'}, t('pdfTip'))
    )
  );

  setRoot(root);
}

function esc(s){
  return String(s||"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
}

function buildReportHTML(audit, dbData, lang, overall, byPillar, byFacility, ncItems, criteriaCount, auditedFacilities){
  const L = (lang === "en") ? "en" : "fr";
  const dict = I18N[L] || I18N.fr;
  const lt = (k)=> (dict && dict[k]) ? dict[k] : (I18N.fr[k] || k);

  const created = audit.meta?.createdAtISO ? new Date(audit.meta.createdAtISO).toLocaleString() : "";
  const updated = audit.updatedAtISO ? new Date(audit.updatedAtISO).toLocaleString() : "";

  const css = `
    body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;margin:24px;color:#111}
    h1{margin:0 0 6px 0}
    h2{margin:0 0 8px 0}
    .muted{color:#666;font-size:12px}
    .pill{display:inline-block;border:1px solid #e5e5e5;border-radius:999px;padding:3px 8px;font-size:12px;margin-right:6px;margin-top:6px}
    .section{margin-top:18px}
    .bar{height:10px;background:#eee;border-radius:999px;overflow:hidden}
    .bar>div{height:10px;background:#111}
    .row{display:flex;justify-content:space-between;gap:12px;align-items:center}
    .card{border:1px solid #e5e5e5;border-radius:12px;padding:12px;margin-top:10px}
    @media print{a{color:#111;text-decoration:none}}
    img{max-width:100%;height:auto;border:1px solid #e5e5e5;border-radius:10px}
  `;

  const scoreBlock = (title, items) => `
    <div class="section">
      <h2>${esc(title)}</h2>
      ${items.map(it => `
        <div class="card">
          <div class="row">
            <div><b>${esc(it.label)}</b></div>
            <div class="muted">${it.pct.toFixed(2)}%</div>
          </div>
          <div class="bar" style="margin-top:8px"><div style="width:${Math.max(0,Math.min(100,it.pct))}%"></div></div>
          ${it.sub ? `<div class="muted" style="margin-top:6px">${esc(it.sub)}</div>` : ``}
        </div>
      `).join("")}
    </div>
  `;

  const ncHtml = ncItems.length ? ncItems.map(it=>{
    const photos = (it.r.photos||[]);
    const photoIds = photos.map(p=>p.photoId).join(", ") || "—";
    const imgs = photos.slice(0,3).map(p=> `<div style="margin-top:8px"><div class="muted">${esc(p.photoId)} • ${esc(formatEU(new Date(p.takenAtISO)))}</div><img src="${esc(p.url || p.dataUrl)}"/></div>`).join("");
    return `
      <div class="card">
        <div class="row">
          <div><b>${esc(it.c.id)} — ${esc(it.c.title)}</b></div>
          <div class="pill">${esc(it.lvl)}</div>
        </div>
        <div class="muted">${esc(it.c.facility)} • ${esc(it.c.pillar)} • ${esc(it.c.parentGroup)}</div>
        <div style="margin-top:10px; white-space:pre-wrap">${esc(it.r.gapObserved||"")}</div>
        <div style="margin-top:8px; white-space:pre-wrap">${esc(it.r.action ? ((L==="en"?"Action: ":"Action : ")+it.r.action) : "")}</div>
        <div class="muted" style="margin-top:6px">${esc(L==="en"?"Photos":"Photos")}: ${esc(photoIds)}</div>
        ${imgs}
      </div>
    `;
  }).join("") : `<div class="card">${esc(lt("noNC"))}</div>`;

  return `<!doctype html>
<html lang="${esc(L)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(lt("appTitle"))} — ${esc(lt("reportTitle"))}</title><style>${css}</style></head>
<body>
  <h1>${esc(lt("reportTitle"))} — ${esc(audit.meta.siteName)}</h1>
  <div class="muted">${esc(lt("auditorLabel"))}: ${esc(audit.meta.auditorName)} • ${esc(lt("facilities"))}: ${esc((auditedFacilities && auditedFacilities.length) ? auditedFacilities.join(", ") : lt("all"))} • ${esc(L==="en"?"Created":"Créé")}: ${esc(created)} • ${esc(L==="en"?"Updated":"Mis à jour")}: ${esc(updated)}</div>

  <div class="section">
    <h2>${esc(lt("reportSummary"))}</h2>
    <div>
      <span class="pill">${esc(lt("criteriaLabel"))}: ${criteriaCount}</span>
      <span class="pill">${esc(lt("ncLabel"))}: ${ncItems.length}</span>
      <span class="pill">ΣW: ${Math.round(overall.sumW)}</span>
      <span class="pill">${esc(lt("scoreLabel"))}: ${overall.pct.toFixed(2)}%</span>
    </div>
    <div class="muted" style="margin-top:8px">${esc(lt("scoreDefinition"))}</div>
  </div>

  ${scoreBlock(lt("reportScoresPillar"), byPillar)}
  ${scoreBlock(lt("reportScoresFacilities"), byFacility)}

  <div class="section">
    <h2>${esc(lt("reportNC"))}</h2>
    ${ncHtml}
  </div>
</body></html>`;
}

async function route(){
  updateFooter();
  const parts = parseHash();

  // Public report links (no login)
  if (parts[0] === "public" && parts[1]){
    return viewPublicReport(parts[1]);
  }

  // Online mode: enforce login for everything else
  if (ONLINE_ENABLED){
    await refreshSession();
    if (!AUTH.session && !["login","forgot-password","update-password"].includes(parts[0])){
      return viewLogin();
    }
  }

  if (parts[0] === "login") return viewLogin();
  if (parts[0] === "forgot-password") return viewForgotPassword();
  if (parts[0] === "update-password") return viewUpdatePassword();
  if (parts.length === 0) return viewStart();
  if (parts[0] === "audit" && parts[1]) return viewAudit(parts[1]);
  if (parts[0] === "criterion" && parts[1] && parts[2]) return viewCriterion(parts[1], decodeURIComponent(parts[2]));
  if (parts[0] === "report" && parts[1]) return viewReport(parts[1]);
  return viewStart();
}

// boot
route().catch(err=>{
  console.error(err);
  setRoot(h("div",{},
    topBar({title: t("errorTitle"), subtitle:String(err?.message||err), right:h("button",{onclick:()=>go("#/")}, t("home"))}),
    h("div",{class:"wrap"}, h("div",{class:"card"}, h("pre",{style:"white-space:pre-wrap"}, String(err?.stack||err))))
  ));
});
