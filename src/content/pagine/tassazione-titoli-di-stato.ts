import { defineGuide } from '../../lib/guide-types';
import type { Helpers } from '../../lib/guide-types';

const tab = (h: Helpers) => {
  const it = h.lang === 'it';
  const f = h.P.fisco;
  return h.table(it ? ['Prodotto', 'Tassa sugli interessi', 'Bollo', 'ISEE'] : ['Product', 'Tax on interest', 'Stamp duty', 'ISEE'], [
    [it ? 'BTP (Buoni del Tesoro poliennali), BOT (Buoni ordinari del Tesoro), CCTeu (Certificati di credito del Tesoro), BTP Valore, BTP Italia' : 'BTP (Buoni del Tesoro poliennali), BOT (Buoni ordinari del Tesoro), CCTeu (floating-rate Treasury certificates), BTP Valore, BTP Italia', h.pct(f.titoli_stato, 1), it ? `${h.pct(f.bollo, 2)} l’anno` : `${h.pct(f.bollo, 2)} a year`, it ? `esclusi fino a ${h.eur(f.isee_titoli_esclusi)}` : `left out up to ${h.eur(f.isee_titoli_esclusi)}`],
    [it ? 'Buoni fruttiferi postali' : 'Postal savings bonds', h.pct(f.titoli_stato, 1), it ? `${h.pct(f.bollo, 2)} sopra ${h.eur(f.bollo_buoni_franchigia)}` : `${h.pct(f.bollo, 2)} above ${h.eur(f.bollo_buoni_franchigia)}`, it ? `esclusi fino a ${h.eur(f.isee_titoli_esclusi)}` : `left out up to ${h.eur(f.isee_titoli_esclusi)}`],
    [it ? 'Libretto postale' : 'Postal savings book', h.pct(f.altri, 0), it ? `${h.eur(f.bollo_libretto_annuo, 2)} sopra 5.000 € di giacenza media` : `${h.eur(f.bollo_libretto_annuo, 2)} above €5,000 average balance`, it ? `esclusi fino a ${h.eur(f.isee_titoli_esclusi)}` : `left out up to ${h.eur(f.isee_titoli_esclusi)}`],
    [it ? 'Conto deposito' : 'Deposit account', h.pct(f.altri, 0), it ? `${h.pct(f.bollo, 2)} l’anno` : `${h.pct(f.bollo, 2)} a year`, it ? 'conta' : 'counted'],
  ], it ? 'Regole per le persone fisiche residenti che non investono nell’ambito di un’impresa' : 'Rules for resident individuals not investing through a business', ['l', 'r', 'l', 'l']);
};

export default defineGuide({
  id: 'tassazione-titoli-di-stato',
  group: 'titoli',
  order: 4,
  tool: 'tasse',
  related: ['rendimento-btp', 'conto-deposito-o-btp', 'buoni-fruttiferi-postali', 'home'],
  sources: ['dlgs239', 'dl66', 'dpr642', 'l213', 'posteLibretto'],
  it: {
    slug: 'tassazione-titoli-di-stato',
    nav: 'Tassazione titoli di Stato',
    card: 'Il 12,5% dei titoli di Stato contro il 26% di conti e depositi, il bollo e l’ISEE: quanto pesa sul tuo interesse.',
    title: 'Tassazione titoli di Stato: 12,5%, bollo e confronto al 26%',
    description: 'Tassazione dei titoli di Stato: 12,5% su BTP, BOT e Buoni postali contro il 26% di conti e depositi, bollo dello 0,20%, esclusione dall’ISEE, calcolo.',
    h1: 'Tassazione dei titoli di Stato: 12,5% e bollo',
    intro: 'La tassazione dei titoli di Stato è più leggera di quella di conti e depositi: 12,5% sugli interessi invece del 26%. Scrivi l’interesse lordo e il calcolo mostra il netto con le due aliquote e il bollo (l’imposta dello 0,20% all’anno sul valore dei titoli o del deposito).',
    resume: (h) => {
      const f = h.P.fisco; const n = h.M.netto(400);
      return `Gli interessi dei titoli di Stato italiani pagano un’imposta sostitutiva del ${h.pct(f.titoli_stato, 1)}, trattenuta dalla banca o da Poste quando incassi la cedola (l’interesse) o il rimborso. La stessa aliquota vale per i Buoni fruttiferi postali e per i titoli pubblici esteri dei Paesi della lista bianca. Gli interessi di conti correnti, conti deposito, libretti e obbligazioni societarie pagano invece il ${h.pct(f.altri, 0)}, l’aliquota fissata dal decreto-legge n. 66 del 2014. Su ${h.eur(400)} di interessi lordi la differenza è di ${h.eur(n.differenza)}: ${h.eur(n.titoli)} netti contro ${h.eur(n.altri)}. Il bollo è invece uguale per titoli e depositi: lo ${h.pct(f.bollo, 2)} l’anno sul valore, tranne i Buoni postali, esenti fino a ${h.eur(f.bollo_buoni_franchigia)}. Dal 2024 titoli di Stato, Buoni e libretti postali sono esclusi dall’ISEE fino a ${h.eur(f.isee_titoli_esclusi)}. Le minusvalenze sui titoli di Stato non sono trattate qui: il calcolo riguarda gli interessi.`;
    },
    faqs: (h) => [
      { q: 'La tassa del 12,5% va indicata nella dichiarazione dei redditi?', a: 'Di norma no: per chi tiene i titoli in banca o in Poste con il regime amministrato, l’intermediario trattiene l’imposta e la versa allo Stato. Gli interessi non si sommano agli altri redditi e non cambiano l’aliquota IRPEF. Chi ha titoli all’estero segue invece regole diverse.' },
      { q: 'Il 12,5% vale anche sullo scarto di emissione?', a: `Sì: la differenza tra 100 e il prezzo di emissione, che nei BOT è tutto il guadagno, paga il ${h.pct(h.P.fisco.titoli_stato, 1)} come gli interessi. Nei BOT la tassa è trattenuta subito all’acquisto, nei BTP alla scadenza o alla vendita. Il calcolo del sito tassa lo scarto in entrambi i casi.` },
      { q: 'Il bollo sui titoli ha un tetto?', a: `Per le persone fisiche no: lo ${h.pct(h.P.fisco.bollo, 2)} si applica su tutto il valore, senza minimo né massimo. Il tetto di 14.000 euro all’anno vale solo per i clienti diversi dalle persone fisiche. Sui Buoni postali il bollo scatta solo se il loro valore supera ${h.eur(h.P.fisco.bollo_buoni_franchigia)}.` },
    ],
    body: (h) => `<h2>Tassazione dei titoli di Stato e degli altri risparmi</h2>
<p>La tabella riassume le regole per i risparmiatori privati. Il 12,5% viene dal ${h.src('dlgs239', 'decreto legislativo n. 239 del 1996')}, il 26% dal ${h.src('dl66', 'decreto-legge n. 66 del 2014')}, il bollo dall’articolo 13 della tariffa del ${h.src('dpr642', 'DPR n. 642 del 1972')}, l’esclusione dall’ISEE dalla ${h.src('l213', 'legge n. 213 del 2023')}. Il bollo fisso del libretto è indicato da ${h.src('posteLibretto', 'Poste Italiane')}.</p>
${tab(h)}
<h2>Quanto vale lo sconto fiscale dei titoli di Stato</h2>
<p>Per avere lo stesso netto di un titolo di Stato, un deposito deve pagare un tasso lordo più alto di circa il 18%: un titolo al 3% lordo lascia quanto un deposito al ${h.num(3 * (1 - h.P.fisco.titoli_stato) / (1 - h.P.fisco.altri), 2)}%. È il motivo per cui, a tassi lordi simili, i titoli di Stato restano più convenienti dopo le tasse. Il confronto con il tasso della tua banca è nella pagina ${h.a('conto-deposito-o-btp', 'conto deposito o BTP')}.</p>`,
  },
  en: {
    slug: 'italian-bond-tax',
    nav: 'Italian bond tax',
    card: 'Italy’s 12.5% tax on government bonds against 26% on accounts and deposits, stamp duty and the ISEE.',
    title: 'Tax on Italian bonds: 12.5% rate, stamp duty and 26% rate',
    description: 'Tax on Italian bonds: 12.5% on BTP, BOT and postal bonds against 26% on accounts and deposits, 0.20% stamp duty, the ISEE exclusion, worked on your interest.',
    h1: 'Tax on Italian bonds: 12.5% and stamp duty',
    intro: 'Tax on Italian bonds is lighter than the tax on accounts and deposits: 12.5% on interest instead of 26%. Type the gross interest and the calculation shows the net at both rates, with stamp duty (the 0.20% yearly levy on the value of your bonds or deposit).',
    resume: (h) => {
      const f = h.P.fisco; const n = h.M.netto(400);
      return `Interest on Italian government bonds bears a ${h.pct(f.titoli_stato, 1)} substitute tax, withheld by the bank or Poste when you collect a coupon or repayment. The same rate applies to postal savings bonds and to foreign government bonds from white-list countries. Interest on current accounts, deposit accounts, savings books and corporate bonds is taxed at ${h.pct(f.altri, 0)} instead, the rate set by Decree-Law 66 of 2014. On ${h.eur(400)} of gross interest the gap is ${h.eur(n.differenza)}: ${h.eur(n.titoli)} net against ${h.eur(n.altri)}. Stamp duty, however, is the same for bonds and deposits: ${h.pct(f.bollo, 2)} a year on the value, except postal bonds, exempt up to ${h.eur(f.bollo_buoni_franchigia)}. Since 2024 government bonds, postal bonds and savings books are left out of the ISEE means test up to ${h.eur(f.isee_titoli_esclusi)}. Capital losses on government bonds are not covered here: the calculation is about interest.`;
    },
    faqs: (h) => [
      { q: 'Must the 12.5% tax go in the Italian tax return?', a: 'Usually not: for bonds held at a bank or Poste under the administered regime, the intermediary withholds the tax and pays it to the State. The interest is not added to other income and does not change the IRPEF income tax rate. Bonds held abroad follow different rules.' },
      { q: 'Does 12.5% also apply to the issue discount?', a: `Yes: the gap between 100 and the issue price, which for BOT is the whole gain, is taxed at ${h.pct(h.P.fisco.titoli_stato, 1)} like interest. On BOT the tax is withheld at purchase, on BTP at maturity or sale. The site’s calculation taxes the discount in both cases.` },
      { q: 'Is there a cap on stamp duty on bonds?', a: `Not for individuals: the ${h.pct(h.P.fisco.bollo, 2)} applies to the whole value, with no minimum or maximum. The 14,000 euro yearly cap applies only to clients other than individuals. On postal bonds stamp duty applies only above ${h.eur(h.P.fisco.bollo_buoni_franchigia)} in total, counting every bond you hold.` },
    ],
    body: (h) => `<h2>Tax on Italian bonds and other savings</h2>
<p>The table sums up the rules for private savers. The 12.5% comes from ${h.src('dlgs239', 'Legislative Decree 239 of 1996')}, the 26% from ${h.src('dl66', 'Decree-Law 66 of 2014')}, stamp duty from article 13 of the schedule to ${h.src('dpr642', 'Presidential Decree 642 of 1972')}, the ISEE exclusion from ${h.src('l213', 'Law 213 of 2023')}. The flat duty on savings books is stated by ${h.src('posteLibretto', 'Poste Italiane')}.</p>
${tab(h)}
<h2>What the government-bond tax break is worth</h2>
<p>To leave the same net as a government bond, a deposit must pay a gross rate about 18% higher: a bond at 3% gross leaves as much as a deposit at ${h.num(3 * (1 - h.P.fisco.titoli_stato) / (1 - h.P.fisco.altri), 2)}%. That is why, at similar gross rates, government bonds come out ahead after tax. The comparison with your bank’s rate is on the ${h.a('conto-deposito-o-btp', 'deposit account or BTP')} page.</p>`,
  },
});
