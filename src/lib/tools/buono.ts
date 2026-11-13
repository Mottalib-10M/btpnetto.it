/** Buoni fruttiferi postali en émission : valeur à la date choisie, impôt de 12,5 %, timbre au-delà de 5 000 €. */
import { T, eur, eur2, pct, data, type L } from '../minis/_kit';
import { buono, buonoById, tassoBuono } from '../engine/index';
import { P } from '../engine/params';
import type { ToolSpec } from '../tool-types';
import { ANNI, importo } from './_opz';
import { formatDecimal } from '../format';
const TIPI = ['ordinario', '4plus', 'eredita', 'risparmiosemplice'];
export default (l: L, o: { fisso?: string } = {}): ToolSpec => ({
  exemple: T(l, `Esempio: 10.000 € in ${buonoById(o.fisso ?? 'ordinario').nome}`, `Example: €10,000 in a ${buonoById(o.fisso ?? 'ordinario').nome}`),
  inputs: [
    ...(o.fisso ? [] : [{ id: 'tipo', label: T(l, 'Quale Buono', 'Which bond'), def: 0, options: TIPI.map((id, i) => ({ value: String(i), label: `${buonoById(id).nome} (${buonoById(id).anni} ${T(l, 'anni', 'years')})` })) }]),
    importo(l),
    { id: 'anni', label: T(l, 'Dopo quanti anni lo rimborsi', 'Cashed in after'), def: o.fisso === 'ordinario' ? 10 : 4, options: ANNI(l, 20) },
    { id: 'altri', label: T(l, 'Altri Buoni che possiedi già (per il bollo)', 'Other postal bonds you already hold (for stamp duty)'), def: 0, unit: '€', max: 5000000, avance: true },
  ],
  run: (v) => {
    const id = o.fisso ?? TIPI[Math.min(TIPI.length - 1, Math.max(0, v.tipo ?? 0))];
    const b = buonoById(id);
    const r = buono(id, v.importo, v.anni, v.importo + v.altri);
    const oltre = v.anni > b.anni;
    return {
      head: [T(l, `${b.nome}: rimborso netto dopo ${r.anni} ${r.anni === 1 ? 'anno' : 'anni'}`, `${b.nome}: net cash-in after ${r.anni} year${r.anni === 1 ? '' : 's'}`), eur(r.netto, l)],
      sub: T(l, `${pct(r.rendNetto, l, 2)} netto all’anno · tasso lordo ${formatDecimal(r.tasso, 2, l)}% (condizioni dal ${data(b.dal, l)})`, `${pct(r.rendNetto, l, 2)} net a year · gross rate ${formatDecimal(r.tasso, 2, l)}% (terms from ${data(b.dal, l)})`),
      alert: r.tasso === 0 ? T(l, `Rimborsato così presto, questo Buono restituisce solo il capitale: gli interessi maturano ${b.interessi_prima}.`, `Cashed in this early, the bond only returns your capital.`) : oltre ? T(l, `Il Buono scade dopo ${b.anni} anni e poi non frutta più: il calcolo si ferma alla scadenza.`, `The bond matures after ${b.anni} years and earns nothing afterwards: the calculation stops at maturity.`) : undefined,
      rows: [
        [T(l, 'Valore lordo', 'Gross value'), eur2(r.valoreLordo, l)],
        [T(l, 'Interessi lordi', 'Gross interest'), eur2(r.interessi, l)],
        [T(l, 'Tassa 12,5%', '12.5% tax'), eur2(r.tassa, l)],
        [T(l, r.esenteBollo ? `Bollo: esente fino a ${eur(P.fisco.bollo_buoni_franchigia, l)} di Buoni` : 'Bollo 0,20% stimato', r.esenteBollo ? `Stamp duty: none up to ${eur(P.fisco.bollo_buoni_franchigia, l)} of bonds` : 'Estimated 0.20% stamp duty'), eur2(r.bollo, l)],
        [T(l, 'Interessi netti', 'Net interest'), eur2(r.netto - v.importo, l), true],
      ],
      note: T(l, `Tassi di Poste Italiane per i Buoni sottoscritti oggi. Tasso a ${b.anni} anni: ${formatDecimal(tassoBuono(id, b.anni), 2, l)}% lordo.`, `Poste Italiane rates for bonds bought today. Rate at ${b.anni} years: ${formatDecimal(tassoBuono(id, b.anni), 2, l)}% gross.`),
      table: id === 'ordinario' ? {
        caption: T(l, 'Buono Ordinario anno per anno, per l’importo scritto sopra', 'Buono Ordinario year by year, for the amount above'),
        headers: T(l, ['Anni', 'Tasso lordo', 'Valore lordo', 'Netto'], ['Years', 'Gross rate', 'Gross value', 'Net']), align: ['l', 'r', 'r', 'r'],
        rows: Array.from({ length: 20 }, (_, i) => { const x = buono(id, v.importo, i + 1, v.importo + v.altri); return [String(i + 1), `${formatDecimal(x.tasso, 2, l)}%`, eur(x.valoreLordo, l), eur(x.netto, l)]; }),
      } : undefined,
    };
  },
});
