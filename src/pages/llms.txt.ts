import type { APIRoute } from 'astro';
import { PAGES } from '../lib/guides';
import { route } from '../i18n/routes';
import { SITE_URL, SITE_NAMES, AUTHOR_NAME } from '../data/site-config';
import { P } from '../lib/engine/params';

/** llms.txt (RECETTE §21) : le site, ses données et ses pages, généré au build depuis le registre des pages. */
export const GET: APIRoute = () => {
  const u = (p: string) => SITE_URL + p;
  const lines = [
    `# ${SITE_NAMES.it}`,
    '',
    `> Calcoli indipendenti del rendimento netto di BTP, BOT, Buoni fruttiferi postali, BTP Valore, BTP Italia e conti deposito, pubblicati da ${AUTHOR_NAME}: prezzi e rendimenti delle aste del Dipartimento del Tesoro (datati), tassi dei Buoni pubblicati da Poste Italiane, media BCE dei depositi, tassa del 12,5% (titoli di Stato e Buoni) e del 26% (depositi), bollo dello 0,20%. Calcoli nel browser, nessun consiglio d'investimento. Sito non ufficiale. Italiano e inglese.`,
    '',
    '## Fonti',
    '',
    `- Risultati delle aste del Dipartimento del Tesoro (dt.mef.gov.it); comunicati MEF su BTP Valore e BTP Italia; Poste Italiane, Buoni fruttiferi postali; BCE, statistiche MIR; D.Lgs. 239/1996; DL 66/2014 art. 3; DPR 642/1972. Dati riletti il ${P.retrieved_at}.`,
    `- Metodo e fonti: ${u(route('method', 'it'))}`,
    '',
    '## Pagine (italiano)',
    '',
    `- [${SITE_NAMES.it}](${u(route('home', 'it'))})`,
    ...PAGES.map((p) => `- [${p.it.h1}](${u(route(p.id, 'it'))}): ${p.it.description}`),
    '',
    '## Pages (English)',
    '',
    `- [Home](${u(route('home', 'en'))})`,
    ...PAGES.map((p) => `- [${p.en.h1}](${u(route(p.id, 'en'))}): ${p.en.description}`),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
