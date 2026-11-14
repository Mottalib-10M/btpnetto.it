/** Moteur lié aux paramètres : pages, outils et mini-simulateurs appellent ces fonctions, jamais un second calcul. */
import { P, type Asta, type Buono } from './params';
import * as T from './titoli';
import { BUILD_TODAY } from '../today';
export { anniTra, giorniTra, addMonths } from './titoli';
export type { Asta, Buono };
const F = P.fisco;

/** Titres à coupon fixe encore en vie (BTP et BTP Short Term), du plus proche au plus lointain. */
export const BTPS: Asta[] = P.aste.filter((a) => (a.tipo === 'BTP' || a.tipo === 'BTPST') && a.cedola != null)
  .sort((a, b) => a.scadenza.localeCompare(b.scadenza));
export const BOTS: Asta[] = P.aste.filter((a) => a.tipo === 'BOT').sort((a, b) => a.scadenza.localeCompare(b.scadenza));
/** Dernières adjudications, la plus récente d'abord. */
export const ULTIME: Asta[] = [...P.aste].sort((a, b) => b.asta.localeCompare(a.asta) || a.scadenza.localeCompare(b.scadenza));
export const ULTIMA_ASTA = ULTIME[0];
export const BOT12 = [...BOTS].filter((b) => b.nome.startsWith('BOT 12')).sort((a, b) => b.asta.localeCompare(a.asta))[0];
export const buonoById = (id: string): Buono => P.buoni.find((b) => b.id === id)!;
export const astaByIsin = (isin: string) => P.aste.find((a) => a.isin === isin);

export const btp = (a: Asta, nominale: number, prezzo = a.prezzo, oggi = BUILD_TODAY) =>
  T.btp(F, { nominale, prezzo, cedola: a.cedola as number, scadenza: a.scadenza, oggi });
export const bot = (a: Asta, nominale: number, prezzo = a.prezzo, oggi = BUILD_TODAY) =>
  T.bot(F, { nominale, prezzo, scadenza: a.scadenza, oggi });
export const buono = (id: string, nominale: number, anni: number, totale = nominale, premiale = false) =>
  T.buono(F, buonoById(id) as T.BuonoDef, nominale, anni, totale, premiale);
export const tassoBuono = (id: string, anni: number) => T.tassoBuono(buonoById(id) as T.BuonoDef, anni);
export const deposito = (nominale: number, tasso: number, anni: number) => T.deposito(F, nominale, tasso, anni);
export const valore2031 = (nominale: number, anni: number) => T.valore(F, P.retail.valore_2031.tassi, nominale, anni, 0);
export const valore2032 = (nominale: number, anni: number) => T.valore(F, P.retail.valore_2032.tassi, nominale, anni, P.retail.valore_2032.premio_finale);
export const insieme2031 = (nominale: number) => T.insieme(F, P.retail.insieme_2031.cedola_unica, nominale, T.anniTra(P.retail.insieme_2031.godimento, P.retail.insieme_2031.scadenza));
export const italia2032 = (nominale: number, inflazione: number, anni: number) => T.italia(F, P.retail.italia_2032.tasso_reale, inflazione, nominale, anni);
export const netto = (lordo: number) => T.netto(F, lordo);

/** BTP dont la durée restante est la plus proche de `anni`. */
export function btpPerDurata(anni: number, oggi = BUILD_TODAY): Asta {
  return BTPS.reduce((best, a) => (Math.abs(T.anniTra(oggi, a.scadenza) - anni) < Math.abs(T.anniTra(oggi, best.scadenza) - anni) ? a : best), BTPS[0]);
}
/** Taux moyen BCE des dépôts à durée convenue en Italie, selon la durée. */
export const tassoDeposito = (anni: number) => (anni <= 1 ? P.deposito.entro_1_anno : P.deposito.oltre_2_anni);

export interface Riga { id: 'btp' | 'bot' | 'buono' | 'deposito'; nome: string; titolo?: Asta; scadenza?: string; cedola?: number; fonte: string; netti: number; rendNetto: number; tassa: number; bollo: number }
/** Les quatre placements pour un montant et une durée (années pleines de 1 à 10). */
export function confronto(nominale: number, anni: number, tassoDep = tassoDeposito(anni), oggi = BUILD_TODAY): Riga[] {
  const out: Riga[] = [];
  const a = btpPerDurata(anni, oggi);
  const r = btp(a, nominale, a.prezzo, oggi);
  out.push({ id: 'btp', nome: a.nome.split(' (')[0], titolo: a, scadenza: a.scadenza, cedola: a.cedola ?? undefined, fonte: a.asta, netti: r.guadagnoNetto, rendNetto: r.irrNetto, tassa: r.tassaCedole + r.tassaScarto, bollo: r.bollo });
  if (anni <= 1 && BOT12) {
    const b = bot(BOT12, nominale, BOT12.prezzo, oggi);
    out.push({ id: 'bot', nome: 'BOT 12 mesi', titolo: BOT12, scadenza: BOT12.scadenza, fonte: BOT12.asta, netti: b.netto, rendNetto: b.rendNetto, tassa: b.tassa, bollo: b.bollo });
  }
  const id = anni === 4 ? '4plus' : 'ordinario';
  const bb = buono(id, nominale, anni);
  out.push({ id: 'buono', nome: buonoById(id).nome, fonte: buonoById(id).dal, netti: bb.netto - nominale, rendNetto: bb.rendNetto, tassa: bb.tassa, bollo: bb.bollo });
  const d = deposito(nominale, tassoDep, anni);
  out.push({ id: 'deposito', nome: 'Conto deposito', fonte: P.deposito.mese, netti: d.netti, rendNetto: d.rendNetto, tassa: d.tassa, bollo: d.bollo });
  return out;
}
