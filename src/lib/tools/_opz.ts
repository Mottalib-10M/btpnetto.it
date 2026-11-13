/** Listes communes aux outils (fichier ignoré par le registre : préfixe « _ »). */
import { T, data, type L } from '../minis/_kit';
import { BTPS, BOTS } from '../engine/index';
import { P } from '../engine/params';
import { formatDecimal } from '../format';
export const cedolaTxt = (c: number | null | undefined, l: L) => (c == null ? '' : `${formatDecimal(c, 2, l)}%`);
export const nomeTitolo = (a: (typeof P.aste)[number], l: L) => `${a.nome.split(' (')[0]} ${cedolaTxt(a.cedola, l)} · ${T(l, 'scad.', 'matures')} ${data(a.scadenza, l)}`.replace(/\s+·/, ' ·');
export const opzBtp = (l: L) => BTPS.map((a, i) => ({ value: String(i), label: nomeTitolo(a, l) }));
export const opzBot = (l: L) => BOTS.map((a, i) => ({ value: String(i), label: `BOT · ${T(l, 'scad.', 'matures')} ${data(a.scadenza, l)}` }));
export const defBtp = (start: string) => Math.max(0, BTPS.findIndex((a) => a.nome.startsWith(start)));
export const ANNI = (l: L, max = 10) => Array.from({ length: max }, (_, i) => ({ value: String(i + 1), label: T(l, i ? `${i + 1} anni` : '1 anno', i ? `${i + 1} years` : '1 year') }));
export const importo = (l: L, def = 10000) => ({ id: 'importo', label: T(l, 'Importo da investire', 'Amount to invest'), def, unit: '€', max: 5000000 });
export const prezzo = (l: L, astaTxt: string) => ({ id: 'prezzo', label: T(l, 'Prezzo pagato per 100 € (0 = prezzo d’asta)', 'Price paid per €100 (0 = auction price)'), def: 0, max: 200, decimals: 3, help: astaTxt, avance: true });
