/**
 * Cas de référence officiels : les rendements bruts publiés par le Dipartimento del Tesoro dans ses PDF
 * « Risultati Asta » (params-2026.json → aste) doivent ressortir du moteur, au jour de règlement de l'adjudication.
 */
import { describe, it, expect } from 'vitest';
import { btp, bot, buono, deposito, valore, insieme, italia, netto, tassoBuono, irr, addMonths, type BuonoDef } from './titoli';
import P from '../../data/params-2026.json';

const F = P.fisco;
const fixed = P.aste.filter((a) => (a.tipo === 'BTP' || a.tipo === 'BTPST') && a.cedola != null && !a.nome.includes('50 anni'));

describe('BTP : le rendement brut du moteur retrouve celui du Tesoro', () => {
  for (const a of fixed) {
    it(`${a.nome} ${a.isin}, asta del ${a.asta} : ${a.rendimento}%`, () => {
      const r = btp(F, { nominale: 100000, prezzo: a.prezzo, cedola: a.cedola as number, scadenza: a.scadenza, oggi: a.regolamento });
      // Écart mesuré le 2026-11-13 : 0,008 point au plus sur 21 BTP (arrondis du Tesoro).
      expect(Math.abs(r.irrLordo * 100 - a.rendimento)).toBeLessThan(0.02);
    });
  }
  it('le net est inférieur au brut, et le timbre et l’impôt sont positifs', () => {
    const a = fixed[0];
    const r = btp(F, { nominale: 10000, prezzo: a.prezzo, cedola: a.cedola as number, scadenza: a.scadenza, oggi: a.regolamento });
    expect(r.irrNetto).toBeLessThan(r.irrLordo);
    expect(r.bollo).toBeGreaterThan(0);
    expect(r.tassaCedole).toBeCloseTo(r.cedoleLorde * 0.125, 6);
  });
  it('prix au-dessus du pair : pas d’impôt sur l’écart', () => {
    const r = btp(F, { nominale: 10000, prezzo: 101, cedola: 4, scadenza: '2030-06-01', oggi: '2026-11-13' });
    expect(r.tassaScarto).toBe(0);
  });
});

describe('BOT : rendement simple sur 360 jours du Tesoro', () => {
  for (const a of P.aste.filter((x) => x.tipo === 'BOT' && x.prezzo === x.prezzo_fiscale)) {
    it(`${a.isin} del ${a.asta} : ${a.rendimento}%`, () => {
      const r = bot(F, { nominale: 10000, prezzo: a.prezzo, scadenza: a.scadenza, oggi: a.regolamento });
      expect(Math.abs(r.rendLordo360 * 100 - a.rendimento)).toBeLessThan(0.02);
      expect(r.tassa).toBeCloseTo(r.scarto * 0.125, 6);
    });
  }
});

describe('Buoni fruttiferi postali', () => {
  const ord = P.buoni.find((b) => b.id === 'ordinario') as BuonoDef;
  it('Buono Ordinario : 2,50 % sur 20 ans, 0 la première année incomplète', () => {
    expect(tassoBuono(ord, 20)).toBe(2.5);
    expect(tassoBuono(ord, 0.5)).toBe(0);
    expect(tassoBuono(ord, 10)).toBe(1.47);
  });
  it('10 000 € pour 20 ans : 10 000 × 1,025^20, impôt 12,5 %, exonéré de timbre ≤ 5 000 € seulement', () => {
    const r = buono(F, ord, 10000, 20);
    expect(r.valoreLordo).toBeCloseTo(10000 * Math.pow(1.025, 20), 4);
    expect(r.tassa).toBeCloseTo(r.interessi * 0.125, 6);
    expect(r.esenteBollo).toBe(false);
    expect(buono(F, ord, 5000, 20).bollo).toBe(0);
  });
  it('Buono 4 anni Plus : rien avant 4 ans', () => {
    const b = P.buoni.find((x) => x.id === '4plus') as BuonoDef;
    expect(buono(F, b, 10000, 3).interessi).toBe(0);
    expect(buono(F, b, 10000, 4).valoreLordo).toBeCloseTo(10000 * Math.pow(1.0225, 4), 4);
  });
  it('Buono Minori : 5 % jusqu’aux 18 ans', () => {
    const b = P.buoni.find((x) => x.id === 'minori') as BuonoDef;
    expect(buono(F, b, 1000, 10, 1000).valoreLordo).toBeCloseTo(1000 * Math.pow(1.05, 10), 4);
    expect(buono(F, b, 1000, 1, 1000).interessi).toBe(0);
  });
});

describe('Dépôt, BTP Valore, Italia, impôt', () => {
  it('dépôt : 26 % et 0,20 % par an', () => {
    const r = deposito(F, 10000, 3, 2);
    expect(r.lordi).toBeCloseTo(600, 6);
    expect(r.tassa).toBeCloseTo(156, 6);
    expect(r.bollo).toBeCloseTo(40, 6);
  });
  it('BTP Valore 2031 : somme des coupons step-up', () => {
    const r = valore(F, P.retail.valore_2031.tassi, 10000, 5);
    expect(r.cedoleLorde).toBeCloseTo(10000 * (3.75 * 2 + 4.2 * 2 + 4.75) / 100, 6);
  });
  it('Insieme : coupon unique de 22,70 %', () => {
    expect(insieme(F, 22.7, 10000, 5).lordo).toBeCloseTo(2270, 6);
  });
  it('BTP Italia : inflation nulle → seul le taux réel', () => {
    expect(italia(F, 1.85, 0, 10000, 1).lordoAnno).toBeCloseTo(185, 6);
  });
  it('12,5 % contre 26 %', () => {
    expect(netto(F, 1000).differenza).toBeCloseTo(135, 6);
  });
  it('outils', () => {
    expect(addMonths('2029-09-15', -6)).toBe('2029-03-15');
    expect(addMonths('2026-08-31', -6)).toBe('2026-02-28');
    expect(irr([[0, -100], [1, 105]])).toBeCloseTo(0.05, 6);
  });
});
