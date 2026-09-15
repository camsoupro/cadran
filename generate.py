"""
Cadran, demonstration books for a fictional coffee roastery.

French PCG (plan comptable general), euros, perpetual inventory (inventaire permanent).
Nine months of trading, 1 January to 30 September 2026, generated entry by entry.

Nothing here is hand written: every statement is computed from the journal, so the
demo is arithmetically true. The script refuses to write anything if a single entry
is out of balance, if the trial balance does not tie, or if the balance sheet does
not balance.

    python generate.py

writes public/data/books.json and public/data/fec-2026.txt
"""

from __future__ import annotations

import json
import math
import random
from datetime import date, timedelta
from pathlib import Path

CENTS = 2
random.seed(20260930)

# --------------------------------------------------------------------------- company

COMPANY = {
    "name": "Brulerie du Cadran",
    "legal": "SAS au capital de 60 000 EUR",
    "siren": "000 000 000",
    "vat": "FR 00 000 000 000",
    "rcs": "RCS Lyon 000 000 000",
    "ape": "1083Z",
    "address": "14 rue des Remparts",
    "postal": "69007 Lyon",
    "city": "Lyon 7e",
    "activity_fr": "Torrefaction de cafe, vente en boutique, en ligne et aux professionnels",
    "activity_en": "Coffee roasting, sold in the shop, online and to trade customers",
    "fiscal_from": "2026-01-01",
    "fiscal_to": "2026-12-31",
    "closed_to": "2026-09-30",
    "currency": "EUR",
    "standard": "PCG",
}

START = date(2026, 1, 1)
END = date(2026, 9, 30)

# --------------------------------------------------------------------------- accounts
# (number, fr, en, kind)  kind: asset | liability | equity | expense | income
ACCOUNTS: list[tuple[str, str, str, str]] = [
    ("101000", "Capital social", "Share capital", "equity"),
    ("106100", "Reserve legale", "Legal reserve", "equity"),
    ("110000", "Report a nouveau", "Retained earnings", "equity"),
    ("120000", "Resultat de l'exercice", "Profit for the year", "equity"),
    ("164000", "Emprunts aupres des etablissements de credit", "Bank loans", "liability"),
    ("205000", "Logiciels", "Software", "asset"),
    ("213500", "Installations et agencements", "Fixtures and fittings", "asset"),
    ("215400", "Materiel industriel, torrefacteur", "Plant and machinery, roaster", "asset"),
    ("218300", "Materiel de bureau et informatique", "Office and IT equipment", "asset"),
    ("280500", "Amortissements des logiciels", "Accumulated depreciation, software", "asset"),
    ("281350", "Amortissements des agencements", "Accumulated depreciation, fixtures", "asset"),
    ("281540", "Amortissements du materiel industriel", "Accumulated depreciation, plant", "asset"),
    ("281830", "Amortissements du materiel de bureau", "Accumulated depreciation, office", "asset"),
    ("310000", "Stock de cafe vert", "Green coffee inventory", "asset"),
    ("320000", "Stock d'emballages et fournitures", "Packaging and supplies inventory", "asset"),
    ("355000", "Stock de cafe torrefie", "Roasted coffee inventory", "asset"),
    ("401000", "Fournisseurs", "Trade payables", "liability"),
    ("411000", "Clients", "Trade receivables", "asset"),
    ("421000", "Personnel, remunerations dues", "Wages payable", "liability"),
    ("431000", "Securite sociale et organismes sociaux", "Social security payable", "liability"),
    ("445510", "TVA a decaisser", "VAT payable", "liability"),
    ("445660", "TVA deductible", "Input VAT", "asset"),
    ("445710", "TVA collectee", "Output VAT", "liability"),
    ("512000", "Banque", "Bank", "asset"),
    ("530000", "Caisse", "Cash in hand", "asset"),
    ("601000", "Achats de cafe vert", "Purchases of green coffee", "expense"),
    ("602100", "Achats d'emballages et fournitures", "Purchases of packaging and supplies", "expense"),
    ("603100", "Variation des stocks de cafe vert", "Change in green coffee inventory", "expense"),
    ("603200", "Variation des stocks d'emballages", "Change in packaging inventory", "expense"),
    ("606100", "Energie, electricite et gaz", "Energy, electricity and gas", "expense"),
    ("606300", "Petit equipement et entretien", "Small equipment and maintenance", "expense"),
    ("613200", "Locations immobilieres", "Property rent", "expense"),
    ("615500", "Entretien et reparations", "Repairs and maintenance", "expense"),
    ("616000", "Primes d'assurance", "Insurance", "expense"),
    ("622600", "Honoraires, expert comptable", "Professional fees, accountant", "expense"),
    ("623100", "Publicite et marketing", "Advertising and marketing", "expense"),
    ("624100", "Transports sur ventes", "Delivery costs on sales", "expense"),
    ("626000", "Frais postaux et telecommunications", "Post and telecommunications", "expense"),
    ("627000", "Services bancaires", "Bank charges", "expense"),
    ("635100", "Impots et taxes, CFE", "Local business tax", "expense"),
    ("641100", "Salaires et traitements", "Wages and salaries", "expense"),
    ("645100", "Charges de securite sociale", "Social security contributions", "expense"),
    ("661100", "Interets des emprunts", "Interest on loans", "expense"),
    ("681100", "Dotations aux amortissements", "Depreciation charge", "expense"),
    ("701000", "Ventes de cafe torrefie", "Sales of roasted coffee", "income"),
    ("706000", "Prestations, bar et degustations", "Services, counter and tastings", "income"),
    ("708500", "Ports factures", "Delivery income", "income"),
    ("713500", "Variation des stocks de produits finis", "Change in finished goods inventory", "income"),
]
ACC_BY_NUM = {a[0]: a for a in ACCOUNTS}

JOURNALS = [
    ("AC", "Achats", "Purchases"),
    ("VE", "Ventes", "Sales"),
    ("BQ", "Banque", "Bank"),
    ("CA", "Caisse", "Cash"),
    ("PA", "Paie", "Payroll"),
    ("ST", "Stocks et production", "Inventory and production"),
    ("OD", "Operations diverses", "General"),
]
JOURNAL_NAMES = {c: (fr, en) for c, fr, en in JOURNALS}

CENTRES = [
    ("TOR", "Atelier de torrefaction", "Roasting workshop", "cost"),
    ("BTQ", "Boutique du Cadran", "Cadran shop", "profit"),
    ("WEB", "Boutique en ligne", "Online shop", "profit"),
    ("GRO", "Ventes aux professionnels", "Trade sales", "profit"),
    ("MKT", "Marketing", "Marketing", "support"),
    ("ADM", "Administration", "Administration", "support"),
]

# --------------------------------------------------------------------------- VAT
# Coffee sold to take away is a foodstuff: reduced rate. Consumed at the counter: 10 %.
# Delivery and trade services: standard rate.
SEASON = {1: .88, 2: .90, 3: .97, 4: 1.0, 5: 1.02, 6: .96, 7: .78, 8: .70, 9: 1.08}

VAT_FOOD = 0.055
VAT_COUNTER = 0.10
VAT_STANDARD = 0.20

# --------------------------------------------------------------------------- ledger


def r2(x: float) -> float:
    return round(x + 1e-9, CENTS)


def log_uniform(lo: float, hi: float) -> float:
    """Tire entre lo et hi en echelle logarithmique.

    Les tailles de commande d'une entreprise ne sont pas uniformes : il y a beaucoup
    de petites commandes et quelques grosses. Un tirage uniforme donne une population
    trop resserree, que la loi de Benford rejette a juste titre.
    """
    return math.exp(random.uniform(math.log(lo), math.log(hi)))


class Books:
    def __init__(self) -> None:
        self.entries: list[dict] = []
        self.counters: dict[str, int] = {}

    def post(self, day: date, journal: str, memo_fr: str, memo_en: str,
             lines: list[tuple[str, float, float, str | None, str]],
             piece: str = "") -> dict:
        """lines: (account, debit, credit, centre, label_fr). Raises if out of balance."""
        self.counters[journal] = self.counters.get(journal, 0) + 1
        number = f"{journal}{day.year}{self.counters[journal]:05d}"
        rows = []
        for acc, deb, cred, centre, label in lines:
            if acc not in ACC_BY_NUM:
                raise KeyError(f"unknown account {acc}")
            deb, cred = r2(deb), r2(cred)
            if deb and cred:
                raise ValueError(f"line both debit and credit: {acc} {label}")
            rows.append({"account": acc, "debit": deb, "credit": cred,
                         "centre": centre, "label": label})
        td, tc = r2(sum(r["debit"] for r in rows)), r2(sum(r["credit"] for r in rows))
        if abs(td - tc) > 0.005:
            raise ValueError(f"entry out of balance {number}: {td} vs {tc} ({memo_fr})")
        entry = {"number": number, "date": day.isoformat(), "journal": journal,
                 "memo_fr": memo_fr, "memo_en": memo_en, "piece": piece or number,
                 "total": td, "lines": rows}
        self.entries.append(entry)
        return entry


B = Books()

# --------------------------------------------------------------------------- opening

OPENING = [
    ("215400", 146_000, 0, None, "Torrefacteur 25 kg et hotte"),
    ("213500", 58_400, 0, None, "Agencement de la boutique"),
    ("218300", 11_900, 0, None, "Materiel de bureau et informatique"),
    ("205000", 6_800, 0, None, "Logiciel de caisse et de gestion"),
    ("281540", 0, 43_800, None, "Amortissements anterieurs, torrefacteur"),
    ("281350", 0, 17_520, None, "Amortissements anterieurs, agencement"),
    ("281830", 0, 5_950, None, "Amortissements anterieurs, bureau"),
    ("280500", 0, 3_400, None, "Amortissements anterieurs, logiciel"),
    ("310000", 61_450, 0, None, "Stock de cafe vert au 31 decembre 2025"),
    ("320000", 8_260, 0, None, "Stock d'emballages au 31 decembre 2025"),
    ("355000", 24_180, 0, None, "Stock de cafe torrefie au 31 decembre 2025"),
    ("411000", 57_300, 0, None, "Clients professionnels au 31 decembre 2025"),
    ("512000", 84_260, 0, None, "Solde bancaire au 31 decembre 2025"),
    ("530000", 1_450, 0, None, "Caisse de la boutique"),
    ("401000", 0, 39_870, None, "Fournisseurs au 31 decembre 2025"),
    ("431000", 0, 14_260, None, "Charges sociales du 4e trimestre 2025"),
    ("445510", 0, 6_190, None, "TVA de decembre 2025"),
    ("164000", 0, 118_400, None, "Emprunt torrefacteur, solde"),
    ("101000", 0, 60_000, None, "Capital social"),
    ("106100", 0, 6_000, None, "Reserve legale"),
]
_od = sum(l[1] for l in OPENING)
_oc = sum(l[2] for l in OPENING)
OPENING.append(("110000", 0, r2(_od - _oc), None, "Report a nouveau"))
B.post(START, "OD", "A nouveaux au 1er janvier 2026", "Opening balances, 1 January 2026",
       [(a, d, c, ce, lb) for a, d, c, ce, lb in OPENING], piece="AN-2026")

# --------------------------------------------------------------------------- products

ORIGINS = [
    ("Bresil Cerrado", "Brazil Cerrado", 5.10),
    ("Ethiopie Sidamo", "Ethiopia Sidamo", 7.80),
    ("Colombie Huila", "Colombia Huila", 6.40),
    ("Guatemala Antigua", "Guatemala Antigua", 6.90),
    ("Perou bio", "Peru organic", 6.15),
]
STD_GREEN_PRICE = 6.10          # standard cost of green coffee, EUR per kg
STD_YIELD = 0.84                # standard roasting yield, 16 % weight loss
STD_PACKAGING = 0.78            # bags, valves, labels, EUR per kg roasted
STD_CONVERSION = 1.35           # labour and energy absorbed, EUR per kg roasted
STD_COST = r2(STD_GREEN_PRICE / STD_YIELD + STD_PACKAGING + STD_CONVERSION)

PRICES = {           # EUR per kg, excluding VAT
    "BTQ": 27.90,
    "WEB": 26.40,
    "GRO": 14.30,
}

state = {
    "till": 1_450.0,
    "green_kg": 10_300.0, "green_val": 61_450.0,
    "pack_val": 8_260.0,
    "fg_kg": 2_780.0, "fg_val": 24_180.0,
    "supplier": 39_870.0, "customer": 57_300.0,
    "vat_out": 0.0, "vat_in": 0.0,
}

lots: list[dict] = [{"ref": "LOT-000", "origin_fr": "Melange, stock initial",
                     "origin_en": "Blend, opening inventory", "date": "2025-12-18",
                     "kg_in": 10_300.0, "kg_left": 10_300.0, "price": 5.97, "value": 61_450.0}]
batches: list[dict] = []
open_items: list[dict] = []
lot_no = 0
batch_no = 0

# Delais de paiement, tels qu'ils s'ecrivent sur une facture francaise.
# "30 jours fin de mois" n'est pas "30 jours" : on ajoute 30 jours, puis on repousse
# au dernier jour du mois atteint. Le code de commerce plafonne a 60 jours date de
# facture, ou 45 jours fin de mois (article L441-10).
TERMS = {
    "comptant": ("Comptant", "On receipt", 0, False),
    "30n": ("30 jours nets", "30 days net", 30, False),
    "30fdm": ("30 jours fin de mois", "30 days end of month", 30, True),
    "45fdm": ("45 jours fin de mois", "45 days end of month", 45, True),
}


def last_day_of(d: date) -> date:
    return date(d.year + (d.month == 12), (d.month % 12) + 1, 1) - timedelta(days=1)


def due_date(invoice_day: date, terms: str) -> date:
    _, _, days, end_of_month = TERMS[terms]
    d = invoice_day + timedelta(days=days)
    return last_day_of(d) if end_of_month else d


# nom, ville, SIREN fictif, delai, commande mini en kg, commande maxi en kg
# Les volumes different d'un client a l'autre, c'est ce qui donne aux montants une
# dispersion realiste : un petit cafe prend 8 kg, un grossiste en prend 600.
TRADE_CUSTOMERS = [
    ("Cafe des Artisans", "Lyon 1er", "000 111 222", "30fdm", 9, 26),
    ("Hotel Bellecour", "Lyon 2e", "000 222 333", "45fdm", 60, 190),
    ("Restaurant La Passerelle", "Lyon 6e", "000 333 444", "30n", 18, 48),
    ("Epicerie Bonne Graine", "Villeurbanne", "000 444 555", "30fdm", 25, 90),
    ("Bureau Partage Confluence", "Lyon 2e", "000 555 666", "45fdm", 12, 35),
    ("Boulangerie Saint-Jean", "Lyon 5e", "000 666 777", "30n", 14, 40),
    ("Cantine Numerique", "Villeurbanne", "000 777 888", "45fdm", 30, 110),
    ("Grossiste Rhone Cafes", "Corbas", "000 888 999", "45fdm", 280, 620),
    ("Chaine Le Comptoir", "Lyon 3e", "000 999 111", "30fdm", 120, 340),
]

# Penalites de retard : taux directeur BCE majore de dix points, plus l'indemnite
# forfaitaire de recouvrement de 40 EUR (articles L441-10 et D441-5 du code de commerce).
BCE_RATE = 0.0215
LATE_RATE = BCE_RATE + 0.10
RECOVERY_FEE = 40.0

invoices: list[dict] = []
invoice_no = 0

# --------------------------------------------------------------------------- monthly


def month_days(y: int, m: int) -> list[date]:
    d = date(y, m, 1)
    out = []
    while d.month == m and d <= END:
        out.append(d)
        d += timedelta(days=1)
    return out


def buy_green(day: date) -> None:
    global lot_no
    lot_no += 1
    fr, en, base = random.choice(ORIGINS)
    kg = random.choice([600, 900, 900, 1200])
    price = r2(base * random.uniform(0.94, 1.09))
    ht = r2(kg * price)
    vat = r2(ht * VAT_FOOD)
    ref = f"LOT-{lot_no:03d}"
    B.post(day, "AC", f"Cafe vert {fr}, {kg} kg a {price:.2f} EUR, lot {ref}",
           f"Green coffee {en}, {kg} kg at {price:.2f} EUR, lot {ref}",
           [("601000", ht, 0, "TOR", f"Cafe vert {fr}, lot {ref}"),
            ("445660", vat, 0, None, "TVA deductible 5,5 %"),
            ("401000", 0, r2(ht + vat), None, "Fournisseur Belco")], piece=ref)
    B.post(day, "ST", f"Entree en stock du lot {ref}, {kg} kg",
           f"Lot {ref} into inventory, {kg} kg",
           [("310000", ht, 0, None, f"Stock de cafe vert, lot {ref}"),
            ("603100", 0, ht, "TOR", "Variation des stocks de cafe vert")], piece=ref)
    state["green_kg"] += kg
    state["green_val"] += ht
    state["supplier"] += ht + vat
    state["vat_in"] += vat
    lots.append({"ref": ref, "origin_fr": fr, "origin_en": en, "date": day.isoformat(),
                 "kg_in": kg, "kg_left": float(kg), "price": price, "value": ht})


def buy_packaging(day: date) -> None:
    ht = r2(random.uniform(1450, 2300))
    vat = r2(ht * VAT_STANDARD)
    B.post(day, "AC", "Sachets, valves et etiquettes", "Bags, valves and labels",
           [("602100", ht, 0, "TOR", "Emballages et fournitures"),
            ("445660", vat, 0, None, "TVA deductible 20 %"),
            ("401000", 0, r2(ht + vat), None, "Fournisseur Packstore")])
    B.post(day, "ST", "Entree en stock des emballages", "Packaging into inventory",
           [("320000", ht, 0, None, "Stock d'emballages"),
            ("603200", 0, ht, "TOR", "Variation des stocks d'emballages")])
    state["pack_val"] += ht
    state["supplier"] += ht + vat
    state["vat_in"] += vat


def roast(day: date, target_kg: float) -> None:
    """Consume green coffee, produce roasted coffee at standard cost, keep the variance."""
    global batch_no
    if state["green_kg"] < 260:
        return
    batch_no += 1
    green_kg = min(round(target_kg / STD_YIELD, 0), state["green_kg"] - 120)
    if green_kg < 60:
        return
    # actual yield drifts below standard: the finding the demo is built around
    actual_yield = random.uniform(0.795, 0.845)
    roasted_kg = r2(green_kg * actual_yield)

    # FIFO on the green lots, at their real purchase price
    need, green_cost, used = green_kg, 0.0, []
    for lot in lots:
        if need <= 0.01 or lot["kg_left"] <= 0:
            continue
        take = min(lot["kg_left"], need)
        lot["kg_left"] = r2(lot["kg_left"] - take)
        green_cost += take * lot["price"]
        used.append({"ref": lot["ref"], "kg": r2(take), "price": lot["price"]})
        need -= take
    if need > 0.01:                      # opening stock, valued at the standard price
        green_cost += need * STD_GREEN_PRICE
        used.append({"ref": "Stock initial", "kg": r2(need), "price": STD_GREEN_PRICE})
    green_cost = r2(green_cost)
    pack_cost = r2(roasted_kg * STD_PACKAGING)

    standard_value = r2(roasted_kg * STD_COST)
    actual_cost = r2(green_cost + pack_cost + roasted_kg * STD_CONVERSION)
    variance = r2(actual_cost - standard_value)          # positive: costlier than standard
    # split it the way a cost accountant would: quantity first, then price
    green_allowed = roasted_kg / STD_YIELD               # green the standard allows for this output
    var_qty = r2((green_kg - green_allowed) * STD_GREEN_PRICE)
    var_price = r2(green_cost - green_kg * STD_GREEN_PRICE)
    # the published standard cost is rounded to the cent, which leaves a few centimes a batch
    var_round = r2(variance - var_qty - var_price)

    ref = f"TOR-{batch_no:03d}"
    B.post(day, "ST", f"Sortie de cafe vert, brassin {ref}, {green_kg:.0f} kg",
           f"Green coffee issued, batch {ref}, {green_kg:.0f} kg",
           [("603100", green_cost, 0, "TOR", "Consommation de cafe vert"),
            ("310000", 0, green_cost, None, "Stock de cafe vert")], piece=ref)
    B.post(day, "ST", f"Sortie d'emballages, brassin {ref}",
           f"Packaging issued, batch {ref}",
           [("603200", pack_cost, 0, "TOR", "Consommation d'emballages"),
            ("320000", 0, pack_cost, None, "Stock d'emballages")], piece=ref)
    B.post(day, "ST",
           f"Production du brassin {ref}, {roasted_kg:.1f} kg au cout standard de {STD_COST:.2f} EUR",
           f"Batch {ref} produced, {roasted_kg:.1f} kg at the standard cost of {STD_COST:.2f} EUR",
           [("355000", standard_value, 0, None, f"Stock de cafe torrefie, brassin {ref}"),
            ("713500", 0, standard_value, "TOR", "Production stockee")], piece=ref)

    state["green_kg"] = r2(state["green_kg"] - green_kg)
    state["green_val"] = r2(state["green_val"] - green_cost)
    state["pack_val"] = r2(state["pack_val"] - pack_cost)
    state["fg_kg"] = r2(state["fg_kg"] + roasted_kg)
    state["fg_val"] = r2(state["fg_val"] + standard_value)
    batches.append({"ref": ref, "date": day.isoformat(), "green_kg": green_kg,
                    "roasted_kg": roasted_kg, "yield": round(actual_yield, 4),
                    "std_yield": STD_YIELD, "green_cost": green_cost,
                    "std_value": standard_value, "actual_cost": actual_cost,
                    "variance": variance, "var_qty": var_qty, "var_price": var_price,
                    "var_round": var_round,
                    "green_allowed": r2(green_allowed), "lots": used})


def factor_of(day: date) -> float:
    return SEASON[day.month]


def sell(day: date, centre: str, kg: float, counter: float = 0.0) -> None:
    """A day of sales in one channel. Cash for the shop, account for trade customers."""
    if state["fg_kg"] < kg:
        return
    ht = r2(kg * PRICES[centre])
    vat = r2(ht * VAT_FOOD)
    cost = r2(kg * STD_COST)
    lines_fr = {"BTQ": "Ventes de la boutique", "WEB": "Commandes en ligne",
                "GRO": "Livraison professionnels"}[centre]
    lines_en = {"BTQ": "Shop sales", "WEB": "Online orders",
                "GRO": "Trade delivery"}[centre]

    if centre == "BTQ":
        extra_ht = r2(counter)
        extra_vat = r2(extra_ht * VAT_COUNTER)
        total = r2(ht + vat + extra_ht + extra_vat)
        state["till"] = r2(state.get("till", 1_450.0) + total)
        lines = [("530000", total, 0, None, "Encaissements de la journee"),
                 ("701000", 0, ht, "BTQ", f"{kg:.1f} kg de cafe torrefie"),
                 ("445710", 0, vat, None, "TVA collectee 5,5 %")]
        if extra_ht:
            lines += [("706000", 0, extra_ht, "BTQ", "Bar et degustations"),
                      ("445710", 0, extra_vat, None, "TVA collectee 10 %")]
        B.post(day, "CA", f"{lines_fr}, {day.strftime('%d/%m')}",
               f"{lines_en}, {day.strftime('%d/%m')}", lines)
        state["vat_out"] += vat + extra_vat
    elif centre == "WEB":
        # une commande en ligne, pas un total de journee : des montants de 12 a 120 EUR.
        # Le port suit le poids par tranches, comme chez n'importe quel transporteur :
        # un montant fige et repete mille fois fausserait toute analyse statistique.
        # tarif au poids, pas par tranche : une tranche donne le meme montant mille fois
        ship_ht = r2(3.60 + 1.45 * kg)
        ship_vat = r2(ship_ht * VAT_STANDARD)
        total = r2(ht + vat + ship_ht + ship_vat)
        B.post(day, "VE", f"Commande en ligne {kg:.2f} kg, {day.strftime('%d/%m')}",
               f"Online order {kg:.2f} kg, {day.strftime('%d/%m')}",
               [("512000", total, 0, None, "Encaissement Stripe"),
                ("701000", 0, ht, "WEB", f"{kg:.2f} kg de cafe torrefie"),
                ("708500", 0, ship_ht, "WEB", "Port facture"),
                ("445710", 0, vat, None, "TVA collectee 5,5 %"),
                ("445710", 0, ship_vat, None, "TVA collectee 20 %")])
        state["vat_out"] += vat + ship_vat
    else:
        global invoice_no
        name, city, siren, terms, lo, hi = random.choice(TRADE_CUSTOMERS)
        # le volume vient du client, pas de l'appelant : c'est lui qui sait ce qu'il commande
        kg = r2(random.uniform(lo, hi) * factor_of(day))
        if state["fg_kg"] < kg:
            return
        ht = r2(kg * PRICES[centre])
        vat = r2(ht * VAT_FOOD)
        cost = r2(kg * STD_COST)
        total = r2(ht + vat)
        due = due_date(day, terms)
        invoice_no += 1
        ref = f"FA-2026-{invoice_no:04d}"
        e = B.post(day, "VE", f"Facture {ref}, {name}, {kg:.0f} kg",
                   f"Invoice {ref}, {name}, {kg:.0f} kg",
                   [("411000", total, 0, None, f"Client {name}, facture {ref}"),
                    ("701000", 0, ht, "GRO", f"{kg:.0f} kg de cafe torrefie"),
                    ("445710", 0, vat, None, "TVA collectee 5,5 %")],
                   piece=ref)
        state["customer"] += total
        state["vat_out"] += vat
        slow = name in ("Cantine Numerique", "Bureau Partage Confluence")
        # choisi sans toucher au generateur aleatoire : un tirage de plus ici decalerait
        # toute la simulation en aval (achats, brassins, tresorerie)
        blend, blend_en, _ = ORIGINS[invoice_no % len(ORIGINS)]
        invoices.append({
            "ref": ref, "entry": e["number"], "date": day.isoformat(), "due": due.isoformat(),
            "customer": name, "city": city, "siren": siren, "terms": terms,
            "kg": kg, "unit_price": PRICES["GRO"], "ht": ht, "vat": vat, "vat_rate": VAT_FOOD,
            "total": total, "blend_fr": blend, "blend_en": blend_en,
        })
        open_items.append({"customer": name, "entry": e["number"], "invoice": ref,
                           "date": day.isoformat(), "due": due.isoformat(), "amount": total,
                           "terms": terms, "slow": slow, "settled": False})

    B.post(day, "ST", f"Sortie de stock au cout standard, {lines_fr.lower()}",
           f"Inventory issued at standard cost, {lines_en.lower()}",
           [("713500", cost, 0, centre, "Destockage de produits finis"),
            ("355000", 0, cost, None, "Stock de cafe torrefie")])
    state["fg_kg"] = r2(state["fg_kg"] - kg)
    state["fg_val"] = r2(state["fg_val"] - cost)


def settle_customers(day: date) -> None:
    for item in open_items:
        if item["settled"]:
            continue
        due = date.fromisoformat(item["due"])
        if item.get("slow"):
            due = due + timedelta(days=random.choice([28, 35, 46, 62]))
        if (due - timedelta(days=4)) <= day and random.random() < 0.9:
            B.post(day, "BQ", f"Reglement facture {item['invoice']}, {item['customer']}",
                   f"Payment of invoice {item['invoice']}, {item['customer']}",
                   [("512000", item["amount"], 0, None, "Virement recu"),
                    ("411000", 0, item["amount"], None,
                     f"Client {item['customer']}, facture {item['invoice']}")],
                   piece=item["invoice"])
            item["paid_on"] = day.isoformat()
            item["settled"] = True
            state["customer"] = r2(state["customer"] - item["amount"])


def bank_the_till(day: date) -> None:
    amount = r2(state["till"] - 400.0)
    if amount < 200:
        return
    B.post(day, "CA", "Remise en banque des especes", "Cash banked",
           [("512000", amount, 0, None, "Remise de la semaine"),
            ("530000", 0, amount, None, "Caisse de la boutique")])
    state["till"] = r2(state["till"] - amount)


def settle_opening(day: date, amount: float) -> None:
    """The customers who owed money on 31 December pay during January."""
    B.post(day, "BQ", "Reglement de creances de l'exercice precedent",
           "Payment of receivables carried forward",
           [("512000", amount, 0, None, "Virements recus"),
            ("411000", 0, amount, None, "Clients, factures 2025")])
    state["customer"] = r2(state["customer"] - amount)


def pay_suppliers(day: date) -> None:
    amount = r2(state["supplier"] * random.uniform(0.55, 0.75))
    if amount < 500:
        return
    B.post(day, "BQ", "Reglement des fournisseurs", "Supplier payment run",
           [("401000", amount, 0, None, "Fournisseurs"),
            ("512000", 0, amount, None, "Virements emis")])
    state["supplier"] = r2(state["supplier"] - amount)


def monthly_costs(day: date, m: int) -> None:
    last = day
    # rent
    rent_shop, rent_works = 2_150.0, 2_480.0
    vat = r2((rent_shop + rent_works) * VAT_STANDARD)
    B.post(last, "BQ", f"Loyers du mois {m:02d}", f"Rent, month {m:02d}",
           [("613200", rent_shop, 0, "BTQ", "Loyer de la boutique"),
            ("613200", rent_works, 0, "TOR", "Loyer de l'atelier"),
            ("445660", vat, 0, None, "TVA deductible 20 %"),
            ("512000", 0, r2(rent_shop + rent_works + vat), None, "Prelevement du bailleur")])
    state["vat_in"] += vat

    # payroll
    gross = {"TOR": 8_200.0, "BTQ": 4_000.0, "WEB": 1_400.0, "GRO": 1_600.0, "ADM": 1_800.0}
    total_gross = r2(sum(r2(v) for v in gross.values()))
    employer = r2(total_gross * 0.42)
    net = r2(total_gross * 0.78)
    social = r2(total_gross - net + employer)
    B.post(last, "PA", f"Paie du mois {m:02d}, 7 salaries", f"Payroll, month {m:02d}, 7 people",
           [("641100", v, 0, c, f"Salaires bruts, {c}") for c, v in gross.items()] +
           [("645100", employer, 0, "ADM", "Charges patronales"),
            ("421000", 0, net, None, "Net a payer"),
            ("431000", 0, social, None, "Cotisations sociales")])
    B.post(last, "BQ", f"Virement des salaires nets, mois {m:02d}",
           f"Net wages paid, month {m:02d}",
           [("421000", net, 0, None, "Net a payer"),
            ("512000", 0, net, None, "Virements de paie")])
    if m % 3 == 0:
        due = r2(social * 3)
        B.post(last, "BQ", "Reglement des charges sociales du trimestre",
               "Quarterly social contributions paid",
               [("431000", due, 0, None, "Organismes sociaux"),
                ("512000", 0, due, None, "Virement Urssaf")])

    # energy, insurance, marketing, fees, misc
    energy = r2(random.uniform(1_560, 2_240))
    vat_e = r2(energy * VAT_STANDARD)
    B.post(last, "BQ", f"Electricite et gaz, mois {m:02d}", f"Electricity and gas, month {m:02d}",
           [("606100", r2(energy * 0.78), 0, "TOR", "Energie de l'atelier"),
            ("606100", r2(energy - r2(energy * 0.78)), 0, "BTQ", "Energie de la boutique"),
            ("445660", vat_e, 0, None, "TVA deductible 20 %"),
            ("512000", 0, r2(energy + vat_e), None, "Prelevement Enedis")])
    state["vat_in"] += vat_e

    ins = 412.0
    B.post(last, "BQ", "Assurance multirisque", "Business insurance",
           [("616000", ins, 0, "ADM", "Prime mensuelle"),
            ("512000", 0, ins, None, "Prelevement assureur")])

    mkt = r2(random.uniform(1_100, 1_950))
    vat_m = r2(mkt * VAT_STANDARD)
    B.post(last, "BQ", f"Marketing et communication, mois {m:02d}",
           f"Marketing and communication, month {m:02d}",
           [("623100", mkt, 0, "MKT", "Campagnes et contenus"),
            ("445660", vat_m, 0, None, "TVA deductible 20 %"),
            ("512000", 0, r2(mkt + vat_m), None, "Prelevements divers")])
    state["vat_in"] += vat_m

    fees = 540.0
    vat_f = r2(fees * VAT_STANDARD)
    B.post(last, "BQ", "Honoraires de l'expert comptable", "Accountant fees",
           [("622600", fees, 0, "ADM", "Honoraires mensuels"),
            ("445660", vat_f, 0, None, "TVA deductible 20 %"),
            ("512000", 0, r2(fees + vat_f), None, "Virement cabinet")])
    state["vat_in"] += vat_f

    ship = r2(random.uniform(1_250, 1_980))
    vat_s = r2(ship * VAT_STANDARD)
    B.post(last, "BQ", f"Transporteur, mois {m:02d}", f"Carrier, month {m:02d}",
           [("624100", r2(ship * 0.62), 0, "WEB", "Expeditions en ligne"),
            ("624100", r2(ship - r2(ship * 0.62)), 0, "GRO", "Livraisons professionnelles"),
            ("445660", vat_s, 0, None, "TVA deductible 20 %"),
            ("512000", 0, r2(ship + vat_s), None, "Prelevement transporteur")])
    state["vat_in"] += vat_s

    misc = r2(random.uniform(180, 520))
    vat_x = r2(misc * VAT_STANDARD)
    B.post(last, "BQ", "Petit equipement et entretien", "Small equipment and maintenance",
           [("606300", misc, 0, "TOR", "Filtres, outillage, entretien"),
            ("445660", vat_x, 0, None, "TVA deductible 20 %"),
            ("512000", 0, r2(misc + vat_x), None, "Achats divers")])
    state["vat_in"] += vat_x

    bank = 68.0
    B.post(last, "BQ", "Frais bancaires", "Bank charges",
           [("627000", bank, 0, "ADM", "Commissions du mois"),
            ("512000", 0, bank, None, "Frais preleves")])

    # loan: 118 400 EUR left at the start, 1.9 % a year
    rate = 0.019 / 12
    interest = r2(state.get("loan", 118_400.0) * rate)
    principal = 1_640.0
    state["loan"] = r2(state.get("loan", 118_400.0) - principal)
    B.post(last, "BQ", "Echeance de l'emprunt torrefacteur", "Loan instalment, roaster",
           [("164000", principal, 0, None, "Capital rembourse"),
            ("661100", interest, 0, "ADM", "Interets"),
            ("512000", 0, r2(principal + interest), None, "Prelevement de la banque")])

    # depreciation
    d1, d2, d3, d4 = r2(146_000 / 120), r2(58_400 / 108), r2(11_900 / 48), r2(6_800 / 36)
    dep = r2(d1 + d2 + d3 + d4)
    B.post(last, "OD", f"Dotation aux amortissements, mois {m:02d}",
           f"Depreciation charge, month {m:02d}",
           [("681100", dep, 0, "TOR", "Dotation du mois"),
            ("281540", 0, d1, None, "Torrefacteur"),
            ("281350", 0, d2, None, "Agencement"),
            ("281830", 0, d3, None, "Materiel de bureau"),
            ("280500", 0, d4, None, "Logiciel")])

    # VAT settlement for the month
    out_, in_ = r2(state["vat_out"]), r2(state["vat_in"])
    due = r2(out_ - in_)
    if due > 0:
        B.post(last, "OD", f"TVA du mois {m:02d}, declaration CA3",
               f"VAT return, month {m:02d}",
               [("445710", out_, 0, None, "TVA collectee"),
                ("445660", 0, in_, None, "TVA deductible"),
                ("445510", 0, due, None, "TVA a decaisser")])
        pay_day = min(END, date(last.year, last.month, 20) + timedelta(days=30))
        B.post(pay_day, "BQ", f"Paiement de la TVA du mois {m:02d}",
               f"VAT paid, month {m:02d}",
               [("445510", due, 0, None, "TVA a decaisser"),
                ("512000", 0, due, None, "Teleréglement DGFIP")])
    state["vat_out"], state["vat_in"] = 0.0, 0.0

    if m == 3:
        cfe = 1_890.0
        B.post(last, "BQ", "Cotisation fonciere des entreprises", "Local business tax",
               [("635100", cfe, 0, "ADM", "CFE annuelle"),
                ("512000", 0, cfe, None, "Virement DGFIP")])


# --------------------------------------------------------------------------- the year

# Jours feries 2026 : on ne torrefie pas et on ne facture pas ce jour la.
# Paques tombe le 5 avril 2026, d'ou le lundi 6, l'Ascension le 14 mai et la Pentecote le 25.
HOLIDAYS = {date(2026, 1, 1), date(2026, 4, 6), date(2026, 5, 1), date(2026, 5, 8),
            date(2026, 5, 14), date(2026, 5, 25), date(2026, 7, 14), date(2026, 8, 15)}

for m in range(1, 10):
    days = month_days(2026, m)
    factor = SEASON[m]
    for d in days:
        wd = d.weekday()
        if wd == 6 or d in HOLIDAYS:
            continue
        # on achete quand le stock descend sous trois semaines de consommation,
        # pas au hasard : sinon un jour ferie ou une semaine creuse fait gonfler le stock
        if wd in (0, 2, 3) and state["green_kg"] < 3_500:
            buy_green(d)
        if d.day in (8, 22):
            buy_packaging(d)

        if wd < 5 or wd == 5:
            sell(d, "BTQ", r2(random.uniform(9.5, 19.0) * factor),
                 counter=r2(random.uniform(70, 210) * factor))
        if wd < 5:
            # trois a huit commandes en ligne par jour, de 250 g a 4 kg
            for _ in range(random.randint(2, 5)):
                sell(d, "WEB", r2(random.uniform(0.25, 4.0)))
        # deux a quatre livraisons professionnelles par jour ouvre, chaque client
        # commandant selon son propre profil
        if wd < 5:
            for _ in range(random.randint(1, 3)):
                sell(d, "GRO", 0)

        # roast to cover what leaves, plus a little to build the buffer back up
        if wd < 5:
            # on ne torrefie pas la meme quantite tous les jours : le torrefacteur tourne
            # selon les commandes du jour et la place disponible
            cover = 900 * factor / 5 * random.uniform(.55, 1.5) + (25 if state["fg_kg"] < 2_100 else 0)
            roast(d, r2(cover))

        if wd == 0:
            bank_the_till(d)
        if m == 1 and d.day in (9, 16, 23):
            settle_opening(d, 19_100.0)
        if wd in (1, 4):
            settle_customers(d)
        if wd == 4:
            pay_suppliers(d)
    monthly_costs(days[-1], m)

# --------------------------------------------------------------------------- statements

def build() -> dict:
    balances: dict[str, dict[str, float]] = {}
    for e in B.entries:
        for l in e["lines"]:
            b = balances.setdefault(l["account"], {"debit": 0.0, "credit": 0.0})
            b["debit"] += l["debit"]
            b["credit"] += l["credit"]
    for b in balances.values():
        b["debit"], b["credit"] = r2(b["debit"]), r2(b["credit"])
        b["balance"] = r2(b["debit"] - b["credit"])

    td = r2(sum(b["debit"] for b in balances.values()))
    tc = r2(sum(b["credit"] for b in balances.values()))
    assert abs(td - tc) < 0.05, f"trial balance does not tie: {td} vs {tc}"

    def bal(num: str) -> float:
        return balances.get(num, {"balance": 0.0})["balance"]

    def group(prefixes: tuple[str, ...]) -> float:
        return r2(sum(v["balance"] for k, v in balances.items() if k.startswith(prefixes)))

    # income statement, PCG, by nature
    sales = r2(-group(("701", "706", "708")))
    stored = r2(-bal("713500"))
    op_income = r2(sales + stored)
    purchases = group(("601", "602"))
    stock_change = group(("603",))
    other_purchases = group(("606",))
    external = group(("613", "615", "616", "622", "623", "624", "626", "627"))
    taxes = group(("635",))
    wages = group(("641",))
    social = group(("645",))
    depreciation = group(("681",))
    op_charges = r2(purchases + stock_change + other_purchases + external + taxes +
                    wages + social + depreciation)
    op_result = r2(op_income - op_charges)
    financial = r2(-group(("661",)))
    net = r2(op_result + financial)

    # balance sheet
    gross_fixed = group(("205", "213", "215", "218"))
    dep_fixed = r2(-group(("280", "281")))
    inventory = group(("310", "320", "355"))
    receivables = bal("411000")
    vat_in = bal("445660")
    cash = r2(bal("512000") + bal("530000"))
    assets = r2(gross_fixed - dep_fixed + inventory + receivables + vat_in + cash)

    capital = r2(-bal("101000"))
    reserve = r2(-bal("106100"))
    retained = r2(-bal("110000"))
    loans = r2(-bal("164000"))
    payables = r2(-bal("401000"))
    wages_due = r2(-bal("421000"))
    social_due = r2(-bal("431000"))
    vat_due = r2(-(bal("445510") + bal("445710")))
    equity_and_liabilities = r2(capital + reserve + retained + net + loans + payables +
                                wages_due + social_due + vat_due)
    assert abs(assets - equity_and_liabilities) < 0.05, \
        f"balance sheet does not balance: {assets} vs {equity_and_liabilities}"

    # analytic centres
    centres = []
    for code, fr, en, kind in CENTRES:
        inc = r2(-sum(l["credit"] - l["debit"] for e in B.entries for l in e["lines"]
                      if l["centre"] == code and l["account"][0] == "7") * -1)
        income = r2(sum(l["credit"] - l["debit"] for e in B.entries for l in e["lines"]
                        if l["centre"] == code and l["account"][0] == "7"))
        charges = r2(sum(l["debit"] - l["credit"] for e in B.entries for l in e["lines"]
                         if l["centre"] == code and l["account"][0] == "6"))
        centres.append({"code": code, "fr": fr, "en": en, "kind": kind,
                        "income": income, "charges": charges, "result": r2(income - charges)})

    # monthly series, with the cash balance at the end of each month and the material margin
    months = []
    cash_run = 0.0
    for m in range(1, 10):
        inc = ch = 0.0
        sales_m = mat_m = 0.0
        for e in B.entries:
            if int(e["date"][5:7]) != m or e["date"][:4] != "2026":
                continue
            for l in e["lines"]:
                a = l["account"]
                if a[0] == "7":
                    inc += l["credit"] - l["debit"]
                    if a.startswith(("701", "706", "708")):
                        sales_m += l["credit"] - l["debit"]
                elif a[0] == "6":
                    ch += l["debit"] - l["credit"]
                    if a.startswith(("601", "602", "603")):
                        mat_m += l["debit"] - l["credit"]
                if a.startswith(("512", "530")):
                    cash_run += l["debit"] - l["credit"]
        months.append({"month": m, "income": r2(inc), "charges": r2(ch), "result": r2(inc - ch),
                       "cash": r2(cash_run),
                       "margin": r2((sales_m - mat_m) / sales_m * 100) if sales_m else 0.0})

    # roasting variance, the management finding
    total_green = r2(sum(b["green_kg"] for b in batches))
    total_roasted = r2(sum(b["roasted_kg"] for b in batches))
    real_yield = round(total_roasted / total_green, 4)
    green_allowed = r2(total_roasted / STD_YIELD)
    excess_green = r2(total_green - green_allowed)
    lost_kg = r2(total_green * (STD_YIELD - real_yield))
    variance_total = r2(sum(b["variance"] for b in batches))
    variance_qty = r2(sum(b["var_qty"] for b in batches))
    variance_price = r2(sum(b["var_price"] for b in batches))
    variance_round = r2(sum(b["var_round"] for b in batches))
    avg_green_price = r2(sum(b["green_cost"] for b in batches) / total_green)
    assert abs(variance_qty + variance_price + variance_round - variance_total) < 1.0,         "variance split does not tie"

    # receivables ageing
    ageing = {"current": 0.0, "d30": 0.0, "d60": 0.0, "d90": 0.0, "over": 0.0}
    open_now = []
    for it in open_items:
        if it["settled"]:
            continue
        late = (END - date.fromisoformat(it["due"])).days
        key = ("current" if late <= 0 else "d30" if late <= 30 else "d60" if late <= 60
               else "d90" if late <= 90 else "over")
        ageing[key] = r2(ageing[key] + it["amount"])
        # penalites de retard : montant x taux x jours / 365, plus l'indemnite forfaitaire
        penalty = r2(it["amount"] * LATE_RATE * late / 365) if late > 0 else 0.0
        open_now.append({**it, "late": late, "penalty": penalty,
                         "fee": RECOVERY_FEE if late > 0 else 0.0,
                         "terms_fr": TERMS[it["terms"]][0], "terms_en": TERMS[it["terms"]][1]})
    open_now.sort(key=lambda x: (-x["late"], -x["amount"]))

    # delai moyen de reglement reellement constate, sur les factures payees
    paid = [i for i in open_items if i.get("paid_on")]
    dso = (round(sum((date.fromisoformat(i["paid_on"]) - date.fromisoformat(i["date"])).days
                     for i in paid) / len(paid), 1) if paid else 0.0)

    return {
        "meta": {**COMPANY, "generated": date.today().isoformat(),
                 "entries": len(B.entries),
                 "lines": sum(len(e["lines"]) for e in B.entries),
                 "total_debit": td, "total_credit": tc},
        "accounts": [{"num": n, "fr": fr, "en": en, "kind": k,
                      "debit": balances.get(n, {}).get("debit", 0.0),
                      "credit": balances.get(n, {}).get("credit", 0.0),
                      "balance": balances.get(n, {}).get("balance", 0.0)}
                     for n, fr, en, k in ACCOUNTS],
        "journals": [{"code": c, "fr": fr, "en": en,
                      "count": sum(1 for e in B.entries if e["journal"] == c)}
                     for c, fr, en in JOURNALS],
        "centres": centres,
        "entries": B.entries,
        "income_statement": {
            "sales": sales, "stored": stored, "op_income": op_income,
            "purchases": purchases, "stock_change": stock_change,
            "other_purchases": other_purchases, "external": external, "taxes": taxes,
            "wages": wages, "social": social, "depreciation": depreciation,
            "op_charges": op_charges, "op_result": op_result,
            "financial": financial, "net": net,
        },
        "balance_sheet": {
            "gross_fixed": gross_fixed, "dep_fixed": dep_fixed,
            "net_fixed": r2(gross_fixed - dep_fixed),
            "inventory_green": bal("310000"), "inventory_pack": bal("320000"),
            "inventory_fg": bal("355000"), "inventory": inventory,
            "receivables": receivables, "vat_in": vat_in, "cash": cash,
            "bank": bal("512000"), "till": bal("530000"), "assets": assets,
            "capital": capital, "reserve": reserve, "retained": retained, "result": net,
            "loans": loans, "payables": payables, "wages_due": wages_due,
            "social_due": social_due, "vat_due": vat_due,
            "equity": r2(capital + reserve + retained + net),
            "liabilities": r2(loans + payables + wages_due + social_due + vat_due),
            "total": equity_and_liabilities,
        },
        "months": months,
        "production": {
            "batches": batches[-40:], "batch_count": len(batches),
            "green_kg": total_green, "roasted_kg": total_roasted,
            "yield": real_yield, "std_yield": STD_YIELD,
            "lost_kg": lost_kg, "variance": variance_total,
            "variance_qty": variance_qty, "variance_price": variance_price,
            "variance_round": variance_round,
            "green_allowed": green_allowed, "excess_green": excess_green,
            "avg_green_price": avg_green_price,
            "std_cost": STD_COST, "std_green": STD_GREEN_PRICE,
            "std_packaging": STD_PACKAGING, "std_conversion": STD_CONVERSION,
        },
        "inventory": {
            "lots": [l for l in lots if l["kg_left"] > 0.05][-30:],
            "green_kg": state["green_kg"], "fg_kg": state["fg_kg"],
        },
        "receivables": {
            "ageing": ageing, "open": open_now[:20], "total": r2(sum(ageing.values())),
            "late_total": r2(sum(o["amount"] for o in open_now if o["late"] > 0)),
            "penalties": r2(sum(o["penalty"] + o["fee"] for o in open_now)),
            "dso": dso, "paid_count": len(paid),
            "late_rate": round(LATE_RATE, 4), "bce_rate": BCE_RATE, "fee": RECOVERY_FEE,
        },
        "invoices": invoices,
        "terms": [{"code": k, "fr": v[0], "en": v[1], "days": v[2], "eom": v[3]}
                  for k, v in TERMS.items()],
    }


books = build()

# --------------------------------------------------------------------------- FEC

def fec() -> str:
    head = ("JournalCode|JournalLib|EcritureNum|EcritureDate|CompteNum|CompteLib|"
            "CompAuxNum|CompAuxLib|PieceRef|PieceDate|EcritureLib|Debit|Credit|"
            "EcritureLet|DateLet|ValidDate|Montantdevise|Idevise")
    rows = [head]
    for e in B.entries:
        d = e["date"].replace("-", "")
        for l in e["lines"]:
            acc = ACC_BY_NUM[l["account"]]
            rows.append("|".join([
                e["journal"], JOURNAL_NAMES[e["journal"]][0], e["number"], d,
                l["account"], acc[1], "", "", e["piece"], d, l["label"],
                f"{l['debit']:.2f}".replace(".", ","), f"{l['credit']:.2f}".replace(".", ","),
                "", "", d, "", "",
            ]))
    return "\n".join(rows)


out = Path(__file__).parent / "public" / "data"
out.mkdir(parents=True, exist_ok=True)
(out / "books.json").write_text(json.dumps(books, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
(out / "fec-2026.txt").write_text(fec(), encoding="utf-8")

i = books["income_statement"]
b = books["balance_sheet"]
p = books["production"]
print(f"entries           {books['meta']['entries']:>12,}")
print(f"lines             {books['meta']['lines']:>12,}")
print(f"debit = credit    {books['meta']['total_debit']:>12,.2f}")
print(f"sales             {i['sales']:>12,.2f}")
print(f"operating result  {i['op_result']:>12,.2f}")
print(f"net result        {i['net']:>12,.2f}")
print(f"balance sheet     {b['assets']:>12,.2f} = {b['total']:,.2f}")
print(f"cash              {b['cash']:>12,.2f}")
print(f"receivables       {b['receivables']:>12,.2f}")
print(f"inventory         {b['inventory']:>12,.2f}")
print(f"roasted kg        {p['roasted_kg']:>12,.1f}  yield {p['yield']*100:.1f} % vs {p['std_yield']*100:.0f} %")
print(f"variance          {p['variance']:>12,.2f}  lost kg {p['lost_kg']:,.0f}")
r = books["receivables"]
print(f"invoices          {len(invoices):>12,}")
print(f"open / late       {len(r['open']):>12}  late {r['late_total']:,.2f}")
print(f"DSO reel          {r['dso']:>12} jours sur {r['paid_count']} factures payees")
print(f"json bytes        {(out / 'books.json').stat().st_size:>12,}")
