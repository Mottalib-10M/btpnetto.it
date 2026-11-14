/** BTP Italia 04/06/2032 : taux réel de 1,85 % + inflation italienne supposée par le lecteur. */
import { T, eur, eur2, pct, data, type L } from '../minis/_kit';
import { italia2032, anniTra } from '../engine/index';
import { P } from '../engine/params';
import { BUILD_TODAY } from '../today';
import type { ToolSpec } from '../tool-types';
import { importo } from './_opz';
import { formatDecimal } from '../format';
const R = P.retail.italia_2032;
const durata = (a: number, l: L) => T(l, `in ${formatDecimal(a, 1, l)} anni`, `over ${formatDecimal(a, 1, l)} years`);
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
      sub: T(l, `${pct(r.rendNetto, l, 2)} netto all’anno · ${formatDecimal(R.tasso_reale, 2, l)}% oltre l’inflazione · scade il ${data(R.scadenza, l)}`, `${pct(r.rendNetto, l, 2)} net a year · ${formatDecimal(R.tasso_reale, 2, l)}% above inflation · matures ${data(R.scadenza, l)}`),
      rows: [
        // Tout sur la durée entière : un brut annuel à côté d'une taxe totale faisait croire à 70 % d'impôt (testeurs naïfs du 2026-11-14).
        [T(l, `Interessi prima delle tasse, ${durata(anni, l)} (stima)`, `Interest before tax, ${durata(anni, l)} (estimate)`), eur2(r.lordi, l)],
        [T(l, 'Tassa 12,5%, su tutta la durata', '12.5% tax, over the whole term'), eur2(r.tassa, l)],
        [T(l, 'Bollo 0,20% all’anno, su tutta la durata', '0.20% yearly stamp duty, over the whole term'), eur2(r.bollo, l)],
        [T(l, 'Interessi netti', 'Net interest'), eur2(r.netti, l), true],
      ],
      note: T(l, 'Approssimazione annuale, prezzo 100: il titolo paga cedole semestrali sul capitale aumentato ogni sei mesi secondo l’inflazione italiana misurata dall’Istat, e paga anche questo aumento. Se lo compri oggi in Borsa il prezzo non è 100.', 'Yearly approximation at a price of 100: the bond pays half-yearly coupons on capital raised every six months in line with Italian inflation as measured by Istat, and pays out that rise too. Bought on the market today, the price is not 100.'),
    };
  },
});
