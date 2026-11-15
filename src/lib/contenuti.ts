/** Tableaux et chiffres partagés par les pages (tirés du moteur et des paramètres, jamais écrits à la main). */
import type { Helpers } from './guide-types';
const it = (h: Helpers) => h.lang === 'it';
import { nomeChiaro } from './nomi';
// Nom du Trésor + temps restant quand le nom trompe (« BOT 12 mesi » qui échoit dans 4 mois) : lib/nomi.ts.
const nome = (h: Helpers, a: { nome: string; tipo: string; scadenza: string }) => nomeChiaro(a, h.lang === 'en' ? 'en' : 'it', h.today);
export function tabBtp(h: Helpers, filtro?: (a: (typeof h.M.BTPS)[number]) => boolean): string {
  const L = h.M.BTPS.filter(filtro ?? (() => true));
  return h.table(
    it(h) ? ['Titolo', 'Cedola', 'Scadenza', 'Asta del', 'Prezzo', 'Lordo all’asta', 'Netto all’asta, metodo del Tesoro'] : ['Bond', 'Coupon', 'Maturity', 'Auction of', 'Price', 'Gross at auction', 'Net at auction, Treasury method'],
    // Netto calcolato dal giorno dell'asta, come il lordo del Tesoro : confrontabili (testeurs naïfs du 2026-11-14).
    // TRI gardé ici (5e tour) : la moyenne simple dépasserait le brut du Tesoro pour le BTP 50 anni (4,92 % contre 4,61 %).
    L.map((a) => { const r = h.M.btp(a, 10000, a.prezzo, a.asta); return [nome(h, a), `${h.num(a.cedola as number, 2)}%`, h.date(a.scadenza), h.date(a.asta), h.num(a.prezzo, 2), `${h.num(a.rendimento, 2)}%`, h.pct(r.irrNetto, 2)]; }),
    it(h) ? 'BTP a tasso fisso: ultimo prezzo d’asta del Tesoro. Lordo = prima delle tasse, come pubblicato dal Tesoro; netto = dopo la tassa del 12,5% e il bollo, per chi ha comprato all’asta e tiene fino alla scadenza, calcolato con il metodo del Tesoro per confrontarlo con il lordo (i calcoli del sito danno invece la media all’anno)' : 'Fixed-rate BTP: latest Treasury auction price. Gross = before tax, as published by the Treasury; net = after the 12.5% tax and stamp duty, for a buyer at the auction who holds to maturity, worked out with the Treasury method to compare with the gross (the site’s calculations give the yearly average instead)',
    ['l', 'r', 'l', 'l', 'r', 'r', 'r'],
  );
}
export function tabBot(h: Helpers): string {
  return h.table(
    it(h) ? ['BOT', 'Scadenza', 'Asta del', 'Prezzo', 'Lordo all’asta', 'Netto all’asta'] : ['BOT', 'Maturity', 'Auction of', 'Price', 'Gross at auction', 'Net at auction'],
    // Netto dal giorno dell'asta : calcolato da oggi con il vecchio prezzo d'asta, superava il lordo (4,40% contro 2,607%).
    h.M.BOTS.map((a) => { const r = h.M.bot(a, 10000, a.prezzo, a.asta); return [nome(h, a), h.date(a.scadenza), h.date(a.asta), h.num(a.prezzo, 3), `${h.num(a.rendimento, 3)}%`, h.pct(r.rendNetto, 2)]; }),
    it(h) ? 'BOT ancora in vita, dalla scadenza più vicina: prezzo medio dell’ultima asta. Lordo = prima delle tasse, come pubblicato dal Tesoro; netto = dopo la tassa del 12,5% e il bollo, per chi ha comprato all’asta' : 'BOT still running, nearest maturity first: average price at the latest auction. Gross = before tax, as published by the Treasury; net = after the 12.5% tax and stamp duty, for a buyer at the auction',
    ['l', 'l', 'l', 'r', 'r', 'r'],
  );
}
export function tabConfronto(h: Helpers, importo: number, anniList: number[]): string {
  const rows = anniList.map((n) => { const c = h.M.confronto(importo, n); const g = (id: string) => c.find((r) => r.id === id); return [String(n), h.eur(g('btp')!.netti), g('bot') ? h.eur(g('bot')!.netti) : '–', h.eur(g('buono')!.netti), h.eur(g('deposito')!.netti)]; });
  return h.table(it(h) ? ['Anni', 'BTP', 'BOT', 'Buono postale', 'Deposito'] : ['Years', 'BTP', 'BOT', 'Postal bond', 'Deposit'], rows,
    it(h) ? `Interessi netti su ${h.eur(importo)}. BTP: quello con la durata più vicina, al prezzo d’asta. BOT: dura al massimo un anno, quindi «–» dalle durate di 2 anni in su. Buono: il Buono fruttifero postale Ordinario di Poste, e a 4 anni il Buono 4 anni Plus, che a quella durata rende di più. Deposito: tasso medio della Banca centrale europea (BCE)` : `Net interest on ${h.eur(importo)}. BTP: the one closest in term, at its auction price. BOT: lasts one year at most, hence «–» from 2 years up. Postal bond: the Buono Ordinario, and at 4 years the Buono 4 anni Plus, which pays more at that term. Deposit: European Central Bank (ECB) average rate`,
    ['l', 'r', 'r', 'r', 'r']);
}
