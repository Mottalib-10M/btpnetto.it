/** BTP Valore (step-up), BTP Valore Insieme, BTP Valore 2032 avec prime finale. */
import { T, eur, eur2, pct, data, type L } from '../minis/_kit';
import { valore2031, valore2032, insieme2031 } from '../engine/index';
import { P } from '../engine/params';
import type { ToolSpec } from '../tool-types';
import { importo } from './_opz';
import { formatDecimal } from '../format';
import { BUILD_TODAY } from '../today';
const R = P.retail;
/** Collocamento chiuso : chi compra oggi lo fa in Borsa (testeurs naïfs du 2026-11-14 : « posso ancora comprarlo ? »). */
const chiuso = (godimento: string, l: L) => (godimento <= BUILD_TODAY ? T(l, 'Il collocamento a 100 è chiuso: oggi si compra solo in Borsa, al prezzo del giorno, e il calcolo vale per chi ha comprato a 100.', 'The placement at 100 has closed: today it can only be bought on the stock exchange at the going price, and the calculation is for buyers at 100.') : '');
export default (l: L): ToolSpec => ({
  exemple: T(l, 'Esempio: 10.000 € tenuti fino alla scadenza', 'Example: €10,000 held to maturity'),
  inputs: [
    { id: 'titolo', label: T(l, 'Quale emissione', 'Which issue'), def: 0, options: [
      { value: '0', label: `${R.valore_2031.nome} (${T(l, 'cedole ogni tre mesi', 'quarterly coupons')})` },
      { value: '1', label: `${R.insieme_2031.nome} (${T(l, 'interessi tutti alla scadenza', 'all interest at maturity')})` },
      { value: '2', label: `${R.valore_2032.nome} (${T(l, `premio finale dello ${formatDecimal(R.valore_2032.premio_finale, 1, l)}% a chi tiene fino alla scadenza`, `${formatDecimal(R.valore_2032.premio_finale, 1, l)}% final bonus if held to maturity`)})` }] },
    importo(l),
    { id: 'anni', label: T(l, 'Anni tenuti (senza vendere)', 'Years held (without selling)'), def: 5, max: 6, help: T(l, 'Il calcolo conta le cedole degli anni pieni; vendere prima si fa al prezzo di mercato, che qui non è noto', 'The calculation counts coupons for full years; selling early happens at the market price, unknown here'), showIf: (v) => v.titolo !== 1 },
  ],
  run: (v) => {
    if (v.titolo === 1) {
      const r = insieme2031(v.importo);
      return {
        head: [T(l, 'Cedola netta alla scadenza', 'Net coupon at maturity'), eur(r.netti, l)],
        sub: T(l, `una sola cedola pari al ${formatDecimal(R.insieme_2031.cedola_unica, 2, l)}% del capitale, prima delle tasse, pagata il ${data(R.insieme_2031.scadenza, l)} · ${pct(r.rendNetto, l, 2)} netto all’anno`, `a single coupon of ${formatDecimal(R.insieme_2031.cedola_unica, 2, l)}% of the capital, before tax, paid on ${data(R.insieme_2031.scadenza, l)} · ${pct(r.rendNetto, l, 2)} net a year`),
        alert: chiuso(R.insieme_2031.godimento, l) || undefined,
        rows: [[T(l, 'Cedola lorda', 'Gross coupon'), eur2(r.lordo, l)], [T(l, 'Tassa 12,5%', '12.5% tax'), eur2(r.tassa, l)], [T(l, 'Bollo 0,20% per 5 anni', '0.20% stamp duty for 5 years'), eur2(r.bollo, l)]],
        note: T(l, `Tasso definitivo del comunicato del Ministero dell’economia del ${data(R.insieme_2031.comunicato, l)} (minimo annunciato: ${formatDecimal(R.insieme_2031.cedola_minima, 2, l)}%).`, `Final rate from the Ministry of Economy release of ${data(R.insieme_2031.comunicato, l)} (announced minimum: ${formatDecimal(R.insieme_2031.cedola_minima, 2, l)}%).`),
      };
    }
    const nuovo = v.titolo === 0;
    const r = nuovo ? valore2031(v.importo, v.anni) : valore2032(v.importo, v.anni);
    const t = nuovo ? R.valore_2031 : R.valore_2032;
    return {
      head: [T(l, `Cedole nette in ${r.anni} ${r.anni === 1 ? 'anno' : 'anni'}`, `Net coupons over ${r.anni} year${r.anni === 1 ? '' : 's'}`), eur(r.netti, l)],
      sub: T(l, `${pct(r.rendNetto, l, 2)} netto all’anno in media · ${t.nome}`, `${pct(r.rendNetto, l, 2)} net a year on average · ${t.nome}`),
      // Collocamento chiuso : dit sous le gros chiffre, plus en bas de carte (testeurs naïfs du 2026-11-14, 2e tour).
      alert: chiuso(t.godimento, l) || undefined,
      rows: [
        [T(l, 'Cedole lorde', 'Gross coupons'), eur2(r.cedoleLorde, l)],
        ...(r.premio ? [[T(l, 'Premio finale lordo', 'Gross final bonus'), eur2(r.premio, l)] as [string, string]] : []),
        [T(l, 'Tassa 12,5%', '12.5% tax'), eur2(r.tassa, l)],
        [T(l, 'Bollo (imposta dello 0,20% all’anno sul valore dei titoli)', 'Stamp duty (0.20% a year on the value of the bonds)'), eur2(r.bollo, l)],
      ],
      table: { headers: T(l, ['Anno', 'Tasso lordo', 'Cedole lorde dell’anno'], ['Year', 'Gross rate', 'Gross coupons that year']), align: ['l', 'r', 'r'], rows: t.tassi.map(([y, x]) => [T(l, `Anno ${y}`, `Year ${y}`), pct(x / 100, l, 2), eur(v.importo * x / 100, l)]) },
      note: T(l, `Tassi definitivi del comunicato del Ministero dell’economia del ${data(t.comunicato, l)}. Prezzo di emissione 100, senza commissioni.`, `Final rates from the Ministry of Economy release of ${data(t.comunicato, l)}. Issued at 100, with no fees.`),
    };
  },
});
