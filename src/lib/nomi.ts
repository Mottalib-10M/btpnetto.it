/**
 * Noms des titres en clair (testeurs naïfs du 2026-11-14, 2e tour) : « BTP 7 anni » qui « scade il 15 febbraio 2031 »,
 * « BOT 12 mesi » qui échoit dans quatre mois, « BTP 5 anni » proposé pour 4 ans se lisaient comme des erreurs.
 * Le nom du Trésor reste (c'est la durée à l'émission) ; quand il ne correspond plus au temps qui reste, on l'ajoute.
 */
import { anniTra } from './engine/titoli';
import { BUILD_TODAY } from './today';
type L = 'it' | 'en';
type Titolo = { nome: string; tipo: string; scadenza: string };

/** « 4 mesi », « circa 4 anni » : temps restant jusqu'à l'échéance. */
export function restante(scadenza: string, l: L, oggi = BUILD_TODAY): string {
  const anni = Math.max(0, anniTra(oggi, scadenza));
  const mesi = Math.max(1, Math.round(anni * 12));
  if (anni < 1.5) return l === 'en' ? `${mesi} month${mesi === 1 ? '' : 's'}` : `${mesi} ${mesi === 1 ? 'mese' : 'mesi'}`;
  const a = Math.round(anni);
  return l === 'en' ? `about ${a} years` : `circa ${a} anni`;
}

/** Nom du Trésor, sigles traduits (« BTP Short Term (BTP a breve termine) »). */
export function nomeBase(a: Titolo, l: L): string {
  const en = l === 'en';
  const base = a.nome.split(' (')[0];
  if (a.tipo === 'BTPST') return en ? 'BTP Short Term (short-term BTP)' : 'BTP Short Term (BTP a breve termine)';
  if (a.tipo === 'CCTeu') return en ? 'CCTeu (floating-rate Treasury certificate)' : 'CCTeu (Certificato di credito del Tesoro, a interesse variabile)';
  return en ? base.replace('anni', 'years').replace('mesi', 'months') : base;
}
/** Vrai quand la durée du nom ne dit plus le temps qui reste (titre rouvert ou déjà ancien). */
export function nomeIngannevole(a: Titolo, oggi = BUILD_TODAY): boolean {
  const n = a.nome.split(' (')[0];
  const anni = Math.max(0, anniTra(oggi, a.scadenza));
  const mA = /(\d+) anni/.exec(n), mM = /(\d+) mesi/.exec(n);
  return Boolean((mA && Math.round(anni) !== Number(mA[1])) || (mM && Math.abs(Math.round(anni * 12) - Number(mM[1])) >= 2));
}
/** « (tra circa 4 anni) » à poser après la date d'échéance, seulement quand le nom trompe. */
export const traQuanto = (a: Titolo, l: L, oggi = BUILD_TODAY) => (nomeIngannevole(a, oggi) ? ` (${l === 'en' ? 'in' : 'tra'} ${restante(a.scadenza, l, oggi)})` : '');
/** Nom seul, sans date à côté : le temps restant entre parenthèses quand le nom trompe. */
export function nomeChiaro(a: Titolo, l: L, oggi = BUILD_TODAY): string {
  const base = nomeBase(a, l);
  if (!nomeIngannevole(a, oggi)) return base;
  const r = restante(a.scadenza, l, oggi);
  return l === 'en' ? `${base} (${r} left)` : `${base} (${r === '1 mese' ? 'manca' : 'mancano'} ${r} alla scadenza)`;
}
