import { defineGuide } from '../../lib/guide-types';
import { tabBtp } from '../../lib/contenuti';

const es = (h: Parameters<typeof tabBtp>[0]) => { const a = h.M.btpPerDurata(5); return { a, r: h.M.btp(a, 10000) }; };

export default defineGuide({
  id: 'rendimento-btp',
  group: 'titoli',
  order: 1,
  tool: 'btp',
  related: ['aste-titoli-di-stato', 'tassazione-titoli-di-stato', 'bot-rendimento', 'home'],
  sources: ['mefAste', 'dlgs239', 'dpr642'],
  it: {
    slug: 'rendimento-btp',
    nav: 'Rendimento netto BTP',
    card: 'Scegli un BTP delle ultime aste, scrivi l’importo: cedole nette, tasse, bollo e rendimento netto annuo.',
    title: 'Rendimento netto BTP: calcolo sull’importo e prezzo d’asta',
    description: 'Rendimento netto dei BTP: scegli il titolo, scrivi l’importo e vedi cedole nette, tassa del 12,5%, bollo e netto annuo, al prezzo dell’ultima asta del Tesoro.',
    h1: 'Rendimento netto BTP: il calcolo per il tuo importo',
    intro: 'Il rendimento netto di un BTP è quello che resta dopo la tassa del 12,5% sulle cedole (gli interessi pagati ogni sei mesi) e sullo scarto (la differenza tra 100 e il prezzo di emissione), e dopo il bollo (l’imposta dello 0,20% all’anno sul valore dei titoli): scegli il titolo, scrivi quanto investi e il calcolo parte dal prezzo dell’ultima asta.',
    resume: (h) => {
      const { a, r } = es(h);
      return `Il rendimento netto di un BTP dipende da tre cose: la cedola, il prezzo pagato e il tempo che manca alla scadenza. La cedola si incassa ogni sei mesi e su di essa lo Stato trattiene il ${h.pct(h.P.fisco.titoli_stato, 1)}. Se compri sotto 100, alla scadenza ti viene rimborsato 100 e anche questa differenza paga il ${h.pct(h.P.fisco.titoli_stato, 1)}. Ogni anno la banca applica poi il bollo dello ${h.pct(h.P.fisco.bollo, 2)} sul valore dei titoli. Esempio: ${h.eur(10000)} sul ${a.nome.split(' (')[0]} con cedola ${h.num(a.cedola as number, 2)}% e scadenza il ${h.date(a.scadenza)}, al prezzo d’asta di ${h.num(a.prezzo, 2)} del ${h.date(a.asta)}, rendono ${h.eur(r.guadagnoNetto)} netti fino alla scadenza, cioè il ${h.pct(r.irrNetto, 2)} all’anno contro il ${h.pct(r.irrLordo, 2)} lordo. La differenza tra lordo e netto è quasi tutta tassa e bollo, mentre il prezzo pesa sul rendimento più della cedola quando il titolo è lontano da 100.`;
    },
    faqs: (h) => [
      { q: 'Perché il rendimento netto di un BTP è più basso della cedola?', a: `Non sempre: se compri sotto 100 incassi anche la differenza fino al rimborso, e il rendimento può superare la cedola. Il netto scende per la tassa del ${h.pct(h.P.fisco.titoli_stato, 1)} sugli interessi e sullo scarto e per il bollo dello ${h.pct(h.P.fisco.bollo, 2)} annuo. Per un BTP comprato a 100 il netto annuo è circa la cedola meno un ottavo, meno due millesimi.` },
      { q: 'Quale prezzo devo scrivere nel calcolo?', a: 'Il prezzo «tel quel» è il prezzo senza rateo che vedi nell’app della banca o di Poste alla voce del titolo. Se lasci 0, il calcolo usa il prezzo medio dell’ultima asta del Tesoro, con la data scritta accanto. Il rateo, cioè la cedola maturata dall’ultimo stacco, viene aggiunto dal calcolo e ti torna con la cedola successiva.' },
      { q: 'Se vendo il BTP prima della scadenza vale lo stesso calcolo?', a: 'No. Vendendo prima incassi il prezzo di mercato di quel giorno, che può essere più alto o più basso di quello pagato: se i tassi salgono, il prezzo scende. Il calcolo vale per chi tiene il titolo fino al rimborso a 100, l’unico caso in cui il risultato è noto oggi.' },
    ],
    body: (h) => {
      const { a, r } = es(h);
      return `<h2>Il rendimento netto BTP passo per passo</h2>
<p>Il calcolo segue i flussi veri di un titolo comprato oggi e tenuto fino alla scadenza. Prima la spesa: valore nominale per il prezzo, più il rateo maturato dall’ultima cedola. Poi le cedole: ogni sei mesi, alla data del giorno e del mese della scadenza, nette del ${h.pct(h.P.fisco.titoli_stato, 1)} come prevede la ${h.src('dlgs239', 'legge')}. Infine il rimborso a 100, meno la tassa sullo scarto se il prezzo era sotto la pari, e il bollo dello ${h.pct(h.P.fisco.bollo, 2)} l’anno previsto dalla ${h.src('dpr642', 'legge sul bollo')}. Il rendimento netto annuo è il tasso che rende uguale la spesa alla somma dei flussi netti scontati.</p>
${h.table(['Voce', 'Esempio'], [['Titolo', `${a.nome.split(' (')[0]} ${h.num(a.cedola as number, 2)}%`], ['Spesa con rateo (netto)', h.eur(r.costoNetto, 2)], [`Cedole nette (${r.nCedole})`, h.eur(r.cedoleNette, 2)], ['Tassa sullo scarto', h.eur(r.tassaScarto, 2)], ['Bollo stimato', h.eur(r.bollo, 2)], ['Guadagno netto', h.eur(r.guadagnoNetto, 2)]], `Esempio su ${h.eur(10000)} nominali, prezzo d’asta del ${h.date(a.asta)}`, ['l', 'r'])}
<h2>Tutti i BTP delle ultime aste</h2>
<p>Ogni riga è l’ultima asta di quel titolo pubblicata dal ${h.src('mefAste', 'Dipartimento del Tesoro')}. Il rendimento lordo, cioè prima delle tasse, è quello stampato nel PDF dei risultati; il netto è calcolato dallo stesso giorno dell’asta, dopo tassa e bollo, così le due colonne si confrontano. Chi compra oggi paga il prezzo di oggi: per il suo caso c’è il calcolo in cima alla pagina. I titoli con «vita residua» sono BTP emessi anni fa e riaperti: hanno cedole più basse e prezzi più lontani da 100, quindi una parte maggiore del guadagno arriva dallo scarto.</p>
${tabBtp(h)}
<p>Il prezzo d’asta non è il prezzo di oggi: tra un’asta e l’altra il prezzo sul mercato secondario si muove ogni giorno. Per questo il campo del prezzo resta aperto: chi lo vede in banca lo scrive e il calcolo si rifà.</p>`;
    },
  },
  en: {
    slug: 'btp-net-yield',
    nav: 'BTP net yield',
    card: 'Pick a BTP from the latest auctions, type the amount: net coupons, tax, stamp duty and net yearly yield.',
    title: 'BTP net yield: Italian bond return on your amount, 2026',
    description: 'BTP net yield for Italian government bonds: pick the bond, type the amount, see net coupons, 12.5% tax, stamp duty and the net yearly yield at auction price.',
    h1: 'BTP net yield: the calculation for your amount',
    intro: 'The BTP net yield is what is left after the 12.5% tax on the coupons (the interest paid every six months) and on the discount (the gap between 100 and the issue price), and after stamp duty (the 0.20% yearly levy on the value of your bonds): pick the bond, type how much you invest and the calculation starts from the latest auction price.',
    resume: (h) => {
      const { a, r } = es(h);
      return `The net yield of a BTP, Italy’s fixed-rate government bond, depends on three things: the coupon, the price paid and the time left to maturity. The coupon arrives every six months and the State keeps ${h.pct(h.P.fisco.titoli_stato, 1)} of it. If you buy below 100, you are repaid 100 at maturity and that gap is also taxed at ${h.pct(h.P.fisco.titoli_stato, 1)}. Every year the bank then charges the ${h.pct(h.P.fisco.bollo, 2)} stamp duty (bollo) on the value of the bonds. Example: ${h.eur(10000)} in the ${a.nome.split(' (')[0].replace('anni', 'year')} bond with a ${h.num(a.cedola as number, 2)}% coupon maturing on ${h.date(a.scadenza)}, at the auction price of ${h.num(a.prezzo, 2)} on ${h.date(a.asta)}, earns ${h.eur(r.guadagnoNetto)} net to maturity, ${h.pct(r.irrNetto, 2)} a year against ${h.pct(r.irrLordo, 2)} gross. Almost all of the gap between gross and net is tax and stamp duty, while the price weighs more than the coupon when the bond trades far from 100.`;
    },
    faqs: (h) => [
      { q: 'Why is a BTP’s net yield lower than its coupon?', a: `Not always: if you buy below 100 you also collect the gap up to repayment, and the yield can beat the coupon. The net figure falls because of the ${h.pct(h.P.fisco.titoli_stato, 1)} tax on interest and on the discount, and the ${h.pct(h.P.fisco.bollo, 2)} yearly stamp duty. For a BTP bought at 100 the net yearly yield is roughly the coupon minus one eighth, minus two thousandths.` },
      { q: 'Which price should I type into the calculation?', a: 'The clean price, without accrued interest, shown in your bank or Poste app next to the bond. If you leave 0, the calculation uses the average price of the latest Treasury auction, with its date shown. Accrued interest, the coupon built up since the last payment, is added by the calculation and comes back to you with the next coupon.' },
      { q: 'Does the same calculation hold if I sell before maturity?', a: 'No. Selling early gets you that day’s market price, which can be above or below what you paid: when rates rise, prices fall. The calculation holds for a bond kept until it is repaid at 100, the only case whose result is known today.' },
    ],
    body: (h) => {
      const { a, r } = es(h);
      return `<h2>BTP net yield step by step</h2>
<p>The calculation follows the real cash flows of a bond bought today and held to maturity. First the cost: face value times price, plus interest accrued since the last coupon. Then the coupons: every six months, on the day and month of maturity, net of ${h.pct(h.P.fisco.titoli_stato, 1)} as set by Italian ${h.src('dlgs239', 'law')}. Finally repayment at 100, less the tax on the discount if the price was below par, and the ${h.pct(h.P.fisco.bollo, 2)} yearly stamp duty of Italian ${h.src('dpr642', 'law')}. The net yearly yield is the rate that makes the cost equal to the discounted net cash flows.</p>
${h.table(['Item', 'Example'], [['Bond', `${a.nome.split(' (')[0].replace('anni', 'year')} ${h.num(a.cedola as number, 2)}%`], ['Cost with accrued interest (net)', h.eur(r.costoNetto, 2)], [`Net coupons (${r.nCedole})`, h.eur(r.cedoleNette, 2)], ['Tax on the discount', h.eur(r.tassaScarto, 2)], ['Estimated stamp duty', h.eur(r.bollo, 2)], ['Net gain', h.eur(r.guadagnoNetto, 2)]], `Example on ${h.eur(10000)} face value, auction price of ${h.date(a.asta)}`, ['l', 'r'])}
<h2>Every BTP from the latest auctions</h2>
<p>Each row is the latest auction of that bond published by the ${h.src('mefAste', 'Treasury Department')}. The gross yield, before tax, is the one printed in the results PDF; the net one is worked out from the same auction day, after tax and stamp duty, so the two columns can be compared. Anyone buying today pays today’s price: the calculation at the top of the page covers that case. Bonds marked “remaining” were issued years ago and reopened: they carry lower coupons and prices further from 100, so more of the gain comes from the discount.</p>
${tabBtp(h)}
<p>The auction price is not today’s price: between auctions the market price moves every day. That is why the price field stays open: if your bank shows a price, type it and the calculation reruns.</p>`;
    },
  },
});
