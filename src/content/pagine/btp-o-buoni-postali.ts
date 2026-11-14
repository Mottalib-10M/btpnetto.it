import { defineGuide } from '../../lib/guide-types';
import type { Helpers } from '../../lib/guide-types';

const tab = (h: Helpers) => {
  const it = h.lang === 'it';
  const rows = [2, 4, 5, 7, 10].map((n) => { const c = h.M.confronto(10000, n); const b = c.find((r) => r.id === 'btp')!, p = c.find((r) => r.id === 'buono')!; return [String(n), b.nome.split(' · ')[0], h.eur(b.netti), h.pct(b.rendNetto, 2), p.nome, h.eur(p.netti), h.pct(p.rendNetto, 2)]; });
  return h.table(it ? ['Anni', 'BTP', 'Netto BTP', 'Annuo', 'Buono', 'Netto Buono', 'Annuo'] : ['Years', 'BTP', 'BTP net', 'Yearly', 'Postal bond', 'Bond net', 'Yearly'], rows,
    it ? 'Interessi netti su 10.000 €: BTP con la scadenza più vicina agli anni indicati, al prezzo dell’ultima asta; Buono Ordinario, o 4 anni Plus a quattro anni; tassa del 12,5% e bollo per entrambi' : 'Net interest on €10,000: the BTP maturing closest to the years shown, at its latest auction price; Buono Ordinario, or 4 anni Plus at four years; 12.5% tax and stamp duty on both',
    ['r', 'l', 'r', 'r', 'l', 'r', 'r']);
};

export default defineGuide({
  id: 'btp-o-buoni-postali',
  group: 'confronti',
  order: 1,
  tool: 'confronto',
  outil: { solo: ['btp', 'buono'] },
  related: ['buoni-fruttiferi-postali', 'rendimento-btp', 'conto-deposito-o-btp', 'home'],
  sources: ['mefAste', 'posteOrdinario', 'poste4Plus', 'dpr642'],
  it: {
    slug: 'btp-o-buoni-postali',
    nav: 'BTP o Buoni postali',
    card: 'Stesso importo, stessa durata: quanto resta netto con un BTP e con un Buono fruttifero postale.',
    title: 'BTP o Buoni postali: confronto netto per importo e durata',
    description: 'BTP o Buoni postali: per il tuo importo e la tua durata, interessi netti di un BTP al prezzo d’asta e di un Buono di Poste, dopo tassa del 12,5% e bollo.',
    h1: 'BTP o Buoni postali: il confronto netto',
    intro: 'Tra BTP o Buoni postali la tassa è la stessa, il 12,5%: cambiano il tasso, il bollo e la possibilità di uscire prima. Scrivi importo e durata e il calcolo mette i due netti fianco a fianco.',
    resume: (h) => {
      const c = h.M.confronto(10000, 5); const b = c.find((r) => r.id === 'btp')!, p = c.find((r) => r.id === 'buono')!;
      return `BTP e Buoni fruttiferi postali sono entrambi debito pubblico: i BTP li emette il Tesoro, i Buoni Cassa Depositi e Prestiti con la garanzia dello Stato. Gli interessi pagano la stessa tassa del ${h.pct(h.P.fisco.titoli_stato, 1)}. Le differenze sono altrove. Il BTP paga una cedola ogni sei mesi e ha un prezzo che cambia ogni giorno: tenuto fino alla scadenza rende quanto previsto, venduto prima può guadagnare o perdere. Il Buono non ha prezzo di mercato: si rimborsa sempre almeno al capitale, con gli interessi maturati secondo la sua tabella. Sul bollo il Buono è esente fino a ${h.eur(h.P.fisco.bollo_buoni_franchigia)}. Con i dati letti oggi, su ${h.eur(10000)} per cinque anni il ${b.nome.split(' · ')[0]} lascia ${h.eur(b.netti)} netti e il ${p.nome} ${h.eur(p.netti)}. Il risultato cambia con la durata e con il prezzo del BTP, per questo il calcolo li ricalcola sui tuoi numeri.`;
    },
    faqs: (h) => [
      { q: 'BTP o Buoni postali: quale è più sicuro?', a: 'Entrambi dipendono dallo Stato italiano: i BTP sono suoi titoli diretti, i Buoni sono garantiti dallo Stato. La differenza pratica è il prezzo: un BTP venduto prima della scadenza può valere meno di quanto pagato, un Buono si rimborsa sempre almeno al capitale versato.' },
      { q: 'Perché il confronto usa il Buono Ordinario e non altri Buoni?', a: 'Perché l’Ordinario è l’unico Buono in emissione aperto a tutti con un tasso per ogni durata da uno a vent’anni. Per quattro anni il calcolo usa il Buono 4 anni Plus, che a quella durata paga di più. Gli altri Buoni sono nella pagina sui Buoni fruttiferi postali.' },
      { q: 'Il bollo cambia il confronto?', a: `Su importi piccoli sì: il Buono non paga il bollo finché i Buoni posseduti non superano ${h.eur(h.P.fisco.bollo_buoni_franchigia)}, il BTP lo paga sempre, lo ${h.pct(h.P.fisco.bollo, 2)} all’anno. Su ${h.eur(10000)} il Buono paga il bollo come il BTP, e il calcolo ne tiene conto.` },
    ],
    body: (h) => `<h2>BTP o Buoni postali per cinque durate</h2>
<p>La tabella confronta ${h.eur(10000)} su un BTP dell’${h.src('mefAste', 'ultima asta del Tesoro')} con la scadenza più vicina e sul ${h.src('posteOrdinario', 'Buono Ordinario')}, o sul ${h.src('poste4Plus', 'Buono 4 anni Plus')} per quattro anni. Per entrambi il netto toglie il 12,5% e il bollo previsto dalla ${h.src('dpr642', 'legge')}.</p>
${tab(h)}
<h2>Cosa il confronto non dice</h2>
<p>Il BTP del confronto è comprato al prezzo d’asta: in banca il prezzo di oggi può essere diverso e c’è la commissione. I Buoni non hanno commissioni. Il confronto vale poi per chi tiene fino alla fine: chi potrebbe aver bisogno dei soldi prima dovrebbe guardare quanto rende il Buono in quell’anno, nella ${h.a('buono-ordinario', 'tabella del Buono Ordinario')}, e ricordare che il BTP si vende al prezzo del giorno.</p>`,
  },
  en: {
    slug: 'btp-or-postal-bonds',
    nav: 'BTP or postal bonds',
    card: 'Same amount, same term: what is left net with a BTP and with an Italian postal savings bond.',
    title: 'BTP or postal bonds: net comparison by amount and term',
    description: 'BTP or postal bonds in Italy: for your amount and term, net interest on a BTP at its auction price and on a Poste savings bond, after 12.5% tax and stamp duty.',
    h1: 'BTP or postal bonds: the net comparison',
    intro: 'Between a BTP or postal bonds the tax is the same, 12.5%: what changes is the rate, stamp duty and the option to leave early. Type the amount and term and the calculation sets both net figures side by side.',
    resume: (h) => {
      const c = h.M.confronto(10000, 5); const b = c.find((r) => r.id === 'btp')!, p = c.find((r) => r.id === 'buono')!;
      return `BTP and Italian postal savings bonds are both public debt: BTP are issued by the Treasury, postal bonds by Cassa Depositi e Prestiti with a State guarantee. Interest on both is taxed at ${h.pct(h.P.fisco.titoli_stato, 1)}. The differences lie elsewhere. A BTP pays a coupon every six months and has a price that changes every day: held to maturity it returns what was expected, sold early it can gain or lose. A postal bond has no market price: it is always repaid at least at its capital, with interest accrued according to its table. Postal bonds are free of stamp duty up to ${h.eur(h.P.fisco.bollo_buoni_franchigia)}. With today’s data, on ${h.eur(10000)} for five years the ${b.nome.split(' · ')[0].replace('anni', 'year')} leaves ${h.eur(b.netti)} net and the ${p.nome} ${h.eur(p.netti)}. The result shifts with the term and the BTP price, which is why the calculation reruns on your figures.`;
    },
    faqs: (h) => [
      { q: 'BTP or postal bonds: which is safer?', a: 'Both depend on the Italian State: BTP are its direct bonds, postal bonds are State-guaranteed. The practical difference is price: a BTP sold before maturity may be worth less than you paid, while a postal bond is always repaid at least at the capital paid in.' },
      { q: 'Why does the comparison use the Buono Ordinario?', a: 'Because the Ordinario is the only bond on sale open to everyone with a rate for each term from one to twenty years. For four years the calculation uses the Buono 4 anni Plus, which pays more at that term. Other postal bonds are on the postal savings bonds page.' },
      { q: 'Does stamp duty change the comparison?', a: `On small amounts yes: postal bonds pay no stamp duty while your holdings stay at ${h.eur(h.P.fisco.bollo_buoni_franchigia)} or less, while a BTP always pays ${h.pct(h.P.fisco.bollo, 2)} a year. On ${h.eur(10000)} the postal bond pays it like the BTP, and the calculation accounts for it.` },
    ],
    body: (h) => `<h2>BTP or postal bonds over five terms</h2>
<p>The table compares ${h.eur(10000)} in a BTP from the ${h.src('mefAste', 'latest Treasury auction')} with the closest maturity and in the ${h.src('posteOrdinario', 'Buono Ordinario')}, or the ${h.src('poste4Plus', 'Buono 4 anni Plus')} for four years. For both, the net takes off 12.5% and the stamp duty of Italian ${h.src('dpr642', 'law')}.</p>
${tab(h)}
<h2>What the comparison does not tell you</h2>
<p>The BTP here is bought at its auction price: at your bank today’s price may differ and there is a fee. Postal bonds have no fees. The comparison also assumes you hold to the end: if you might need the money earlier, check what the bond pays in that year in the ${h.a('buono-ordinario', 'Buono Ordinario table')}, and remember a BTP sells at the day’s price.</p>`,
  },
});
