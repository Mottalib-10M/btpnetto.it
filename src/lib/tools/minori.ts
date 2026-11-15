/** Buono dedicato ai Minori : de l'âge de l'enfant à ses 18 ans. */
import { T, eur, eur2, pct, nettoAnno, type L } from '../minis/_kit';
import { buono, buonoById } from '../engine/index';
import type { ToolSpec } from '../tool-types';
import { P } from '../engine/params';
import { formatDecimal } from '../format';
export default (l: L): ToolSpec => ({
  exemple: T(l, 'Esempio: 1.000 € per un bambino di 3 anni', 'Example: €1,000 for a three-year-old'),
  inputs: [
    { id: 'eta', label: T(l, 'Età del bambino oggi', 'Child’s age today'), def: 3, options: Array.from({ length: 17 }, (_, i) => ({ value: String(i), label: T(l, i === 1 ? '1 anno' : `${i} anni`, i === 1 ? '1 year' : `${i} years`) })) },
    { id: 'importo', label: T(l, 'Importo del Buono', 'Bond amount'), def: 1000, unit: '€', max: 1000000 },
    { id: 'altri', label: T(l, 'Altri Buoni intestati al bambino (per il bollo)', 'Other postal bonds in the child’s name (for stamp duty)'), def: 0, unit: '€', max: 5000000, avance: true },
  ],
  run: (v) => {
    const b = buonoById('minori');
    const anni = Math.max(0, 18 - v.eta);
    const r = buono('minori', v.importo, anni, v.importo + v.altri);
    return {
      head: [T(l, 'Valore netto ai 18 anni (capitale più interessi)', 'Net value at age 18 (capital plus interest)'), eur(r.netto, l)],
      sub: T(l, `di cui ${eur(r.netto - v.importo, l)} di interessi netti in ${anni} anni · ${nettoAnno(r.rendNetto, l)} (${pct(r.rendLordo, l, 2)} prima delle tasse)`, `of which ${eur(r.netto - v.importo, l)} net interest over ${anni} years · ${nettoAnno(r.rendNetto, l)} (${pct(r.rendLordo, l, 2)} before tax)`),
      alert: r.tasso === 0 ? T(l, `Servono almeno ${b.min_periodo_mesi} mesi tra acquisto e 18 anni per avere interessi.`, `At least ${b.min_periodo_mesi} months are needed between purchase and age 18 to earn interest.`) : undefined,
      rows: [
        [T(l, 'Valore lordo ai 18 anni', 'Gross value at 18'), eur2(r.valoreLordo, l)],
        [T(l, 'Tassa 12,5%', '12.5% tax'), eur2(r.tassa, l)],
        [T(l, `Bollo (0,20% all’anno, solo se i Buoni del bambino superano ${eur(P.fisco.bollo_buoni_franchigia, l)})`, `Stamp duty (0.20% a year, only if the child’s bonds exceed ${eur(P.fisco.bollo_buoni_franchigia, l)})`), eur2(r.bollo, l)],
        [T(l, 'Interessi netti', 'Net interest'), eur2(r.netto - v.importo, l), true],
      ],
      note: T(l, `Tasso letto su Poste Italiane per i Buoni sottoscritti dal 22 settembre 2026: ${formatDecimal(r.tasso, 2, l)}% lordo all’anno, calcolato ogni anno anche sugli interessi già maturati, fino al compimento dei 18 anni del titolare. La media all’anno qui sopra divide il guadagno per gli anni.`, `Rate read on Poste Italiane for bonds bought from 22 September 2026: ${formatDecimal(r.tasso, 2, l)}% gross a year, worked out each year on interest already earned too, until the holder turns 18. The yearly average above divides the gain by the years.`),
    };
  },
});
