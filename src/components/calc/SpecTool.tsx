/**
 * Outil principal d'une page : champs à gauche, carte du résultat à droite (kit.Shell, data-resultat).
 * Premier rendu = valeurs par défaut du build ; un lien partagé est lu après le montage (RECETTE §17.5) ;
 * l'adresse ne change qu'après une action du lecteur (url-state.updateURL). Tant que rien n'est modifié,
 * le résultat porte la mention d'exemple (MentionExemple). Rien ne quitte le navigateur.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import MentionExemple from './MentionExemple';
import { Shell, Head, Rows, Note, MethodLink } from './kit';
import { getTool } from '../../lib/tool-specs';
import { readParams, updateURL } from '../../lib/url-state';
import { deuxPoints, exempleSuppose, libellesTrame } from '../../lib/libelles-trame';
import { valeurAffichee } from './MiniSim';
import type { ToolInput } from '../../lib/tool-types';

interface Props { kind: string; lang: 'it' | 'en'; id: string; opts?: Record<string, unknown>; methodHref?: string }

function downloadIcs(events: Array<{ date: string; summary: string }>, filename: string) {
  const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,');
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  const next = (iso: string) => { const d = new Date(`${iso}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + 1); return d.toISOString().slice(0, 10).replace(/-/g, ''); };
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Radif Partners//BTP Netto//IT', 'CALSCALE:GREGORIAN'];
  events.forEach((e, i) => lines.push('BEGIN:VEVENT', `UID:${e.date}-${i}-btpnetto`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${e.date.replace(/-/g, '')}`, `DTEND;VALUE=DATE:${next(e.date)}`, `SUMMARY:${esc(e.summary)}`,
    'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${esc(e.summary)}`, 'TRIGGER:-P7D', 'END:VALARM', 'END:VEVENT'));
  lines.push('END:VCALENDAR');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' }));
  a.download = filename;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 0);
}

export default function SpecTool({ kind, lang, id, opts, methodHref }: Props) {
  const spec = useMemo(() => getTool(kind, lang, opts), [kind, lang, opts]);
  const defaults = useMemo(() => Object.fromEntries(spec.inputs.map((i) => [i.id, i.def])) as Record<string, number>, [spec]);
  const [v, setV] = useState<Record<string, number>>(defaults);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const u = readParams(window.location.search);
    const next = { ...defaults }; const t: Record<string, boolean> = {};
    for (const i of spec.inputs) {
      const x = u.get(i.id); if (x === null) continue;
      const f = parseFloat(x); if (isNaN(f)) continue;
      if (i.options && !i.options.some((o) => o.value === String(f))) continue;
      next[i.id] = Math.min(f, i.max ?? Infinity); t[i.id] = true;
    }
    if (Object.keys(t).length) { setV(next); setTouched(t); }
  }, []);
  useEffect(() => { updateURL(v); }, [v]);
  const out = useMemo(() => spec.run(v, touched), [v, touched, spec]);
  const set = (k: string) => (x: number) => { setV((o) => ({ ...o, [k]: x })); setTouched((o) => (o[k] ? o : { ...o, [k]: true })); };
  const lib = libellesTrame(lang);
  const dp = deuxPoints(lang);
  const fid = (k: string) => `${id}-${k}`;
  const champ = (i: ToolInput) => (i.options
    ? <SelectField key={i.id} id={fid(i.id)} label={i.label} value={String(v[i.id])} onChange={(x) => set(i.id)(Number(x))} options={i.options} help={i.help} />
    : <NumberField key={i.id} id={fid(i.id)} label={i.label} value={v[i.id]} onChange={set(i.id)} unit={i.unit} max={i.max} decimals={i.decimals} help={i.help} />);
  const visibles = spec.inputs.filter((i) => !i.showIf || i.showIf(v));
  const avances = visibles.filter((i) => i.avance);
  const form = (
    <>
      {spec.title && <p className="text-base font-semibold text-navy-900">{spec.title}</p>}
      <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">{visibles.filter((i) => !i.avance).map(champ)}</div>
      {avances.length > 0 && (
        <details data-repli className="rounded-lg border border-navy-200 px-3 py-2">
          <summary className="cursor-pointer text-sm font-medium text-navy-700">{lib.plusDeReglages}
            <span data-actuellement className="mt-1 block text-xs font-normal text-navy-600">
              <span className="block">{lib.actuellement}{dp}</span>
              {avances.map((i) => <span key={i.id} data-suppose className="block pl-2">{i.label}{dp} <span className="font-semibold text-navy-900">{valeurAffichee(i, v[i.id])}</span></span>)}
            </span></summary>
          <div className="mt-3 grid gap-x-4 gap-y-4 sm:grid-cols-2">{avances.map(champ)}</div>
        </details>
      )}
    </>
  );
  const result = (
    <>
      <MentionExemple lang={lang} touched={touched} modifiables={visibles.length} suppose={exempleSuppose(spec.exemple, v)} />
      <Head label={out.head[0]} value={out.head[1]} sub={out.sub} />
      {out.alert && <p data-alerte role="note" className="mt-2 border-l-4 border-amber-500 pl-2 text-sm font-semibold text-navy-900">{out.alert}</p>}
      <Rows rows={out.rows} />
      {out.note && <Note>{out.note}</Note>}
      {out.ics && out.ics.length > 0 && (
        <button type="button" onClick={() => downloadIcs(out.ics!, lang === 'en' ? 'btp-coupon-dates.ics' : 'scadenze-btp.ics')}
          className="mt-3 inline-flex h-11 items-center rounded-lg border border-navy-300 bg-white px-4 text-sm font-semibold text-navy-800 hover:bg-navy-50">
          {lang === 'en' ? 'Add these dates to my calendar (.ics)' : 'Aggiungi queste date al calendario (.ics)'}
        </button>
      )}
      <MethodLink href={methodHref} lang={lang} />
    </>
  );
  const below = out.table ? (
    <div className="mt-5 overflow-x-auto">
      <table className="w-full text-sm">
        {out.table.caption && <caption className="mb-2 text-left text-sm text-navy-700">{out.table.caption}</caption>}
        <thead><tr>{out.table.headers.map((h, k) => <th key={h} scope="col" className={`border-b border-navy-300 px-2 py-1.5 font-semibold text-navy-900 ${out.table!.align?.[k] === 'r' ? 'text-right' : 'text-left'}`}>{h}</th>)}</tr></thead>
        <tbody>{out.table.rows.map((r, n) => <tr key={n}>{r.map((c, k) => <td key={k} className={`tabular-nums border-b border-navy-100 px-2 py-1.5 text-navy-800 ${out.table!.align?.[k] === 'r' ? 'text-right' : 'text-left'}`}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  ) : undefined;
  return <Shell id={id} form={form} result={result} below={below} />;
}
