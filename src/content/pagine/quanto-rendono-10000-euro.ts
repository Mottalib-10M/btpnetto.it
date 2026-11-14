import { defineGuide } from '../../lib/guide-types';
import { tabConfronto } from '../../lib/contenuti';
import type { Helpers } from '../../lib/guide-types';

const best = (h: Helpers, n: number) => [...h.M.confronto(10000, n)].sort((a, b) => b.netti - a.netti)[0];

export default defineGuide({
  id: 'quanto-rendono-10000-euro',
  group: 'confronti',
  order: 3,
  tool: 'confronto',
  outil: { importo: 10000 },
  related: ['btp-o-buoni-postali', 'conto-deposito-o-btp', 'bot-rendimento', 'home'],
  sources: ['mefAste', 'posteOrdinario', 'bceMir', 'dpr642'],
  it: {
    slug: 'quanto-rendono-10000-euro',
    nav: 'Quanto rendono 10.000 €',
    card: 'Quanto rendono netti 10.000 euro in BTP, BOT, Buoni postali o conto deposito, da uno a dieci anni.',
    title: 'Quanto rendono 10.000 euro: BTP, Buoni, BOT o deposito',
    description: 'Quanto rendono 10.000 euro netti in BTP, BOT, Buoni fruttiferi postali o conto deposito, da 1 a 10 anni, con tassa del 12,5% o 26% e bollo, ai tassi letti oggi.',
    h1: 'Quanto rendono 10.000 euro in titoli di Stato e depositi',
    intro: 'Quanto rendono 10.000 euro dipende dalla durata e dallo strumento: il calcolo mette insieme BTP, BOT, Buono postale e conto deposito ai tassi letti oggi e mostra gli interessi netti di ciascuno.',
    resume: (h) => {
      const b1 = best(h, 1), b5 = best(h, 5), b10 = best(h, 10);
      return `Diecimila euro sono l’importo più cercato da chi si chiede dove mettere i risparmi senza rischiare il capitale. Le strade più comuni sono quattro: un BTP comprato oggi e tenuto fino alla scadenza, un BOT per un anno, un Buono fruttifero postale, un conto deposito vincolato. Il calcolo usa per ciascuna i dati letti oggi: prezzo dell’ultima asta del Tesoro, tassi di Poste Italiane, tasso medio dei depositi pubblicato dalla Banca centrale europea. Sottrae la tassa, ${h.pct(h.P.fisco.titoli_stato, 1)} per titoli e Buoni e ${h.pct(h.P.fisco.altri, 0)} per il deposito, e il bollo. Con questi dati, per un anno il netto più alto è ${b1.id === 'deposito' ? 'il conto deposito' : b1.nome.split(' · ')[0]} con ${h.eur(b1.netti)}; per cinque anni ${b5.nome.split(' · ')[0]} con ${h.eur(b5.netti)}; per dieci anni ${b10.nome.split(' · ')[0]} con ${h.eur(b10.netti)}. Sono interessi netti, senza reinvestimento delle cedole e senza commissioni bancarie. Il sito non sa quale strumento è adatto a te: mostra solo i numeri.`;
    },
    faqs: (h) => [
      { q: 'Quanto rendono 10.000 euro in un anno senza rischi?', a: `Senza rischio di prezzo, cioè tenendo fino alla scadenza, le opzioni a un anno sono il BOT a dodici mesi, un deposito vincolato a un anno o un Buono. Con i dati letti oggi il calcolo mostra il netto di ciascuno: su ${h.eur(10000)} la differenza tra le opzioni è di poche decine di euro, e le commissioni possono cambiarla.` },
      { q: 'Conviene dividere 10.000 euro tra più strumenti?', a: 'Il sito non dà consigli su come ripartire i risparmi. Il calcolo funziona per qualsiasi importo: puoi rifarlo per ogni parte, per esempio 5.000 euro in un Buono, che sotto quella soglia non paga bollo, e il resto in un titolo con un’altra durata.' },
      { q: 'Perché per alcune durate manca il BOT?', a: 'Perché i BOT durano al massimo dodici mesi. Per durate più lunghe il confronto usa il BTP con la scadenza più vicina agli anni scelti, tra quelli venduti nelle ultime aste del Tesoro. Per il Buono usa l’Ordinario, o il 4 anni Plus a quattro anni.' },
    ],
    body: (h) => `<h2>Quanto rendono 10.000 euro da uno a dieci anni</h2>
<p>Ogni riga è il risultato del calcolo per ${h.eur(10000)}: BTP dall’${h.src('mefAste', 'ultima asta del Tesoro')}, ${h.src('posteOrdinario', 'Buono Ordinario di Poste')}, deposito al tasso medio della ${h.src('bceMir', 'Banca centrale europea')}, tutti con il bollo previsto dalla ${h.src('dpr642', 'legge')}.</p>
${tabConfronto(h, 10000, [1, 2, 3, 4, 5, 7, 10])}
<h2>Come leggere il confronto</h2>
<p>Il netto del BTP dipende dal prezzo: se in banca il titolo costa più di quanto pagato all’asta, il rendimento scende. Il deposito usa una media: la tua banca può offrire di più o di meno, e il campo del tasso nel calcolo serve a scriverlo. Il Buono si rimborsa sempre almeno al capitale e non ha commissioni. I dettagli di ogni strumento sono nelle pagine ${h.a('rendimento-btp', 'sul rendimento netto dei BTP')}, ${h.a('buoni-fruttiferi-postali', 'sui Buoni postali')} e ${h.a('conto-deposito-o-btp', 'sul conto deposito')}.</p>`,
  },
  en: {
    slug: 'what-10000-euros-earns',
    nav: 'What €10,000 earns',
    card: 'What €10,000 earns net in Italy in BTP, BOT, postal bonds or a deposit account, from one to ten years.',
    title: 'Earnings on €10,000: BTP, postal bonds or deposit in Italy',
    description: 'Earnings on €10,000 in Italy in BTP, BOT, postal savings bonds or a deposit account, from 1 to 10 years, net of 12.5% or 26% tax and stamp duty, today.',
    h1: 'Earnings on €10,000 in Italian bonds and deposits',
    intro: 'Earnings on €10,000 depend on the term and the product: the calculation puts BTP, BOT, a postal bond and a deposit account together at today’s rates and shows each one’s net interest.',
    resume: (h) => {
      const b1 = best(h, 1), b5 = best(h, 5), b10 = best(h, 10);
      const nm = (r: ReturnType<typeof best>) => (r.id === 'deposito' ? 'the deposit account' : r.nome.split(' · ')[0].replace('anni', 'year'));
      return `Ten thousand euros is the amount most often searched by Italians wondering where to put savings without risking the capital. There are four common routes: a BTP bought today and held to maturity, a BOT for a year, a postal savings bond, a fixed-term deposit account. The calculation uses today’s data for each: the latest Treasury auction price, Poste Italiane’s rates, the average deposit rate published by the European Central Bank. It takes off tax, ${h.pct(h.P.fisco.titoli_stato, 1)} for bonds and postal bonds and ${h.pct(h.P.fisco.altri, 0)} for deposits, and stamp duty. With these data, for one year the highest net is ${nm(b1)} with ${h.eur(b1.netti)}; for five years ${nm(b5)} with ${h.eur(b5.netti)}; for ten years ${nm(b10)} with ${h.eur(b10.netti)}. These are net interest figures, with no coupon reinvestment and no bank fees. The site does not know which product suits you: it only shows the figures.`;
    },
    faqs: (h) => [
      { q: 'What does €10,000 earn in a year without risk?', a: `With no price risk, meaning held to maturity, the one-year options are a 12-month BOT, a one-year fixed deposit or a postal bond. With today’s data the calculation shows each one’s net: on ${h.eur(10000)} the gap between them is a few tens of euros, and fees can change it.` },
      { q: 'Should I split €10,000 across several products?', a: 'The site gives no advice on how to split savings. The calculation works for any amount: you can rerun it for each part, for instance €5,000 in a postal bond, which pays no stamp duty below that limit, and the rest in a bond of another term.' },
      { q: 'Why is BOT missing for some terms?', a: 'Because BOT last twelve months at most. For longer terms the comparison uses the BTP maturing closest to the chosen years, among those sold at the latest Treasury auctions. For the postal bond it uses the Ordinario, or the 4 anni Plus at four years.' },
    ],
    body: (h) => `<h2>Earnings on €10,000 over one to ten years</h2>
<p>Each row is the calculation for ${h.eur(10000)}: BTP from the ${h.src('mefAste', 'latest Treasury auction')}, ${h.src('posteOrdinario', 'Poste’s Buono Ordinario')}, a deposit at the ${h.src('bceMir', 'European Central Bank')} average rate, all with the stamp duty of Italian ${h.src('dpr642', 'law')}.</p>
${tabConfronto(h, 10000, [1, 2, 3, 4, 5, 7, 10])}
<h2>How to read the comparison</h2>
<p>The BTP net depends on price: if your bank charges more than the auction price, the yield falls. The deposit uses an average: your bank may offer more or less, and the rate field in the calculation is there to type it. A postal bond is always repaid at least at its capital and has no fees. Details for each product are on the ${h.a('rendimento-btp', 'BTP net yield')}, ${h.a('buoni-fruttiferi-postali', 'postal savings bonds')} and ${h.a('conto-deposito-o-btp', 'deposit account')} pages.</p>`,
  },
});
