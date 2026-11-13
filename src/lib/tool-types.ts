/** Outils principaux des pages (src/lib/tools/<kind>.ts), rendus par components/calc/SpecTool.tsx.
 *  Même forme de champ que les mini-simulateurs (lib/mini-types.ts) : valeurs numériques, options en chaînes de chiffres. */
import type { MiniInput } from './mini-types';
export type ToolInput = MiniInput;
export interface ToolTable { caption?: string; headers: string[]; rows: string[][]; align?: Array<'l' | 'r'> }
export interface ToolOut {
  head: [string, string];
  /** Ce que suppose le chiffre, sous le gros chiffre (« al mese, per 2 figli »). */
  sub?: string;
  alert?: string;
  rows: Array<[string, string] | [string, string, boolean]>;
  note?: string;
  table?: ToolTable;
  /** Échéances à télécharger en .ics (fichier créé dans le navigateur). */
  ics?: Array<{ date: string; summary: string }>;
}
export interface ToolSpec {
  title?: string;
  inputs: ToolInput[];
  exemple?: string | ((v: Record<string, number>) => string);
  run: (v: Record<string, number>, touched: Record<string, boolean>) => ToolOut;
}
