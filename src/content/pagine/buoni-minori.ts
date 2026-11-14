import { defineGuide } from '../../lib/guide-types';
import type { Helpers } from '../../lib/guide-types';

const b = (h: Helpers) => h.M.buonoById('minori');
const tab = (h: Helpers) => {
  const it = h.lang === 'it';
  const rows = [0, 3, 6, 10, 14, 16].map((eta) => { const anni = 18 - eta; const r = h.M.buono('minori', 1000, anni); return [it ? `${eta} anni` : `${eta} years`, String(anni), h.eur(r.valoreLordo, 2), h.eur(r.netto, 2)]; });
  return h.table(it ? ['Età all’acquisto', 'Anni fino ai 18', 'Valore lordo di 1.000 €', 'Netto (esente da bollo)'] : ['Age at purchase', 'Years to 18', 'Gross value of €1,000', 'Net (no stamp duty)'], rows,
    it ? `Buono dedicato ai Minori, tasso del ${h.num(b(h).tasso_unico as number, 2)}% lordo annuo composto per i Buoni sottoscritti dal ${h.date(b(h).dal)}` : `Savings bond for minors, ${h.num(b(h).tasso_unico as number, 2)}% gross a year compounded for bonds bought from ${h.date(b(h).dal)}`, ['l', 'r', 'r', 'r']);
};

export default defineGuide({
  id: 'buoni-minori',
  group: 'buoni',
  order: 3,
  tool: 'minori',
  related: ['buoni-fruttiferi-postali', 'buono-ordinario', 'tassazione-titoli-di-stato', 'home'],
  sources: ['posteMinori', 'posteBuoni', 'dpr642'],
  it: {
    slug: 'buoni-minori',
    nav: 'Buono per i minori',
    card: 'Quanto vale ai 18 anni il Buono dedicato ai Minori, secondo l’età del bambino e l’importo versato.',
    title: 'Buoni minori: quanto vale il Buono postale ai 18 anni',
    description: 'Buoni minori di Poste: dall’età del bambino e dall’importo, il valore lordo e netto ai 18 anni con il tasso in vigore, la tassa del 12,5% e il bollo annuo.',
    h1: 'Buoni minori: il valore ai 18 anni del bambino',
    intro: 'I Buoni minori di Poste crescono fino al diciottesimo compleanno del bambino a cui sono intestati: scegli l’età di oggi e l’importo, e il calcolo dà il valore netto ai 18 anni.',
    resume: (h) => {
      const t = b(h).tasso_unico as number;
      const r0 = h.M.buono('minori', 1000, 18), r10 = h.M.buono('minori', 1000, 8);
      return `Il Buono dedicato ai Minori è un Buono fruttifero postale intestato a un bambino o a un ragazzo sotto i 18 anni. Lo può comprare un genitore, un nonno o chiunque altro, ma i soldi restano del minore: alla maggiore età il titolare può chiederne il rimborso. Per i Buoni sottoscritti dal ${h.date(b(h).dal)} il tasso lordo annuo è del ${h.num(t, 2)}%, composto, e vale fino al diciottesimo compleanno, qualunque sia l’età all’acquisto, purché passino almeno ${b(h).min_periodo_mesi} mesi. Un Buono da ${h.eur(1000)} comprato alla nascita vale ${h.eur(r0.netto)} netti ai 18 anni; comprato a dieci anni vale ${h.eur(r10.netto)}. La tassa del ${h.pct(h.P.fisco.titoli_stato, 1)} si paga solo al rimborso. Il bollo, l’imposta dello 0,20% all’anno sul valore dei Buoni, non si paga finché i Buoni intestati al minore non superano ${h.eur(h.P.fisco.bollo_buoni_franchigia)} in tutto. Si compra fino ai 16 anni e mezzo del bambino; il rimborso prima dei 18 anni chiede l’autorizzazione del giudice tutelare.`;
    },
    faqs: (h) => [
      { q: 'Chi può comprare un Buono per un minore?', a: 'Qualsiasi maggiorenne, anche chi non è parente: il Buono può essere intestato solo al minore. Servono documento e codice fiscale di chi compra e del bambino. Il Buono cartaceo lo può comprare chiunque; quello dematerializzato si collega al Libretto Minori del bambino, gestito dal genitore.' },
      { q: 'Cosa succede al Buono quando il ragazzo compie 18 anni?', a: 'Il Buono scade: gli interessi maturano solo fino al compimento dei 18 anni e il titolare, diventato maggiorenne, lo riscuote. Poste indica che il diritto al rimborso si prescrive dieci anni dopo la scadenza: dopo, il Buono non si può più riscuotere. Conviene segnarsi la data.' },
      { q: 'Più Buoni minori o un Buono Ordinario intestato al bambino?', a: `Con le condizioni lette oggi il Buono Minori paga il ${h.num(b(h).tasso_unico as number, 2)}% per tutta la durata, mentre l’Ordinario parte da un tasso più basso e sale con gli anni. Il calcolo confronta solo i numeri: la scelta dipende anche da quando servirà il denaro, perché il Buono Minori prima dei 18 anni si rimborsa solo con l’autorizzazione del giudice tutelare.` },
    ],
    body: (h) => `<h2>Buoni minori: il valore secondo l’età all’acquisto</h2>
<p>Più anni mancano ai 18, più il Buono cresce. La tabella applica il tasso letto sulla ${h.src('posteMinori', 'pagina del Buono dedicato ai Minori')} a ${h.eur(1000)} per sei età diverse. Il bollo previsto dalla ${h.src('dpr642', 'legge')} non c’è, perché ${h.eur(1000)} restano sotto la soglia di ${h.eur(h.P.fisco.bollo_buoni_franchigia)}.</p>
${tab(h)}
<h2>Come si calcola il netto ai 18 anni</h2>
<p>Il valore lordo cresce ogni anno fino ai 18 anni, e gli interessi maturano anche sugli interessi già maturati; i mesi oltre l’ultimo anno pieno contano anch’essi. Gli interessi sono tassati al 12,5% al rimborso. Se i Buoni intestati al bambino superano ${h.eur(h.P.fisco.bollo_buoni_franchigia)}, il bollo dello 0,20% annuo si applica su tutto il valore: il campo «Altri Buoni» del calcolo serve a tenerne conto. Gli altri Buoni in emissione sono nella pagina ${h.a('buoni-fruttiferi-postali', 'sui Buoni fruttiferi postali')}.</p>`,
  },
  en: {
    slug: 'postal-bond-for-children',
    nav: 'Postal bond for children',
    card: 'What the Italian postal bond for minors is worth at 18, by the child’s age and the amount paid in.',
    title: 'Postal bond for children in Italy: its value at age 18',
    description: 'The Italian postal bond for children (Buono Minori): from the child’s age and the amount, its gross and net value at 18 at today’s rate, after 12.5% tax.',
    h1: 'Postal bond for children: its value at age 18',
    intro: 'The Italian postal bond for children grows until the eighteenth birthday of the child it is registered to: pick today’s age and the amount, and the calculation gives the net value at 18.',
    resume: (h) => {
      const t = b(h).tasso_unico as number;
      const r0 = h.M.buono('minori', 1000, 18), r10 = h.M.buono('minori', 1000, 8);
      return `The Buono dedicato ai Minori is an Italian postal savings bond registered to a child or teenager under 18. A parent, grandparent or anyone else can buy it, but the money belongs to the minor: on coming of age the holder can cash it in. For bonds bought from ${h.date(b(h).dal)} the gross yearly rate is ${h.num(t, 2)}%, compounded, and runs until the eighteenth birthday whatever the age at purchase, provided at least ${b(h).min_periodo_mesi} months pass. A ${h.eur(1000)} bond bought at birth is worth ${h.eur(r0.netto)} net at 18; bought at ten, ${h.eur(r10.netto)}. The ${h.pct(h.P.fisco.titoli_stato, 1)} tax is paid only at redemption. No stamp duty is due while the bonds in the minor’s name total ${h.eur(h.P.fisco.bollo_buoni_franchigia)} or less. It can be bought until the child is sixteen and a half; cashing in before 18 needs a guardianship judge’s approval.`;
    },
    faqs: (h) => [
      { q: 'Who can buy a postal bond for a child?', a: 'Any adult, even a non-relative: the bond can only be registered to the minor. ID and tax codes of the buyer and the child are needed. Anyone can buy the paper bond; the paperless one is linked to the child’s Libretto Minori savings book, run by a parent.' },
      { q: 'What happens when the child turns 18?', a: 'The bond matures: interest accrues only until the eighteenth birthday and the holder, now an adult, cashes it in. Poste states that the right to repayment lapses ten years after maturity: after that the bond can no longer be cashed. It is worth noting the date.' },
      { q: 'Several bonds for minors or one Buono Ordinario in the child’s name?', a: `On the terms read today the Minori bond pays ${h.num(b(h).tasso_unico as number, 2)}% throughout, while the Ordinario starts lower and rises over the years. The calculation only compares figures: the choice also depends on when the money will be needed, since before 18 the Minori bond can only be cashed in with a judge’s approval.` },
    ],
    body: (h) => `<h2>Value of the postal bond for children by age at purchase</h2>
<p>The more years until 18, the more the bond grows. The table applies the rate read on the ${h.src('posteMinori', 'savings bond for minors page')} to ${h.eur(1000)} at six different ages. There is no stamp duty under Italian ${h.src('dpr642', 'law')}, since ${h.eur(1000)} stays under the ${h.eur(h.P.fisco.bollo_buoni_franchigia)} limit.</p>
${tab(h)}
<h2>How the net value at 18 is worked out</h2>
<p>The gross value grows each year until age 18, and interest also earns interest; the months after the last full year count too. Interest is taxed at 12.5% at redemption. If the bonds in the child’s name exceed ${h.eur(h.P.fisco.bollo_buoni_franchigia)}, the 0.20% yearly stamp duty applies to the whole value: the “other bonds” field in the calculation accounts for it. The other bonds on sale are on the ${h.a('buoni-fruttiferi-postali', 'postal savings bonds')} page.</p>`,
  },
});
