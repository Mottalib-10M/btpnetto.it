/** Un montant, une durée : BTP de l'adjudication la plus proche, BOT à 12 mois, Buono, dépôt — nets d'impôt et de timbre. */
import { T, eur, pct, data, type L } from '../minis/_kit';
import { confronto, tassoDeposito } from '../engine/index';
import { P } from '../engine/params';
import type { ToolSpec } from '../tool-types';
import { ANNI, importo } from './_opz';
type Opts = { importo?: number; anni?: number; solo?: string[]; tassoVisibile?: boolean };
export default (l: L, o: Opts = {}): ToolSpec => ({
  exemple: T(l, `Esempio: ${eur(o.importo ?? 10000, l)} per ${o.anni ?? 5} anni`, `Example: ${eur(o.importo ?? 10000, l)} for ${o.anni ?? 5} years`),
  inputs: [
    importo(l, o.importo ?? 10000),
    { id: 'anni', label: T(l, 'Per quanto tempo', 'For how long'), def: o.anni ?? 5, options: ANNI(l) },
    { id: 'tasso', label: T(l, 'Tasso lordo del conto deposito (%)', 'Deposit account gross rate (%)'), def: P.deposito.oltre_2_anni, max: 10, decimals: 2,
      help: T(l, `Media BCE dei depositi vincolati in Italia, ${P.deposito.mese}: ${P.deposito.entro_1_anno}% fino a 1 anno, ${P.deposito.oltre_2_anni}% oltre 2 anni`, `ECB average for Italian fixed-term deposits, ${P.deposito.mese}: ${P.deposito.entro_1_anno}% up to 1 year, ${P.deposito.oltre_2_anni}% over 2 years`),
      avance: !o.tassoVisibile },
  ],
  run: (v) => {
    const anni = Math.max(1, Math.round(v.anni));
    const righe = confronto(v.importo, anni, v.tasso || tassoDeposito(anni)).filter((r) => !o.solo || o.solo.includes(r.id));
    const nome = (r: (typeof righe)[number]) => (r.id === 'deposito' ? T(l, `Conto deposito al ${String(v.tasso).replace('.', l === 'en' ? '.' : ',')}%`, `Deposit account at ${v.tasso}%`) : r.nome);
    const best = [...righe].sort((a, b) => b.netti - a.netti)[0];
    return {
      head: [T(l, `Interessi netti più alti nel calcolo: ${nome(best)}`, `Highest net interest in this calculation: ${nome(best)}`), eur(best.netti, l)],
      sub: T(l, `${pct(best.rendNetto, l, 2)} netto all’anno su ${eur(v.importo, l)} per ${anni} ${anni > 1 ? 'anni' : 'anno'}`, `${pct(best.rendNetto, l, 2)} net a year on ${eur(v.importo, l)} for ${anni} year${anni > 1 ? 's' : ''}`),
      rows: righe.map((r) => [nome(r), `${eur(r.netti, l)} · ${pct(r.rendNetto, l, 2)}`] as [string, string]),
      note: T(l, 'Calcolo, non consiglio: rischio, possibilità di vendere prima e situazione fiscale personale cambiano la scelta. BTP al prezzo dell’asta, comprato oggi e tenuto fino alla scadenza.', 'A calculation, not advice: risk, the option to sell early and your own tax position change the choice. BTP at the auction price, bought today and held to maturity.'),
      table: {
        caption: T(l, 'Dettaglio: tasse e bollo già tolti', 'Detail: tax and stamp duty already taken off'),
        headers: T(l, ['Strumento', 'Dato del', 'Tasse', 'Bollo', 'Interessi netti'], ['Product', 'Data from', 'Tax', 'Stamp duty', 'Net interest']),
        align: ['l', 'l', 'r', 'r', 'r'],
        rows: righe.map((r) => [nome(r), r.fonte.length === 7 ? r.fonte : data(r.fonte, l), eur(r.tassa, l), eur(r.bollo, l), eur(r.netti, l)]),
      },
    };
  },
});
