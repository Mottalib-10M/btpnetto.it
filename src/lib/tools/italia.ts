/** BTP Italia 04/06/2032 : taux réel de 1,85 % + inflation italienne supposée par le lecteur. */
import { T, eur, eur2, pct, data, type L } from '../minis/_kit';
import { italia2032, anniTra } from '../engine/index';
import { P } from '../engine/params';
import { BUILD_TODAY } from '../today';
import type { ToolSpec } from '../tool-types';
import { importo } from './_opz';
const R = P.retail.italia_2032;
export default (l: L): ToolSpec => ({
  exemple: T(l, 'Esempio: 10.000 € con un’inflazione ipotizzata del 2% all’anno', 'Example: €10,000 assuming 2% inflation a year'),
  inputs: [
    importo(l),
    { id: 'infl', label: T(l, 'Inflazione italiana ipotizzata (% all’anno)', 'Assumed Italian inflation (% a year)'), def: 2, max: 15, decimals: 1, help: T(l, 'È una tua ipotesi: nessuno conosce l’inflazione futura', 'Your own assumption: nobody knows future inflation') },
  ],
  run: (v) => {
    const anni = Math.max(0, anniTra(BUILD_TODAY, R.scadenza));
    const r = italia2032(v.importo, v.infl, anni);
    return {
      head: [T(l, 'Interessi netti fino alla scadenza (ipotesi)', 'Net interest to maturity (assumption)'), eur(r.netti, l)],
      sub: T(l, `${pct(r.rendNetto, l, 2)} netto all’anno · tasso reale ${R.tasso_reale.toString().replace('.', ',')}% + inflazione · scadenza ${data(R.scadenza, l)}`, `${pct(r.rendNetto, l, 2)} net a year · ${R.tasso_reale}% real rate + inflation · matures ${data(R.scadenza, l)}`),
      rows: [
        [T(l, 'Lordo all’anno (stima)', 'Gross per year (estimate)'), eur2(r.lordoAnno, l)],
        [T(l, 'Tassa 12,5%', '12.5% tax'), eur2(r.tassa, l)],
        [T(l, 'Bollo 0,20%', '0.20% stamp duty'), eur2(r.bollo, l)],
      ],
      note: T(l, 'Approssimazione annuale, prezzo 100: il titolo paga cedole semestrali sul capitale rivalutato con l’indice FOI senza tabacchi, e la rivalutazione ogni sei mesi. Se lo compri oggi in Borsa il prezzo non è 100.', 'Yearly approximation at a price of 100: the bond pays half-yearly coupons on capital revalued with the FOI index excluding tobacco, plus the revaluation every six months. Bought on the market today, the price is not 100.'),
    };
  },
});
