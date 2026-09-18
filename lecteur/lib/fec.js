// Lecture d'un fichier des ecritures comptables (FEC).
//
// Le format est fixe par l'article A47 A-1 du livre des procedures fiscales, mais les
// logiciels du marche en produisent des variantes legales qu'il faut toutes accepter :
//   - separateur tabulation ou barre verticale ;
//   - montants en deux colonnes Debit et Credit, ou en une colonne Montant plus un Sens ;
//   - decimale virgule (francais) ou point ;
//   - encodage UTF-8 ou ISO-8859-15, avec ou sans marque d'ordre des octets.
//
// Ce module ne touche jamais au reseau et ne connait pas le DOM. Il prend du texte,
// il rend des ecritures. Tout le reste se construit dessus.

export const COLUMNS = [
  "JournalCode", "JournalLib", "EcritureNum", "EcritureDate", "CompteNum", "CompteLib",
  "CompAuxNum", "CompAuxLib", "PieceRef", "PieceDate", "EcritureLib", "Debit", "Credit",
  "EcritureLet", "DateLet", "ValidDate", "Montantdevise", "Idevise",
];

// On compare les en-tetes sans casse, sans accent et sans separateur : les editeurs
// ecrivent « Montantdevise », « MontantDevise » ou « Montant_devise » indifferemment.
const key = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9]/gi, "").toLowerCase();

const ALIASES = {
  compaux: "CompAuxNum", compauxnum: "CompAuxNum", compauxlib: "CompAuxLib",
  montant: "Montant", sens: "Sens",
  montantdevise: "Montantdevise", idevise: "Idevise",
};

/** Decode un fichier telecharge, en essayant l'UTF-8 puis l'ISO-8859-15. */
export function decode(buffer) {
  const bytes = new Uint8Array(buffer);
  // marque d'ordre des octets UTF-8
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    return new TextDecoder("utf-8").decode(bytes.subarray(3));
  }
  const utf8 = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  // U+FFFD signale un octet invalide : le fichier n'etait pas de l'UTF-8
  if (!utf8.includes("�")) return utf8;
  return new TextDecoder("iso-8859-15").decode(bytes);
}

/** "1 234,56" ou "1234.56" ou "" vers un nombre. Jamais NaN : zero par defaut. */
export function amount(raw) {
  if (raw == null) return 0;
  const s = String(raw).trim()
    .replace(/ | |\s/g, "")   // espaces de milliers, insecables comprises
    .replace(/\.(?=\d{3}\b)/g, "")      // point de milliers a l'anglaise
    .replace(",", ".");
  if (!s || s === "-") return 0;
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

/** "20260130" vers "2026-01-30". Rend null si la date est absente ou illisible. */
export function isoDate(raw) {
  if (!raw) return null;
  const s = String(raw).trim().replace(/[^0-9]/g, "");
  if (s.length !== 8) return null;
  const y = s.slice(0, 4), m = s.slice(4, 6), d = s.slice(6, 8);
  if (+m < 1 || +m > 12 || +d < 1 || +d > 31) return null;
  return `${y}-${m}-${d}`;
}

const r2 = x => Math.round(x * 100) / 100;

/**
 * Lit un FEC complet.
 * @returns {{lines, entries, journals, accounts, totals, problems, meta}}
 */
export function parseFEC(text) {
  const problems = [];
  const raw = text.replace(/^﻿/, "").split(/\r\n|\n|\r/).filter(l => l.trim() !== "");
  if (!raw.length) throw new Error("Le fichier est vide.");

  // separateur : celui qui decoupe l'en-tete en le plus de morceaux
  const head = raw[0];
  const sep = ["\t", "|", ";"].reduce((best, c) =>
    head.split(c).length > head.split(best).length ? c : best, "\t");
  if (head.split(sep).length < 2) {
    throw new Error("Aucun séparateur reconnu. Un FEC est séparé par des tabulations ou des barres verticales.");
  }

  // carte des colonnes, par nom et non par position
  const cols = {};
  head.split(sep).forEach((h, i) => {
    const k = key(h);
    const name = COLUMNS.find(c => key(c) === k) || ALIASES[k];
    if (name) cols[name] = i;
  });

  const hasPair = "Debit" in cols && "Credit" in cols;
  const hasSens = "Montant" in cols && "Sens" in cols;
  if (!hasPair && !hasSens) {
    throw new Error("Colonnes de montant introuvables : il faut Debit et Credit, ou Montant et Sens.");
  }
  for (const need of ["JournalCode", "EcritureNum", "EcritureDate", "CompteNum"]) {
    if (!(need in cols)) throw new Error(`Colonne obligatoire absente : ${need}.`);
  }

  const at = (parts, name) => (cols[name] === undefined ? "" : (parts[cols[name]] ?? "").trim());

  const lines = [];
  for (let i = 1; i < raw.length; i++) {
    const parts = raw[i].split(sep);
    let debit = 0, credit = 0;
    if (hasPair) {
      debit = amount(at(parts, "Debit"));
      credit = amount(at(parts, "Credit"));
    } else {
      const m = amount(at(parts, "Montant"));
      const sens = at(parts, "Sens").toUpperCase();
      if (sens.startsWith("D")) debit = m;
      else if (sens.startsWith("C")) credit = m;
      else problems.push({ line: i + 1, kind: "sens", detail: `sens illisible : "${sens}"` });
    }
    // un montant negatif au debit est un credit, certains logiciels le font
    if (debit < 0) { credit += -debit; debit = 0; }
    if (credit < 0) { debit += -credit; credit = 0; }

    const account = at(parts, "CompteNum").replace(/\s/g, "");
    if (!account) { problems.push({ line: i + 1, kind: "compte", detail: "numéro de compte vide" }); continue; }

    const date = isoDate(at(parts, "EcritureDate"));
    if (!date) problems.push({ line: i + 1, kind: "date", detail: `date illisible : "${at(parts, "EcritureDate")}"` });

    lines.push({
      journal: at(parts, "JournalCode"),
      journalLabel: at(parts, "JournalLib"),
      number: at(parts, "EcritureNum"),
      date,
      account,
      accountLabel: at(parts, "CompteLib"),
      auxNum: at(parts, "CompAuxNum"),
      auxLabel: at(parts, "CompAuxLib"),
      piece: at(parts, "PieceRef"),
      pieceDate: isoDate(at(parts, "PieceDate")),
      label: at(parts, "EcritureLib"),
      debit: r2(debit),
      credit: r2(credit),
      lettering: at(parts, "EcritureLet"),
      letteredOn: isoDate(at(parts, "DateLet")),
      validated: isoDate(at(parts, "ValidDate")),
      row: i + 1,
    });
  }

  if (!lines.length) throw new Error("Aucune ligne d'écriture lisible dans ce fichier.");

  // regroupement en ecritures, et controle d'equilibre ecriture par ecriture
  const byNumber = new Map();
  for (const l of lines) {
    let e = byNumber.get(l.number);
    if (!e) {
      e = { number: l.number, journal: l.journal, journalLabel: l.journalLabel,
            date: l.date, label: l.label, piece: l.piece, lines: [], debit: 0, credit: 0 };
      byNumber.set(l.number, e);
    }
    e.lines.push(l);
    e.debit = r2(e.debit + l.debit);
    e.credit = r2(e.credit + l.credit);
    if (!e.date && l.date) e.date = l.date;
  }
  const entries = [...byNumber.values()].sort((a, b) =>
    (a.date || "").localeCompare(b.date || "") || a.number.localeCompare(b.number));

  for (const e of entries) {
    if (Math.abs(e.debit - e.credit) > 0.005) {
      problems.push({ kind: "equilibre", entry: e.number,
        detail: `écriture déséquilibrée : ${e.debit.toFixed(2)} au débit contre ${e.credit.toFixed(2)} au crédit` });
    }
  }

  // journaux et comptes rencontres
  const journals = new Map();
  const accounts = new Map();
  let debit = 0, credit = 0;
  for (const l of lines) {
    debit = r2(debit + l.debit);
    credit = r2(credit + l.credit);
    const j = journals.get(l.journal) || { code: l.journal, label: l.journalLabel, entries: new Set(), lines: 0 };
    j.entries.add(l.number); j.lines++; if (!j.label) j.label = l.journalLabel;
    journals.set(l.journal, j);
    const a = accounts.get(l.account) || { num: l.account, label: l.accountLabel, debit: 0, credit: 0, lines: 0 };
    a.debit = r2(a.debit + l.debit); a.credit = r2(a.credit + l.credit); a.lines++;
    if (!a.label && l.accountLabel) a.label = l.accountLabel;
    accounts.set(l.account, a);
  }
  if (Math.abs(debit - credit) > 0.005) {
    problems.push({ kind: "total",
      detail: `le fichier ne s'équilibre pas : ${debit.toFixed(2)} au débit contre ${credit.toFixed(2)} au crédit` });
  }

  const dates = lines.map(l => l.date).filter(Boolean).sort();

  return {
    lines, entries,
    journals: [...journals.values()].map(j => ({ ...j, entries: j.entries.size }))
      .sort((a, b) => a.code.localeCompare(b.code)),
    accounts: [...accounts.values()]
      .map(a => ({ ...a, balance: r2(a.debit - a.credit) }))
      .sort((a, b) => a.num.localeCompare(b.num)),
    totals: { debit, credit, balanced: Math.abs(debit - credit) <= 0.005 },
    problems,
    meta: {
      separator: sep === "\t" ? "tabulation" : sep,
      amounts: hasPair ? "Debit et Credit" : "Montant et Sens",
      lines: lines.length,
      entries: entries.length,
      from: dates[0] || null,
      to: dates[dates.length - 1] || null,
    },
  };
}
