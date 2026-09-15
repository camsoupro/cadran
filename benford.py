"""
Test de Benford sur les livres de la demonstration.

La loi de Benford dit que dans une population de montants issus de processus
multiplicatifs et couvrant plusieurs ordres de grandeur, le premier chiffre
significatif vaut 1 dans 30,1 % des cas, 2 dans 17,6 %, et ainsi de suite
jusqu'a 4,6 % pour le 9.

C'est le premier test de detection de fraude qu'un auditeur passe sur un journal.
On regarde ici le premier chiffre et le deuxieme chiffre, avec le khi deux et
l'ecart absolu moyen (MAD) et les seuils de Nigrini.

    python benford.py
"""

from __future__ import annotations

import json
import math
from collections import Counter
from pathlib import Path

EXPECTED_1 = {d: math.log10(1 + 1 / d) for d in range(1, 10)}
EXPECTED_2 = {
    d: sum(math.log10(1 + 1 / (10 * k + d)) for k in range(1, 10)) for d in range(0, 10)
}

# Seuils de Nigrini sur l'ecart absolu moyen, premier chiffre
MAD_1 = [(0.006, "conformite etroite"), (0.012, "conformite acceptable"),
         (0.015, "conformite marginale"), (9, "non conformite")]
# Khi deux critique a 5 %, 8 degres de liberte pour le premier chiffre, 9 pour le second
CHI2_CRIT = {8: 15.507, 9: 16.919}


def first_digit(x: float) -> int | None:
    x = abs(x)
    if x < 1e-9:
        return None
    while x < 1:
        x *= 10
    while x >= 10:
        x /= 10
    return int(x)


def second_digit(x: float) -> int | None:
    x = abs(x)
    if x < 1e-9:
        return None
    while x < 10:
        x *= 10
    while x >= 100:
        x /= 10
    return int(x) % 10


def mad_verdict(mad: float) -> str:
    for limit, label in MAD_1:
        if mad < limit:
            return label
    return "non conformite"


def analyse(values: list[float], title: str, digit: str = "first") -> dict:
    fn = first_digit if digit == "first" else second_digit
    digits = [d for d in (fn(v) for v in values) if d is not None]
    n = len(digits)
    expected = EXPECTED_1 if digit == "first" else EXPECTED_2
    counts = Counter(digits)
    chi2 = 0.0
    mad = 0.0
    rows = []
    for d in sorted(expected):
        obs = counts.get(d, 0)
        exp = expected[d] * n
        chi2 += (obs - exp) ** 2 / exp if exp else 0
        mad += abs(obs / n - expected[d]) if n else 0
        rows.append((d, obs, obs / n * 100 if n else 0, expected[d] * 100))
    mad /= len(expected)
    df = 8 if digit == "first" else 9
    print(f"\n{title}  ({n:,} montants)")
    print("  chiffre   observe      attendu      ecart")
    for d, obs, pct, exp_pct in rows:
        bar = "#" * int(round(pct / 1.2))
        print(f"    {d}     {pct:6.2f} %     {exp_pct:6.2f} %   {pct - exp_pct:+6.2f}  {bar}")
    print(f"  khi deux {chi2:8.2f}   (critique a 5 % : {CHI2_CRIT[df]})  "
          f"{'conforme' if chi2 < CHI2_CRIT[df] else 'ecart significatif'}")
    print(f"  MAD      {mad:8.5f}   {mad_verdict(mad)}")
    return {"n": n, "chi2": round(chi2, 2), "mad": round(mad, 5),
            "verdict": mad_verdict(mad), "rows": rows}


books = json.loads((Path(__file__).parent / "public" / "data" / "books.json").read_text(encoding="utf-8"))

lines = [l for e in books["entries"] for l in e["lines"]]
amounts = [l["debit"] or l["credit"] for l in lines]
amounts = [a for a in amounts if a > 0]

print("=" * 72)
print("TEST DE BENFORD, LIVRES DE LA BRULERIE DU CADRAN")
print("=" * 72)
print(f"{len(books['entries']):,} ecritures, {len(lines):,} lignes, "
      f"montants de {min(amounts):,.2f} a {max(amounts):,.2f} EUR")

out = {}
out["toutes_lignes"] = analyse(amounts, "Premier chiffre, toutes les lignes du journal")
out["second"] = analyse(amounts, "Deuxieme chiffre, toutes les lignes du journal", "second")

# les ecritures repetitives (loyer, assurance, paie) faussent la population :
# un auditeur regarde aussi les montants distincts
uniques = sorted(set(round(a, 2) for a in amounts))
out["montants_distincts"] = analyse(uniques, "Premier chiffre, montants distincts seulement")

# par journal, comme le ferait un auditeur qui cherche ou ca coince
for code in ("VE", "AC", "BQ", "CA", "ST", "PA", "OD"):
    vals = [l["debit"] or l["credit"] for e in books["entries"] if e["journal"] == code
            for l in e["lines"] if (l["debit"] or l["credit"]) > 0]
    if len(vals) >= 300:
        out[code] = analyse(vals, f"Premier chiffre, journal {code}")

# les ventes seules, la population la plus scrutee en audit
sales = [l["credit"] for e in books["entries"] for l in e["lines"]
         if l["account"].startswith(("701", "706", "708")) and l["credit"] > 0]
out["ventes"] = analyse(sales, "Premier chiffre, comptes de produits")

print("\n" + "=" * 72)
print("LECTURE")
print("=" * 72)
print("""
La loi de Benford suppose des montants qui couvrent plusieurs ordres de grandeur
et qui naissent de processus multiplicatifs. Un journal complet remplit en general
cette condition : il melange des ventes de 40 EUR et des immobilisations de 146 000.

Une population etroite ne la remplit pas. Des ventes de detail toutes comprises
entre 300 et 450 EUR commenceront presque toutes par 3 ou 4, et Benford les
rejettera sans qu'il y ait la moindre anomalie. C'est une limite du test, pas une
fraude : il se lit en connaissant la population.
""")
