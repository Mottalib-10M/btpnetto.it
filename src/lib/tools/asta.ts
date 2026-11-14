/** Prix ↔ rendement : pour un titre des dernières adjudications, rendement brut et net au prix saisi. */
import { T, pct, data, type L } from '../minis/_kit';
import { ULTIME, btp, bot } from '../engine/index';
import type { ToolSpec } from '../tool-types';
import { nomeTitolo, dataBreve } from './_opz';
import { formatDecimal } from '../format';
const LISTA = ULTIME.filter((a) => a.tipo === 'BOT' || a.cedola != null);
export default (l: L): ToolSpec => ({
  exemple: T(l, 'Esempio: il titolo dell’ultima asta, al suo prezzo', 'Example: the latest auctioned security, at its price'),
  inputs: [
    { id: 'titolo', label: T(l, 'Titolo all’asta', 'Auctioned security'), def: 0, options: LISTA.map((a, i) => ({ value: String(i), label: a.tipo === 'BOT' ? `BOT, ${T(l, 'scade il', 'matures')} ${dataBreve(a.scadenza, l)}` : nomeTitolo(a, l, true) })) },
    { id: 'prezzo', label: T(l, 'Prezzo pagato per 100 € di titolo (vuoto o 0 = prezzo d’asta)', 'Price paid per €100 of bond (empty or 0 = auction price)'), def: 0, max: 200, decimals: 3 },
  ],
  run: (v) => {
    const a = LISTA[Math.min(LISTA.length - 1, Math.max(0, v.titolo))];
    const px = v.prezzo > 0 ? v.prezzo : a.prezzo;
    const isBot = a.tipo === 'BOT';
    const lordo = isBot ? bot(a, 10000, px).rendLordo360 : btp(a, 10000, px).irrLordo;
    const nettoR = isBot ? bot(a, 10000, px).rendNetto : btp(a, 10000, px).irrNetto;
    return {
      head: [T(l, `Rendimento lordo al prezzo di ${formatDecimal(px, 3, l)}`, `Gross yield at a price of ${formatDecimal(px, 3, l)}`), pct(lordo, l, 2)],
      sub: T(l, `Netto di tassa e bollo: ${pct(nettoR, l, 2)} all’anno, comprando oggi`, `Net of tax and stamp duty: ${pct(nettoR, l, 2)} a year, buying today`),
      rows: [
        [T(l, 'Data dell’asta', 'Auction date'), data(a.asta, l)],
        [T(l, 'Prezzo d’asta', 'Auction price'), formatDecimal(a.prezzo, 3, l)],
        [T(l, 'Rendimento pubblicato dal Tesoro', 'Yield published by the Treasury'), `${formatDecimal(a.rendimento, 3, l)}%`],
        ['ISIN', a.isin],
      ],
      note: isBot ? T(l, 'Rendimento lordo dei BOT sulla base di 360 giorni, come nei comunicati del Tesoro.', 'BOT gross yield on a 360-day basis, as in Treasury releases.') : T(l, 'Qui il rendimento parte da oggi; quello del Tesoro parte dal giorno di regolamento dell’asta, per questo i due possono differire di poco.', 'Here the yield starts today; the Treasury figure starts on the auction settlement date, so the two can differ slightly.'),
    };
  },
});
