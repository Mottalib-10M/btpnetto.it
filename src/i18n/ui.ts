import type { Locale } from './routes';
const it = {
  updatedOn: 'Aggiornato il', editorialPolicy: 'Politica editoriale', contactLabel: 'Contatti', reviewedBy: 'Verificato da',
  skipToContent: 'Vai al contenuto', mainNav: 'Navigazione principale', breadcrumbLabel: 'Percorso', breadcrumbHome: 'Home', menuOpen: 'Apri il menu',
  faqTitle: 'Domande frequenti', relatedCalculators: 'Pagine e calcoli collegati', sourcesTitle: 'Fonti', writtenBy: 'Scritto da',
  asOf: 'Dati del', lastUpdated: 'testi riletti il', footerValidated: 'Fonti: Dipartimento del Tesoro (risultati delle aste), MEF, Poste Italiane, BCE, Normattiva', footerBrowser: 'Nessun account · nulla di ciò che scrivi viene inviato o conservato · calcolo nel browser · gratis',
  footerDisclaimer: 'Sito indipendente pubblicato da Radif Partners. Non è il sito del MEF, del Dipartimento del Tesoro, di Poste Italiane, di Cassa Depositi e Prestiti o di una banca, non colloca titoli e non dà consigli d’investimento: nessun legame commerciale, nessuna commissione. I risultati sono calcoli indicativi fatti con i dati ufficiali datati in ogni pagina e non costituiscono una consulenza finanziaria; fanno fede i documenti dell’emittente e il rendiconto della tua banca o di Poste.', footerPopular: '', notFound: 'Questa pagina non esiste.',
  readMore: 'Leggi tutto',
};
const en: typeof it = {
  updatedOn: 'Updated on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Checked by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Frequently asked questions', relatedCalculators: 'Related pages and calculations', sourcesTitle: 'Sources', writtenBy: 'Written by',
  asOf: 'Data as of', lastUpdated: 'texts reread on', footerValidated: 'Sources: Italian Treasury Department (auction results), Ministry of Economy, Poste Italiane, ECB, Normattiva', footerBrowser: 'No account · nothing is sent or stored · runs in your browser · free',
  footerDisclaimer: 'Independent site published by Radif Partners. It is not the site of the Ministry of Economy, the Treasury Department, Poste Italiane, Cassa Depositi e Prestiti or a bank, sells no securities and gives no investment advice: no commercial link, no commission. Results are indicative calculations from the official data dated on each page and do not constitute financial advice; the issuer’s documents and your bank or Poste statement are what count.', footerPopular: '', notFound: 'This page does not exist.',
  readMore: 'Read more',
};
export function t(lang: Locale) { return lang === 'en' ? en : it; }
