import { defineGuide } from '../../lib/guide-types';
import { tabBot } from '../../lib/contenuti';
import type { Helpers } from '../../lib/guide-types';

const es = (h: Helpers) => { const a = h.M.BOT12; return { a, r: h.M.bot(a, 10000) }; };

export default defineGuide({
  id: 'bot-rendimento',
  group: 'titoli',
  order: 2,
  tool: 'bot',
  related: ['aste-titoli-di-stato', 'conto-deposito-o-btp', 'rendimento-btp', 'home'],
  sources: ['mefBot', 'mefAste', 'dlgs239'],
  it: {
    slug: 'bot-rendimento',
    nav: 'Rendimento BOT',
    card: 'Il guadagno netto di un BOT a 3, 6 o 12 mesi, dal prezzo d’asta: tassa, bollo e netto annuo.',
    title: 'BOT rendimento netto: calcolo dall’ultima asta del Tesoro',
    description: 'BOT, rendimento netto: dal prezzo dell’ultima asta calcola quanto incassi a scadenza, la tassa del 12,5% sulla differenza, il bollo al prorata e il netto annuo.',
    h1: 'BOT, rendimento netto: quanto incassi a scadenza',
    intro: 'Il rendimento netto di un BOT nasce tutto dalla differenza tra il prezzo pagato e i 100 rimborsati a scadenza: il calcolo toglie la tassa del 12,5% e il bollo per i giorni di possesso.',
    resume: (h) => {
      const { a, r } = es(h);
      return `I BOT, Buoni ordinari del Tesoro, sono titoli di Stato senza cedola che durano al massimo un anno. Si comprano sotto 100 e alla scadenza lo Stato rimborsa 100: il guadagno è la differenza. Su questa differenza si paga il ${h.pct(h.P.fisco.titoli_stato, 1)}, trattenuto alla fonte; la banca aggiunge il bollo dello ${h.pct(h.P.fisco.bollo, 2)} l’anno, al prorata dei giorni. Nell’asta del ${h.date(a.asta)} il BOT che scade il ${h.date(a.scadenza)} è stato venduto al prezzo medio di ${h.num(a.prezzo, 3)}, con un rendimento lordo del ${h.num(a.rendimento, 3)}% calcolato dal Tesoro su 360 giorni. Su ${h.eur(10000)} nominali, comprati oggi a quel prezzo, si spendono ${h.eur(r.costo, 2)} e si incassano ${h.eur(r.netto, 2)} netti, cioè il ${h.pct(r.rendNetto, 2)} all’anno. Il BOT non paga nulla prima della scadenza e si può rivendere, ma al prezzo di mercato del giorno.`;
    },
    faqs: (h) => [
      { q: 'Come si calcola il rendimento lordo di un BOT?', a: 'Il Tesoro usa il rendimento semplice: (100 meno prezzo) diviso il prezzo, moltiplicato per 360 e diviso per i giorni alla scadenza. Il calcolo del sito rifà questo numero e lo confronta con il PDF dell’asta: torna al millesimo. Il netto invece è annuo su 365 giorni, dopo tassa e bollo.' },
      { q: 'Il BOT conviene più di un conto deposito?', a: `Dipende dai tassi del momento. Il BOT paga il ${h.pct(h.P.fisco.titoli_stato, 1)} di tassa, il conto deposito il ${h.pct(h.P.fisco.altri, 0)}: a parità di tasso lordo il BOT lascia più netto. Ma il conto deposito vincolato può avere un tasso lordo diverso e nessuna commissione d’acquisto. Il confronto con i tuoi numeri è nella pagina sul conto deposito.` },
      { q: 'Quando ci sono le prossime aste dei BOT?', a: 'Il Tesoro pubblica ogni anno il calendario delle emissioni: le aste dei BOT a sei e a dodici mesi si tengono di regola una o due volte al mese, con l’annuncio qualche giorno prima. Le date esatte sono nel calendario ufficiale del Dipartimento del Tesoro.' },
    ],
    body: (h) => {
      const { a, r } = es(h);
      return `<h2>Il rendimento netto del BOT in quattro numeri</h2>
<p>Un BOT ha un solo flusso dopo l’acquisto: il rimborso a 100 alla scadenza. La tassa colpisce lo scarto di emissione, cioè la differenza tra 100 e il prezzo, secondo il ${h.src('dlgs239', 'decreto legislativo n. 239 del 1996')}. Il bollo si conta per i giorni in cui hai il titolo. Ecco l’esempio su ${h.eur(10000)} nominali del BOT scelto dal calcolo.</p>
${h.table(['Voce', 'Importo'], [['Spesa', h.eur(r.costo, 2)], ['Differenza a scadenza', h.eur(r.scarto, 2)], ['Tassa', h.eur(r.tassa, 2)], ['Bollo', h.eur(r.bollo, 2)], ['Netto', h.eur(r.netto, 2)], ['Giorni', String(r.giorni)]], `BOT con scadenza il ${h.date(a.scadenza)}, prezzo d’asta ${h.num(a.prezzo, 3)}`, ['l', 'r'])}
<h2>I BOT ancora in vita</h2>
<p>Ogni riga è l’ultima asta di un BOT che non è ancora scaduto, letta nei PDF del ${h.src('mefBot', 'Dipartimento del Tesoro')}. Alcuni sono riaperture: titoli emessi mesi fa e rimessi all’asta con la vita che resta.</p>
${tabBot(h)}
<p>Più il BOT è vicino alla scadenza, più il bollo pesa poco e più il rendimento netto è vicino al lordo meno un ottavo. Chi compra in Borsa paga anche la commissione della banca, che su durate brevi può mangiare una parte importante del guadagno: conviene controllarla prima. L’elenco completo delle aste, con i BTP, è nella pagina ${h.a('aste-titoli-di-stato', 'sulle aste dei titoli di Stato')}.</p>`;
    },
  },
  en: {
    slug: 'bot-net-yield',
    nav: 'BOT net yield',
    card: 'The net gain on a 3, 6 or 12-month Italian BOT from its auction price: tax, stamp duty and net yearly yield.',
    title: 'BOT net yield: Italian Treasury bill return from the auction',
    description: 'BOT net yield for Italian Treasury bills: from the latest auction price, what you collect at maturity, the 12.5% tax on the gap, stamp duty and the yearly net.',
    h1: 'BOT net yield: what you collect at maturity',
    intro: 'The BOT net yield comes entirely from the gap between the price you pay and the 100 repaid at maturity: the calculation takes off the 12.5% tax and the stamp duty for the days you hold it.',
    resume: (h) => {
      const { a, r } = es(h);
      return `BOT (Buoni ordinari del Tesoro) are Italian Treasury bills: government securities with no coupon that last a year at most. You buy them below 100 and at maturity the State repays 100: the gain is the difference. That difference is taxed at ${h.pct(h.P.fisco.titoli_stato, 1)}, withheld at source; the bank adds the ${h.pct(h.P.fisco.bollo, 2)} yearly stamp duty, pro rata. At the auction of ${h.date(a.asta)} the BOT maturing on ${h.date(a.scadenza)} sold at an average price of ${h.num(a.prezzo, 3)}, a gross yield of ${h.num(a.rendimento, 3)}% on the Treasury’s 360-day basis. On ${h.eur(10000)} face value bought today at that price you spend ${h.eur(r.costo, 2)} and collect ${h.eur(r.netto, 2)} net, or ${h.pct(r.rendNetto, 2)} a year. A BOT pays nothing before maturity and can be sold, but at that day’s market price.`;
    },
    faqs: (h) => [
      { q: 'How is a BOT’s gross yield worked out?', a: 'The Treasury uses the simple yield: 100 minus the price, divided by the price, times 360, divided by the days to maturity. The site recomputes that figure and checks it against the auction PDF: it matches to the thousandth. The net figure is yearly on 365 days, after tax and stamp duty.' },
      { q: 'Does a BOT beat a deposit account?', a: `It depends on rates at the time. A BOT is taxed at ${h.pct(h.P.fisco.titoli_stato, 1)}, a deposit account at ${h.pct(h.P.fisco.altri, 0)}: at the same gross rate the BOT leaves more. But a fixed-term deposit may offer a different gross rate and no purchase fee. The comparison with your own figures is on the deposit account page.` },
      { q: 'When are the next BOT auctions?', a: 'The Treasury publishes an issuance calendar each year: six and twelve-month BOT auctions are usually held once or twice a month, announced a few days before. The exact dates are in the Treasury Department’s official calendar, and each auction’s results are published the same day in a PDF.' },
    ],
    body: (h) => {
      const { a, r } = es(h);
      return `<h2>BOT net yield in four figures</h2>
<p>After you buy a BOT there is a single cash flow: repayment at 100 on maturity. The tax hits the issue discount, the gap between 100 and the price, under ${h.src('dlgs239', 'Legislative Decree 239 of 1996')}. Stamp duty counts the days you hold the bill. Here is the example on ${h.eur(10000)} face value of the BOT the calculation picks.</p>
${h.table(['Item', 'Amount'], [['Cost', h.eur(r.costo, 2)], ['Gain at maturity', h.eur(r.scarto, 2)], ['Tax', h.eur(r.tassa, 2)], ['Stamp duty', h.eur(r.bollo, 2)], ['Net', h.eur(r.netto, 2)], ['Days', String(r.giorni)]], `BOT maturing on ${h.date(a.scadenza)}, auction price ${h.num(a.prezzo, 3)}`, ['l', 'r'])}
<h2>BOT still running</h2>
<p>Each row is the latest auction of a BOT that has not yet matured, read in the ${h.src('mefBot', 'Treasury Department’s')} PDFs. Some are reopenings: bills issued months ago and auctioned again for their remaining life.</p>
${tabBot(h)}
<p>The closer a BOT is to maturity, the less the stamp duty weighs and the closer the net yield gets to the gross minus one eighth. Buying on the market also costs your bank’s fee, which on short terms can eat a large share of the gain: check it first. The full auction list, BTP included, is on the ${h.a('aste-titoli-di-stato', 'Treasury auction results')} page.</p>`;
    },
  },
});
