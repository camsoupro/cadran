# Cadran, a public accounting demonstration

A double entry accounting system shown on the books of a **fictional** coffee roastery,
kept under the French *plan comptable général*, in euros, over nine months of trading.

The site is **read only**: there is no server, no database and no way to write an entry.
Everything a visitor sees is recomputed in the browser from a single file of journal entries.

- **2 079 entries, 5 808 ledger lines**, generated day by day by `generate.py`
- Perpetual inventory, standard cost per kilo, and the **yield variance** that decides the year
- Analytic centres, income statement by nature, balance sheet, trial balance, general ledger
- **FEC export**, the French legal accounting file, 18 pipe separated columns
- A tutorial in eight steps for readers who have never opened a ledger
- French and English, day and night, no tracking, no cookies

## Why it is arithmetically true

`generate.py` simulates the business and posts every transaction through one `post()` function
that refuses an entry whose debits and credits differ by more than half a cent. It then rebuilds
the statements from those entries and asserts that

- the trial balance ties, total debit equals total credit,
- the balance sheet balances, assets equal equity plus liabilities,
- the six analytic centres add back to the net result.

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

## What is fictional and what is not

The company, its customers, its figures and its bank balance are invented. The accounting
rules are not: the chart of accounts, the VAT rates (5.5 % on coffee to take away, 10 % at the
counter, 20 % on delivery and services), the posting rules and the FEC format follow French
practice.

Designed and built by Camilla Bouyahia.
