// Des lignes de FEC vers des etats financiers.
//
// Un FEC ne contient aucun etat : il contient des ecritures. Tout ce qui suit est
// reconstruit a partir du seul numero de compte, en s'appuyant sur la logique du plan
// comptable general : la premiere classe dit la nature, les suivantes le detail.
//
//   1 capitaux    2 immobilisations   3 stocks   4 tiers   5 financier
//   6 charges     7 produits          8 speciaux
//
// Aucune de ces fonctions n'appelle le reseau. Tout se calcule chez l'utilisateur.

const r2 = x => Math.round(x * 100) / 100;
const cls = num => String(num).charAt(0);

/** Vrai pour un compte d'amortissement ou de depreciation : 28x, 29x, 39x, 49x, 59x. */
const isContra = num => /^(28|29|39|49|59)/.test(num);

/** La balance generale : un solde par compte. */
export function trialBalance(accounts) {
  const rows = accounts.map(a => ({
    num: a.num, label: a.label, debit: a.debit, credit: a.credit,
    balance: r2(a.debit - a.credit),
    side: a.debit - a.credit >= 0 ? "debit" : "credit",
  }));
  return {
    rows,
    debit: r2(rows.reduce((s, r) => s + r.debit, 0)),
    credit: r2(rows.reduce((s, r) => s + r.credit, 0)),
  };
}

/**
 * Le compte de resultat, par nature.
 * Charges au debit (classe 6), produits au credit (classe 7). Les comptes 603 et 713
 * sont des variations de stock : leur solde peut aller dans les deux sens, c'est normal.
 */
export function incomeStatement(accounts) {
  const pick = (prefixes) => accounts
    .filter(a => prefixes.some(p => a.num.startsWith(p)))
    .map(a => ({ num: a.num, label: a.label, amount: r2(a.debit - a.credit) }));

  const sum = rows => r2(rows.reduce((s, r) => s + r.amount, 0));

  const charges = {
    achats: pick(["60"]),
    external: pick(["61", "62"]),
    taxes: pick(["63"]),
    personnel: pick(["64"]),
    autres: pick(["65"]),
    amortissements: pick(["68"]),
  };
  const produits = {
    ventes: pick(["70"]),
    production: pick(["71", "72"]),
    subventions: pick(["74"]),
    autres: pick(["75", "78", "79"]),
  };
  const financier = { charges: pick(["66"]), produits: pick(["76"]) };
  const exceptionnel = { charges: pick(["67"]), produits: pick(["77"]) };
  const impots = pick(["69"]);

  // un produit a un solde crediteur, donc debit - credit est negatif : on le retourne
  const flip = rows => rows.map(r => ({ ...r, amount: r2(-r.amount) }));

  const chargesExploitation = sum(Object.values(charges).flat());
  const produitsExploitation = sum(flip(Object.values(produits).flat()));
  const resultatExploitation = r2(produitsExploitation - chargesExploitation);
  const resultatFinancier = r2(sum(flip(financier.produits)) - sum(financier.charges));
  const resultatExceptionnel = r2(sum(flip(exceptionnel.produits)) - sum(exceptionnel.charges));
  const impotsTotal = sum(impots);

  return {
    charges: Object.fromEntries(Object.entries(charges)
      .map(([k, v]) => [k, { rows: v, total: sum(v) }])),
    produits: Object.fromEntries(Object.entries(produits)
      .map(([k, v]) => [k, { rows: flip(v), total: sum(flip(v)) }])),
    chargesExploitation, produitsExploitation, resultatExploitation,
    resultatFinancier, resultatExceptionnel, impots: impotsTotal,
    resultat: r2(resultatExploitation + resultatFinancier + resultatExceptionnel - impotsTotal),
  };
}

/**
 * Le bilan.
 *
 * Un poste par nature, et jamais deux classes melangees. La premiere version rangeait
 * les classes 4 et 5 ensemble : la banque devenait une creance client, et se retrouvait
 * comptee une seconde fois en tresorerie. Le total du bilan tombait juste malgre tout,
 * parce que les deux erreurs se compensaient. C'est exactement ce qu'un controle par
 * totaux ne voit pas, et ce qu'un controle poste par poste attrape.
 *
 * Le resultat de l'exercice n'est pas dans le FEC tant que la cloture n'est pas passee :
 * il est calcule par le compte de resultat et ajoute ici aux capitaux propres.
 */
export function balanceSheet(accounts, resultat) {
  const bal = a => r2(a.debit - a.credit);
  const starts = (a, ...ps) => ps.some(p => a.num.startsWith(p));

  // on separe d'abord les comptes soustractifs, qui vivent au passif par nature
  // mais se presentent en diminution de l'actif
  const contra = accounts.filter(a => isContra(a.num));
  const plain = accounts.filter(a => !isContra(a.num));

  const pickContra = (...ps) => r2(-contra.filter(a => starts(a, ...ps))
    .reduce((s, a) => s + bal(a), 0));

  // ---------------------------------------------------------------- actif
  const immo = plain.filter(a => cls(a.num) === "2");
  const stocks = plain.filter(a => cls(a.num) === "3");
  // clients : 41x, sauf 419 qui porte les avances recues et les avoirs a etablir
  const clients = plain.filter(a => starts(a, "41") && !starts(a, "419") && bal(a) > 0);
  // autres creances : le reste de la classe 4 a solde debiteur, TVA deductible comprise
  const autres = plain.filter(a => cls(a.num) === "4" && !starts(a, "41") && bal(a) > 0);
  const treso = plain.filter(a => cls(a.num) === "5" && bal(a) > 0);

  const total = rows => r2(rows.reduce((s, a) => s + bal(a), 0));
  const row = a => ({ num: a.num, label: a.label, amount: bal(a) });
  const rowC = a => ({ num: a.num, label: a.label, amount: r2(-bal(a)) });

  const immoBrut = total(immo), immoAmort = pickContra("28", "29");
  const stockBrut = total(stocks), stockDep = pickContra("39");
  const clientsBrut = total(clients), clientsDep = pickContra("49");
  const autresTotal = total(autres);
  const tresoTotal = r2(total(treso) - pickContra("59"));

  const immoNet = r2(immoBrut - immoAmort);
  const stockNet = r2(stockBrut - stockDep);
  const clientsNet = r2(clientsBrut - clientsDep);
  const actif = r2(immoNet + stockNet + clientsNet + autresTotal + tresoTotal);

  // ---------------------------------------------------------------- passif
  // la classe 1 n'est pas que des capitaux propres : 16 et 17 sont des dettes financieres
  const propres = plain.filter(a => starts(a, "10", "11", "12", "13", "14", "15"));
  const emprunts = plain.filter(a => starts(a, "16", "17", "18"));
  const fournisseurs = plain.filter(a => starts(a, "40") && bal(a) < 0);
  const fiscalSocial = plain.filter(a => starts(a, "42", "43", "44") && bal(a) < 0);
  const autresDettes = plain.filter(a =>
    ((cls(a.num) === "4" && !starts(a, "40", "42", "43", "44")) || cls(a.num) === "5")
    && bal(a) < 0);

  const propresTotal = r2(-total(propres));
  const empruntsTotal = r2(-total(emprunts));
  const fournisseursTotal = r2(-total(fournisseurs));
  const fiscalTotal = r2(-total(fiscalSocial));
  const autresDettesTotal = r2(-total(autresDettes));
  const dettes = r2(empruntsTotal + fournisseursTotal + fiscalTotal + autresDettesTotal);
  const passif = r2(propresTotal + resultat + dettes);

  return {
    actif: {
      immobilisations: { rows: immo.map(row), brut: immoBrut, amortissements: immoAmort, net: immoNet },
      stocks: { rows: stocks.map(row), brut: stockBrut, depreciations: stockDep, net: stockNet },
      creances: { rows: clients.map(row), brut: clientsBrut, depreciations: clientsDep, net: clientsNet },
      autresCreances: { rows: autres.map(row), total: autresTotal },
      tresorerie: { rows: treso.map(row), total: tresoTotal },
      total: actif,
    },
    passif: {
      capitaux: { rows: propres.map(rowC), total: propresTotal },
      resultat,
      emprunts: { rows: emprunts.map(rowC), total: empruntsTotal },
      fournisseurs: { rows: fournisseurs.map(rowC), total: fournisseursTotal },
      fiscalSocial: { rows: fiscalSocial.map(rowC), total: fiscalTotal },
      autresDettes: { rows: autresDettes.map(rowC), total: autresDettesTotal },
      dettes,
      total: passif,
    },
    ecart: r2(actif - passif),
    equilibre: Math.abs(actif - passif) <= 0.05,
  };
}

/** Les grandes masses, telles qu'on les montrera en clair. */
export function keyFigures(accounts, income, sheet) {
  const sumOf = prefixes => r2(accounts
    .filter(a => prefixes.some(p => a.num.startsWith(p)))
    .reduce((s, a) => s + (a.credit - a.debit), 0));

  const ca = sumOf(["70"]);
  const achats = r2(-sumOf(["60"]));
  const personnel = r2(-sumOf(["64"]));

  return {
    chiffreAffaires: ca,
    resultat: income.resultat,
    tresorerie: sheet.actif.tresorerie.total,
    creances: sheet.actif.creances.net,
    dettes: sheet.passif.fournisseurs.total,
    total: sheet.actif.total,
    margeBrute: r2(ca - achats),
    tauxMarge: ca ? r2((ca - achats) / ca * 100) : 0,
    poidsPersonnel: ca ? r2(personnel / ca * 100) : 0,
    tauxResultat: ca ? r2(income.resultat / ca * 100) : 0,
  };
}

/**
 * Ce qui part au modele de langage : rien que des agregats, aucun nom, aucune ligne.
 * Cette fonction est le contrat de confidentialite du produit, et elle doit rester
 * assez courte pour qu'on puisse l'afficher entierement a l'utilisateur avant l'envoi.
 */
export function anonymousSummary(meta, figures, income, sheet) {
  return {
    periode: { du: meta.from, au: meta.to },
    volume: { ecritures: meta.entries, lignes: meta.lines },
    chiffre_affaires: figures.chiffreAffaires,
    achats: income.charges.achats.total,
    charges_externes: income.charges.external.total,
    personnel: income.charges.personnel.total,
    amortissements: income.charges.amortissements.total,
    resultat_exploitation: income.resultatExploitation,
    resultat_net: income.resultat,
    tresorerie: figures.tresorerie,
    creances_clients: figures.creances,
    dettes_fournisseurs: figures.dettes,
    total_bilan: figures.total,
    taux_de_marge: figures.tauxMarge,
    poids_du_personnel: figures.poidsPersonnel,
  };
}
