/**
 * Une page = UN fichier de données dans `src/content/pagine/`. Il porte les deux langues (it, en), le
 * texte, la FAQ, les sources, l'outil, le mini-simulateur et les liens ; le cœur du site (routes, menus,
 * pied de page, sitemap, hreflang, schémas, maillage) le lit seul.
 */
import type { SourceKey, Params } from './engine/params';

export type Lang = 'it' | 'en';
export type Group = 'titoli' | 'buoni' | 'retail' | 'confronti';
/** Outil principal : nom d'un fichier de `src/lib/tools/` (btp, bot, buono, confronto…). */
export type Tool = string;
export interface FAQ { q: string; a: string }

export interface Helpers {
  lang: Lang;
  a: (id: string, text: string) => string;
  eur: (n: number, decimals?: number) => string;
  num: (n: number, decimals?: number) => string;
  pct: (x: number, decimals?: number) => string;
  date: (iso: string) => string;
  table: (headers: string[], rows: Array<Array<string | number>>, caption?: string, align?: Array<'l' | 'r'>) => string;
  src: (key: SourceKey, text?: string) => string;
  P: Params;
  M: typeof import('./engine/index');
  /** Jour de référence du build (heure de Rome). */
  today: string;
}

export interface PageText {
  slug: string;
  nav: string;
  card: string;
  /** 50 à 60 caractères, terme-clé en tête (RECETTE §11). */
  title: string;
  /** 150 à 160 caractères. */
  description: string;
  h1: string;
  intro: string;
  /** Bloc citable : UN paragraphe d'au moins 120 mots (RECETTE §21). */
  resume: (h: Helpers) => string;
  faqs: (h: Helpers) => FAQ[];
  body: (h: Helpers) => string;
}

export interface PageDef {
  id: string;
  group: Group;
  order: number;
  mini?: string;
  miniHref?: string;
  tool?: Tool;
  outil?: Record<string, unknown>;
  related: string[];
  sources: SourceKey[];
  it: PageText;
  en: PageText;
}
export const defineGuide = (g: PageDef): PageDef => g;
