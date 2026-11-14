/** Un BOT précis : écart au pair, impôt de 12,5 %, timbre au prorata, rendement net annuel. */
import { T, eur2, pct, data, type L } from '../minis/_kit';
import { BOTS, bot } from '../engine/index';
import type { ToolSpec } from '../tool-types';
import { opzBot, importo, prezzo } from './_opz';
import { formatDecimal } from '../format';
const defBot = () => { const i = BOTS.reduce((b, a, k) => (a.asta > BOTS[b].asta ? k : b), 0); return i; };
export default (l: L): ToolSpec => ({
  exemple: T(l, 'Esempio: 10.000 € nominali sul BOT dell’ultima asta', 'Example: €10,000 face value in the latest auctioned BOT'),
  inputs: [
    { id: 'titolo', label: T(l, 'Quale BOT', 'Which BOT'), def: defBot(), options: opzBot(l) },
    { ...importo(l), label: T(l, 'Quanto ti rimborsano alla scadenza (valore nominale)', 'Amount repaid at maturity (face value)') },
    prezzo(l, T(l, 'Il prezzo che vedi in banca; lascia vuoto per usare quello medio dell’asta', 'The price at your bank; leave empty to use the average auction price')),
  ],
  run: (v) => {
    const a = BOTS[Math.min(BOTS.length - 1, Math.max(0, v.titolo))];
    const px = v.prezzo > 0 ? v.prezzo : a.prezzo;
    const r = bot(a, v.importo, px);
    return {
      head: [T(l, 'Guadagno netto a scadenza', 'Net gain at maturity'), eur2(r.netto, l)],
      sub: T(l, `${pct(r.rendNetto, l, 2)} netto all’anno se compri oggi a questo prezzo · ${r.giorni} giorni, scadenza ${data(a.scadenza, l)}`, `${pct(r.rendNetto, l, 2)} net a year if you buy today at this price · ${r.giorni} days, matures ${data(a.scadenza, l)}`),
      rows: [
        [T(l, `Prezzo (asta del ${data(a.asta, l)}: ${formatDecimal(a.prezzo, 3, l)})`, `Price (auction of ${data(a.asta, l)}: ${formatDecimal(a.prezzo, 3, l)})`), formatDecimal(px, 3, l)],
        [T(l, 'Spesa oggi', 'Cost today'), eur2(r.costo, l)],
        [T(l, 'Differenza incassata a scadenza', 'Gain paid at maturity'), eur2(r.scarto, l)],
        [T(l, 'Tassa 12,5%', '12.5% tax'), eur2(r.tassa, l)],
        [T(l, 'Bollo (imposta dello 0,20% all’anno), solo per i giorni in cui lo tieni', 'Stamp duty (0.20% a year), only for the days you hold it'), eur2(r.bollo, l)],
        [T(l, 'Rendimento prima delle tasse, calcolato come il Tesoro', 'Yield before tax, worked out as the Treasury does'), pct(r.rendLordo360, l, 3)],
      ],
      note: T(l, 'Il BOT non paga cedole (interessi periodici): guadagni la differenza tra il prezzo pagato e 100. Il netto qui parte da oggi; nella tabella dei BOT parte dal giorno dell’asta, per questo i due possono differire di poco. Commissioni escluse.', 'A BOT pays no coupon (periodic interest): the gain is the gap between the price paid and 100. The net here starts today; in the BOT table it starts on the auction day, so the two can differ slightly. Fees not included.'),
    };
  },
});
