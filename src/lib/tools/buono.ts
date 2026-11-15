/** Buoni fruttiferi postali en émission : valeur à la date choisie, impôt de 12,5 %, timbre au-delà de 5 000 €. */
import { T, eur, eur2, pct, data, nettoAnno, type L } from '../minis/_kit';
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
    { id: 'anni', label: T(l, 'Dopo quanti anni lo rimborsi', 'Cashed in after'), def: o.fisso === 'ordinario' ? 10 : 5, options: ANNI(l, 20) },
    { id: 'altri', label: T(l, 'Altri Buoni che possiedi già (per il bollo)', 'Other postal bonds you already hold (for stamp duty)'), def: 0, unit: '€', max: 5000000, avance: true },
  ],
  run: (v) => {
    const id = o.fisso ?? TIPI[Math.min(TIPI.length - 1, Math.max(0, v.tipo ?? 0))];
    const b = buonoById(id);
    const r = buono(id, v.importo, v.anni, v.importo + v.altri);
    const oltre = v.anni > b.anni;
    return {
      // Le gros chiffre est le gain, comme à l'accueil ; le total remboursé vient dessous (testeurs naïfs du 2026-11-14, 2e tour :
      // « 10.184 € » lu comme un gain).
      head: [T(l, `${b.nome}: guadagno netto dopo ${r.anni} ${r.anni === 1 ? 'anno' : 'anni'}`, `${b.nome}: net gain after ${r.anni} year${r.anni === 1 ? '' : 's'}`), eur(r.netto - v.importo, l)],
      sub: T(l, `ti restituiscono in tutto ${eur(r.netto, l)} · ${nettoAnno(r.rendNetto, l)} (${pct(r.rendLordo, l, 2)} prima delle tasse)`, `you get back ${eur(r.netto, l)} in all · ${nettoAnno(r.rendNetto, l)} (${pct(r.rendLordo, l, 2)} before tax)`),
      alert: r.tasso === 0 ? T(l, `Rimborsato così presto, questo Buono restituisce solo il capitale: gli interessi maturano ${b.interessi_prima}.`, `Cashed in this early, the bond only returns your capital.`) : oltre ? T(l, `Il Buono scade dopo ${b.anni} anni e poi non frutta più: il calcolo si ferma alla scadenza.`, `The bond matures after ${b.anni} years and earns nothing afterwards: the calculation stops at maturity.`) : undefined,
      rows: [
        [T(l, 'Valore lordo', 'Gross value'), eur2(r.valoreLordo, l)],
        [T(l, 'Interessi lordi', 'Gross interest'), eur2(r.interessi, l)],
        [T(l, 'Tassa 12,5%', '12.5% tax'), eur2(r.tassa, l)],
        [T(l, r.esenteBollo ? `Bollo: esente fino a ${eur(P.fisco.bollo_buoni_franchigia, l)} di Buoni` : `Bollo stimato (0,20% all’anno: si paga perché i tuoi Buoni superano ${eur(P.fisco.bollo_buoni_franchigia, l)})`, r.esenteBollo ? `Stamp duty: none up to ${eur(P.fisco.bollo_buoni_franchigia, l)} of bonds` : `Estimated stamp duty (0.20% a year: due because your bonds exceed ${eur(P.fisco.bollo_buoni_franchigia, l)})`), eur2(r.bollo, l)],
        [T(l, 'Interessi netti', 'Net interest'), eur2(r.netto - v.importo, l), true],
        [T(l, 'Rimborso totale netto (capitale più interessi)', 'Total net cash-in (capital plus interest)'), eur2(r.netto, l)],
      ],
      note: T(l, `Tasso di Poste Italiane per questa durata: ${formatDecimal(r.tasso, 2, l)}% lordo all’anno, calcolato ogni anno anche sugli interessi già maturati (condizioni dal ${data(b.dal, l)}); a ${b.anni} anni: ${formatDecimal(tassoBuono(id, b.anni), 2, l)}%. La media all’anno qui sopra divide il guadagno per gli anni.`, `Poste Italiane rate for this term: ${formatDecimal(r.tasso, 2, l)}% gross a year, worked out each year on interest already earned too (terms from ${data(b.dal, l)}); at ${b.anni} years: ${formatDecimal(tassoBuono(id, b.anni), 2, l)}%. The yearly average above divides the gain by the years.`),
      table: id === 'ordinario' ? {
        caption: T(l, 'Buono Ordinario anno per anno, per l’importo scritto sopra', 'Buono Ordinario year by year, for the amount above'),
        headers: T(l, ['Rimborso dopo', 'Tasso lordo', 'Valore lordo', 'Netto'], ['Cashed in after', 'Gross rate', 'Gross value', 'Net']), align: ['l', 'r', 'r', 'r'],
        rows: Array.from({ length: 20 }, (_, i) => { const x = buono(id, v.importo, i + 1, v.importo + v.altri); return [T(l, i ? `${i + 1} anni` : '1 anno', i ? `${i + 1} years` : '1 year'), pct(x.tasso / 100, l, 2), eur(x.valoreLordo, l), eur(x.netto, l)]; }),
      } : undefined,
    };
  },
});
