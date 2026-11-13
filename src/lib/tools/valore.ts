/** BTP Valore (step-up), BTP Valore Insieme, BTP Valore 2032 avec prime finale. */
import { T, eur, eur2, pct, data, type L } from '../minis/_kit';
import { valore2031, valore2032, insieme2031 } from '../engine/index';
import { P } from '../engine/params';
import type { ToolSpec } from '../tool-types';
import { importo } from './_opz';
const R = P.retail;
export default (l: L): ToolSpec => ({
  exemple: T(l, 'Esempio: 10.000 € tenuti fino alla scadenza', 'Example: €10,000 held to maturity'),
  inputs: [
    { id: 'titolo', label: T(l, 'Quale emissione', 'Which issue'), def: 0, options: [
      { value: '0', label: `${R.valore_2031.nome} (${T(l, 'cedole trimestrali', 'quarterly coupons')})` },
      { value: '1', label: `${R.insieme_2031.nome} (${T(l, 'cedola unica', 'single coupon')})` },
      { value: '2', label: `${R.valore_2032.nome} (${T(l, 'premio finale', 'final bonus')})` }] },
    importo(l),
    { id: 'anni', label: T(l, 'Anni tenuti (senza vendere)', 'Years held (without selling)'), def: 5, max: 6, help: T(l, 'Il calcolo conta le cedole degli anni pieni; vendere prima si fa al prezzo di mercato, che qui non è noto', 'The calculation counts coupons for full years; selling early happens at the market price, unknown here'), showIf: (v) => v.titolo !== 1 },
  ],
  run: (v) => {
    if (v.titolo === 1) {
      const r = insieme2031(v.importo);
      return {
        head: [T(l, 'Cedola netta alla scadenza', 'Net coupon at maturity'), eur(r.netti, l)],
        sub: T(l, `${R.insieme_2031.cedola_unica.toString().replace('.', ',')}% lordo una sola volta, il ${data(R.insieme_2031.scadenza, l)} · ${pct(r.rendNetto, l, 2)} netto all’anno composto`, `${R.insieme_2031.cedola_unica}% gross paid once, on ${data(R.insieme_2031.scadenza, l)} · ${pct(r.rendNetto, l, 2)} net a year compounded`),
        rows: [[T(l, 'Cedola lorda', 'Gross coupon'), eur2(r.lordo, l)], [T(l, 'Tassa 12,5%', '12.5% tax'), eur2(r.tassa, l)], [T(l, 'Bollo 0,20% per 5 anni', '0.20% stamp duty for 5 years'), eur2(r.bollo, l)]],
        note: T(l, `Tasso definitivo del comunicato MEF del ${data(R.insieme_2031.comunicato, l)} (minimo annunciato: ${R.insieme_2031.cedola_minima.toString().replace('.', ',')}%).`, `Final rate from the Ministry release of ${data(R.insieme_2031.comunicato, l)} (announced minimum: ${R.insieme_2031.cedola_minima}%).`),
      };
    }
    const nuovo = v.titolo === 0;
    const r = nuovo ? valore2031(v.importo, v.anni) : valore2032(v.importo, v.anni);
    const t = nuovo ? R.valore_2031 : R.valore_2032;
    return {
      head: [T(l, `Cedole nette in ${r.anni} ${r.anni === 1 ? 'anno' : 'anni'}`, `Net coupons over ${r.anni} year${r.anni === 1 ? '' : 's'}`), eur(r.netti, l)],
      sub: T(l, `${pct(r.rendNetto, l, 2)} netto all’anno in media · ${t.nome}`, `${pct(r.rendNetto, l, 2)} net a year on average · ${t.nome}`),
      rows: [
        [T(l, 'Cedole lorde', 'Gross coupons'), eur2(r.cedoleLorde, l)],
        ...(r.premio ? [[T(l, 'Premio finale lordo', 'Gross final bonus'), eur2(r.premio, l)] as [string, string]] : []),
        [T(l, 'Tassa 12,5%', '12.5% tax'), eur2(r.tassa, l)],
        [T(l, 'Bollo 0,20%', '0.20% stamp duty'), eur2(r.bollo, l)],
      ],
      table: { headers: T(l, ['Anno', 'Tasso lordo', 'Cedole lorde dell’anno'], ['Year', 'Gross rate', 'Gross coupons that year']), align: ['l', 'r', 'r'], rows: t.tassi.map(([y, x]) => [String(y), `${x.toString().replace('.', l === 'en' ? '.' : ',')}%`, eur(v.importo * x / 100, l)]) },
      note: T(l, `Tassi definitivi del comunicato MEF del ${data(t.comunicato, l)}. Prezzo di emissione 100, senza commissioni.`, `Final rates from the Ministry release of ${data(t.comunicato, l)}. Issued at 100, with no fees.`),
    };
  },
});
