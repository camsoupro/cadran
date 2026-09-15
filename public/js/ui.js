// Small DOM and formatting helpers. No framework, no build step.
import { lang, t } from "./i18n.js";

const SVG_NS = "http://www.w3.org/2000/svg";
const SVG_TAGS = new Set(["svg", "path", "circle", "rect", "line", "text", "g", "defs",
  "linearGradient", "stop", "ellipse", "polyline", "polygon", "tspan"]);

export function h(tag, attrs = {}, ...kids) {
  const el = SVG_TAGS.has(tag)
    ? document.createElementNS(SVG_NS, tag)
    : document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k === "class") { if (el.namespaceURI === SVG_NS) el.setAttribute("class", v); else el.className = v; }
    else if (k === "html") el.innerHTML = v;
    else if (k === "text") el.textContent = v;
    else if (k === "style" && typeof v === "object") Object.assign(el.style, v);
    else if (k === "dataset") Object.assign(el.dataset, v);
    else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v);
  }
  for (const kid of kids.flat(Infinity)) {
    if (kid === null || kid === undefined || kid === false) continue;
    el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return el;
}

const locale = () => (lang() === "en" ? "en-GB" : "fr-FR");

export function num(v, digits = 2) {
  return new Intl.NumberFormat(locale(), {
    minimumFractionDigits: digits, maximumFractionDigits: digits,
  }).format(v || 0);
}
export function money(v, { compact = false, sign = false } = {}) {
  const abs = Math.abs(v || 0);
  const s = (v || 0) < 0 ? "-" : sign ? "+" : "";
  if (compact && abs >= 1e6) {
    const body = new Intl.NumberFormat(locale(), { maximumFractionDigits: 2 }).format(abs / 1e6);
    return lang() === "en" ? `${s}€${body}M` : `${s}${body} M€`;
  }
  if (compact) {
    const body = new Intl.NumberFormat(locale(), { maximumFractionDigits: 0 }).format(abs);
    return lang() === "en" ? `${s}€${body}` : `${s}${body} €`;
  }
  const body = new Intl.NumberFormat(locale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(abs);
  return lang() === "en" ? `${s}€${body}` : `${s}${body} €`;
}
export function pct(v, digits = 1) {
  return new Intl.NumberFormat(locale(), {
    minimumFractionDigits: digits, maximumFractionDigits: digits,
  }).format(v || 0) + " %";
}
export function kg(v, digits = 0) {
  return new Intl.NumberFormat(locale(), {
    minimumFractionDigits: digits, maximumFractionDigits: digits,
  }).format(v || 0) + " kg";
}
export function date(iso, long = false) {
  const d = new Date(iso + "T00:00:00");
  return new Intl.DateTimeFormat(locale(), {
    day: "numeric", month: long ? "long" : "short", year: "numeric",
  }).format(d);
}
/** Date courte sur telephone : 30/09/26 au lieu de 30 septembre 2026. */
export function dateAuto(iso) {
  if (innerWidth > 560) return date(iso);
  const d = new Date(iso + "T00:00:00");
  return new Intl.DateTimeFormat(locale(), {
    day: "2-digit", month: "2-digit", year: "2-digit",
  }).format(d);
}

export function monthName(m, short = true) {
  const d = new Date(2026, m - 1, 1);
  return new Intl.DateTimeFormat(locale(), { month: short ? "short" : "long" }).format(d)
    .replace(".", "").toUpperCase();
}
export function tone(v) { return v > 0 ? "pos" : v < 0 ? "neg" : ""; }

// ---------------------------------------------------------------- components

export function section(title, sub, ...kids) {
  const head = h("div", { class: "sec-head" }, h("h2", { text: title }), sub && h("p", { text: sub }));
  return h("section", {}, head, ...kids);
}
export function reading(html) { return h("p", { class: "reading", html }); }

export function table(cols, rows, opts = {}) {
  // hide: true retire la colonne sous 560 px de large, au lieu de tout comprimer
  const base = c => (c.n ? "n " : c.c ? "c " : "") + (c.hide ? "hm " : "");
  const thead = h("thead", {}, h("tr", {}, cols.map(c =>
    h("th", { class: base(c).trim() }, c.label))));
  const tbody = h("tbody", {}, rows.map(r => {
    const tr = h("tr", { class: opts.onRow ? "clickable" : "" },
      cols.map(c => h("td", { class: base(c) + (c.cls ? c.cls(r) : "") },
        c.render ? c.render(r) : r[c.key])));
    if (opts.onRow) tr.addEventListener("click", () => opts.onRow(r));
    return tr;
  }));
  const parts = [thead, tbody];
  if (opts.foot) parts.push(h("tfoot", {}, opts.foot));
  return h("div", { class: "table-wrap" }, h("table", {}, ...parts));
}

export function figure(label, value, note, cls = "") {
  return h("div", { class: "fig" },
    h("div", { class: "caps", text: label }),
    h("div", { class: "v " + cls, text: value }),
    h("div", { class: "n", html: note }));
}

export function callout(title, html) {
  return h("div", { class: "callout" },
    h("p", {}, h("span", { class: "k", text: title }), h("span", { html })));
}

export function bars(items) {
  const max = Math.max(...items.map(i => Math.abs(i.value)), 1);
  return h("div", { class: "bars" }, items.map(i =>
    h("div", { class: "brow" },
      h("span", { style: { color: "var(--ink-2)" }, text: i.label }),
      h("span", { class: "t" }, h("i", {
        dataset: { w: (Math.abs(i.value) / max * 100).toFixed(1) },
        style: { background: `var(--${i.tone || "accent"})` },
      })),
      h("span", { class: "a " + (i.tone || ""), text: i.display }))));
}

export function badge(text, kind = "") { return h("span", { class: "badge " + kind, text }); }

// ---------------------------------------------------------------- animation

export const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const easeOut = x => 1 - Math.pow(1 - x, 3);

export function countUp(el, target, render) {
  if (reduced) { el.textContent = render(target); return; }
  let started = false;
  const t0 = performance.now(), dur = 1200;
  const step = now => {
    started = true;
    const p = Math.min(1, (now - t0) / dur);
    el.textContent = render(target * easeOut(p));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
  // Two safety nets: no frames at all, and frames that are throttled and stop half way
  // (a background tab). Either way the real figure is what stays on screen.
  setTimeout(() => { if (!started) el.textContent = render(target); }, 600);
  setTimeout(() => { el.textContent = render(target); }, dur + 400);
}

export function revealAll(root) {
  const go = el => {
    if (el.classList.contains("in")) return;
    el.classList.add("in");
    el.querySelectorAll("[data-w]").forEach(f => { f.style.width = f.dataset.w + "%"; });
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { go(e.target); io.unobserve(e.target); }
  }), { threshold: .1 });
  root.querySelectorAll(".reveal").forEach(el => io.observe(el));
  setTimeout(() => root.querySelectorAll(".reveal").forEach(go), 1500);   // safety net
}

// ---------------------------------------------------------------- tooltip

let tipEl = null;
export function tip() {
  if (!tipEl) { tipEl = h("div", { class: "tip" }); document.body.append(tipEl); }
  return tipEl;
}
