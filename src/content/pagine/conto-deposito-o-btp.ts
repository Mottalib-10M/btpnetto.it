import { defineGuide } from '../../lib/guide-types';
import type { Helpers } from '../../lib/guide-types';

const D = (h: Helpers) => h.P.deposito;
const tab = (h: Helpers) => {
  const it = h.lang === 'it';
  const b = h.M.btpPerDurata(3); const r = h.M.btp(b, 10000);
  const rows = [2.5, 3, 3.5, 4, 4.5].map((t) => { const d = h.M.deposito(10000, t, 3); return [`${h.num(t, 2)}%`, h.eur(d.netti), h.eur(r.guadagnoNetto), d.netti >= r.guadagnoNetto ? (it ? 'Deposito' : 'Deposit') : 'BTP']; });
  return h.table(it ? ['Tasso lordo del deposito', 'Netto deposito, 3 anni', `Netto ${b.nome.split(' (')[0]}`, 'Più alto'] : ['Deposit gross rate', 'Deposit net, 3 years', `Net ${b.nome.split(' (')[0].replace('anni', 'year')}`, 'Higher'], rows,
    it ? `10.000 € per circa tre anni; BTP con scadenza ${h.date(b.scadenza)} al prezzo d’asta del ${h.date(b.asta)}; deposito con interessi semplici, tassa del 26% e bollo` : `€10,000 for about three years; BTP maturing ${h.date(b.scadenza)} at the auction price of ${h.date(b.asta)}; deposit with simple interest, 26% tax and stamp duty`, ['r', 'r', 'r', 'l']);
};

export default defineGuide({
  id: 'conto-deposito-o-btp',
  group: 'confronti',
  order: 2,
  tool: 'confronto',
  outil: { solo: ['btp', 'deposito'], tassoVisibile: true },
  related: ['btp-o-buoni-postali', 'tassazione-titoli-di-stato', 'bot-rendimento', 'home'],
  sources: ['bceMir', 'bceTassi', 'mefAste', 'dl66'],
  it: {
    slug: 'conto-deposito-o-btp',
    nav: 'Conto deposito o BTP',
    card: 'Il tasso del tuo conto deposito contro un BTP della stessa durata: interessi netti con il 26% e il 12,5%.',
    title: 'Conto deposito o BTP: confronto netto con il tuo tasso',
    description: 'Conto deposito o BTP: scrivi il tasso lordo della tua banca e la durata, e confronta il netto dopo il 26% con un BTP tassato al 12,5%, bollo compreso.',
    h1: 'Conto deposito o BTP: quale lascia più netto',
    intro: 'Tra conto deposito o BTP (Buono del Tesoro poliennale, un prestito allo Stato che dura più anni) la differenza più grande è la tassa: 26% sugli interessi del deposito, 12,5% su quelli del BTP. Scrivi il tasso che ti offre la banca e il calcolo confronta i due netti.',
    resume: (h) => {
      const t = D(h).oltre_2_anni, eq = t * (1 - h.P.fisco.altri) / (1 - h.P.fisco.titoli_stato);
      return `Un conto deposito vincolato paga un tasso lordo fisso per la durata del vincolo; la banca trattiene il ${h.pct(h.P.fisco.altri, 0)} sugli interessi e applica il bollo dello ${h.pct(h.P.fisco.bollo, 2)} annuo. Un BTP comprato oggi e tenuto fino alla scadenza paga cedole (gli interessi, ogni sei mesi) e rimborso tassati al ${h.pct(h.P.fisco.titoli_stato, 1)}, con lo stesso bollo. A parità di tasso lordo il BTP lascia quindi più netto: un deposito al ${h.num(t, 2)}% lordo equivale, dopo la tassa, a un titolo di Stato al ${h.num(eq, 2)}% lordo. Secondo le statistiche della Banca centrale europea, a ${D(h).mese.replace('2026-09', 'settembre 2026')} i nuovi depositi vincolati delle famiglie italiane pagavano in media il ${h.num(D(h).entro_1_anno, 2)}% fino a un anno e il ${h.num(D(h).oltre_2_anni, 2)}% oltre due anni. Il deposito però non ha un prezzo che oscilla e, se svincolabile, permette di uscire prima. Il calcolo usa il tasso che scrivi tu, quello della tua offerta.`;
    },
    faqs: (h) => [
      { q: 'Il conto deposito è garantito come un BTP?', a: 'In modo diverso: il conto deposito è coperto dal Fondo interbancario di tutela dei depositi fino a 100.000 euro per depositante e per banca; il BTP è un debito diretto dello Stato, senza limite di importo. Il calcolo confronta solo i rendimenti netti, non i rischi.' },
      { q: 'Perché nel confronto il deposito non capitalizza gli interessi?', a: 'Perché la maggior parte dei depositi vincolati paga gli interessi alla scadenza del vincolo o periodicamente sul conto, senza reinvestirli. Anche le cedole del BTP non sono reinvestite. Così i due netti sono confrontabili; con interessi capitalizzati il deposito guadagnerebbe poco di più.' },
      { q: 'Il bollo si paga anche sul conto deposito?', a: `Sì, lo ${h.pct(h.P.fisco.bollo, 2)} annuo sul valore del deposito, come per i titoli nel conto titoli. Per i conti correnti e i libretti postali esiste invece un bollo fisso di ${h.eur(h.P.fisco.bollo_libretto_annuo, 2)} all’anno per le persone fisiche, dovuto quando la giacenza media supera 5.000 euro.` },
    ],
    body: (h) => `<h2>Conto deposito o BTP: il punto di pareggio</h2>
<p>La tabella tiene fisso il BTP con la scadenza più vicina a tre anni, dall’${h.src('mefAste', 'ultima asta del Tesoro')}, e fa variare il tasso del deposito. Il 26% è l’aliquota della ${h.src('dl66', 'legge')}, che lascia il 12,5% ai titoli di Stato.</p>
${tab(h)}
<h2>Il tasso medio dei depositi in Italia</h2>
<p>Il valore proposto nel calcolo è la media dei nuovi depositi vincolati delle famiglie italiane pubblicata dalla ${h.src('bceMir', 'Banca centrale europea')}: ${h.num(D(h).entro_1_anno, 2)}% fino a un anno, ${h.num(D(h).oltre_2_anni, 2)}% oltre due anni, nel mese di ${D(h).mese.replace('2026-09', 'settembre 2026')}. Il tasso BCE sui depositi delle banche è del ${h.num(D(h).bce_depositi, 2)}% (${h.src('bceTassi', 'dato BCE')}). Le offerte delle singole banche possono essere più alte o più basse: scrivi la tua. Per un anno o meno il confronto giusto è con i BOT (Buoni ordinari del Tesoro, prestiti allo Stato che durano al massimo un anno), nella pagina ${h.a('bot-rendimento', 'sul rendimento dei BOT')}.</p>`,
  },
  en: {
    slug: 'deposit-account-or-btp',
    nav: 'Deposit account or BTP',
    card: 'Your deposit account rate against a BTP of the same term: net interest after 26% and 12.5% tax.',
    title: 'Deposit account or BTP: net comparison at your own rate',
    description: 'Deposit account or BTP in Italy: type your bank’s gross rate and the term, and compare the net after 26% tax with a BTP taxed at 12.5%, stamp duty included.',
    h1: 'Deposit account or BTP: which leaves more net',
    intro: 'Between a deposit account or BTP (Buono del Tesoro poliennale, a loan to the Italian State lasting several years) the biggest gap is tax: 26% on deposit interest, 12.5% on BTP interest. Type the rate your bank offers and the calculation compares the two net figures.',
    resume: (h) => {
      const t = D(h).oltre_2_anni, eq = t * (1 - h.P.fisco.altri) / (1 - h.P.fisco.titoli_stato);
      return `An Italian fixed-term deposit account pays a fixed gross rate for the term; the bank withholds ${h.pct(h.P.fisco.altri, 0)} of the interest and charges the ${h.pct(h.P.fisco.bollo, 2)} yearly stamp duty. A BTP bought today and held to maturity pays coupons (the interest, every six months) and repayment taxed at ${h.pct(h.P.fisco.titoli_stato, 1)}, with the same stamp duty. At the same gross rate the BTP therefore leaves more: a deposit at ${h.num(t, 2)}% gross is worth, after tax, the same as a government bond at ${h.num(eq, 2)}% gross. According to European Central Bank statistics, in ${D(h).mese.replace('2026-09', 'September 2026')} new fixed-term deposits of Italian households paid on average ${h.num(D(h).entro_1_anno, 2)}% up to a year and ${h.num(D(h).oltre_2_anni, 2)}% over two years. A deposit, though, has no price that moves and, if it can be unlocked, lets you leave early. The calculation uses the rate you type, the one from your own offer.`;
    },
    faqs: (h) => [
      { q: 'Is a deposit account protected like a BTP?', a: 'Differently: a deposit account is covered by the Italian interbank deposit guarantee fund up to 100,000 euros per depositor per bank; a BTP is a direct State debt, with no amount limit. The calculation compares net returns only, not risks.' },
      { q: 'Why does the deposit not compound in the comparison?', a: 'Because most fixed-term deposits pay interest at the end of the term or periodically into the account, without reinvesting it. BTP coupons are not reinvested either. That keeps the two figures comparable; with compounding the deposit would earn slightly more.' },
      { q: 'Is stamp duty due on a deposit account too?', a: `Yes, ${h.pct(h.P.fisco.bollo, 2)} a year on the deposit’s value, as for bonds in a securities account. Current accounts and postal savings books instead carry a flat ${h.eur(h.P.fisco.bollo_libretto_annuo, 2)} a year for individuals, due when the average balance exceeds 5,000 euros. Check your bank’s statement to see which one applies.` },
    ],
    body: (h) => `<h2>Deposit account or BTP: the break-even rate</h2>
<p>The table holds fixed the BTP maturing closest to three years, from the ${h.src('mefAste', 'latest Treasury auction')}, and varies the deposit rate. The 26% is the rate set by Italian ${h.src('dl66', 'law')}, which kept 12.5% for government bonds.</p>
${tab(h)}
<h2>Average deposit rates in Italy</h2>
<p>The figure suggested in the calculation is the average for new fixed-term deposits of Italian households published by the ${h.src('bceMir', 'European Central Bank')}: ${h.num(D(h).entro_1_anno, 2)}% up to a year, ${h.num(D(h).oltre_2_anni, 2)}% over two years, in ${D(h).mese.replace('2026-09', 'September 2026')}. The ECB deposit facility rate is ${h.num(D(h).bce_depositi, 2)}% (${h.src('bceTassi', 'ECB data')}). Individual bank offers can be higher or lower: type your own. For a year or less the right comparison is with BOT (Buoni ordinari del Tesoro, loans to the State lasting a year at most), on the ${h.a('bot-rendimento', 'BOT net yield')} page.</p>`,
  },
});
