/* Monarch Labs — preloader.
   Real progress where it can be had (fonts, then the window load: the word photos are CSS backgrounds, so
   they count), smoothed so the number never jumps: it eases toward 90% while waiting and only runs to 100%
   once everything is in. Shown for at least MIN ms so the sync reads, never longer than MAX.
   As it fills: the service photos flick through inside the Wings, the name decodes left to right, the percentage counts up under it.
   Then the panel is wiped away from left to right, the hero assembles left to right behind the sweep, and
   "ml:ready" tells hero.js to start the cycle.
   Reduced motion: no decoding, no wipe; a short fade.
   Straight onto the work view (a #work-… link or a refresh there): no flicker, decode, count or hero intro; the panel
   simply wipes off the work view, as between pages, once the fonts are in. */
(() => {
  "use strict";
  const pre = document.getElementById("pre");
  const ready = () => { window.MLReady = true; document.dispatchEvent(new CustomEvent("ml:ready")); };
  if (!pre) { ready(); return; }
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wings = pre.querySelector(".pre-wings"), num = pre.querySelector(".pre-num"), name = pre.querySelector(".pre-name");
  const WORD = name.dataset.w || name.textContent, GLYPHS = "ABCDEFGHJKMNPQRSTUVWXYZ0123456789/<>_+";
  const direct = /^#work-\w/.test(location.hash);
  const MIN = still ? 300 : 1800, MAX = 4200, t0 = performance.now();

  /* the Wings: the hero's service photos (Unsplash, same URLs, so they also warm the cache for the letters)
     take turns inside the mark every 160ms while the panel is up */
  const PHOTOS = "1592330772360-8392898d1010 1553949345-eb786bb3f7ba 1602979082099-7971376fce79 1771012205426-1da9cdcfd11f 1760113218007-c03ca6b1d949 1580566176138-daa588058b59 1592330804928-231e83180766 1613216512748-39895e7e9675 1631931931379-9dc037ac6a9d 1581084324492-c8076f130f86 1513624954087-ca7109c0f710 1597616756802-df5ef80fdd4c 1590508965885-90c5502bd6f4 1613216513114-fd1ba08f64c6 1585758942414-7a30b116f2af 1760113300254-b4b85e1b703b 1654714910041-c7c8125606a7 1537210121222-17be6deceff3".split(" ");
  let shots = [];
  const build = () => { if (!shots.length) shots = PHOTOS.map(id => {
    const el = document.createElement("i");
    el.style.setProperty("--img", `url('https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${matchMedia("(max-width:820px)").matches ? 1000 : 1400}&q=60')`);
    wings.appendChild(el); return el;
  }); };
  let flk = 0, fi = 0;
  const flick = () => {
    clearInterval(flk);
    if (still) return;
    build();
    const step = () => { shots.forEach((el, k) => el.classList.toggle("on", k === fi)); fi = (fi + 1) % shots.length; };
    step(); flk = setInterval(() => { if (pre.classList.contains("done") && !pre.classList.contains("leave")) { clearInterval(flk); return; } step(); }, 160);
  };
  if (!direct) flick();

  /* the hero waits hidden under the panel, then assembles left to right (see .pre-intro in styles.css) */
  const root = document.documentElement;
  if (direct) {
    root.classList.add("direct");
    name.textContent = WORD; num.hidden = true;
    const lift = () => {
      pre.classList.add("done");
      ready();
      setTimeout(() => { pre.classList.add("gone"); root.classList.remove("direct"); }, still ? 50 : 1500);
    };
    Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(r => setTimeout(r, 1500))])
      .then(() => setTimeout(lift, still ? 0 : 250));
  }
  if (!still && !direct) {
    root.classList.add("pre-intro");
    setTimeout(() => { if (!root.classList.contains("in")) root.classList.remove("pre-intro"); }, 7000);   /* never leave the hero hidden */
  }
  const intro = () => {
    if (still) return;
    const W = innerWidth;
    const els = [...document.querySelectorAll(".cols i,.mark,.nav,.bar .btn,.side-l,.side-r,.word,.desc,.hero .see")];
    let last = 0;
    els.forEach(el => {
      const r = el.getBoundingClientRect();
      const lines = el.parentElement.classList.contains("cols");
      /* follow the sweep (it starts .3s after "done" and crosses in 1.1s); the hairlines lead slightly */
      const d = 0.35 + Math.max(0, r.left / W) * 0.95 + (lines ? -0.1 : 0.12);
      el.style.setProperty("--in", d.toFixed(2) + "s");
      last = Math.max(last, d);
    });
    root.classList.add("in");
    setTimeout(() => {                                       /* hand the elements back to their own styles */
      root.classList.remove("pre-intro", "in");
      els.forEach(el => el.style.removeProperty("--in"));
    }, (last + 1.3) * 1000);
  };

  let loaded = false;
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  const win = document.readyState === "complete" ? Promise.resolve() : new Promise(r => addEventListener("load", r, { once: true }));
  Promise.all([fonts, win]).then(() => { loaded = true; });

  const esc = c => c === " " ? "&nbsp;" : c;
  const decode = p => {                     /* letters settle left to right; the rest keep shuffling. Every letter sits in a fixed-width slot so the centred name never shifts */
    if (still) return;
    const settled = Math.floor(p * (WORD.length + 1));
    let out = "";
    for (let k = 0; k < WORD.length; k++) {
      const c = WORD[k];
      out += k < settled || c === " " ? "<i>" + esc(c) + "</i>" : "<i><b>" + GLYPHS[(Math.random() * GLYPHS.length) | 0] + "</b></i>";
    }
    name.innerHTML = out;
  };

  let shown = 0, last = 0;
  const tick = now => {
    const t = now - t0;
    const done = (loaded && t >= MIN) || t >= MAX;
    /* while waiting, approach 0.9 on a slow curve; once done, close the gap quickly */
    const target = done ? 1 : 0.9 * (1 - Math.exp(-t / 900));
    shown += (target - shown) * (done ? 0.14 : 0.08);
    if (done && 1 - shown < 0.004) shown = 1;
    num.textContent = Math.round(shown * 100) + "%";
    if (now - last > 55) { decode(shown); last = now; }   /* the shuffle runs at ~18fps, calmer than the frame rate */
    if (shown < 1) { requestAnimationFrame(tick); return; }
    if (!still) decode(1);
    setTimeout(() => {
      pre.classList.add("done");
      intro();
      ready();
      setTimeout(() => pre.classList.add("gone"), still ? 50 : 1500);   /* .3s delay + 1.1s wipe */
    }, still ? 0 : 380);
  };
  if (!direct) requestAnimationFrame(tick);

  /* the same page change without leaving the page (work.js: opening a project, back to its service): the panel wipes
     in from the left exactly as for a link, task() draws the new view under it, the name decodes and the percentage
     counts up while wait() (the project's live page) loads, at least MIN, at most MAX, then the panel wipes off
     left to right as on arrival */
  const cover = (task, wait) => new Promise(res => {
    if (still) { task(); res(); return; }
    pre.classList.remove("gone", "leave", "done");
    pre.classList.add("snap", "from-left", "done");
    flick();
    num.hidden = false; num.textContent = "0%"; decode(0);
    void pre.offsetWidth;
    pre.classList.remove("snap");
    pre.classList.add("leave");
    requestAnimationFrame(() => pre.classList.remove("from-left", "done"));
    setTimeout(() => {
      task();
      let ok = false, shown = 0, lastD = 0;
      const s0 = performance.now();
      Promise.race([Promise.resolve(wait ? wait() : null), new Promise(r => setTimeout(r, MAX))]).then(() => { ok = true; });
      const step = now => {
        const t = now - s0, done = (ok && t >= MIN) || t >= MAX;
        const target = done ? 1 : 0.9 * (1 - Math.exp(-t / 900));
        shown += (target - shown) * (done ? 0.14 : 0.08);
        if (done && 1 - shown < 0.004) shown = 1;
        num.textContent = Math.round(shown * 100) + "%";
        if (now - lastD > 55) { decode(shown); lastD = now; }
        if (shown < 1) { requestAnimationFrame(step); return; }
        decode(1);
        setTimeout(() => {
          pre.classList.remove("leave");
          pre.classList.add("done");
          res();
          setTimeout(() => pre.classList.add("gone"), 1500);
        }, 380);
      };
      requestAnimationFrame(step);
    }, 950);
  });
  window.MLPre = { cover };

  /* the views: one page, #studio, #capabilities and #contact (#home, and anything else, #work-… included, is home). A link to
     another view wipes the panel in from the left, swaps the view under it, then wipes off, as between pages. New
     tabs, modified clicks and the current view's own link are left alone. Back / forward move between views the same way. */
  const TITLES = { home: document.title, studio: "Studio — Monarch Labs", capabilities: "Capabilities — Monarch Labs", contact: "Contact — Monarch Labs" };
  const viewOf = h => { const k = (h || "").replace(/^#/, ""); return TITLES[k] ? k : "home"; };
  let view = "";
  const setView = v => {
    if (v !== "home" && window.MLWork) MLWork.shut();
    Object.keys(TITLES).forEach(k => root.classList.toggle("v-" + k, k === v));
    view = v; document.title = TITLES[v];
    document.querySelectorAll('.bar a[href^="#"]').forEach(a => {
      const on = a.getAttribute("href") === "#" + v;
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
      if (a.classList.contains("btn")) { if (on) { a.setAttribute("aria-disabled", "true"); a.tabIndex = -1; } else { a.removeAttribute("aria-disabled"); a.removeAttribute("tabindex"); } }
    });
    document.dispatchEvent(new CustomEvent("ml:view", { detail: v }));
  };
  setView(viewOf(location.hash));
  if (!location.hash) history.replaceState(null, "", "#home");   /* the address always names the view */
  const goTo = v => { if (v !== view) cover(() => setView(v)); };
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target) return;
    const k = a.getAttribute("href").slice(1);
    if (!TITLES[k]) return;
    e.preventDefault();
    if (k === view || !pre.classList.contains("done") || pre.classList.contains("leave")) return;
    history.pushState(null, "", "#" + k);
    goTo(k);
  });
  addEventListener("popstate", () => goTo(viewOf(location.hash)));

  /* back/forward from the page cache: lift the panel again instead of staying covered */
  addEventListener("pageshow", e => { if (e.persisted) { pre.classList.remove("leave", "from-left"); pre.classList.add("done"); } });
})();
