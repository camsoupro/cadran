// Shell, router, language and theme. Everything else is in pages.js.
import { t, setLang, lang, pick } from "./i18n.js";
import { h, num, revealAll } from "./ui.js";
import { PAGES } from "./pages.js";
import { repaintScenes } from "./scenes.js";

const store = {
  get(k, d) { try { return localStorage.getItem(k) || d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* private window */ } },
};

const root = document.documentElement;
root.dataset.theme = store.get("cadran-theme", "day");
setLang(store.get("cadran-lang", (navigator.language || "fr").startsWith("en") ? "en" : "fr"));

let D = null;
let cleanup = null;

const NAV = [
  ["navRecord", [["record", "pRecord"]]],
  ["navBooks", [["", "pOverview"], ["journal", "pJournal", d => num(d.meta.entries, 0)],
    ["ledger", "pLedger", d => num(d.accounts.filter(a => a.debit || a.credit).length, 0)],
    ["trial", "pTrial"]]],
  ["navManagement", [["centres", "pCentres", d => String(d.centres.length)],
    ["production", "pProduction", d => num(d.production.batch_count, 0)],
    ["inventory", "pInventory"],
    ["invoices", "pInvoices", d => num((d.invoices || []).length, 0)],
    ["receivables", "pReceivables"],
    ["reminders", "pReminders", d => {
      const n = (d.receivables.open || []).filter(o => o.late > 0).length;
      return n ? String(n) : "";
    }]]],
  ["navStatements", [["income", "pIncome"], ["balance", "pBalance"], ["exports", "pExports"]]],
  ["navLearn", [["tutorial", "pTutorial"]]],
];

function icon(path, size = 15) {
  return h("span", {
    html: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`,
  });
}

function route() { return (location.hash || "#/").replace(/^#\/?/, "").split("?")[0]; }

function buildRail() {
  const current = route();
  const nav = h("nav", {}, NAV.map(([group, items]) => [
    h("h3", { text: t(group) }),
    items.map(([path, key, badge]) => h("a", {
      href: "#/" + path,
      class: path === current ? "on" : "",
      }, t(key), badge ? h("b", { text: badge(D) }) : null)),
  ]));

  return h("aside", { class: "rail" },
    h("div", {},
      h("div", { class: "wordmark" }, "Cadran", h("span", { text: "." })),
      h("p", { text: t("tagline") }),
      h("span", { class: "demo-flag", text: t("demoFlag") })),
    nav,
    h("div", { class: "rail-foot" },
      h("div", { class: "state" },
        icon('<path d="M4 12.5 9.5 18 20 6.5"/>', 14),
        t("balanced")),
      h("div", { html: `${num(D.meta.entries, 0)} ${t("entriesPosted")}<br>${num(D.meta.lines, 0)} ${t("linesPosted")}<br>${t("fictional")}` })));
}

function buildTop(page) {
  return h("header", { class: "topline" },
    h("div", {},
      h("div", { class: "crumb", text: t(page.crumb) + " › " + t(page.title) }),
      h("h1", { text: t(page.title) })),
    h("div", { class: "tools" },
      h("button", {
        class: "btn", text: t("langLabel"), title: "Français / English",
        onclick: () => {
          const next = lang() === "en" ? "fr" : "en";
          store.set("cadran-lang", next); setLang(next); render();
        },
      }),
      h("button", {
        class: "btn icon", title: t("themeLabel"), "aria-label": t("themeLabel"),
        onclick: () => {
          root.dataset.theme = root.dataset.theme === "night" ? "day" : "night";
          store.set("cadran-theme", root.dataset.theme);
          repaintScenes();
          render();
        },
      }, icon('<path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9Z"/>', 16))));
}

function dateline() {
  return h("div", { class: "dateline caps" },
    h("span", { text: D.meta.name + ", " + pick(D.meta.activity_fr, D.meta.activity_en) }),
    h("span", { text: t("fiscalYear") }),
    h("span", { text: t("closedTo") }),
    h("span", { text: t("standard") }));
}

function footer() {
  return h("p", { class: "foot" },
    t("fDemo"), " · ", t("fBuilt"), " ",
    h("a", {
      href: "https://www.linkedin.com/in/camilla-bouyahia-8b9b3b435",
      target: "_blank", rel: "noopener noreferrer",
    }, "Camilla Bouyahia"));
}

async function render() {
  if (cleanup) { cleanup(); cleanup = null; }
  const path = route();
  const page = PAGES[path] || PAGES[""];
  document.title = `${t(page.title)} · Cadran, ${t("demoFlag")}`;

  const main = h("main", { class: "sheet" }, buildTop(page), dateline());
  const app = h("div", { class: "app" }, buildRail(), main);
  document.body.replaceChildren(app);

  let out;
  try {
    out = await page.render(D, go);
  } catch (err) {
    console.error(err);
    out = { node: h("section", {}, h("p", { class: "reading" },
      "Cette page n'a pas pu s'afficher. / This page could not be rendered. " + err.message)) };
  }
  main.append(out.node, footer());
  cleanup = out.cleanup || null;
  revealAll(main);
  if (!location.hash.includes("keep")) main.scrollIntoView({ block: "start" });
}

function go(hash) { location.hash = hash; }

addEventListener("hashchange", render);

// no-cache : on revalide toujours aupres du serveur. Les navigateurs qui ont visite
// le site avant la correction des en-tetes gardent sinon un fichier plus ancien que le code.
fetch("data/books.json", { cache: "no-cache" })
  .then(r => r.json())
  .then(data => { D = data; render(); })
  .catch(e => {
    document.body.innerHTML =
      `<p style="padding:3rem;font:14px system-ui">The books could not be loaded. ${e.message}</p>`;
  });
