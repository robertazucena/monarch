/* Capture — home. One shutter for every load and route; frames drift at their own depth; the statement focuses as you read;
   a work frame opens full screen and the shoot then runs sideways while you scroll down. Works from file:// (no fetch). */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement, reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const pad = n => String(n).padStart(2, "0");
  const wait = ms => new Promise(r => setTimeout(r, ms));

  /* ---------- the work (concept studio; client names illustrative) ---------- */
  const WORK = [
    { slug: "tide-and-linen", name: "Tide & Linen", kind: "Wedding", client: "Mara & Jun", place: "Coastal estate", year: "2026",
      img: ["w1a", "w1b", "w1c"], ar: ["2/3", "2/3", "2/3"], pos: { x: "6vw", y: "7%", w: "22vw", ar: "2/3", s: .12 },
      brief: "A September wedding on open ground, with weather that changed every hour and a couple who wanted none of it posed.",
      how: "Two photographers: one stayed with Mara and Jun, the other with the guests. Available light only, and we let the wind do the styling.",
      facts: [["Coverage", "11 hours, first look to last song"], ["Team", "Two photographers"], ["Lenses", "35mm, 85mm"], ["Delivered", "640 frames in five weeks"]],
      caps: ["The field, just before the vows", "The forest walk after dinner"] },
    { slug: "quiet-hours", name: "Quiet Hours", kind: "Portrait series", client: "Ines Calder, cellist", place: "Capture studio, Bay 2", year: "2025",
      img: ["w2a", "w2b", "w2c"], pos: { x: "66vw", y: "13%", w: "18vw", ar: "4/5", s: -.1 },
      brief: "Press portraits for a debut album that needed to feel as unhurried as the music.",
      how: "One lamp, a black flag and long pauses between frames. We shot between takes so the expression was hers, not the camera's.",
      facts: [["Session", "Half a day in studio"], ["Light", "One lamp, one flag"], ["Lens", "85mm"], ["Delivered", "24 retouched portraits"]],
      caps: ["Between takes", "Final press portrait"] },
    { slug: "orlo-winter", name: "Orlo, Winter", kind: "Commercial · Interiors", client: "Orlo Hotels", place: "Alder House", year: "2026",
      img: ["w3a", "w3b", "w3c"], pos: { x: "35vw", y: "38%", w: "15vw", ar: "3/4", s: .2 },
      brief: "A season library for the hotel's new wing: rooms, corridors and the light that moves through them.",
      how: "We photographed each room at the hour its light was best, over three days, so the set reads as one calm afternoon.",
      facts: [["Shoot", "Three days on site"], ["Spaces", "14 rooms and public areas"], ["Light", "Daylight, tungsten fill"], ["Delivered", "180 images, web and print"]],
      caps: ["Lounge, late morning", "Guest corridor, evening"] },
    { slug: "kessa-glaze", name: "Kessa, Glaze Study", kind: "Commercial · Product", client: "Kessa Ceramics", place: "Capture studio, Table 1", year: "2025",
      img: ["w4a", "w4b", "w4c"], pos: { x: "72vw", y: "53%", w: "21vw", ar: "4/3", s: -.06 },
      brief: "A catalogue for a small ceramics studio whose glazes look different in every light.",
      how: "One soft window, one surface, the same angle for every piece. Consistency let the glazes do the talking.",
      facts: [["Pieces", "42 objects"], ["Set", "One table, one window"], ["Angles", "Three per piece"], ["Delivered", "Catalogue and web shop set"]],
      caps: ["The glaze shelf", "Still life with fruit"] },
    { slug: "brightwater-night", name: "Brightwater Night", kind: "Events · Festival", client: "Brightwater Festival", place: "Main field", year: "2026",
      img: ["w5a", "w5b", "w5c"], pos: { x: "9vw", y: "67%", w: "25vw", ar: "3/2", s: .1 },
      brief: "The closing night of a three-day festival: the crowd, the light, and the moment the headliner walked on.",
      how: "Three photographers on stage, pit and crowd, with an editor on site so the first selects went out before midnight.",
      facts: [["Coverage", "Six hours, three positions"], ["Team", "Three photographers, one editor"], ["Turnaround", "Selects the same night"], ["Delivered", "380 frames in 48 hours"]],
      caps: ["Light rig at full", "The headliner walks on"] }
  ];

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  const startLenis = () => {
    if (reduce || !window.Lenis || lenis) return;
    lenis = new window.Lenis({ lerp: .085, wheelMultiplier: .95 });
  };

  /* ---------- build the work field ---------- */
  const field = $("#wkField");
  field.innerHTML = WORK.map((w, i) => `<figure class="wk__it" style="--x:${w.pos.x};--y:${w.pos.y};--w:${w.pos.w};--ar:${w.pos.ar}" data-speed="${w.pos.s}" data-i="${i}">
      <button type="button" aria-label="Open ${w.name}, ${w.kind}"><div class="ph"><img src="media/${w.img[0]}.webp" alt="" loading="lazy"></div>
      <figcaption class="wk__cap"><b>${w.name}</b><span>${w.kind}</span></figcaption></button></figure>`).join("");

  /* ---------- statement: split into words that focus in order ---------- */
  const focusEl = $("#focus");
  const split = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(t => {
          if (!t) return;
          if (/^\s+$/.test(t)) frag.append(t);
          else { const s = document.createElement("span"); s.className = "w"; s.textContent = t; frag.append(s); }
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName === "MARK") n.classList.add("w");   // a highlighted phrase prints as one bar
      else if (n.nodeType === 1) split(n);
    });
  };
  split(focusEl);
  const words = $$(".w", focusEl);

  /* ---------- reveals + develop ---------- */
  $$(".svc__head, .ch__txt, .fn__head, .fn__card, .cl__head, .cl__row li, .bk__in").forEach(el => el.classList.add("rv"));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const t = e.target;
    if (t.classList.contains("ph")) { if (root.classList.contains("on-stage")) t.classList.add("dev"); else return; }
    else t.classList.add("in");
    io.unobserve(t);
  }), { threshold: .14, rootMargin: "0px 0px -6% 0px" });
  const watchAll = () => { $$(".rv:not(.in), main .ph:not(.dev)").forEach(el => io.observe(el)); };
  $$(".cl__row li").forEach((li, i) => li.style.transitionDelay = `${i * 70}ms`);
  $$(".fn__card").forEach((c, i) => c.style.transitionDelay = `${i * 110}ms`);

  /* ---------- frame counter ---------- */
  const frames = $$("[data-frame]").filter(s => !s.closest(".ch") || s.classList.contains("ch"));
  const fcN = $("#fcN"), fcT = $("#fcT"), fcL = $("#fcL");
  fcT.textContent = pad(frames.length);
  const setFrame = s => { const i = frames.indexOf(s); if (i < 0) return; fcN.textContent = pad(i + 1); fcL.textContent = s.dataset.frame; };
  const fio = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setFrame(e.target)), { rootMargin: "-45% 0px -54% 0px" });
  frames.forEach(f => fio.observe(f));

  /* ---------- parallax + focus + header, one loop ---------- */
  const movers = $$("[data-speed]").map(el => ({ el, s: +el.dataset.speed, host: el.closest("section, .ch, footer") || el.parentElement }));
  const hd = $("#hd"), darks = $$(".cl, .bk");
  const CLIENTS = [
    { name: "Orlo Hotels", kind: "Interiors", open: 2 }, { name: "Kessa", kind: "Product", open: 3 },
    { name: "Brightwater", kind: "Festival", open: 4 }, { name: "Maison Ardelle", kind: "Campaign" },
    { name: "Velm", kind: "Watches" }, { name: "Northcote & Hale", kind: "Events" },
  ];
  const dk = $("#dk"), dkSheets = $$(".dk__sheet"), dkN = $("#dkN"), dkName = $("#dkName"), dkKind = $("#dkKind"), dkGo = $("#dkGo"), dkBar = $("#dkBar");
  let dkK = -1;
  // "Capture ___": the subject beside the wordmark advances one word at a time
  const rolls = $$("[data-roll]").map(el => ({ el, reel: $(".hd__reel", el), w: $$(".hd__reel i", el) }));
  let ri = 0;
  const fitRoll = () => rolls.forEach(r => r.el.style.width = `${r.w[ri].offsetWidth}px`);
  let rollFast = false;
  const step = () => {   // every wordmark (loader, header) advances together; quicker while the loader counts
    if (ri >= rolls[0].w.length - 1) return;
    ri++;
    const dur = rollFast ? 360 : 800;
    rolls.forEach(r => { r.reel.style.transition = `transform ${dur}ms cubic-bezier(.7,0,.2,1)`; r.reel.style.transform = `translateY(${-ri * 1.378}em)`; });
    fitRoll();
    if (ri === rolls[0].w.length - 1) setTimeout(() => {   // the last word is a copy of the first: snap back unseen
      rolls.forEach(r => { r.reel.style.transition = "none"; r.reel.style.transform = "translateY(0)"; r.reel.offsetWidth; });
      ri = 0;
    }, dur + 60);
  };
  let rollT = 0;
  const rollEvery = ms => { clearInterval(rollT); if (!reduce && rolls.length) rollT = setInterval(() => { if (!document.hidden) step(); }, ms); };
  if (rolls.length) { fitRoll(); addEventListener("resize", fitRoll); document.fonts && document.fonts.ready.then(fitRoll); rollFast = true; rollEvery(430); }
  let lastY = 0, vh = innerHeight, vw = innerWidth;
  addEventListener("resize", () => { vh = innerHeight; vw = innerWidth; sizeDv(); });
  const tick = () => {
    const y = scrollY;
    if (!reduce && vw > 760) {
      for (const m of movers) {
        const r = m.host.getBoundingClientRect();
        if (r.bottom < -vh * .5 || r.top > vh * 1.5) continue;
        const off = (r.top + r.height / 2 - vh / 2);
        m.el.style.transform = `translate3d(0,${(off * m.s).toFixed(1)}px,0)`;
      }
    }
    // the statement: words come into focus as the block passes the middle of the screen
    if (!reduce) {
      const r = focusEl.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh * .78 - r.top) / (r.height + vh * .2)));
      const n = Math.round(p * words.length * 1.08);
      words.forEach((w, i) => w.classList.toggle("on", i < n));
    }
    if (!root.classList.contains("menu-on") && !dvOpen) hd.classList.toggle("away", y > lastY && y > vh * .6);
    root.classList.toggle("hd-dark", darks.some(d => { const r = d.getBoundingClientRect(); return r.top <= 44 && r.bottom >= 44; }));
    lastY = y;
    // the darkroom: which print is in the tray, and how far it has developed
    if (dk) {
      const r = dk.getBoundingClientRect(), span = Math.max(1, r.height - vh);
      const f = Math.min(.9999, Math.max(0, -r.top / span || 0)) * CLIENTS.length, k = Math.min(dkSheets.length - 1, Math.max(0, Math.floor(f)));
      const d = reduce ? 1 : Math.min(1, Math.max(0, (f - k) / .35));
      if (k !== dkK) {
        dkK = k;
        dkSheets.forEach((s, i) => {
          const u = i - k;
          s.classList.toggle("out", u < 0); s.classList.toggle("deep", u > 2);
          s.style.zIndex = String(20 - i); s.style.setProperty("--u", String(Math.max(0, u)));
        });
        const c = CLIENTS[k];
        dkN.textContent = pad(k + 1); dkName.textContent = c.name; dkKind.textContent = c.kind;
        dkGo.hidden = c.open == null;
        if (c.open != null) dkGo.firstChild.textContent = `See ${WORK[c.open].name}`;
      }
      dkSheets[k].style.setProperty("--d", d.toFixed(3));
      dkBar.style.setProperty("--d", d.toFixed(3));
    }
  };
  const loop = t => { if (lenis) lenis.raf(t); tick(); dvTick(); requestAnimationFrame(loop); };

  /* ---------- shutter: one loader for load and every route ---------- */
  const sh = $("#sh"), shN = $("#shN");
  const openShutter = async () => {
    sh.classList.remove("gone", "close");
    sh.classList.add("slit");
    await wait(reduce ? 0 : 520);
    sh.classList.add("open");
    root.classList.add("on-stage");
    await wait(reduce ? 0 : 1100);
    sh.classList.add("gone");
    sh.classList.remove("slit", "open");
  };
  const closeShutter = async () => {
    // leaves start apart (no transition), then meet in the middle
    const leaves = $$(".sh__leaf", sh);
    leaves.forEach(l => l.style.transition = "none");
    sh.classList.remove("gone", "slit");
    sh.classList.add("close", "open");
    sh.offsetWidth;
    leaves.forEach(l => l.style.transition = "");
    sh.classList.remove("open");
    await wait(reduce ? 0 : 720);
  };
  const boot = async () => {
    const imgs = $$(".hero img");
    let done = 0;
    const total = imgs.length + 1;
    const bump = () => { done++; };
    imgs.forEach(im => im.complete ? bump() : (im.addEventListener("load", bump, { once: true }), im.addEventListener("error", bump, { once: true })));
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(bump);
    const t0 = performance.now();
    await new Promise(res => {
      const step = () => {
        const real = done / total, time = Math.min(1, (performance.now() - t0) / 1400);
        const v = Math.min(real, time);
        shN.textContent = pad(Math.round(v * 99)) === "99" && v >= 1 ? "100" : pad(Math.round(v * 99));
        if (v >= 1 || performance.now() - t0 > 6000) { shN.textContent = "100"; return res(); }
        requestAnimationFrame(step);
      };
      step();
    });
    rollFast = false; rollEvery(2600);
    dkSheets.forEach(s => { const im = $("img", s); im && im.decode && im.decode().catch(() => {}); });
    startLenis();
    requestAnimationFrame(loop);
    const h = location.hash.slice(1);
    if (h && h !== "home" && !h.startsWith("p-")) jump(h, true);
    await openShutter();
    $$(".hero .ph").forEach((p, i) => setTimeout(() => p.classList.add("dev"), 120 + i * 140));
    watchAll();
    if (h.startsWith("p-")) { const i = WORK.findIndex(w => "p-" + w.slug === h); if (i > -1) { jump("work", true); await wait(300); openWork(i); } }
  };

  /* ---------- routes (hash): home sections for now; each becomes its own page later ---------- */
  const ROUTES = { home: 0, work: "#work", services: "#services", journal: "#journal", book: "#book" };
  const jump = (name, now) => {
    const t = ROUTES[name];
    if (t === undefined) return;
    const y = t === 0 ? 0 : $(t).getBoundingClientRect().top + scrollY - (name === "work" ? 0 : 0);
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true }); else window.scrollTo(0, y);
  };
  let busy = false;
  const go = async (name, push = true) => {
    if (busy || ROUTES[name] === undefined) return;
    busy = true;
    if (push) history.pushState(null, "", "#" + name);
    menu(false);
    await closeShutter();
    jump(name, true);
    await openShutter();
    busy = false;
  };
  document.addEventListener("click", e => {
    const a = e.target.closest("[data-go]");
    if (!a) return;
    e.preventDefault();
    go(a.dataset.go);
  });
  addEventListener("popstate", () => {
    const h = location.hash.slice(1) || "home";
    if (h.startsWith("p-")) { const i = WORK.findIndex(w => "p-" + w.slug === h); if (i > -1) openWork(i, true); return; }
    if (dvOpen) closeWork(true);
    else go(h, false);
  });

  /* ---------- menu ---------- */
  const menuEl = $("#menu"), menuBtn = $("#menuBtn");
  // menu: each page's photograph comes in behind the list while you point at it
  const mBg = $$(".menu__bg img");
  const menuBg = name => mBg.forEach(im => im.classList.toggle("on", im.dataset.bg === name));
  $$(".menu__list a").forEach(a => {
    a.addEventListener("pointerenter", () => menuBg(a.dataset.go));
    a.addEventListener("focus", () => menuBg(a.dataset.go));
  });
  $(".menu__list").addEventListener("pointerleave", () => menuBg(null));
  const menu = on => {
    if (on === root.classList.contains("menu-on")) return;
    menuBtn.setAttribute("aria-expanded", on);
    menuBtn.querySelector("span").textContent = on ? "Close" : "Menu";
    if (on) { menuEl.hidden = false; menuEl.offsetWidth; menuEl.classList.add("on"); root.classList.add("menu-on"); hd.classList.remove("away"); lenis && lenis.stop(); }
    else { menuEl.classList.remove("on"); root.classList.remove("menu-on"); lenis && lenis.start(); setTimeout(() => { if (!menuEl.classList.contains("on")) menuEl.hidden = true; }, 900); }
  };
  menuBtn.addEventListener("click", () => menu(!root.classList.contains("menu-on")));

  /* ---------- the opened frame ---------- */
  const dv = $("#dv"), dvScroll = $("#dvScroll"), dvTrack = $("#dvTrack"), dvBar = $("#dvBar"), dvHint = $("#dvHint");
  // pieces of a shoot that arrive one by one, then fade in from the right and out to the left as the reel moves
  const PIECES = ".pn__head h2, .pn__meta > div, .pn--txt > div > *, .pn--img .ph, .pn--img figcaption, .pn--facts > span, .pn--facts > h3, .pn--facts dl > div, .nx__txt > *";
  let anim = [];
  const measure = () => {
    const tr = dvTrack.getBoundingClientRect();
    anim.forEach(a => { const r = a.el.getBoundingClientRect(); a.x = r.left - tr.left - a.s; a.w = r.width; });
  };
  const setIntro = (delay = 120) => {
    measure();
    const now = performance.now(), tx = Math.min(cx, trackMax);
    const seen = anim.filter(a => a.x - tx < innerWidth).sort((p, q) => (p.x - q.x) || (p.el.getBoundingClientRect().top - q.el.getBoundingClientRect().top));
    anim.forEach(a => a.t = 0);
    seen.forEach((a, i) => a.t = now + delay + i * 110);
  };
  let dvOpen = false, cur = 0, cx = 0, cardIdx = -1, panels = [], dvMax = 1, trackMax = 1, grow = 1, nx = null, nxBox = null, swapping = false;
  const ph = (src, alt = "") => `<div class="ph"><img src="media/${src}.webp" alt="${alt}"></div>`;
  const build = i => {
    const w = WORK[i], n = WORK[(i + 1) % WORK.length];
    $("#dvIdx").textContent = pad(i + 1);
    $("#dvKind").textContent = w.kind;
    dvTrack.innerHTML = `
      <section class="pn pn--cover">${ph(w.img[0], w.name)}
        <div class="pn__head"><h2 id="dvT">${w.name}</h2>
          <dl class="pn__meta"><div><dt>Client</dt><dd>${w.client}</dd></div><div><dt>Practice</dt><dd>${w.kind}</dd></div><div><dt>Location</dt><dd>${w.place}</dd></div><div><dt>Year</dt><dd>${w.year}</dd></div></dl></div></section>
      <section class="pn pn--txt"><div><span class="mono">(01) The brief</span><h3>What they asked for</h3><p>${w.brief}</p></div>
        <div><span class="mono">(02) The approach</span><h3>How we shot it</h3><p>${w.how}</p></div></section>
      <figure class="pn pn--img">${ph(w.img[1], w.caps[0])}<figcaption class="mono"><span>${w.caps[0]}</span><span>Fr 02</span></figcaption></figure>
      <section class="pn pn--facts"><span class="mono">(03) On the day</span><h3 class="d-md" style="margin-top:14px">The shoot<br>in numbers</h3>
        <dl>${w.facts.map(f => `<div><dt>${f[0]}</dt><dd>${f[1]}</dd></div>`).join("")}</dl></section>
      <figure class="pn pn--img">${ph(w.img[2], w.caps[1])}<figcaption class="mono"><span>${w.caps[1]}</span><span>Fr 03</span></figcaption></figure>
      <section class="pn pn--next"><button type="button" class="nx" data-next="${(i + 1) % WORK.length}" aria-label="Next frame: ${n.name}">
        <span class="nx__txt"><span class="mono">Keep scrolling · Frame ${pad((i + 1) % WORK.length + 1)}</span><b>${n.name}</b><span class="nx__kind">${n.kind}</span></span>
        <span class="nx__ph"><img src="media/${n.img[0]}.webp" alt=""></span></button></section>`;
    panels = $$(".pn", dvTrack);
    anim = $$(PIECES, dvTrack).map(el => ({ el, x: 0, w: 0, t: 1e15, s: 0 }));   // hidden until the intro schedules them
    // portrait frames keep their shape; landscape ones widen
    $$(".pn--img .ph", dvTrack).forEach(p => {
      const im = $("img", p);
      const fit = () => { p.style.aspectRatio = `${im.naturalWidth}/${im.naturalHeight}`; sizeDv(); };
      im.complete && im.naturalWidth ? fit() : im.addEventListener("load", fit, { once: true });
    });
  };
  const sizeDv = () => {
    if (!dvOpen) return;
    trackMax = Math.max(1, dvTrack.scrollWidth - innerWidth);
    grow = Math.round(innerWidth * (innerWidth > 760 ? .7 : .9));   // scroll distance for the next frame to fill the screen
    dvMax = trackMax + grow;
    cur = Math.min(cur, dvMax);
    nx = $(".nx__ph", dvTrack);
    if (nx) { nx.style.cssText = ""; const r = nx.getBoundingClientRect(), pr = nx.closest(".pn").getBoundingClientRect(); nxBox = { l: r.left - pr.left, t: r.top - pr.top, w: r.width, h: r.height }; }
    measure();
  };
  const dvTick = () => {
    if (!dvOpen) return;
    if (tw) {   // the zoom into the next shoot: one timed, eased move that always lands
      const p = Math.min(1, (performance.now() - tw.t0) / tw.d);
      cx = cur = tw.from + (dvMax - tw.from) * (.5 - Math.cos(Math.PI * p) / 2);
      if (p >= 1) { cx = cur = dvMax; tw = null; }
    } else {
      cx += (cur - cx) * (reduce ? 1 : cx > trackMax - 2 && cur > trackMax ? .06 : .1);
      if (Math.abs(cur - cx) < .1) cx = cur;
    }
    const tx = Math.min(cx, trackMax);
    dvTrack.style.transform = `translate3d(${-tx.toFixed(2)}px,0,0)`;
    dvBar.style.transform = `scaleX(${(Math.min(cx, trackMax) / trackMax).toFixed(4)})`;
    // past the end of the track the next frame grows from its thumbnail to the full screen, then becomes the next shoot
    if (nx && nxBox) {
      const g = Math.min(1, Math.max(0, (cx - trackMax) / grow)), e = g < .5 ? 4 * g * g * g : 1 - Math.pow(-2 * g + 2, 3) / 2;
      const W = innerWidth, H = innerHeight;
      nx.style.left = `${nxBox.l + (0 - nxBox.l) * e}px`; nx.style.top = `${nxBox.t + (0 - nxBox.t) * e}px`;
      nx.style.width = `${nxBox.w + (W - nxBox.w) * e}px`; nx.style.height = `${nxBox.h + (H - nxBox.h) * e}px`;
      nx.style.borderRadius = `${2 * (1 - e)}px`;
      dvTrack.style.setProperty("--g", e.toFixed(3));
      if (g >= .999 && cur >= dvMax - .5 && !swapping) chain();
    }
    const now = performance.now(), W = innerWidth;
    for (const a of anim) {
      const x = a.x - tx, inP = reduce ? 1 : Math.min(1, Math.max(0, (W - x) / Math.min(a.w + 40, W * .28))),
        outP = reduce ? 1 : Math.min(1, Math.max(0, (x + a.w) / (W * .22))),
        it = a.t === 0 || reduce ? 1 : Math.min(1, Math.max(0, (now - a.t) / 800)), ie = 1 - Math.pow(1 - it, 3);
      const ent = Math.min(inP, ie), shift = (1 - ent) * 90 - (1 - outP) * 60;
      a.s = shift;
      a.el.style.opacity = Math.min(ent, outP).toFixed(3);
      a.el.style.transform = `translate3d(${shift.toFixed(1)}px,0,0)`;
    }
    let k = 0; const mid = tx + innerWidth / 2;
    panels.forEach((p, j) => { if (p.offsetLeft <= mid) k = j; });
    dvHint.textContent = cx < 8 ? "Scroll" : cx > trackMax + 4 ? "Next shoot" : `Frame ${pad(k + 1)} / ${pad(panels.length)}`;
  };
  // one sideways position, clamped at both ends, so the frame never bounces or drifts vertically
  // once you start into the next frame, it finishes growing by itself when you stop scrolling (a tiny nudge settles back)
  let idle = 0, tw = null;
  const zoomIn = () => {
    if (reduce) { cur = dvMax; return; }
    const g = Math.max(0, (cx - trackMax) / grow);
    tw = { from: Math.max(cx, trackMax), t0: performance.now(), d: 600 + 1300 * (1 - g) };
  };
  const settle = () => {
    if (!dvOpen || tw || cur <= trackMax) return;
    if ((cur - trackMax) / grow > .035) zoomIn(); else cur = trackMax;
  };
  const nudge = d => {
    if (tw) { if (d >= 0) return; tw = null; cur = cx; }   // scrolling back cancels the zoom
    cur = Math.min(dvMax, Math.max(0, cur + d)); clearTimeout(idle); idle = setTimeout(settle, 140);
  };
  dv.addEventListener("wheel", e => {
    e.preventDefault();
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    nudge(d * (e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? innerWidth : 1));
  }, { passive: false });
  let tx = 0, ty = 0;
  dv.addEventListener("touchstart", e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  dv.addEventListener("touchmove", e => {
    const x = e.touches[0].clientX, y = e.touches[0].clientY, dx = tx - x, dy = ty - y;
    tx = x; ty = y;
    nudge((Math.abs(dx) > Math.abs(dy) ? dx : dy) * 1.4);
    e.preventDefault();
  }, { passive: false });
  const fly = async (from, to, src, dur) => {
    const f = document.createElement("figure"); f.className = "fly";
    f.innerHTML = `<img src="${src}" alt="">`;
    Object.assign(f.style, { left: from.left + "px", top: from.top + "px", width: from.width + "px", height: from.height + "px" });
    document.body.append(f);
    const dx = to.left - from.left, dy = to.top - from.top;
    const a = f.animate([
      { left: from.left + "px", top: from.top + "px", width: from.width + "px", height: from.height + "px" },
      { left: to.left + "px", top: to.top + "px", width: to.width + "px", height: to.height + "px" }
    ], { duration: reduce ? 1 : dur, easing: "cubic-bezier(.76,0,.24,1)", fill: "forwards" });
    await a.finished.catch(() => {});
    return f;
  };
  const full = () => ({ left: 0, top: 0, width: innerWidth, height: innerHeight });
  let lastFocus = null;
  const openWork = async (i, noPush, from) => {
    if (dvOpen || busy) return;
    busy = true; cardIdx = i; lastFocus = document.activeElement;
    const it = $(`.wk__it[data-i="${i}"]`), box = (from || $(".ph", it)).getBoundingClientRect();
    lenis && lenis.stop(); document.body.classList.add("locked"); hd.classList.add("away"); $("#cur").classList.remove("big");
    build(i);
    const f = await fly(box, full(), `media/${WORK[i].img[0]}.webp`, 950);
    it.classList.add("hide");
    dv.hidden = false; dvOpen = true; cur = cx = 0; sizeDv();
    $(".pn--cover .ph", dvTrack).classList.add("dev");
    setIntro(60);
    requestAnimationFrame(() => { f.remove(); });
    if (!noPush) history.pushState(null, "", "#p-" + WORK[i].slug);
    $("#dvX").focus({ preventScroll: true });
    busy = false;
  };
  const closeWork = async noPush => {
    if (!dvOpen || busy) return;
    busy = true;
    const it = $(`.wk__it[data-i="${cardIdx}"]`);
    // the same shutter as every route: the leaves close over the shoot, the page is set (and its frames loaded) behind them, then it opens
    await closeShutter();
    dv.hidden = true; dvOpen = false;
    it && it.classList.remove("hide");
    dvTrack.innerHTML = ""; panels = []; anim = []; tw = null;
    document.body.classList.remove("locked"); lenis && lenis.start();
    if (it) {
      const y = it.getBoundingClientRect().top + scrollY - (innerHeight - it.offsetHeight) / 2;
      if (lenis) lenis.scrollTo(Math.max(0, y), { immediate: true, force: true }); else window.scrollTo(0, Math.max(0, y));
      const im = $("img", it);
      await Promise.race([Promise.all([im && im.decode ? im.decode().catch(() => {}) : 0, wait(reduce ? 0 : 380)]), wait(2500)]);
    }
    await openShutter();
    if (!noPush) history.pushState(null, "", "#work");
    hd.classList.remove("away");
    lastFocus && lastFocus.focus({ preventScroll: true });
    busy = false;
  };
  field.addEventListener("click", e => { const it = e.target.closest(".wk__it"); if (it) openWork(+it.dataset.i); });
  dkGo && dkGo.addEventListener("click", () => { const c = CLIENTS[dkK]; if (c && c.open != null) openWork(c.open, false, dkSheets[dkK]); });
  $("#dvX").addEventListener("click", () => closeWork());
  dvTrack.addEventListener("click", async e => {
    const b = e.target.closest("[data-next]");
    if (!b) return;
    zoomIn();
  });
  // the full-screen next frame IS the next cover: swap the reel underneath it with no visible change
  const chain = () => {
    swapping = true;
    const i = (cardIdx + 1) % WORK.length;
    $(`.wk__it[data-i="${cardIdx}"]`)?.classList.remove("hide");
    cardIdx = i; $(`.wk__it[data-i="${i}"]`)?.classList.add("hide");
    build(i); tw = null; cur = cx = 0; dvTrack.style.transform = "translate3d(0,0,0)"; sizeDv();
    $(".pn--cover .ph", dvTrack).classList.add("dev");
    setIntro(160);
    history.replaceState(null, "", "#p-" + WORK[i].slug);
    swapping = false;
  };
  addEventListener("keydown", e => {
    if (e.key === "Escape") { if (dvOpen) closeWork(); else if (root.classList.contains("menu-on")) menu(false); }
    if (dvOpen) {
      const step = { ArrowRight: 1, ArrowDown: 1, PageDown: 1, " ": 1, ArrowLeft: -1, ArrowUp: -1, PageUp: -1 }[e.key];
      if (step) { nudge(step * innerWidth * .6); e.preventDefault(); }
      if (e.key === "Home") { cur = 0; e.preventDefault(); }
      if (e.key === "End") { cur = trackMax; e.preventDefault(); }
    }
  });

  /* ---------- cursor: a focus point that opens over frames ---------- */
  if (fine && !reduce) {
    const c = $("#cur"); let mx = -100, my = -100, x = -100, y = -100;
    addEventListener("pointermove", e => { mx = e.clientX; my = e.clientY; c.classList.add("on"); const over = e.target.closest(".wk__it"); c.classList.toggle("big", !!over && !dvOpen); });
    document.addEventListener("pointerleave", () => c.classList.remove("on"));
    const run = () => { x += (mx - x) * .2; y += (my - y) * .2; c.style.transform = `translate3d(${x}px,${y}px,0)`; requestAnimationFrame(run); };
    run();
  }

  /* ---------- booking: honest prototype state ---------- */
  $("#bkForm").addEventListener("submit", e => {
    e.preventDefault();
    const f = e.target, d = f.date.value, msg = $("#bkMsg");
    if (!d) { msg.textContent = "Pick a date first, then we'll check it."; f.date.focus(); return; }
    const nice = new Date(d + "T12:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    msg.textContent = `${f.kind.value} on ${nice}. In this prototype nothing is sent; the booking page will hold the date and ask for details.`;
  });

  if (document.readyState === "complete") boot(); else addEventListener("load", boot, { once: true });
})();
