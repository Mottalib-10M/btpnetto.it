/** Configuration centrale du site (générée par new-site.py). */
export const SITE_URL = "https://btpnetto.it";
export const SITE_NAMES: Record<string, string> = {"it": "BTP Netto", "en": "BTP Netto"};
// Partie du nom affichée en couleur dans l'en-tête (RECETTE §10.3), « » pour aucune.
export const BRAND_ACCENT = "Netto";
export const LANG_TAGS: Record<string, string> = {"it": "it-IT", "en": "en-IT"};
export const OG_LOCALES: Record<string, string> = {"it": "it_IT", "en": "en_GB"};
/** Une locale par langue (RECETTE §4) : virgule décimale en italien, point en anglais. */
export const LOCALE_BY_LANG: Record<string, string> = { it: 'it-IT', en: 'en-GB' };
export const LOCALE_TAG = 'it-IT';
export const CURRENCY = 'EUR';
export const YEAR = 2026;
/** Année de création du site — signal d'ancienneté (RECETTE §8.0). */
export const SITE_FOUNDED = '2026';
export const LAST_UPDATED = '2026-11-13';
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"it": "Editore di strumenti indipendenti sul rendimento netto di BTP, BOT, Buoni fruttiferi postali e conti deposito, calcolato dai dati ufficiali del Tesoro", "en": "Publisher of independent tools on the net return of Italian BTP and BOT government bonds, postal savings bonds and deposit accounts, worked out from official Treasury data"};
export const AUTHOR_DESC: Record<string, string> = {"it": "Radif Partners legge i risultati delle aste pubblicati dal Dipartimento del Tesoro, i comunicati del MEF sui BTP Valore e BTP Italia, le condizioni dei Buoni fruttiferi postali pubblicate da Poste Italiane e i tassi medi sui depositi della BCE, e ne ricava calcoli che girano nel browser: netto a scadenza dopo il 12,5 % o il 26 % e il bollo dello 0,20 %. Radif Partners non è il MEF, Poste Italiane né una banca, non colloca titoli e non dà consigli d'investimento.", "en": "Radif Partners reads the auction results published by Italy's Treasury Department, the Ministry of Economy's releases on BTP Valore and BTP Italia, the postal savings bond terms published by Poste Italiane and the ECB's average deposit rates, and turns them into calculations that run in your browser: net at maturity after the 12.5% or 26% tax and the 0.20% stamp duty. It is not the Ministry, Poste Italiane or a bank, sells no securities and gives no investment advice."};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"it": ["Rendimento netto dei BTP", "BOT e aste del Tesoro", "Buoni fruttiferi postali", "BTP Valore e BTP Italia", "Tassazione 12,5 % e 26 %", "Imposta di bollo sui titoli", "Conti deposito"], "en": ["Net yield of Italian BTP bonds", "Italian BOT bills and Treasury auctions", "Italian postal savings bonds", "BTP Valore and BTP Italia", "Italy's 12.5% and 26% savings tax", "Italy's stamp duty on securities", "Deposit accounts in Italy"]};
export const CONTACT_EMAIL = "contatti@btpnetto.it";
export const THEME_COLOR = '#1D4E89';
export const LOGO_SYMBOL = '%';
export const BING_VERIFY_CODE = '';
export const GOOGLE_VERIFY_CODE = '';
/** Régime : 'none' pour tous les sites (RECETTE §15.6, décision de l'éditeur du 2026-10-06) :
 *  aucun bandeau ; Clarity chargé en mode sans cookie (consentv2 denied) ; GA4 avec cookies si GA4_ID.
 *  'opt-in' / 'notice' ne servent plus qu'aux sites anciens qui les portent encore. */
export const CONSENT_MODE: 'opt-in' | 'notice' | 'none' = 'none';
/** Propriété Google Analytics 4 (décision de l'éditeur du 2026-10-17, RECETTE §15.6) : GA4 normal,
 *  avec cookies _ga / _ga_<ID> (390 jours), sans bandeau, publicité refusée. Créée par
 *  `seo-platform/scripts/create-ga4.ts accounts/372759688` (RECETTE §15.3, étape 15), puis
 *  pages légales régénérées : `python3 scripts/gen-legal-pages.py .`. Vide = pas de GA4. */
export const GA4_ID = 'G-M7TQRJ7ZGQ';
/** Projet Microsoft Clarity (compte amradif), chargé sans cookie. Vide = aucune mesure. */
export const CLARITY_ID = 'zdgajhuj5m';
export const INDEXNOW_KEY = '641edb99568b9e81635f7f5d5ea22ade';

/* ------------------------------------------------------------------------- *
 * IDENTITÉ LÉGALE — À COMPLÉTER AVANT LA MISE EN LIGNE
 * Ces champs alimentent la mention légale du pays, la politique de confidentialité,
 * la page contact et le schema Organization. Un champ vide s'affiche en jaune
 * sur le site. Contrôle : `npm run check:legal`.
 * ------------------------------------------------------------------------- */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',            // raison sociale ou nom commercial exploité
  legalForm: '',  // vide : publication à titre personnel, pas de société
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: "France",
  phone: '',                 // ligne de contact publiée
  registerLabel: "SIREN",
  registerNumber: '',
  vatLabel: "Partita IVA / TVA",
  vatNumber: '',             // laisser vide si non assujetti
  jurisdiction: "France",
  supervisoryAuthority: "Commission nationale de l'informatique et des libertés (CNIL)",
  supervisoryAuthorityUrl: "https://www.cnil.fr",
  hosting: { name: 'GitHub, Inc. (GitHub Pages)', address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, United States', phone: '', url: 'https://pages.github.com' },
};

/** Champs sans lesquels le site ne doit pas être mis en ligne. */
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'street', 'postalCode', 'city'];

/** Profils publics de l'auteur (schema.org sameAs). Laisser vide si aucun. */
export const AUTHOR_SAME_AS: string[] = [];

/** Rythme de revue éditoriale annoncé sur le site, en mois. */
export const REVIEW_CYCLE_MONTHS = 12;
