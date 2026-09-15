// Every page of the demonstration. Each one returns a DOM node and, when it holds
// a 3D scene, a cleanup function the router calls before leaving.
import { t, pick, lang } from "./i18n.js";
import { h, num, money, pct, kg, date, dateAuto, monthName, tone, table, section, reading, figure,
  callout, bars, badge, countUp, revealAll } from "./ui.js";
import { trend, sparkline, ageing } from "./charts.js";
import { mountBalance, mountCentres } from "./scenes.js";

const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const accName = a => pick(a.fr, a.en);
const memo = e => pick(e.memo_fr, e.memo_en);
const centreName = c => pick(c.fr, c.en);
const centreKind = c => t(c.kind === "cost" ? "ceKindCost" : c.kind === "profit" ? "ceKindProfit" : "ceKindSupport");

function accountOf(D, num_) { return D.accounts.find(a => a.num === num_); }

function entrySheet(D, e) {
  const lines = e.lines.map(l => {
    const a = accountOf(D, l.account);
    return { ...l, name: a ? accName(a) : l.account };
  });
  const td = lines.reduce((s, l) => s + l.debit, 0);
  const tc = lines.reduce((s, l) => s + l.credit, 0);
  return h("div", { class: "entry-sheet" },
    h("div", { class: "entry-top" },
      h("span", { class: "ref", text: e.number }),
      h("span", { class: "caps", text: date(e.date, true) }),
      h("span", { class: "caps", text: t("cJournal") + " " + e.journal }),
      h("span", { class: "memo", text: memo(e) }),
      h("span", { class: "stamp" },
        h("span", { html: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5 9.5 18 20 6.5"/></svg>` }),
        t("posted"))),
    table([
      { label: t("cAccount"), c: true, render: l => l.account },
      { label: t("cLabel"), render: l => h("span", {}, l.name, h("small", { text: l.label })) },
      { label: t("cCentre"), c: true, render: l => l.centre || "" },
      { label: t("cDebit"), n: true, render: l => l.debit ? num(l.debit) : "" },
      { label: t("cCredit"), n: true, render: l => l.credit ? num(l.credit) : "" },
    ], lines, {
      foot: h("tr", {}, h("td", {}), h("td", { text: t("cTotals") }), h("td", {}),
        h("td", { class: "n", text: num(td) }), h("td", { class: "n", text: num(tc) })),
    }));
}

// ============================================================== overview

async function overview(D, go) {
  const i = D.income_statement, b = D.balance_sheet, p = D.production, m = D.meta;
  const st = D.stress || {};
  const profit = Math.abs(i.net);
  const materials = i.purchases + i.stock_change;
  const materialMargin = i.sales - materials;
  const root = h("div", {});

  const scaleBox = h("div", { class: "scene", id: "scaleScene" });
  const hero = h("div", { class: "hero reveal" },
    h("div", {},
      h("h2", { class: "head" }, t("ovTitle"), " ",
        h("em", { text: money(profit, { compact: true }) }), t("ovTitleEnd")),
      h("p", {
        class: "lede",
        text: t("ovLede", {
          sales: money(i.sales, { compact: true }),
          kg: num(p.roasted_kg, 0),
          profit: money(profit, { compact: true }),
          entries: num(m.entries, 0),
        }),
      }),
      h("div", { class: "chips" },
        h("span", { class: "chip" }, t("ovEntries"), " ", h("b", { text: num(m.entries, 0) })),
        h("span", { class: "chip" }, t("ovDebits"), " ", h("b", { text: money(m.total_debit, { compact: true }) })),
        h("span", { class: "chip" }, t("ovCredits"), " ", h("b", { text: money(m.total_credit, { compact: true }) })),
        h("span", { class: "chip" }, t("ovOutOfBalance"), " ", h("b", { class: "pos", text: "0" })))),
    h("div", {}, scaleBox, h("p", { class: "scene-note", text: t("ovScaleNote") })));

  const figs = h("div", { class: "figs reveal" },
    figure(t("kNet"), "", t("kNetNote"), tone(i.net)),
    figure(t("kSales"), "", t("kSalesNote")),
    figure(t("kCash"), "", t("kCashNote")),
    figure(t("kMargin"), "", t("kMarginNote")));
  const figVals = [
    [i.net, v => money(v, { compact: true })],
    [i.sales, v => money(v, { compact: true })],
    [b.cash, v => money(v, { compact: true })],
    [materialMargin / i.sales * 100, v => pct(v)],
  ];
  const sparks = [
    [D.months.map(x => x.result), css("--neg")],
    [D.months.map(x => x.income), css("--accent")],
    [D.months.map(x => x.cash), css("--info")],
    [D.months.map(x => x.margin), css("--pos")],
  ];
  [...figs.children].forEach((el, k) => {
    const [value, render] = figVals[k];
    countUp(el.querySelector(".v"), value, render);
    const spark = h("svg", { class: "spark" });
    el.append(spark);
    sparkline(spark, sparks[k][0], sparks[k][1]);
  });

  const finding = h("section", { class: "reveal" },
    callout(t("ovFinding"), t("ovFindingText", {
      excess: num(p.excess_green, 0),
      real: num(p.yield * 100, 1),
      std: num(p.std_yield * 100, 0),
      qty: money(p.variance_qty),
      price: money(p.variance_price),
      avg: money(p.avg_green_price),
      stdp: money(p.std_green),
      times: num(p.variance / Math.abs(i.net), 1),
    })),
    h("p", { style: { marginTop: "16px" } },
      h("a", { href: "#/production", class: "btn primary", text: t("ovSeeProduction") })));

  const top = (st.ranked || [])[0];
  const fragile = !top ? null : h("section", { class: "reveal" },
    callout(t("ovFragile"), t("ovFragileText", {
      customer: st.doubtful_customer, n: st.doubtful_count,
      amount: money(st.allowance_booked), result: money(i.net),
      exposure: money(st.exposure_total), top: top.customer,
      topAmount: money(top.ht), after: money(top.result_after),
    })),
    h("p", { style: { marginTop: "16px" } },
      h("a", { href: "#/receivables", class: "btn primary", text: t("ovSeeReceivables") })));

  const chart = h("svg", { class: "chart" });
  const months = section(t("ovMonths"), t("ovMonthsSub"),
    reading(t("ovMonthsRead")), chart,
    h("div", { class: "legend" },
      h("span", {}, h("i", { style: { borderColor: "var(--accent)" } }), t("lgIncome")),
      h("span", {}, h("i", { style: { borderColor: "var(--ink-3)", borderTopStyle: "dashed" } }), t("lgCharges")),
      h("span", {}, h("i", { class: "sq", style: { background: "var(--pos)" } }), t("lgAbove")),
      h("span", {}, h("i", { class: "sq", style: { background: "var(--neg)" } }), t("lgBelow"))));
  months.classList.add("reveal");

  const centreBox = h("div", { class: "scene", id: "centreScene" });
  const centres = section(t("ovCentres"), t("ovCentresSub"),
    reading(t("ovCentresRead")),
    h("div", { class: "side" },
      h("div", {}, centreBox, h("p", { class: "scene-note", text: t("hoverVolume") })),
      table([
        { label: t("cCentre"), render: c => h("span", {}, centreName(c), h("small", { text: c.code + ", " + centreKind(c) })) },
        { label: t("cIncome"), n: true, render: c => c.income ? num(c.income, 0) : "-" },
        { label: t("cCharges"), n: true, render: c => c.charges ? num(c.charges, 0) : "-" },
        { label: t("cResult"), n: true, cls: c => tone(c.result), render: c => num(c.result, 0) },
      ], D.centres, {
        foot: h("tr", {}, h("td", { text: t("iNet") }),
          h("td", { class: "n", text: num(D.centres.reduce((s, c) => s + c.income, 0), 0) }),
          h("td", { class: "n", text: num(D.centres.reduce((s, c) => s + c.charges, 0), 0) }),
          h("td", { class: "n " + tone(i.net), text: num(i.net, 0) })),
      })));
  centres.classList.add("reveal");

  const last = D.entries[D.entries.length - 1];
  const lastSec = section(t("ovLast"), t("ovLastSub"), entrySheet(D, last));
  lastSec.classList.add("reveal");

  const recent = D.entries.slice(-9).reverse();
  const latest = section(t("ovLatest"), t("ovLatestSub"),
    table([
      { label: t("cEntry"), c: true, render: e => e.number },
      { label: t("cDate"), render: e => dateAuto(e.date) },
      { label: t("cMemo"), render: e => memo(e) },
      { label: t("cJournal"), c: true, render: e => e.journal },
      { label: t("cAmount"), n: true, render: e => num(e.total) },
    ], recent, { onRow: () => go("#/journal") }));
  latest.classList.add("reveal");
  latest.querySelector(".sec-head").append(
    h("span", { class: "right" }, h("a", { href: "#/journal", class: "btn", text: t("seeAll") })));

  const why = h("section", { class: "reveal" }, callout(t("whyTitle"), t("whyText")));
  root.append(hero, figs, why, finding, fragile, months, centres, lastSec, latest);

  const disposers = [];
  queueMicrotask(async () => {
    trend(chart, D.months, {
      band: t("mResult"),
      months: D.months.map(mm => monthName(mm.month)),
    }, v => money(v, { compact: true }));
    disposers.push(await mountBalance(scaleBox, [
      { label: t("ovDebits"), value: money(m.total_debit, { compact: true }) },
      { label: t("ovCredits"), value: money(m.total_credit, { compact: true }) },
    ]));
    disposers.push(await mountCentres(centreBox, D.centres.map(c => ({
      code: c.code, name: centreName(c), kind: centreKind(c), result: c.result, income: c.income, charges: c.charges,
    })), {
      money,
      line: c => `${t("cIncome")} ${num(c.income, 0)} &middot; ${t("cCharges")} ${num(c.charges, 0)} &middot; ${t("cResult")} ${num(c.result, 0)}`,
    }));
  });
  return { node: root, cleanup: () => disposers.forEach(d => d && d()) };
}

// ============================================================== journal

function journal(D, go) {
  const root = h("div", {});
  const detail = h("div", { style: { marginBottom: "26px" } });
  let shown = 100, query = "", jrnl = "";

  const list = h("div", {});
  const count = h("span", { class: "count" });

  const draw = () => {
    const q = query.trim().toLowerCase();
    const rows = D.entries.filter(e =>
      (!jrnl || e.journal === jrnl) &&
      (!q || memo(e).toLowerCase().includes(q) || e.number.toLowerCase().includes(q)))
      .slice().reverse();
    count.textContent = t("jShowing", { n: num(rows.length, 0) });
    list.innerHTML = "";
    if (!rows.length) { list.append(h("p", { class: "muted", text: t("jNone") })); return; }
    list.append(table([
      { label: t("cEntry"), c: true, render: e => e.number },
      { label: t("cDate"), render: e => dateAuto(e.date) },
      { label: t("cMemo"), render: e => memo(e) },
      { label: t("cJournal"), c: true, hide: true, render: e => e.journal },
      { label: t("cPiece"), c: true, hide: true, render: e => e.piece },
      { label: t("cAmount"), n: true, render: e => num(e.total) },
    ], rows.slice(0, shown), {
      onRow: e => {
        detail.innerHTML = "";
        detail.append(entrySheet(D, e));
        detail.scrollIntoView({ behavior: "smooth", block: "start" });
      },
    }));
    if (rows.length > shown) {
      list.append(h("p", { style: { marginTop: "16px" } },
        h("button", { class: "btn", text: t("jMore"), onclick: () => { shown += 100; draw(); } })));
    }
  };

  const filters = h("div", { class: "filters" },
    h("input", {
      type: "search", placeholder: t("jSearch"),
      oninput: e => { query = e.target.value; shown = 100; draw(); },
    }),
    h("select", { onchange: e => { jrnl = e.target.value; shown = 100; draw(); } },
      h("option", { value: "", text: t("jAll") }),
      D.journals.map(j => h("option", { value: j.code, text: `${j.code} ${pick(j.fr, j.en)} (${j.count})` }))),
    count);

  root.append(section(t("jTitle"), null,
    reading(t("jRead", { n: num(D.meta.entries, 0) })), detail, filters, list));
  draw();
  return { node: root };
}

// ============================================================== ledger

function ledger(D, go) {
  const root = h("div", {});
  const moved = D.accounts.filter(a => a.debit || a.credit);
  let current = moved.find(a => a.num === "512000") || moved[0];
  const box = h("div", {});

  const draw = () => {
    const rows = [];
    let running = 0;
    for (const e of D.entries) {
      for (const l of e.lines) {
        if (l.account !== current.num) continue;
        running += l.debit - l.credit;
        rows.push({ e, l, running });
      }
    }
    box.innerHTML = "";
    box.append(
      h("p", { class: "caps", style: { marginBottom: "12px" } },
        `${current.num} ${accName(current)} · ${t("lMovements", { n: num(rows.length, 0) })}`),
      table([
        { label: t("cEntry"), c: true, render: r => r.e.number },
        { label: t("cDate"), render: r => dateAuto(r.e.date) },
        { label: t("cLabel"), render: r => r.l.label },
        { label: t("cCentre"), c: true, hide: true, render: r => r.l.centre || "" },
        { label: t("cDebit"), n: true, render: r => r.l.debit ? num(r.l.debit) : "" },
        { label: t("cCredit"), n: true, render: r => r.l.credit ? num(r.l.credit) : "" },
        { label: t("lRunning"), n: true, render: r => num(r.running) },
      ], rows.slice(-150), {
        foot: h("tr", {}, h("td", { colspan: 4, text: t("cTotals") }),
          h("td", { class: "n", text: num(current.debit) }),
          h("td", { class: "n", text: num(current.credit) }),
          h("td", { class: "n", text: num(current.balance) })),
      }));
  };

  const select = h("select", {
    onchange: e => { current = moved.find(a => a.num === e.target.value); draw(); },
  }, moved.map(a => h("option", { value: a.num, selected: a.num === current.num, text: `${a.num} ${accName(a)}` })));

  root.append(section(t("lTitle"), null, reading(t("lRead")),
    h("div", { class: "filters" }, h("span", { class: "caps", text: t("lPick") }), select), box));
  draw();
  return { node: root };
}

// ============================================================== trial balance

function trial(D) {
  const moved = D.accounts.filter(a => a.debit || a.credit);
  const rows = [];
  const classes = t("tClasses");
  for (let c = 1; c <= 7; c++) {
    const inClass = moved.filter(a => a.num[0] === String(c));
    if (!inClass.length) continue;
    rows.push({ head: classes[c - 1] });
    inClass.forEach(a => rows.push({ a }));
  }
  const td = moved.reduce((s, a) => s + a.debit, 0);
  const tc = moved.reduce((s, a) => s + a.credit, 0);

  const body = table([
    { label: t("cAccount"), c: true, render: r => r.head ? "" : r.a.num },
    { label: t("cLabel"), render: r => r.head ? h("b", { text: r.head }) : accName(r.a) },
    { label: t("cDebit"), n: true, hide: true, render: r => r.head ? "" : num(r.a.debit) },
    { label: t("cCredit"), n: true, hide: true, render: r => r.head ? "" : num(r.a.credit) },
    { label: t("cBalance"), n: true, cls: r => r.head ? "" : tone(r.a.balance), render: r => r.head ? "" : num(r.a.balance) },
  ], rows, {
    foot: h("tr", {}, h("td", {}), h("td", { text: t("cTotals") }),
      h("td", { class: "n", text: num(td) }), h("td", { class: "n", text: num(tc) }),
      h("td", { class: "n pos", text: num(td - tc) })),
  });
  body.querySelectorAll("tbody tr").forEach((tr, k) => { if (rows[k].head) tr.classList.add("head-row"); });
  return { node: h("div", {}, section(t("tTitle"), null, reading(t("tRead")), body)) };
}

// ============================================================== income statement

function income(D) {
  const i = D.income_statement;
  const line = (label, value, cls = "") => ({ label, value, cls });
  const rows = [
    { head: t("iOpIncome") },
    line(t("iSales"), i.sales),
    line(t("iStored"), i.stored),
    { total: true, label: t("iOpIncome"), value: i.op_income },
    { head: t("iOpCharges") },
    line(t("iPurchases"), i.purchases),
    line(t("iStockChange"), i.stock_change),
    line(t("iOther"), i.other_purchases),
    line(t("iExternal"), i.external),
    line(t("iTaxes"), i.taxes),
    line(t("iWages"), i.wages),
    line(t("iSocial"), i.social),
    line(t("iDepreciation"), i.depreciation),
    { total: true, label: t("iOpCharges"), value: i.op_charges },
    { total: true, label: t("iOpResult"), value: i.op_result, cls: tone(i.op_result) },
    line(t("iFinancial"), i.financial, tone(i.financial)),
    { total: true, label: t("iNet"), value: i.net, cls: tone(i.net) },
  ];
  const body = table([
    { label: "", render: r => r.head ? h("b", { text: r.head }) : r.label },
    { label: t("cAmount"), n: true, cls: r => r.cls || "", render: r => r.head ? "" : num(r.value) },
  ], rows);
  body.querySelectorAll("tbody tr").forEach((tr, k) => {
    if (rows[k].head) tr.classList.add("head-row");
    if (rows[k].total) tr.classList.add("total");
  });
  return {
    node: h("div", {}, section(t("iTitle"), null, reading(t("iRead")), body,
      callout(t("iConsumed"), t("iConsumedNote", {
        p: num(i.purchases), v: num(i.stock_change),
      }) + " <b>" + num(i.purchases + i.stock_change) + "</b>"))),
  };
}

// ============================================================== balance sheet

function balance(D) {
  const b = D.balance_sheet;
  const col = (rows, total) => table([
    { label: "", render: r => r.sub ? h("span", { class: "muted", text: r.label }) : r.label },
    { label: t("cAmount"), n: true, render: r => num(r.value) },
  ], rows, {
    foot: h("tr", {}, h("td", { text: t("bTotal") }), h("td", { class: "n", text: num(total) })),
  });

  const assets = [
    { label: t("bFixed"), value: b.net_fixed },
    { label: t("bGross"), value: b.gross_fixed, sub: true },
    { label: t("bDep"), value: -b.dep_fixed, sub: true },
    { label: t("bInventory"), value: b.inventory },
    { label: t("bGreen"), value: b.inventory_green, sub: true },
    { label: t("bPack"), value: b.inventory_pack, sub: true },
    { label: t("bFinished"), value: b.inventory_fg, sub: true },
    { label: t("bReceivables"), value: b.receivables },
    { label: t("bVatIn"), value: b.vat_in },
    { label: t("bCash"), value: b.cash },
    { label: t("bBank"), value: b.bank, sub: true },
    { label: t("bTill"), value: b.till, sub: true },
  ];
  const liab = [
    { label: t("bEquity"), value: b.equity },
    { label: t("bCapital"), value: b.capital, sub: true },
    { label: t("bReserve"), value: b.reserve, sub: true },
    { label: t("bRetained"), value: b.retained, sub: true },
    { label: t("bResult"), value: b.result, sub: true },
    { label: t("bLoans"), value: b.loans },
    { label: t("bPayables"), value: b.payables },
    { label: t("bWages"), value: b.wages_due },
    { label: t("bSocial"), value: b.social_due },
    { label: t("bVatDue"), value: b.vat_due },
  ];
  const mark = node => {
    node.querySelectorAll("tbody tr").forEach((tr, k) => {
      const src = node === left ? assets : liab;
      if (src[k].sub) tr.classList.add("sub");
    });
    return node;
  };
  const left = col(assets, b.assets);
  const right = col(liab, b.total);
  mark(left); mark(right);

  return {
    node: h("div", {}, section(t("bTitle"), null, reading(t("bRead")),
      h("div", { class: "two" },
        h("div", {}, h("p", { class: "caps", style: { marginBottom: "10px" }, text: t("bAssets") }), left),
        h("div", {}, h("p", { class: "caps", style: { marginBottom: "10px" }, text: t("bLiabilities") }), right)),
      h("p", { class: "reading", style: { marginTop: "22px" } },
        h("b", { text: t("bTie") }), " ", num(b.assets), " = ", num(b.total)))),
  };
}

// ============================================================== centres

async function centres(D) {
  const root = h("div", {});
  const box = h("div", { class: "scene" });
  const i = D.income_statement;
  const sec = section(t("ceTitle"), null, reading(t("ceRead")),
    h("div", {}, box, h("p", { class: "scene-note", text: t("hoverVolume") })),
    table([
      { label: t("cCentre"), render: c => h("span", {}, centreName(c), h("small", { text: c.code + ", " + centreKind(c) })) },
      { label: t("cIncome"), n: true, render: c => c.income ? num(c.income) : "-" },
      { label: t("cCharges"), n: true, render: c => c.charges ? num(c.charges) : "-" },
      { label: t("cResult"), n: true, cls: c => tone(c.result), render: c => num(c.result) },
    ], D.centres, {
      foot: h("tr", {}, h("td", { text: t("iNet") }),
        h("td", { class: "n", text: num(D.centres.reduce((s, c) => s + c.income, 0)) }),
        h("td", { class: "n", text: num(D.centres.reduce((s, c) => s + c.charges, 0)) }),
        h("td", { class: "n " + tone(i.net), text: num(i.net) })),
    }));
  root.append(sec);
  const disposers = [];
  queueMicrotask(async () => {
    disposers.push(await mountCentres(box, D.centres.map(c => ({
      code: c.code, name: centreName(c), kind: centreKind(c), result: c.result, income: c.income, charges: c.charges,
    })), {
      money,
      line: c => `${t("cIncome")} ${num(c.income, 0)} &middot; ${t("cCharges")} ${num(c.charges, 0)} &middot; ${t("cResult")} ${num(c.result, 0)}`,
    }));
  });
  return { node: root, cleanup: () => disposers.forEach(d => d && d()) };
}

// ============================================================== production

function production(D) {
  const p = D.production, i = D.income_statement;
  const stdRows = [
    { label: t("prGreenStd") + ` (${num(p.std_green)} / ${num(p.std_yield, 2)})`, value: p.std_green / p.std_yield },
    { label: t("prPack"), value: p.std_packaging },
    { label: t("prConversion"), value: p.std_conversion },
  ];
  const stdTable = table([
    { label: "", render: r => r.label },
    { label: t("cAmount"), n: true, render: r => num(r.value) },
  ], stdRows, {
    foot: h("tr", {}, h("td", { text: t("prStdCost") }), h("td", { class: "n", text: num(p.std_cost) })),
  });

  const splitRows = [
    { label: t("prVarQty"), note: t("prVarQtyNote", { excess: num(p.excess_green, 0) }), value: p.variance_qty },
    { label: t("prVarPrice"), note: t("prVarPriceNote", { avg: money(p.avg_green_price), stdp: money(p.std_green) }), value: p.variance_price },
    { label: t("prVarRound"), note: "", value: p.variance_round },
  ];
  const splitTable = table([
    { label: "", render: r => h("span", {}, r.label, r.note ? h("small", { text: r.note }) : null) },
    { label: t("cAmount"), n: true, cls: r => r.value > 0 ? "neg" : "pos", render: r => num(r.value) },
  ], splitRows, {
    foot: h("tr", {}, h("td", { text: t("prVarTotal") }),
      h("td", { class: "n neg", text: num(p.variance) })),
  });

  const stats = h("div", { class: "figs" },
    figure(t("prYield"), num(p.yield * 100, 1) + " %",
      t("prYieldStd") + " " + num(p.std_yield * 100, 0) + " %", p.yield < p.std_yield ? "neg" : "pos"),
    figure(t("prGreenUsed"), kg(p.green_kg),
      t("prAllowed") + " " + kg(p.green_allowed)),
    figure(t("prExcess"), kg(p.excess_green),
      t("prBatches", { n: num(p.batch_count, 0) })),
    figure(t("prVarTotal"), money(p.variance),
      t("prVsLoss", { loss: money(Math.abs(i.net)) }), "neg"));

  const batches = p.batches.slice().reverse();
  const bTable = table([
    { label: t("prBatch"), c: true, render: b => b.ref },
    { label: t("cDate"), render: b => dateAuto(b.date) },
    { label: t("prGreenKg"), n: true, render: b => num(b.green_kg, 0) },
    { label: t("prRoastedKg"), n: true, render: b => num(b.roasted_kg, 1) },
    { label: t("prYield"), n: true, cls: b => b.yield < b.std_yield ? "neg" : "pos", render: b => num(b.yield * 100, 1) + " %" },
    { label: t("prStdValue"), n: true, hide: true, render: b => num(b.std_value) },
    { label: t("prVarQty"), n: true, cls: b => b.var_qty > 0 ? "neg" : "pos", render: b => num(b.var_qty) },
    { label: t("prVarPrice"), n: true, cls: b => b.var_price > 0 ? "neg" : "pos", render: b => num(b.var_price) },
  ], batches);

  return {
    node: h("div", {},
      section(t("prTitle"), null,
        reading(t("prRead", { std: num(p.std_yield * 100, 0) })),
        stats,
        h("div", { class: "two", style: { marginTop: "30px" } },
          h("div", {},
            h("p", { class: "caps", style: { marginBottom: "10px" }, text: t("prStdCost") }), stdTable,
            h("p", { class: "caps", style: { margin: "26px 0 10px" }, text: t("prSplit") }), splitTable),
          h("div", {}, callout(t("ovFinding"), t("ovFindingText", {
            excess: num(p.excess_green, 0), real: num(p.yield * 100, 1),
            std: num(p.std_yield * 100, 0), qty: money(p.variance_qty),
            price: money(p.variance_price), avg: money(p.avg_green_price), stdp: money(p.std_green),
            times: num(p.variance / Math.abs(i.net), 1),
          })))),
        h("p", { class: "caps", style: { margin: "34px 0 10px" }, text: t("prTable") }),
        bTable)),
  };
}

// ============================================================== inventory

function inventory(D) {
  const inv = D.inventory, b = D.balance_sheet, p = D.production;
  const lots = inv.lots.slice().reverse();
  return {
    node: h("div", {},
      section(t("invTitle"), null, reading(t("invRead")),
        h("div", { class: "figs" },
          figure(t("bGreen"), money(b.inventory_green, { compact: true }), kg(inv.green_kg)),
          figure(t("bFinished"), money(b.inventory_fg, { compact: true }),
            kg(inv.fg_kg) + ", " + t("invAtStd") + " " + num(p.std_cost)),
          figure(t("bPack"), money(b.inventory_pack, { compact: true }), t("bPack")),
          figure(t("bInventory"), money(b.inventory, { compact: true }), t("bTotal"))),
        h("p", { class: "caps", style: { margin: "30px 0 10px" }, text: t("invLots") }),
        table([
          { label: t("prBatch"), c: true, render: l => l.ref },
          { label: t("invOrigin"), render: l => pick(l.origin_fr, l.origin_en) },
          { label: t("invBought"), render: l => dateAuto(l.date) },
          { label: t("invKgIn"), n: true, hide: true, render: l => num(l.kg_in, 0) },
          { label: t("invKgLeft"), n: true, render: l => num(l.kg_left, 1) },
          { label: t("invPrice"), n: true, render: l => num(l.price) },
          { label: t("invValue"), n: true, render: l => num(l.kg_left * l.price) },
        ], lots))),
  };
}

// ============================================================== receivables

function receivables(D, go) {
  const r = D.receivables;
  const buckets = [
    { key: "current", label: t("recCurrent"), tone: "pos" },
    { key: "d30", label: t("recD30"), tone: "warn" },
    { key: "d60", label: t("recD60"), tone: "warn" },
    { key: "d90", label: t("recD90"), tone: "neg" },
    { key: "over", label: t("recOver"), tone: "neg" },
  ].map(b => ({ ...b, value: r.ageing[b.key] || 0 }));

  const band = h("div", { style: { position: "relative", height: "8px", borderRadius: "99px",
    overflow: "hidden", background: "var(--sunk)", marginBottom: "18px" } });
  ageing(band, buckets);

  const figs = h("div", { class: "figs" },
    figure(t("cTotal"), money(r.total, { compact: true }), t("recOpen")),
    figure(t("recLateTotal"), money(r.late_total, { compact: true }),
      t("recPenalties"), r.late_total ? "neg" : ""),
    figure(t("recDso"), num(r.dso, 1) + " " + pick("jours", "days"),
      t("recDsoNote", { n: num(r.paid_count, 0) })),
    figure(t("remPenalty"), money(r.penalties), t("facLegal", {
      rate: num(r.late_rate * 100, 2), fee: money(r.fee) }).split(".")[0], "warn"));

  const st = D.stress || {};
  const bs = D.balance_sheet;
  const doubtfulBlock = !st.doubtful_count ? null : h("div", {},
    h("p", { class: "caps", style: { margin: "34px 0 10px" }, text: t("recDoubtful") }),
    reading(t("recDoubtfulNote")),
    table([
      { label: t("cInvoice"), c: true, render: d => d.invoice },
      { label: t("cCustomer"), render: d => d.customer },
      { label: t("cDue"), render: d => dateAuto(d.due) },
      { label: t("recLate"), n: true, cls: () => "neg", render: d => d.late + " " + t("recDays") },
      { label: t("cTTC"), n: true, hide: true, render: d => num(d.amount) },
      { label: t("recAllowance"), n: true, cls: () => "neg", render: d => num(d.ht) },
    ], D.doubtful || [], {
      foot: h("tr", {}, h("td", { colspan: 4, text: t("cTotals") }),
        h("td", { class: "n hm", text: num((D.doubtful || []).reduce((a, d) => a + d.amount, 0)) }),
        h("td", { class: "n neg", text: num(st.allowance_booked) })),
    }),
    h("div", { class: "kv", style: { marginTop: "16px", maxWidth: "420px" } },
      h("dl", { class: "kv" },
        h("dt", { text: t("recGross") }), h("dd", { class: "num", text: num(bs.receivables_gross) }),
        h("dt", { text: t("recAllowance") }), h("dd", { class: "num neg", text: "-" + num(bs.allowance) }),
        h("dt", { text: t("recNet") }), h("dd", { class: "num", text: num(bs.receivables) }))));

  const stressBlock = !(st.ranked || []).length ? null : h("div", {},
    h("p", { class: "caps", style: { margin: "34px 0 10px" }, text: t("recStressTitle") }),
    reading(t("recStressNote", { customer: st.doubtful_customer })),
    table([
      { label: t("cCustomer"), render: r2 => r2.customer },
      { label: t("recExposure"), n: true, render: r2 => num(r2.ht) },
      { label: t("recResultAfter"), n: true, cls: r2 => tone(r2.result_after),
        render: r2 => num(r2.result_after) },
    ], st.ranked));

  return {
    node: h("div", {},
      section(t("recTitle"), null, reading(t("recRead")), figs,
        h("p", { class: "reading", style: { marginTop: "26px" }, text: t("recTermsNote") }),
        h("div", { class: "two" },
          h("div", {},
            h("p", { class: "caps", style: { marginBottom: "10px" }, text: t("recAgeing") }),
            band,
            bars(buckets.map(b => ({ label: b.label, value: b.value, tone: b.tone, display: num(b.value) })))),
          h("div", {},
            h("p", { class: "caps", style: { marginBottom: "10px" }, text: t("recOpen") }),
            table([
              { label: t("cInvoice"), c: true, render: o => o.invoice || o.entry },
              { label: t("cCustomer"), render: o => o.customer },
              { label: t("cTerms"), hide: true, render: o => pick(o.terms_fr, o.terms_en) },
              { label: t("cDue"), render: o => dateAuto(o.due) },
              { label: t("recLate"), n: true, cls: o => o.late > 0 ? "neg" : "",
                render: o => o.late > 0 ? o.late + " " + t("recDays") : "-" },
              { label: t("cAmount"), n: true, render: o => num(o.amount) },
            ], r.open, {
              onRow: o => o.late > 0 ? go("#/reminders") : go("#/invoices"),
              foot: h("tr", {}, h("td", { colspan: 5, text: t("cTotal") }),
                h("td", { class: "n", text: num(r.total) })),
            }))),
        doubtfulBlock, stressBlock)),
  };
}

// ============================================================== invoices

function invoiceStatus(D, inv) {
  const open = D.receivables.open.find(o => o.invoice === inv.ref);
  if (!open) return { key: "stPaid", cls: "ok" };
  return open.late > 0 ? { key: "stLate", cls: "late" } : { key: "stOpen", cls: "" };
}

function invoiceSheet(D, inv, go) {
  const m = D.meta, r = D.receivables;
  const open = D.receivables.open.find(o => o.invoice === inv.ref);
  const terms = (D.terms || []).find(x => x.code === inv.terms) || { fr: inv.terms, en: inv.terms };
  const line = (label, value, cls) => h("div", { class: "fac-row" },
    h("span", { text: label }), h("span", { class: "n " + (cls || ""), text: value }));

  return h("div", { class: "invoice" },
    h("div", { class: "fac-head" },
      h("div", {},
        h("p", { class: "caps", text: t("facSupplier") }),
        h("p", { class: "fac-strong", text: m.name }),
        h("p", { class: "fac-small", html:
          `${m.legal}<br>${m.address}<br>${m.postal}<br>SIREN ${m.siren} &middot; ${m.rcs}<br>` +
          `${pick("TVA intracommunautaire", "VAT number")} ${m.vat} &middot; APE ${m.ape}` })),
      h("div", { class: "fac-meta" },
        h("p", { class: "caps", text: t("cInvoice") }),
        h("p", { class: "fac-ref", text: inv.ref }),
        h("p", { class: "fac-small", html:
          `${t("cDate")} : ${date(inv.date, true)}<br>${t("facDue")} ${date(inv.due, true)}<br>` +
          `${t("cTerms")} : ${pick(terms.fr, terms.en)}` }))),

    h("div", { class: "fac-to" },
      h("p", { class: "caps", text: t("facCustomer") }),
      h("p", { class: "fac-strong", text: inv.customer }),
      h("p", { class: "fac-small", html: `${inv.city}<br>SIREN ${inv.siren}` })),

    table([
      { label: t("facDesignation"), render: i2 => t("facLine", { blend: pick(i2.blend_fr, i2.blend_en) }) },
      { label: t("facQty"), n: true, render: i2 => num(i2.kg, 1) + " kg" },
      { label: t("facUnit"), n: true, render: i2 => num(i2.unit_price) },
      { label: t("cVAT"), n: true, render: i2 => num(i2.vat_rate * 100, 1) + " %" },
      { label: t("cHT"), n: true, hide: true, render: i2 => num(i2.ht) },
    ], [inv]),

    h("div", { class: "fac-totals" },
      line(t("cHT"), num(inv.ht)),
      line(t("cVAT") + " " + num(inv.vat_rate * 100, 1) + " %", num(inv.vat)),
      line(t("cTTC"), num(inv.total), "tot")),

    h("div", { class: "fac-legal" },
      h("p", { class: "caps", text: t("facMentions") }),
      h("p", { text: t("facLegal", { rate: num(r.late_rate * 100, 2), fee: money(r.fee) }) }),
      h("p", { class: "fac-small", html:
        `${t("facEntry")} <b>${inv.entry}</b>${open ? "" : " &middot; " + t("stPaid").toLowerCase()}` })),

    h("div", { class: "no-print", style: { marginTop: "20px", display: "flex", gap: "8px" } },
      h("button", { class: "btn primary", text: t("facPrint"), onclick: () => print() }),
      h("button", { class: "btn", text: t("facBack"), onclick: () => go("#/invoices") })));
}

function invoices(D, go) {
  const root = h("div", {});
  const detail = h("div", { style: { marginBottom: "26px" } });
  const rows = (D.invoices || []).slice().reverse();
  if (!rows.length) return { node: section(t("invTitleFac"), null, h("p", { class: "muted", text: "-" })) };

  const list = table([
    { label: t("cInvoice"), c: true, render: i2 => i2.ref },
    { label: t("cDate"), render: i2 => dateAuto(i2.date) },
    { label: t("cCustomer"), render: i2 => i2.customer },
    { label: t("cTerms"), hide: true, render: i2 => { const x = (D.terms || []).find(y => y.code === i2.terms); return x ? pick(x.fr, x.en) : i2.terms; } },
    { label: t("cDue"), render: i2 => dateAuto(i2.due) },
    { label: t("cHT"), n: true, render: i2 => num(i2.ht) },
    { label: t("cTTC"), n: true, render: i2 => num(i2.total) },
    { label: t("cStatus"), render: i2 => { const st = invoiceStatus(D, i2); return badge(t(st.key), st.cls); } },
  ], rows, {
    onRow: inv => {
      detail.innerHTML = "";
      detail.append(invoiceSheet(D, inv, go));
      detail.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    foot: h("tr", {}, h("td", { colspan: 5, text: t("cTotals") }),
      h("td", { class: "n", text: num(rows.reduce((a, b) => a + b.ht, 0)) }),
      h("td", { class: "n", text: num(rows.reduce((a, b) => a + b.total, 0)) }),
      h("td", {})),
  });

  list.classList.add("list-table");
  detail.append(invoiceSheet(D, rows[0], go));
  root.append(section(t("invTitleFac"), null,
    reading(t("invReadFac", { n: num(D.invoices.length, 0) })), detail, list));
  return { node: root };
}

// ============================================================== reminders

function reminders(D, go) {
  const r = D.receivables;
  const late = r.open.filter(o => o.late > 0);
  const root = h("div", {});
  const letterBox = h("div", {});

  if (!late.length) {
    root.append(section(t("remTitle"), null, reading(t("remRead")),
      h("p", { class: "muted", text: t("remNone") })));
    return { node: root };
  }

  const drawLetter = o => {
    const inv = (D.invoices || []).find(i2 => i2.ref === o.invoice);
    letterBox.innerHTML = "";
    letterBox.append(
      h("p", { class: "caps", style: { marginBottom: "10px" }, text: t("remLetter") }),
      h("div", { class: "letter" },
        h("p", { class: "fac-small", html:
          `${D.meta.name}<br>${D.meta.address}, ${D.meta.postal}<br><br>` +
          `<b>${o.customer}</b><br>${inv ? inv.city : ""}<br><br>` +
          `${D.meta.postal.split(" ")[1]}, ${date(D.meta.closed_to, true)}` }),
        h("pre", { class: "letter-body", text: t("remBody", {
          ref: o.invoice, date: date(o.date, true), amount: money(o.amount),
          due: date(o.due, true), days: o.late,
          penalty: money(o.penalty), fee: money(o.fee),
        }) })),
      h("p", { class: "readonly" }, badge(t("readOnly")), t("remNotSent")));
  };

  const list = table([
    { label: t("cInvoice"), c: true, render: o => o.invoice },
    { label: t("cCustomer"), render: o => o.customer },
    { label: t("cDue"), render: o => dateAuto(o.due) },
    { label: t("recLate"), n: true, cls: () => "neg", render: o => o.late + " " + t("recDays") },
    { label: t("cAmount"), n: true, render: o => num(o.amount) },
    { label: t("remPenalty"), n: true, render: o => num(o.penalty) },
    { label: t("remFee"), n: true, hide: true, render: o => num(o.fee) },
    { label: t("remClaim"), n: true, cls: () => "neg",
      render: o => num(o.amount + o.penalty + o.fee) },
  ], late, {
    onRow: drawLetter,
    foot: h("tr", {}, h("td", { colspan: 4, text: t("cTotals") }),
      h("td", { class: "n", text: num(late.reduce((a, b) => a + b.amount, 0)) }),
      h("td", { class: "n", text: num(late.reduce((a, b) => a + b.penalty, 0)) }),
      h("td", { class: "n", text: num(late.reduce((a, b) => a + b.fee, 0)) }),
      h("td", { class: "n neg", text: num(late.reduce((a, b) => a + b.amount + b.penalty + b.fee, 0)) })),
  });

  root.append(section(t("remTitle"), null, reading(t("remRead")), list,
    h("div", { style: { marginTop: "30px" } }, letterBox)));
  drawLetter(late[0]);
  return { node: root };
}

// ============================================================== exports

function exportsPage(D) {
  const head = "JournalCode|JournalLib|EcritureNum|EcritureDate|CompteNum|CompteLib|CompAuxNum|CompAuxLib|PieceRef|PieceDate|EcritureLib|Debit|Credit|EcritureLet|DateLet|ValidDate|Montantdevise|Idevise";
  const sample = D.entries.slice(0, 2).flatMap(e => e.lines.slice(0, 2).map(l => {
    const a = D.accounts.find(x => x.num === l.account);
    const d = e.date.replace(/-/g, "");
    return [e.journal, pick("Operations diverses", "General"), e.number, d, l.account,
      a ? a.fr : "", "", "", e.piece, d, l.label,
      l.debit.toFixed(2).replace(".", ","), l.credit.toFixed(2).replace(".", ","),
      "", "", d, "", ""].join("|");
  }));

  const csv = () => {
    const rows = [["Compte", "Intitule", "Debit", "Credit", "Solde"].join(";")];
    for (const a of D.accounts) {
      if (!a.debit && !a.credit) continue;
      rows.push([a.num, accName(a).replace(/;/g, ","),
        a.debit.toFixed(2).replace(".", ","),
        a.credit.toFixed(2).replace(".", ","),
        a.balance.toFixed(2).replace(".", ",")].join(";"));
    }
    const blob = new Blob(["﻿" + rows.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = h("a", { href: url, download: "balance-cadran-2026.csv" });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  return {
    node: h("div", {},
      section(t("exTitle"), null, reading(t("exRead")),
        h("div", { class: "two" },
          h("div", {},
            h("p", { class: "caps", style: { marginBottom: "8px" }, text: t("exFec") }),
            h("p", { class: "muted", style: { margin: "0 0 14px", fontSize: "12px" }, text: t("exFecSub", { n: num(D.meta.lines, 0) }) }),
            h("a", { class: "btn primary", href: "data/fec-2026.txt", download: "FEC-cadran-2026.txt", text: t("exDownload") })),
          h("div", {},
            h("p", { class: "caps", style: { marginBottom: "8px" }, text: t("exCsv") }),
            h("p", { class: "muted", style: { margin: "0 0 14px", fontSize: "12px" }, text: t("exCsvSub") }),
            h("button", { class: "btn", text: t("exDownload"), onclick: csv }))),
        h("p", { class: "caps", style: { margin: "30px 0 10px" }, text: t("exPreview") }),
        h("div", { class: "entry-sheet", style: { overflowX: "auto" } },
          h("pre", { style: { margin: 0, fontFamily: "var(--mono)", fontSize: "10.5px", lineHeight: "2", whiteSpace: "pre" },
            text: [head, ...sample].join("\n") })))),
  };
}

// ============================================================== record sandbox

const RECIPES = [
  {
    match: ["vendu", "sold", "kg au", "kg to"],
    credit: true,
    fr: "vendu 12 kg au Café des Artisans", en: "sold 12 kg to Cafe des Artisans",
    event: ["Vente à crédit, centre GRO", "Credit sale, centre GRO"],
    rule: ["Vente de produits finis, TVA 5,5 %, puis sortie de stock au coût standard",
      "Sale of finished goods, VAT 5.5 %, then inventory issued at standard cost"],
    lines: [
      ["411000", "Clients", 194.94, 0], ["701000", "Ventes de café torréfié", 0, 184.80],
      ["445710", "TVA collectée 5,5 %", 0, 10.14],
      ["713500", "Variation des stocks de produits finis", 100.68, 0],
      ["355000", "Stock de café torréfié", 0, 100.68],
    ],
  },
  {
    match: ["acheté", "bought", "café vert", "green coffee", "lot"],
    fr: "acheté 600 kg de café vert du Brésil à 5,20 le kilo",
    en: "bought 600 kg of Brazilian green coffee at 5.20 a kilo",
    event: ["Achat de matière première, centre TOR", "Raw material purchase, centre TOR"],
    rule: ["Achat comptabilisé en 601, TVA déductible, puis entrée en stock par le 603",
      "Purchase posted to 601, input VAT, then into inventory through 603"],
    lines: [
      ["601000", "Achats de café vert", 3120.00, 0], ["445660", "TVA déductible 5,5 %", 171.60, 0],
      ["401000", "Fournisseurs", 0, 3291.60],
      ["310000", "Stock de café vert", 3120.00, 0],
      ["603100", "Variation des stocks de café vert", 0, 3120.00],
    ],
  },
  {
    match: ["loyer", "rent"],
    fr: "payé le loyer de la boutique, 2 150", en: "paid the shop rent, 2 150",
    event: ["Charge externe, centre BTQ", "External charge, centre BTQ"],
    rule: ["Loyer en 613, TVA déductible, paiement par banque",
      "Rent to 613, input VAT, paid from the bank"],
    lines: [
      ["613200", "Locations immobilières", 2150.00, 0], ["445660", "TVA déductible 20 %", 430.00, 0],
      ["512000", "Banque", 0, 2580.00],
    ],
  },
  {
    match: ["torréfié", "roasted", "brassin", "batch"],
    fr: "torréfié un brassin de 220 kg de vert", en: "roasted a batch of 220 kg of green",
    event: ["Production, centre TOR", "Production, centre TOR"],
    rule: ["Sortie du vert au premier entré premier sorti, entrée du torréfié au coût standard",
      "Green issued first in first out, roasted coffee in at standard cost"],
    lines: [
      ["603100", "Consommation de café vert", 1338.00, 0], ["310000", "Stock de café vert", 0, 1338.00],
      ["603200", "Consommation d'emballages", 141.13, 0], ["320000", "Stock d'emballages", 0, 141.13],
      ["355000", "Stock de café torréfié", 1519.12, 0],
      ["713500", "Production stockée", 0, 1519.12],
    ],
  },
  {
    match: ["salaire", "paie", "payroll", "wages"],
    fr: "passé la paie du mois", en: "posted this month's payroll",
    event: ["Paie, tous centres", "Payroll, every centre"],
    rule: ["Brut en 641 par centre, charges patronales en 645, net et cotisations au passif",
      "Gross to 641 by centre, employer cost to 645, net pay and contributions as liabilities"],
    lines: [
      ["641100", "Salaires et traitements", 17000.00, 0], ["645100", "Charges de sécurité sociale", 7140.00, 0],
      ["421000", "Personnel, rémunérations dues", 0, 13260.00],
      ["431000", "Sécurité sociale", 0, 10880.00],
    ],
  },
];

function record(D, go) {
  const root = h("div", {});
  const result = h("div", { class: "result", hidden: true });
  const input = h("input", { type: "text", placeholder: t("rPlaceholder") });
  const when = h("input", { type: "date", value: "2026-09-14", min: "2026-01-01", max: "2026-09-30" });
  const termsSel = h("select", {}, (D.terms || []).map(x =>
    h("option", { value: x.code, selected: x.code === "30fdm", text: pick(x.fr, x.en) })));
  const dueLine = h("p", { class: "muted", style: { margin: "10px 0 0", fontSize: "12px" } });

  // "30 jours fin de mois" : on ajoute les jours, puis on repousse au dernier jour du mois.
  const dueDate = (iso, code) => {
    const spec = (D.terms || []).find(x => x.code === code) || { days: 0, eom: false, fr: "-", en: "-" };
    const d = new Date(iso + "T00:00:00");
    d.setDate(d.getDate() + spec.days);
    if (spec.eom) d.setDate(new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate());
    // on reformate a la main : toISOString repasse en UTC et rend la veille a Paris
    const pad = n => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };
  const refreshDue = () => {
    const spec = (D.terms || []).find(x => x.code === termsSel.value) || { fr: "-", en: "-" };
    dueLine.innerHTML = t("rDueExplain", {
      terms: "<b>" + pick(spec.fr, spec.en).toLowerCase() + "</b>",
      date: date(when.value, true),
      due: "<b>" + date(dueDate(when.value, termsSel.value), true) + "</b>",
    });
  };
  when.addEventListener("change", refreshDue);
  termsSel.addEventListener("change", refreshDue);

  // une date ecrite dans la phrase gagne sur le champ: 14/09, 14-09, le 14 septembre
  const MONTHS = ["janvier", "fevrier", "mars", "avril", "mai", "juin", "juillet", "aout",
    "septembre", "october|octobre", "novembre", "decembre"];
  const readDate = text => {
    const clean = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let m = clean.match(/(\d{1,2})[\/\-.](\d{1,2})/);
    if (m) return `2026-${String(+m[2]).padStart(2, "0")}-${String(+m[1]).padStart(2, "0")}`;
    m = clean.match(/(\d{1,2})\s+([a-z]+)/);
    if (m) {
      const idx = MONTHS.findIndex(x => x.split("|").some(w => m[2].startsWith(w.slice(0, 4))));
      if (idx >= 0) return `2026-${String(idx + 1).padStart(2, "0")}-${String(+m[1]).padStart(2, "0")}`;
    }
    return null;
  };

  const show = recipe => {
    result.hidden = false;
    result.innerHTML = "";
    if (!recipe) {
      result.append(h("p", { class: "muted", text: t("rUnknown") }));
      return;
    }
    const td = recipe.lines.reduce((s2, l) => s2 + l[2], 0);
    const tc = recipe.lines.reduce((s2, l) => s2 + l[3], 0);
    const credit = recipe.credit === true;
    result.append(
      h("p", { class: "caps", style: { marginBottom: "10px" }, text: t("rUnderstood") }),
      h("div", { class: "chips", style: { marginTop: 0 } },
        h("span", { class: "chip" }, t("cDate"), " ", h("b", { text: date(when.value, true) })),
        h("span", { class: "chip" }, t("rEvent"), " ", h("b", { text: pick(recipe.event[0], recipe.event[1]) })),
        credit ? h("span", { class: "chip" }, t("cDue"), " ",
          h("b", { text: date(dueDate(when.value, termsSel.value), true) })) : null,
        h("span", { class: "chip" }, t("rRule"), " ", h("b", { text: pick(recipe.rule[0], recipe.rule[1]) }))),
      h("p", { class: "caps", style: { margin: "22px 0 10px" }, text: t("rProposed") }),
      table([
        { label: t("cAccount"), c: true, render: l => l[0] },
        { label: t("cLabel"), render: l => l[1] },
        { label: t("cDebit"), n: true, render: l => l[2] ? num(l[2]) : "" },
        { label: t("cCredit"), n: true, render: l => l[3] ? num(l[3]) : "" },
      ], recipe.lines, {
        foot: h("tr", {}, h("td", {}), h("td", { text: t("cTotals") }),
          h("td", { class: "n", text: num(td) }), h("td", { class: "n", text: num(tc) })),
      }),
      h("p", { class: "readonly" }, badge(t("readOnly")), t("rNotSaved")));
  };

  const run = () => {
    const q = input.value.toLowerCase();
    const found = readDate(input.value);
    if (found && found >= "2026-01-01" && found <= "2026-09-30") {
      when.value = found;
      refreshDue();
    }
    show(RECIPES.find(r => r.match.some(mm => q.includes(mm))) || null);
  };

  const examples = h("div", { class: "examples" }, RECIPES.map(r =>
    h("button", {
      type: "button", text: pick(r.fr, r.en),
      onclick: () => { input.value = pick(r.fr, r.en); run(); },
    })));

  root.append(section(t("rTitle"), null,
    reading(t("rRead")),
    h("div", { class: "sandbox" },
      h("div", { class: "prompt" }, input,
        h("button", { class: "btn primary", text: t("rTry"), onclick: run })),
      h("div", { class: "filters", style: { margin: "16px 0 0" } },
        h("span", { class: "caps", text: t("rWhen") }), when,
        h("span", { class: "caps", style: { marginLeft: "10px" }, text: t("rTermsField") }), termsSel),
      dueLine,
      h("p", { class: "muted", style: { margin: "16px 0 0", fontSize: "12px" }, text: t("rExamples") }),
      examples, result),
    h("p", { class: "reading", style: { marginTop: "22px" }, text: t("rDemoNote") }),
    h("p", { class: "reading", style: { marginTop: "12px" }, text: t("rWhenNote") })));

  input.addEventListener("keydown", e => { if (e.key === "Enter") run(); });
  refreshDue();
  return { node: root };
}

// ============================================================== tutorial

function tutorial(D, go) {
  const p = D.production, i = D.income_statement, b = D.balance_sheet, m = D.meta;

  // a small two column sheet: label on the left, figure on the right
  const sheet = (rows) => h("div", { class: "ledger-mini", style: { gridTemplateColumns: "1fr 120px" } },
    rows.map(r => [
      h("span", { class: r.tot ? "tot" : "", style: r.muted ? { color: "var(--ink-3)" } : null },
        r.label, r.note ? h("small", { style: { display: "block", color: "var(--ink-3)", fontSize: "10.5px" }, text: r.note }) : null),
      h("span", { class: "n " + (r.tot ? "tot " : "") + (r.cls || ""), text: r.value }),
    ]));

  const mini = () => h("div", { class: "ledger-mini" },
    h("span", { class: "h", text: t("cAccount") }), h("span", { class: "h", text: t("cLabel") }),
    h("span", { class: "h n", text: t("cDebit") }), h("span", { class: "h n", text: t("cCredit") }),
    h("span", { class: "c", text: "530000" }), h("span", { text: pick("Caisse", "Till") }),
    h("span", { class: "n", text: num(412.09) }), h("span", { class: "n" }),
    h("span", { class: "c", text: "701000" }), h("span", { text: pick("Ventes de café torréfié", "Sales of roasted coffee") }),
    h("span", { class: "n" }), h("span", { class: "n", text: num(390.60) }),
    h("span", { class: "c", text: "445710" }), h("span", { text: pick("TVA collectée 5,5 %", "Output VAT 5.5 %") }),
    h("span", { class: "n" }), h("span", { class: "n", text: num(21.49) }),
    h("span", { class: "tot" }), h("span", { class: "tot", text: t("cTotals") }),
    h("span", { class: "tot n", text: num(412.09) }), h("span", { class: "tot n", text: num(412.09) }));

  const classes = [
    ["1", pick("Capitaux propres, emprunts", "Equity and loans"), pick("bilan", "balance sheet")],
    ["2", pick("Immobilisations", "Fixed assets"), pick("bilan", "balance sheet")],
    ["3", pick("Stocks", "Inventory"), pick("bilan", "balance sheet")],
    ["4", pick("Clients, fournisseurs, État", "Customers, suppliers, the state"), pick("bilan", "balance sheet")],
    ["5", pick("Banque et caisse", "Bank and cash"), pick("bilan", "balance sheet")],
    ["6", pick("Charges", "Charges"), pick("compte de résultat", "income statement")],
    ["7", pick("Produits", "Income"), pick("compte de résultat", "income statement")],
  ];

  const demo = (title, body) => h("div", { class: "demo" },
    h("span", { class: "caps", text: title }), body);

  const step = (title, paras, body, link) => h("div", { class: "step" },
    h("div", { class: "no" }),
    h("div", {}, h("h3", { text: title }), paras.map(x => h("p", { html: x })),
      body || null,
      link ? h("p", { style: { marginTop: "14px" } },
        h("a", { class: "btn", href: "#/" + link[0], text: t("tuGoTo") + " : " + t(link[1]) })) : null));

  // step 5, the standard cost taken apart
  const d5 = demo(t("tuD5"), sheet([
    { label: t("prGreenStd"), note: t("tuD5a", { p: money(p.std_green), y: num(p.std_yield * 100, 0) + " %" }),
      value: num(p.std_green / p.std_yield) },
    { label: t("prPack"), value: num(p.std_packaging) },
    { label: t("prConversion"), value: num(p.std_conversion) },
    { label: t("prStdCost"), value: num(p.std_cost), tot: true },
  ]));

  // step 6, the variance computed in front of the reader
  const d6 = demo(t("tuD6"), sheet([
    { label: t("tuD6a", { r: num(p.roasted_kg, 0) }), value: num(p.green_allowed, 0) + " kg" },
    { label: t("tuD6b"), value: num(p.green_kg, 0) + " kg" },
    { label: t("tuD6c", { p: money(p.std_green) }), value: num(p.excess_green, 0) + " kg" },
    { label: t("prVarQty"), value: num(p.variance_qty), cls: "neg", tot: true },
    { label: t("tuD6d", { used: num(p.green_kg, 0), avg: money(p.avg_green_price), std: money(p.std_green) }),
      value: num(p.variance_price), cls: "neg", muted: true },
    { label: t("prVarTotal"), value: num(p.variance), cls: "neg", tot: true },
  ]));

  // step 7, the result on both sides
  const d7 = demo(t("tuD7"), sheet([
    { label: t("tuD7a"), note: t("iNet"), value: num(i.net), cls: tone(i.net) },
    { label: t("tuD7b"), note: t("bResult"), value: num(b.result), cls: tone(b.result) },
    { label: t("tuD7c"), value: num(b.assets), tot: true },
    { label: t("tuD7d"), value: num(b.total), tot: true },
  ]));

  // step 8, the FEC itself
  const fecHead = "JournalCode|JournalLib|EcritureNum|EcritureDate|CompteNum|CompteLib|...|EcritureLib|Debit|Credit";
  const fecRows = D.entries[0].lines.slice(0, 3).map(l => {
    const a = D.accounts.find(x => x.num === l.account);
    const d = D.entries[0].date.replace(/-/g, "");
    return ["OD", "Operations diverses", D.entries[0].number, d, l.account, (a ? a.fr : "").slice(0, 26),
      "...", l.label.slice(0, 26), l.debit.toFixed(2).replace(".", ","),
      l.credit.toFixed(2).replace(".", ",")].join("|");
  });
  const d8 = demo(t("tuD8"),
    h("div", { style: { overflowX: "auto" } },
      h("pre", {
        style: { margin: 0, fontFamily: "var(--mono)", fontSize: "10.5px", lineHeight: "2", whiteSpace: "pre" },
        text: [fecHead, ...fecRows].join(String.fromCharCode(10)),
      })));

  const steps = h("div", { class: "steps" },
    step(t("tu1t"), [t("tu1a"), t("tu1b", { entries: num(m.entries, 0) })], null, ["", "pOverview"]),
    step(t("tu2t"), [t("tu2a"), t("tu2b")], demo(t("tuD2"), mini()), ["journal", "pJournal"]),
    step(t("tu3t"), [t("tu3a"), t("tu3b")], demo(t("tuD3"), table([
      { label: t("tClass"), c: true, render: r => r[0] },
      { label: t("cLabel"), render: r => r[1] },
      { label: "", render: r => h("span", { class: "muted", text: r[2] }) },
    ], classes)), ["trial", "pTrial"]),
    step(t("tu4t"), [t("tu4a")], demo(t("tuD4"), table([
      { label: t("cJournal"), c: true, render: j => j.code },
      { label: t("cLabel"), render: j => pick(j.fr, j.en) },
      { label: pick("Écritures", "Entries"), n: true, render: j => num(j.count, 0) },
    ], D.journals)), ["ledger", "pLedger"]),
    step(t("tu5t"), [t("tu5a", { cost: money(p.std_cost) }), t("tu5b", { price: money(27.90) })],
      d5, ["inventory", "pInventory"]),
    step(t("tu6t"), [
      t("tu6a", {
        std: num(p.std_yield * 100, 0), real: num(p.yield * 100, 1),
        roasted: num(p.roasted_kg, 0), allowed: num(p.green_allowed, 0),
        used: num(p.green_kg, 0), excess: num(p.excess_green, 0), qty: money(p.variance_qty),
      }),
      t("tu6b", {
        avg: money(p.avg_green_price), stdp: money(p.std_green),
        price: money(p.variance_price), total: money(p.variance),
        profit: money(Math.abs(i.net)),
      }),
    ], d6, ["production", "pProduction"]),
    step(t("tu7t"), [t("tu7a"), t("tu7b")], d7, ["income", "pIncome"]),
    step(t("tu8t"), [t("tu8a"), t("tu8b", { lines: num(m.lines, 0) })], d8, ["exports", "pExports"]));

  return {
    node: h("div", {},
      section(t("tuTitle"), null,
        h("p", { class: "lede", style: { marginTop: 0 }, text: t("tuLede") }),
        steps,
        h("p", { style: { marginTop: "26px" } },
          h("a", { class: "btn primary", href: "#/", text: t("tuNext") })))),
  };
}


// ============================================================== supplier debts

function payables(D) {
  const pa = D.payables || { open: [] };
  const r = D.receivables;
  const gap = Math.round((r.dso - pa.dpo) * 10) / 10;

  const figs = h("div", { class: "figs" },
    figure(t("payTotal"), money(pa.total, { compact: true }), t("payOpenCount", { n: num(pa.count, 0) })),
    figure(t("payNext30"), money(pa.next30, { compact: true }), t("payNext30Note")),
    figure(t("payDpo"), num(pa.dpo, 1) + " " + pick("jours", "days"),
      t("payDpoNote", { n: num(pa.paid_count, 0) })),
    figure(t("recDso"), num(r.dso, 1) + " " + pick("jours", "days"),
      t("recDsoNote", { n: num(r.paid_count, 0) }), gap > 0 ? "neg" : ""));

  return {
    node: h("div", {},
      section(t("payTitle"), null, reading(t("payRead")), figs,
        callout(t("payBalance"), t("payBalanceNote", {
          dpo: num(pa.dpo, 1), dso: num(r.dso, 1), gap: num(Math.abs(gap), 1),
        })),
        h("p", { class: "caps", style: { margin: "32px 0 10px" }, text: t("payTitle") }),
        table([
          { label: t("cInvoice"), c: true, render: b => b.ref },
          { label: t("paySupplier"), render: b => b.supplier },
          { label: t("payWhat"), hide: true, render: b => pick(b.what_fr, b.what_en) },
          { label: t("cTerms"), hide: true, render: b => {
            const x = (D.terms || []).find(y => y.code === b.terms);
            return x ? pick(x.fr, x.en) : b.terms;
          } },
          { label: t("cDue"), render: b => dateAuto(b.due) },
          { label: t("recLate"), n: true, cls: b => b.late > 0 ? "neg" : "",
            render: b => b.late > 0 ? b.late + " " + t("recDays") : "-" },
          { label: t("cTTC"), n: true, render: b => num(b.amount) },
        ], pa.open, {
          foot: h("tr", {}, h("td", { colspan: 6, text: t("cTotal") }),
            h("td", { class: "n", text: num(pa.total) })),
        }))),
  };
}

// ============================================================== plain words

async function analysis(D, go) {
  const p = D.production, i = D.income_statement, b = D.balance_sheet;
  const st = D.stress || {}, r = D.receivables, pa = D.payables || {};
  const per = Object.fromEntries((D.per100 || []).map(x => [x.key, x.pct]));
  const e = k => num(per[k] || 0, 2);

  // combien de mois la tresorerie tient si plus rien ne rentre
  const monthlySpend = (i.op_charges - i.depreciation) / 9;
  const months = num(b.cash / monthlySpend, 1);

  const root = h("div", {});
  const box = h("div", { class: "scene" });
  const blocks = [
    ["materials", "anMaterials"], ["people", "anPeople"], ["place", "anPlace"],
    ["services", "anServices"], ["wear", "anWear"], ["unpaid", "anUnpaid"],
    ["bank", "anBank"], ["kept", "anKept"],
  ].filter(([k]) => (per[k] || 0) > 0.05);
  // gris pour ce qui sort normalement, rouge pour ce qui ne rentrera jamais,
  // vert pour ce qui reste : trois couleurs, trois idees
  const colourOf = c => c.key === "kept" ? "--pos" : c.key === "unpaid" ? "--neg" : "--ink-3";

  let dispose = null;
  const mount = async () => {
    if (dispose) { dispose(); dispose = null; }
    dispose = await mountCentres(box, blocks.map(([k, label]) => ({
      key: k, code: t(label), name: t(label), kind: t("anWhere"), result: per[k],
    })), {
      money: v => num(v, 2) + " €",
      line: c => `${num(c.result, 2)} € ${pick("sur 100 encaisses", "out of every 100 taken in")}`,
    }, {
      spacing: 1.3, width: .84, camZ: 13.2, camY: 2.4, lookY: .4,
      tall: 2.6, stagger: true, colour: colourOf,
    });
  };

  const qa = (q, a) => h("div", { class: "step" },
    h("div", { class: "no" }), h("div", {}, h("h3", { text: t(q) }), h("p", { html: a })));

  root.append(
    section(t("anTitle"), null,
      h("p", { class: "lede", style: { marginTop: 0 }, text: t("anLede") }),
      h("p", { style: { margin: "18px 0 0" } },
        h("button", { class: "btn primary", text: t("anRefresh"), onclick: () => mount() })),
      h("p", { class: "caps", style: { margin: "30px 0 4px" }, text: t("anWhere") }),
      box,
      h("div", { class: "steps", style: { marginTop: "26px" } },
        qa("anQ1", t("anA1", {
          materials: e("materials"), people: e("people"), place: e("place"),
          services: e("services"), wear: e("wear"), unpaid: e("unpaid"), kept: e("kept"),
        })),
        qa("anQ2", t("anA2", { kept: e("kept"), profit: money(i.net) })),
        qa("anQ3", t("anA3", { cash: money(b.cash), months })),
        qa("anQ4", t("anA4", {
          owed: money(r.total), owing: money(pa.total || 0),
          dpo: num(pa.dpo || 0, 1), dso: num(r.dso, 1),
        })),
        qa("anQ5", t("anA5", {
          amount: money(st.allowance_booked || 0), lost: num(p.excess_green, 0),
          variance: money(p.variance),
        })),
        qa("anQ6", t("anA6"))),
      h("p", { class: "reading", style: { marginTop: "26px" }, text: t("anFootnote") })));

  queueMicrotask(mount);
  return { node: root, cleanup: () => { if (dispose) dispose(); } };
}

// ============================================================== registry

export const PAGES = {
  "": { title: "pOverview", crumb: "navBooks", render: overview },
  "record": { title: "pRecord", crumb: "navRecord", render: record },
  "tutorial": { title: "pTutorial", crumb: "navLearn", render: tutorial },
  "journal": { title: "pJournal", crumb: "navBooks", render: journal },
  "ledger": { title: "pLedger", crumb: "navBooks", render: ledger },
  "trial": { title: "pTrial", crumb: "navBooks", render: trial },
  "income": { title: "pIncome", crumb: "navStatements", render: income },
  "balance": { title: "pBalance", crumb: "navStatements", render: balance },
  "centres": { title: "pCentres", crumb: "navManagement", render: centres },
  "production": { title: "pProduction", crumb: "navManagement", render: production },
  "inventory": { title: "pInventory", crumb: "navManagement", render: inventory },
  "receivables": { title: "pReceivables", crumb: "navManagement", render: receivables },
  "invoices": { title: "pInvoices", crumb: "navManagement", render: invoices },
  "reminders": { title: "pReminders", crumb: "navManagement", render: reminders },
  "payables": { title: "pPayables", crumb: "navManagement", render: payables },
  "analysis": { title: "pAnalysis", crumb: "navLearn", render: analysis },
  "exports": { title: "pExports", crumb: "navStatements", render: exportsPage },
};
