// SVG charts, drawn from CSS variables so they follow the day and night palettes.
import { reduced } from "./ui.js";

const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const NS = "http://www.w3.org/2000/svg";

function niceMax(v) {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
}

export function sparkline(el, series, colour) {
  const min = Math.min(...series), max = Math.max(...series), span = max - min || 1;
  const pts = series.map((v, i) => [i / (series.length - 1) * 120, 24 - (v - min) / span * 22]);
  const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  el.setAttribute("viewBox", "0 0 120 26");
  el.setAttribute("preserveAspectRatio", "none");
  el.innerHTML =
    `<path d="${d}" fill="none" stroke="${colour}" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round" opacity=".9"/>` +
    `<circle cx="${pts[pts.length - 1][0]}" cy="${pts[pts.length - 1][1]}" r="2" fill="${colour}"/>`;
  if (reduced) return;
  const path = el.querySelector("path"), L = path.getTotalLength();
  path.animate([{ strokeDasharray: L, strokeDashoffset: L }, { strokeDasharray: L, strokeDashoffset: 0 }],
    { duration: 1200, easing: "cubic-bezier(.2,.75,.2,1)", fill: "forwards" });
}

/**
 * Two bands with one axis each: income and charges above, the monthly result below.
 * Putting the result on the income axis would make a 5 000 profit look like 5 000 of sales.
 */
export function trend(el, months, labels, fmt) {
  const W = 980, H = 330, L = 74, R = 16, T = 16;
  const iw = W - L - R, ihTop = 176, bandTop = T + ihTop + 48, bandH = 54;
  el.setAttribute("viewBox", `0 0 ${W} ${H}`);
  el.style.height = H * 0.72 + "px";
  const n = months.length;
  const max = niceMax(Math.max(...months.map(m => Math.max(m.income, m.charges))));
  const x = i => L + i * (iw / (n - 1));
  const y = v => T + ihTop - v / max * ihTop;
  const ink = css("--ink"), ink3 = css("--ink-3"), line2 = css("--line-2"), line = css("--line"),
    accent = css("--accent"), paper = css("--paper"), pos = css("--pos"), neg = css("--neg");
  let out = "";

  for (let g = 0; g <= 4; g++) {
    const gy = T + ihTop - g / 4 * ihTop;
    out += `<line x1="${L}" y1="${gy}" x2="${W - R}" y2="${gy}" stroke="${line2}"/>` +
      `<text x="${L - 12}" y="${gy + 3}" text-anchor="end">${fmt(max * g / 4)}</text>`;
  }
  const path = key => months.map((m, i) => (i ? "L" : "M") + x(i).toFixed(1) + " " + y(m[key]).toFixed(1)).join(" ");
  out += `<defs><linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="${accent}" stop-opacity=".18"/>` +
    `<stop offset="1" stop-color="${accent}" stop-opacity="0"/></linearGradient></defs>`;
  out += `<path d="${path("income")} L ${x(n - 1)} ${T + ihTop} L ${L} ${T + ihTop} Z" fill="url(#grad)"/>`;
  out += `<path class="draw" d="${path("charges")}" fill="none" stroke="${ink3}" stroke-width="1.2" stroke-dasharray="4 4"/>`;
  out += `<path class="draw" d="${path("income")}" fill="none" stroke="${accent}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;

  const rmax = niceMax(Math.max(...months.map(m => Math.abs(m.result))));
  const zero = bandTop + bandH / 2;
  out += `<line x1="${L}" y1="${bandTop - 26}" x2="${W - R}" y2="${bandTop - 26}" stroke="${line}"/>`;
  out += `<text x="${L}" y="${bandTop - 12}" style="letter-spacing:.15em">${labels.band}</text>`;
  out += `<line x1="${L}" y1="${zero}" x2="${W - R}" y2="${zero}" stroke="${ink}" stroke-width="1" opacity=".45"/>`;
  out += `<text x="${L - 12}" y="${zero + 3}" text-anchor="end">0</text>`;
  out += `<text x="${L - 12}" y="${bandTop + 4}" text-anchor="end">${fmt(rmax)}</text>`;
  out += `<text x="${L - 12}" y="${bandTop + bandH + 4}" text-anchor="end">-${fmt(rmax)}</text>`;
  months.forEach((m, i) => {
    const hh = Math.abs(m.result) / rmax * (bandH / 2);
    const ty = m.result >= 0 ? zero - hh : zero;
    out += `<rect class="col" x="${x(i) - 7}" y="${zero}" width="14" height="0" rx="1.5" ` +
      `fill="${m.result < 0 ? neg : pos}" opacity=".9" data-h="${hh.toFixed(1)}" data-y="${ty.toFixed(1)}"/>`;
    out += `<text x="${x(i)}" y="${bandTop + bandH + 22}" text-anchor="middle">${labels.months[i]}</text>`;
  });
  el.innerHTML = out;

  if (reduced) {
    el.querySelectorAll("rect.col").forEach(r => {
      r.setAttribute("height", r.dataset.h); r.setAttribute("y", r.dataset.y);
    });
    return;
  }
  el.querySelectorAll("path.draw").forEach((p, i) => {
    const len = p.getTotalLength(), dash = p.getAttribute("stroke-dasharray");
    p.animate([{ strokeDasharray: len + " " + len, strokeDashoffset: len },
    { strokeDasharray: len + " " + len, strokeDashoffset: 0 }],
      { duration: 1600, delay: i * 220, easing: "cubic-bezier(.3,.7,.2,1)" }).onfinish = () => {
        if (dash) p.setAttribute("stroke-dasharray", dash); else p.removeAttribute("stroke-dasharray");
      };
  });
  el.querySelectorAll("rect.col").forEach((r, i) => {
    r.animate([{ height: 0, y: +r.getAttribute("y") }, { height: +r.dataset.h, y: +r.dataset.y }],
      { duration: 650, delay: 650 + i * 45, easing: "cubic-bezier(.2,.75,.2,1)", fill: "forwards" });
  });
}

/** Horizontal band of ageing buckets, drawn as one rule split in segments. */
export function ageing(el, buckets) {
  const total = buckets.reduce((s, b) => s + b.value, 0) || 1;
  el.innerHTML = "";
  let left = 0;
  for (const b of buckets) {
    const w = b.value / total * 100;
    if (w <= 0) continue;
    const seg = document.createElement("i");
    seg.style.cssText = `position:absolute;top:0;bottom:0;left:${left}%;width:${w}%;background:var(--${b.tone});`;
    seg.title = b.label;
    el.append(seg);
    left += w;
  }
}
