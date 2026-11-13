/** Registre des outils principaux : un fichier par outil dans `lib/tools/<kind>.ts` (préfixe « _ » ignoré). */
import type { ToolSpec } from './tool-types';
export type Lang = 'it' | 'en';
type Factory = (l: Lang, opts?: Record<string, unknown>) => ToolSpec;
const mods = import.meta.glob<{ default: Factory }>(['./tools/*.ts', '!./tools/_*.ts'], { eager: true });
export const TOOLS: Record<string, Factory> = Object.fromEntries(Object.entries(mods).map(([f, m]) => [f.split('/').pop()!.replace(/\.ts$/, ''), m.default]));
export function getTool(kind: string, lang: string, opts?: Record<string, unknown>): ToolSpec {
  const f = TOOLS[kind];
  if (!f) throw new Error(`Outil inconnu : ${kind} (créer src/lib/tools/${kind}.ts)`);
  return f(lang === 'en' ? 'en' : 'it', opts);
}
