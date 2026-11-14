/** Un montant, une durée : BTP de l'adjudication la plus proche, BOT à 12 mois, Buono, dépôt — nets d'impôt et de timbre. */
import { T, eur, pct, data, type L } from '../minis/_kit';
import { formatDecimal } from '../format';
import { confronto, tassoDeposito, tassoBuono, buonoById } from '../engine/index';
import { nomeBase, traQuanto } from '../nomi';
import { P } from '../engine/params';
import type { ToolSpec } from '../tool-types';
import { ANNI, importo } from './_opz';
const mese = (ym: string, l: L) => new Date(`${ym}-01T00:00:00Z`).toLocaleDateString(l === 'en' ? 'en-GB' : 'it-IT', { month: 'long', year: 'numeric', timeZone: 'UTC' });
type Opts = { importo?: number; anni?: number; solo?: string[]; tassoVisibile?: boolean };
export default (l: L, o: Opts = {}): ToolSpec => ({
  exemple: T(l, `Esempio: ${eur(o.importo ?? 10000, l)} per ${o.anni ?? 5} anni`, `Example: ${eur(o.importo ?? 10000, l)} for ${o.anni ?? 5} years`),
  inputs: [
    importo(l, o.importo ?? 10000),
    { id: 'anni', label: T(l, 'Per quanto tempo', 'For how long'), def: o.anni ?? 5, options: ANNI(l) },
    ...(o.solo && !o.solo.includes('deposito') ? [] : [{ id: 'tasso', label: T(l, 'Tasso del conto deposito prima delle tasse (%)', 'Deposit account rate before tax (%)'), def: P.deposito.oltre_2_anni, max: 10, decimals: 2,
      help: T(l, `Media della Banca centrale europea (BCE) per i depositi vincolati in Italia, ${mese(P.deposito.mese, l)}: ${formatDecimal(P.deposito.entro_1_anno, 2, l)}% fino a 1 anno, ${formatDecimal(P.deposito.oltre_2_anni, 2, l)}% oltre 2 anni. Scrivi quello della tua banca.`, `European Central Bank (ECB) average for Italian fixed-term deposits, ${mese(P.deposito.mese, l)}: ${formatDecimal(P.deposito.entro_1_anno, 2, l)}% up to 1 year, ${formatDecimal(P.deposito.oltre_2_anni, 2, l)}% over 2 years. Type your bank’s rate.`),
      avance: !o.tassoVisibile }]),
  ],
  run: (v) => {
    const anni = Math.max(1, Math.round(v.anni));
    const righe = confronto(v.importo, anni, v.tasso || tassoDeposito(anni)).filter((r) => !o.solo || o.solo.includes(r.id));
    // « Buono Ordinario » se lisait comme le BOT (Buono Ordinario del Tesoro) : le nom dit « postale » et « Poste »
    // (testeurs naïfs du 2026-11-14, 2e tour). La cedola est expliquée à sa première apparition, dans le titre du résultat.
    const nome = (r: (typeof righe)[number], primo = false) => {
      if (r.id === 'deposito') return T(l, `Conto deposito al ${formatDecimal(v.tasso, 2, l)}%`, `Deposit account at ${formatDecimal(v.tasso, 2, l)}%`);
      if (r.id === 'buono') { const n = r.nome.replace(/^Buono /, ''); return T(l, `Buono fruttifero postale ${n} (Poste)`, `Postal savings bond ${n} (Poste)`); }
      const n = r.titolo ? nomeBase(r.titolo, l) : r.nome;
      const c = r.cedola != null ? T(l, `, cedola ${formatDecimal(r.cedola, 2, l)}%${primo ? ' (l’interesse all’anno, pagato ogni sei mesi)' : ''}`, `, ${formatDecimal(r.cedola, 2, l)}% coupon${primo ? ' (the yearly interest, paid every six months)' : ''}`) : '';
      return r.scadenza ? `${n}${c}, ${T(l, 'scade il', 'matures')} ${data(r.scadenza, l)}${r.titolo ? traQuanto(r.titolo, l) : ''}` : n;
    };
    const fonte = (r: (typeof righe)[number]) => r.id === 'deposito' ? T(l, `media BCE di ${mese(r.fonte, l)}`, `ECB average, ${mese(r.fonte, l)}`)
      : r.id === 'buono' ? T(l, `tassi Poste in vigore dal ${data(r.fonte, l)}`, `Poste rates in force since ${data(r.fonte, l)}`)
      : T(l, `prezzo dell’ultima asta di questo titolo, il ${data(r.fonte, l)}`, `price at this bond’s latest auction, ${data(r.fonte, l)}`);
    const best = [...righe].sort((a, b) => b.netti - a.netti)[0];
    const ord = righe.find((r) => r.id === 'buono' && r.nome === 'Buono Ordinario');
    const senzaBot = anni > 1 && (!o.solo || o.solo.includes('bot'));
    const minori = buonoById('minori');
    const tOrd = (n: number) => formatDecimal(tassoBuono('ordinario', n), 2, l);
    const notaBuono = ord ? T(l, `Il Buono fruttifero postale Ordinario rende poco se lo tieni pochi anni: il suo tasso prima delle tasse è ${tOrd(1)}% all’anno fino a 4 anni e sale con gli anni, fino al ${tOrd(20)}% a 20 anni. Altri Buoni pagano di più, ma con vincoli: il 4 anni Plus ${formatDecimal(tassoBuono('4plus', 4), 2, l)}% se lo tieni 4 anni, il Buono dedicato ai Minori ${formatDecimal(minori.tasso_unico as number, 2, l)}% fino ai 18 anni del bambino. `, `The Buono Ordinario postal bond pays little if held only a few years: its rate before tax is ${tOrd(1)}% a year up to 4 years and rises with time, to ${tOrd(20)}% at 20 years. Other postal bonds pay more, with strings attached: the 4 anni Plus ${formatDecimal(tassoBuono('4plus', 4), 2, l)}% if held 4 years, the bond for minors ${formatDecimal(minori.tasso_unico as number, 2, l)}% until the child turns 18. `) : '';
    const notaBot = senzaBot ? T(l, 'Il BOT non compare: dura al massimo 12 mesi. ', 'BOT is not listed: it lasts 12 months at most. ') : '';
    return {
      head: [T(l, `Il guadagno netto più alto: ${nome(best, true)}`, `The highest net gain: ${nome(best, true)}`), eur(best.netti, l)],
      sub: T(l, `guadagnati in ${anni} ${anni > 1 ? 'anni' : 'anno'} su ${eur(v.importo, l)}, dopo la tassa e il bollo (l’imposta dello 0,20% all’anno sul valore): ${pct(best.rendNetto, l, 2)} netto all’anno`, `earned over ${anni} year${anni > 1 ? 's' : ''} on ${eur(v.importo, l)}, after tax and stamp duty (the 0.20% yearly levy on the value): ${pct(best.rendNetto, l, 2)} net a year`),
      rows: righe.map((r) => [nome(r), `${eur(r.netti, l)} · ${pct(r.rendNetto, l, 2)}`] as [string, string]),
      note: notaBot + notaBuono + T(l, 'Calcolo, non consiglio: rischio, possibilità di vendere prima e situazione fiscale personale cambiano la scelta. BTP al prezzo dell’asta, comprato oggi e tenuto fino alla scadenza.', 'A calculation, not advice: risk, the option to sell early and your own tax position change the choice. BTP at the auction price, bought today and held to maturity.'),
      table: {
        caption: T(l, 'Dettaglio: tasse e bollo già tolti', 'Detail: tax and stamp duty already taken off'),
        headers: T(l, ['Strumento', 'Interessi netti', 'Tasse', 'Bollo', 'Dato usato'], ['Product', 'Net interest', 'Tax', 'Stamp duty', 'Figure used']),
        align: ['l', 'r', 'r', 'r', 'l'],
        rows: righe.map((r) => [nome(r), eur(r.netti, l), eur(r.tassa, l), eur(r.bollo, l), fonte(r)]),
      },
    };
  },
});
