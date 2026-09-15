// Two small three.js scenes: the balance beam, and the centres as volumes.
// One loop drives whatever is mounted, capped at 30 fps, paused off screen.
import { reduced, tip } from "./ui.js";

const CDN = "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";
let THREE = null;
let loading = null;
const tickers = new Set();
const painters = new Set();

async function three() {
  if (THREE) return THREE;
  if (!loading) loading = import(CDN).then(m => (THREE = m)).catch(e => {
    console.warn("3D unavailable:", e && e.message);
    return null;
  });
  return loading;
}

if (!reduced) {
  let last = 0;
  (function loop(now) {
    requestAnimationFrame(loop);
    if (document.hidden || now - last < 33) return;
    last = now;
    for (const t of tickers) t();
  })(0);
}

export function repaintScenes() { for (const p of painters) p(); }

const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const hex = n => parseInt(css(n).replace("#", ""), 16);

function renderer(T, host) {
  const r = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  r.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  r.setSize(host.clientWidth, host.clientHeight);
  host.append(r.domElement);
  return r;
}

const FALLBACK_SCALE = `<svg viewBox="0 0 320 210" width="100%" height="100%" aria-hidden="true">
  <g stroke="currentColor" stroke-width="2" fill="none" opacity=".55">
  <path d="M160 52v110M108 162h104M64 68h192"/>
  <ellipse cx="64" cy="76" rx="30" ry="8"/><ellipse cx="256" cy="76" rx="30" ry="8"/>
  <path d="M64 68v8M256 68v8"/></g></svg>`;

/** The balance beam. Labels under each pan carry the totals. */
export async function mountBalance(host, labels) {
  const T = reduced ? null : await three();
  if (!T) {
    host.innerHTML = FALLBACK_SCALE;
    host.style.color = "var(--ink-3)";
    return () => { host.innerHTML = ""; };
  }
  const r = renderer(T, host);
  const scene = new T.Scene();
  const cam = new T.PerspectiveCamera(30, host.clientWidth / host.clientHeight, .1, 60);
  cam.position.set(0, .3, 12);
  cam.lookAt(0, -.3, 0);

  const inkMat = new T.LineBasicMaterial({ transparent: true, opacity: .6 });
  const accMat = new T.LineBasicMaterial({ transparent: true, opacity: .95 });
  const wire = (geo, mat) => new T.LineSegments(new T.EdgesGeometry(geo, 16), mat);

  const rig = new T.Group(); rig.position.y = .55; scene.add(rig);
  const beam = new T.Group(); rig.add(beam);
  const bar = wire(new T.CylinderGeometry(.05, .05, 4.6, 10), inkMat);
  bar.rotation.z = Math.PI / 2; beam.add(bar);

  const pans = [];
  for (const s of [-1, 1]) {
    const pan = new T.Group(); pan.position.x = s * 2.2;
    const dish = wire(new T.CylinderGeometry(.74, .58, .13, 24), inkMat);
    dish.position.y = -1.05; pan.add(dish);
    const cord = wire(new T.CylinderGeometry(.008, .008, 1.05, 4), inkMat);
    cord.position.y = -.52; pan.add(cord);
    for (let i = 0; i < 3; i++) {
      const disc = wire(new T.CylinderGeometry(.36 - i * .06, .36 - i * .06, .07, 20), i === 0 ? accMat : inkMat);
      disc.position.y = -.93 + i * .09; pan.add(disc);
    }
    beam.add(pan); pans.push(pan);
  }
  const post = wire(new T.CylinderGeometry(.08, .13, 2.9, 10), inkMat); post.position.y = -1.45; rig.add(post);
  const base = wire(new T.CylinderGeometry(1.15, 1.32, .1, 28), inkMat); base.position.y = -2.95; rig.add(base);
  const hub = wire(new T.OctahedronGeometry(.24, 0), accMat); rig.add(hub);

  const layer = document.createElement("div"); layer.className = "lab"; host.append(layer);
  const tags = labels.map(l => {
    const s = document.createElement("span");
    s.innerHTML = `${l.label}<b>${l.value}</b>`;
    layer.append(s);
    return s;
  });

  const paint = () => {
    inkMat.color.setHex(hex("--ink"));
    accMat.color.setHex(hex("--accent"));
    inkMat.opacity = document.documentElement.dataset.theme === "night" ? .72 : .6;
  };
  paint(); painters.add(paint);

  let seen = true, mx = 0, tt = 0;
  const io = new IntersectionObserver(e => { seen = e[0].isIntersecting; }, { threshold: 0 });
  io.observe(host);
  const onMove = e => { mx = e.clientX / innerWidth - .5; };
  addEventListener("pointermove", onMove);
  const onResize = () => {
    r.setSize(host.clientWidth, host.clientHeight);
    cam.aspect = host.clientWidth / host.clientHeight; cam.updateProjectionMatrix();
  };
  addEventListener("resize", onResize);

  const v = new T.Vector3();
  const tick = () => {
    if (!seen) return;
    tt += .02;
    const settle = Math.max(0, 1 - tt / 7);
    beam.rotation.z = Math.sin(tt * 1.7) * .17 * settle + Math.sin(tt * .35) * .008;
    rig.rotation.y = Math.sin(tt * .25) * .3 + mx * .28;
    hub.rotation.y += .006;
    r.render(scene, cam);
    const w = host.clientWidth, hh = host.clientHeight;
    pans.forEach((p, i) => {
      v.set(p.position.x, -1.8, 0).applyMatrix4(beam.matrixWorld).project(cam);
      tags[i].style.transform =
        `translate(-50%,-50%) translate(${((v.x + 1) / 2 * w).toFixed(1)}px, ${((1 - v.y) / 2 * hh).toFixed(1)}px)`;
    });
  };
  tickers.add(tick);
  tick();                       // one frame straight away, in case rAF is throttled

  return () => {
    tickers.delete(tick); painters.delete(paint); io.disconnect();
    removeEventListener("pointermove", onMove); removeEventListener("resize", onResize);
    r.dispose(); host.innerHTML = "";
  };
}

/** One volume per analytic centre, growing out of the zero line. */
export async function mountCentres(host, centres, fmt, opts = {}) {
  const T = reduced ? null : await three();
  if (!T) {
    host.innerHTML = `<p style="font-size:12px;color:var(--ink-3);line-height:1.9">` +
      centres.map(c => `${c.name}: ${fmt.money(c.result, { compact: true })}`).join("<br>") + `</p>`;
    return () => { host.innerHTML = ""; };
  }
  const r = renderer(T, host);
  const scene = new T.Scene();
  const cam = new T.PerspectiveCamera(30, host.clientWidth / host.clientHeight, .1, 60);
  cam.position.set(opts.camX ?? .9, opts.camY ?? 2.1, opts.camZ ?? 11);
  cam.lookAt(0, opts.lookY ?? -.12, 0);
  scene.add(new T.AmbientLight(0xffffff, .8));
  const key = new T.DirectionalLight(0xffffff, 1.5); key.position.set(4, 7, 6); scene.add(key);
  const fill = new T.DirectionalLight(0xffffff, .5); fill.position.set(-5, 2, -4); scene.add(fill);

  const group = new T.Group(); scene.add(group);
  const maxAbs = Math.max(...centres.map(c => Math.abs(c.result)), 1);
  const layer = document.createElement("div"); layer.className = "lab"; host.append(layer);
  const blocks = [];

  const spacing = opts.spacing ?? 1.6;
  const width = opts.width ?? .96;
  centres.forEach((c, i) => {
    const height = Math.max(.12, Math.abs(c.result) / maxAbs * (opts.tall ?? 2.0));
    const up = c.result > 0, flat = c.result === 0;
    const geo = new T.BoxGeometry(width, height, width);
    geo.translate(0, up ? height / 2 : -height / 2, 0);
    const mat = new T.MeshStandardMaterial({ roughness: .55, metalness: .05, transparent: true,
      opacity: flat ? .35 : .95 });
    const mesh = new T.Mesh(geo, mat);
    mesh.position.x = (i - (centres.length - 1) / 2) * spacing;
    mesh.scale.y = .001;
    // une etiquette sur deux est remontee : sinon elles se chevauchent des qu'il y a
    // beaucoup de barres cote a cote
    const lift = opts.stagger && i % 2 ? .42 : 0;
    mesh.userData = { c, up, flat, labelY: up ? height + .48 + lift : -height - .48 - lift };
    group.add(mesh); blocks.push(mesh);

    const edgeMat = new T.LineBasicMaterial({ transparent: true, opacity: .5 });
    mesh.add(new T.LineSegments(new T.EdgesGeometry(geo), edgeMat));
    mesh.userData.edgeMat = edgeMat;

    const tag = document.createElement("span");
    tag.innerHTML = `${c.code}<b>${fmt.money(c.result, { compact: true, sign: true })}</b>`;
    layer.append(tag);
    mesh.userData.tag = tag;
  });

  const zero = new T.Mesh(new T.BoxGeometry(11, .02, .02),
    new T.MeshBasicMaterial({ transparent: true, opacity: .45 }));
  zero.position.z = .5; group.add(zero);

  const paint = () => {
    const pos = new T.Color(hex("--pos")), neg = new T.Color(hex("--neg")), ink3 = new T.Color(hex("--ink-3"));
    for (const b of blocks) {
      const custom = opts.colour && opts.colour(b.userData.c);
      b.material.color.copy(custom ? new T.Color(hex(custom))
        : b.userData.flat ? ink3 : b.userData.up ? pos : neg);
      b.userData.edgeMat.color.setHex(hex("--ink"));
      b.userData.edgeMat.opacity = document.documentElement.dataset.theme === "night" ? .32 : .5;
    }
    zero.material.color.setHex(hex("--ink"));
  };
  paint(); painters.add(paint);

  const ray = new T.Raycaster(), pointer = new T.Vector2(), tipEl = tip();
  let hovered = null;
  const onHover = e => {
    const box = host.getBoundingClientRect();
    pointer.set(((e.clientX - box.left) / box.width) * 2 - 1, -((e.clientY - box.top) / box.height) * 2 + 1);
    ray.setFromCamera(pointer, cam);
    const hit = ray.intersectObjects(blocks, false)[0];
    const m = hit ? hit.object : null;
    if (m !== hovered) {
      if (hovered) hovered.material.emissive.setHex(0x000000);
      hovered = m;
      if (m) {
        m.material.emissive.setHex(0xffffff);
        m.material.emissiveIntensity = .12;
        const c = m.userData.c;
        tipEl.innerHTML = `<b>${c.name}</b><span>${c.kind}<br>${fmt.line(c)}</span>`;
      }
      tipEl.style.opacity = m ? 1 : 0;
    }
    tipEl.style.left = (e.clientX + 16) + "px";
    tipEl.style.top = (e.clientY + 16) + "px";
  };
  const onLeave = () => {
    tipEl.style.opacity = 0;
    if (hovered) { hovered.material.emissive.setHex(0x000000); hovered = null; }
  };
  host.addEventListener("pointermove", onHover);
  host.addEventListener("pointerleave", onLeave);
  const onResize = () => {
    r.setSize(host.clientWidth, host.clientHeight);
    cam.aspect = host.clientWidth / host.clientHeight; cam.updateProjectionMatrix();
  };
  addEventListener("resize", onResize);

  let grown = false, seen = false;
  const easeOut = x => 1 - Math.pow(1 - x, 3);
  const grow = () => {
    if (grown) return; grown = true;
    blocks.forEach((b, i) => {
      const t0 = performance.now() + i * 90;
      const step = now => {
        const p = Math.min(1, Math.max(0, (now - t0) / 850));
        b.scale.y = Math.max(.001, easeOut(p));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  };
  const io = new IntersectionObserver(e => { seen = e[0].isIntersecting; if (seen) grow(); }, { threshold: .2 });
  io.observe(host);
  const growTimer = setTimeout(grow, 2000);
  // Filet de securite : si les images ne viennent pas (onglet en arriere plan, capture
  // d'ecran, impression), les volumes doivent quand meme etre a leur hauteur.
  const settleTimer = setTimeout(() => {
    let moved = false;
    for (const b of blocks) if (b.scale.y < .99) { b.scale.y = 1; moved = true; }
    if (moved) { seen = true; tick(); }
  }, 2600);

  const v = new T.Vector3();
  let tt = 0, frame = 0;
  // La taille du cadre ne change qu'au redimensionnement : la relire a chaque image
  // forcerait un recalcul de mise en page soixante fois par seconde.
  let box = { width: host.clientWidth, height: host.clientHeight };
  const measure = () => { box = { width: host.clientWidth, height: host.clientHeight }; };
  addEventListener("resize", measure);

  const tick = () => {
    if (!seen) return;
    tt += .008;
    group.rotation.y = Math.sin(tt * .4) * .12;
    r.render(scene, cam);
    if (frame++ % 2) return;            // les etiquettes suivent une image sur deux
    for (const b of blocks) {
      v.set(b.position.x, b.userData.labelY * b.scale.y, 0).applyMatrix4(group.matrixWorld).project(cam);
      b.userData.tag.style.transform =
        `translate(-50%,-50%) translate(${((v.x + 1) / 2 * box.width).toFixed(1)}px, ${((1 - v.y) / 2 * box.height).toFixed(1)}px)`;
    }
  };
  tickers.add(tick);
  seen = true; tick();          // one frame straight away, in case rAF is throttled

  return () => {
    tickers.delete(tick); painters.delete(paint); io.disconnect();
    clearTimeout(growTimer); clearTimeout(settleTimer); removeEventListener("resize", measure);
    host.removeEventListener("pointermove", onHover);
    host.removeEventListener("pointerleave", onLeave);
    removeEventListener("resize", onResize);
    tipEl.style.opacity = 0;
    r.dispose(); host.innerHTML = "";
  };
}
