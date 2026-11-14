import { defineGuide } from '../../lib/guide-types';
import type { Helpers } from '../../lib/guide-types';

const R = (h: Helpers) => h.P.retail.italia_2032;
const anni = (h: Helpers) => Math.max(0, h.M.anniTra(h.today, R(h).scadenza));
const tab = (h: Helpers) => {
  const it = h.lang === 'it';
  const n = anni(h);
  return h.table(it ? ['Inflazione ipotizzata', 'Lordo all’anno su 10.000 €', 'Netto fino alla scadenza', 'Netto annuo'] : ['Assumed inflation', 'Gross per year on €10,000', 'Net to maturity', 'Net per year'],
    [0, 1, 2, 3, 5].map((i) => { const r = h.M.italia2032(10000, i, n); return [`${h.num(i, 0)}%`, h.eur(r.lordoAnno), h.eur(r.netti), h.pct(r.rendNetto, 2)]; }),
    it ? `${R(h).nome}, tasso reale ${h.num(R(h).tasso_reale, 2)}%, prezzo 100, ${h.num(n, 1)} anni alla scadenza: l’inflazione è un’ipotesi, non una previsione` : `${R(h).nome}, ${h.num(R(h).tasso_reale, 2)}% real rate, price 100, ${h.num(n, 1)} years to maturity: inflation is an assumption, not a forecast`, ['r', 'r', 'r', 'r']);
};

export default defineGuide({
  id: 'btp-italia',
  group: 'retail',
  order: 2,
  tool: 'italia',
  related: ['btp-valore', 'rendimento-btp', 'tassazione-titoli-di-stato', 'home'],
  sources: ['mefBtpItalia', 'dlgs239', 'dpr642'],
  it: {
    slug: 'btp-italia',
    nav: 'BTP Italia',
    card: 'Il rendimento netto del BTP Italia secondo l’inflazione che ipotizzi: tasso reale, rivalutazione, tassa e bollo.',
    title: 'BTP Italia: rendimento netto secondo l’inflazione ipotizzata',
    description: 'BTP Italia 2032: tasso reale fissato dal MEF più l’inflazione italiana che ipotizzi tu, cedole e rivalutazione nette della tassa del 12,5% e del bollo.',
    h1: 'BTP Italia: rendimento netto con la tua ipotesi di inflazione',
    intro: 'Il BTP Italia protegge il capitale dall’inflazione italiana: il rendimento dipende dall’inflazione futura, che nessuno conosce, quindi il calcolo ti chiede di ipotizzarla e mostra il netto fino alla scadenza.',
    resume: (h) => {
      const r = h.M.italia2032(10000, 2, anni(h));
      return `Il BTP Italia è un titolo di Stato indicizzato all’inflazione italiana, misurata dall’ISTAT con l’indice FOI senza tabacchi. Il capitale viene rivalutato ogni sei mesi secondo l’inflazione del periodo e la rivalutazione è pagata subito, insieme alla cedola calcolata con un tasso reale fisso sul capitale rivalutato. L’emissione in corso più recente letta qui è il ${R(h).nome}, con un tasso reale del ${h.num(R(h).tasso_reale, 2)}% fissato dal comunicato del Ministero dell’economia del ${h.date(R(h).comunicato)}. Con un’inflazione ipotizzata del 2% all’anno, ${h.eur(10000)} renderebbero circa ${h.eur(r.netti)} netti fino alla scadenza, cioè il ${h.pct(r.rendNetto, 2)} all’anno, dopo la tassa del ${h.pct(h.P.fisco.titoli_stato, 1)} e il bollo. Se l’inflazione fosse più alta il rendimento salirebbe, se fosse più bassa scenderebbe; in caso di deflazione il capitale non viene svalutato e la cedola si calcola sul valore nominale. Oggi il titolo si compra solo in Borsa, a un prezzo diverso da 100.`;
    },
    faqs: (h) => [
      { q: 'Il BTP Italia protegge da qualsiasi inflazione?', a: 'Protegge dall’inflazione italiana misurata dall’indice FOI senza tabacchi, che può differire da quella che vive ogni famiglia. La protezione è piena per chi tiene il titolo fino alla scadenza; chi vende prima incassa il prezzo di mercato, che dipende anche dai tassi reali del momento.' },
      { q: 'La rivalutazione del capitale è tassata?', a: `Sì: la rivalutazione semestrale pagata dal BTP Italia è trattata come reddito e paga il ${h.pct(h.P.fisco.titoli_stato, 1)}, come le cedole. Il calcolo del sito tassa insieme cedole e rivalutazione e toglie il bollo dello ${h.pct(h.P.fisco.bollo, 2)} annuo sul valore del titolo, come per gli altri titoli di Stato.` },
      { q: 'Che differenza c’è con il BTP €i?', a: 'Il BTP €i è indicizzato all’inflazione dell’area euro, esclusi i tabacchi, e non paga la rivalutazione ogni sei mesi ma alla scadenza. Il BTP Italia segue invece i prezzi italiani ed è pensato per i risparmiatori. Il sito calcola solo il BTP Italia.' },
    ],
    body: (h) => `<h2>Il BTP Italia con cinque ipotesi di inflazione</h2>
<p>La tabella usa il tasso reale del ${h.src('mefBtpItalia', 'comunicato del Ministero dell’economia')} e un prezzo di 100, e cambia solo l’inflazione ipotizzata. Tassa e bollo sono quelli previsti dalla ${h.src('dlgs239', 'legge sui titoli di Stato')} e dalla ${h.src('dpr642', 'legge sul bollo')}.</p>
${tab(h)}
<h2>Come si calcola il rendimento del BTP Italia</h2>
<p>Il calcolo è un’approssimazione annuale: per ogni anno il lordo è il capitale per (1 + inflazione) × (1 + tasso reale) − 1, cioè la rivalutazione più la cedola sul capitale rivalutato. Il risultato non è una previsione, perché l’inflazione futura non si conosce: serve a vedere quanto cambia il netto se cambia l’inflazione. Per confrontarlo con un BTP a tasso fisso della stessa durata, il ${h.a('rendimento-btp', 'calcolo del rendimento netto BTP')} dà il netto certo di un titolo comprato oggi.</p>`,
  },
  en: {
    slug: 'btp-italia-inflation-linked',
    nav: 'BTP Italia',
    card: 'BTP Italia net yield under the inflation you assume: real rate, revaluation, tax and stamp duty.',
    title: 'BTP Italia: net yield of the inflation-linked Italian bond',
    description: 'BTP Italia 2032: the real rate set by the Ministry plus the Italian inflation you assume, coupons and revaluation net of 12.5% tax and stamp duty, to maturity.',
    h1: 'BTP Italia: net yield under your inflation assumption',
    intro: 'BTP Italia protects capital from Italian inflation: its yield depends on future inflation, which nobody knows, so the calculation asks you to assume a figure and shows the net to maturity.',
    resume: (h) => {
      const r = h.M.italia2032(10000, 2, anni(h));
      return `BTP Italia is an Italian government bond linked to Italian inflation, measured by ISTAT with the FOI index excluding tobacco. Capital is revalued every six months by that period’s inflation and the revaluation is paid at once, together with a coupon worked out at a fixed real rate on the revalued capital. The most recent issue read here is the ${R(h).nome}, with a ${h.num(R(h).tasso_reale, 2)}% real rate set in the Ministry of Economy release of ${h.date(R(h).comunicato)}. Assuming 2% inflation a year, ${h.eur(10000)} would earn about ${h.eur(r.netti)} net to maturity, ${h.pct(r.rendNetto, 2)} a year, after the ${h.pct(h.P.fisco.titoli_stato, 1)} tax and stamp duty. Higher inflation would raise the yield, lower inflation would cut it; in deflation the capital is not marked down and the coupon is worked out on face value. Today the bond can only be bought on the market, at a price other than 100.`;
    },
    faqs: (h) => [
      { q: 'Does BTP Italia protect against any inflation?', a: 'It protects against Italian inflation as measured by the FOI index excluding tobacco, which may differ from what each household experiences. Protection is full for those who hold to maturity; selling early gets the market price, which also depends on real rates at the time.' },
      { q: 'Is the capital revaluation taxed?', a: `Yes: the half-yearly revaluation BTP Italia pays is treated as income and taxed at ${h.pct(h.P.fisco.titoli_stato, 1)}, like the coupons. The site taxes coupons and revaluation together and takes off the ${h.pct(h.P.fisco.bollo, 2)} yearly stamp duty on the value of the bond, as for any other government bond.` },
      { q: 'How does it differ from BTP €i?', a: 'BTP €i is linked to euro-area inflation excluding tobacco and pays its revaluation at maturity rather than every six months. BTP Italia follows Italian prices and is aimed at retail savers. The site only calculates BTP Italia, the one sold to retail savers.' },
    ],
    body: (h) => `<h2>BTP Italia under five inflation assumptions</h2>
<p>The table uses the real rate from the ${h.src('mefBtpItalia', 'Ministry of Economy release')} and a price of 100, changing only the assumed inflation. Tax and stamp duty follow Italian ${h.src('dlgs239', 'bond tax law')} and ${h.src('dpr642', 'stamp duty law')}.</p>
${tab(h)}
<h2>How the BTP Italia yield is worked out</h2>
<p>The calculation is a yearly approximation: each year the gross is capital times (1 + inflation) × (1 + real rate) − 1, the revaluation plus the coupon on revalued capital. The result is not a forecast, since future inflation is unknown: it shows how much the net changes when inflation changes. To compare it with a fixed-rate BTP of the same term, the ${h.a('rendimento-btp', 'BTP net yield calculation')} gives the known net of a bond bought today.</p>`,
  },
});
