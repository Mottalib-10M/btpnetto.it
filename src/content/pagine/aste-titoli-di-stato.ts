import { defineGuide } from '../../lib/guide-types';
import type { Helpers } from '../../lib/guide-types';

const tab = (h: Helpers) => {
  const it = h.lang === 'it';
  const rows = h.M.ULTIME.map((a) => [h.date(a.asta), a.tipo === 'BOT' ? 'BOT' : a.tipo === 'CCTeu' ? 'CCTeu' : a.nome.split(' (')[0].replace('anni', it ? 'anni' : 'years'), a.cedola != null ? `${h.num(a.cedola, 2)}%` : '–', h.date(a.scadenza), h.num(a.prezzo, 3), `${h.num(a.rendimento, 3)}%`, `<a href="${a.url}" target="_blank" rel="nofollow noopener noreferrer">PDF</a>`]);
  return h.table(it ? ['Asta', 'Titolo', 'Cedola', 'Scadenza', 'Prezzo', 'Rendimento lordo', 'Fonte'] : ['Auction', 'Security', 'Coupon', 'Maturity', 'Price', 'Gross yield', 'Source'], rows,
    it ? `Ultima asta di ciascun titolo ancora in vita, dalla più recente; CCTeu a tasso variabile, senza cedola fissa` : `Latest auction of each security still running, most recent first; CCTeu are floating-rate, with no fixed coupon`, ['l', 'l', 'r', 'l', 'r', 'r', 'l']);
};

export default defineGuide({
  id: 'aste-titoli-di-stato',
  group: 'titoli',
  order: 3,
  tool: 'asta',
  related: ['rendimento-btp', 'bot-rendimento', 'btp-valore', 'home'],
  sources: ['mefAste', 'mefCalendario', 'cad'],
  it: {
    slug: 'aste-titoli-di-stato',
    nav: 'Aste dei titoli di Stato',
    card: 'Tutte le ultime aste di BOT, BTP e CCTeu, con prezzo e rendimento, e il calcolo del rendimento a un altro prezzo.',
    title: 'Aste titoli di Stato: risultati di BOT e BTP, prezzo e resa',
    description: 'Aste dei titoli di Stato: risultati delle ultime aste di BOT, BTP e CCTeu con prezzo, rendimento lordo e PDF del Tesoro, e il rendimento a un prezzo diverso.',
    h1: 'Aste dei titoli di Stato: gli ultimi risultati',
    intro: 'Le aste dei titoli di Stato fissano il prezzo e il rendimento con cui il Tesoro vende BOT, BTP e CCTeu: qui trovi l’ultimo risultato di ogni titolo e il rendimento che otterresti a un altro prezzo.',
    resume: (h) => {
      const u = h.M.ULTIMA_ASTA;
      return `Il Dipartimento del Tesoro vende i titoli di Stato con aste periodiche riservate agli intermediari autorizzati: banche e operatori presentano offerte e il Tesoro assegna i titoli al prezzo che risulta dall’asta. I risparmiatori partecipano attraverso la propria banca o Poste, prenotando entro il giorno prima, e pagano il prezzo medio dell’asta senza commissioni. Per ogni asta il Tesoro pubblica un PDF con codice ISIN, cedola, date, importo assegnato, prezzo e rendimento lordo. L’ultima asta letta qui è del ${h.date(u.asta)}: ${u.nome.split(' (')[0]}, prezzo ${h.num(u.prezzo, 3)}, rendimento lordo ${h.num(u.rendimento, 3)}%. Il rendimento lordo dei BTP è composto su base annua; quello dei BOT è semplice su 360 giorni. Il calcolo qui sopra rifà il rendimento per un prezzo diverso e lo rende netto di tassa e bollo, così puoi capire se il prezzo che vedi oggi in banca è più o meno conveniente di quello d’asta.`;
    },
    faqs: (h) => [
      { q: 'Un privato può comprare titoli all’asta?', a: 'Sì, ma non direttamente: si prenota tramite la banca o Poste entro la data indicata nel comunicato di emissione, di solito il giorno prima dell’asta. Si paga il prezzo medio ponderato che esce dall’asta, senza commissioni di sottoscrizione. Dopo l’asta lo stesso titolo si compra solo in Borsa, al prezzo del momento.' },
      { q: 'Che cosa significa «vita residua» in un risultato d’asta?', a: 'Che il Tesoro ha riaperto un titolo emesso in passato: ne vende altre quote con la scadenza originale, quindi con meno anni di quelli del nome. Un BTP 15 anni con vita residua di 10 anni scade fra dieci anni e ha la cedola fissata all’emissione.' },
      { q: 'Perché il prezzo d’asta è diverso dal prezzo fiscale?', a: `Il prezzo fiscale è quello dell’emissione della prima tranche e serve a calcolare lo scarto di emissione tassato al ${h.pct(h.P.fisco.titoli_stato, 1)}. Se compri a un prezzo più basso, la parte in più è plusvalenza, tassata alla stessa aliquota per i titoli di Stato. Il calcolo del sito tassa tutta la differenza fino a 100.` },
    ],
    body: (h) => `<h2>Risultati delle aste dei titoli di Stato</h2>
<p>La tabella elenca, per ogni titolo ancora in vita, la sua asta più recente fra quelle pubblicate dal ${h.src('mefAste', 'Dipartimento del Tesoro')}. I dati sono letti nei PDF «Risultati Asta», ognuno linkato: il sito del Tesoro non indica una licenza e l’${h.src('cad', 'articolo 52 del Codice dell’amministrazione digitale')} li rende dati aperti. Le date delle prossime aste sono nel ${h.src('mefCalendario', 'calendario delle emissioni')}.</p>
${tab(h)}
<h2>Come leggere un risultato d’asta</h2>
<p>Il «rapporto di copertura» dice quante volte la domanda ha superato l’offerta; il «rendimento lordo» è quello del prezzo di aggiudicazione; i «giorni dietimi» sono i giorni di cedola maturata che chi compra paga in più e riavrà con la prima cedola. Il «prezzo fiscale» serve al calcolo della tassa. Per il risparmiatore conta il rendimento netto: tolti il 12,5% e il bollo, su un rendimento lordo del 4% la tassa toglie ${h.num(4 * h.P.fisco.titoli_stato, 2)} punti e il bollo altri ${h.num(h.P.fisco.bollo * 100, 2)}, per un netto vicino al ${h.num(4 - 4 * h.P.fisco.titoli_stato - h.P.fisco.bollo * 100, 2)}%.</p>`,
  },
  en: {
    slug: 'treasury-auction-results',
    nav: 'Treasury auction results',
    card: 'Every recent BOT, BTP and CCTeu auction, with price and yield, and the yield at another price.',
    title: 'Treasury auction results: Italian BOT and BTP price, yield',
    description: 'Treasury auction results in Italy: latest BOT, BTP and CCTeu auctions with price, gross yield and the Treasury PDF, plus the yield at any other price.',
    h1: 'Italian Treasury auction results: the latest figures',
    intro: 'Italian Treasury auction results set the price and yield at which the State sells BOT, BTP and CCTeu: here is each security’s latest result and the yield you would get at another price.',
    resume: (h) => {
      const u = h.M.ULTIMA_ASTA;
      return `Italy’s Treasury Department sells government securities through regular auctions open to authorised dealers: banks and dealers bid and the Treasury allots the securities at the price the auction produces. Savers take part through their bank or Poste, booking by the day before, and pay the average auction price with no fee. For each auction the Treasury publishes a PDF with the ISIN code, coupon, dates, amount allotted, price and gross yield. The latest auction read here is from ${h.date(u.asta)}: ${u.nome.split(' (')[0].replace('anni', 'year')}, price ${h.num(u.prezzo, 3)}, gross yield ${h.num(u.rendimento, 3)}%. BTP gross yields are compounded yearly; BOT yields are simple on 360 days. The calculation above reworks the yield for a different price and nets it of tax and stamp duty, so you can see whether the price your bank shows today is better or worse than the auction one.`;
    },
    faqs: (h) => [
      { q: 'Can a private saver buy at an Italian Treasury auction?', a: 'Yes, but not directly: you book through your bank or Poste by the date in the issue announcement, usually the day before the auction. You pay the weighted average price the auction produces, with no subscription fee. After the auction the same security can only be bought on the market, at the going price.' },
      { q: 'What does “remaining life” mean in an auction result?', a: 'That the Treasury reopened a security issued in the past: it sells more of it with the original maturity, so with fewer years than its name. A 15-year BTP with 10 years of remaining life matures in ten years and keeps the coupon set at issue.' },
      { q: 'Why does the auction price differ from the tax price?', a: `The tax price (prezzo fiscale) is the price of the first tranche and is used to work out the issue discount taxed at ${h.pct(h.P.fisco.titoli_stato, 1)}. If you buy lower, the extra is a capital gain, taxed at the same rate for government bonds. The site’s calculation taxes the whole gap up to 100.` },
    ],
    body: (h) => `<h2>Italian Treasury auction results, security by security</h2>
<p>The table lists, for each security still running, its most recent auction among those published by the ${h.src('mefAste', 'Treasury Department')}. The figures are read from the “Risultati Asta” PDFs, each one linked: the Treasury site states no licence and ${h.src('cad', 'article 52 of the Digital Administration Code')} makes them open data. Upcoming auction dates are in the ${h.src('mefCalendario', 'issuance calendar')}.</p>
${tab(h)}
<h2>How to read an auction result</h2>
<p>The cover ratio says how many times demand exceeded the amount offered; the gross yield is the one at the allotment price; the “giorni dietimi” are days of accrued coupon the buyer pays on top and gets back with the first coupon. The tax price is used for the tax. What matters to a saver is the net yield: after the 12.5% tax and stamp duty, on a 4% gross yield the tax takes ${h.num(4 * h.P.fisco.titoli_stato, 2)} points and stamp duty another ${h.num(h.P.fisco.bollo * 100, 2)}, for a net close to ${h.num(4 - 4 * h.P.fisco.titoli_stato - h.P.fisco.bollo * 100, 2)}%.</p>`,
  },
});
