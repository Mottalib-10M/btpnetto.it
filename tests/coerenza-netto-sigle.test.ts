/**
 * Testeurs naïfs du 2026-11-14, 5e tour (corrections validées par l'éditeur) :
 *  1. sigles BTP et BOT expliqués à leur première apparition sur chaque page (texte construit dans dist/) ;
 *  2. un nom qui contredit la durée (« BTP 7 anni » qui échoit dans 4 ans) porte « emesso a 7 anni, ne restano… » ;
 *  3. « netto all'anno » : une seule définition (gain ÷ somme payée ÷ années) et la même base écrite partout
 *     (« … € all'anno ogni 10.000 € investiti »), donc plus d'euros par an = pourcentage plus haut sur toutes les pages.
 */
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { TOOLS } from '../src/lib/tool-specs';
import * as M from '../src/lib/engine/index';
import { emesso, nomeChiaro } from '../src/lib/nomi';

const defaults = (spec: ReturnType<(typeof TOOLS)[string]>) => Object.fromEntries(spec.inputs.map((i) => [i.id, Number(i.def)]));
const num = (s: string) => Number(s.replace(/\./g, '').replace(',', '.'));

describe('3. netto all’anno : même définition, même base sur toutes les pages', () => {
  it('chaque « netto all’anno in media » est suivi de ses euros pour 10.000 €, cohérents avec le pourcentage', () => {
    let vus = 0;
    for (const [kind, f] of Object.entries(TOOLS)) {
      for (const l of ['it', 'en'] as const) {
        const spec = f(l);
        const out = spec.run(defaults(spec), {});
        const txt = [out.head.join(' '), out.sub ?? ''].join(' ');
        expect(txt, `${kind}/${l} : « netto all’anno » sans la moyenne`).not.toMatch(/\d% netto all’anno(?! in media)/);
        const re = l === 'it' ? /([\d.,]+)% netto all’anno in media, cioè ([\d.]+)\s€ all’anno ogni 10\.000 €/g : /([\d.,]+)% net a year on average, i\.e\. €([\d,]+) a year per €10,000/g;
        for (const m of txt.matchAll(re)) {
          const p = l === 'it' ? num(m[1]) : Number(m[1]);
          const e = l === 'it' ? num(m[2]) : Number(m[2].replace(/,/g, ''));
          expect(Math.abs(p * 100 - e), `${kind}/${l} : ${m[0]}`).toBeLessThanOrEqual(1);
          vus++;
        }
      }
    }
    expect(vus).toBeGreaterThanOrEqual(12);
  });
  it('le moteur : taux = gain ÷ somme payée ÷ années, pour chaque produit', () => {
    const a = M.btpPerDurata(5), b = M.btp(a, 10000);
    expect(b.rendNetto * b.costoNetto * b.anni).toBeCloseTo(b.guadagnoNetto, 6);
    const o = M.bot(M.BOT12, 10000);
    expect(o.rendNetto * o.costo * (o.giorni / 365)).toBeCloseTo(o.netto, 6);
    const p = M.buono('minori', 1000, 15);
    expect(p.rendNetto * 1000 * 15).toBeCloseTo(p.netto - 1000, 6);
    const v = M.valore2031(10000, 5);
    expect(v.rendNetto * 10000 * 5).toBeCloseTo(v.netti, 6);
    const i = M.italia2032(10000, 2, 5);
    expect(i.rendNetto * 10000 * 5).toBeCloseTo(i.netti, 6);
    const d = M.deposito(10000, 3, 5);
    expect(d.rendNetto * 10000 * 5).toBeCloseTo(d.netti, 6);
  });
  it('accueil contre BTP Valore : plus d’euros par an = pourcentage plus haut', () => {
    const btp = M.confronto(10000, 5).find((r) => r.id === 'btp')!;
    const val = M.valore2031(10000, 5);
    expect(Math.sign(val.rendNetto - btp.rendNetto)).toBe(Math.sign(val.rendNetto * 10000 - btp.rendNetto * 10000));
    // Le net ne dépasse jamais le brut écrit à côté (Buoni à intérêts composés compris).
    for (const n of [1, 5, 10, 15, 20]) { const r = M.buono('ordinario', 10000, n); expect(r.rendNetto).toBeLessThanOrEqual(r.rendLordo); }
    const m = M.buono('minori', 1000, 15, 1000); expect(m.rendNetto).toBeLessThan(m.rendLordo);
  });
});

describe('2. noms qui contredisent la durée', () => {
  it('« BTP 7 anni » qui échoit en février 2031 : emesso a 7 anni, ne restano circa 4 anni', () => {
    const a = { nome: 'BTP 7 anni (vita residua 5 anni)', tipo: 'BTP', scadenza: '2031-02-15' };
    expect(emesso(a, 'it', '2026-11-14')).toBe('emesso a 7 anni, ne restano circa 4 anni');
    expect(nomeChiaro(a, 'it', '2026-11-14')).toBe('BTP 7 anni (emesso a 7 anni, ne restano circa 4 anni)');
    expect(emesso({ nome: 'BOT 12 mesi', tipo: 'BOT', scadenza: '2027-03-12' }, 'it', '2026-11-14')).toBe('emesso a 12 mesi, ne restano 4 mesi');
    expect(emesso({ nome: 'BTP 5 anni', tipo: 'BTP', scadenza: '2031-11-14' }, 'it', '2026-11-14')).toBe('');
  });
});

// Pages de contenu construites : la première apparition de BTP et de BOT est suivie de son explication.
const pagine = (dir: string): string[] => readdirSync(dir).flatMap((n) => { const p = join(dir, n); return statSync(p).isDirectory() ? pagine(p) : n === 'index.html' ? [p] : []; });
const ESCLUSE = /\/(chi-siamo|about|contatti|contact|privacy|cookie|cookies|note-legali|legal-notice|politica-editoriale|editorial-policy|widget)\//;
describe.skipIf(!existsSync('dist/it'))('1. sigles BTP et BOT expliqués à leur première apparition (dist/)', () => {
  for (const f of (existsSync('dist/it') ? pagine('dist') : []).filter((p) => !ESCLUSE.test(p) && !p.includes('embed'))) {
    it(f, () => {
      const s = readFileSync(f, 'utf8');
      if (/noindex/.test(s.slice(0, 4000))) return;
      const m = /<main[^>]*>([\s\S]*)<\/main>/.exec(s);
      if (!m) return;
      const t = m[1].replace(/<nav[\s\S]*?<\/nav>/g, '').replace(/<(script|style)[\s\S]*?<\/\1>/g, '').replace(/<[^>]+>/g, ' ')
        .replace(/&[a-z#0-9]+;/g, ' ').replace(/BTP Netto/g, '').replace(/\s+/g, ' ');
      for (const [sig, spieg] of [['BTP', /Buon[oi] del Tesoro poliennal|allo Stato|to the (Italian )?State/i], ['BOT', /Buon[oi] ordinari?[oi]? del Tesoro|allo Stato|to the (Italian )?State/i]] as const) {
        const i = t.search(new RegExp(`\\b${sig}\\b`));
        if (i < 0) continue;
        expect(t.slice(i, i + 400), `${sig} non spiegato : « ${t.slice(i, i + 120)} »`).toMatch(spieg);
      }
    });
  }
});
