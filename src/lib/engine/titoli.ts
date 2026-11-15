/**
 * Moteur de btpnetto.it : fonctions pures, sans état, qui reçoivent les paramètres en argument.
 * Fiscalité italienne lue sur les textes (params-2026.json → fisco) :
 *  - intérêts, primes d'émission et plus-values des titres de l'État et des Buoni : 12,5 % (D.Lgs. 239/1996, DL 66/2014 art. 3) ;
 *  - intérêts des dépôts bancaires et du livret postal : 26 % ;
 *  - droit de timbre sur les produits financiers : 0,20 % par an (DPR 642/1972, tarif art. 13) ; Buoni exonérés
 *    quand leur valeur totale ne dépasse pas 5 000 €.
 * Conventions : jours exacts sur 365 (ACT/365) ; coupons des BTP semestriels, aux jour et mois de l'échéance ;
 * le timbre est estimé chaque année sur la valeur investie, au prorata du temps (la banque l'applique sur la
 * valeur de marché au relevé : écart de quelques euros).
 */
export interface Fisco { titoli_stato: number; altri: number; bollo: number; bollo_buoni_franchigia: number }

const DAY = 86_400_000;
export const ts = (iso: string) => Date.parse(`${iso}T00:00:00Z`);
export const iso = (t: number) => new Date(t).toISOString().slice(0, 10);
export const giorniTra = (a: string, b: string) => Math.round((ts(b) - ts(a)) / DAY);
export const anniTra = (a: string, b: string) => giorniTra(a, b) / 365;
export function addMonths(d: string, m: number): string {
  const [y, mo, da] = d.split('-').map(Number);
  const tot = y * 12 + (mo - 1) + m;
  const ny = Math.floor(tot / 12), nm = tot % 12;
  const last = new Date(Date.UTC(ny, nm + 1, 0)).getUTCDate();
  return iso(Date.UTC(ny, nm, Math.min(da, last)));
}

/** Taux de rendement interne annuel (capitalisation annuelle, temps en années), par dichotomie. */
export function irr(flows: Array<[number, number]>): number {
  const npv = (r: number) => flows.reduce((s, [t, c]) => s + c / Math.pow(1 + r, t), 0);
  let lo = -0.9, hi = 1;
  if (npv(lo) * npv(hi) > 0) return NaN;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (npv(lo) * npv(mid) <= 0) hi = mid; else lo = mid;
  }
  return (lo + hi) / 2;
}

/**
 * « Netto all'anno » du site : UNE seule définition pour toutes les pages (testeurs naïfs du 2026-11-14, 5e tour :
 * « 1713 € … 3,31% » à l'accueil contre « 1707 € … 3,41% » au BTP Valore, plus d'euros mais un pourcentage plus bas,
 * parce que le BTP et les Buoni prenaient un taux composé et le Valore une moyenne simple, sur des durées différentes).
 * Gain ÷ somme payée ÷ années : rapporté à 10 000 € et à un an, plus d'euros par an = pourcentage plus haut, partout.
 */
export const mediaAnnua = (guadagno: number, spesa: number, anni: number) => (anni > 0 && spesa > 0 ? guadagno / spesa / anni : 0);

/** Timbre de 0,20 % par an sur `base`, à chaque anniversaire puis au prorata la dernière année. */
function bolloFlows(base: number, anni: number, rate: number): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  for (let y = 1; y <= Math.floor(anni + 1e-9); y++) out.push([y, -base * rate]);
  const rest = anni - Math.floor(anni + 1e-9);
  if (rest > 1e-6) out.push([anni, -base * rate * rest]);
  return out;
}

// ─── BTP (coupon fixe) ──────────────────────────────────────────────────────────────────────────────
export interface BtpIn { nominale: number; prezzo: number; cedola: number; scadenza: string; oggi: string }
export interface BtpOut {
  anni: number; nCedole: number; prossimaCedola: string; rateo: number; costo: number; costoNetto: number;
  cedoleLorde: number; cedoleNette: number; tassaCedole: number; scarto: number; tassaScarto: number; bollo: number;
  rimborso: number; guadagnoLordo: number; guadagnoNetto: number; irrLordo: number; irrNetto: number; nettoScadenza: number;
  /** Moyennes annuelles du site (`mediaAnnua`) ; les TRI restent pour le contrôle face au Tesoro. */
  rendLordo: number; rendNetto: number;
}
export function btp(f: Fisco, i: BtpIn): BtpOut {
  const anni = Math.max(0, anniTra(i.oggi, i.scadenza));
  const date: string[] = [];
  let k = 0, d = i.scadenza;
  while (ts(d) > ts(i.oggi)) { date.push(d); k++; d = addMonths(i.scadenza, -6 * k); }
  date.reverse();
  const prev = d; // dernière échéance de coupon ≤ aujourd'hui
  const next = date[0] ?? i.scadenza;
  const semi = i.cedola / 2;
  const quota = Math.max(0, Math.min(1, giorniTra(prev, i.oggi) / Math.max(1, giorniTra(prev, next))));
  const rateo = i.nominale * semi / 100 * quota;
  const tax = f.titoli_stato;
  const costo = i.nominale * i.prezzo / 100 + rateo;
  const costoNetto = i.nominale * i.prezzo / 100 + rateo * (1 - tax);
  const c = i.nominale * semi / 100;
  const scarto = Math.max(0, i.nominale - i.nominale * i.prezzo / 100);
  const tassaScarto = scarto * tax;
  const base = i.nominale * i.prezzo / 100;
  const bollo = bolloFlows(base, anni, f.bollo);
  const lordi: Array<[number, number]> = [[0, -costo], ...date.map((x) => [anniTra(i.oggi, x), c] as [number, number])];
  lordi.push([anni, i.nominale]);
  const netti: Array<[number, number]> = [[0, -costoNetto], ...date.map((x) => [anniTra(i.oggi, x), c * (1 - tax)] as [number, number]), [anni, i.nominale - tassaScarto], ...bollo];
  const cedoleLorde = c * date.length;
  const cedoleNette = cedoleLorde * (1 - tax);
  const bolloTot = -bollo.reduce((s, [, v]) => s + v, 0);
  const nettoScadenza = cedoleNette + i.nominale - tassaScarto - bolloTot;
  return {
    anni, nCedole: date.length, prossimaCedola: next, rateo, costo, costoNetto,
    cedoleLorde, cedoleNette, tassaCedole: cedoleLorde * tax, scarto, tassaScarto, bollo: bolloTot,
    rimborso: i.nominale, guadagnoLordo: cedoleLorde + i.nominale - costo, guadagnoNetto: nettoScadenza - costoNetto,
    irrLordo: irr(lordi), irrNetto: irr(netti), nettoScadenza,
    rendLordo: mediaAnnua(cedoleLorde + i.nominale - costo, costo, anni), rendNetto: mediaAnnua(nettoScadenza - costoNetto, costoNetto, anni),
  };
}

// ─── BOT (zéro coupon) ──────────────────────────────────────────────────────────────────────────────
export interface BotIn { nominale: number; prezzo: number; scadenza: string; oggi: string }
export interface BotOut { giorni: number; costo: number; scarto: number; tassa: number; bollo: number; netto: number; rendLordo360: number; rendLordo: number; rendNetto: number }
export function bot(f: Fisco, i: BotIn): BotOut {
  const giorni = Math.max(1, giorniTra(i.oggi, i.scadenza));
  const costo = i.nominale * i.prezzo / 100;
  const scarto = i.nominale - costo;
  const tassa = Math.max(0, scarto) * f.titoli_stato;
  const bollo = costo * f.bollo * giorni / 365;
  const netto = scarto - tassa - bollo;
  return { giorni, costo, scarto, tassa, bollo, netto, rendLordo360: (100 - i.prezzo) / i.prezzo * 360 / giorni, rendLordo: mediaAnnua(scarto, costo, giorni / 365), rendNetto: mediaAnnua(netto, costo, giorni / 365) };
}

// ─── Buoni fruttiferi postali ────────────────────────────────────────────────────────────────────────
export interface BuonoDef { id: string; anni: number; tassi?: number[][]; tasso_unico?: number; min_periodo_mesi?: number; tasso_premiale?: number }
/** Taux effectif annuel brut pour une détention de `anni` années, 0 si aucun intérêt n'est dû. */
export function tassoBuono(b: BuonoDef, anni: number, premiale = false): number {
  if (b.tasso_unico !== undefined) return anni * 12 >= (b.min_periodo_mesi ?? 0) ? b.tasso_unico : 0;
  const t = b.tassi ?? [];
  const pieni = Math.floor(anni + 1e-9);
  if (b.id !== 'ordinario') return pieni >= b.anni ? (premiale && b.tasso_premiale ? b.tasso_premiale : t[t.length - 1][1]) : 0;
  const row = t.filter(([y]) => y <= Math.min(pieni, b.anni)).pop();
  return row ? row[1] : 0;
}
export interface BuonoOut { anni: number; tasso: number; valoreLordo: number; interessi: number; tassa: number; bollo: number; netto: number; rendLordo: number; rendNetto: number; esenteBollo: boolean }
export function buono(f: Fisco, b: BuonoDef, nominale: number, anni: number, totaleBuoni = nominale, premiale = false): BuonoOut {
  const durata = Math.min(anni, b.anni);
  const tasso = tassoBuono(b, durata, premiale);
  // L'Ordinario et le Buono Minori composent sur les années pleines ; les buoni à 4 ans ne versent qu'à l'échéance.
  const tempo = b.id === 'ordinario' ? Math.floor(durata + 1e-9) : durata;
  const valoreLordo = nominale * Math.pow(1 + tasso / 100, tempo);
  const interessi = valoreLordo - nominale;
  const tassa = interessi * f.titoli_stato;
  const esenteBollo = totaleBuoni <= f.bollo_buoni_franchigia;
  let bollo = 0;
  if (!esenteBollo) for (let y = 1; y <= Math.ceil(durata - 1e-9); y++) bollo += nominale * Math.pow(1 + tasso / 100, Math.min(y, tempo)) * f.bollo * Math.min(1, durata - (y - 1));
  const netto = valoreLordo - tassa - bollo;
  return { anni: durata, tasso, valoreLordo, interessi, tassa, bollo, netto, rendLordo: mediaAnnua(interessi, nominale, durata), rendNetto: mediaAnnua(netto - nominale, nominale, durata), esenteBollo };
}

// ─── Conto deposito (intérêts simples, non réinvestis) ──────────────────────────────────────────────
export interface DepositoOut { lordi: number; tassa: number; bollo: number; netti: number; finale: number; rendNetto: number }
export function deposito(f: Fisco, nominale: number, tassoLordo: number, anni: number): DepositoOut {
  const lordi = nominale * tassoLordo / 100 * anni;
  const tassa = lordi * f.altri;
  const bollo = nominale * f.bollo * anni;
  const netti = lordi - tassa - bollo;
  return { lordi, tassa, bollo, netti, finale: nominale + netti, rendNetto: mediaAnnua(netti, nominale, anni) };
}

// ─── BTP Valore (step-up, émis à 100) ───────────────────────────────────────────────────────────────
export interface ValoreOut { anni: number; cedoleLorde: number; premio: number; tassa: number; bollo: number; netti: number; rendNetto: number }
export function valore(f: Fisco, tassi: number[][], nominale: number, anni: number, premioPct = 0): ValoreOut {
  const durata = tassi.length;
  const h = Math.max(0, Math.min(durata, Math.floor(anni + 1e-9)));
  const cedoleLorde = tassi.filter(([y]) => y <= h).reduce((s, [, t]) => s + nominale * t / 100, 0);
  const premio = h === durata ? nominale * premioPct / 100 : 0;
  const tassa = (cedoleLorde + premio) * f.titoli_stato;
  const bollo = nominale * f.bollo * h;
  const netti = cedoleLorde + premio - tassa - bollo;
  return { anni: h, cedoleLorde, premio, tassa, bollo, netti, rendNetto: mediaAnnua(netti, nominale, h) };
}
/** BTP Valore Insieme : un seul coupon à l'échéance. */
export function insieme(f: Fisco, cedolaUnica: number, nominale: number, anni: number) {
  const lordo = nominale * cedolaUnica / 100;
  const tassa = lordo * f.titoli_stato;
  const bollo = nominale * f.bollo * anni;
  const netti = lordo - tassa - bollo;
  return { lordo, tassa, bollo, netti, rendNetto: mediaAnnua(netti, nominale, anni) };
}

// ─── BTP Italia (taux réel + inflation supposée par le lecteur) ──────────────────────────────────────
export function italia(f: Fisco, reale: number, inflazione: number, nominale: number, anni: number) {
  // Approximation annuelle : coupon réel sur le capital réévalué + réévaluation versée chaque semestre.
  const lordoAnno = nominale * ((1 + inflazione / 100) * (1 + reale / 100) - 1);
  const lordi = lordoAnno * anni;
  const tassa = Math.max(0, lordi) * f.titoli_stato;
  const bollo = nominale * f.bollo * anni;
  const netti = lordi - tassa - bollo;
  return { lordoAnno, lordi, tassa, bollo, netti, rendNetto: mediaAnnua(netti, nominale, anni) };
}

/** Impôt et net sur un intérêt brut, aux deux taux. */
export function netto(f: Fisco, lordo: number) {
  return { titoli: lordo * (1 - f.titoli_stato), altri: lordo * (1 - f.altri), differenza: lordo * (f.altri - f.titoli_stato) };
}
