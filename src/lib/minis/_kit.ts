/** Petits outils communs aux mini-simulateurs et aux outils (fichier ignoré par les registres : préfixe « _ »). */
import { formatMoney, formatPercent, formatNumber } from '../format';
export type L = 'it' | 'en';
export const T = <A>(l: L, it: A, en: A) => (l === 'en' ? en : it);
export const eur = (x: number, l: L, d = 0) => formatMoney(x, d, l);
export const eur2 = (x: number, l: L) => formatMoney(x, Number.isInteger(Math.round(x * 100) / 100) ? 0 : 2, l);
export const pct = (x: number, l: L, d = 1) => formatPercent(x, d, l);
export const num = (x: number, l: L, d = 0) => formatNumber(x, d, l);
export const yn = (l: L) => [{ value: '0', label: 'No' }, { value: '1', label: l === 'en' ? 'Yes' : 'Sì' }];
export const data = (iso: string, l: L) => new Date(`${iso}T00:00:00Z`).toLocaleDateString(l === 'en' ? 'en-GB' : 'it-IT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const MESI = (l: L) => Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: new Date(Date.UTC(2027, i, 1)).toLocaleDateString(l === 'en' ? 'en-GB' : 'it-IT', { month: 'long', timeZone: 'UTC' }) }));
/**
 * « Netto all'anno » écrit avec sa base, la même sur toutes les pages : 10 000 € et un an (testeurs naïfs du 2026-11-14,
 * 5e tour). Le taux vient toujours de `mediaAnnua` (engine/titoli.ts), donc plus d'euros par an = pourcentage plus haut.
 */
export const nettoAnno = (r: number, l: L) => T(l, `${pct(r, l, 2)} netto all’anno in media, cioè ${eur(r * 10000, l)} all’anno ogni 10.000 € investiti`, `${pct(r, l, 2)} net a year on average, i.e. ${eur(r * 10000, l)} a year per €10,000 invested`);
/** « 5 anni e 2 mesi », « 4 mesi » : la durée réelle, quand le titre ne dure pas un nombre rond d'années. */
export function periodo(anni: number, l: L): string {
  const m = Math.max(1, Math.round(anni * 12)), a = Math.floor(m / 12), r = m % 12;
  const A = a ? T(l, a === 1 ? '1 anno' : `${a} anni`, a === 1 ? '1 year' : `${a} years`) : '';
  const M = r ? T(l, r === 1 ? '1 mese' : `${r} mesi`, r === 1 ? '1 month' : `${r} months`) : '';
  return A && M ? `${A} ${T(l, 'e', 'and')} ${M}` : A || M;
}
