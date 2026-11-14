/** Prix ↔ rendement : pour un titre des dernières adjudications, rendement brut et net au prix saisi. */
import { T, pct, data, type L } from '../minis/_kit';
import { ULTIME, btp, bot } from '../engine/index';
import type { ToolSpec } from '../tool-types';
import { nomeTitolo, dataBreve } from './_opz';
import { restante } from '../nomi';
import { formatDecimal } from '../format';
const LISTA = ULTIME.filter((a) => a.tipo === 'BOT' || a.cedola != null);
export default (l: L): ToolSpec => ({
  exemple: T(l, 'Esempio: il titolo dell’ultima asta, al suo prezzo', 'Example: the latest auctioned security, at its price'),
  inputs: [
    { id: 'titolo', label: T(l, 'Titolo all’asta', 'Auctioned security'), def: 0, options: LISTA.map((a, i) => ({ value: String(i), label: a.tipo === 'BOT' ? `BOT, ${T(l, 'scade il', 'matures')} ${dataBreve(a.scadenza, l)} (${T(l, 'tra', 'in')} ${restante(a.scadenza, l)})` : nomeTitolo(a, l, true) })) },
    { id: 'prezzo', label: T(l, 'Prezzo pagato per 100 € di titolo', 'Price paid per €100 of bond'), def: 0, max: 200, decimals: 3, help: T(l, 'Lascia vuoto per usare il prezzo dell’asta; scrivi quello che vedi in banca', 'Leave empty to use the auction price; type the one your bank shows'), vuoto: T(l, 'quello dell’asta', 'the auction price') },
  ],
  run: (v) => {
    const a = LISTA[Math.min(LISTA.length - 1, Math.max(0, v.titolo))];
    const px = v.prezzo > 0 ? v.prezzo : a.prezzo;
    const isBot = a.tipo === 'BOT';
    const lordo = isBot ? bot(a, 10000, px).rendLordo360 : btp(a, 10000, px).irrLordo;
    const nettoR = isBot ? bot(a, 10000, px).rendNetto : btp(a, 10000, px).irrNetto;
    return {
      head: [T(l, `Rendimento netto all’anno, al prezzo di ${formatDecimal(px, 3, l)}`, `Net yield a year, at a price of ${formatDecimal(px, 3, l)}`), pct(nettoR, l, 2)],
      sub: T(l, `dopo la tassa e il bollo (l’imposta dello 0,20% all’anno sul valore dei titoli), comprando oggi · prima delle tasse: ${pct(lordo, l, 2)}`, `after tax and stamp duty (the 0.20% yearly levy on the value of your bonds), buying today · before tax: ${pct(lordo, l, 2)}`),
      rows: [
        [T(l, 'Data dell’asta', 'Auction date'), data(a.asta, l)],
        [T(l, 'Prezzo d’asta', 'Auction price'), formatDecimal(a.prezzo, 3, l)],
        [T(l, 'Rendimento pubblicato dal Tesoro', 'Yield published by the Treasury'), `${formatDecimal(a.rendimento, 3, l)}%`],
        [T(l, 'Codice ISIN (il codice del titolo, per cercarlo in banca)', 'ISIN code (the bond’s code, to look it up at your bank)'), a.isin],
      ],
      note: isBot ? T(l, 'Rendimento prima delle tasse calcolato come nei comunicati del Tesoro (che contano l’anno come 360 giorni).', 'Yield before tax worked out as in Treasury releases (which count a year as 360 days).') : T(l, 'Qui il rendimento parte da oggi; quello del Tesoro parte dal giorno in cui chi ha comprato all’asta ha pagato il titolo, per questo i due possono differire di poco.', 'Here the yield starts today; the Treasury figure starts on the day auction buyers paid for the bond, so the two can differ slightly.'),
    };
  },
});
