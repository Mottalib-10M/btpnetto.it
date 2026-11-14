import { defineGuide } from '../../lib/guide-types';
import type { Helpers } from '../../lib/guide-types';

const tab = (h: Helpers) => {
  const it = h.lang === 'it';
  return h.table(it ? ['Buono', 'Durata', 'Tasso lordo a scadenza', 'Netto su 10.000 € a scadenza', 'Condizioni dal'] : ['Bond', 'Term', 'Gross rate at maturity', 'Net on €10,000 at maturity', 'Terms from'],
    h.P.buoni.map((b) => { const anni = b.id === 'minori' ? 18 : b.anni; const r = h.M.buono(b.id, 10000, anni); return [b.nome, it ? `${b.anni} anni` : `${b.anni} years`, `${h.num(r.tasso, 2)}%`, h.eur(r.netto), h.date(b.dal)]; }),
    it ? 'Buoni letti sulle pagine di Poste Italiane; netto dopo il 12,5% e il bollo (10.000 € superano la soglia di esenzione); Buono Minori per un neonato' : 'Bonds read on Poste Italiane’s pages; net after 12.5% and stamp duty (€10,000 is above the exemption limit); Minori bond for a newborn',
    ['l', 'l', 'r', 'r', 'l']);
};

export default defineGuide({
  id: 'buoni-fruttiferi-postali',
  group: 'buoni',
  order: 1,
  tool: 'buono',
  related: ['buono-ordinario', 'buoni-minori', 'btp-o-buoni-postali', 'home'],
  sources: ['posteBuoni', 'poste4Plus', 'posteEredita', 'posteRisparmiosemplice', 'dpr642'],
  it: {
    slug: 'buoni-fruttiferi-postali',
    nav: 'Buoni fruttiferi postali',
    card: 'Quanto rende un Buono fruttifero postale in emissione: valore netto dopo il 12,5% e il bollo, anno per anno.',
    title: 'Buoni fruttiferi postali: rendimento netto, calcolo per anni',
    description: 'Buoni fruttiferi postali in emissione: tassi lordi di Poste, valore netto dopo il 12,5% e il bollo sopra 5.000 €, rimborso dopo gli anni che scegli tu.',
    h1: 'Buoni fruttiferi postali: quanto rendono netti',
    intro: 'I Buoni fruttiferi postali pagano un tasso fisso deciso al momento dell’acquisto: scegli il Buono e dopo quanti anni lo rimborsi, e il calcolo toglie la tassa del 12,5% e l’eventuale bollo.',
    resume: (h) => {
      const o = h.M.buono('ordinario', 10000, 20), p = h.M.buono('4plus', 10000, 4);
      return `I Buoni fruttiferi postali sono emessi da Cassa Depositi e Prestiti, garantiti dallo Stato e venduti da Poste Italiane senza costi di acquisto né di rimborso. Ogni Buono ha una tabella di tassi lordi decisa al momento della sottoscrizione: il tasso che conta è quello del periodo per cui lo tieni. Sugli interessi si paga il ${h.pct(h.P.fisco.titoli_stato, 1)}, come sui titoli di Stato; il bollo dello ${h.pct(h.P.fisco.bollo, 2)} si paga solo se i Buoni che hai superano ${h.eur(h.P.fisco.bollo_buoni_franchigia)} in tutto. Con le condizioni lette oggi, ${h.eur(10000)} nel Buono Ordinario diventano ${h.eur(o.netto)} netti dopo vent’anni (tasso del ${h.num(o.tasso, 2)}%), mentre nel Buono 4 anni Plus diventano ${h.eur(p.netto)} dopo quattro (tasso del ${h.num(p.tasso, 2)}%). I Buoni a quattro anni non pagano nulla se li rimborsi prima della scadenza; l’Ordinario paga gli interessi già dopo il primo anno, a tassi crescenti.`;
    },
    faqs: (h) => [
      { q: 'Quali Buoni fruttiferi postali si possono comprare oggi?', a: 'Quelli di cui abbiamo letto le condizioni sul sito di Poste Italiane sono elencati nella tabella, con la data di entrata in vigore dei tassi. Alcuni sono riservati: il Buono Soluzione Eredità solo a chi ha concluso una successione in Poste, il risparmiosemplice solo dentro il piano di versamenti periodici, il Buono Minori solo intestato a un minorenne.' },
      { q: 'Se rimborso un Buono prima della scadenza perdo il capitale?', a: 'No, il capitale è sempre restituito. Si perdono, in tutto o in parte, gli interessi: i Buoni a quattro anni restituiscono solo il capitale prima della scadenza, l’Ordinario riconosce gli interessi maturati a partire dal primo anno, al tasso previsto per quel periodo di possesso.' },
      { q: 'I Buoni postali entrano nell’ISEE?', a: `Fino a ${h.eur(h.P.fisco.isee_titoli_esclusi)} complessivi tra titoli di Stato, Buoni e libretti postali no: la legge n. 213 del 2023 li esclude dal patrimonio mobiliare dell’ISEE. Sopra quella soglia la parte eccedente si dichiara nella DSU come gli altri risparmi.` },
      { q: 'Sui Buoni si paga l’imposta di successione?', a: 'No: Poste Italiane indica che i Buoni fruttiferi postali sono esenti dall’imposta di successione, come i titoli di Stato. Gli eredi incassano il valore maturato al momento del rimborso, al netto della tassa del 12,5% sugli interessi, presentando a Poste i documenti della successione.' },
    ],
    body: (h) => `<h2>I Buoni fruttiferi postali in emissione</h2>
<p>Ogni riga riporta il tasso lordo a scadenza e il netto su ${h.eur(10000)} tenuti fino alla fine, letti sulle pagine di ${h.src('posteBuoni', 'Poste Italiane')}. Il netto toglie la tassa del 12,5% e il bollo previsto dalla ${h.src('dpr642', 'legge')}, che sui Buoni scatta sopra ${h.eur(h.P.fisco.bollo_buoni_franchigia)}.</p>
${tab(h)}
<h2>Come funziona il rendimento dei Buoni fruttiferi postali</h2>
<p>Il tasso indicato da Poste è «effettivo annuo lordo»: gli interessi si capitalizzano, cioè maturano anche sugli interessi già maturati, e vengono pagati tutti al rimborso. Per questo il valore cresce come importo × (1 + tasso)<sup>anni</sup>. La tassa si paga una volta sola, al rimborso, sugli interessi complessivi. Il ${h.src('poste4Plus', 'Buono 4 anni Plus')} e il ${h.src('posteEredita', 'Buono Soluzione Eredità')} hanno un solo tasso, valido se arrivi alla scadenza; il ${h.src('posteRisparmiosemplice', 'Buono 4 anni risparmiosemplice')} ha un tasso standard e uno premiale dopo 24 versamenti del piano. Il calcolo qui sopra mostra il netto per ogni durata, e per l’Ordinario la tabella anno per anno.</p>
<p>I Buoni non hanno un prezzo di mercato: non si vendono in Borsa, si rimborsano a Poste al valore maturato. È la differenza principale rispetto a un BTP, il cui valore cambia ogni giorno prima della scadenza.</p>`,
  },
  en: {
    slug: 'postal-savings-bonds',
    nav: 'Postal savings bonds',
    card: 'What an Italian postal savings bond on sale returns: net value after 12.5% and stamp duty, year by year.',
    title: 'Postal savings bonds Italy: net return of Buoni by year',
    description: 'Italian postal savings bonds on sale: Poste gross rates and net value after 12.5% tax and stamp duty above €5,000, cashed in after the years you choose.',
    h1: 'Postal savings bonds in Italy: what they return net',
    intro: 'Italian postal savings bonds (Buoni fruttiferi postali) pay a fixed rate set when you buy: choose the bond and when you cash it in, and the calculation takes off the 12.5% tax and any stamp duty.',
    resume: (h) => {
      const o = h.M.buono('ordinario', 10000, 20), p = h.M.buono('4plus', 10000, 4);
      return `Italian postal savings bonds are issued by Cassa Depositi e Prestiti, guaranteed by the State and sold by Poste Italiane with no purchase or redemption fees. Each bond has a table of gross rates fixed when you buy it: the rate that counts is the one for the period you hold it. Interest is taxed at ${h.pct(h.P.fisco.titoli_stato, 1)}, as with government bonds; the ${h.pct(h.P.fisco.bollo, 2)} stamp duty applies only if your bonds exceed ${h.eur(h.P.fisco.bollo_buoni_franchigia)} in total. With the terms read today, ${h.eur(10000)} in the Buono Ordinario becomes ${h.eur(o.netto)} net after twenty years (rate ${h.num(o.tasso, 2)}%), while in the Buono 4 anni Plus it becomes ${h.eur(p.netto)} after four (rate ${h.num(p.tasso, 2)}%). Four-year bonds pay nothing if cashed in before maturity; the Ordinario pays interest from the first year on, at rising rates.`;
    },
    faqs: (h) => [
      { q: 'Which Italian postal savings bonds are on sale today?', a: 'Those whose terms we read on Poste Italiane’s site are in the table, with the date their rates took effect. Some are restricted: the Soluzione Eredità bond only for people who settled an estate at Poste, risparmiosemplice only within the regular savings plan, the Minori bond only in a minor’s name.' },
      { q: 'Do I lose capital if I cash a postal bond in early?', a: 'No, the capital always comes back. What you lose, wholly or partly, is the interest: four-year bonds return only the capital before maturity, while the Ordinario pays interest from the first year, at the rate set for that holding period.' },
      { q: 'Do postal bonds count towards the Italian ISEE?', a: `Up to ${h.eur(h.P.fisco.isee_titoli_esclusi)} in total across government bonds, postal bonds and postal savings books, no: Law 213 of 2023 leaves them out of the ISEE means test. Above that limit the excess is declared like other savings, at its value on 31 December.` },
      { q: 'Is inheritance tax due on postal bonds?', a: 'No: Poste Italiane states that postal savings bonds are exempt from inheritance tax, like government bonds. Heirs collect the value accrued at redemption, less the 12.5% tax on interest. To cash it in they need the documents of the estate, which Poste lists on its site.' },
    ],
    body: (h) => `<h2>Italian postal savings bonds on sale</h2>
<p>Each row shows the gross rate at maturity and the net on ${h.eur(10000)} held to the end, read on ${h.src('posteBuoni', 'Poste Italiane’s')} pages. The net figure takes off the 12.5% tax and the stamp duty of Italian ${h.src('dpr642', 'law')}, which applies to postal bonds above ${h.eur(h.P.fisco.bollo_buoni_franchigia)}.</p>
${tab(h)}
<h2>How postal savings bond returns work</h2>
<p>The rate Poste shows is a gross effective yearly rate: interest compounds, earning interest on interest, and is all paid at redemption. So the value grows as amount × (1 + rate)<sup>years</sup>. Tax is paid once, at redemption, on the total interest. The ${h.src('poste4Plus', 'Buono 4 anni Plus')} and the ${h.src('posteEredita', 'Soluzione Eredità bond')} have a single rate, earned only at maturity; the ${h.src('posteRisparmiosemplice', 'risparmiosemplice bond')} has a standard rate and a higher one after 24 plan payments. The calculation above shows the net for each term, and for the Ordinario a year-by-year table.</p>
<p>Postal bonds have no market price: they are not traded, they are cashed in at Poste for their accrued value. That is the main difference from a BTP, whose value changes every day before maturity.</p>`,
  },
});
