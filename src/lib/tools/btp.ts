/** Un BTP précis : cédoles nettes, impôt sur l'écart au pair, timbre, rendement net annuel jusqu'à l'échéance. */
import { T, eur, eur2, pct, data, type L } from '../minis/_kit';
import { BTPS, btp } from '../engine/index';
import type { ToolSpec } from '../tool-types';
import { opzBtp, defBtp, importo, prezzo, nomeTitolo } from './_opz';
import { formatDecimal } from '../format';
export default (l: L, o: { titolo?: string } = {}): ToolSpec => ({
  exemple: T(l, 'Esempio: 10.000 € sul BTP indicato, al prezzo dell’ultima asta', 'Example: €10,000 in the bond shown, at the last auction price'),
  inputs: [
    { id: 'titolo', label: T(l, 'Quale BTP', 'Which BTP'), def: defBtp(o.titolo), options: opzBtp(l) },
    importo(l),
    prezzo(l, T(l, 'Il prezzo che vedi in banca o in app; con 0 il calcolo usa quello dell’ultima asta del Tesoro', 'The price shown by your bank or app; 0 uses the latest Treasury auction price')),
  ],
  run: (v) => {
    const a = BTPS[Math.min(BTPS.length - 1, Math.max(0, v.titolo))];
    const px = v.prezzo > 0 ? v.prezzo : a.prezzo;
    const r = btp(a, v.importo, px);
    return {
      head: [T(l, 'Guadagno netto fino alla scadenza', 'Net gain to maturity'), eur(r.guadagnoNetto, l)],
      sub: T(l, `${pct(r.irrNetto, l, 2)} netto all’anno (${pct(r.irrLordo, l, 2)} prima delle tasse) · ${nomeTitolo(a, l)}`, `${pct(r.irrNetto, l, 2)} net a year (${pct(r.irrLordo, l, 2)} before tax) · ${nomeTitolo(a, l)}`),
      rows: [
        [T(l, `Prezzo usato (asta del ${data(a.asta, l)}: ${formatDecimal(a.prezzo, 3, l)})`, `Price used (auction of ${data(a.asta, l)}: ${formatDecimal(a.prezzo, 3, l)})`), formatDecimal(px, 3, l)],
        [T(l, 'Spesa oggi, rateo compreso', 'Cost today, accrued interest included'), eur2(r.costoNetto, l)],
        [T(l, `Cedole nette (${r.nCedole} semestrali)`, `Net coupons (${r.nCedole} half-yearly)`), eur2(r.cedoleNette, l)],
        [T(l, 'Tassa 12,5% sulle cedole', '12.5% tax on coupons'), eur2(r.tassaCedole, l)],
        [T(l, 'Tassa 12,5% sulla differenza tra il prezzo pagato e i 100 rimborsati', '12.5% tax on the gap between the price paid and the 100 repaid'), eur2(r.tassaScarto, l)],
        [T(l, 'Bollo stimato (imposta dello 0,20% all’anno sul valore dei titoli)', 'Estimated stamp duty (0.20% a year on the value of the bonds)'), eur2(r.bollo, l)],
        [T(l, 'Netto incassato in tutto', 'Total net received'), eur2(r.nettoScadenza, l), true],
      ],
      note: T(l, `Prossima cedola il ${data(r.prossimaCedola, l)}; rimborso di ${eur(r.rimborso, l)} il ${data(a.scadenza, l)}. Commissioni della banca escluse.`, `Next coupon on ${data(r.prossimaCedola, l)}; ${eur(r.rimborso, l)} repaid on ${data(a.scadenza, l)}. Bank fees not included.`),
    };
  },
});
