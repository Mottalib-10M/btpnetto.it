import { defineGuide } from '../../lib/guide-types';
import type { Helpers } from '../../lib/guide-types';

const R = (h: Helpers) => h.P.retail;
const tab = (h: Helpers) => {
  const it = h.lang === 'it';
  const v1 = R(h).valore_2031, v2 = R(h).valore_2032, ins = R(h).insieme_2031;
  const a = h.M.valore2031(10000, 5), b = h.M.valore2032(10000, 6), c = h.M.insieme2031(10000);
  return h.table(it ? ['Emissione', 'Tassi lordi', 'Scadenza', 'Netto su 10.000 € a scadenza', 'Netto annuo'] : ['Issue', 'Gross rates', 'Maturity', 'Net on €10,000 at maturity', 'Net per year'], [
    [v1.nome, v1.tassi.map(([, t]) => h.num(t, 2)).join(' · ') + '%', h.date(v1.scadenza), h.eur(a.netti), h.pct(a.rendNetto, 2)],
    [ins.nome, it ? `${h.num(ins.cedola_unica, 2)}% in una volta` : `${h.num(ins.cedola_unica, 2)}% at once`, h.date(ins.scadenza), h.eur(c.netti), h.pct(c.rendNetto, 2)],
    [v2.nome, v2.tassi.map(([, t]) => h.num(t, 2)).join(' · ') + `% + ${h.num(v2.premio_finale, 1)}%`, h.date(v2.scadenza), h.eur(b.netti), h.pct(b.rendNetto, 2)],
  ], it ? 'Tassi definitivi dei comunicati MEF, acquisto a 100 in emissione, interessi netti di tassa del 12,5% e bollo; netto annuo semplice (composto per il Valore Insieme)' : 'Final rates from the Ministry releases, bought at 100 at issue, interest net of 12.5% tax and stamp duty; simple yearly net (compounded for Valore Insieme)', ['l', 'l', 'l', 'r', 'r']);
};

export default defineGuide({
  id: 'btp-valore',
  group: 'retail',
  order: 1,
  tool: 'valore',
  related: ['btp-italia', 'rendimento-btp', 'btp-o-buoni-postali', 'home'],
  sources: ['mefBtpValore', 'mefBtpValore2032', 'dlgs239'],
  it: {
    slug: 'btp-valore',
    nav: 'BTP Valore',
    card: 'Le cedole nette dei BTP Valore e del BTP Valore Insieme, anno per anno, con i tassi definitivi del Tesoro.',
    title: 'BTP Valore: cedole nette e rendimento con i tassi definitivi',
    description: 'BTP Valore 2031, Valore Insieme e Valore 2032: cedole nette anno per anno con i tassi definitivi del MEF, premio finale, tassa del 12,5% e bollo annuo.',
    h1: 'BTP Valore: quanto rendono netti',
    intro: 'I BTP Valore sono riservati ai risparmiatori e pagano cedole che salgono nel tempo: scegli l’emissione, scrivi l’importo e gli anni, e il calcolo mostra le cedole nette con i tassi definitivi del Tesoro.',
    resume: (h) => {
      const v1 = R(h).valore_2031, a = h.M.valore2031(10000, 5), c = h.M.insieme2031(10000);
      return `I BTP Valore sono titoli di Stato venduti solo ai risparmiatori, in finestre di pochi giorni, al prezzo di 100 e senza commissioni se sottoscritti in emissione. Il tasso cresce a gradini: l’ultimo collocato, il ${v1.nome}, paga ${v1.tassi.map(([, t]) => h.num(t, 2) + '%').join(', ')} nei cinque anni, con cedole ogni tre mesi. I tassi definitivi sono stati fissati dal comunicato del Ministero dell’economia del ${h.date(v1.comunicato)}, sopra i minimi annunciati prima del collocamento. Su ${h.eur(10000)} tenuti fino alla scadenza le cedole nette sommano ${h.eur(a.netti)}, cioè il ${h.pct(a.rendNetto, 2)} all’anno, dopo la tassa del ${h.pct(h.P.fisco.titoli_stato, 1)} e il bollo. Nella stessa finestra il BTP Valore Insieme paga invece una cedola unica del ${h.num(R(h).insieme_2031.cedola_unica, 2)}% alla scadenza: ${h.eur(c.netti)} netti su ${h.eur(10000)}. Chi vende prima incassa il prezzo di Borsa del giorno, che il calcolo non può conoscere.`;
    },
    faqs: (h) => [
      { q: 'Si può ancora comprare il BTP Valore dopo il collocamento?', a: 'Sì, ma in Borsa sul mercato MOT, al prezzo del giorno e con la commissione della banca, non più a 100. Il premio finale, quando previsto, spetta solo a chi ha sottoscritto in emissione e tiene il titolo fino alla scadenza. Il calcolo del sito vale per chi ha comprato a 100.' },
      { q: 'Che differenza c’è tra BTP Valore e BTP Valore Insieme?', a: `Il BTP Valore paga cedole trimestrali crescenti; il Valore Insieme dello stesso collocamento paga una sola cedola del ${h.num(R(h).insieme_2031.cedola_unica, 2)}% alla scadenza. Lorda, la cedola unica supera la somma delle cedole del BTP Valore (${h.num(R(h).valore_2031.tassi.reduce((s, [, t]) => s + t, 0), 2)}%), ma si incassa tutta alla fine: chi tiene il BTP Valore riceve prima le cedole e può reinvestirle.` },
      { q: 'Quando ci sarà il prossimo BTP Valore?', a: 'Lo annuncia il Ministero dell’economia con un comunicato qualche settimana prima, con i tassi minimi garantiti; i tassi definitivi escono l’ultimo giorno del collocamento. Il sito riporta l’ultima emissione letta e la data del comunicato: una nuova emissione non cambia i titoli già comprati.' },
    ],
    body: (h) => `<h2>Le emissioni di BTP Valore lette sui comunicati</h2>
<p>La tabella riassume le ultime emissioni riservate ai risparmiatori, con i tassi definitivi letti nei comunicati del ${h.src('mefBtpValore', 'Ministero dell’economia del 23 ottobre 2026')} e del ${h.src('mefBtpValore2032', '6 marzo 2026')}. Il netto toglie il 12,5% previsto dalla ${h.src('dlgs239', 'legge')} e il bollo dello 0,20% annuo.</p>
${tab(h)}
<h2>Come si calcola il rendimento del BTP Valore</h2>
<p>Ogni anno la cedola è il tasso di quell’anno per il capitale. Il calcolo somma le cedole degli anni pieni che tieni il titolo, aggiunge il premio finale se arrivi alla scadenza e toglie tassa e bollo. Il netto annuo è la somma divisa per il capitale e per gli anni, senza reinvestire le cedole. Per i BTP ordinari comprati sotto 100 il conto è diverso, perché c’è anche lo scarto: è nella pagina sul ${h.a('rendimento-btp', 'rendimento netto dei BTP')}.</p>`,
  },
  en: {
    slug: 'btp-valore',
    nav: 'BTP Valore',
    card: 'Net coupons on BTP Valore and BTP Valore Insieme, year by year, at the Treasury’s final rates.',
    title: 'BTP Valore: net coupons and yield at final Treasury rates',
    description: 'BTP Valore 2031, Valore Insieme and Valore 2032: net coupons year by year at the Ministry’s final rates, final bonus, 12.5% tax and stamp duty, for your amount.',
    h1: 'BTP Valore: what it returns net',
    intro: 'BTP Valore bonds are sold only to retail savers and pay coupons that step up over time: pick the issue, type the amount and years, and the calculation shows net coupons at the Treasury’s final rates.',
    resume: (h) => {
      const v1 = R(h).valore_2031, a = h.M.valore2031(10000, 5), c = h.M.insieme2031(10000);
      return `BTP Valore are Italian government bonds sold only to retail savers, in windows of a few days, at a price of 100 and with no fee at issue. The rate steps up: the latest one placed, the ${v1.nome}, pays ${v1.tassi.map(([, t]) => h.num(t, 2) + '%').join(', ')} over five years, with coupons every three months. The final rates were set in the Ministry of Economy release of ${h.date(v1.comunicato)}, above the minimums announced before the placement. On ${h.eur(10000)} held to maturity the net coupons add up to ${h.eur(a.netti)}, ${h.pct(a.rendNetto, 2)} a year, after the ${h.pct(h.P.fisco.titoli_stato, 1)} tax and stamp duty. In the same window the BTP Valore Insieme instead pays a single ${h.num(R(h).insieme_2031.cedola_unica, 2)}% coupon at maturity: ${h.eur(c.netti)} net on ${h.eur(10000)}. Selling early gets that day’s market price, which the calculation cannot know.`;
    },
    faqs: (h) => [
      { q: 'Can I still buy BTP Valore after the placement?', a: 'Yes, but on the MOT market at the going price and with your bank’s fee, no longer at 100. Any final bonus goes only to those who subscribed at issue and hold to maturity. The site’s calculation is for bonds bought at 100.' },
      { q: 'What is the difference between BTP Valore and BTP Valore Insieme?', a: `BTP Valore pays rising quarterly coupons; the Valore Insieme from the same placement pays a single ${h.num(R(h).insieme_2031.cedola_unica, 2)}% coupon at maturity. Gross, the single coupon beats the sum of the BTP Valore coupons (${h.num(R(h).valore_2031.tassi.reduce((s, [, t]) => s + t, 0), 2)}%), but it all arrives at the end: BTP Valore holders get their coupons earlier and can reinvest them.` },
      { q: 'When is the next BTP Valore?', a: 'The Ministry of Economy announces it a few weeks ahead with guaranteed minimum rates; final rates come out on the last day of the placement. The site shows the latest issue read and the release date: a new issue does not change bonds already bought.' },
    ],
    body: (h) => `<h2>BTP Valore issues read from the releases</h2>
<p>The table sums up the latest retail-only issues, with the final rates read in the ${h.src('mefBtpValore', 'Ministry of Economy release of 23 October 2026')} and the one of ${h.src('mefBtpValore2032', '6 March 2026')}. The net figure takes off the 12.5% set by Italian ${h.src('dlgs239', 'law')} and the 0.20% yearly stamp duty.</p>
${tab(h)}
<h2>How the BTP Valore yield is worked out</h2>
<p>Each year the coupon is that year’s rate times the capital. The calculation adds the coupons for the full years you hold the bond, adds the final bonus if you reach maturity and takes off tax and stamp duty. The yearly net is that sum divided by the capital and the years, with no coupon reinvestment. For ordinary BTP bought below 100 the sum differs, since there is also the discount: see the ${h.a('rendimento-btp', 'BTP net yield')} page.</p>`,
  },
});
