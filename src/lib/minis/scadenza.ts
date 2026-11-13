/** Mini : années restantes d'un BTP des dernières adjudications et son coupon net semestriel. */
import { T, eur2, data, type L } from './_kit';
import { BTPS, btp } from '../engine/index';
import type { MiniSpec } from '../mini-types';
import { formatDecimal } from '../format';
export default (l: L): MiniSpec => ({
  title: T(l, 'La cedola netta di un BTP, ogni sei mesi', 'A BTP’s net coupon, every six months'),
  cta: T(l, 'Il calcolo completo del BTP', 'The full BTP calculation'),
  exemple: T(l, 'Esempio: 10.000 € nominali sul BTP più lungo dell’elenco', 'Example: €10,000 face value in the longest bond on the list'),
  inputs: [
    { id: 'titolo', label: T(l, 'BTP', 'BTP'), def: BTPS.length - 1, options: BTPS.map((a, i) => ({ value: String(i), label: `${formatDecimal(a.cedola as number, 2, l)}% · ${data(a.scadenza, l)}` })) },
    { id: 'importo', label: T(l, 'Valore nominale', 'Face value'), def: 10000, unit: '€', max: 5000000 },
  ],
  run: (v) => {
    const a = BTPS[Math.min(BTPS.length - 1, Math.max(0, v.titolo))];
    const r = btp(a, v.importo);
    return {
      head: [T(l, 'Cedola netta semestrale', 'Net half-yearly coupon'), eur2(r.cedoleNette / Math.max(1, r.nCedole), l)],
      rows: [[T(l, 'Cedole ancora da incassare', 'Coupons still to come'), String(r.nCedole)], [T(l, 'Prossima cedola', 'Next coupon'), data(r.prossimaCedola, l)]],
    };
  },
});
