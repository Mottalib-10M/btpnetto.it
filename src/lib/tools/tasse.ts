/** 12,5 % contre 26 % et timbre : ce que coûte la fiscalité sur un intérêt brut donné. */
import { T, eur, eur2, type L } from '../minis/_kit';
import { netto } from '../engine/index';
import { P } from '../engine/params';
import type { ToolSpec } from '../tool-types';
export default (l: L): ToolSpec => ({
  exemple: T(l, 'Esempio: 400 € di interessi lordi all’anno su 10.000 €', 'Example: €400 gross interest a year on €10,000'),
  inputs: [
    { id: 'lordo', label: T(l, 'Interessi lordi dell’anno', 'Gross interest for the year'), def: 400, unit: '€', max: 1000000 },
    { id: 'capitale', label: T(l, 'Valore dei titoli o del deposito (per il bollo)', 'Value of the bonds or deposit (for stamp duty)'), def: 10000, unit: '€', max: 10000000 },
    { id: 'buoni', label: T(l, 'Sono Buoni postali per non più di 5.000 € in tutto?', 'Postal bonds worth €5,000 or less in total?'), def: 0, options: [{ value: '0', label: 'No' }, { value: '1', label: T(l, 'Sì', 'Yes') }], avance: true },
  ],
  run: (v) => {
    const n = netto(v.lordo);
    const bollo = v.buoni === 1 && v.capitale <= P.fisco.bollo_buoni_franchigia ? 0 : v.capitale * P.fisco.bollo;
    return {
      head: [T(l, 'Netto con la tassa dei titoli di Stato (12,5%)', 'Net with the government-bond rate (12.5%)'), eur2(n.titoli - bollo, l)],
      sub: T(l, `Con il 26% di depositi e conti: ${eur2(n.altri - bollo, l)} · differenza ${eur2(n.differenza, l)}`, `With the 26% rate on deposits and accounts: ${eur2(n.altri - bollo, l)} · difference ${eur2(n.differenza, l)}`),
      rows: [
        [T(l, 'Tassa al 12,5%', 'Tax at 12.5%'), eur2(v.lordo - n.titoli, l)],
        [T(l, 'Tassa al 26%', 'Tax at 26%'), eur2(v.lordo - n.altri, l)],
        [T(l, 'Bollo 0,20% dell’anno', 'Stamp duty, 0.20% for the year'), eur2(bollo, l)],
        [T(l, 'Interessi lordi equivalenti al 26% per avere lo stesso netto', 'Gross interest needed at 26% for the same net'), eur(n.titoli / (1 - P.fisco.altri), l)],
      ],
    };
  },
});
