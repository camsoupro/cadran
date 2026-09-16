# Cadran, a public accounting demonstration

A double entry accounting system shown on the books of a **fictional** coffee roastery,
kept under the French *plan comptable général*, in euros, over nine months of trading.

The site is **read only**: there is no server, no database and no way to write an entry.
Everything a visitor sees is recomputed in the browser from a single file of journal entries.

- **2 006 entries, 5 611 ledger lines**, generated day by day by `generate.py`
- Perpetual inventory, standard cost per kilo, and the variances that decide the year
- Analytic centres, income statement by nature, balance sheet, trial balance, general ledger
- **113 numbered invoices** carrying the statutory French particulars, printable
- **French payment terms** done properly: 30 days end of month is not 30 days
- **Payment reminders** with late interest at the statutory rate and the 40 EUR recovery charge
- **FEC export**, the French legal accounting file, 18 pipe separated columns
- A tutorial in eight steps for readers who have never opened a ledger
- French and English, day and night, no tracking, no cookies

## The figure the demonstration is built around

The company loses **16 046 EUR** over nine months. The material variances account for
**86 % of that loss**: 5 434 EUR because the roaster lost more weight than the standard
allows, 8 355 EUR because green coffee was bought above the standard price. Neither is a
commercial problem, and an income statement alone does not show it.

## Why it is arithmetically true

`generate.py` simulates the business and posts every transaction through one `post()` function
that refuses an entry whose debits and credits differ by more than half a cent. It then rebuilds
the statements from those entries and asserts that

- the trial balance ties, total debit equals total credit,
- the balance sheet balances, assets equal equity plus liabilities,
- the six analytic centres add back to the net result,
- the material variance splits exactly into quantity, price and the rounding of the published
  standard cost.

If any of those fails, no data file is written. The front end never computes a total of its own:
it reads what the engine produced.

## Run it locally

```
python generate.py          # writes public/data/books.json and public/data/fec-2026.txt
cd public && python -m http.server 8040
```

Then open http://localhost:8040

## Deploy

Static hosting, no build step. On Vercel, the output directory is `public` (see `vercel.json`).
Every push to `main` redeploys.

## What is fictional and what is not

The company, its customers, its figures and its bank balance are invented. The accounting
rules are not: the chart of accounts, the VAT rates (5.5 % on coffee to take away, 10 % at the
counter, 20 % on delivery and services), the payment terms and their statutory cap, the late
payment interest at the ECB rate plus ten points, the 40 EUR recovery charge, the posting rules
and the FEC format all follow French practice. Public holidays are observed: the workshop does
not roast on 1 January or 14 July.

## Authorship

Specified, directed and reviewed by **Camilla Bouyahia**. The scope, the accounting rules to be
covered, the economic conclusions and every review decision are hers. The code was written with
Claude (Anthropic) under her direction, including the request to test the generated figures
against Benford's law, which the first version failed.

Copyright 2026 Camilla Bouyahia. Published as a portfolio piece, not as a product.
