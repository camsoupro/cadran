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
  pInvoices: ["Factures", "Invoices"],
  pReminders: ["Relances", "Reminders"],
  pPayables: ["Dettes fournisseurs", "Supplier debts"],
  pAnalysis: ["En clair", "In plain words"],
  pActivity: ["Suivi", "Activity log"],

  // ---------------------------------------------------------------- suivi
  actTitle: ["Suivi des activités", "Activity log"],
  actRead: [
    "Tout ce qui occupe un dirigeant ne se comptabilise pas. Une fuite constatée, un rendez-vous pris, un devis reçu, un prestataire qui annule : rien de tout cela ne touche les comptes. <b>Seule la facture crée le fait générateur</b>, et c'est à ce moment là qu'une écriture apparaît. Cette page garde la trace du reste, et pointe vers l'écriture le jour où il y en a une.",
    "Not everything that occupies a business owner belongs in the accounts. A leak noticed, an appointment booked, a quote received, a contractor cancelling: none of that touches the books. <b>Only the invoice creates the accounting event</b>, and that is when an entry appears. This page keeps the rest, and points to the entry on the day there is one."],
  actOpened: ["Ouvert le", "Opened"],
  actLast: ["Dernière mise à jour", "Last update"],
  actNoEntry: ["Aucune écriture", "No entry"],
  actEntry: ["Écriture", "Entry"],
  actUpdates: ["{n} mises à jour", "{n} updates"],
  actStOpen: ["En cours", "Open"],
  actStPlanned: ["Planifié", "Planned"],
  actStWaiting: ["En attente", "Waiting"],
  actStDone: ["Terminé", "Closed"],
  actStCancelled: ["Annulé", "Cancelled"],
  actCatMaintenance: ["Entretien", "Maintenance"],
  actCatClient: ["Client", "Customer"],
  actCatBail: ["Bail", "Lease"],
  actCatMateriel: ["Matériel", "Equipment"],
  actCatEquipe: ["Équipe", "Team"],
  actCatCommercial: ["Commercial", "Commercial"],
  actCountOpen: ["En cours ou en attente", "Open or waiting"],
  actNoteOpen: ["sur {n} suivis ouverts cette année", "of {n} items opened this year"],
  actNoteDone: ["dossiers refermés", "items closed"],
  actNotePosted: ["mises à jour reliées à une écriture du journal", "updates linked to a journal entry"],
  actNoteAll: ["depuis le 1er janvier", "since 1 January"],
  actCountDone: ["Clos", "Closed"],
  actCountPosted: ["Ont produit une écriture", "Produced an entry"],
  actWhy: ["Pourquoi séparer les deux", "Why the two are kept apart"],
  actWhyText: [
    "Un devis inscrit en charge gonflerait le résultat d'une dépense qui n'existe pas encore, et fausserait la TVA. Un rendez-vous noté dans le journal rendrait le grand livre illisible. La séparation n'est pas une commodité : c'est la règle du fait générateur, et c'est ce qui permet au bilan de rester vrai. Le modèle qui lit vos phrases décide d'abord de cela : est-ce que ceci touche les comptes, oui ou non.",
    "A quote booked as a charge would inflate the result with a cost that does not exist yet, and would distort the VAT. An appointment written into the journal would make the ledger unreadable. The separation is not a convenience: it is the rule of the accounting event, and it is what keeps the balance sheet true. The model reading your sentences decides that first: does this touch the accounts, yes or no."],

  // ---------------------------------------------------------------- raison d'etre
  whyTitle: ["Pourquoi ce logiciel existe", "Why this software exists"],
  whyText: [
    "Une petite entreprise ne rate pas ses comptes par manque de sérieux, elle les rate parce que la comptabilité parle une langue qu'elle n'a pas apprise. Cadran est construit sur l'idée inverse : <b>on dit ce qui s'est passé avec ses mots</b>, le logiciel écrit l'écriture juste, et il explique ensuite ce que les chiffres veulent dire, en français ordinaire. Rien n'est caché derrière un tableau qu'il faudrait savoir lire : chaque total de ce site renvoie aux écritures qui le composent.",
    "A small business does not lose track of its books through carelessness, it loses track because accounting speaks a language nobody taught them. Cadran is built the other way round: <b>you say what happened in your own words</b>, the software writes the correct entry, and then explains what the figures mean in plain language. Nothing hides behind a table you would need training to read: every total on this site points back to the entries behind it."],

  // ---------------------------------------------------------------- dettes fournisseurs
  payTitle: ["Ce que nous devons", "What we owe"],
  payRead: [
    "L'autre moitié du tableau. Les créances disent ce qu'on nous doit ; cette page dit ce que nous devons, à qui, et pour quand. Un fournisseur accorde lui aussi un délai, et une trésorerie se gère avec les deux colonnes sous les yeux.",
    "The other half of the picture. Receivables say what is owed to us; this page says what we owe, to whom, and by when. A supplier grants terms too, and cash is managed with both columns in sight."],
  payTotal: ["Dettes fournisseurs", "Supplier debts"],
  payNext30: ["À payer sous 30 jours", "Due within 30 days"],
  payOpenCount: ["{n} factures encore ouvertes", "{n} invoices still open"],
  payNext30Note: ["sur les échéances d'octobre", "falling due in October"],
  payDpo: ["Délai moyen de paiement", "Average days to pay"],
  payDpoNote: ["sur les {n} factures déjà réglées", "over the {n} invoices already settled"],
  payBalance: ["L'équilibre des délais", "The balance of terms"],
  payBalanceNote: [
    "Nous payons nos fournisseurs en <b>{dpo} jours</b> et nos clients nous paient en <b>{dso} jours</b>. L'écart de {gap} jours est financé par la trésorerie de l'entreprise. C'est la façon la plus discrète de manquer d'argent tout en étant bénéficiaire.",
    "We pay our suppliers in <b>{dpo} days</b> and our customers pay us in <b>{dso} days</b>. The {gap} day gap is financed out of the company's own cash. It is the quietest way to run out of money while turning a profit."],
  paySupplier: ["Fournisseur", "Supplier"],
  payWhat: ["Objet", "For"],

  // ---------------------------------------------------------------- en clair
  anTitle: ["Vos livres, en clair", "Your books, in plain words"],
  anLede: [
    "La même comptabilité, sans un seul mot de comptable. Si une phrase de cette page demande un dictionnaire, c'est qu'elle est mal écrite.",
    "The same accounting, without a single accounting word. If a sentence on this page needs a dictionary, it is badly written."],
  anRefresh: ["Recalculer", "Run it again"],
  anQ1: ["Où part l'argent qui entre ?", "Where does the money go?"],
  anA1: [
    "Sur <b>100 €</b> encaissés : <b>{materials} €</b> partent en café vert et en emballages, <b>{people} €</b> en salaires et cotisations, <b>{place} €</b> en loyer et en énergie, <b>{services} €</b> en transport, assurance et autres services, <b>{wear} €</b> pour l'usure du matériel, et <b>{unpaid} €</b> en factures qu'un client ne paiera jamais. Il reste <b>{kept} €</b>.",
    "Out of every <b>100 €</b> taken in: <b>{materials} €</b> go to green coffee and packaging, <b>{people} €</b> to wages and contributions, <b>{place} €</b> to rent and energy, <b>{services} €</b> to carriage, insurance and other services, <b>{wear} €</b> to wear on the equipment, and <b>{unpaid} €</b> to invoices a customer will never pay. <b>{kept} €</b> are left."],
  anQ2: ["Est-ce que l'entreprise gagne de l'argent ?", "Is the business making money?"],
  anA2: [
    "Oui, mais très peu : <b>{kept} € sur 100</b>. Sur neuf mois, cela fait <b>{profit}</b>. C'est moins que ce qu'un seul gros client lui doit aujourd'hui.",
    "Yes, but barely: <b>{kept} € in every 100</b>. Over nine months that is <b>{profit}</b>. It is less than what a single large customer owes right now."],
  anQ3: ["Reste-t-il de l'argent sur le compte ?", "Is there money in the bank?"],
  anA3: [
    "Oui : <b>{cash}</b> en banque et en caisse au 30 septembre. Au rythme actuel des dépenses, cela tient <b>{months} mois</b> même si plus rien ne rentrait.",
    "Yes: <b>{cash}</b> in the bank and the till at 30 September. At the current rate of spending, that lasts <b>{months} months</b> even if nothing came in."],
  anQ4: ["Qui doit de l'argent à qui ?", "Who owes whom?"],
  anA4: [
    "Les clients professionnels nous doivent <b>{owed}</b>. Nous devons <b>{owing}</b> à nos fournisseurs. Nous payons en <b>{dpo} jours</b> et nous sommes payés en <b>{dso} jours</b> : nous faisons crédit plus longtemps que nous n'en recevons, et cette différence sort de notre poche.",
    "Trade customers owe us <b>{owed}</b>. We owe <b>{owing}</b> to our suppliers. We pay in <b>{dpo} days</b> and are paid in <b>{dso} days</b>: we lend for longer than we borrow, and the difference comes out of our own pocket."],
  anQ5: ["Qu'est-ce qui ne va pas ?", "What is going wrong?"],
  anA5: [
    "Deux choses. <b>Un client ne paie plus du tout</b> depuis le printemps : {amount} sont déjà comptés comme perdus, et si un deuxième faisait pareil l'année deviendrait négative. Et <b>le café perd plus de poids que prévu en cuisant</b> : {lost} kg de café vert partis au-delà de la normale, soit {variance}, davantage que le bénéfice de l'année.",
    "Two things. <b>One customer has stopped paying</b> since the spring: {amount} are already counted as lost, and if a second did the same the year would turn negative. And <b>the coffee loses more weight than expected while roasting</b>: {lost} kg of green coffee gone beyond normal, that is {variance}, more than the whole year's profit."],
  anQ6: ["Que faire lundi matin ?", "What to do on Monday morning?"],
  anA6: [
    "Appeler le client qui ne paie plus, avant que la créance ait un an. Régler le tambour du torréfacteur et repeser un brassin pour vérifier. Demander à deux ou trois clients de passer à trente jours au lieu de quarante-cinq. Aucune de ces trois actions ne coûte d'argent.",
    "Call the customer who has stopped paying, before the debt turns a year old. Adjust the roaster and weigh a batch to check. Ask two or three customers to move from forty-five days to thirty. None of those three costs anything."],
  anWhere: ["Sur 100 € encaissés", "Out of every 100 EUR taken in"],
  anMaterials: ["Café et emballages", "Coffee and packaging"],
  anPeople: ["Salaires", "Wages"],
  anPlace: ["Loyer et énergie", "Rent and energy"],
  anServices: ["Autres services", "Other services"],
  anWear: ["Usure du matériel", "Wear on equipment"],
  anUnpaid: ["Jamais payé", "Never paid"],
  anBank: ["Banque", "Bank"],
  anKept: ["Il reste", "Left over"],
  anFootnote: [
    "Chaque phrase de cette page est calculée à partir des mêmes écritures que les états financiers. Rien n'est arrondi en douce : les montants exacts sont dans le compte de résultat.",
    "Every sentence on this page is computed from the same entries as the financial statements. Nothing is quietly rounded: the exact amounts are in the income statement."],

  // ---------------------------------------------------------------- factures
  invTitleFac: ["Factures clients", "Customer invoices"],
  invReadFac: [
    "Les {n} factures émises aux professionnels depuis le 1er janvier. Les particuliers, en boutique et en ligne, paient comptant : ils reçoivent un ticket, pas une facture. Chaque facture porte un numéro d'une séquence continue, sans trou, et renvoie à l'écriture qui l'a comptabilisée. Cliquez une ligne pour voir la facture telle qu'elle est éditée.",
    "The {n} invoices issued to trade customers since 1 January. Retail and online customers pay immediately: they get a receipt, not an invoice. Each invoice carries a number from an unbroken sequence and points to the entry that recorded it. Click a row to see the invoice as it is issued."],
  cInvoice: ["Facture", "Invoice"],
  cTerms: ["Délai de paiement", "Payment terms"],
  cStatus: ["État", "Status"],
  cHT: ["Total HT", "Net"],
  cVAT: ["TVA", "VAT"],
  cTTC: ["Total TTC", "Gross"],
  stPaid: ["Réglée", "Paid"],
  stOpen: ["En attente", "Outstanding"],
  stLate: ["En retard", "Overdue"],
  facSupplier: ["Émetteur", "Issued by"],
  facCustomer: ["Client", "Bill to"],
  facDesignation: ["Désignation", "Description"],
  facQty: ["Quantité", "Quantity"],
  facUnit: ["Prix unitaire HT", "Unit price"],
  facLine: ["Café torréfié, {blend}, en sacs de 1 kg", "Roasted coffee, {blend}, in 1 kg bags"],
  facDue: ["À régler avant le", "Payable by"],
  facEntry: ["Comptabilisée sous", "Posted as"],
  facPrint: ["Imprimer", "Print"],
  facBack: ["Retour à la liste", "Back to the list"],
  facLegal: [
    "Pénalités de retard : taux directeur de la Banque centrale européenne majoré de dix points, soit {rate} % l'an. Indemnité forfaitaire pour frais de recouvrement : {fee} (articles L441-10 et D441-5 du code de commerce). Pas d'escompte pour paiement anticipé. TVA acquittée sur les débits.",
    "Late payment interest: the European Central Bank refinancing rate plus ten points, that is {rate} % a year. Fixed recovery charge: {fee} (French commercial code, articles L441-10 and D441-5). No discount for early settlement. VAT accounted for on invoice."],
  facMentions: ["Mentions obligatoires", "Statutory particulars"],

  // ---------------------------------------------------------------- relances
  remTitle: ["Relances clients", "Payment reminders"],
  remRead: [
    "Les factures dont l'échéance est passée au 30 septembre. Le retard se compte à partir de la date d'échéance, qui dépend du délai accordé : un délai de 30 jours fin de mois n'est pas un délai de 30 jours. Les pénalités sont calculées au taux légal, jour par jour, et l'indemnité de 40 € est due dès le premier jour de retard.",
    "The invoices past due at 30 September. Lateness runs from the due date, which depends on the terms granted: 30 days end of month is not the same as 30 days. Interest is computed at the statutory rate, day by day, and the 40 EUR fixed charge falls due on the first day of delay."],
  remNone: ["Aucune facture en retard au 30 septembre.", "No invoice is past due at 30 September."],
  remLetter: ["La lettre qui partirait", "The letter that would go out"],
  remPenalty: ["Pénalités", "Interest"],
  remFee: ["Indemnité", "Fixed charge"],
  remClaim: ["Total réclamable", "Total claimable"],
  remNotSent: [
    "Démonstration : rien ne s'envoie. Dans l'application réelle, cette lettre part par courriel et l'envoi est daté dans le dossier du client.",
    "Demonstration: nothing is sent. In the real application this letter goes out by e-mail and the send is dated in the customer file."],
  remPick: ["Choisissez une facture pour voir la lettre.", "Pick an invoice to see the letter."],
  remBody: [
    "Madame, Monsieur,\n\nSauf erreur de notre part, la facture {ref} du {date}, d'un montant de {amount}, est échue depuis le {due}, soit {days} jours.\n\nNous vous remercions de bien vouloir procéder à son règlement sous huitaine. À défaut, les pénalités de retard prévues à nos conditions de vente, soit {penalty} à ce jour, ainsi que l'indemnité forfaitaire de recouvrement de {fee}, seront exigibles.\n\nSi ce règlement a été effectué entre-temps, merci de ne pas tenir compte de ce courrier.\n\nVeuillez agréer, Madame, Monsieur, l'expression de nos salutations distinguées.\n\nLa Brûlerie du Cadran",
    "Dear Sir or Madam,\n\nUnless we are mistaken, invoice {ref} dated {date}, for {amount}, fell due on {due}, that is {days} days ago.\n\nWe would be grateful if you could settle it within eight days. Failing that, the late payment interest set out in our terms, {penalty} as of today, together with the fixed recovery charge of {fee}, will become payable.\n\nIf payment has been made in the meantime, please disregard this letter.\n\nYours faithfully,\n\nLa Brulerie du Cadran"],

  // ---------------------------------------------------------------- creances, ajouts
  recDso: ["Délai moyen de règlement constaté", "Average days to payment"],
  recDsoNote: ["sur les {n} factures réglées à ce jour", "over the {n} invoices settled so far"],
  recLateTotal: ["Encours échu", "Past due"],
  recPenalties: ["Pénalités et indemnités exigibles", "Interest and charges claimable"],
  recDoubtful: ["Créances douteuses et dépréciation", "Doubtful debts and allowance"],
  recDoubtfulNote: [
    "Une créance qu'on n'espère plus recouvrer se transfère en compte 416, clients douteux, et se déprécie pour sa valeur hors taxes par le compte 491. La dotation est une charge : c'est par là qu'un retard de paiement finit par toucher le résultat, et pas seulement la trésorerie.",
    "A receivable you no longer expect to collect moves to account 416, doubtful customers, and is written down at its net of VAT value through account 491. The charge hits the income statement: that is how a late payment ends up touching the result, and not only the cash."],
  recStressTitle: ["Test de résistance", "Stress test"],
  recStressNote: [
    "Chaque client professionnel porte un encours. Si l'un d'eux se mettait à payer comme {customer}, il faudrait le déprécier à son tour. Voici ce que deviendrait le résultat, client par client, du plus gros encours au plus petit.",
    "Every trade customer carries a balance. If one of them started paying like {customer}, it would have to be written down too. Here is what the result would become, customer by customer, largest balance first."],
  recExposure: ["Encours HT", "Balance net of VAT"],
  recResultAfter: ["Résultat après dépréciation", "Result after the write down"],
  recGross: ["Créances brutes", "Gross receivables"],
  recAllowance: ["Dépréciation", "Allowance"],
  recNet: ["Créances nettes", "Net receivables"],
  recTermsNote: [
    "Les délais accordés vont du comptant au 45 jours fin de mois, le maximum que la loi française autorise.",
    "Terms granted run from payment on receipt to 45 days end of month, the maximum French law allows."],

  // ---------------------------------------------------------------- bac a sable, ajouts
  rWhen: ["Date de l'opération", "Date of the transaction"],
  rWhenNote: [
    "Dans l'application réelle, le modèle lit la date dans votre phrase : lundi 14/09, hier, le 3 septembre. Ici, tapez-la dans le champ.",
    "In the real application the model reads the date from your sentence: last Monday, yesterday, 3 September. Here, type it in the field."],
  rTermsField: ["Délai accordé", "Terms granted"],
  rComputedDue: ["Échéance calculée", "Computed due date"],
  rDueExplain: [
    "Un délai de {terms} appliqué à une facture du {date} donne le {due}.",
    "Terms of {terms} applied to an invoice dated {date} give {due}."],

  // ---------------------------------------------------------------- overview
  ovTitle: ["L'exercice gagne", "The year earns"],
  ovTitleEnd: [", et tient à un seul client.", ", and hangs on a single customer."],
  ovLede: [
    "Neuf mois d'activité : {sales} de chiffre d'affaires, {kg} kg de café torréfié, et un bénéfice de {profit}. Chaque chiffre de cette page est calculé à partir des {entries} écritures du journal, jamais saisi à la main.",
    "Nine months of trading: {sales} of sales, {kg} kg of coffee roasted, and a profit of {profit}. Every figure on this page is computed from the {entries} journal entries, never typed in by hand."],
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

  ovFinding: ["Où part la marge", "Where the margin goes"],
  ovFragile: ["Ce qui ferait basculer l'exercice", "What would tip the year over"],
  ovFragileText: [
    "{customer} ne règle plus rien depuis le printemps : {n} factures impayées, {amount} passés en dépréciation à la clôture. Le bénéfice de {result} tient déjà compte de cette perte. Mais les autres clients professionnels doivent encore {exposure} hors taxes. <b>Il suffirait que {top} cesse de payer à son tour</b>, soit {topAmount} à déprécier, pour que l'exercice tombe à {after}. Un bénéfice de cette taille ne survit pas à un deuxième mauvais payeur.",
    "{customer} has paid nothing since the spring: {n} unpaid invoices, {amount} written down at closing. The {result} profit already carries that loss. But the other trade customers still owe {exposure} net of VAT. <b>One more of them stopping payment</b>, {top}, would mean {topAmount} more to write down and would take the year to {after}. A profit this thin does not survive a second bad payer."],
  ovSeeReceivables: ["Voir le détail client par client", "See it customer by customer"],
  ovFindingText: [
    "L'atelier a consommé {excess} kg de café vert de plus que le standard n'autorise pour cette production : un rendement réel de {real} % contre {std} % retenu dans le coût standard. Cet écart de quantité coûte {qty}. À côté, le café vert a été payé {avg} le kilo au lieu de {stdp} : cet écart de prix coûte {price}. Ensemble, <b>ils valent {times} fois le bénéfice de l'exercice</b>, et aucun des deux n'est un problème commercial.",
    "The workshop used {excess} kg of green coffee more than the standard allows for this output: a real yield of {real} % against the {std} % built into the standard cost. That quantity variance costs {qty}. Alongside it, green coffee was paid {avg} a kilo instead of {stdp}: that price variance costs {price}. Together <b>they are worth {times} times the profit for the period</b>, and neither of them is a commercial problem."],
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
    "Le café vert a par ailleurs été payé {avg} le kilo au lieu des {stdp} du standard : c'est l'<b>écart sur prix</b>, {price}. Additionnés, ces deux écarts valent {total}, quand le bénéfice de l'exercice n'est que de {profit}. Un compte de résultat seul ne dit pas cela : il montre le résultat, pas ce qui le ronge.",
    "Green coffee was also paid {avg} a kilo instead of the {stdp} in the standard: that is the <b>price variance</b>, {price}. Added together the two variances are worth {total}, when the profit for the period is only {profit}. An income statement alone does not tell you this: it shows the result, not what eats it."],
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
