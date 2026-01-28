
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

admin: "Admin",
adminConsole: "Console admin",
adminAuditsTab: "Audits",
adminUsersTab: "Utilisateurs",
adminSearchPlaceholder: "Rechercher (site / auditeur / audit)…",
adminRefresh: "Rafraîchir",
adminForbidden: "Accès refusé (admin requis).",
adminUsersIntro: "Gestion des comptes (invitations, rôles, activation).",
adminInvite: "Inviter",
adminInviteEmail: "Email",
adminInviteRole: "Rôle",
adminInviteSendEmail: "Envoyer l’email d’invitation",
adminInviteLink: "Lien d’invitation",
adminCopy: "Copier",
adminDisable: "Désactiver",
adminEnable: "Réactiver",
adminSetRole: "Changer rôle",
adminActions: "Actions",
adminDownloadJson: "JSON",
adminDownloadExcel: "Excel",
adminPreviewReport: "Rapport",
adminShareLink: "Lien public",
adminVersionMismatch: "Version différente",
adminVersionMismatch: "Version différente",
portal: "Portail",
portalTitle: "Portail client",
portalSubtitle: "Rapports partagés avec vous",
portalNoShares: "Aucun audit partagé pour ce compte.",
portalOpenReport: "Ouvrir rapport",
portalDownloadExcel: "Télécharger Excel",
portalDownloadJson: "Télécharger JSON",
adminFilters: "Filtres avancés",
adminFilterFacility: "Facility",
adminFilterStatus: "Statut",
adminFilterDateFrom: "Date (du)",
adminFilterDateTo: "Date (au)",
adminFilterScoreMin: "Score min",
adminFilterScoreMax: "Score max",
adminFilterProgressMin: "Complétion min",
adminFilterProgressMax: "Complétion max",
adminFilterCriteriaVersion: "Version critères",
adminFilterOnlyMismatch: "Version ≠ active",
adminSelectAll: "Tout sélectionner",
adminClearSel: "Vider sélection",
adminExportSelectedJson: "Exporter JSON (sélection)",
adminExportFilteredJson: "Exporter JSON (filtré)",
adminExportSelectedExcel: "Exporter Excel (batch)",
adminBackfillMeta: "Recalcul méta",
adminShareToClient: "Partager au client",
adminShareSaved: "Accès partagé",
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

admin: "Admin",
adminConsole: "Admin console",
adminAuditsTab: "Audits",
adminUsersTab: "Users",
adminSearchPlaceholder: "Search (site / auditor / audit)…",
adminRefresh: "Refresh",
adminForbidden: "Forbidden (admin required).",
adminUsersIntro: "User management (invites, roles, enable/disable).",
adminInvite: "Invite",
adminInviteEmail: "Email",
adminInviteRole: "Role",
adminInviteSendEmail: "Send invite email",
adminInviteLink: "Invite link",
adminCopy: "Copy",
adminDisable: "Disable",
adminEnable: "Enable",
adminSetRole: "Change role",
adminActions: "Actions",
adminDownloadJson: "JSON",
adminDownloadExcel: "Excel",
adminPreviewReport: "Report",
adminShareLink: "Public link",
adminVersionMismatch: "Version mismatch",
adminVersionMismatch: "Different version",
portal: "Portal",
portalTitle: "Client portal",
portalSubtitle: "Reports shared with you",
portalNoShares: "No shared audits for this account.",
portalOpenReport: "Open report",
portalDownloadExcel: "Download Excel",
portalDownloadJson: "Download JSON",
adminFilters: "Advanced filters",
adminFilterFacility: "Facility",
adminFilterStatus: "Status",
adminFilterDateFrom: "Date (from)",
adminFilterDateTo: "Date (to)",
adminFilterScoreMin: "Min score",
adminFilterScoreMax: "Max score",
adminFilterProgressMin: "Min completion",
adminFilterProgressMax: "Max completion",
adminFilterCriteriaVersion: "Criteria version",
adminFilterOnlyMismatch: "Version ≠ active",
adminSelectAll: "Select all",
adminClearSel: "Clear selection",
adminExportSelectedJson: "Export JSON (selected)",
adminExportFilteredJson: "Export JSON (filtered)",
adminExportSelectedExcel: "Export Excel (batch)",
adminBackfillMeta: "Recompute meta",
adminShareToClient: "Share to client",
adminShareSaved: "Shared",
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
  const authBtn = ONLINE_ENABLED ? (
    AUTH.session
      ? h("button",{class:"btn", onclick: async()=>{ await signOut(); showToast(t("signedOut")); go("#/login"); }}, t("signOut"))
      : h("a",{class:"btn", href:"#/login"}, t("login"))
  ) : null;

  const adminBtn = (ONLINE_ENABLED && AUTH.session && AUTH.role === "admin")
    ? h("a",{class:"btn", href:"#/admin"}, t("admin"))
    : null;

  const actions = [];
  if (adminBtn) actions.push(adminBtn);
  if (right) actions.push(right);
  if (authBtn) actions.push(authBtn);

  return h("div",{class:"topbar"},
    h("div",{class:"brandRow"},
      h("img",{src:"./assets/logo.svg", class:"brandLogo", alt:"M3"}),
      h("div",{class:"brandText"},
        h("div",{class:"brandTitle"}, title || "M3 Audit Tool"),
        subtitle ? h("div",{class:"brandSub"}, subtitle) : null
      )
    ),
    h("div",{class:"topActions"}, ...actions)
  );
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

const ONLINE_ENABLED = !!(SUPABASE_URL && SUPABASE_ANON_KEY && typeof window !== 'undefined' && window.supabase && window.supabase.createClient);

let SB = null;
let AUTH = { session: null, user: null, role: null, roleLoadedAt: 0 };

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
    AUTH.role = null;
    AUTH.roleLoadedAt = 0;
    // If user signs out, bounce to login (unless on public report)
    const parts = parseHash();
    if (!session && parts[0] !== 'public'){
      if (parts[0] !== 'login') go('#/login');
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

async function ensureRoleLoaded(force=false){
  if (!ONLINE_ENABLED) return null;
  if (!AUTH.session?.user) { AUTH.role = null; AUTH.roleLoadedAt = 0; return null; }
  if (!force && AUTH.role && AUTH.roleLoadedAt && (Date.now() - AUTH.roleLoadedAt) < 60_000){
    return AUTH.role;
  }
  try{
    const sb = await initSupabase();
    const { data, error } = await sb
      .from('user_roles')
      .select('role')
      .eq('user_id', AUTH.session.user.id)
      .maybeSingle();
    if (error) throw error;
    AUTH.role = data?.role || 'auditor';
  }catch(_e){
    // If user_roles isn't installed yet, default to non-admin
    AUTH.role = AUTH.role || 'auditor';
  }
  AUTH.roleLoadedAt = Date.now();
  return AUTH.role;
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

  // Derive useful metadata for admin filters / portal (best-effort)
  let status = null;
  let progress_pct = null;
  let overall_score = null;
  let validated = null;
  let audit_date = null;
  try{
    const dbData = await loadCriteriaDB();
    const crit = (dbData?.criteria||[]).filter(c => !facilities.length || facilities.includes(c.facility));
    const prog = computeProgress(crit, audit.responses||{}, c=> 'all');
    progress_pct = prog?.[0]?.pct ?? 0;
    validated = progress_pct === 100;
    status = validated ? 'validated' : 'draft';
    overall_score = computeWeightedScore(crit, audit.responses||{}, null).pct;
    if (audit?.meta?.createdAtISO){
      const d = new Date(audit.meta.createdAtISO);
      audit_date = isNaN(d.getTime()) ? null : d.toISOString().slice(0,10);
    }
  }catch(e){ /* ignore */ }

  const payload = {
    user_id: user.id,
    audit_id: audit.auditId,
    site_name: audit.meta?.siteName || null,
    auditor_name: audit.meta?.auditorName || null,
    facilities,
    criteria_version: audit.criteriaVersion || audit.meta?.criteriaVersion || null,
    status,
    progress_pct,
    overall_score,
    validated,
    audit_date,
    data: audit
  };

  try{
    const { error } = await sb.from('v8_audits').upsert(payload, { onConflict: 'user_id,audit_id' });
    if (error) throw error;
  }catch(e){
    // If the DB schema hasn't been upgraded (portal.sql not run yet),
    // retry with a minimal payload that matches schema.sql.
    const msg = (e && e.message) ? e.message : String(e||'');
    if (/column .* does not exist/i.test(msg) && /(status|progress_pct|overall_score|validated|audit_date)/i.test(msg)){
      const minimal = {
        user_id: user.id,
        audit_id: audit.auditId,
        site_name: audit.meta?.siteName || null,
        auditor_name: audit.meta?.auditorName || null,
        facilities,
        criteria_version: audit.criteriaVersion || audit.meta?.criteriaVersion || null,
        data: audit
      };
      const { error: e2 } = await sb.from('v8_audits').upsert(minimal, { onConflict: 'user_id,audit_id' });
      if (e2) throw e2;
      // Keep going, but admin filters / portal features will be limited until portal.sql is applied.
    }else{
      throw e;
    }
  }
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

async function sbGetAuditByRowId(rowId){
  const sb = await initSupabase();
  if (!sb) throw new Error('Supabase non configuré');
  await sbRequireUser();
  const { data, error } = await sb
    .from('v8_audits')
    .select('data')
    .eq('id', rowId)
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

// ---- Admin API (Netlify Functions) ----
async function adminApi(action, payload){
  if (!ONLINE_ENABLED) throw new Error("Online mode only");
  const session = await refreshSession();
  if (!session?.access_token) throw new Error(t("mustLogin"));
  const res = await fetch(`/.netlify/functions/admin-users?action=${encodeURIComponent(action)}`, {
    method: payload ? "POST" : "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session.access_token}`
    },
    body: payload ? JSON.stringify(payload) : undefined
  });
  const txt = await res.text();
  let data;
  try{ data = txt ? JSON.parse(txt) : null; }catch(_e){ data = { raw: txt }; }
  if (!res.ok){
    const msg = (data && (data.error || data.message)) ? (data.error || data.message) : txt;
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return data;
}

// ---- Admin DB operations (Supabase, RLS-protected by is_admin()) ----

async function sbAdminListAudits(filters={}){
  const sb = await initSupabase();
  if (!sb) throw new Error('Supabase non configuré');
  await sbRequireUser();
  await ensureRoleLoaded();
  if (AUTH.role !== 'admin') throw new Error('Forbidden');

  const f = filters || {};
  let q = sb
    .from('v8_audits')
    .select('id, user_id, audit_id, site_name, auditor_name, facilities, criteria_version, status, progress_pct, overall_score, validated, audit_date, updated_at')
    .order('updated_at', { ascending: false })
    .limit(200);

  const term = (f.search || f.searchTerm || '').trim();
  if (term){
    // OR search over basic text columns
    const esc = term;
    q = q.or(`audit_id.ilike.%${esc}%,site_name.ilike.%${esc}%,auditor_name.ilike.%${esc}%`);
  }

  if (f.criteriaVersion){
    q = q.eq('criteria_version', f.criteriaVersion);
  }

  if (f.status && f.status !== 'all'){
    q = q.eq('status', f.status);
  }

  if (f.validated === true) q = q.eq('validated', true);
  if (f.validated === false) q = q.eq('validated', false);

  if (f.facility){
    const facs = Array.isArray(f.facility) ? f.facility : [f.facility];
    // overlaps any
    if (facs.filter(Boolean).length) q = q.overlaps('facilities', facs.filter(Boolean));
  }

  if (f.dateFrom){
    q = q.gte('audit_date', f.dateFrom);
  }
  if (f.dateTo){
    q = q.lte('audit_date', f.dateTo);
  }

  if (Number.isFinite(f.scoreMin)) q = q.gte('overall_score', f.scoreMin);
  if (Number.isFinite(f.scoreMax)) q = q.lte('overall_score', f.scoreMax);
  if (Number.isFinite(f.progressMin)) q = q.gte('progress_pct', f.progressMin);
  if (Number.isFinite(f.progressMax)) q = q.lte('progress_pct', f.progressMax);

  try{
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  }catch(e){
    const msg = (e && e.message) ? e.message : String(e||'');
    // If portal.sql hasn't been applied yet, meta columns may not exist.
    if (/column .* does not exist/i.test(msg) && /(status|progress_pct|overall_score|validated|audit_date)/i.test(msg)){
      let q2 = sb
        .from('v8_audits')
        .select('id, user_id, audit_id, site_name, auditor_name, facilities, criteria_version, updated_at')
        .order('updated_at', { ascending: false })
        .limit(200);
      const term2 = (f.search || f.searchTerm || '').trim();
      if (term2){
        q2 = q2.or(`audit_id.ilike.%${term2}%,site_name.ilike.%${term2}%,auditor_name.ilike.%${term2}%`);
      }
      if (f.criteriaVersion) q2 = q2.eq('criteria_version', f.criteriaVersion);
      const { data, error } = await q2;
      if (error) throw error;
      return (data||[]).map(r => ({...r, status:null, progress_pct:null, overall_score:null, validated:null, audit_date:null}));
    }
    throw e;
  }
}

async function sbAdminGetAuditByRowId(rowId){
  const sb = await initSupabase();
  if (!sb) throw new Error('Supabase non configuré');
  await sbRequireUser();
  await ensureRoleLoaded();
  if (AUTH.role !== 'admin') throw new Error('Forbidden');

  const { data, error } = await sb
    .from('v8_audits')
    .select('id, user_id, audit_id, data, criteria_version')
    .eq('id', rowId)
    .maybeSingle();
  if (error) throw error;
  return data || null;
}

async function sbAdminShareAudit(auditRowId, clientEmail, clientName=''){
  const sb = await initSupabase();
  if (!sb) throw new Error('Supabase non configuré');
  await sbRequireUser();
  await ensureRoleLoaded();
  if (AUTH.role !== 'admin') throw new Error('Forbidden');

  const email = String(clientEmail||'').trim().toLowerCase();
  if (!email || !email.includes('@')) throw new Error('Invalid email');

  const payload = {
    audit_row_id: auditRowId,
    client_email: email,
    client_name: clientName ? String(clientName).trim() : null,
    created_by: AUTH.user?.id || null
  };

  const { error } = await sb.from('v8_audit_shares').insert(payload);
  if (error) throw error;
  return true;
}

async function sbListSharedAudits(){
  const sb = await initSupabase();
  if (!sb) throw new Error('Supabase non configuré');
  const user = await sbRequireUser();

  const { data, error } = await sb
    .from('v8_audit_shares')
    .select('id, audit_row_id, client_email, client_name, created_at, audit: v8_audits ( id, audit_id, site_name, auditor_name, facilities, criteria_version, status, progress_pct, overall_score, validated, audit_date, updated_at )')
    .eq('client_email', (user.email||'').toLowerCase())
    .order('created_at', { ascending: false });
  if (error) throw error;

  return (data||[]).map(r => ({
    shareId: r.id,
    auditRowId: r.audit_row_id,
    audit: r.audit || null,
    clientName: r.client_name || '',
    createdAt: r.created_at || ''
  }));
}

async function sbAdminGetAudit(userId, auditId){
  const sb = await initSupabase();
  if (!sb) throw new Error('Supabase non configuré');
  await sbRequireUser();
  const { data, error } = await sb
    .from('v8_audits')
    .select('data, criteria_version, site_name, auditor_name, facilities, updated_at, created_at')
    .eq('user_id', userId)
    .eq('audit_id', auditId)
    .maybeSingle();
  if (error) throw error;
  return data || null;
}

async function sbAdminCreateReportLink(userId, auditId){
  const sb = await initSupabase();
  if (!sb) throw new Error('Supabase non configuré');
  await sbRequireUser();
  const ttl = Number.isFinite(REPORT_TTL_DAYS) ? REPORT_TTL_DAYS : 90;
  const expires = new Date(Date.now() + ttl * 24 * 3600 * 1000);
  const token = uuid();
  const { error } = await sb
    .from('v8_report_links')
    .insert({ token, user_id: userId, audit_id: auditId, expires_at: expires.toISOString() });
  if (error) throw error;
  const base = APP_URL || (location.origin + location.pathname.replace(/\/[^\/]*$/, '/') );
  return { token, url: `${base}#/public/${token}`, expiresAtISO: expires.toISOString() };
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

function toExcelXmlMulti(sheets){
  // sheets: Array<{name, headers, rows}>
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
  const worksheets = (sheets||[]).map(sh=>{
    const headers = sh.headers || [];
    const rows = sh.rows || [];
    const name = (sh.name || "Audit").toString();
    const wsOpen = `<Worksheet ss:Name="${esc(name)}"><Table>`;
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
    return wsOpen + headerRow + bodyRows + wsClose;
  }).join("");
  const workbookClose = `</Workbook>`;
  return xmlHeader + workbookOpen + styles + worksheets + workbookClose;
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
  const parts = raw.split("/").filter(Boolean);
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
          h('div',{class:'small muted'}, t('loginHint'))
        )
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
    try{
      await dbPutAudit(audit);
      go(`#/audit/${auditId}`);
    }catch(e){
      const msg = (e && e.message) ? e.message : String(e);
      alert(msg + "

Si tu viens d'installer la version Admin/Portail, vérifie que tu as bien exécuté supabase/portal.sql (en plus de schema.sql et admin-rls.sql).");
    }
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


async function viewPortal(){
  if (!ONLINE_ENABLED) return viewStart();
  await sbRefreshSession();
  await ensureRoleLoaded();
  if (!AUTH.session) return viewLogin();

  const wrap = h('div',{});

  const right = h('div',{class:'row',style:'gap:8px'},
    ...(AUTH.role==='admin' || AUTH.role==='auditor' ? [h('a',{class:'btn', href:'#/'}, t('home'))] : []),
    h('button',{class:'btn', onclick: async()=>{ await sbSignOut(); location.hash='#/login'; }}, t('signOut'))
  );

  const top = topBar({title: t('portalTitle'), subtitle: t('portalSubtitle'), right});
  const body = h('div',{class:'container'});
  const list = h('div',{class:'list'});
  body.appendChild(list);

  wrap.appendChild(top);
  wrap.appendChild(body);
  mount(wrap);

  try{
    const shares = await sbListSharedAudits();
    if (!shares.length){
      list.appendChild(h('div',{class:'muted'}, t('portalNoShares')));
      return;
    }

    for (const s of shares){
      const a = s.audit || {};
      const row = h('div',{class:'card'});
      const head = h('div',{class:'row',style:'justify-content:space-between;align-items:flex-start;gap:12px'},
        h('div',{},
          h('div',{class:'h2'}, a.site_name || '—'),
          h('div',{class:'muted',style:'margin-top:4px'},
            `${t('auditorLabel')}: ${a.auditor_name || '—'} • ${t('lastUpdate')}: ${formatDateEU(a.updated_at || '')}`
          ),
          h('div',{class:'muted',style:'margin-top:4px'},
            `${t('facilitiesAudited')}: ${(a.facilities || []).join(', ') || '—'}`
          )
        ),
        h('div',{class:'row',style:'gap:8px;flex-wrap:wrap;justify-content:flex-end'},
          h('button',{class:'btn', onclick: async()=>{ location.hash = `#/shared-report/${encodeURIComponent(a.id)}`; }}, t('portalOpenReport')),
          h('button',{class:'btn', onclick: async()=>{ await downloadSharedJson(a.id, a.site_name); }}, t('portalDownloadJson')),
          h('button',{class:'btn', onclick: async()=>{ await downloadSharedExcel(a.id, a.site_name); }}, t('portalDownloadExcel'))
        )
      );

      // status badges
      const badges = h('div',{class:'row',style:'gap:8px;flex-wrap:wrap;margin-top:8px'},
        h('span',{class:'chip'}, `${t('adminStatus')}: ${a.status || '—'}`),
        (a.progress_pct!==null && a.progress_pct!==undefined) ? h('span',{class:'chip'}, `${t('adminProgress')}: ${a.progress_pct}%`) : null,
        (a.overall_score!==null && a.overall_score!==undefined) ? h('span',{class:'chip'}, `${t('adminScore')}: ${Math.round(a.overall_score)}%`) : null,
        a.criteria_version ? h('span',{class:'chip'}, `${t('criteriaVersion')}: ${a.criteria_version}`) : null
      );

      row.appendChild(head);
      row.appendChild(badges);
      list.appendChild(row);
    }
  }catch(e){
    list.appendChild(h('div',{class:'error'}, String(e?.message||e)));
  }
}

async function downloadSharedJson(rowId, siteName){
  const audit = await sbGetAuditByRowId(rowId);
  if (!audit) throw new Error('Audit introuvable');
  const fname = `M3_Audit_${(siteName||'audit').toString().replace(/\s+/g,'_')}_${new Date().toISOString().slice(0,10)}.json`;
  downloadText(fname, JSON.stringify(audit, null, 2), 'application/json');
}

async function downloadSharedExcel(rowId, siteName){
  const audit = await sbGetAuditByRowId(rowId);
  if (!audit) throw new Error('Audit introuvable');
  const dbData = await loadCriteriaDB();
  const auditedFacilities = (audit.meta?.facilitiesAudited && audit.meta.facilitiesAudited.length)
    ? audit.meta.facilitiesAudited
    : (dbData.facilities || [...new Set((dbData.criteria||[]).map(c=>c.facility))].filter(Boolean).sort());
  const criteria = (dbData.criteria||[]).filter(c => !auditedFacilities.length || auditedFacilities.includes(c.facility));
  const exp = buildAuditExportRows(criteria, audit.responses||{}, audit.meta);
  const xls = toExcelXml(exp.headers, exp.rows, 'Audit');
  const safe = (siteName||audit.meta?.siteName||'audit').toString().replace(/[^a-zA-Z0-9_-]+/g,'_').slice(0,60);
  downloadText(`M3_Audit_${safe}.xls`, xls, 'application/vnd.ms-excel');
}

async function viewSharedReport(rowId){
  if (!ONLINE_ENABLED) return viewStart();
  await sbRefreshSession();
  await ensureRoleLoaded();
  if (!AUTH.session) return viewLogin();

  const audit = await sbGetAuditByRowId(rowId);
  if (!audit) {
    const wrap = h('div',{}, topBar({title: t('portalTitle'), subtitle: t('portalSubtitle'), right: h('a',{class:'btn', href:'#/portal'}, t('portal'))}), h('div',{class:'container'}, h('div',{class:'error'}, 'Audit introuvable')));
    mount(wrap);
    return;
  }

  // Reuse report view but read-only
  const right = h('div',{class:'row',style:'gap:8px'},
    h('a',{class:'btn', href:'#/portal'}, t('portal')),
    h('button',{class:'btn', onclick: async()=>{ await downloadSharedExcel(rowId, audit.meta?.siteName); }}, t('portalDownloadExcel')),
    h('button',{class:'btn', onclick: async()=>{ await downloadSharedJson(rowId, audit.meta?.siteName); }}, t('portalDownloadJson')),
    h('button',{class:'btn', onclick: async()=>{ await sbSignOut(); location.hash='#/login'; }}, t('signOut'))
  );

  const wrap = h('div',{});
  wrap.appendChild(topBar(t('reportTitle'), right));
  const body = h('div',{class:'container'});
  wrap.appendChild(body);

  const dbData = await loadCriteriaDB();
  const auditedFacilities = (audit.meta?.facilitiesAudited && audit.meta.facilitiesAudited.length)
    ? audit.meta.facilitiesAudited
    : (dbData.facilities || [...new Set((dbData.criteria||[]).map(c=>c.facility))].filter(Boolean).sort());
  const criteria = (dbData.criteria||[]).filter(c => !auditedFacilities.length || auditedFacilities.includes(c.facility));

  const report = buildReportHTML(dbData, criteria, audit.responses||{}, audit.meta||{}, { includeEvidence: true });
  const frame = h('iframe',{class:'reportFrame'});
  body.appendChild(frame);
  mount(wrap);
  frame.srcdoc = report;
}
async function viewAdmin(){
  if (!ONLINE_ENABLED){
    return viewStart();
  }
  await initSupabase();
  await refreshSession();
  await ensureRoleLoaded(true);

  if (AUTH.role !== "admin"){
    return setRoot(h("div",{},
      topBar({title: t("adminConsole"), subtitle: t("adminForbidden"), right: h("a",{class:"btn", href:"#/"}, t("home"))}),
      h("div",{class:"wrap"},
        h("div",{class:"card"},
          h("div",{class:"h2"}, t("adminForbidden")),
          h("div",{class:"small muted", style:"margin-top:6px"}, "Tip: add your user UUID to public.user_roles as role='admin'.")
        )
      )
    ));
  }

  const dbData = await loadCriteriaDB();
  const body = h("div",{class:"wrap"});
  const tabs = h("div",{class:"tabs"});
  const tabAudits = h("div",{class:"tab active"}, t("adminAuditsTab"));
  const tabUsers = h("div",{class:"tab"}, t("adminUsersTab"));
  tabs.append(tabAudits, tabUsers);

  const state = {
    tab: "audits",
    q: "",
    audits: [],
    users: [],
    rolesById: {},
    busy: false,
    filters: { facility: [], status: 'all', validated: null, dateFrom: '', dateTo: '', scoreMin: null, scoreMax: null, progressMin: null, progressMax: null, criteriaVersion: '', onlyMismatch: false },
    selected: new Set()
  };

  const search = h("input",{placeholder: t("adminSearchPlaceholder")});
  const refreshBtn = h("button",{class:"btn", onclick: async()=>{ await loadCurrent(); }}, t("adminRefresh"));

  search.addEventListener("input", ()=>{ state.q = search.value; });

  async function loadAudits(){
    state.busy = true; render();
    try{ state.audits = await sbAdminListAudits({ search: state.q, ...state.filters });
      if (state.filters.onlyMismatch && dbData.version){
        state.audits = state.audits.filter(a => a.criteria_version && a.criteria_version !== dbData.version);
      } }
    catch(e){ showToast(String(e?.message||e)); }
    finally{ state.busy = false; render(); }
  }

  async function loadUsers(){
    state.busy = true; render();
    try{
      const data = await adminApi("listUsers");
      state.users = data.users || [];
      state.rolesById = data.rolesById || {};
    }catch(e){ showToast(String(e?.message||e)); }
    finally{ state.busy = false; render(); }
  }

  async function loadCurrent(){
    if (state.tab === "audits") return loadAudits();
    return loadUsers();
  }

  function renderAudits(){
    const list = h("div",{class:"list"});

    // Selection helpers
    const selectedCount = state.selected.size;
    const btnSelectAll = h("button",{class:"btn", onclick: ()=>{ for (const a of state.audits){ state.selected.add(a.id); } render(); }}, t("adminSelectAll"));
    const btnClearSel = h("button",{class:"btn btn--ghost", onclick: ()=>{ state.selected.clear(); render(); }}, t("adminClearSel"));

    const btnExportSelJson = h("button",{class:"btn", onclick: async()=>{ await exportAudits('json', 'selected'); }}, t("adminExportSelectedJson"));
    const btnExportFilJson = h("button",{class:"btn", onclick: async()=>{ await exportAudits('json', 'filtered'); }}, t("adminExportFilteredJson"));
    const btnExportSelXls = h("button",{class:"btn", onclick: async()=>{ await exportAudits('excel', 'selected'); }}, t("adminExportSelectedExcel"));

    const btnBackfill = h("button",{class:"btn", onclick: async()=>{ await backfillMeta(); }}, t("adminBackfillMeta"));

    // Filters UI
    const f = state.filters;
    const facilities = (dbData.facilities || ["Marina","Yacht Club","Sailing School"]);
    const facilityChecks = facilities.map(name => {
      const el = h("input",{type:"checkbox", checked: f.facility.includes(name), onchange: ()=>{ if (el.checked){ if (!f.facility.includes(name)) f.facility.push(name); } else { f.facility = f.facility.filter(x=>x!==name); } }});
      return h("label",{class:"row small", style:"align-items:center; gap:10px; padding:8px 10px; border:1px solid var(--border); border-radius:12px; background:#fff"}, el, h("span",{style:"font-weight:800"}, name));
    });

    const statusSel = h("select",{onchange: ()=>{ f.status = statusSel.value; }},
      h("option",{value:"all", selected: f.status==='all'}, "all"),
      h("option",{value:"draft", selected: f.status==='draft'}, "draft"),
      h("option",{value:"validated", selected: f.status==='validated'}, "validated")
    );

    const dateFrom = h("input",{type:"date", value: f.dateFrom||"", onchange: ()=>{ f.dateFrom = dateFrom.value; }});
    const dateTo = h("input",{type:"date", value: f.dateTo||"", onchange: ()=>{ f.dateTo = dateTo.value; }});

    const scoreMin = h("input",{type:"number", step:"0.01", placeholder:"0", value: f.scoreMin??"", onchange: ()=>{ f.scoreMin = scoreMin.value===''? null : Number(scoreMin.value); }});
    const scoreMax = h("input",{type:"number", step:"0.01", placeholder:"100", value: f.scoreMax??"", onchange: ()=>{ f.scoreMax = scoreMax.value===''? null : Number(scoreMax.value); }});

    const progMin = h("input",{type:"number", step:"1", placeholder:"0", value: f.progressMin??"", onchange: ()=>{ f.progressMin = progMin.value===''? null : Number(progMin.value); }});
    const progMax = h("input",{type:"number", step:"1", placeholder:"100", value: f.progressMax??"", onchange: ()=>{ f.progressMax = progMax.value===''? null : Number(progMax.value); }});

    const cvSel = h("input",{placeholder: dbData.version||'active', value: f.criteriaVersion||"", onchange: ()=>{ f.criteriaVersion = cvSel.value.trim(); }});

    const onlyMismatch = h("input",{type:"checkbox", checked: !!f.onlyMismatch, onchange: ()=>{ f.onlyMismatch = onlyMismatch.checked; }});

    const btnApply = h("button",{class:"btn btnPrimary", onclick: async()=>{ await loadAudits(); }}, t("adminRefresh"));
    const btnReset = h("button",{class:"btn btn--ghost", onclick: async()=>{
      state.q=''; search.value='';
      state.filters = { facility: [], status: 'all', validated: null, dateFrom: '', dateTo: '', scoreMin: null, scoreMax: null, progressMin: null, progressMax: null, criteriaVersion: '', onlyMismatch: false };
      state.selected.clear();
      await loadAudits();
    }}, t("reset"));

    const filtersPanel = h("details",{class:"card", open:false},
      h("summary",{}, t("adminFilters")),
      h("div",{class:"hr"}),
      h("div",{class:"grid", style:"gap:12px"},
        h("div",{}, h("div",{class:"small muted"}, t("adminFilterFacility")), h("div",{class:"grid", style:"grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:10px"}, ...facilityChecks)),
        h("div",{class:"grid", style:"grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:12px"},
          h("div",{}, h("div",{class:"small muted"}, t("adminFilterStatus")), statusSel),
          h("div",{}, h("div",{class:"small muted"}, t("adminFilterCriteriaVersion")), cvSel),
          h("label",{class:"row small", style:"align-items:center; gap:10px"}, onlyMismatch, h("span",{}, t("adminFilterOnlyMismatch")))
        ),
        h("div",{class:"grid", style:"grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:12px"},
          h("div",{}, h("div",{class:"small muted"}, t("adminFilterDateFrom")), dateFrom),
          h("div",{}, h("div",{class:"small muted"}, t("adminFilterDateTo")), dateTo),
          h("div",{}, h("div",{class:"small muted"}, t("adminFilterScoreMin")), scoreMin),
          h("div",{}, h("div",{class:"small muted"}, t("adminFilterScoreMax")), scoreMax),
          h("div",{}, h("div",{class:"small muted"}, t("adminFilterProgressMin")), progMin),
          h("div",{}, h("div",{class:"small muted"}, t("adminFilterProgressMax")), progMax)
        ),
        h("div",{class:"row", style:"gap:10px; flex-wrap:wrap"}, btnApply, btnReset)
      )
    );

    if (!state.audits.length){
      list.append(h("div",{class:"small muted", style:"padding-top:10px"}, "—"));
    } else {
      for (const a of state.audits){
        const title = a.site_name || a.audit_id;
        const facilitiesTxt = (a.facilities||[]).join(", ") || "—";
        const dateTxt = a.audit_date ? formatDateEU(a.audit_date) : formatDateEU(a.updated_at);
        const scoreTxt = (typeof a.overall_score === 'number' || typeof a.overall_score === 'string') ? `${Number(a.overall_score).toFixed(2)}%` : "—";
        const progTxt = (a.progress_pct!=null && a.progress_pct!==undefined) ? `${a.progress_pct}%` : "—";
        const status = a.status || (a.validated ? 'validated' : 'draft');
        const mismatch = (a.criteria_version && dbData.version && a.criteria_version !== dbData.version);

        const chk = h("input",{type:"checkbox", checked: state.selected.has(a.id), onchange: ()=>{ if (chk.checked) state.selected.add(a.id); else state.selected.delete(a.id); }});

        const actions = h("div",{class:"row", style:"gap:8px; justify-content:flex-end; flex-wrap:wrap"});

        const btnJson = h("button",{class:"btn", onclick: async()=>{ try{ const row = await sbAdminGetAudit(a.user_id, a.audit_id); if (!row?.data) return; downloadText(`${t("exportFilenameBase")}_${(row.data.meta?.siteName||title).replaceAll(" ","_")}.json`, JSON.stringify(row.data,null,2), "application/json"); }catch(e){ showToast(String(e?.message||e)); }}}, t("adminDownloadJson"));

        const btnExcel = h("button",{class:"btn", onclick: async()=>{ try{ const row = await sbAdminGetAudit(a.user_id, a.audit_id); if (!row?.data) return; const audit = row.data; const auditedFacilities = (audit.meta?.facilitiesAudited && audit.meta.facilitiesAudited.length) ? audit.meta.facilitiesAudited : (dbData.facilities || [...new Set((dbData.criteria||[]).map(c=>c.facility))].filter(Boolean).sort()); const criteria = (dbData.criteria||[]).filter(c=> !auditedFacilities.length || auditedFacilities.includes(c.facility)); const responses = audit.responses || {}; const missingCount = criteria.filter(c=> !answered(responses[c.id])).length; if (missingCount > 0){ showToast(t("auditNotValidated")); return; } const exp = buildAuditExportRows(criteria, responses, audit.meta); const xls = toExcelXml(exp.headers, exp.rows, "Audit"); const site = (audit.meta?.siteName || title).replaceAll(" ","_"); downloadText(`M3_Audit_${site}.xls`, xls, "application/vnd.ms-excel"); }catch(e){ showToast(String(e?.message||e)); }}}, t("adminDownloadExcel"));

        const btnReport = h("button",{class:"btn", onclick: async()=>{ try{ const row = await sbAdminGetAudit(a.user_id, a.audit_id); if (!row?.data) return; const audit = row.data; const auditedFacilities = (audit.meta?.facilitiesAudited && audit.meta.facilitiesAudited.length) ? audit.meta.facilitiesAudited : (dbData.facilities || [...new Set((dbData.criteria||[]).map(c=>c.facility))].filter(Boolean).sort()); const criteria = (dbData.criteria||[]).filter(c=> !auditedFacilities.length || auditedFacilities.includes(c.facility)); const responses = audit.responses || {}; const overall = computeWeightedScore(criteria, responses); const byPillar = [...groupBy(criteria, c=> c.pillar).entries()].map(([pillar, list])=> ({ label: pillar, pct: computeWeightedScore(list, responses).pct, sub: `${list.filter(c=> answered(responses[c.id])).length}/${list.length}` })).sort((x,y)=> y.pct-x.pct); const byFacility = [...groupBy(criteria, c=> c.facility).entries()].map(([facility, list])=> ({ label: facility, pct: computeWeightedScore(list, responses).pct, sub: `${list.filter(c=> answered(responses[c.id])).length}/${list.length}` })).sort((x,y)=> y.pct-x.pct); const ncItems = criteria.filter(c=>{ const r=responses[c.id]; if(!r||r.na) return false; return Number(r.score)<=1; }).map(c=>({ c, r: responses[c.id], lvl: severityLabelFor(c), })); const html = buildReportHTML(audit, dbData, LANG, overall, byPillar, byFacility, ncItems, criteria.length, auditedFacilities); const blob = new Blob([html], { type: "text/html;charset=utf-8" }); const url = URL.createObjectURL(blob); window.open(url, "_blank"); setTimeout(()=> URL.revokeObjectURL(url), 60_000); }catch(e){ showToast(String(e?.message||e)); }}}, t("adminPreviewReport"));

        const btnShareLink = h("button",{class:"btn", onclick: async()=>{ try{ const link = await sbAdminCreateReportLink(a.user_id, a.audit_id); await navigator.clipboard.writeText(link.url); showToast(`${t("adminShareLink")}: copied`); }catch(e){ showToast(String(e?.message||e)); }}}, t("adminShareLink"));

        const btnShareClient = h("button",{class:"btn", onclick: async()=>{ try{ const email = prompt(t('adminShareEmailPh') || 'client email'); if (!email) return; const name = prompt(t('adminShareNamePh') || 'name (optional)') || ''; await sbAdminShareAudit(a.id, email, name); showToast(t('adminShareSaved')); }catch(e){ showToast(String(e?.message||e)); }}}, t("adminShareToClient"));

        actions.append(btnJson, btnExcel, btnReport, btnShareLink, btnShareClient);

        list.append(
          h("div",{class:"item"},
            h("div",{class:"rowBetween"},
              h("div",{class:"row", style:"align-items:flex-start; gap:12px"},
                chk,
                h("div",{},
                  h("div",{class:"itemTitle"}, title),
                  h("div",{class:"itemMeta"}, `${a.auditor_name || "—"} • ${facilitiesTxt} • ${dateTxt}`),
                  h("div",{class:"row", style:"gap:8px; margin-top:6px; flex-wrap:wrap"},
                    h("span",{class:"pill"}, `${status}`),
                    h("span",{class:"pill"}, `${t('scoreLabel')}: ${scoreTxt}`),
                    h("span",{class:"pill"}, `${t('completion')}: ${progTxt}`)
                  ),
                  mismatch ? h("div",{class:"small", style:"margin-top:6px"}, h("span",{class:"badge warn"}, t("adminVersionMismatch")), h("span",{class:"small muted", style:"margin-left:8px"}, `${a.criteria_version} → ${dbData.version}`)) : null
                )
              ),
              actions
            )
          )
        );
      }
    }

    const header = h("div",{class:"card"},
      h("div",{class:"rowBetween"},
        h("div",{}, h("div",{class:"h2"}, t("adminAuditsTab")), h("div",{class:"small muted"}, `Global list • ${state.audits.length} audits • ${selectedCount} selected`)),
        h("div",{class:"row", style:"gap:10px; flex-wrap:wrap"},
          h("div",{class:"small muted"}, state.busy ? "…" : ""),
          search,
          refreshBtn
        )
      ),
      h("div",{class:"hr"}),
      filtersPanel,
      h("div",{class:"hr"}),
      h("div",{class:"row", style:"gap:10px; flex-wrap:wrap"}, btnSelectAll, btnClearSel, btnExportSelJson, btnExportFilJson, btnExportSelXls, btnBackfill),
      h("div",{class:"hr"}),
      list
    );

    async function exportAudits(kind, mode){
      try{
        const max = 50;
        let rows = [];
        if (mode === 'selected') rows = state.audits.filter(a => state.selected.has(a.id));
        else rows = state.audits.slice();
        if (!rows.length){ showToast('—'); return; }
        if (rows.length > max){ showToast(`Too many (${rows.length}). Limit ${max}.`); rows = rows.slice(0, max); }

        if (kind === 'json'){
          const full = [];
          for (const a of rows){
            const row = await sbAdminGetAudit(a.user_id, a.audit_id);
            if (row?.data) full.push({ audit_row_id: a.id, user_id: a.user_id, audit_id: a.audit_id, data: row.data });
          }
          downloadText(`M3_Audit_Export_${new Date().toISOString().slice(0,10)}.json`, JSON.stringify(full,null,2), 'application/json');
          showToast(t('exported'));
          return;
        }

        if (kind === 'excel'){
          const sheets = [];
          for (const a of rows){
            const row = await sbAdminGetAudit(a.user_id, a.audit_id);
            if (!row?.data) continue;
            const audit = row.data;
            const auditedFacilities = (audit.meta?.facilitiesAudited && audit.meta.facilitiesAudited.length) ? audit.meta.facilitiesAudited : (dbData.facilities || [...new Set((dbData.criteria||[]).map(c=>c.facility))].filter(Boolean).sort());
            const criteria = (dbData.criteria||[]).filter(c=> !auditedFacilities.length || auditedFacilities.includes(c.facility));
            const responses = audit.responses || {};
            const exp = buildAuditExportRows(criteria, responses, audit.meta);

            const base = (audit.meta?.siteName || a.site_name || a.audit_id || 'Audit').toString();
            const clean = base.replace(/[:\/?*\[\]]/g,' ').trim();
            let name = (clean || 'Audit').slice(0,31);
            let k = 1;
            while (sheets.some(s=> s.name === name)){
              k += 1;
              name = `${(clean || 'Audit').slice(0,28)}_${k}`.slice(0,31);
            }
            sheets.push({ name, headers: exp.headers, rows: exp.rows });
          }
          if (!sheets.length){ showToast('—'); return; }
          const xls = toExcelXmlMulti(sheets);
          downloadText(`M3_Audit_Batch_${new Date().toISOString().slice(0,10)}.xls`, xls, 'application/vnd.ms-excel');
          showToast(t('exported'));
          return;
        }

      }catch(e){ showToast(String(e?.message||e)); }
    }

    async function backfillMeta(){
      try{
        const sb = await initSupabase();
        if (!sb) throw new Error('Supabase non configuré');
        await sbRequireUser();
        await ensureRoleLoaded();
        if (AUTH.role !== 'admin') throw new Error('Forbidden');

        const toProcess = state.audits.slice(0, 100);
        for (const a of toProcess){
          const got = await sbAdminGetAudit(a.user_id, a.audit_id);
          if (!got?.data) continue;
          const audit = got.data;
          const auditedFacilities = Array.isArray(audit.meta?.facilitiesAudited) ? audit.meta.facilitiesAudited : [];
          const crit = (dbData.criteria||[]).filter(c=> !auditedFacilities.length || auditedFacilities.includes(c.facility));
          const responses = audit.responses || {};
          const total = crit.length;
          const done = crit.filter(c=> answered(responses[c.id])).length;
          const progress = total ? Math.round((done/total)*100) : 0;
          const validated = (total>0 && done===total);
          const overall = computeWeightedScore(crit, responses);
          const auditDate = (audit.meta?.createdAtISO || '').slice(0,10) || null;

          const patch = { status: validated ? 'validated' : 'draft', validated, progress_pct: progress, overall_score: overall.pct, audit_date: auditDate };
          const { error } = await sb.from('v8_audits').update(patch).eq('id', a.id);
          if (error){ console.warn(error); }
        }
        showToast(t('saved'));
        await loadAudits();
      }catch(e){ showToast(String(e?.message||e)); }
    }

    // Note: exportAudits is implemented below (patched at end of function) - placeholder replaced after string injection.

    return h("div",{class:"grid", style:"gap:14px"}, header);
  }
  function renderUsers(){
    const list = h("div",{class:"list"});

    for (const u of state.users){
      const role = state.rolesById?.[u.id] || "auditor";
      const roleSelect = h("select",{},
        ...["admin","auditor","viewer"].map(r => h("option",{value:r, selected: r===role}, r))
      );

      const btnSetRole = h("button",{class:"btn", onclick: async()=>{
        try{ await adminApi("setRole", { user_id: u.id, role: roleSelect.value }); await loadUsers(); showToast(t("saved")); }
        catch(e){ showToast(String(e?.message||e)); }
      }}, t("adminSetRole"));

      const isDisabled = !!u.banned_until;
      const btnToggle = h("button",{class:"btn btnDanger", onclick: async()=>{
        try{ await adminApi(isDisabled ? "unbanUser" : "banUser", { user_id: u.id }); await loadUsers(); showToast(t("saved")); }
        catch(e){ showToast(String(e?.message||e)); }
      }}, isDisabled ? t("adminEnable") : t("adminDisable"));

      list.append(
        h("div",{class:"item"},
          h("div",{class:"rowBetween"},
            h("div",{},
              h("div",{class:"itemTitle"}, u.email || u.phone || u.id),
              h("div",{class:"itemMeta"}, `id: ${u.id} • created: ${formatDateEU(u.created_at)}${u.last_sign_in_at ? " • last: "+formatDateEU(u.last_sign_in_at):""}`)
            ),
            h("div",{class:"row", style:"justify-content:flex-end; gap:10px"},
              roleSelect,
              btnSetRole,
              btnToggle
            )
          )
        )
      );
    }

    if (!state.users.length){
      list.append(h("div",{class:"small muted", style:"padding-top:10px"}, "—"));
    }

    const inviteEmail = h("input",{placeholder:"name@domain.com"});
    const inviteRole = h("select",{},
      h("option",{value:"auditor", selected:true},"auditor"),
      h("option",{value:"viewer"},"viewer"),
      h("option",{value:"admin"},"admin")
    );
    const inviteSend = h("input",{type:"checkbox", checked:false});
    const inviteLinkOut = h("input",{readonly:true, placeholder:"…"});

    const copyBtn = h("button",{class:"btn", onclick: async()=>{
      try{ await navigator.clipboard.writeText(inviteLinkOut.value || ""); showToast("copied"); }catch(_e){}
    }}, t("adminCopy"));

    const inviteBtn = h("button",{class:"btn btnPrimary", onclick: async()=>{
      const email = inviteEmail.value.trim();
      if (!email) return;
      try{
        const out = await adminApi("inviteUser", { email, role: inviteRole.value, send_email: inviteSend.checked });
        inviteLinkOut.value = out.action_link || "";
        showToast(t("saved"));
        await loadUsers();
      }catch(e){ showToast(String(e?.message||e)); }
    }}, t("adminInvite"));

    const inviteCard = h("details",{class:"card", open:false},
      h("summary",{}, t("adminInvite")),
      h("div",{class:"hr"}),
      h("div",{class:"grid", style:"gap:12px"},
        h("div",{}, h("div",{class:"small muted"}, t("adminInviteEmail")), inviteEmail),
        h("div",{}, h("div",{class:"small muted"}, t("adminInviteRole")), inviteRole),
        h("label",{class:"row small", style:"align-items:center; gap:10px"}, inviteSend, h("span",{}, t("adminInviteSendEmail"))),
        h("div",{}, h("div",{class:"small muted"}, t("adminInviteLink")), h("div",{class:"row"}, inviteLinkOut, copyBtn)),
        h("div",{class:"row"}, inviteBtn)
      )
    );

    return h("div",{class:"grid", style:"gap:14px"},
      h("div",{class:"card"},
        h("div",{class:"rowBetween"},
          h("div",{}, h("div",{class:"h2"}, t("adminUsersTab")), h("div",{class:"small muted"}, t("adminUsersIntro"))),
          h("div",{class:"row"},
            h("div",{class:"small muted"}, state.busy ? "…" : ""),
            refreshBtn
          )
        ),
        h("div",{class:"hr"}),
        inviteCard,
        h("div",{class:"hr"}),
        list
      )
    );
  }

  function render(){
    const activeAudits = state.tab === "audits";
    tabAudits.classList.toggle("active", activeAudits);
    tabUsers.classList.toggle("active", !activeAudits);
    body.replaceChildren(
      tabs,
      state.tab === "audits" ? renderAudits() : renderUsers()
    );
  }

  tabAudits.onclick = async()=>{ state.tab="audits"; render(); await loadAudits(); };
  tabUsers.onclick = async()=>{ state.tab="users"; render(); await loadUsers(); };

  setRoot(h("div",{},
    topBar({title: t("adminConsole"), subtitle: "M3 Audit", right: h("a",{class:"btn", href:"#/"}, t("home"))}),
    body
  ));

  render();
  await loadAudits();
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
    await ensureRoleLoaded();
    if (!AUTH.session && parts[0] !== "login"){
      return viewLogin();
    }
  }

  // Viewer/client role: restrict navigation to the portal
  if (ONLINE_ENABLED && AUTH.session && AUTH.role === 'viewer'){
    const allowed = new Set(['portal','shared-report','login']);
    const head = parts[0] || '';
    if (!allowed.has(head)){
      location.hash = '#/portal';
      return viewPortal();
    }
  }

  if (parts[0] === "login") return viewLogin();
  if (parts[0] === "portal"){
    return viewPortal();
  }

  if (parts[0] === "shared-report"){
    return viewSharedReport(parts[1]);
  }

  if (parts[0] === "admin") return viewAdmin();
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
