
/* M3 Audit – Standalone (no npm)
   Data model is stored in IndexedDB.
*/
const APP_VERSION = "standalone-2.7.2";


function escHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}




function parseSupabaseRecoveryFromUrl() {
  // Supabase verify endpoint redirects with fragment params (access_token, refresh_token, type).
  // With hash-router redirect_to like https://site/#/update-password, Supabase appends another "#access_token=..."
  // yielding: "#/update-password#access_token=...&refresh_token=...&type=recovery"
  const h = window.location.hash || "";
  const qs = window.location.search || "";

  let frag = "";
  const secondIdx = h.indexOf("#", 1);
  if (secondIdx !== -1) {
    frag = h.slice(secondIdx + 1);
  } 


async function handleSupabaseAuthRedirect() {
  try {
    const href = String(window.location.href || "");
    const url = new URL(href);

    // Supabase may redirect with either:
    // - fragment tokens: #access_token=...&refresh_token=...&type=recovery
    // - PKCE code: ?code=... (or in fragment when using hash-router)
    const qsCode = url.searchParams.get("code") || "";
    const qsType = url.searchParams.get("type") || "";

    const rec = (typeof parseSupabaseRecoveryFromUrl === "function") ? parseSupabaseRecoveryFromUrl() : { hasTokens:false, type:"" };

    // Try to find code in hash/double-hash too
    let hashCode = "";
    const h = window.location.hash || "";
    const secondIdx = h.indexOf("#", 1);
    if (secondIdx !== -1) {
      const frag = h.slice(secondIdx + 1);
      const hp = new URLSearchParams(frag);
      hashCode = hp.get("code") || "";
    } else if (h.startsWith("#") && !h.startsWith("#/")) {
      const hp = new URLSearchParams(h.slice(1));
      hashCode = hp.get("code") || "";
    }

    const code = qsCode || hashCode;

    const isUpdatePwdRoute = (window.location.hash || "").includes("/update-password");

    // 1) If we have tokens + recovery type, set session directly (implicit flow).
    if (rec.hasTokens && (rec.type === "recovery" || qsType === "recovery")) {
      if (typeof supabase !== "undefined" && supabase?.auth?.setSession) {
        await supabase.auth.setSession({ access_token: rec.access_token, refresh_token: rec.refresh_token });
      }
      window.__FORCE_UPDATE_PASSWORD__ = true;
      if (!isUpdatePwdRoute || (window.location.hash || "").indexOf("#", 1) !== -1) {
        window.location.hash = "#/update-password";
      }
      return;
    }

    // 2) If we have a PKCE code (newer Supabase), exchange it for a session.
    if (code) {
      if (typeof supabase !== "undefined" && supabase?.auth?.exchangeCodeForSession) {
        await supabase.auth.exchangeCodeForSession(code);
      }
      window.__FORCE_UPDATE_PASSWORD__ = true;

      // Clean URL: remove code/type from query, keep hash route
      try {
        url.searchParams.delete("code");
        url.searchParams.delete("type");
        const clean = url.origin + url.pathname + (url.searchParams.toString() ? ("?" + url.searchParams.toString()) : "") + "#/update-password";
        window.history.replaceState({}, "", clean);
      } catch (e) {
        window.location.hash = "#/update-password";
      }
      return;
    }

    // If we reached update-password without tokens/code, leave as-is (UI will show invalid/expired).
    if (isUpdatePwdRoute) window.__FORCE_UPDATE_PASSWORD__ = true;
  } catch (e) {
    // ignore
  }
}


else if (h.startsWith("#") && !h.startsWith("#/")) {
    frag = h.slice(1);
  }

  const params = new URLSearchParams(frag);
  const access_token = params.get("access_token") || "";
  const refresh_token = params.get("refresh_token") || "";
  const type = params.get("type") || "";

  const qsp = new URLSearchParams(qs.startsWith("?") ? qs.slice(1) : qs);
  const qType = qsp.get("type") || "";
  const effectiveType = type || qType;

  const hasTokens = !!(access_token && refresh_token);
  return { hasTokens, access_token, refresh_token, type: effectiveType, rawFrag: frag };
}


function criterionShortTitle(c){
  const raw = (c && (c.short_title || c.shortTitle || c.title || c.criterion || c.name || c.label || c.question))
    ? String(c.short_title || c.shortTitle || c.title || c.criterion || c.name || c.label || c.question)
    : "";
  // Keep it short, single line
  return raw.replace(/\s+/g,' ').trim().slice(0, 80);
}

const DB_NAME = "m3_audit_standalone";
const DB_VERSION = 1;
const STORE_AUDITS = "audits";

// Certification thresholds (editable via Admin import)
const DEFAULT_CERT_LEVELS = [
  { level_key: "horizon", display_name: "Horizon", global_floor: 0.60, pillar_floor: 0.50, sort_order: 1, is_active: true },
  { level_key: "regatta", display_name: "Regatta", global_floor: 0.70, pillar_floor: 0.60, sort_order: 2, is_active: true },
  { level_key: "flagship", display_name: "Flagship", global_floor: 0.80, pillar_floor: 0.70, sort_order: 3, is_active: true },
  { level_key: "sovereign", display_name: "Sovereign", global_floor: 0.90, pillar_floor: 0.80, sort_order: 4, is_active: true },
];
let CERT_LEVELS_CACHE = null;

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
    backupsLocal: "audit(s)",
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
    mustLogin: "Vous devez être connecté.",
    roleAdmin: "Admin",
    adminPanel: "Administration",
    adminUsersNav: "Users",
    adminBaseNav: "Base audit",
    adminAuditsNav: "Audits",
    adminPanelHelp: "Invitations et gestion des accès.",
    inviteUserTitle: "Inviter un utilisateur",
usersTitle: "Users",
usersHelp: "Liste des comptes et gestion des rôles.",
promoteAdmin: "Promouvoir admin",
demoteAdmin: "Rétrograder",
resetUserPassword: "Reset password",
refreshUsers: "Rafraîchir",
criteriaUpdateTitle: "Mise à jour base audit",
criteriaUpdateHelp: "Upload du fichier Excel (format M3_Audit_v5) pour mettre à jour la base de critères.",
chooseExcel: "Choisir un fichier Excel",
parseExcel: "Analyser",
uploadToDb: "Uploader en base",
downloadJson: "Télécharger JSON",
versionLabel: "Version",
parsing: "Analyse…",
uploading: "Upload…",
criteriaCount: "Critères",
    inviteEmailPh: "Email (ex: user@domaine.com)",
    inviteRole: "Rôle",
    sendInvite: "Envoyer invitation",
    sendingInvite: "Envoi…",
    inviteSent: "Invitation envoyée.",
    inviteFailed: "Invitation impossible.",
    invalidEmail: "Email invalide.",
    roleAuditor: "Auditeur",
    ownerLabel: "Propriétaire",
    allUsers: "tous utilisateurs",
    adminBadge: "ADMIN",
    publicReportInvalidTitle: "Lien invalide",
    publicReportInvalidSubtitle: "Le lien de rapport est invalide ou expiré.",
    publicReportBack: "Retour",
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
    certLevelLabel: "Certification",
    certPillarMinLabel: "Min piliers",
    certThresholdsLabel: "Seuils",
    certNotQualified: "Non qualifié",
    certImportTitle: "Niveaux de certification",
    certImportHelp: "Importer les seuils depuis la feuille Executive_Note (colonnes A-C).",
    parseCertLevels: "Analyser niveaux",
    uploadCertLevels: "Mettre à jour niveaux",
    certLevelsCount: "Niveaux",
    ncFilterFacility: "Facility",
    ncFilterPillar: "Pilier",
    ncFilterLevel: "Niveau NC",
    all: "Tous",
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
    backupsLocal: "audit(s)",
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
    mustLogin: "You must be signed in.",
    roleAdmin: "Admin",
    adminPanel: "Administration",
    adminUsersNav: "Users",
    adminBaseNav: "Audit base",
    adminAuditsNav: "Audits",
    adminPanelHelp: "Invites and access management.",
    inviteUserTitle: "Invite a user",
usersTitle: "Users",
usersHelp: "List accounts and manage roles.",
promoteAdmin: "Promote to admin",
demoteAdmin: "Demote",
resetUserPassword: "Reset password",
refreshUsers: "Refresh",
criteriaUpdateTitle: "Audit base update",
criteriaUpdateHelp: "Upload the Excel file (M3_Audit_v5 format) to update the criteria base.",
chooseExcel: "Choose an Excel file",
parseExcel: "Parse",
uploadToDb: "Upload to DB",
downloadJson: "Download JSON",
versionLabel: "Version",
parsing: "Parsing…",
uploading: "Uploading…",
criteriaCount: "Criteria",
    inviteEmailPh: "Email (e.g. user@domain.com)",
    inviteRole: "Role",
    sendInvite: "Send invite",
    sendingInvite: "Sending…",
    inviteSent: "Invite sent.",
    inviteFailed: "Invite failed.",
    invalidEmail: "Invalid email.",
    roleAuditor: "Auditor",
    ownerLabel: "Owner",
    allUsers: "all users",
    adminBadge: "ADMIN",
    publicReportInvalidTitle: "Invalid link",
    publicReportInvalidSubtitle: "This report link is invalid or expired.",
    publicReportBack: "Back",
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
    reportNC: "Non‑conformités",
    certLevelLabel: "Certification",
    certPillarMinLabel: "Min pillars",
    certThresholdsLabel: "Thresholds",
    certNotQualified: "Not qualified",
    certImportTitle: "Certification levels",
    certImportHelp: "Import thresholds from Executive_Note sheet (columns A-C).",
    parseCertLevels: "Parse levels",
    uploadCertLevels: "Update levels",
    certLevelsCount: "Levels",
    ncFilterFacility: "Facility",
    ncFilterPillar: "Pillar",
    ncFilterLevel: "NC level",
    all: "All",
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
exportHtmlClient: "Export client report (HTML)",
actionPlanTitle: "Action plan",
addRow: "Add row",
saveActionPlan: "Save",
saved: "Saved",
actionPlanHint: "This action plan is editable and will be used in the client report export.",
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

// Alias used by admin UI (legacy helper name)
function lt(key){ return t(key); }

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

    // Allow arrays (e.g., map results) as children
    if (Array.isArray(c)){
      for (const cc of c){
        if (cc === null || cc === undefined) continue;
        if (Array.isArray(cc)){
          // one level deeper just in case
          for (const ccc of cc){
            if (ccc === null || ccc === undefined) continue;
            if (typeof ccc === "string" || typeof ccc === "number" || typeof ccc === "boolean") e.appendChild(document.createTextNode(String(ccc)));
            else if (ccc && typeof ccc === "object" && ("nodeType" in ccc)) e.appendChild(ccc);
            else e.appendChild(document.createTextNode(String(ccc)));
          }
        } else if (typeof cc === "string" || typeof cc === "number" || typeof cc === "boolean") {
          e.appendChild(document.createTextNode(String(cc)));
        } else if (cc && typeof cc === "object" && ("nodeType" in cc)) {
          e.appendChild(cc);
        } else {
          e.appendChild(document.createTextNode(String(cc)));
        }
      }
      continue;
    }

    if (typeof c === "string" || typeof c === "number" || typeof c === "boolean") {
      e.appendChild(document.createTextNode(String(c)));
    } else if (c && typeof c === "object" && ("nodeType" in c)) {
      e.appendChild(c);
    } else {
      e.appendChild(document.createTextNode(String(c)));
    }
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
  if (fh) { fh.textContent = t("home"); fh.style.display = "none"; }
}

function topBar({title, subtitle, right} = {}){
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
        const userPill = (!online || !AUTH || !AUTH.user) ? null : h(
          "div",
          { class:"pill", style:"max-width:360px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" },
          `${AUTH.user.email} • ${AUTH.isAdmin ? t("roleAdmin") : t("roleAuditor")}`
        );
        const authBtn = !online ? null : (AUTH && AUTH.user
          ? h("button",{class:"btn btn--ghost", onclick: async ()=>{ await signOut(); showToast(t("signedOut")); go("#/login"); }}, t("signOut"))
          : h("a",{class:"btn btn--ghost", href:"#/login"}, t("signIn"))
        );
        return h("div",{class:"topActions"}, langSel, userPill || h("div",{}), (AUTH && AUTH.isAdmin) ? h("div",{class:"adminLinks"}, h("a",{class:"btn btn--ghost", href:"#/"}, t("home")), h("a",{class:"btn btn--ghost", href:"#/users"}, t("adminUsersNav")), h("a",{class:"btn btn--ghost", href:"#/audits"}, t("adminAuditsNav")), h("a",{class:"btn btn--ghost", href:"#/base"}, t("adminBaseNav"))) : h("div",{}), right || h("div",{}), authBtn || h("div",{}));
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
const FORCE_PWD_KEY = 'm3_force_pwd_update';

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
    
  // Extra fallback: hash-router + Supabase can produce a double-hash like:
  //   #/update-password#access_token=...&refresh_token=...&type=recovery
  // In that case, parse params after the second '#'.
  try{
    const h2 = window.location.hash || '';
    const second = h2.indexOf('#', 1);
    if (second !== -1){
      const qs2 = new URLSearchParams(h2.slice(second + 1));
      const v4 = qs2.get(key);
      if (v4) return v4;
    }
  }catch{}
// Fallback: sometimes Supabase puts params directly in the hash (e.g. #access_token=...&type=recovery)
  try{
    const h = window.location.hash || '';
    if (h && h.startsWith('#') && !h.startsWith('#/')){
      const qs3 = new URLSearchParams(h.slice(1));
      const v3 = qs3.get(key);
      if (v3) return v3;
    }
  }catch{}

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
let AUTH = { session: null, user: null, isAdmin: false, _adminCheckedFor: null };

let ADMIN_USERS_CACHE = null;
let ADMIN_USERS_CACHE_AT = 0;

function emailForUserId(userId){
  if (!userId) return null;
  const list = ADMIN_USERS_CACHE || [];
  const u = list.find(x => x && x.id === userId);
  return (u && u.email) ? u.email : null;
}

async function getAdminUsersCached(force=false){
  if (!ONLINE_ENABLED) return [];
  await refreshAdminFlag();
  if (!AUTH.isAdmin) return [];
  const now = Date.now();
  if (!force && ADMIN_USERS_CACHE && (now - ADMIN_USERS_CACHE_AT) < 5*60*1000) return ADMIN_USERS_CACHE;
  try {
    const out = await callNetlifyFn("list-users", {});
    ADMIN_USERS_CACHE = out.users || [];
    ADMIN_USERS_CACHE_AT = now;
    return ADMIN_USERS_CACHE;
  } catch (_e) {
    return ADMIN_USERS_CACHE || [];
  }
}

async function refreshAdminFlag(force=false) {
  if (!ONLINE_ENABLED) { AUTH.isAdmin = false; return false; }
  if (!AUTH.user) { AUTH.isAdmin = false; AUTH._adminCheckedFor = null; return false; }
  if (!force && AUTH._adminCheckedFor === AUTH.user.id) return AUTH.isAdmin;
  AUTH._adminCheckedFor = AUTH.user.id;

  const sb = await initSupabase();

  // 1) Best: boolean RPC (robust even if v8_admins uses non-standard column names)
  try {
    const { data, error } = await sb.rpc('v8_is_admin');
    if (!error) {
      if (typeof data === 'boolean') {
        AUTH.isAdmin = data;
        return AUTH.isAdmin;
      }
      if (data && typeof data === 'object') {
        const v = data.v8_is_admin ?? data.is_admin ?? data.value ?? data.result;
        if (typeof v === 'boolean') {
          AUTH.isAdmin = v;
          return AUTH.isAdmin;
        }
      }
    }
  } catch (_e) {}

  // 2) Role RPC (older patch)
  try {
    const { data, error } = await sb.rpc('get_v8_my_role');
    if (!error) {
      const role = (typeof data === 'string' ? data : (data && (data.role || data.value))) || '';
      AUTH.isAdmin = String(role).toLowerCase() === 'admin';
      return AUTH.isAdmin;
    }
  } catch (_e) {}

  // 3) Last resort: direct read (only works if v8_admins is selectable)
  try {
    const { data, error } = await sb.from('v8_admins').select('*').limit(50);
    if (!error && Array.isArray(data)) {
      const uid = AUTH.user.id;
      AUTH.isAdmin = data.some(r => String(r.user_id ?? r.uid ?? r.auth_user_id ?? r.id ?? '') === uid);
      return AUTH.isAdmin;
    }
  } catch (_e) {}
  AUTH.isAdmin = false;
  return false;
}

async function inviteUserByEmail(email, role){
  if (!ONLINE_ENABLED) throw new Error("Offline");
  if (!AUTH.session?.access_token) throw new Error("No session");
  const res = await fetch("/.netlify/functions/invite-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + AUTH.session.access_token
    },
    body: JSON.stringify({ email, role })
  });
  let data = {};
  try{ data = await res.json(); }catch(_){}
  if (!res.ok) throw new Error(data.error || (`HTTP ${res.status}`));
  return data;
}



async function initSupabase(){
  if (!ONLINE_ENABLED) return null;
  if (SB) return SB;
  SB = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false
    }
  });
  // keep local auth state updated
  SB.auth.onAuthStateChange((_event, session)=>{
    AUTH.session = session;
    AUTH.user = session?.user || null;
    AUTH._adminCheckedFor = null;
    AUTH.isAdmin = false;
    refreshAdminFlag().finally(()=>render());
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
  if (!sb) {
    AUTH.session = null;
    AUTH.user = null;
    AUTH._adminCheckedFor = null;
    AUTH.isAdmin = false;
    return null;
  }
  const { data } = await sb.auth.getSession();
  AUTH.session = data.session;
  AUTH.user = data.session?.user || null;
  AUTH._adminCheckedFor = null;
  AUTH.isAdmin = false;
  await refreshAdminFlag();
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

// Prevent collaborators from overwriting the whole audit row (RLS will block anyway).
// Collaborators must save per-criterion via RPC (v8_set_response).
if (!AUTH.isAdmin && audit && audit.__ownerUserId && audit.__ownerUserId !== user.id) {
  throw new Error("Accès refusé : vous n'êtes pas propriétaire de cet audit. (Collaboration : sauvegarde par critère uniquement.)");
}


  const facilities = (audit.meta && Array.isArray(audit.meta.facilitiesAudited)) ? audit.meta.facilitiesAudited : [];

  const ownerId = (AUTH.isAdmin && audit.__ownerUserId) ? audit.__ownerUserId : user.id;
  audit.__ownerUserId = ownerId;

  const payload = {
    user_id: ownerId,
    audit_id: audit.auditId,
    site_name: audit.meta?.siteName || null,
    auditor_name: audit.meta?.auditorName || null,
    facilities,
    criteria_version: audit.criteriaVersion || audit.meta?.criteriaVersion || null,
    data: audit
  };

  const { error } = await sb.from('v8_audits').upsert(payload, { onConflict: 'audit_id' });
  if (error) throw error;
  return true;
}

async function sbGetAudit(auditId){
  const sb = await initSupabase();
  if (!sb) throw new Error("Supabase not initialized");
  const user = await sbRequireUser();
  await refreshAdminFlag();

  const { data, error } = await sb
    .from("v8_audits")
    .select("data,user_id")
    .eq("audit_id", auditId)
    .maybeSingle();
  if (error) throw error;
  const audit = data?.data || null;
  if (audit && data?.user_id) audit.__ownerUserId = data.user_id;
  return audit;
}

async function sbListAudits(){
  const sb = await initSupabase();
  if (!sb) throw new Error("Supabase not initialized");
  const user = await sbRequireUser();
  await refreshAdminFlag();

  let q = sb
    .from("v8_audits")
    .select("audit_id,user_id,site_name,auditor_name,facilities,updated_at");

  // RLS handles owner/collaborator/admin visibility
  const { data, error } = await q.order("updated_at", { ascending: false }).limit(200);
  if (error) throw error;

  return (data || []).map(r => ({
    auditId: r.audit_id,
    ownerUserId: r.user_id,
    meta: { siteName: r.site_name, auditorName: r.auditor_name, facilitiesAudited: r.facilities },
    updatedAtISO: r.updated_at,
  }));
}

async function sbDeleteAudit(auditId){
  const sb = await initSupabase();
  if (!sb) throw new Error("Supabase not initialized");
  const user = await sbRequireUser();
  await refreshAdminFlag();

  let q = sb.from("v8_audits").delete().eq("audit_id", auditId);
  if (!AUTH.isAdmin) q = q.eq("user_id", user.id);

  const { error } = await q;
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


async function sbGetCertLevels(){
  // Can be called with anon; will fallback if blocked by RLS
  const sb = await initSupabase();
  if (!sb) return DEFAULT_CERT_LEVELS;
  const { data, error } = await sb
    .from("v8_certification_levels")
    .select("level_key,display_name,global_floor,pillar_floor,sort_order,is_active")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !Array.isArray(data) || !data.length) return DEFAULT_CERT_LEVELS;
  return data;
}

// ---------------------------------------------------------------------------
// Action plan (editable, stored in DB)
// ---------------------------------------------------------------------------
async function sbListActionPlanItems(auditId){
  if (!ONLINE_ENABLED) return [];
  await initSupabase();
  const { data, error } = await SB
    .from("v8_audit_action_plan_items")
    .select("*")
    .eq("audit_id", auditId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data || [];
}

async function sbUpsertActionPlanItems(items){
  if (!ONLINE_ENABLED) throw new Error("ONLINE_DISABLED");
  await initSupabase();
  const { data, error } = await SB
    .from("v8_audit_action_plan_items")
    .upsert(items, { onConflict: "id" })
    .select("*");
  if (error) throw error;
  return data || [];
}

async function sbDeleteActionPlanItem(id){
  if (!ONLINE_ENABLED) throw new Error("ONLINE_DISABLED");
  await initSupabase();
  const { error } = await SB
    .from("v8_audit_action_plan_items")
    .delete()
    .eq("id", id);
  if (error) throw error;
  return true;
}


async function loadCertLevels(){
  if (CERT_LEVELS_CACHE) return CERT_LEVELS_CACHE;
  try{
    CERT_LEVELS_CACHE = await sbGetCertLevels();
  }catch(e){
    CERT_LEVELS_CACHE = DEFAULT_CERT_LEVELS;
  }
  return CERT_LEVELS_CACHE;
}

function computeCertification(overallPct, byPillarArr, levels){
  const global = (Number(overallPct)||0) / 100;
  let minPillar = 0;
  if (Array.isArray(byPillarArr) && byPillarArr.length){
    minPillar = Math.min(...byPillarArr.map(x=> (Number(x.pct)||0)/100 ));
  }
  const sorted = (levels||[]).slice().filter(x=> x && x.is_active !== false).sort((a,b)=> (Number(a.sort_order)||0) - (Number(b.sort_order)||0));
  let best = null;
  for (const lv of sorted){
    if (global >= Number(lv.global_floor||0) && minPillar >= Number(lv.pillar_floor||0)) best = lv;
  }
  return { best, global, minPillar };
}


async function sbUploadPhoto(auditId, criterionId, photoId, dataUrl, ownerUserId=null){
  const sb = await initSupabase();
  const user = AUTH.user || (await sb.auth.getUser()).data.user;
  if (!user) throw new Error('Not authenticated');
  const ext = 'jpg';
  const ownerId = ownerUserId || user.id;
  const filePath = `${ownerId}/${auditId}/${criterionId}/${photoId}.${ext}`;
  const blob = dataUrlToBlob(dataUrl);
  const { error } = await sb.storage
    .from(SUPABASE_BUCKET)
    .upload(filePath, blob, { contentType: 'image/jpeg', upsert: true });
  if (error) throw error;
  const { data } = sb.storage.from(SUPABASE_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}


/* ---- Collaboration RPC helpers (locks + criterion-level save) ---- */
async function sbAcquireLock(auditId, criterionId, ttlSeconds=120){
  const sb = await initSupabase();
  if (!sb) throw new Error('Supabase non configuré');
  await sbRequireUser();
  const { data, error } = await sb.rpc('v8_acquire_lock', {
    p_audit_id: auditId,
    p_criterion_id: criterionId,
    p_ttl_seconds: ttlSeconds
  });
  if (error) throw error;
  return data;
}

async function sbReleaseLock(auditId, criterionId){
  const sb = await initSupabase();
  if (!sb) return false;
  try{
    await sbRequireUser();
    const { data, error } = await sb.rpc('v8_release_lock', {
      p_audit_id: auditId,
      p_criterion_id: criterionId
    });
    if (error) throw error;
    return !!data;
  }catch(e){
    return false;
  }
}

async function sbSetResponse(auditId, criterionId, responseObj){
  const sb = await initSupabase();
  if (!sb) throw new Error('Supabase non configuré');
  await sbRequireUser();
  const { data, error } = await sb.rpc('v8_set_response', {
    p_audit_id: auditId,
    p_criterion_id: criterionId,
    p_response: responseObj || {}
  });
  if (error) throw error;
  return !!data;
}

async function sbNextPhotoId(auditId){
  const sb = await initSupabase();
  if (!sb) throw new Error('Supabase non configuré');
  await sbRequireUser();
  const { data, error } = await sb.rpc('v8_next_photo_id', { p_audit_id: auditId });
  if (error) throw error;
  return data;
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
let CRITERIA_VERSION = "";

/** -------- Netlify Functions + Excel helpers ---------- */
async function callNetlifyFn(fnName, payload) {
  const token = AUTH?.session?.access_token;
  const res = await fetch(`/.netlify/functions/${fnName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload || {}),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || `Function ${fnName} failed`);
  return json;
}

function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    const existing = Array.from(document.scripts).find((s) => s.src === src);
    if (existing) {
      if (existing.dataset.loaded === "1") return resolve();
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", (e) => reject(e));
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => {
      s.dataset.loaded = "1";
      resolve();
    };
    s.onerror = (e) => reject(e);
    document.head.appendChild(s);
  });
}

async function ensureXLSX() {
  if (window.XLSX) return window.XLSX;
  await loadScriptOnce("https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js");
  if (!window.XLSX) throw new Error("XLSX library not loaded (network blocked?)");
  return window.XLSX;
}

function normHeader(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function pick(row, headerMap, key, fallback = "") {
  const k = headerMap[key];
  return k ? row[k] : fallback;
}

async function parseCriteriaExcel(file) {
  const XLSX = await ensureXLSX();
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const ws = wb.Sheets["Audit"] || wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });

  if (!rows || !rows.length) return [];

  const headerKeys = Object.keys(rows[0] || {});
  const headerMap = {};
  headerKeys.forEach((k) => (headerMap[normHeader(k)] = k));

  const mapped = [];
  for (const r of rows) {
    const id = String(pick(r, headerMap, "criterion_id") || pick(r, headerMap, "criterionid") || "").trim();
    if (!id) continue;

    const weightRaw = pick(r, headerMap, "weight");
    const w = weightRaw === "" || weightRaw == null ? NaN : Number(weightRaw);

    mapped.push({
      id,
      pillar: String(pick(r, headerMap, "pillar")).trim(),
      parentGroup: String(pick(r, headerMap, "parentgroup")).trim(),
      facility: String(pick(r, headerMap, "facilities")).trim(),
      title: String(pick(r, headerMap, "criterion")).trim(),
      description: String(pick(r, headerMap, "description")).trim(),
      measurement: String(pick(r, headerMap, "measurement")).trim(),
      unit: String(pick(r, headerMap, "unit")).trim(),
      threshold: String(pick(r, headerMap, "threshold")).trim(),
      method: String(pick(r, headerMap, "method")).trim(),
      evidenceRequired: String(pick(r, headerMap, "evidence_required")).trim(),
      frequency: String(pick(r, headerMap, "frequency")).trim(),
      owner: String(pick(r, headerMap, "owner")).trim(),
      weight: Number.isFinite(w) ? w : "",
      failSafe: String(pick(r, headerMap, "fail_safe")).trim(),
      externalRequirement: String(pick(r, headerMap, "external_requirement")).trim(),
      crosswalk: String(pick(r, headerMap, "crosswalk_certifications")).trim(),
      domain: String(pick(r, headerMap, "domain")).trim(),
    });
  }
  return mapped;
}



async function parseCertLevelsExcel(file){
  const XLSX = await ensureXLSX();
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const ws = wb.Sheets["Executive_Note"] || wb.Sheets["Executive Note"] || wb.Sheets[wb.SheetNames[0]];
  if (!ws) return [];
  const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
  if (!aoa || !aoa.length) return [];

  // find header row where col A == "Certification level"
  let headerRow = -1;
  for (let i=0;i<Math.min(aoa.length, 120);i++){
    const a = String((aoa[i] && aoa[i][0]) || "").trim().toLowerCase();
    if (a === "certification level"){
      headerRow = i;
      break;
    }
  }
  if (headerRow === -1) return [];

  const out = [];
  for (let i=headerRow+1;i<aoa.length;i++){
    const name = String((aoa[i] && aoa[i][0]) || "").trim();
    if (!name) break;
    const gf = Number((aoa[i] && aoa[i][1]) || 0);
    const pf = Number((aoa[i] && aoa[i][2]) || 0);
    out.push({
      level_key: slugify(name),
      display_name: name.replace(/\s+/g," ").trim(),
      global_floor: Number.isFinite(gf) ? gf : 0,
      pillar_floor: Number.isFinite(pf) ? pf : 0,
      sort_order: out.length + 1,
      is_active: true,
    });
  }
  return out;
}



async function loadCriteriaDB(){
  if (CRITERIA_DB) return CRITERIA_DB;

  // Try latest criteria from DB (online), fallback to local criteria.json files
  if (ONLINE_ENABLED && SB){
    try{
      const { data, error } = await SB
        .from("v8_criteria_versions")
        .select("version,criteria,created_at")
        .order("created_at", { ascending: false })
        .limit(1);

      if (!error && data && data.length && data[0] && data[0].criteria){
        CRITERIA_DB = data[0].criteria;
        CRITERIA_VERSION = data[0].version || "";
        return CRITERIA_DB;
      }
    }catch(e){
      // ignore and fallback
    }
  }

  const urls = ["./data/criteria.json", "./criteria.json"];
  let lastErr = null;

  for (const url of urls){
    try{
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      CRITERIA_DB = await res.json();
      CRITERIA_VERSION = "";
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

function go(hash) {
  if (location.hash === hash) {
    // Hash did not change, force navigation/render
    safeRoute();
  } else {
    location.hash = hash;
  }
}


function paintFatal(err) {
  console.error(err);
  const msg = err && (err.stack || err.message) ? (err.stack || err.message) : String(err);
  try {
    setRoot(
      h("div", { class: "app" },
        h("div", { class: "container" },
          h("div", { class: "card" },
            h("div", { class: "h1" }, "Erreur"),
            h("div", { class: "muted" }, "Une erreur a empêché l’affichage de la page demandée."),
            h("pre", { class: "pre" }, msg),
            h("div", { class: "row" },
              h("button", { class: "btn", onclick: () => safeRoute() }, "Réessayer"),
              h("button", { class: "btn btn--ghost", onclick: () => go("#/") }, "Accueil")
            )
          )
        )
      )
    );
  } catch (e2) {
    // fallback ultra-minimal
    try { document.body.innerHTML = "<pre>" + escapeHtml(msg) + "</pre>"; } catch (_) {}
  }
}

async function safeRoute() {
  try {
    await route();
  } catch (err) {
    paintFatal(err);
  }
}

// If an async navigation throws and nobody awaits it, show a useful screen instead of "URL change but nothing".
window.addEventListener("unhandledrejection", (e) => {
  paintFatal(e && e.reason ? e.reason : e);
});


window.addEventListener("hashchange", () => safeRoute());
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
  window.__FORCE_UPDATE_PASSWORD__ = true;

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
      try{ sessionStorage.removeItem(FORCE_PWD_KEY); }catch{}
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
  if (ONLINE_ENABLED && AUTH.isAdmin) { await getAdminUsersCached(); }

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

  // Admin invitation moved to Users page (#/users)
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
            h("div",{class:"small muted"}, `${t("auditorLabel")}: ${meta.auditorName||"-"} • ${t("facilities")}: ${(meta.facilitiesAudited && meta.facilitiesAudited.length) ? meta.facilitiesAudited.join(", ") : t("all")} • ${t("updatedAt")}: ${updated}${(ONLINE_ENABLED && AUTH.isAdmin && a.ownerUserId) ? ` • ${t("ownerLabel")}: ${emailForUserId(a.ownerUserId) || (String(a.ownerUserId).slice(0,8)+ "…")}` : ""}`)
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

async function viewAdminUsers() {
  if (!ONLINE_ENABLED) {
    setRoot(
      h("div", { class: "page" }, topBar(), h("div", { class: "card" }, h("h3", {}, lt("usersTitle")), h("div", { class: "muted" }, "Offline: indisponible.")))
    );
    return;
  }
  if (!AUTH.user) return viewLogin();
  await refreshAdminFlag();
  if (!AUTH.isAdmin) return viewStart();

  let state = { loading: true, error: "", users: [] };
  // --- Invite form (moved here from Home) ---
  const inviteEmailInUsersPage = h('input',{type:'email', placeholder: lt('inviteEmailPh'), style:'min-width:260px; flex:2'});
  const inviteRoleInUsersPage = h('select',{style:'min-width:160px; flex:1'},
    h('option',{value:'auditor'}, lt('roleAuditor')),
    h('option',{value:'admin'}, lt('roleAdmin'))
  );
  const inviteMsgInUsersPage = h('div',{class:'small muted'});
  async function doInviteFromUsersPage(){
    inviteMsgInUsersPage.textContent = '';
    let btnText = '';
    const email = String(inviteEmailInUsersPage.value||'').trim().toLowerCase();
    const role = String(inviteRoleInUsersPage.value||'auditor');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      inviteMsgInUsersPage.textContent = lt('invalidEmail');
      return;
    }
    try{
      btnText = inviteBtnInUsersPage.textContent;
      inviteBtnInUsersPage.disabled = true;
      inviteBtnInUsersPage.textContent = lt('sendingInvite');
      const out = await inviteUserByEmail(email, role);
      showToast(lt('inviteSent'));
      inviteEmailInUsersPage.value = '';
      // If backend returns an action_link, show it (fallback if SMTP not configured)
      if (out && (out.action_link || out.actionLink)){
        inviteMsgInUsersPage.textContent = 'Lien: ' + (out.action_link || out.actionLink);
      }
      await load();
    }catch(e){
      inviteMsgInUsersPage.textContent = (e && e.message) ? e.message : String(e);
    }finally{
      inviteBtnInUsersPage.disabled = false;
      inviteBtnInUsersPage.textContent = btnText;
    }
  }
  const inviteBtnInUsersPage = h('button',{class:'btn', onclick: doInviteFromUsersPage}, lt('sendInvite'));


  async function load() {
    state.loading = true;
    state.error = "";
    paint();
    try {
      const out = await callNetlifyFn("list-users", {});
      state.users = out.users || [];
      ADMIN_USERS_CACHE = state.users;
      ADMIN_USERS_CACHE_AT = Date.now();
    } catch (e) {
      state.error = e.message || String(e);
    } finally {
      state.loading = false;
      paint();
    }
  }

  async function toggleRole(u) {
    const makeAdmin = !u.is_admin;
    try {
      await callNetlifyFn("set-user-role", { target_user_id: u.id, make_admin: makeAdmin });
      await load();
    } catch (e) {
      alert(e.message || String(e));
    }
  }

  async function resetPwd(u) {
    if (!confirm(`${lt("resetUserPassword")} : ${u.email} ?`)) return;
    try {
      await callNetlifyFn("reset-user-password", { email: u.email });
      alert("OK: email envoyé.");
    } catch (e) {
      alert(e.message || String(e));
    }
  }

  function paint() {
    setRoot(
      h(
        "div",
        { class: "page" },
        topBar(),
        h("div", { class: "row", style: "align-items:center; justify-content:space-between; margin-bottom:10px" },
          h("div", {}, h("h2", { style: "margin:0" }, lt("usersTitle")), h("div", { class: "muted" }, lt("usersHelp"))),
          h("div", { class: "row", style: "gap:8px" },
            h("button", { class: "btn", onclick: () => (location.hash = "#/") }, "←"),
            h("button", { class: "btn", onclick: load }, lt("refreshUsers"))
          )
        ),
        state.error ? h("div", { class: "card", style: "border:1px solid #a33" }, h("b", {}, "Error: "), state.error) : null,
        h("div", { class: "card" },
          h("div", { class: "h3" }, lt("inviteUserTitle")),
          h("div", { class: "small muted", style: "margin-top:6px" }, lt("adminPanelHelp")),
          h("div", { class: "row", style: "gap:8px; flex-wrap:wrap; margin-top:10px" }, inviteEmailInUsersPage, inviteRoleInUsersPage, inviteBtnInUsersPage),
          inviteMsgInUsersPage
        ),

        state.loading
          ? h("div", { class: "card" }, "Loading…")
          : h(
              "div",
              { class: "card" },
              h("div", { class: "muted", style: "margin-bottom:10px" }, `${state.users.length} users`),
              h(
                "table",
                { style: "width:100%; border-collapse:collapse" },
                h(
                  "thead",
                  {},
                  h(
                    "tr",
                    {},
                    ...["Email", "Role", "Created", "Last sign-in", "Actions"].map((t) =>
                      h("th", { style: "text-align:left; padding:6px; border-bottom:1px solid #333" }, t)
                    )
                  )
                ),
                h(
                  "tbody",
                  {},
                  ...state.users.map((u) =>
                    h(
                      "tr",
                      {},
                      h("td", { style: "padding:6px; border-bottom:1px solid #222" }, u.email || ""),
                      h(
                        "td",
                        { style: "padding:6px; border-bottom:1px solid #222" },
                        u.is_admin ? h("span", { class: "badge" }, "Admin") : h("span", { class: "badge" }, "Auditor")
                      ),
                      h("td", { style: "padding:6px; border-bottom:1px solid #222" }, (u.created_at || "").slice(0, 10)),
                      h("td", { style: "padding:6px; border-bottom:1px solid #222" }, (u.last_sign_in_at || "").slice(0, 10)),
                      h(
                        "td",
                        { style: "padding:6px; border-bottom:1px solid #222" },
                        h("div", { class: "row", style: "gap:8px; flex-wrap:wrap" },
                          h(
                            "button",
                            { class: "btn", onclick: () => toggleRole(u) },
                            u.is_admin ? lt("demoteAdmin") : lt("promoteAdmin")
                          ),
                          h("button", { class: "btn", onclick: () => resetPwd(u) }, lt("resetUserPassword"))
                        )
                      )
                    )
                  )
                )
              )
            )
      )
    );
  }

  paint();
  await load();
}

async function viewAdminBaseUpdate() {
  if (!ONLINE_ENABLED) {
    setRoot(
      h("div", { class: "page" }, topBar(), h("div", { class: "card" }, h("h3", {}, lt("criteriaUpdateTitle")), h("div", { class: "muted" }, "Offline: indisponible.")))
    );
    return;
  }
  if (!AUTH.user) return viewLogin();
  await refreshAdminFlag();
  if (!AUTH.isAdmin) return viewStart();

  let file = null;
  let parsed = null;
  let state = { parsing: false, uploading: false, error: "", version: "Audit M3 Standard 2026.1" };

  async function onParse() {
    if (!file) return alert("Choisis un fichier Excel.");
    state.parsing = true;
    state.error = "";
    paint();
    try {
      parsed = await parseCriteriaExcel(file);
      if (!parsed.length) throw new Error("Aucun critère trouvé (sheet 'Audit' ?)");
    } catch (e) {
      state.error = e.message || String(e);
      parsed = null;
    } finally {
      state.parsing = false;
      paint();
    }
  }

  async function onUpload() {
    if (!parsed || !parsed.length) return alert("Analyse le fichier avant.");
    state.uploading = true;
    state.error = "";
    paint();
    try {
      await callNetlifyFn("update-criteria", { version: state.version, criteria: parsed });
      CRITERIA_DB = null;
      await loadCriteriaDB();
      alert("OK: base mise à jour.");
    } catch (e) {
      state.error = e.message || String(e);
    } finally {
      state.uploading = false;
      paint();
    }
  }

  function onDownload() {
    if (!parsed || !parsed.length) return alert("Analyse le fichier avant.");
    const blob = new Blob([JSON.stringify(parsed, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `criteria_${state.version.replace(/[^a-z0-9]+/gi, "_")}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function paint() {
    setRoot(
      h(
        "div",
        { class: "page" },
        topBar(),
        h("div", { class: "row", style: "align-items:center; justify-content:space-between; margin-bottom:10px" },
          h("div", {}, h("h2", { style: "margin:0" }, lt("criteriaUpdateTitle")), h("div", { class: "muted" }, lt("criteriaUpdateHelp"))),
          h("div", { class: "row", style: "gap:8px" },
            h("button", { class: "btn", onclick: () => (location.hash = "#/") }, "←")
          )
        ),
        state.error ? h("div", { class: "card", style: "border:1px solid #a33" }, h("b", {}, "Error: "), state.error) : null,
                h(
          "div",
          { class: "card" },
          h("div", { class: "row", style: "gap:10px; flex-wrap:wrap; align-items:flex-end" },
            h("div", { style: "min-width:280px" },
              h("div", { class: "muted", style: "margin-bottom:6px" }, lt("versionLabel")),
              h("input", { value: state.version, oninput: (e) => { state.version = e.target.value; }, style: "width:100%" })
            ),
            h("div", {},
              h("div", { class: "muted", style: "margin-bottom:6px" }, lt("chooseExcel")),
              h("input", { type: "file", accept: ".xlsx,.xls", onchange: (e) => { file = e.target.files?.[0] || null; parsed = null; paint(); } })
            ),
            h("button", { class: "btn", onclick: onParse, disabled: state.parsing || !file }, state.parsing ? lt("parsing") : lt("parseExcel")),
            h("button", { class: "btn", onclick: onUpload, disabled: state.uploading || !parsed }, state.uploading ? lt("uploading") : lt("uploadToDb")),
            h("button", { class: "btn", onclick: onDownload, disabled: !parsed }, lt("downloadJson"))
          ),
          h("div", { class: "spacer" }),
          parsed
            ? h("div", { class: "muted" }, `${lt("criteriaCount")}: ${parsed.length}`)
            : h("div", { class: "muted" }, `DB version courante: ${CRITERIA_VERSION || "local"}`)
        ),
// --- Certification levels import ---
        (function(){
          let certFile = null;
          let certParsed = null;
          const count = h("div",{class:"muted"});
          const err = h("div",{class:"small", style:"color:#a33; margin-top:8px"});
          const btnParse = h("button",{class:"btn", disabled:true}, lt("parseCertLevels"));
          const btnUpload = h("button",{class:"btn", disabled:true}, lt("uploadCertLevels"));
        
          const fileInput = h("input",{type:"file", accept:".xlsx,.xls", onchange: (e)=>{
            certFile = e.target.files?.[0] || null;
            certParsed = null;
            err.textContent = "";
            count.textContent = "";
            btnParse.disabled = !certFile;
            btnUpload.disabled = true;
          }});
        
          btnParse.onclick = async ()=>{
            if (!certFile) return;
            err.textContent = "";
            btnParse.disabled = true;
            btnUpload.disabled = true;
            try{
              certParsed = await parseCertLevelsExcel(certFile);
              if (!certParsed.length) throw new Error("Aucun niveau détecté (Executive_Note).");
              count.textContent = `${lt("certLevelsCount")}: ${certParsed.length}`;
              btnUpload.disabled = false;
            }catch(e){
              err.textContent = e.message || String(e);
              certParsed = null;
              count.textContent = "";
              btnUpload.disabled = true;
            }finally{
              btnParse.disabled = !certFile;
            }
          };
        
          btnUpload.onclick = async ()=>{
            if (!certParsed || !certParsed.length) return;
            err.textContent = "";
            btnUpload.disabled = true;
            try{
              await callNetlifyFn("update-cert-levels", { levels: certParsed });
              CERT_LEVELS_CACHE = null;
              await loadCertLevels();
              alert("OK: niveaux mis à jour.");
            }catch(e){
              err.textContent = e.message || String(e);
              btnUpload.disabled = false;
            }
          };
        
          return h("div",{class:"card"},
            h("div",{class:"h2"}, lt("certImportTitle")),
            h("div",{class:"muted"}, lt("certImportHelp")),
            h("div",{class:"row", style:"gap:10px; flex-wrap:wrap; align-items:flex-end; margin-top:10px"},
              h("div",{}, h("div",{class:"muted", style:"margin-bottom:6px"}, lt("chooseExcel")), fileInput),
              btnParse,
              btnUpload,
              count
            ),
            err
          );
        })()
      )
    );

  }

  paint();
}


async function viewAdminAudits(){
  if (!ONLINE_ENABLED) return viewStart();
  if (!AUTH.user) return viewLogin();
  await refreshAdminFlag();
  if (!AUTH.isAdmin) return viewStart();

  let state = { loading: true, error: "", audits: [], selected: null, collabs: [], invites: [] };

  async function loadAudits(){
    state.loading = true; state.error = ""; paint();
    try{
      state.audits = await sbListAudits();
    }catch(e){
      state.error = e.message || String(e);
    }finally{
      state.loading = false;
      paint();
    }
  }

  async function selectAudit(a){
    state.selected = a;
    state.collabs = [];
    state.invites = [];
    paint();
    try{
      const out = await callNetlifyFn("list-audit-collaborators", { audit_id: a.auditId });
      state.collabs = out.collaborators || [];
      state.invites = out.invites || [];
    }catch(e){
      state.error = e.message || String(e);
    }
    paint();
  }

  async function inviteToAudit(){
    if (!state.selected) return;
    const email = prompt((LANG==="en") ? "Invite auditor email:" : "Email de l’auditeur à inviter :");
    if (!email) return;
    const role = prompt((LANG==="en") ? "Role: auditor / viewer / lead" : "Rôle : auditor / viewer / lead", "auditor") || "auditor";
    try{
      await callNetlifyFn("invite-audit-collaborator", { audit_id: state.selected.auditId, email: email.trim(), role: role.trim() });
      await selectAudit(state.selected);
      showToast((LANG==="en") ? "Invite sent" : "Invitation envoyée");
    }catch(e){
      alert(e.message || String(e));
    }
  }

  async function removeCollab(entry){
    if (!state.selected) return;
    if (!confirm((LANG==="en") ? "Remove access?" : "Retirer l’accès ?")) return;
    try{
      await callNetlifyFn("remove-audit-collaborator", { audit_id: state.selected.auditId, user_id: entry.user_id });
      await selectAudit(state.selected);
    }catch(e){
      alert(e.message || String(e));
    }
  }

  async function removeInvite(inv){
    if (!state.selected) return;
    if (!confirm((LANG==="en") ? "Cancel pending invite?" : "Annuler l’invitation en attente ?")) return;
    try{
      await callNetlifyFn("remove-audit-collaborator", { audit_id: state.selected.auditId, email: inv.email });
      await selectAudit(state.selected);
    }catch(e){
      alert(e.message || String(e));
    }
  }

  function paint(){
    const left = h("div",{class:"card"},
      h("div",{class:"row-between"},
        h("div",{}, h("div",{class:"h3"}, (LANG==="en") ? "Audits" : "Audits"), h("div",{class:"small muted"}, (LANG==="en") ? "Manage collaborators per audit." : "Gérer les collaborateurs par audit.")),
        h("div",{class:"row", style:"gap:8px"},
          h("button",{class:"btn", onclick: ()=>go("#/")}, "←"),
          h("button",{class:"btn", onclick: loadAudits}, (LANG==="en") ? "Refresh" : "Rafraîchir")
        )
      ),
      state.loading ? h("div",{class:"small muted", style:"margin-top:10px"}, "Loading…") :
      (state.audits && state.audits.length) ? h("div",{class:"list", style:"margin-top:10px"},
        ...state.audits.map(a=>{
          const meta = a.meta || {};
          const isSel = state.selected && state.selected.auditId === a.auditId;
          const updated = a.updatedAtISO ? new Date(a.updatedAtISO).toLocaleString() : "";
          return h("div",{class:"item row-between", style: isSel ? "border:2px solid var(--primary)" : "", onclick: ()=>selectAudit(a)},
            h("div",{},
              h("div",{class:"h3"}, meta.siteName || "Unnamed site"),
              h("div",{class:"small muted"}, `${meta.auditorName||"-"} • ${updated}${a.ownerUserId ? " • " + (emailForUserId(a.ownerUserId) || String(a.ownerUserId).slice(0,8)+"…") : ""}`)
            ),
            h("div",{class:"small muted"}, a.auditId.slice(0,8)+"…")
          );
        })
      ) : h("div",{class:"small muted", style:"margin-top:10px"}, (LANG==="en") ? "No audits." : "Aucun audit.")
    );

    const right = !state.selected ? h("div",{class:"card"}, h("div",{class:"small muted"}, (LANG==="en") ? "Select an audit to manage access." : "Sélectionnez un audit pour gérer les accès.")) :
      h("div",{class:"card"},
        h("div",{class:"row-between"},
          h("div",{}, h("div",{class:"h3"}, (LANG==="en") ? "Collaborators" : "Collaborateurs"), h("div",{class:"small muted"}, state.selected.meta?.siteName || "")),
          h("button",{class:"btn", onclick: inviteToAudit}, (LANG==="en") ? "Invite" : "Inviter")
        ),
        h("div",{class:"hr"}),
        h("div",{class:"h3", style:"margin-top:6px"}, (LANG==="en") ? "Active" : "Actifs"),
        (state.collabs && state.collabs.length) ? h("div",{class:"list", style:"margin-top:8px"},
          ...state.collabs.map(c=> h("div",{class:"item row-between"},
            h("div",{}, h("div",{class:"h3"}, c.user_email || emailForUserId(c.user_id) || (String(c.user_id).slice(0,8)+"…")), h("div",{class:"small muted"}, `${c.role || "auditor"}`)),
            h("button",{class:"btn btn--ghost", onclick: ()=>removeCollab(c)}, (LANG==="en") ? "Remove" : "Retirer")
          ))
        ) : h("div",{class:"small muted", style:"margin-top:8px"}, (LANG==="en") ? "No collaborators." : "Aucun collaborateur."),
        h("div",{class:"h3", style:"margin-top:14px"}, (LANG==="en") ? "Pending invites" : "Invitations en attente"),
        (state.invites && state.invites.length) ? h("div",{class:"list", style:"margin-top:8px"},
          ...state.invites.filter(x=>!x.accepted_at).map(inv=> h("div",{class:"item row-between"},
            h("div",{}, h("div",{class:"h3"}, inv.email), h("div",{class:"small muted"}, `${inv.role||"auditor"} • ${(inv.created_at?new Date(inv.created_at).toLocaleString():"")}`)),
            h("button",{class:"btn btn--ghost", onclick: ()=>removeInvite(inv)}, (LANG==="en") ? "Cancel" : "Annuler")
          ))
        ) : h("div",{class:"small muted", style:"margin-top:8px"}, (LANG==="en") ? "No pending invites." : "Aucune invitation.")
      );

    setRoot(
      h("div",{},
        topBar({title: (LANG==="en") ? "Admin — Audits" : "Admin — Audits", subtitle: (LANG==="en") ? "Access management" : "Gestion des accès"}),
        state.error ? h("div",{class:"wrap"}, h("div",{class:"card", style:"border:1px solid #a33"}, h("b",{},"Error: "), state.error)) : null,
        h("div",{class:"wrap grid", style:"grid-template-columns: 1fr 1fr; gap:14px"},
          left,
          right
        )
      )
    );
  }

  await loadAudits();
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


// --- Collaboration lock state (online) ---
let lockHeld = false;
let lockInfo = null;
let lockKeepAlive = null;

function setCriterionReadOnly(isRO, reasonText){
  const els = [naChk, naReason, comments, gap, action, evidenceRef, docId];
  els.forEach(el => { try{ el.disabled = !!isRO; }catch(e){} });
  chipBtns.forEach(b => { try{ b.disabled = !!isRO || naChk.checked; }catch(e){} });
  try{ photoInput && (photoInput.disabled = !!isRO); }catch(e){}
  try{ saveBtn && (saveBtn.disabled = !!isRO); }catch(e){}
  if (reasonText) showToast(reasonText);
}

async function ensureCriterionLock(){
  if (!ONLINE_ENABLED) return { ok:true, you:true };
  await refreshAdminFlag();
  if (AUTH.isAdmin) { lockHeld = true; return { ok:true, you:true, admin:true }; }
  try{
    const info = await sbAcquireLock(auditId, criterionId, 120);
    lockInfo = info || null;
    lockHeld = !!(info && info.ok && info.you);
    return info;
  }catch(e){
    lockInfo = null;
    lockHeld = false;
    return null;
  }
}

async function startLockKeepAlive(){
  if (!ONLINE_ENABLED) return;
  await refreshAdminFlag();
  if (AUTH.isAdmin) return;
  if (!lockHeld) return;

  lockKeepAlive = setInterval(async ()=>{
    try{ await sbAcquireLock(auditId, criterionId, 120); }catch(e){}
  }, 60000);

  const onHash = async ()=>{
    const h = location.hash || '';
    if (!h.startsWith(`#/criterion/${auditId}/`)){
      window.removeEventListener('hashchange', onHash);
      if (lockKeepAlive) clearInterval(lockKeepAlive);
      lockKeepAlive = null;
      await sbReleaseLock(auditId, criterionId);
    }
  };
  window.addEventListener('hashchange', onHash);
}


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

if (ONLINE_ENABLED){
  // Online collaboration: save only this criterion via RPC (RLS-safe)
  const li = await ensureCriterionLock();
  if (!AUTH.isAdmin && !(li && li.ok && li.you)){
    const by = li?.lockedByEmail ? ` (${li.lockedByEmail})` : "";
    return alert(`Critère verrouillé par un autre auditeur${by}.`);
  }
  await startLockKeepAlive();
  await sbSetResponse(auditId, criterionId, next.responses[criterionId]);
}else{
  await dbPutAudit(next);
}
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
let photoId = null;

if (ONLINE_ENABLED){
  // Atomic sequence in DB to avoid collisions between collaborators
  try{ photoId = await sbNextPhotoId(auditId); }catch(e){ photoId = computeNextPhotoId(); }
}else{
  photoId = computeNextPhotoId();
  row.photoSeq = (row.photoSeq || 1) + 1;
}

    const blob = f.slice(0, f.size, f.type || "image/jpeg");
    const lines = [
      formatEU(now),
      `${c.facility} • ${c.id}`.slice(0, 80),
      `Photo_ID: ${photoId}`
    ];
    const dataUrl = await watermarkDataUrl(blob, lines);

    let photoUrl = null;
    if (ONLINE_ENABLED){
      try{ photoUrl = await sbUploadPhoto(auditId, c.id, photoId, dataUrl, null); }catch(e){ photoUrl = null; }
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

if (ONLINE_ENABLED){
  const li = await ensureCriterionLock();
  if (!AUTH.isAdmin && !(li && li.ok && li.you)){
    const by = li?.lockedByEmail ? ` (${li.lockedByEmail})` : "";
    return alert(`Critère verrouillé par un autre auditeur${by}.`);
  }
  await startLockKeepAlive();
  await sbSetResponse(auditId, criterionId, next.responses[criterionId]);
}else{
  await dbPutAudit(next);
}

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
  const homeBtn = h("button",{onclick: ()=> go("#/")}, t("home"));
  
const saveBtn = h("button",{class:"primary", onclick: onSave}, t("saveNext"));


// Acquire criterion lock (online) so that only one auditor edits at a time.
if (ONLINE_ENABLED){
  const li = await ensureCriterionLock();
  if (!AUTH.isAdmin && !(li && li.ok && li.you)){
    const by = li?.lockedByEmail ? ` (${li.lockedByEmail})` : "";
    setCriterionReadOnly(true, `Verrouillé${by}`);
  }else{
    await startLockKeepAlive();
  }
}


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
        right: h("div",{class:"row"},
          h("button",{onclick:()=>go("#/")}, t("home")),
          h("button",{onclick:()=>go(`#/audit/${auditId}`)}, t("back"))
        )}),
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

  // Non‑conformités
  const certLevels = await loadCertLevels();
  const certRes = computeCertification(overall.pct, byPillar, certLevels);
  const certLabel = certRes.best ? certRes.best.display_name : t("certNotQualified");
  const pillarMinPct = certRes.minPillar * 100;

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
    const html = buildReportHTML(row, dbData, LANG, overall, byPillar, byFacility, ncItems, criteria.length, auditedFacilities, certLabel, pillarMinPct);
    const fn = `M3_Report_${(row.meta.siteName||"site").replaceAll(" ","_")}.html`;
    downloadText(fn, html, "text/html");
  }}, t("exportHtml"));

  const exportHTMLClientBtn = h("button",{onclick: async ()=>{
    try{
      const apItems = await sbListActionPlanItems(auditId).catch(()=>[]);
      const html = buildReportHTMLClientV2(row, dbData, LANG, overall, byPillar, byFacility, ncItems, criteria.length, auditedFacilities, certLabel, pillarMinPct, apItems, criteria, responses);
      const fn = `M3_Report_Client_${(row.meta.siteName||"site").replaceAll(" ","_")}.html`;
      downloadText(fn, html, "text/html");
    }catch(e){
      alert((e && e.message) ? e.message : String(e));
    }
  }}, t("exportHtmlClient"));


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

  // Non‑conformités with filters
  const ncState = { facility:"", pillar:"", lvl:"" };
  const ncFacilities = Array.from(new Set(ncItems.map(it=> it.c.facility || ""))).filter(Boolean).sort();
  const ncPillars = Array.from(new Set(ncItems.map(it=> it.c.pillar || ""))).filter(Boolean).sort();
  const ncLvls = Array.from(new Set(ncItems.map(it=> it.lvl || ""))).filter(Boolean);

  const ncList = h("div",{class:"list"});

  function buildSelect(label, options, onChange){
    const sel = h("select",{onchange:(e)=>onChange(e.target.value)},
      h("option",{value:""}, lt("all")),
      ...options.map(v=> h("option",{value:v}, v))
    );
    return h("div",{}, h("div",{class:"muted", style:"margin-bottom:6px"}, label), sel);
  }

  function renderNC(){
    ncList.innerHTML = "";
    const filtered = ncItems.filter(it =>
      (!ncState.facility || (it.c.facility||"")===ncState.facility) &&
      (!ncState.pillar || (it.c.pillar||"")===ncState.pillar) &&
      (!ncState.lvl || (it.lvl||"")===ncState.lvl)
    );
    if (!filtered.length){
      ncList.appendChild(h("div",{class:"small muted", style:"padding-top:10px"}, t("noNC")));
      return;
    }
    for (const it of filtered){
      const photos = (it.r.photos||[]).map(p=> p.photoId).join(", ") || "—";
      ncList.appendChild(
        h("div",{class:"item"},
          h("div",{class:"row-between"},
            h("div",{class:"h3"}, `${it.c.id} — ${it.c.title}`),
            h("span",{class: tagClass(it.lvl)}, it.lvl)
          ),
          h("div",{class:"small muted"}, `${it.c.facility} • ${it.c.pillar} • ${it.c.parentGroup}`),
          h("div",{class:"small", style:"margin-top:8px; white-space:pre-wrap"}, it.r.gapObserved || ""),
          h("div",{class:"small", style:"margin-top:8px; white-space:pre-wrap"}, it.r.action ? ((LANG==="en" ? "Action: " : "Action : ") + it.r.action) : ""),
          h("div",{class:"small muted", style:"margin-top:6px"}, `${LANG==="en" ? "Photos" : "Photos"}: ${photos}`)
        )
      );
    }
  }

  const ncFilters = h("div",{class:"row", style:"gap:10px; flex-wrap:wrap; align-items:flex-end; margin-bottom:10px"},
    buildSelect(lt("ncFilterFacility"), ncFacilities, (v)=>{ ncState.facility=v; renderNC(); }),
    buildSelect(lt("ncFilterPillar"), ncPillars, (v)=>{ ncState.pillar=v; renderNC(); }),
    buildSelect(lt("ncFilterLevel"), ncLvls, (v)=>{ ncState.lvl=v; renderNC(); })
  );

  const ncWrap = h("div",{}, ncFilters, ncList);
  renderNC();
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

  // Action plan (editable)
  let apItems = [];
  try{
    apItems = await sbListActionPlanItems(auditId);
  }catch(e){
    apItems = [];
  }
  if (!Array.isArray(apItems)) apItems = [];
  apItems.sort((a,b)=> (a.sort_order||0) - (b.sort_order||0));

  const apState = { items: apItems.map(x=>({...x})) };

  function addActionRow(){
    apState.items.push({
      id: (globalThis.crypto && globalThis.crypto.randomUUID) ? globalThis.crypto.randomUUID() : String(Math.random()).slice(2),
      audit_id: auditId,
      sort_order: apState.items.length + 1,
      horizon: "",
      priority: "",
      pillar: "",
      facility: "",
      action: "",
      owner: "",
      due_date: "",
      budget: "",
      status: ""
    });
    renderActionPlan();
  }

  async function saveActionPlan(){
    try{
      const payload = apState.items.map((it, idx)=>({
        id: it.id,
        audit_id: auditId,
        sort_order: idx + 1,
        horizon: it.horizon || "",
        priority: it.priority || "",
        pillar: it.pillar || "",
        facility: it.facility || "",
        action: it.action || "",
        owner: it.owner || "",
        due_date: it.due_date || null,
        budget: it.budget || "",
        status: it.status || "",
        created_by: CURRENT_USER?.id || null
      }));
      await sbUpsertActionPlanItems(payload);
      showToast(t("saved"));
    }catch(e){
      alert((e && e.message) ? e.message : String(e));
    }
  }

  const apList = h("div",{});
  function renderActionPlan(){
    apList.innerHTML = "";
    const head = h("div",{class:"row-between", style:"align-items:center; gap:10px; flex-wrap:wrap"},
      h("div",{class:"small muted"}, t("actionPlanHint")),
      h("div",{class:"row", style:"gap:10px; flex-wrap:wrap"},
        h("button",{onclick:addActionRow}, t("addRow")),
        h("button",{class:"primary", onclick:saveActionPlan}, t("saveActionPlan"))
      )
    );
    apList.appendChild(head);

    if (!apState.items.length){
      apList.appendChild(h("div",{class:"small muted", style:"margin-top:10px"}, "—"));
      return;
    }

    const table = h("table",{style:"margin-top:10px"});
    table.appendChild(h("thead",{},
      h("tr",{},
        h("th",{}, "Horizon"),
        h("th",{}, "Prio"),
        h("th",{}, "Pillar"),
        h("th",{}, "Facility"),
        h("th",{}, "Action"),
        h("th",{}, "Owner"),
        h("th",{}, "Due"),
        h("th",{}, "Budget"),
        h("th",{}, "Status")
      )
    ));

    const tbody = h("tbody",{});
    apState.items.forEach((it, idx)=>{
      const inTxt = (key, ph="") => h("input",{value: it[key]||"", placeholder: ph, oninput:(e)=>{ it[key]=e.target.value; }});
      const inArea = (key, ph="") => h("textarea",{style:"min-height:46px; width:100%; resize:vertical", placeholder: ph, oninput:(e)=>{ it[key]=e.target.value; }}, it[key]||"");
      const inDate = (key) => h("input",{type:"date", value: it[key]||"", oninput:(e)=>{ it[key]=e.target.value; }});

      tbody.appendChild(h("tr",{},
        h("td",{}, inTxt("horizon","0–90d")),
        h("td",{}, inTxt("priority","P1")),
        h("td",{}, inTxt("pillar","Innovation")),
        h("td",{}, inTxt("facility","Marina")),
        h("td",{}, inArea("action","Action…")),
        h("td",{}, inTxt("owner","Owner")),
        h("td",{}, inDate("due_date")),
        h("td",{}, inTxt("budget","€")),
        h("td",{}, inTxt("status","Open"))
      ));
    });
    table.appendChild(tbody);
    apList.appendChild(table);
  }
  renderActionPlan();



  const root = h("div",{},
    topBar({
      title: `${t("reportTitle")} — ${row.meta.siteName}`,
      subtitle: `${t("auditorLabel")}: ${row.meta.auditorName} • ${t("facilities")}: ${(auditedFacilities && auditedFacilities.length) ? auditedFacilities.join(", ") : t("all")} • ${t("overallWeightedScore")}: ${overall.pct.toFixed(2)}%`,
      right: h("div",{class:"row"}, backBtn, exportJsonBtn, exportExcelBtn, exportHTMLBtn, exportHTMLClientBtn, shareBtn, printBtn)
    }),
    h("div",{class:"wrap grid", style:"gap:12px"},
      h("div",{class:"card"},
        h("div",{class:"h1", style:"font-size:44px;font-weight:900;letter-spacing:-0.02em;line-height:1.05;margin:0;text-align:center"}, certLabel),
        h("div",{class:"small muted", style:"text-align:center;margin-top:6px;margin-bottom:14px"}, `${t("certPillarMinLabel")}: ${pillarMinPct.toFixed(2)}% • ${t("overallWeightedScore")}: ${overall.pct.toFixed(2)}%`),
        h("div",{class:"h2"}, t("reportSummary")),
        h("div",{class:"row", style:"margin-top:10px"},
          h("span",{class:"pill"}, `${t("criteriaLabel")}: ${criteria.length}`),
          h("span",{class:"pill"}, `${t("ncLabel")}: ${ncItems.length}`),
          h("span",{class:"pill"}, `${t("certLevelLabel")}: ${certLabel}`),
          h("span",{class:"pill"}, `${t("certPillarMinLabel")}: ${pillarMinPct.toFixed(2)}%`),

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
      h("div",{class:"card"},
        h("div",{class:"h2"}, t("actionPlanTitle")),
        h("div",{style:"margin-top:10px"}, apList)
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
      topBar({title: t('publicReportTitle'), subtitle: t('publicReportInvalidSubtitle'), right: h('div',{class:'row'}, h('button',{onclick:()=>go('#/')}, t('home')), h('a',{class:'btn', href:'#/login'}, t('signIn')) )}),
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

  const certLevels = await loadCertLevels();
  const certRes = computeCertification(overall.pct, byPillar, certLevels);
  const certLabel = certRes.best ? certRes.best.display_name : t("certNotQualified");
  const pillarMinPct = certRes.minPillar * 100;

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

  // Non‑conformités with filters
  const ncState = { facility:"", pillar:"", lvl:"" };
  const ncFacilities = Array.from(new Set(ncItems.map(it=> it.c.facility || ""))).filter(Boolean).sort();
  const ncPillars = Array.from(new Set(ncItems.map(it=> it.c.pillar || ""))).filter(Boolean).sort();
  const ncLvls = Array.from(new Set(ncItems.map(it=> it.lvl || ""))).filter(Boolean);

  const ncList = h('div',{class:'list'});

  function buildSelect(label, options, onChange){
    const sel = h('select',{onchange:(e)=>onChange(e.target.value)},
      h('option',{value:''}, lt('all')),
      ...options.map(v=> h('option',{value:v}, v))
    );
    return h('div',{}, h('div',{class:'muted', style:'margin-bottom:6px'}, label), sel);
  }

  function renderNC(){
    ncList.innerHTML = "";
    const filtered = ncItems.filter(it =>
      (!ncState.facility || (it.c.facility||"")===ncState.facility) &&
      (!ncState.pillar || (it.c.pillar||"")===ncState.pillar) &&
      (!ncState.lvl || (it.lvl||"")===ncState.lvl)
    );
    if (!filtered.length){
      ncList.appendChild(h('div',{class:'small muted', style:'padding-top:10px'}, t('noNC')));
      return;
    }
    for (const it of filtered){
      const photos = (it.r.photos||[]).map(p=> p.photoId).join(", ") || "—";
      ncList.appendChild(
        h('div',{class:'item'},
          h('div',{class:'row-between'},
            h('div',{class:'h3'}, `${it.c.id} — ${it.c.title}`),
            h('span',{class: tagClass(it.lvl)}, it.lvl)
          ),
          h('div',{class:'small muted'}, `${it.c.facility} • ${it.c.pillar} • ${it.c.parentGroup}`),
          h('div',{class:'small', style:'margin-top:8px; white-space:pre-wrap'}, it.r.gapObserved || ""),
          h('div',{class:'small', style:'margin-top:8px; white-space:pre-wrap'}, it.r.action ? ((LANG==='en'?'Action: ':'Action : ')+it.r.action) : ""),
          h('div',{class:'small muted', style:'margin-top:6px'}, `Photos: ${photos}`)
        )
      );
    }
  }

  const ncFilters = h('div',{class:'row', style:'gap:10px; flex-wrap:wrap; align-items:flex-end; margin-bottom:10px'},
    buildSelect(lt('ncFilterFacility'), ncFacilities, (v)=>{ ncState.facility=v; renderNC(); }),
    buildSelect(lt('ncFilterPillar'), ncPillars, (v)=>{ ncState.pillar=v; renderNC(); }),
    buildSelect(lt('ncFilterLevel'), ncLvls, (v)=>{ ncState.lvl=v; renderNC(); })
  );

  const ncWrap = h('div',{}, ncFilters, ncList);
  renderNC();
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
    const html = buildReportHTML(audit, dbData, LANG, overall, byPillar, byFacility, ncItems, criteria.length, auditedFacilities, certLabel, pillarMinPct);
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
        h('div',{class:'h1', style:'font-size:44px;font-weight:900;letter-spacing:-0.02em;line-height:1.05;margin:0;text-align:center'}, certLabel),
        h('div',{class:'small muted', style:'text-align:center;margin-top:6px;margin-bottom:14px'}, `${t('certPillarMinLabel')}: ${pillarMinPct.toFixed(2)}% • ${t('overallWeightedScore')}: ${overall.pct.toFixed(2)}%`),
        h('div',{class:'h2'}, t('reportSummary')),
        h('div',{class:'row', style:'margin-top:10px'},
          h('span',{class:'pill'}, `${t('criteriaLabel')}: ${criteria.length}`),
          h('span',{class:'pill'}, `${t('ncLabel')}: ${ncItems.length}`),
        h('span',{class:'pill'}, `${t('certLevelLabel')}: ${certLabel}`),
        h('span',{class:'pill'}, `${t('certPillarMinLabel')}: ${pillarMinPct.toFixed(2)}%`),

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

function buildReportHTML(audit, dbData, lang, overall, byPillar, byFacility, ncItems, criteriaCount, auditedFacilities, certLabel, pillarMinPct){
  const L = (lang === "en") ? "en" : "fr";
  const dict = I18N[L] || I18N.fr;
  const lt = (k)=> (dict && dict[k]) ? dict[k] : (I18N.fr[k] || k);
  // Short criterion label helper (global): criterionShortTitle(c)

const created = audit.meta?.createdAtISO ? new Date(audit.meta.createdAtISO).toLocaleString() : "";
  const updated = audit.updatedAtISO ? new Date(audit.updatedAtISO).toLocaleString() : "";

  const certTitle = (certLabel !== undefined && certLabel !== null) ? String(certLabel) : "";
  const pillarMinStr = (pillarMinPct !== undefined && pillarMinPct !== null && isFinite(Number(pillarMinPct))) ? `${Number(pillarMinPct).toFixed(2)}%` : "";

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
<title>${esc(lt("appTitle"))} — ${esc(lt("reportTitle"))}</title><style>${css}
/* Prevent content being cut between pages */
.page{ height:auto; min-height:297mm; overflow: visible; }
@media print{
  .page{ height:297mm; overflow:hidden; }
  table{ page-break-inside:auto; }
  thead{ display:table-header-group; }
  tfoot{ display:table-footer-group; }
  tr, td, th{ page-break-inside: avoid; break-inside: avoid-page; }
  .card, .editor{ break-inside: avoid; page-break-inside: avoid; }
}

</style></head>
<body>
  <h1>${esc(lt("reportTitle"))} — ${esc(audit.meta.siteName)}</h1>
  <div class="muted">${esc(lt("auditorLabel"))}: ${esc(audit.meta.auditorName)} • ${esc(lt("facilities"))}: ${esc((auditedFacilities && auditedFacilities.length) ? auditedFacilities.join(", ") : lt("all"))} • ${esc(L==="en"?"Created":"Créé")}: ${esc(created)} • ${esc(L==="en"?"Updated":"Mis à jour")}: ${esc(updated)}</div>

  <div class="section">
    ${certTitle ? `<div style="font-size:44px;font-weight:900;letter-spacing:-0.02em;line-height:1.05;margin:0;text-align:center">${esc(certTitle)}</div>` : ""}
    ${(certTitle && pillarMinStr) ? `<div style="text-align:center;margin-top:6px;margin-bottom:14px;color:#556">${esc(lt("certPillarMinLabel"))}: ${esc(pillarMinStr)} • ${esc(lt("overallWeightedScore"))}: ${esc(Number(overall.pct).toFixed(2))}%</div>` : ""}
    <h2>${esc(lt("reportSummary"))}</h2>
    <div>
      <span class="pill">${esc(lt("criteriaLabel"))}: ${criteriaCount}</span>
      <span class="pill">${esc(lt("ncLabel"))}: ${ncItems.length}</span>
      <span class="pill">${esc(lt("certLevelLabel"))}: ${esc(certTitle || lt("certNotQualified"))}</span>
      ${pillarMinStr ? `<span class="pill">${esc(lt("certPillarMinLabel"))}: ${esc(pillarMinStr)}</span>` : ""}
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

function buildReportHTMLClientV2(audit, dbData, lang, overall, byPillar, byFacility, ncItems, criteriaCount, auditedFacilities, certLabel, pillarMinPct, actionPlanItems, criteria, responses){
  const t0 = (k)=> (I18N?.[lang]?.[k] || I18N?.en?.[k] || k);

  // Map criteria by id for fast lookup
  const critById = {};
  (criteria||[]).forEach(c=>{
    const id = c.id || c.criterion_id || c.code;
    if (id) critById[String(id)] = c;
  });


  // Normalize inputs (overall can be {pct:..}, ncItems can be [{c,r,lvl}] or already normalized)
  const overallPct = (overall && typeof overall === "object") ? Number(overall.pct) : Number(overall);
  const minPillarPct = Number(pillarMinPct);

  const normNc = (ncItems||[]).map(nc=>{
    // Shape from viewReport: { c, r, lvl }
    if (nc && nc.c){
      const c = nc.c || {};
      const r = nc.r || {};
      const id = String(c.id || c.criterion_id || c.code || "");
      const title = String(c.title_short || c.short_title || c.shortTitle || c.title || c.name || id).trim();
      const facility = String(c.facility || c.facility_key || c.facilityKey || (Array.isArray(c.facilities)? c.facilities[0] : "") || "");
      const pillar = String(c.pillar || c.pillar_key || c.pillarKey || "");
      const level = String(nc.lvl || nc.level || nc.ncLevel || "Observation");
      const finding = String(r.finding || r.gap || r.observation || r.comment || r.note || "");
      const recommendation = String(r.recommendation || r.reco || r.action || r.rec || "");
      const evidence = String(r.evidence || r.proof || r.attachments || r.files || "");
      return { id, title, facility, pillar, level, finding, recommendation, evidence };
    }
    // Already-normalized shape
    const id = String(nc.id || nc.criterion_id || nc.code || "");
    const title = String(nc.title || nc.shortTitle || nc.title_short || id).trim();
    const facility = String(nc.facility || nc.facility_key || "");
    const pillar = String(nc.pillar || nc.pillar_key || "");
    const level = String(nc.level || nc.lvl || "Observation");
    const finding = String(nc.finding || nc.gap || nc.observation || "");
    const recommendation = String(nc.recommendation || nc.reco || nc.action || nc.rec || "");
    const evidence = String(nc.evidence || nc.proof || "");
    return { id, title, facility, pillar, level, finding, recommendation, evidence };
  });

  // Pull a score from response (handles multiple shapes)
  function getScoreForCriterion(criterionId){
    // Supports both shapes:
    // 1) object map: responses[criterionId] = { score, na, ... }
    // 2) array: [{ criterion_id, score, ... }]
    const key = String(criterionId);
    let r = null;

    if (responses && typeof responses === "object" && !Array.isArray(responses)){
      r = responses[key] || responses[Number.isFinite(+key) ? +key : key] || null;
    } else if (Array.isArray(responses)){
      r = responses.find(x => String(x?.criterion_id||x?.criterionId||x?.id) === key) || null;
    }

    if (!r || r.na) return null;
    const s = (r.score ?? r.value ?? r.rating ?? r.answer_score);
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }

  function pct(n){
    const x = Number(n);
    if (!Number.isFinite(x)) return "0%";
    // Accept both [0..1] and [0..100] inputs
    const val = (x <= 1.2) ? (x * 100) : x;
    return `${Math.round(val)}%`;
  }

  function levelTag(level){
    const l = String(level||"").toLowerCase();
    if (l.includes("major")) return "major";
    if (l.includes("minor")) return "minor";
    if (l.includes("obs")) return "obs";
    return "obs";
  }

  // ---------- Per-pillar Top5 ----------
  function top5ForPillar(pillarKey){
    const pool = (criteria||[]).filter(c => String(c.pillar||c.pillar_key||"").toLowerCase() === String(pillarKey||"").toLowerCase());
    const scored = pool.map(c=>{
      const id = c.id || c.criterion_id || c.code;
      const score = id ? getScoreForCriterion(id) : null;
      return { c, id: id ? String(id) : "", score: (score==null? -1 : score) };
    }).filter(x=>x.score>=0);
    scored.sort((a,b)=> b.score - a.score);
    return scored.slice(0,5);
  }

  // ---------- Per-pillar NC list (stacked below Top5) ----------
  function ncForPillar(pillarKey){
    return (normNc||[]).filter(nc => String(nc.pillar||nc.pillar_key||"").toLowerCase() === String(pillarKey||"").toLowerCase());
  }

  // Pagination for NC table (client report)
  const MAX_NC_ROWS_PER_PAGE = 10;

  // Normalize byPillar input:
// - viewReport provides an ARRAY: [{ label, pct, ... }, ...]
// - older code may provide an OBJECT map keyed by pillar
const pillarArr = Array.isArray(byPillar)
  ? byPillar.map((p,i)=>({ ...(p||{}), __key: (p?.key || p?.pillar || p?.label || String(i)) }))
  : Object.keys(byPillar||{}).map((k,i)=>({ ...(byPillar[k]||{}), __key: k, label: (byPillar[k]?.label || k) }));

// Stable order (uses sort_order if present, else keep array order)
pillarArr.sort((a,b)=>{
  const A = a?.sort_order ?? a?.sortOrder ?? 999;
  const B = b?.sort_order ?? b?.sortOrder ?? 999;
  if (A!==B) return A-B;
  // If no explicit sort_order, keep original order for arrays (using __key fallback)
  return String(a?.label||a?.__key||"").localeCompare(String(b?.label||b?.__key||""));
});

const pillarKeys = pillarArr.map(p => String(p?.label || p?.__key || "")); // use LABEL for matching criteria/nc

  const siteName = audit?.meta?.siteName || audit?.meta?.site || audit?.siteName || "Site";
  const auditId = audit?.id || audit?.audit_id || "";
  const auditDate = audit?.meta?.date || audit?.meta?.auditDate || "";

  const css = `
  <style>
    :root{
      --ink:#0f172a; --muted:#64748b; --line:#e2e8f0; --bg:#f4f7fb; --card:#fff;
      --accent:#1d5d86; --accent2:#0ea5e9; --ok:#16a34a; --warn:#f59e0b; --bad:#ef4444;
      --radius:16px; --shadow:0 10px 30px rgba(2,6,23,.08);
      --font: Inter, "Segoe UI", Roboto, Arial, sans-serif; --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }
    *{box-sizing:border-box}
    body{margin:0;font-family:var(--font);color:var(--ink);background:var(--bg)}
    .page{width:210mm;height:297mm;margin:16px auto;background:var(--card);border:1px solid var(--line);border-radius:18px;box-shadow:var(--shadow);overflow:hidden;position:relative}
    .header{position:absolute;top:0;left:0;right:0;height:14mm;border-bottom:1px solid var(--line);background:linear-gradient(90deg, rgba(29,93,134,.14), rgba(14,165,233,.06));display:flex;align-items:center;gap:12px;padding:0 14mm}
    .logo{width:32px;height:32px;border-radius:12px;background:rgba(29,93,134,.18);display:grid;place-items:center;color:var(--accent);font-weight:900}
    .header-title{display:flex;flex-direction:column;line-height:1.05}
    .header-title .top{font-size:11px;color:var(--muted);font-weight:700}
    .header-title .main{font-size:13px;font-weight:900}
    .header-meta{margin-left:auto;text-align:right;font-size:11px;color:var(--muted)}
    .page-inner{padding:16mm 14mm 12mm 14mm;position:absolute;top:14mm;left:0;right:0;bottom:0;display:flex;flex-direction:column;gap:10px}
    h1{margin:0;font-size:28px}
    h2{margin:0;font-size:16px;color:var(--accent)}
    .subtitle{font-size:12px;color:var(--muted);font-weight:750;margin-top:2px}
    .title-big{font-size:34px;font-weight:1000;letter-spacing:.02em}
    .pill{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--line);background:rgba(2,6,23,.02);padding:7px 11px;border-radius:999px;font-size:12px;font-weight:800}
    .pill .dot{width:10px;height:10px;border-radius:999px;background:var(--accent)}
    .pill.ok .dot{background:var(--ok)} .pill.warn .dot{background:var(--warn)} .pill.bad .dot{background:var(--bad)}
    .pill .k{color:var(--muted);font-weight:800} .pill .v{font-weight:950}
    .grid{display:grid;gap:10px}
    .grid.cols-2{grid-template-columns:1fr 1fr}
    .grid.cols-3{grid-template-columns:1fr 1fr 1fr}
    .card{border:1px solid var(--line);border-radius:var(--radius);background:var(--card);padding:12px}
    .card.soft{background:linear-gradient(180deg, rgba(29,93,134,.06), rgba(2,6,23,0))}
    table{width:100%;border-collapse:separate;border-spacing:0;font-size:12px}
    th,td{border-bottom:1px solid var(--line);padding:8px 9px;vertical-align:top}
    th{color:var(--muted);text-transform:uppercase;letter-spacing:.08em;font-size:10px;text-align:left}
    tr:last-child td{border-bottom:none}
    .tag{display:inline-flex;align-items:center;padding:4px 9px;border-radius:999px;border:1px solid var(--line);font-weight:900;font-size:11px;background:rgba(2,6,23,.02);white-space:nowrap}
    .tag.major{border-color:rgba(239,68,68,.35);background:rgba(239,68,68,.10);color:#991b1b}
    .tag.minor{border-color:rgba(245,158,11,.35);background:rgba(245,158,11,.12);color:#92400e}
    .tag.obs{border-color:rgba(29,93,134,.35);background:rgba(29,93,134,.10);color:#0b3d5a}
    .bar{height:10px;border-radius:999px;background:rgba(2,6,23,.06);overflow:hidden}
    .bar>span{display:block;height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));width:0%}
    .row{display:flex;align-items:center;justify-content:space-between;gap:12px}
    .muted{color:var(--muted)}
    @media print{
      body{background:#fff}
      .page{box-shadow:none;border:none;border-radius:0;margin:0;width:auto}
      .page{page-break-after:always}
      .page:last-child{page-break-after:auto}
    }
  </style>`;

  function pageHeader(main, meta){
    return `
      <div class="header">
        <div class="logo">M3</div>
        <div class="header-title">
          <div class="top">M3 Smart Sustainable Standard — Audit Report</div>
          <div class="main">${escHtml(main||"")}</div>
        </div>
        <div class="header-meta">${escHtml(meta||"").replaceAll("\n","<br/>")}</div>
      </div>`;
  }

  // ---------- Pages ----------
  const pages = [];

  // Page: Decision
  pages.push(`
  <section class="page">
    ${pageHeader(`${siteName} — Certification Decision`, `Audit ID: ${String(auditId||"")}
${String(auditDate||"")}`)}
    <div class="page-inner">
      <div class="pill ok"><span class="dot"></span><span class="k">Certification level</span><span class="v">${escHtml(String(certLabel||""))}</span></div>
      <div>
        <div class="title-big">${escHtml(String(certLabel||"").toUpperCase())} CERTIFICATION</div>
        <div class="subtitle">Dual-threshold rule: overall floor + minimum pillar floor.</div>
      </div>
      <div class="grid cols-2">
        <div class="card soft">
          <h2>Score summary</h2>
          <div class="subtitle">Overall and minimum pillar check</div>
          <div style="height:8px"></div>
          <table>
            <tr><th style="width:42%">Overall</th><td><b>${escHtml(pct((overall && typeof overall==="object") ? (overall.pct ?? overall.overallPct ?? overall.overall ?? overallPct) : overallPct))}</b></td></tr>
            <tr><th>Minimum pillar</th><td><b>${escHtml(pct(pillarMinPct||0))}</b></td></tr>
            <tr><th>Criteria</th><td><b>${escHtml(String(criteriaCount||0))}</b></td></tr>
          </table>
        </div>
        <div class="card">
          <h2>Scope & Next steps</h2>
          <div class="subtitle">${escHtml((auditedFacilities||[]).join(" • "))}</div>
          <div style="height:8px"></div>
          <table>
            <tr><th style="width:42%">Validity</th><td><b>36 months</b> — Surveillance M12/M24</td></tr>
            <tr><th>Conditions</th><td>Close Major NC within 60 days + evidence pack.</td></tr>
            <tr><th>Deliverables</th><td>Report • Action plan • Evidence register</td></tr>
          </table>
        </div>
      </div>
    </div>
  </section>`);

  // Page: Pillar dashboard (compact)
  const pillarRows = pillarArr.map(p=>{
    const label = String(p?.label || p?.__key || "");
    const pctVal = Number(p?.pct ?? p?.scorePct ?? p?.score ?? 0);

    // Compute NC counts from normalized NC list (source of truth)
    const ncs = (normNc||[]).filter(nc => String(nc?.pillar||"").toLowerCase() === label.toLowerCase());
    const nMaj = ncs.filter(nc => String(nc.level||"").toLowerCase().includes("major")).length;
    const nMin = ncs.filter(nc => String(nc.level||"").toLowerCase().includes("minor")).length;
    const nObs = Math.max(0, ncs.length - nMaj - nMin);

    const barW = Math.max(0, Math.min(100, Math.round(pctVal))); // pctVal is already 0..100
    return `
      <tr>
        <td><b>${escHtml(label)}</b><div class="muted">${escHtml(String(p.criteriaCount||""))}</div></td>
        <td><div class="muted" style="font-weight:900">${escHtml(pct(pctVal))}</div><div class="bar"><span style="width:${barW}%"></span></div></td>
        <td>
          ${nMaj?`<span class="tag major">Major ${escHtml(String(nMaj))}</span> `:""}
          ${nMin?`<span class="tag minor">Minor ${escHtml(String(nMin))}</span> `:""}
          ${nObs?`<span class="tag obs">Obs ${escHtml(String(nObs))}</span>`:""}
        </td>
        <td><span class="tag ok">≥${escHtml(pct(minPillarPct))}</span></td>
      </tr>`;
  }).join("");

  pages.push(`
  <section class="page">
    ${pageHeader("Pillar Dashboard", "")}
    <div class="page-inner">
      <h1>Pillar Dashboard</h1>
      <div class="subtitle">Scores by pillar (floors) and NC distribution.</div>
      <div class="card">
        <table>
          <tr><th style="width:34%">Pillar</th><th style="width:24%">Score</th><th style="width:30%">NC count</th><th>Floor</th></tr>
          ${pillarRows}
        </table>
      </div>
      <div class="muted" style="font-size:11px">Next pages: per-pillar deep-dive (Top 5 + NC & recommendations).</div>
    </div>
  </section>`);

  // Pages: Per pillar deep-dive (Step B)
  pillarKeys.forEach(pk=>{
    const label = String(pk||"");
    const p = pillarArr.find(x => String(x?.label||x?.__key||"") === label) || {};
    const pPct = Number(p.pct ?? p.scorePct ?? p.score ?? 0);

    const top5 = top5ForPillar(pk);
    const top5Rows = top5.map(x=>{
      const title = criterionShortTitle(x.c) || criterionShortTitle({title: x.c?.title || x.c?.criterion || x.c?.name});
      const facility = x.c?.facility || x.c?.facility_name || x.c?.facilityKey || x.c?.facility_key || "—";
      return `<tr>
        <td style="font-family:var(--mono)">${escHtml(x.id)}</td>
        <td>${escHtml(title)}</td>
        <td>${escHtml(String(facility))}</td>
        <td><span class="tag ok">${escHtml(String(x.score))}</span></td>
      </tr>`;
    }).join("");

    const ncs = ncForPillar(pk);
    const chunks = [];
    for (let i=0;i<ncs.length;i+=MAX_NC_ROWS_PER_PAGE){
      chunks.push(ncs.slice(i, i+MAX_NC_ROWS_PER_PAGE));
    }
    if (chunks.length===0) chunks.push([]);

    chunks.forEach((chunk, idx)=>{
      const ncRows = chunk.map(nc=>{
        const cid = nc.criterion_id || nc.criterionId || nc.criterion || nc.id;
        const c = cid ? critById[String(cid)] : null;
        const title = c ? criterionShortTitle(c) : (cid ? String(cid) : "—");
        const level = nc.level || nc.nc_level || nc.severity || "Observation";
        const tagCls = levelTag(level);
        const finding = nc.finding || nc.gap || nc.observation || "";
        const rec = nc.recommendation || nc.reco || nc.action || "";
        const ev = nc.evidence || nc.expected_evidence || "";
        return `<tr>
          <td>
            <b>${escHtml(title)}</b>
            <div class="muted" style="font-family:var(--mono);font-size:11px">${escHtml(String(cid||""))}</div>
          </td>
          <td><span class="tag ${tagCls}">${escHtml(String(level))}</span></td>
          <td>
            ${finding?`<b>Finding:</b> ${escHtml(String(finding))}<br/>`:""}
            ${rec?`<b>Recommendation:</b> ${escHtml(String(rec))}<br/>`:""}
            ${ev?`<div class="muted" style="margin-top:4px">Evidence: ${escHtml(String(ev))}</div>`:""}
          </td>
        </tr>`;
      }).join("");

      const cont = (idx>0);
      pages.push(`
      <section class="page">
        ${pageHeader(`Pillar Deep‑Dive — ${label}`, cont ? `Non‑conformités — suite (${idx+1}/${chunks.length})` : ``)}
        <div class="page-inner">
          <div class="row" style="align-items:flex-end">
            <div>
              <h1>${escHtml(label)}</h1>
              <div class="subtitle">Top 5 + NC & recommendations (per pillar).</div>
            </div>
            <div class="pill ${pPct>=pillarMinPct ? "ok":"warn"}"><span class="dot"></span><span class="k">Pillar score</span><span class="v">${escHtml(pct(pPct))}</span></div>
          </div>

          ${cont ? "" : `
          <div class="card">
            <div class="row"><h2 style="margin:0">Top 5 criteria</h2><div class="muted" style="font-size:11px;font-weight:750">Best scoring with evidence</div></div>
            <div style="height:6px"></div>
            <table>
              <tr><th style="width:14%">ID</th><th>Criterion</th><th style="width:18%">Facility</th><th style="width:12%">Score</th></tr>
              ${top5Rows || `<tr><td colspan="4" class="muted">No scored criteria found.</td></tr>`}
            </table>
          </div>
          `}

          <div class="card soft">
            <div class="row"><h2 style="margin:0">Non‑conformités (ce pilier)</h2><div class="muted" style="font-size:11px;font-weight:750">Most important section</div></div>
            <div style="height:6px"></div>
            <table>
              <tr><th style="width:36%">Criterion</th><th style="width:16%">Level</th><th>Finding & Recommendation</th></tr>
              ${ncRows || `<tr><td colspan="3" class="muted">No nonconformities for this pillar.</td></tr>`}
            </table>
          </div>
        </div>
      </section>`);
    });
  });

  // Page: Action plan (editable content, rendered here)
  const apRows = (actionPlanItems||[]).map(it=>{
    return `<tr>
      <td><b>${escHtml(String(it.horizon||it.timeline||""))}</b></td>
      <td>${escHtml(String(it.priority||""))}</td>
      <td>${escHtml(String(it.pillar||""))}</td>
      <td>${escHtml(String(it.facility||""))}</td>
      <td>${escHtml(String(it.action||it.description||""))}</td>
      <td>${escHtml(String(it.budget||""))}</td>
    </tr>`;
  }).join("");

  pages.push(`
  <section class="page">
    ${pageHeader("Action Plan", "")}
    <div class="page-inner">
      <h1>Action Plan</h1>
      <div class="subtitle">Fully editable action plan as provided by the auditor in the tool.</div>
      <div class="card">
        <table>
          <tr><th style="width:12%">Horizon</th><th style="width:10%">Prio</th><th style="width:18%">Pillar</th><th style="width:16%">Facility</th><th>Action</th><th style="width:12%">Budget</th></tr>
          ${apRows || `<tr><td colspan="6" class="muted">No action plan items.</td></tr>`}
        </table>
      </div>
    </div>
  </section>`);

  return `<!doctype html><html lang="${escHtml(lang||"en")}"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>M3 Audit Report — ${escHtml(siteName)}</title>${css}</head><body>${pages.join("\n")}</body></html>`;
}


async function render(){ await route(); }

async function route(){
  updateFooter();
  const parts = parseHash();
  // Normalize Supabase auth callbacks that arrive as token-only hash (e.g. #access_token=...&type=recovery)
  const rawHash = window.location.hash || '';
  if (rawHash && rawHash.startsWith('#') && !rawHash.startsWith('#/') && (rawHash.includes('access_token=') || rawHash.includes('refresh_token=') || rawHash.includes('type=') || rawHash.includes('error='))){
    const params = rawHash.slice(1);
    const qs = new URLSearchParams(params);
    const typ = (qs.get('type') || '').toLowerCase();
    const target = (typ === 'recovery' || typ === 'invite') ? ('#/update-password?' + params) : ('#/?' + params);
    if (typ === 'recovery' || typ === 'invite'){
      try{ sessionStorage.setItem(FORCE_PWD_KEY, typ); }catch{}
    }
    window.location.hash = target + '?' + params;
    return;
  }

  // Force password update after recovery/invite until completed
  const linkType = String(getParamAnywhere('type') || '').toLowerCase();
  if (linkType === 'recovery' || linkType === 'invite'){
    try{ sessionStorage.setItem(FORCE_PWD_KEY, linkType); }catch{}
  }
  let force = null;
  try{ force = sessionStorage.getItem(FORCE_PWD_KEY); }catch{}
  if (force && !['update-password','forgot-password','login'].includes(parts[0])){
    // Preserve any hash query params (code/access_token/refresh_token/type)
    const h = window.location.hash || '';
    const q = h.includes('?') ? h.slice(h.indexOf('?')+1) : '';
    window.location.hash = '#/update-password' + (q ? ('?' + q) : '');
    return;
  }


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
if (parts[0] === "users") return viewAdminUsers();
if (parts[0] === "admin" && parts[1] === "users") return viewAdminUsers();
if (parts[0] === "base") return viewAdminBaseUpdate();
if (parts[0] === "admin" && parts[1] === "base") return viewAdminBaseUpdate();
if (parts[0] === "audits") return viewAdminAudits();
if (parts[0] === "admin" && parts[1] === "audits") return viewAdminAudits();
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
// --- Debug helpers (console) ---
try {
  window.M3DBG = {
    get online(){ return (typeof ONLINE_ENABLED !== "undefined" && ONLINE_ENABLED); },
    get auth(){ return AUTH; },
    get user(){ return AUTH?.user || null; },
    refreshAdminFlag,
    listAudits: ()=>dbListAudits(),
    getAudit: (id)=>dbGetAudit(id),
  };
  window.SB = SB;
  window.AUTH = AUTH;
  window.ONLINE_ENABLED = ONLINE_ENABLED;
} catch(_e) {}

