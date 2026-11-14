/** Listes communes aux outils (fichier ignoré par le registre : préfixe « _ »). */
import { T, data, type L } from '../minis/_kit';
import { BTPS, BOTS, btpPerDurata } from '../engine/index';
import { P } from '../engine/params';
import { formatDecimal } from '../format';
export const cedolaTxt = (c: number | null | undefined, l: L) => (c == null ? '' : `${formatDecimal(c, 2, l)}%`);
const nomeEn = (n: string, l: L) => (l === 'en' ? n.replace('anni', 'years').replace('mesi', 'months') : n);
/** Date courte (« 1 feb 2032 ») pour les listes : sur 320 px, la date longue faisait passer le choix sur trois lignes. */
export const dataBreve = (iso: string, l: L) => new Date(`${iso}T00:00:00Z`).toLocaleDateString(l === 'en' ? 'en-GB' : 'it-IT', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
export const nomeTitolo = (a: (typeof P.aste)[number], l: L, breve = false) => `${nomeEn(a.nome.split(' (')[0], l)}${a.cedola == null ? '' : T(l, `, cedola ${cedolaTxt(a.cedola, l)}`, `, ${cedolaTxt(a.cedola, l)} coupon`)}, ${T(l, 'scade il', breve ? 'due' : 'matures')} ${(breve ? dataBreve : data)(a.scadenza, l)}`;
export const opzBtp = (l: L) => BTPS.map((a, i) => ({ value: String(i), label: nomeTitolo(a, l, true) }));
export const opzBot = (l: L) => BOTS.map((a, i) => ({ value: String(i), label: `BOT, ${T(l, 'scade il', 'matures')} ${dataBreve(a.scadenza, l)}` }));
/**
 * Titre proposé par défaut. Sans nom : le BTP de l'accueil pour 5 ans (`btpPerDurata`), pour que la page BTP et le
 * comparatif montrent le même titre et le même chiffre (testeurs naïfs du 2026-11-14 : 1 713 € à l'accueil, 1 203 € ici,
 * parce que `findIndex` prenait le premier « BTP 5 anni » par échéance, un titre de l'asta de mars). Avec un nom : la
 * plus récente adjudication de ce nom.
 */
export const defBtp = (start?: string) => {
  if (!start) return Math.max(0, BTPS.indexOf(btpPerDurata(5)));
  const c = BTPS.map((a, i) => ({ a, i })).filter(({ a }) => a.nome.startsWith(start)).sort((x, y) => y.a.asta.localeCompare(x.a.asta));
  return c.length ? c[0].i : 0;
};
export const ANNI = (l: L, max = 10) => Array.from({ length: max }, (_, i) => ({ value: String(i + 1), label: T(l, i ? `${i + 1} anni` : '1 anno', i ? `${i + 1} years` : '1 year') }));
export const importo = (l: L, def = 10000) => ({ id: 'importo', label: T(l, 'Importo da investire', 'Amount to invest'), def, unit: '€', max: 5000000 });
export const prezzo = (l: L, astaTxt: string) => ({ id: 'prezzo', label: T(l, 'Prezzo pagato per 100 € di titolo (vuoto o 0 = prezzo dell’ultima asta)', 'Price paid per €100 of bond (empty or 0 = latest auction price)'), def: 0, max: 200, decimals: 3, help: astaTxt, avance: true });
