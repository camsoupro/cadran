// Every string of the interface, in French and in English.
// t("key") returns the current language. Keys are never shown to anyone.

export const STR = {
  // ---------------------------------------------------------------- chrome
  tagline: ["Livre comptable conversationnel", "Conversational ledger"],
  demoFlag: ["Démonstration", "Demonstration"],
  readOnly: ["Lecture seule", "Read only"],
  balanced: ["Toutes les écritures s'équilibrent", "Every entry balances"],
  entriesPosted: ["écritures, aucune modifiée", "entries, none ever edited"],
  linesPosted: ["lignes de compte", "ledger lines"],
  closedTo: ["Arrêté au 30 septembre 2026", "Closed to 30 September 2026"],
  fiscalYear: ["Exercice 2026", "Financial year 2026"],
  standard: ["Plan comptable général, en euros", "French GAAP (PCG), in euros"],
  fictional: ["Société fictive, chiffres générés", "Fictional company, generated figures"],

  navRecord: ["Saisie", "Record"],
  navBooks: ["Livres", "Books"],
  navManagement: ["Gestion", "Management"],
  navStatements: ["États financiers", "Statements"],
  navLearn: ["Comprendre", "Understand"],

  pOverview: ["Vue d'ensemble", "Overview"],
  pRecord: ["Dire ce qui s'est passé", "Tell the books"],
  pTutorial: ["Tutoriel", "Tutorial"],
  pJournal: ["Journal", "Journal"],
  pLedger: ["Grand livre", "General ledger"],
  pTrial: ["Balance", "Trial balance"],
  pIncome: ["Compte de résultat", "Income statement"],
  pBalance: ["Bilan", "Balance sheet"],
  pCentres: ["Centres analytiques", "Cost centres"],
  pProduction: ["Torréfaction", "Roasting"],
  pInventory: ["Stocks", "Inventory"],
  pReceivables: ["Créances clients", "Receivables"],
  pExports: ["Exports", "Exports"],

  // ---------------------------------------------------------------- overview
  ovTitle: ["L'année est courte de", "The year is short by"],
  ovTitleEnd: [", et les livres disent où.", ", and the books say where."],
  ovLede: [
    "Neuf mois d'activité : {sales} de chiffre d'affaires, {kg} kg de café torréfié, et une perte de {loss}. Chaque chiffre de cette page est calculé à partir des {entries} écritures du journal, jamais saisi à la main.",
    "Nine months of trading: {sales} of sales, {kg} kg of coffee roasted, and a loss of {loss}. Every figure on this page is computed from the {entries} journal entries, never typed in by hand."],
  ovDebits: ["Total des débits", "Total debits"],
  ovCredits: ["Total des crédits", "Total credits"],
  ovOutOfBalance: ["Hors équilibre", "Out of balance"],
  ovEntries: ["Écritures", "Entries"],
  ovScaleNote: ["Débits à gauche, crédits à droite. Le fléau se stabilise quand les livres s'équilibrent.",
    "Debits left, credits right. The beam settles level when the ledger does."],

  kNet: ["Résultat net", "Net result"],
  kNetNote: ["Depuis le 1er janvier, après amortissements et charges financières.",
    "Since 1 January, after depreciation and finance costs."],
  kSales: ["Chiffre d'affaires", "Sales"],
  kSalesNote: ["Comptes 701, 706 et 708, neuf mois.", "Accounts 701, 706 and 708, nine months."],
  kCash: ["Trésorerie", "Cash"],
  kCashNote: ["Banque et caisse au 30 septembre.", "Bank and till at 30 September."],
  kMargin: ["Marge sur matières", "Material margin"],
  kMarginNote: ["Ventes moins le café vert et les emballages consommés.",
    "Sales less green coffee and packaging consumed."],

  ovFinding: ["Le point qui décide de l'année", "The one figure that decides the year"],
  ovFindingText: [
    "L'atelier a consommé {excess} kg de café vert de plus que le standard n'autorise pour cette production : un rendement réel de {real} % contre {std} % retenu dans le coût standard. Cet écart de quantité coûte {qty}. À côté, le café vert a été payé {avg} le kilo au lieu de {stdp} : cet écart de prix coûte {price}. Les deux réunis valent plus de deux fois la perte de l'exercice, et aucun des deux n'est un problème commercial.",
    "The workshop used {excess} kg of green coffee more than the standard allows for this output: a real yield of {real} % against the {std} % built into the standard cost. That quantity variance costs {qty}. Alongside it, green coffee was paid {avg} a kilo instead of {stdp}: that price variance costs {price}. Together they are worth more than twice the loss for the period, and neither of them is a commercial problem."],
  ovSeeProduction: ["Voir le détail par brassin", "See it batch by batch"],

  ovMonths: ["Neuf mois", "Nine months"],
  ovMonthsSub: ["produits, charges et résultat mensuel", "income, charges and the monthly result"],
  ovMonthsRead: [
    "La ligne cuivre est le total des produits du mois, la ligne pointillée le total des charges. En dessous, sur son propre axe, le résultat mensuel : vert au-dessus de zéro, rouge en dessous.",
    "The copper line is the month's income, the dashed line its charges. Below, on its own axis, the monthly result: green above zero, red below."],
  lgIncome: ["Produits", "Income"],
  lgCharges: ["Charges", "Charges"],
  lgAbove: ["Résultat positif", "Result above zero"],
  lgBelow: ["Résultat négatif", "Result below zero"],
  mResult: ["RÉSULTAT MENSUEL, PRODUITS MOINS CHARGES", "MONTHLY RESULT, INCOME LESS CHARGES"],

  ovCentres: ["Résultat par centre", "Result by centre"],
  ovCentresSub: ["depuis le 1er janvier, chaque ligne de charge et de produit porte un centre",
    "since 1 January, every income and charge line carries a centre"],
  ovCentresRead: [
    "Chaque volume est un centre analytique : il monte au-dessus de la ligne quand le centre gagne, et pend en dessous quand il perd. <b>L'atelier est fait pour pendre en dessous</b> : c'est un centre de coût, absorbé dans le coût standard de chaque kilo. Les trois canaux de vente, eux, doivent porter le reste.",
    "Each volume is one analytic centre: it rises above the line when the centre earns and hangs below when it loses. <b>The workshop is meant to hang below</b>, it is a cost centre absorbed into the standard cost of every kilo. The three sales channels have to carry the rest."],
  hoverVolume: ["Survolez un volume pour ses chiffres.", "Hover a volume for its figures."],

  ovLast: ["La dernière écriture, en entier", "The last entry, in full"],
  ovLastSub: ["ce que devient une phrase tapée dans la boîte", "what one sentence typed into the box becomes"],
  ovLatest: ["Dernières écritures", "Latest entries"],
  ovLatestSub: ["corrigées par contre-passation, jamais modifiées", "corrected by reversal, never edited"],
  seeAll: ["Tout voir", "See all"],

  // ---------------------------------------------------------------- columns
  cEntry: ["Écriture", "Entry"],
  cDate: ["Date", "Date"],
  cMemo: ["Libellé", "Memo"],
  cJournal: ["Journal", "Journal"],
  cCentre: ["Centre", "Centre"],
  cAccount: ["Compte", "Account"],
  cLabel: ["Intitulé", "Label"],
  cDebit: ["Débit", "Debit"],
  cCredit: ["Crédit", "Credit"],
  cBalance: ["Solde", "Balance"],
  cAmount: ["Montant", "Amount"],
  cTotal: ["Total", "Total"],
  cTotals: ["Totaux", "Totals"],
  cCustomer: ["Client", "Customer"],
  cDue: ["Échéance", "Due"],
  cIncome: ["Produits", "Income"],
  cCharges: ["Charges", "Charges"],
  cResult: ["Résultat", "Result"],
  cKind: ["Nature", "Kind"],
  cQty: ["Quantité", "Quantity"],
  cPiece: ["Pièce", "Document"],
  posted: ["Comptabilisée, immuable", "Posted, immutable"],

  // ---------------------------------------------------------------- journal
  jTitle: ["Journal général", "General journal"],
  jRead: [
    "Les {n} écritures de l'exercice, dans l'ordre où elles ont été comptabilisées. Chacune porte un numéro continu par journal, sans trou : c'est une exigence de l'article 420-5 du PCG. Cliquez une ligne pour voir son détail en débit et crédit.",
    "The {n} entries of the period, in the order they were posted. Each carries an unbroken sequential number within its journal, as French bookkeeping requires. Click a row to open its debit and credit detail."],
  jSearch: ["Chercher un libellé, un numéro", "Search a memo or a number"],
  jAll: ["Tous les journaux", "All journals"],
  jShowing: ["{n} écritures affichées", "{n} entries shown"],
  jMore: ["Afficher 100 de plus", "Show 100 more"],
  jNone: ["Aucune écriture ne correspond.", "No entry matches."],

  // ---------------------------------------------------------------- ledger
  lTitle: ["Grand livre", "General ledger"],
  lRead: [
    "Le même journal, rangé par compte au lieu de l'être par date. Choisissez un compte : ses mouvements apparaissent avec le solde progressif, et le solde final est celui qui part dans la balance puis dans les états financiers.",
    "The same journal, sorted by account instead of by date. Pick an account: its movements appear with a running balance, and the closing balance is what feeds the trial balance and then the statements."],
  lPick: ["Compte", "Account"],
  lRunning: ["Solde progressif", "Running balance"],
  lMovements: ["{n} mouvements", "{n} movements"],

  // ---------------------------------------------------------------- trial
  tTitle: ["Balance générale", "Trial balance"],
  tRead: [
    "Tous les comptes mouvementés, avec leurs totaux débit et crédit. Les deux colonnes sont égales au centime : c'est le contrôle que ferait un auditeur avant de regarder quoi que ce soit d'autre.",
    "Every account that moved, with its debit and credit totals. The two columns agree to the cent: this is the first thing an auditor checks before looking at anything else."],
  tClass: ["Classe", "Class"],
  tClasses: [
    ["1 Capitaux", "2 Immobilisations", "3 Stocks", "4 Tiers", "5 Financier", "6 Charges", "7 Produits"],
    ["1 Equity and loans", "2 Fixed assets", "3 Inventory", "4 Payables and receivables", "5 Cash", "6 Charges", "7 Income"]],

  // ---------------------------------------------------------------- income
  iTitle: ["Compte de résultat", "Income statement"],
  iRead: [
    "Présentation par nature, celle du PCG : on classe les charges selon ce qu'on a acheté, pas selon la fonction qui l'a consommé. La production stockée corrige le décalage entre ce qui a été torréfié et ce qui a été vendu.",
    "Presented by nature, the French way: charges are classed by what was bought, not by the function that consumed it. Stored production corrects the gap between what was roasted and what was sold."],
  iOpIncome: ["Produits d'exploitation", "Operating income"],
  iSales: ["Ventes de café, bar et ports", "Coffee, counter and delivery income"],
  iStored: ["Production stockée", "Stored production"],
  iOpCharges: ["Charges d'exploitation", "Operating charges"],
  iPurchases: ["Achats de café vert et d'emballages", "Green coffee and packaging purchased"],
  iStockChange: ["Variation des stocks", "Change in inventory"],
  iOther: ["Autres achats, énergie et petit équipement", "Other purchases, energy and small equipment"],
  iExternal: ["Services extérieurs, loyers, transport, honoraires", "External services, rent, carriage, fees"],
  iTaxes: ["Impôts et taxes", "Taxes other than income tax"],
  iWages: ["Salaires et traitements", "Wages and salaries"],
  iSocial: ["Charges sociales", "Social contributions"],
  iDepreciation: ["Dotations aux amortissements", "Depreciation"],
  iOpResult: ["Résultat d'exploitation", "Operating result"],
  iFinancial: ["Résultat financier", "Finance result"],
  iNet: ["Résultat de l'exercice", "Result for the period"],
  iConsumed: ["Consommation réelle de matières", "Materials actually consumed"],
  iConsumedNote: [
    "Achats {p} plus variation des stocks {v} : c'est la consommation réelle, celle qui compte.",
    "Purchases {p} plus the change in inventory {v}: that is what was really consumed."],

  // ---------------------------------------------------------------- balance
  bTitle: ["Bilan", "Balance sheet"],
  bRead: [
    "À gauche ce que l'entreprise possède, à droite d'où vient l'argent. Les deux côtés sont égaux parce que chaque écriture était équilibrée : le bilan n'est pas un document à remplir, c'est une conséquence.",
    "On the left what the company owns, on the right where the money came from. Both sides agree because every entry was balanced: a balance sheet is not a form to fill in, it is a consequence."],
  bAssets: ["Actif", "Assets"],
  bLiabilities: ["Passif", "Equity and liabilities"],
  bFixed: ["Immobilisations nettes", "Fixed assets, net"],
  bGross: ["Valeur brute", "Cost"],
  bDep: ["Amortissements cumulés", "Accumulated depreciation"],
  bInventory: ["Stocks", "Inventory"],
  bGreen: ["Café vert", "Green coffee"],
  bPack: ["Emballages", "Packaging"],
  bFinished: ["Café torréfié", "Roasted coffee"],
  bReceivables: ["Créances clients", "Trade receivables"],
  bVatIn: ["TVA déductible", "Input VAT"],
  bCash: ["Disponibilités", "Cash"],
  bBank: ["Banque", "Bank"],
  bTill: ["Caisse", "Till"],
  bCapital: ["Capital social", "Share capital"],
  bReserve: ["Réserve légale", "Legal reserve"],
  bRetained: ["Report à nouveau", "Retained earnings"],
  bResult: ["Résultat de l'exercice", "Result for the period"],
  bEquity: ["Capitaux propres", "Equity"],
  bLoans: ["Emprunts", "Bank loans"],
  bPayables: ["Fournisseurs", "Trade payables"],
  bWages: ["Personnel", "Wages payable"],
  bSocial: ["Organismes sociaux", "Social security"],
  bVatDue: ["TVA à décaisser", "VAT payable"],
  bTotal: ["Total", "Total"],
  bTie: ["Actif et passif se répondent au centime.", "Assets and liabilities agree to the cent."],

  // ---------------------------------------------------------------- centres
  ceTitle: ["Résultat par centre", "Result by centre"],
  ceRead: [
    "Un centre de coût n'a pas de chiffre d'affaires : il fabrique, et son coût part dans le coût standard du café. Un centre de profit vend. Le total des six centres redonne exactement le résultat du compte de résultat.",
    "A cost centre has no sales: it manufactures, and its cost flows into the standard cost of the coffee. A profit centre sells. The six centres add back to exactly the result in the income statement."],
  ceKindCost: ["centre de coût", "cost centre"],
  ceKindProfit: ["centre de profit", "profit centre"],
  ceKindSupport: ["centre de support", "support centre"],

  // ---------------------------------------------------------------- production
  prTitle: ["Torréfaction et coût standard", "Roasting and standard cost"],
  prRead: [
    "Le café perd de l'eau en torréfiant. Le coût standard retient {std} % de rendement : 100 kg de vert doivent donner {std} kg de torréfié. Chaque brassin est comparé à ce standard, et la différence est un écart sur quantité, pas une erreur d'écriture.",
    "Coffee loses water as it roasts. The standard cost assumes a {std} % yield: 100 kg of green should give {std} kg roasted. Every batch is measured against that standard, and the gap is a quantity variance, not a bookkeeping error."],
  prStdCost: ["Coût standard du kilo torréfié", "Standard cost per kg roasted"],
  prGreenStd: ["Café vert au prix standard", "Green coffee at standard price"],
  prPack: ["Emballage", "Packaging"],
  prConversion: ["Main d'oeuvre et énergie absorbées", "Labour and energy absorbed"],
  prYield: ["Rendement", "Yield"],
  prYieldStd: ["Rendement standard", "Standard yield"],
  prGreenUsed: ["Café vert consommé", "Green coffee used"],
  prRoasted: ["Café torréfié obtenu", "Roasted coffee produced"],
  prLost: ["Kilos perdus au-delà du standard", "Kilos lost beyond standard"],
  prVariance: ["Écart total sur la période", "Total variance for the period"],
  prBatches: ["{n} brassins", "{n} batches"],
  prBatch: ["Brassin", "Batch"],
  prTable: ["Les quarante derniers brassins", "The last forty batches"],
  prGreenKg: ["Vert, kg", "Green, kg"],
  prRoastedKg: ["Torréfié, kg", "Roasted, kg"],
  prStdValue: ["Valeur standard", "Standard value"],
  prActual: ["Coût réel", "Actual cost"],
  prGap: ["Écart", "Variance"],
  prSplit: ["D'où vient l'écart", "Where the variance comes from"],
  prVarQty: ["Écart sur quantité, le rendement", "Quantity variance, the yield"],
  prVarQtyNote: ["{excess} kg de vert au-delà du standard, au prix standard",
    "{excess} kg of green beyond standard, at the standard price"],
  prVarPrice: ["Écart sur prix d'achat", "Purchase price variance"],
  prVarPriceNote: ["{avg} le kilo payé contre {stdp} au standard",
    "{avg} a kilo paid against {stdp} at standard"],
  prVarRound: ["Arrondi du coût standard publié", "Rounding of the published standard cost"],
  prVarTotal: ["Écart total sur matières", "Total material variance"],
  prAllowed: ["Vert autorisé par le standard", "Green allowed by the standard"],
  prExcess: ["Vert consommé en trop", "Green used in excess"],
  prVsLoss: ["à comparer à la perte de l'exercice, {loss}",
    "set against the loss for the period, {loss}"],

  // ---------------------------------------------------------------- inventory
  invTitle: ["Stocks", "Inventory"],
  invRead: [
    "Inventaire permanent : chaque entrée et chaque sortie passe par une écriture, le stock du bilan est donc toujours à jour. Le café vert est suivi par lot et sorti au premier entré, premier sorti. Le café torréfié est valorisé au coût standard.",
    "Perpetual inventory: every movement in and out is posted, so the inventory in the balance sheet is always current. Green coffee is tracked by lot and issued first in, first out. Roasted coffee is held at standard cost."],
  invLots: ["Lots de café vert en stock", "Green coffee lots in stock"],
  invOrigin: ["Origine", "Origin"],
  invBought: ["Acheté le", "Bought"],
  invKgIn: ["Entré, kg", "In, kg"],
  invKgLeft: ["Restant, kg", "Left, kg"],
  invPrice: ["Prix au kg", "Price per kg"],
  invValue: ["Valeur", "Value"],
  invFinished: ["Café torréfié", "Roasted coffee"],
  invAtStd: ["au coût standard de", "at the standard cost of"],

  // ---------------------------------------------------------------- receivables
  recTitle: ["Créances clients", "Trade receivables"],
  recRead: [
    "Ce que les clients professionnels doivent encore. Les particuliers paient comptant en boutique et en ligne : il n'y a donc de créance que sur les cafés, hôtels et épiceries livrés à crédit.",
    "What the trade customers still owe. Retail and online customers pay immediately, so receivables only ever come from the cafes, hotels and grocers delivered on account."],
  recAgeing: ["Balance âgée", "Ageing"],
  recCurrent: ["Non échu", "Not yet due"],
  recD30: ["1 à 30 jours de retard", "1 to 30 days late"],
  recD60: ["31 à 60 jours", "31 to 60 days"],
  recD90: ["61 à 90 jours", "61 to 90 days"],
  recOver: ["Plus de 90 jours", "Over 90 days"],
  recOpen: ["Factures ouvertes", "Open invoices"],
  recLate: ["Retard", "Late"],
  recDays: ["j", "d"],
  recTerms: ["Délai", "Terms"],

  // ---------------------------------------------------------------- exports
  exTitle: ["Exports", "Exports"],
  exRead: [
    "Un expert comptable ne veut pas d'un écran, il veut un fichier. Le FEC est le format légal français : dix-huit colonnes séparées par des barres verticales, exigé à chaque contrôle fiscal depuis 2014. Il est ici produit à partir des mêmes écritures que tout le reste.",
    "An accountant does not want a screen, they want a file. The FEC is the French legal export: eighteen pipe separated columns, required at every tax audit since 2014. It is produced here from the same entries as everything else."],
  exFec: ["Fichier des écritures comptables", "Accounting entries file"],
  exFecSub: ["FEC, {n} lignes, format légal", "FEC, {n} lines, legal format"],
  exDownload: ["Télécharger", "Download"],
  exPreview: ["Aperçu des cinq premières lignes", "First five lines"],
  exCsv: ["Balance en CSV", "Trial balance as CSV"],
  exCsvSub: ["point virgule, virgule décimale, lisible par Excel français",
    "semicolon, decimal comma, opens in French Excel"],

  // ---------------------------------------------------------------- record
  rTitle: ["Dire ce qui s'est passé", "Tell the books"],
  rRead: [
    "Dans l'application réelle, un modèle de langage lit la phrase, en extrait un événement typé, et ce sont des règles de comptabilisation déterministes qui choisissent les comptes. Le modèle ne choisit jamais un débit ni un crédit.",
    "In the real application a language model reads the sentence, extracts a typed event, and deterministic posting rules choose the accounts. The model never picks a debit or a credit."],
  rDemoNote: [
    "Ici, tout se passe dans votre navigateur, sur une dizaine de phrases reconnues d'avance. Rien n'est envoyé nulle part, rien n'est enregistré, et rien ne sera ajouté aux livres.",
    "Here everything happens in your browser, against a dozen sentences recognised in advance. Nothing is sent anywhere, nothing is stored, and nothing is added to the books."],
  rPlaceholder: ["Par exemple : vendu 12 kg au Café des Artisans",
    "For example: sold 12 kg to Cafe des Artisans"],
  rTry: ["Essayer", "Try it"],
  rExamples: ["Ou prenez une de ces phrases :", "Or take one of these:"],
  rUnderstood: ["Ce que le système a compris", "What the system understood"],
  rEvent: ["Événement", "Event"],
  rRule: ["Règle de comptabilisation", "Posting rule"],
  rProposed: ["Écriture proposée", "Proposed entry"],
  rNotSaved: ["Aperçu seulement. Rien n'a été comptabilisé.", "Preview only. Nothing was posted."],
  rUnknown: [
    "Cette phrase n'est pas dans le jeu de démonstration. Prenez un des exemples : la vraie application, elle, appelle un modèle.",
    "That sentence is not in the demo set. Take one of the examples: the real application calls a model."],

  // ---------------------------------------------------------------- tutorial
  tuTitle: ["Comment lire ces livres", "How to read these books"],
  tuLede: [
    "Huit étapes, de la première écriture au fichier que réclame l'administration fiscale. Aucune connaissance comptable n'est supposée.",
    "Eight steps, from the first entry to the file the tax authority asks for. No accounting knowledge assumed."],
  tu1t: ["Ce que vous regardez", "What you are looking at"],
  tu1a: [
    "La Brûlerie du Cadran est une société <b>fictive</b> : une torréfaction de café à Lyon qui vend en boutique, en ligne et à des professionnels. Ses livres couvrent neuf mois, du 1er janvier au 30 septembre 2026, tenus selon le <b>plan comptable général</b> français, en euros.",
    "Brulerie du Cadran is a <b>fictional</b> company: a coffee roastery in Lyon selling in its shop, online and to trade customers. Its books cover nine months, 1 January to 30 September 2026, kept under the <b>French plan comptable general</b>, in euros."],
  tu1b: [
    "Aucun chiffre n'a été écrit à la main. Un programme a simulé l'activité jour par jour et a comptabilisé {entries} écritures. Tous les états de ce site sont ensuite recalculés à partir de ces écritures : si une seule était déséquilibrée, le programme refuserait de produire le fichier.",
    "No figure was typed in. A program simulated the business day by day and posted {entries} entries. Every statement on this site is then recomputed from those entries: if a single one were out of balance, the program would refuse to write the file."],
  tu2t: ["La partie double", "Double entry"],
  tu2a: [
    "Une opération ne se note jamais une seule fois. Elle se note <b>deux fois au moins</b> : d'où vient la valeur, et où elle va. La somme des débits égale la somme des crédits, toujours, sans exception.",
    "A transaction is never recorded once. It is recorded <b>at least twice</b>: where the value comes from, and where it goes. The sum of the debits equals the sum of the credits, always, without exception."],
  tu2b: [
    "Voici une vente au comptoir de 14 kg. Le client paie, donc la caisse augmente : elle est <b>débitée</b>. L'entreprise a gagné un produit, donc le compte de ventes est <b>crédité</b>, et la TVA collectée pour l'État aussi, parce qu'elle ne nous appartient pas.",
    "Here is a 14 kg sale over the counter. The customer pays, so the till goes up: it is <b>debited</b>. The company earned income, so the sales account is <b>credited</b>, and so is the VAT collected for the state, because it is not ours."],
  tu3t: ["Le plan de comptes", "The chart of accounts"],
  tu3a: [
    "En France, les comptes ne sont pas libres : le plan comptable général impose une numérotation en sept classes. Le premier chiffre dit déjà de quoi on parle.",
    "In France the accounts are not free: the plan comptable general imposes a numbering in seven classes. The first digit already tells you what you are dealing with."],
  tu3b: [
    "Classes 1 à 5 : le bilan, ce que l'entreprise a et ce qu'elle doit. Classes 6 et 7 : le compte de résultat, ce qu'elle a dépensé et gagné. C'est pour cela qu'un comptable français lit 601 ou 411 comme vous lisez un mot.",
    "Classes 1 to 5: the balance sheet, what the company has and owes. Classes 6 and 7: the income statement, what it spent and earned. This is why a French accountant reads 601 or 411 the way you read a word."],
  tu4t: ["Les journaux", "The journals"],
  tu4a: [
    "Les écritures ne sont pas jetées dans un seul tas : elles sont rangées par journal, selon leur origine. Achats, ventes, banque, caisse, paie, stocks, opérations diverses. Chaque journal numérote ses écritures sans trou, ce qui rend une suppression visible.",
    "Entries are not thrown into one pile: they are filed by journal, according to where they come from. Purchases, sales, bank, cash, payroll, inventory, general. Each journal numbers its entries without gaps, which makes a deletion visible."],
  tu5t: ["Le stock et le coût standard", "Inventory and standard cost"],
  tu5a: [
    "Le café vert entre en stock à son prix d'achat réel. Quand un brassin part au torréfacteur, le stock sort au premier entré premier sorti. Le café torréfié, lui, entre en stock à un <b>coût standard</b> décidé d'avance : {cost} le kilo.",
    "Green coffee goes into inventory at what it really cost. When a batch goes to the roaster, inventory comes out first in, first out. The roasted coffee goes back in at a <b>standard cost</b> decided in advance: {cost} per kilo."],
  tu5b: [
    "Pourquoi un coût décidé d'avance ? Parce qu'on ne peut pas attendre la fin du mois pour savoir si un kilo vendu {price} rapporte de l'argent. Le standard donne une référence immédiate, et l'écart avec le coût réel devient une information de gestion à lui tout seul.",
    "Why a cost decided in advance? Because you cannot wait for the end of the month to know whether a kilo sold at {price} makes money. The standard gives an immediate reference, and the gap with the real cost becomes management information in itself."],
  tu6t: ["L'écart qui décide de l'exercice", "The variance that decides the year"],
  tu6a: [
    "Le coût standard retient {std} % de rendement. Le réel est de {real} %. Pour {roasted} kg de café torréfié, le standard autorisait {allowed} kg de vert ; l'atelier en a consommé {used} kg. Les {excess} kg de trop, valorisés au prix standard, sont l'<b>écart sur quantité</b> : {qty}.",
    "The standard assumes a {std} % yield. The real one is {real} %. For {roasted} kg of roasted coffee the standard allowed {allowed} kg of green; the workshop used {used} kg. The {excess} kg too many, valued at the standard price, are the <b>quantity variance</b>: {qty}."],
  tu6b: [
    "Le café vert a par ailleurs été payé {avg} le kilo au lieu des {stdp} du standard : c'est l'<b>écart sur prix</b>, {price}. Additionnés, ces deux écarts valent {total}, quand la perte de l'exercice n'est que de {loss}. Un compte de résultat seul ne dit pas cela : il montre la perte, pas ses deux causes.",
    "Green coffee was also paid {avg} a kilo instead of the {stdp} in the standard: that is the <b>price variance</b>, {price}. Added together the two variances are worth {total}, when the loss for the period is only {loss}. An income statement alone does not tell you this: it shows the loss, not its two causes."],
  tu7t: ["Les états financiers", "The statements"],
  tu7a: [
    "Le compte de résultat additionne les classes 6 et 7 : il répond à la question « a-t-on gagné de l'argent ». Le bilan photographie les classes 1 à 5 au dernier jour : il répond à « que possède-t-on, et à qui ».",
    "The income statement adds up classes 6 and 7: it answers the question did we make money. The balance sheet photographs classes 1 to 5 on the final day: it answers what do we own, and who does it belong to."],
  tu7b: [
    "Les deux sont reliés par une seule ligne : le résultat. Il apparaît en bas du compte de résultat et au passif du bilan, dans les capitaux propres. C'est ce lien qui fait que le bilan tombe juste.",
    "The two are tied by a single line: the result. It appears at the foot of the income statement and inside equity on the balance sheet. That link is why the balance sheet balances."],
  tu8t: ["Le fichier que réclame le fisc", "The file the tax authority asks for"],
  tu8a: [
    "Depuis 2014, toute entreprise contrôlée en France doit remettre son <b>FEC</b>, fichier des écritures comptables : un fichier texte de dix-huit colonnes contenant chaque ligne de chaque écriture. C'est la raison profonde pour laquelle une écriture ne se modifie pas : elle se contre-passe.",
    "Since 2014 any audited French company has to hand over its <b>FEC</b>, the accounting entries file: a text file of eighteen columns holding every line of every entry. This is the deep reason an entry is never edited: it is reversed."],
  tu8b: [
    "Le FEC de cette démonstration est téléchargeable, avec ses {lines} lignes. Il a été produit par le même programme, à partir des mêmes écritures.",
    "The FEC of this demonstration can be downloaded, all {lines} lines of it. It came out of the same program, from the same entries."],
  tuNext: ["Commencer par la vue d'ensemble", "Start with the overview"],
  tuGoTo: ["Ouvrir la page", "Open the page"],
  tuD2: ["Vente au comptoir de 14 kg", "A 14 kg sale over the counter"],
  tuD3: ["Les sept classes du plan comptable", "The seven classes of the chart of accounts"],
  tuD4: ["Les sept journaux de cette entreprise", "The seven journals of this company"],
  tuD5: ["Le coût standard du kilo, décomposé", "The standard cost per kilo, taken apart"],
  tuD5a: ["Café vert : {p} le kilo, divisé par un rendement de {y}",
    "Green coffee: {p} a kilo, divided by a {y} yield"],
  tuD6: ["Le calcul de l'écart, sur neuf mois", "How the variance is computed, over nine months"],
  tuD6a: ["Vert autorisé par le standard pour {r} kg torréfiés",
    "Green the standard allows for {r} kg roasted"],
  tuD6b: ["Vert réellement consommé", "Green actually used"],
  tuD6c: ["Excédent, au prix standard de {p}", "Excess, at the standard price of {p}"],
  tuD6d: ["Écart sur prix : {used} kg payés {avg} au lieu de {std}",
    "Price variance: {used} kg paid {avg} instead of {std}"],
  tuD7: ["La même ligne, des deux côtés", "The same line, on both sides"],
  tuD7a: ["Bas du compte de résultat", "Foot of the income statement"],
  tuD7b: ["Capitaux propres au bilan", "Equity on the balance sheet"],
  tuD7c: ["Total de l'actif", "Total assets"],
  tuD7d: ["Total du passif", "Total equity and liabilities"],
  tuD8: ["Les premières lignes du fichier", "The first lines of the file"],

  // ---------------------------------------------------------------- footer
  fDemo: [
    "Démonstration publique. Société fictive, chiffres générés, aucune donnée réelle, aucune saisie possible.",
    "Public demonstration. Fictional company, generated figures, no real data, nothing can be written."],
  fBuilt: ["Conçu et développé par", "Designed and built by"],
  langLabel: ["English", "Français"],
  themeLabel: ["Jour ou nuit", "Day or night"],
};

let LANG = 0;   // 0 = fr, 1 = en

export function setLang(code) {
  LANG = code === "en" ? 1 : 0;
  document.documentElement.lang = code === "en" ? "en" : "fr";
}
export function lang() { return LANG === 1 ? "en" : "fr"; }
export function t(key, vars) {
  const row = STR[key];
  if (!row) return key;
  let s = row[LANG];
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split("{" + k + "}").join(v);
  return s;
}
export function pick(fr, en) { return LANG === 1 ? en : fr; }
