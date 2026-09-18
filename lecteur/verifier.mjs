// Verification du lecteur, par confrontation a une verite connue.
//
// Le generateur de la demonstration produit deux fichiers a partir des memes ecritures :
// un FEC, et un books.json qui contient les etats deja calcules. Si le lecteur, en
// partant du seul FEC, retrouve exactement les etats de books.json, alors il lit juste.
//
// C'est une chance rare : la plupart des lecteurs de fichiers comptables n'ont aucun
// moyen de savoir s'ils se trompent. Ici on a la reponse.
//
//   node lecteur/verifier.mjs

import { readFileSync } from "node:fs";
import { parseFEC, amount, isoDate } from "./lib/fec.js";
import { trialBalance, incomeStatement, balanceSheet, keyFigures, anonymousSummary } from "./lib/comptes.js";

const OK = "  ok   ", KO = "  ECHEC";
let failures = 0;

function check(label, got, want, tol = 0.05) {
  const num = typeof want === "number";
  const pass = num ? Math.abs(got - want) <= tol : got === want;
  if (!pass) failures++;
  const show = v => (typeof v === "number" ? v.toFixed(2).padStart(14) : String(v).padStart(14));
  console.log(`${pass ? OK : KO}  ${label.padEnd(40)} ${show(got)}${pass ? "" : "  attendu " + show(want)}`);
}

// ---------------------------------------------------------------- unites
console.log("\nLecture des montants et des dates");
check("virgule francaise", amount("1234,56"), 1234.56);
check("espace de milliers", amount("1 234,56"), 1234.56);
check("espace fine insecable", amount("1 234,56"), 1234.56);
check("point a l'anglaise", amount("1.234,56"), 1234.56);
check("point decimal", amount("1234.56"), 1234.56);
check("vide", amount(""), 0);
check("negatif", amount("-12,50"), -12.5);
check("date FEC", isoDate("20260130"), "2026-01-30");
check("date absente", isoDate(""), null);
check("date illisible", isoDate("2026-13-99"), null);

// ---------------------------------------------------------------- variantes de format
console.log("\nVariantes de format acceptees");
const pipe = [
  "JournalCode|JournalLib|EcritureNum|EcritureDate|CompteNum|CompteLib|CompAuxNum|CompAuxLib|PieceRef|PieceDate|EcritureLib|Debit|Credit|EcritureLet|DateLet|ValidDate|Montantdevise|Idevise",
  "VE|Ventes|VE001|20260115|411000|Clients|||F1|20260115|Facture|120,00|0,00|||20260115||",
  "VE|Ventes|VE001|20260115|701000|Ventes|||F1|20260115|Facture|0,00|120,00|||20260115||",
].join("\n");
const a = parseFEC(pipe);
check("separateur barre verticale", a.meta.separator, "|");
check("colonnes Debit et Credit", a.meta.amounts, "Debit et Credit");
check("ecriture equilibree", a.problems.length, 0);
check("total debit", a.totals.debit, 120);

const sens = [
  "JournalCode\tJournalLib\tEcritureNum\tEcritureDate\tCompteNum\tCompteLib\tMontant\tSens",
  "VE\tVentes\tVE001\t20260115\t411000\tClients\t120,00\tD",
  "VE\tVentes\tVE001\t20260115\t701000\tVentes\t120,00\tC",
].join("\n");
const b = parseFEC(sens);
check("separateur tabulation", b.meta.separator, "tabulation");
check("colonnes Montant et Sens", b.meta.amounts, "Montant et Sens");
check("equilibre reconstruit", b.totals.balanced, true);

const casse = parseFEC([
  "journalcode|JOURNALLIB|Ecriture_Num|ecrituredate|CompteNum|compteLib|debit|credit",
  "VE|Ventes|VE001|20260115|411000|Clients|120,00|0,00",
  "VE|Ventes|VE001|20260115|701000|Ventes|0,00|120,00",
].join("\n"));
check("en-tetes insensibles a la casse", casse.lines.length, 2);

const desequilibre = parseFEC([
  "JournalCode|JournalLib|EcritureNum|EcritureDate|CompteNum|CompteLib|Debit|Credit",
  "VE|Ventes|VE001|20260115|411000|Clients|120,00|0,00",
  "VE|Ventes|VE001|20260115|701000|Ventes|0,00|100,00",
].join("\n"));
check("desequilibre detecte", desequilibre.problems.some(p => p.kind === "equilibre"), true);

// ---------------------------------------------------------------- le vrai fichier
console.log("\nLecture du FEC complet de la demonstration");
const text = readFileSync(new URL("../public/data/fec-2026.txt", import.meta.url), "utf-8");
const t0 = Date.now();
const fec = parseFEC(text);
const ms = Date.now() - t0;

const books = JSON.parse(readFileSync(new URL("../public/data/books.json", import.meta.url), "utf-8"));

check("lignes lues", fec.meta.lines, books.meta.lines);
check("ecritures reconstituees", fec.meta.entries, books.meta.entries);
check("premiere date", fec.meta.from, books.meta.fiscal_from);
check("derniere date", fec.meta.to, books.meta.closed_to);
check("total debit", fec.totals.debit, books.meta.total_debit);
check("fichier equilibre", fec.totals.balanced, true);
check("aucune anomalie", fec.problems.length, 0);
check("journaux distincts", fec.journals.length, books.journals.length);

// ---------------------------------------------------------------- les etats
console.log("\nEtats reconstruits depuis le seul FEC");
const tb = trialBalance(fec.accounts);
check("balance, total debit", tb.debit, books.meta.total_debit);
check("balance, debit egale credit", r(tb.debit) === r(tb.credit), true);

const income = incomeStatement(fec.accounts);
check("resultat net", income.resultat, books.income_statement.net);
check("resultat d'exploitation", income.resultatExploitation, books.income_statement.op_result);

const sheet = balanceSheet(fec.accounts, income.resultat);
const B = books.balance_sheet;
check("total du bilan", sheet.actif.total, B.total);
check("bilan equilibre", sheet.equilibre, true);
check("ecart actif passif", sheet.ecart, 0);
// poste par poste : un total juste peut cacher deux erreurs qui s'annulent
check("  actif, immobilisations brutes", sheet.actif.immobilisations.brut, B.gross_fixed);
check("  actif, amortissements", sheet.actif.immobilisations.amortissements, B.dep_fixed);
check("  actif, immobilisations nettes", sheet.actif.immobilisations.net, B.net_fixed);
check("  actif, stocks", sheet.actif.stocks.net, B.inventory);
check("  actif, creances clients brutes", sheet.actif.creances.brut, B.receivables_gross);
check("  actif, depreciation clients", sheet.actif.creances.depreciations, B.allowance);
check("  actif, creances clients nettes", sheet.actif.creances.net, B.receivables);
check("  actif, TVA deductible", sheet.actif.autresCreances.total, B.vat_in);
check("  actif, tresorerie", sheet.actif.tresorerie.total, B.cash);
check("  passif, capitaux propres", sheet.passif.capitaux.total,
  r2(B.capital + B.reserve + B.retained));
check("  passif, resultat", sheet.passif.resultat, B.result);
check("  passif, emprunts", sheet.passif.emprunts.total, B.loans);
check("  passif, fournisseurs", sheet.passif.fournisseurs.total, B.payables);
check("  passif, fiscal et social", sheet.passif.fiscalSocial.total,
  r2(B.social_due + B.vat_due + B.wages_due));
check("  passif, total des dettes", sheet.passif.dettes,
  r2(B.loans + B.payables + B.social_due + B.vat_due + B.wages_due));
// et la somme des postes doit refaire le total, sans quoi un poste est compte deux fois
check("somme des postes d'actif", r2(sheet.actif.immobilisations.net + sheet.actif.stocks.net
  + sheet.actif.creances.net + sheet.actif.autresCreances.total + sheet.actif.tresorerie.total),
  sheet.actif.total);
check("somme des postes de passif", r2(sheet.passif.capitaux.total + sheet.passif.resultat
  + sheet.passif.dettes), sheet.passif.total);

const fig = keyFigures(fec.accounts, income, sheet);
check("chiffre d'affaires", fig.chiffreAffaires, books.income_statement.sales);

// ---------------------------------------------------------------- confidentialite
console.log("\nCe qui partirait au modele de langage");
const summary = anonymousSummary(fec.meta, fig, income, sheet);
const json = JSON.stringify(summary);
const noms = fec.accounts.map(a => a.label).filter(Boolean)
  .concat(fec.lines.slice(0, 500).map(l => l.auxLabel).filter(Boolean));
check("aucun libelle de compte", noms.some(n => n.length > 4 && json.includes(n)), false);
check("aucun numero d'ecriture", fec.entries.slice(0, 200).some(e => json.includes(e.number)), false);
check("taille du resume", json.length < 700, true);
console.log("\n" + JSON.stringify(summary, null, 1).split("\n").map(l => "     " + l).join("\n"));

function r(x) { return Math.round(x * 100); }
function r2(x) { return Math.round(x * 100) / 100; }

console.log(`\n${fec.meta.lines.toLocaleString("fr-FR")} lignes lues en ${ms} ms, ` +
  `${fec.meta.entries.toLocaleString("fr-FR")} ecritures, separateur ${fec.meta.separator}.`);
console.log(failures === 0
  ? "\nTout concorde. Le lecteur retrouve, depuis le seul FEC, les etats que le generateur avait calcules.\n"
  : `\n${failures} verification(s) en echec.\n`);
process.exit(failures === 0 ? 0 : 1);
