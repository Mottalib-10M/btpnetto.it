import { defineGuide } from '../../lib/guide-types';
import type { Helpers } from '../../lib/guide-types';

const b = (h: Helpers) => h.M.buonoById('ordinario');
const tab = (h: Helpers) => {
  const it = h.lang === 'it';
  return h.table(it ? ['Anni di possesso', 'Tasso lordo', 'Valore lordo di 1.000 €', 'Netto (esente da bollo)'] : ['Years held', 'Gross rate', 'Gross value of €1,000', 'Net (no stamp duty)'],
    (b(h).tassi ?? []).map(([y, t]) => { const r = h.M.buono('ordinario', 1000, y); return [String(y), `${h.num(t, 2)}%`, h.eur(r.valoreLordo, 2), h.eur(r.netto, 2)]; }),
    it ? `Buono Ordinario, condizioni in vigore dal ${h.date(b(h).dal)}: rendimento effettivo annuo lordo alla fine di ciascun periodo` : `Buono Ordinario, terms in force from ${h.date(b(h).dal)}: gross effective yearly yield at the end of each holding period`, ['l', 'r', 'r', 'r']);
};

export default defineGuide({
  id: 'buono-ordinario',
  group: 'buoni',
  order: 2,
  tool: 'buono',
  outil: { fisso: 'ordinario' },
  related: ['buoni-fruttiferi-postali', 'btp-o-buoni-postali', 'buoni-minori', 'home'],
  sources: ['posteOrdinario', 'posteBuoni', 'dlgs239'],
  it: {
    slug: 'buono-ordinario',
    nav: 'Buono Ordinario',
    card: 'Il valore del Buono Ordinario anno per anno, per 20 anni: tasso lordo, valore e netto per il tuo importo.',
    title: 'Buono Ordinario: valore anno per anno e calcolo del netto',
    description: 'Buono Ordinario di Poste: tasso lordo per ogni anno di possesso fino a 20, valore lordo e netto per il tuo importo, tassa del 12,5% e bollo sopra 5.000 €.',
    h1: 'Buono Ordinario: quanto vale anno per anno',
    intro: 'Il Buono Ordinario dura vent’anni e paga un tasso che cresce con il tempo di possesso: scrivi l’importo e l’anno in cui lo rimborsi, e il calcolo mostra il valore lordo e netto per ogni anno.',
    resume: (h) => {
      const t = b(h).tassi ?? [];
      const r10 = h.M.buono('ordinario', 10000, 10), r20 = h.M.buono('ordinario', 10000, 20);
      return `Il Buono Ordinario è il Buono fruttifero postale più antico, venduto da Poste Italiane da un secolo, ed è l’unico in emissione che si può rimborsare con gli interessi in qualsiasi anno, a partire dal primo. Per i Buoni sottoscritti con le condizioni in vigore dal ${h.date(b(h).dal)} il rendimento effettivo annuo lordo è del ${h.num(t[0][1], 2)}% per chi rimborsa nei primi quattro anni, poi sale ogni anno fino al ${h.num(t[t.length - 1][1], 2)}% al ventesimo. Il tasso di ogni riga vale per tutto il periodo: chi rimborsa dopo dieci anni ottiene il ${h.num(r10.tasso, 2)}% composto per dieci anni. Su ${h.eur(10000)} questo vuol dire ${h.eur(r10.netto)} netti dopo dieci anni e ${h.eur(r20.netto)} dopo venti, tolta la tassa del ${h.pct(h.P.fisco.titoli_stato, 1)} e, sopra ${h.eur(h.P.fisco.bollo_buoni_franchigia)} di Buoni, il bollo dello ${h.pct(h.P.fisco.bollo, 2)} annuo. Il tasso resta quello del giorno dell’acquisto per tutta la vita del Buono.`;
    },
    faqs: (h) => [
      { q: 'Il tasso del Buono Ordinario può cambiare dopo l’acquisto?', a: 'No. Il Buono conserva per vent’anni la tabella dei tassi in vigore il giorno in cui lo sottoscrivi. Se Poste e Cassa Depositi e Prestiti cambiano le condizioni, il cambio vale solo per i Buoni comprati dopo. Per questo è importante sapere quale serie si possiede.' },
      { q: 'Quanto vale un Buono Ordinario comprato anni fa?', a: 'Dipende dalla serie, cioè dalle condizioni in vigore quando è stato comprato: i Buoni di serie vecchie hanno tabelle diverse da quelle di oggi. Il calcolo qui usa le condizioni attuali; per un Buono già in tuo possesso serve la tabella della sua serie, che Poste pubblica nelle pagine storiche dei Buoni.' },
      { q: 'Si possono rimborsare solo alcuni euro del Buono Ordinario?', a: 'Sì per i Buoni dematerializzati: il rimborso parziale è ammesso per multipli di 50 euro, il resto continua a maturare. I Buoni cartacei invece si rimborsano per intero. Gli interessi della parte rimborsata seguono il tasso del periodo trascorso, come da tabella.' },
    ],
    body: (h) => `<h2>Il Buono Ordinario anno per anno</h2>
<p>La tabella riporta, per ${h.eur(1000)}, il valore a ogni anniversario con i tassi letti sulla ${h.src('posteOrdinario', 'pagina del Buono Ordinario')}. Sotto ${h.eur(h.P.fisco.bollo_buoni_franchigia)} di Buoni non si paga bollo, quindi il netto toglie solo la tassa del 12,5% sugli interessi prevista per i titoli pubblici e assimilati dal ${h.src('dlgs239', 'decreto legislativo n. 239 del 1996')}.</p>
${tab(h)}
<h2>Rimborsare presto o tenere vent’anni</h2>
<p>Nei primi quattro anni il tasso resta basso, poi cresce di circa un decimo di punto all’anno. Chi pensa di riavere i soldi entro pochi anni trova tassi più alti nei Buoni a scadenza fissa o nei titoli di Stato della stessa durata; il Buono Ordinario serve a chi vuole poter uscire in qualsiasi anno senza perdere gli interessi maturati. Il ${h.a('btp-o-buoni-postali', 'confronto con il BTP della stessa durata')} mette i due numeri fianco a fianco.</p>`,
  },
  en: {
    slug: 'buono-ordinario-20-year-bond',
    nav: 'Buono Ordinario',
    card: 'The Buono Ordinario’s value year by year over 20 years: gross rate, value and net for your amount.',
    title: 'Buono Ordinario: Italian postal bond value year by year',
    description: 'Buono Ordinario from Poste: the gross rate for each year held up to 20, gross and net value for your amount, with 12.5% tax and stamp duty above €5,000.',
    h1: 'Buono Ordinario: its value year by year',
    intro: 'The Buono Ordinario runs for twenty years and pays a rate that grows with the time you hold it: type the amount and the year you cash it in, and the calculation shows gross and net value for each year.',
    resume: (h) => {
      const t = b(h).tassi ?? [];
      const r10 = h.M.buono('ordinario', 10000, 10), r20 = h.M.buono('ordinario', 10000, 20);
      return `The Buono Ordinario is the oldest Italian postal savings bond, sold by Poste Italiane for a century, and the only one on sale that can be cashed in with interest in any year from the first. For bonds bought under the terms in force from ${h.date(b(h).dal)} the gross effective yearly yield is ${h.num(t[0][1], 2)}% for those cashing in during the first four years, then rises each year to ${h.num(t[t.length - 1][1], 2)}% in the twentieth. Each row’s rate applies to the whole period: cashing in after ten years earns ${h.num(r10.tasso, 2)}% compounded over ten years. On ${h.eur(10000)} that means ${h.eur(r10.netto)} net after ten years and ${h.eur(r20.netto)} after twenty, after the ${h.pct(h.P.fisco.titoli_stato, 1)} tax and, above ${h.eur(h.P.fisco.bollo_buoni_franchigia)} of bonds, the ${h.pct(h.P.fisco.bollo, 2)} yearly stamp duty. The rate table is the one in force on the day you buy, for the bond’s whole life.`;
    },
    faqs: (h) => [
      { q: 'Can the Buono Ordinario rate change after purchase?', a: 'No. The bond keeps for twenty years the rate table in force on the day you buy it. If Poste and Cassa Depositi e Prestiti change the terms, the change applies only to bonds bought later. That is why it matters to know which series you hold.' },
      { q: 'What is a Buono Ordinario bought years ago worth?', a: 'It depends on its series, the terms in force when it was bought: older series have different tables from today’s. The calculation here uses current terms; for a bond you already hold you need its series table, which Poste publishes in its historical bond pages.' },
      { q: 'Can I cash in only part of a Buono Ordinario?', a: 'Yes for paperless bonds: partial redemption is allowed in multiples of 50 euros, and the rest keeps growing. Paper bonds are cashed in whole. Interest on the part cashed in follows the rate for the time elapsed, as set in the table.' },
    ],
    body: (h) => `<h2>The Buono Ordinario year by year</h2>
<p>The table gives, for ${h.eur(1000)}, the value at each anniversary using the rates read on the ${h.src('posteOrdinario', 'Buono Ordinario page')}. Below ${h.eur(h.P.fisco.bollo_buoni_franchigia)} of bonds there is no stamp duty, so the net figure takes off only the 12.5% tax on interest set for public securities by ${h.src('dlgs239', 'Legislative Decree 239 of 1996')}.</p>
${tab(h)}
<h2>Cash in early or hold for twenty years</h2>
<p>In the first four years the rate stays low, then rises by about a tenth of a point a year. If you expect to need the money within a few years, fixed-term bonds or government bonds of the same length pay higher rates; the Buono Ordinario suits those who want to be able to leave in any year without losing accrued interest. The ${h.a('btp-o-buoni-postali', 'comparison with a BTP of the same term')} puts the two figures side by side.</p>`,
  },
});
