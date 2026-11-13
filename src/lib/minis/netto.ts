/** Mini : intérêt brut → net à 12,5 % et à 26 %. */
import { T, eur2, type L } from './_kit';
import { netto } from '../engine/index';
import type { MiniSpec } from '../mini-types';
export default (l: L): MiniSpec => ({
  title: T(l, 'Quanto ti resta di 100 € di interessi', 'What is left of €100 of interest'),
  cta: T(l, 'Confronta BTP, BOT, Buoni e deposito', 'Compare BTP, BOT, postal bonds and deposits'),
  exemple: T(l, 'Esempio: 100 € di interessi lordi', 'Example: €100 of gross interest'),
  inputs: [{ id: 'lordo', label: T(l, 'Interessi lordi', 'Gross interest'), def: 100, unit: '€', max: 1000000 }],
  run: (v) => {
    const n = netto(v.lordo);
    return {
      head: [T(l, 'Netto su titoli di Stato e Buoni (12,5%)', 'Net on government bonds and postal bonds (12.5%)'), eur2(n.titoli, l)],
      rows: [[T(l, 'Netto su conto deposito (26%)', 'Net on a deposit account (26%)'), eur2(n.altri, l)], [T(l, 'Differenza', 'Difference'), eur2(n.differenza, l)]],
    };
  },
});
