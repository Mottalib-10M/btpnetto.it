/** Tableaux et chiffres partagés par les pages (tirés du moteur et des paramètres, jamais écrits à la main). */
import type { Helpers } from './guide-types';
const it = (h: Helpers) => h.lang === 'it';
const nome = (h: Helpers, a: { nome: string }) => a.nome.replace('anni', it(h) ? 'anni' : 'years').replace('vita residua', it(h) ? 'vita residua' : 'remaining').replace('Short Term', 'Short Term');
export function tabBtp(h: Helpers, filtro?: (a: (typeof h.M.BTPS)[number]) => boolean): string {
  const L = h.M.BTPS.filter(filtro ?? (() => true));
  return h.table(
    it(h) ? ['Titolo', 'Cedola', 'Scadenza', 'Asta del', 'Prezzo', 'Lordo', 'Netto da oggi'] : ['Bond', 'Coupon', 'Maturity', 'Auction of', 'Price', 'Gross', 'Net from today'],
    L.map((a) => { const r = h.M.btp(a, 10000); return [nome(h, a), `${h.num(a.cedola as number, 2)}%`, h.date(a.scadenza), h.date(a.asta), h.num(a.prezzo, 2), `${h.num(a.rendimento, 2)}%`, h.pct(r.irrNetto, 2)]; }),
    it(h) ? `BTP a tasso fisso: ultimo prezzo d’asta del Tesoro; netto di tassa del 12,5% e bollo, comprando il ${h.date(h.today)} a quel prezzo` : `Fixed-rate BTP: latest Treasury auction price; net of the 12.5% tax and stamp duty, buying on ${h.date(h.today)} at that price`,
    ['l', 'r', 'l', 'l', 'r', 'r', 'r'],
  );
}
export function tabBot(h: Helpers): string {
  return h.table(
    it(h) ? ['BOT', 'Scadenza', 'Asta del', 'Prezzo', 'Lordo (360)', 'Netto da oggi'] : ['BOT', 'Maturity', 'Auction of', 'Price', 'Gross (360)', 'Net from today'],
    h.M.BOTS.map((a) => { const r = h.M.bot(a, 10000); return [a.isin, h.date(a.scadenza), h.date(a.asta), h.num(a.prezzo, 3), `${h.num(a.rendimento, 3)}%`, h.pct(r.rendNetto, 2)]; }),
    it(h) ? 'BOT ancora in vita: prezzo medio dell’ultima asta; netto di tassa e bollo dal giorno del calcolo' : 'BOT still running: average price at the latest auction; net of tax and stamp duty from the calculation date',
    ['l', 'l', 'l', 'r', 'r', 'r'],
  );
}
export function tabConfronto(h: Helpers, importo: number, anniList: number[]): string {
  const rows = anniList.map((n) => { const c = h.M.confronto(importo, n); const g = (id: string) => c.find((r) => r.id === id); return [String(n), h.eur(g('btp')!.netti), g('bot') ? h.eur(g('bot')!.netti) : '–', h.eur(g('buono')!.netti), h.eur(g('deposito')!.netti)]; });
  return h.table(it(h) ? ['Anni', 'BTP', 'BOT', 'Buono', 'Deposito'] : ['Years', 'BTP', 'BOT', 'Postal bond', 'Deposit'], rows,
    it(h) ? `Interessi netti su ${h.eur(importo)}: BTP con la durata più vicina, al prezzo d’asta; BOT a 12 mesi solo per un anno; Buono Ordinario (4 anni Plus a quattro anni); deposito al tasso medio BCE` : `Net interest on ${h.eur(importo)}: the BTP closest in term, at its auction price; 12-month BOT for one year only; Buono Ordinario (4 anni Plus at four years); deposit at the ECB average rate`,
    ['l', 'r', 'r', 'r', 'r']);
}
