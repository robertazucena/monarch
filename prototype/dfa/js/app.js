/* Department of Foreign Affairs · concept. Shared behaviour for every page; each block only runs when its
   element is on the page. Data comes from js/data.js, the shell from js/shell.js. No external libraries. */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const ICON = id => `<svg aria-hidden="true"><use href="#${id}"/></svg>`;
  const smooth = () => (RM ? "auto" : "smooth");
  const Q = new URLSearchParams(location.search);
  const D = window.DATA;
  const norm = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  /* page transition: fade the body up and out, then go. Same-site links only; new tabs, modifier
     clicks, downloads, tel/mailto and same-page anchors behave normally. bfcache returns reset the state. */
  const leave = href => { if (RM) return void (location.href = href); document.documentElement.classList.add("is-leaving"); setTimeout(() => { location.href = href; }, 260); };
  document.addEventListener("click", e => {
    const a = e.target.closest("a[href]"); if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === "_blank" || a.hasAttribute("download") || /^(tel|mailto|https?):/i.test(a.getAttribute("href"))) return;
    const u = new URL(a.href, location.href); if (u.pathname === location.pathname && u.search === location.search) return;
    e.preventDefault(); leave(a.href);
  });
  addEventListener("pageshow", e => { if (e.persisted) document.documentElement.classList.remove("is-leaving"); });
  const maps = q => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);

  /* ---------- live Philippine Standard Time ---------- */
  const pst = $("#pst");
  const fLong = new Intl.DateTimeFormat("en-PH", { timeZone: "Asia/Manila", weekday: "short", month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
  const fShort = new Intl.DateTimeFormat("en-PH", { timeZone: "Asia/Manila", hour: "2-digit", minute: "2-digit", hour12: true });
  const tick = () => { pst.textContent = (innerWidth < 640 ? fShort : fLong).format(new Date()) + " PST"; };
  tick(); setInterval(tick, 1000);

  const fmts = {};
  const nowIn = tz => {
    fmts[tz] = fmts[tz] || new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false });
    const p = Object.fromEntries(fmts[tz].formatToParts(new Date()).map(x => [x.type, x.value]));
    const h = +p.hour % 24;
    return { day: p.weekday, mins: h * 60 + +p.minute, label: `${String(h).padStart(2, "0")}:${p.minute}` };
  };
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const postOpen = tz => { const n = nowIn(tz), d = DAYS.indexOf(n.day); return d < 5 && n.mins >= 540 && n.mins < 1020; };

  /* ---------- header ---------- */
  const hd = $("#hd");
  addEventListener("scroll", () => hd.classList.toggle("is-scrolled", scrollY > 8), { passive: true });
  const menuBtn = $("#menuBtn"), mnav = $("#mnav");
  const setMenu = open => { mnav.hidden = !open; menuBtn.setAttribute("aria-expanded", open); menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu"); menuBtn.innerHTML = ICON(open ? "i-x" : "i-menu"); };
  menuBtn.addEventListener("click", () => setMenu(mnav.hidden));
  mnav.addEventListener("click", e => { if (e.target.closest("nav a")) setMenu(false); });
  addEventListener("resize", () => { if (innerWidth > 1180 && !mnav.hidden) setMenu(false); });

  /* dropdown menus: click or hover on desktop, Escape closes and returns focus */
  const groups = $$(".nav__g");
  const closeDD = except => groups.forEach(g => { if (g === except) return; const b = $("button", g); b.setAttribute("aria-expanded", "false"); $(".dd", g).classList.remove("is-open"); });
  const openDD = g => { closeDD(g); $("button", g).setAttribute("aria-expanded", "true"); $(".dd", g).classList.add("is-open"); };
  const hoverable = matchMedia("(hover:hover)").matches; let ddTimer;
  groups.forEach(g => {
    const b = $("button", g);
    b.addEventListener("click", () => (b.getAttribute("aria-expanded") === "true" ? closeDD() : openDD(g)));
    if (hoverable) {
      g.addEventListener("mouseenter", () => { clearTimeout(ddTimer); openDD(g); });
      g.addEventListener("mouseleave", () => { ddTimer = setTimeout(() => closeDD(), 140); });
    }
    g.addEventListener("keydown", e => { if (e.key === "Escape") { closeDD(); b.focus(); } });
    g.addEventListener("focusout", e => { if (!g.contains(e.relatedTarget)) { $(".dd", g).classList.remove("is-open"); b.setAttribute("aria-expanded", "false"); } });
  });
  document.addEventListener("click", e => { if (!e.target.closest(".nav__g")) closeDD(); });

  /* sliding pill: rests on the current section, follows the pointer across the menu */
  const nav = $(".nav"), navT = $$(".nav__t"), cur = $(".nav [data-current]");
  const pill = document.createElement("i"); pill.className = "nav__pill"; pill.setAttribute("aria-hidden", "true"); nav.prepend(pill);
  const placePill = el => { pill.classList.toggle("is-on", !!el); if (!el) return;
    const n = nav.getBoundingClientRect(), r = el.getBoundingClientRect();
    pill.style.setProperty("--x", r.left - n.left + "px"); pill.style.setProperty("--w", r.width + "px"); };
  navT.forEach(t => t.addEventListener("mouseenter", () => placePill(t)));
  nav.addEventListener("mouseleave", () => placePill(cur));
  const rest = () => placePill(cur);
  rest(); addEventListener("resize", rest); if (document.fonts) document.fonts.ready.then(rest);

  $$('a[href="#top"]').forEach(a => a.addEventListener("click", e => { e.preventDefault(); scrollTo({ top: 0, behavior: smooth() }); }));

  /* ---------- guilloché (security-print rosette) on any .guil ---------- */
  $$(".guil").forEach(svg => {
    const NS = "http://www.w3.org/2000/svg", g = document.createElementNS(NS, "g");
    svg.setAttribute("viewBox", "0 0 600 600");
    for (let i = 0; i < 16; i++) {
      const R = 120 + i * 10, A = 12 + (i % 3) * 6, k = 18 + (i % 4) * 6, ph = i * .41; let d = "";
      for (let j = 0; j <= 720; j++) { const t = j / 720 * Math.PI * 2, r = R + A * Math.sin(k * t + ph) + A * .4 * Math.sin((k / 2 + 1) * t); d += (j ? "L" : "M") + (300 + r * Math.cos(t)).toFixed(1) + " " + (300 + r * Math.sin(t)).toFixed(1); }
      const p = document.createElementNS(NS, "path"); p.setAttribute("d", d + "Z"); g.appendChild(p);
    }
    svg.appendChild(g); g.style.transformOrigin = "300px 300px";
    if (!RM) g.animate([{ transform: "rotate(0)" }, { transform: "rotate(360deg)" }], { duration: 300000, iterations: Infinity });
  });

  /* ---------- toast + modal ---------- */
  const toast = $("#toast"), toastT = $("#toastT"); let toastTimer;
  const showToast = msg => { toastT.textContent = msg; toast.classList.add("is-on"); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("is-on"), 3500); };
  const modal = $("#modal"), modalT = $("#modalT"), modalB = $("#modalB"); let lastFocus;
  const openModal = (title, html) => { lastFocus = document.activeElement; modalT.textContent = title; modalB.innerHTML = html; modal.showModal(); modalB.scrollTop = 0; };
  modal.addEventListener("close", () => { if (lastFocus && lastFocus.focus) lastFocus.focus(); });
  modal.addEventListener("click", e => { if (e.target === modal || e.target.closest("[data-close]")) modal.close(); });
  const MODALS = {
    atn: () => openModal("24/7 OFW Emergency Assistance to Nationals", `
      <div class="alert"><b>Crisis and repatriation desk</b><span>Open 24 hours a day, 7 days a week for distressed Overseas Filipinos.</span></div>
      <ul class="kv">
        <li><span>DFA-OUMWA / ATN hotline (Manila)</span><a href="tel:+63288344996">(+632) 8834-4996</a></li>
        <li><span>Mobile, Viber or WhatsApp</span><a href="tel:+639617188881">+63 961-718-8881</a></li>
        <li><span>Email</span><a href="mailto:oumwa@dfa.gov.ph">oumwa@dfa.gov.ph</a></li>
      </ul>
      <p class="muted">Give your full name, exact location and host country, passport number if you have it, and what has happened. If you are abroad, also contact the nearest Philippine Embassy or Consulate General.</p>
      <p><a class="btn btn--red" href="atn.html">What Assistance to Nationals covers${ICON("i-arrow")}</a></p>`),
    visa: () => openModal("Philippine visa and entry guidelines", `
      <p>Nationals of more than <strong>150 countries</strong>, including ASEAN member states, the USA, UK, EU nations, Japan, South Korea and Australia, may enter the Philippines <strong>visa-free for up to 30 days</strong> for tourism or business, provided they have:</p>
      <ul class="ul"><li>A passport valid for at least <strong>six months</strong> beyond the planned stay</li><li>A confirmed return or onward ticket</li><li>A completed <strong>eTravel registration</strong> at etravel.gov.ph within 72 hours before arrival</li></ul>
      <p><a class="btn btn--green" href="visa.html">Full visa and entry guide${ICON("i-arrow")}</a></p>`)
  };
  $$("[data-open]").forEach(b => b.addEventListener("click", () => MODALS[b.dataset.open]()));

  /* ---------- requirements & fees tool ---------- */
  const svcBox = $("#svcBox");
  if (svcBox) {
    const SVC = D.SVC, ticks = {}; let curSvc = "new_passport";
    const chkList = $("#chkList"), chkN = $("#chkN"), chkBar = $(".chk__bar");
    const fee = ([v, unit]) => esc(v) + (unit ? `<small>${esc(unit)}</small>` : "");
    const updateProgress = () => {
      const t = ticks[curSvc], n = t.filter(Boolean).length, all = n === t.length;
      chkN.textContent = all ? "All set, you’re ready to book" : `${n} of ${t.length} ready`;
      chkN.classList.toggle("is-done", all); chkBar.classList.toggle("is-done", all);
      chkBar.firstElementChild.style.transform = `scaleX(${n / t.length})`;
    };
    const selectService = (key, focusTab) => {
      const d = SVC[key]; if (!d) return; curSvc = key; ticks[key] = ticks[key] || d.list.map(() => false);
      $$(".seg [role=tab]").forEach(b => { const on = b.dataset.svc === key; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; if (on && focusTab) b.focus(); });
      svcBox.setAttribute("aria-labelledby", "tab-" + key);
      $("#svcTitle").textContent = d.title;
      $("#feeReg").innerHTML = fee(d.reg); $("#feeExp").innerHTML = fee(d.exp);
      $("#dayReg").textContent = d.regD; $("#dayExp").textContent = d.expD;
      chkList.innerHTML = d.list.map((t, i) => `<li><label><input type="checkbox" data-i="${i}"${ticks[key][i] ? " checked" : ""}><span class="box" aria-hidden="true"><svg viewBox="0 0 12 12"><path d="M2 6.5 5 9l5-6"/></svg></span><span>${esc(t)}</span></label></li>`).join("");
      $("#svcNote").textContent = d.note;
      const go = $("#svcGo"); go.href = d.url[0]; go.querySelector("span").textContent = "Proceed to " + d.url[1];
      const more = $("#svcMore"); if (more) more.href = d.page;
      updateProgress();
      svcBox.classList.remove("is-swap"); void svcBox.offsetWidth; svcBox.classList.add("is-swap");
    };
    chkList.addEventListener("change", e => { ticks[curSvc][+e.target.dataset.i] = e.target.checked; updateProgress(); });
    const seg = $(".seg");
    seg.addEventListener("click", e => { const b = e.target.closest("[data-svc]"); if (b) selectService(b.dataset.svc); });
    seg.addEventListener("keydown", e => {
      const keys = Object.keys(SVC), i = keys.indexOf(curSvc);
      const n = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: keys.length - 1 }[e.key];
      if (n === undefined) return; e.preventDefault(); selectService(keys[(n + keys.length) % keys.length], true);
    });
    $$("[data-svc-jump]").forEach(b => b.addEventListener("click", () => { selectService(b.dataset.svcJump); $("#assistant").scrollIntoView({ behavior: smooth(), block: "start" }); }));
    selectService(SVC[Q.get("svc")] ? Q.get("svc") : "new_passport");
  }

  /* ---------- services grid ---------- */
  $$("[data-services]").forEach(el => { el.innerHTML = D.SERVICES.map(v => `<a class="lc" href="${v.href}">
      <span class="card__ic card__ic--${v.tone}">${ICON("i-" + v.icon)}</span><span class="lc__k">${v.group}</span><span class="lc__h">${v.title}</span>
      <span class="lc__p">${v.text}</span><span class="lc__meta"><span>Fee <b>${v.fee}</b></span><span>Time <b>${v.time}</b></span></span>${ICON("i-arrow").replace("<svg", '<svg class="lc__go"')}</a>`).join(""); });

  /* ---------- consular offices (home panel + offices page) ---------- */
  const offList = $("#offList");
  if (offList) {
    const OFF = D.OFFICES, regPills = $("#regPills"), offCount = $("#offCount"), offQ = $("#offQ");
    let curReg = D.REGIONS.some(r => r[0] === Q.get("r")) ? Q.get("r") : "ALL", q = Q.get("q") || "";
    if (offQ) offQ.value = q;
    const hr = h => (h % 12 || 12) + ":00 " + (h < 12 ? "AM" : "PM");
    const isOpen = o => { const n = nowIn("Asia/Manila"), d = DAYS.indexOf(n.day); return d >= o.days[0] && d <= o.days[1] && n.mins >= o.open * 60 && n.mins < o.close * 60; };
    regPills.innerHTML = D.REGIONS.map(([k, l]) => `<button type="button" role="radio" aria-checked="${k === curReg}" data-reg="${k}">${l} <small>${k === "ALL" ? OFF.length : OFF.filter(o => o.region === k).length}</small></button>`).join("");
    const render = () => {
      $$("[data-reg]", regPills).forEach(b => b.setAttribute("aria-checked", b.dataset.reg === curReg));
      const w = norm(q).split(/\s+/).filter(Boolean);
      const list = OFF.filter(o => (curReg === "ALL" || o.region === curReg) && w.every(x => norm(o.name + " " + o.city + " " + o.address + " " + o.services).includes(x)));
      const openN = list.filter(isOpen).length;
      offCount.textContent = list.length ? `${list.length} office${list.length > 1 ? "s" : ""} · ${openN} open now (Philippine time)` : "No office matches. Try a city such as Cebu, Davao or Baguio.";
      offList.innerHTML = list.map((o, i) => { const op = isOpen(o);
        return `<li class="off" style="animation-delay:${Math.min(i, 10) * 35}ms">
          <div class="off__top"><h3 class="off__n">${esc(o.name)}</h3><span class="off__reg">${o.region}</span></div>
          <p class="off__a">${ICON("i-pin")}<span>${esc(o.address)}</span></p>
          <div class="off__ft"><span class="off__st${op ? " is-open" : ""}">${op ? "Open now" : "Closed"}</span><span class="off__hrs">${DAYS[o.days[0]]}–${DAYS[o.days[1]]}, ${hr(o.open)} – ${hr(o.close)}</span><span class="off__svc">${esc(o.services)}</span>
          <a class="off__map" href="${maps(o.name + " " + o.address)}" target="_blank" rel="noopener">Map<span class="sr"> for ${esc(o.name)}</span></a></div></li>`; }).join("");
    };
    regPills.addEventListener("click", e => { const b = e.target.closest("[data-reg]"); if (b) { curReg = b.dataset.reg; render(); } });
    if (offQ) offQ.addEventListener("input", () => { q = offQ.value; render(); });
    render(); setInterval(render, 60000);
  }

  /* ---------- news cards (home + newsroom) ---------- */
  const newsCard = (n, i) => `<li class="nc" style="animation-delay:${Math.min(i, 8) * 50}ms">
      <div class="nc__top"><span class="badge badge--${n.cat}">${n.badge}</span><time>${n.date}</time></div>
      <h3><a class="nc__a" href="article.html?id=${n.id}">${esc(n.title)}</a></h3><p>${esc(n.summary)}</p>
      <span class="nc__go" aria-hidden="true">Read full advisory${ICON("i-arrow")}</span></li>`;
  const newsGrid = $("#newsGrid");
  if (newsGrid) {
    const newsPills = $("#newsPills"), newsQ = $("#newsQ"), more = $("#newsMore"), limit = +newsGrid.dataset.limit || 0, per = +newsGrid.dataset.page || 0;
    let cat = D.CATS.some(c => c[0] === Q.get("cat")) ? Q.get("cat") : "ALL", q = Q.get("q") || "", shown = per;
    if (newsQ) newsQ.value = q;
    newsPills.classList.add("pills--blue");
    newsPills.innerHTML = D.CATS.map(([k, l]) => `<button type="button" role="radio" aria-checked="${k === cat}" data-cat="${k}">${l}</button>`).join("");
    const render = () => {
      $$("[data-cat]", newsPills).forEach(b => b.setAttribute("aria-checked", b.dataset.cat === cat));
      const w = norm(q).split(/\s+/).filter(Boolean);
      let list = D.NEWS.filter(n => (cat === "ALL" || n.cat === cat) && w.every(x => norm(n.title + " " + n.summary + " " + n.badge + " " + n.body.join(" ")).includes(x)));
      const total = list.length;
      if (limit) list = list.slice(0, limit); else if (per) list = list.slice(0, shown);
      newsGrid.innerHTML = list.length ? list.map(newsCard).join("") : `<li class="empty">No updates match “${esc(q)}”. Try another word or clear the search.</li>`;
      const cnt = $("#newsCount"); if (cnt) cnt.textContent = q ? `${total} result${total === 1 ? "" : "s"} for “${q}”` : `${total} update${total === 1 ? "" : "s"}`;
      if (more) more.hidden = !per || shown >= total;
    };
    newsPills.addEventListener("click", e => { const b = e.target.closest("[data-cat]"); if (b) { cat = b.dataset.cat; shown = per; render(); } });
    if (newsQ) newsQ.addEventListener("input", () => { q = newsQ.value; shown = per; render(); });
    if (more) more.addEventListener("click", () => { shown += per; render(); });
    render();
  }

  /* ---------- featured news carousel (home + newsroom) ----------
     Slides crossfade with a slow photo drift. Autoplays every 7s with a progress line on the active dot;
     pauses on hover, on keyboard focus and when the tab is hidden; arrows, dots, ←/→ keys and swipe work.
     Reduced motion: no autoplay, no drift. */
  const feat = $("#newsFeat");
  if (feat) {
    const list = D.FEATURED.map(id => D.NEWS.find(n => n.id === id)).filter(Boolean);
    feat.innerHTML = `<div class="feat__stage">${list.map((n, i) => `
      <article class="feat__s${i ? "" : " is-on"}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${list.length}"${i ? ' aria-hidden="true"' : ""}>
        <div class="feat__img"><img src="${n.img}" alt="" ${i ? 'loading="lazy" ' : ""}decoding="async" width="1400" height="900"><small>Photo: ${esc(n.credit)} / Unsplash</small></div>
        <div class="feat__txt">
          <div class="nc__top"><span class="badge badge--${n.cat}">${n.badge}</span><time>${n.date}</time></div>
          <h3 class="feat__h"><a href="article.html?id=${n.id}"${i ? ' tabindex="-1"' : ""}>${esc(n.title)}</a></h3>
          <p class="feat__p">${esc(n.summary)}</p>
          <span class="feat__go" aria-hidden="true">Read the story${ICON("i-arrow")}</span>
        </div>
      </article>`).join("")}</div>
      <div class="feat__ctl">
        <button class="feat__b" type="button" data-step="-1" aria-label="Previous story">${ICON("i-arrow")}</button>
        <div class="feat__dots">${list.map((n, i) => `<button type="button" class="feat__dot" data-go="${i}" aria-label="Story ${i + 1}: ${esc(n.title)}"${i ? "" : ' aria-current="true"'}><i></i></button>`).join("")}</div>
        <button class="feat__b" type="button" data-step="1" aria-label="Next story">${ICON("i-arrow")}</button>
      </div>`;
    const slides = $$(".feat__s", feat), dots = $$(".feat__dot", feat), DUR = 7000;
    let cur = 0, timer, paused = false;
    const show = k => {
      cur = (k + slides.length) % slides.length;
      slides.forEach((s, i) => { const on = i === cur; s.classList.toggle("is-on", on); s.setAttribute("aria-hidden", !on); $("a", s).tabIndex = on ? 0 : -1; });
      dots.forEach((d, i) => { if (i === cur) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current"); });
      feat.style.setProperty("--dur", DUR + "ms"); feat.classList.remove("is-run"); void feat.offsetWidth; if (!RM && !paused) feat.classList.add("is-run");
      clearTimeout(timer); if (!RM && !paused) timer = setTimeout(() => show(cur + 1), DUR);
    };
    const pause = on => { paused = on; feat.classList.toggle("is-paused", on); if (on) clearTimeout(timer); else show(cur); };
    feat.addEventListener("click", e => { const b = e.target.closest("[data-step],[data-go]"); if (!b) return; show(b.dataset.go != null ? +b.dataset.go : cur + +b.dataset.step); });
    feat.addEventListener("keydown", e => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); show(cur + (e.key === "ArrowRight" ? 1 : -1)); } });
    feat.addEventListener("mouseenter", () => pause(true)); feat.addEventListener("mouseleave", () => { if (!feat.contains(document.activeElement)) pause(false); });
    feat.addEventListener("focusin", () => pause(true)); feat.addEventListener("focusout", e => { if (!feat.contains(e.relatedTarget) && !feat.matches(":hover")) pause(false); });
    document.addEventListener("visibilitychange", () => { if (document.hidden) clearTimeout(timer); else if (!paused) show(cur); });
    let x0 = null, swiped = false;
    feat.addEventListener("pointerdown", e => { x0 = e.clientX; swiped = false; });
    feat.addEventListener("pointerup", e => { if (x0 == null) return; const dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 50) { swiped = true; show(cur + (dx < 0 ? 1 : -1)); } });
    feat.addEventListener("click", e => { if (swiped) { e.preventDefault(); e.stopPropagation(); swiped = false; } }, true);
    $$("img", feat).forEach(i => i.draggable = false);
    show(0);
  }

  /* ---------- article page ---------- */
  const art = $("#article");
  if (art) {
    const n = D.NEWS.find(x => x.id === +Q.get("id")) || D.NEWS[0];
    document.title = n.title + " · Department of Foreign Affairs (concept)";
    $("#artBadge").innerHTML = `<span class="badge badge--${n.cat}">${n.badge}</span>`;
    $("#artDate").textContent = n.date; $("#artH").textContent = n.title; $("#artCrumb").textContent = n.badge;
    $("#artLede").textContent = n.summary;
    art.innerHTML = (n.img ? `<figure class="art__fig"><img src="${n.img}" alt="" decoding="async" width="1400" height="900"><figcaption>Photo: ${esc(n.credit)} / Unsplash</figcaption></figure>` : "") + n.body.map(p => `<p>${esc(p)}</p>`).join("") + (n.url ? `<p><a class="btn btn--royal" href="${n.url}" target="_blank" rel="noopener">Read the original on dfa.gov.ph${ICON("i-out")}</a></p>` : "");
    const rel = $("#artRel"); rel.innerHTML = D.NEWS.filter(x => x.id !== n.id && x.cat === n.cat).concat(D.NEWS.filter(x => x.cat !== n.cat)).slice(0, 3).map(newsCard).join("");
    $("#artShare").addEventListener("click", () => { (navigator.clipboard ? navigator.clipboard.writeText(location.href) : Promise.reject()).then(() => showToast("Link copied")).catch(() => showToast("Copy the address from your browser bar")); });
  }

  /* ---------- foreign service posts ---------- */
  const postList = $("#postList");
  if (postList) {
    const tabs = $("#postTabs"), postQ = $("#postQ"), cnt = $("#postCount");
    const ALL = Object.entries(D.POSTS).flatMap(([k, [, list]]) => list.map(p => ({ r: k, city: p[0], country: p[1], type: p[2], tz: p[3] })));
    let reg = D.POSTS[Q.get("r")] ? Q.get("r") : "all", q = Q.get("q") || "";
    if (postQ) postQ.value = q;
    tabs.innerHTML = [["all", "All regions", ALL.length], ...Object.entries(D.POSTS).map(([k, [n, l]]) => [k, n, l.length])].map(([k, n, c]) => `<button type="button" role="radio" aria-checked="${k === reg}" data-r="${k}">${n} <small>${c}</small></button>`).join("");
    const render = () => {
      $$("[data-r]", tabs).forEach(b => b.setAttribute("aria-checked", b.dataset.r === reg));
      const w = norm(q).split(/\s+/).filter(Boolean);
      const list = ALL.filter(p => (reg === "all" || p.r === reg) && w.every(x => norm(p.city + " " + p.country + " " + p.type).includes(x)));
      cnt.textContent = list.length ? `${list.length} post${list.length === 1 ? "" : "s"} · local times update live` : "";
      postList.innerHTML = list.length ? list.map(p => { const n = nowIn(p.tz), op = postOpen(p.tz);
        return `<li class="pr"><div class="pr__n"><b>${esc(p.city)}</b><span>${esc(p.country)}</span></div><span class="pr__t">${p.type}</span>
          <time class="pr__time" title="Local time">${n.day} ${n.label}</time><span class="off__st${op ? " is-open" : ""}">${op ? "Open" : "Closed"}</span>
          <a class="off__map" href="${maps("Philippine " + p.type + " " + p.city)}" target="_blank" rel="noopener">Map<span class="sr"> for ${esc(p.city)}</span></a></li>`; }).join("")
        : `<li class="empty">No post matches “${esc(q)}”. Search by city or country, for example Dubai or Japan.</li>`;
    };
    tabs.addEventListener("click", e => { const b = e.target.closest("[data-r]"); if (b) { reg = b.dataset.r; render(); } });
    if (postQ) postQ.addEventListener("input", () => { q = postQ.value; render(); });
    render(); setInterval(render, 30000);
  }

  const offTotal = $("#offTotal"); if (offTotal) offTotal.textContent = D.OFFICES.length;
  /* post counts anywhere on a page come from the data, so the numbers always match the directory */
  $$("[data-count]").forEach(el => { const k = el.dataset.count; el.textContent = k === "all" ? Object.values(D.POSTS).reduce((a, p) => a + p[1].length, 0) : D.POSTS[k][1].length; });

  /* ---------- on-this-page navigation (scroll spy) ---------- */
  const toc = $$(".toc a");
  if (toc.length) {
    const spy = new IntersectionObserver(es => es.forEach(en => { if (!en.isIntersecting) return;
      toc.forEach(a => { const on = a.getAttribute("href") === "#" + en.target.id; a.classList.toggle("is-on", on); if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); }); }), { rootMargin: "-30% 0px -60% 0px" });
    toc.forEach(a => { const t = document.getElementById(a.getAttribute("href").slice(1)); if (t) spy.observe(t); });
  }

  /* ---------- FAQ lists from data ---------- */
  $$("[data-faq]").forEach(el => { el.innerHTML = (D.FAQ[el.dataset.faq] || []).map(([q, a]) => `<details class="acc"><summary>${esc(q)}${ICON("i-chev")}</summary><p>${esc(a)}</p></details>`).join(""); });

  /* ---------- contact form ---------- */
  const form = $("#contactForm");
  if (form) form.addEventListener("submit", e => {
    e.preventDefault(); let bad = null;
    $$("[required]", form).forEach(f => { const ok = f.type === "checkbox" ? f.checked : f.type === "email" ? /^\S+@\S+\.\S+$/.test(f.value) : f.value.trim().length > 1;
      f.closest(".fld").classList.toggle("is-bad", !ok); f.setAttribute("aria-invalid", !ok); if (!ok && !bad) bad = f; });
    if (bad) { bad.focus(); showToast("Please complete the highlighted fields."); return; }
    const ref = "DFA-" + Date.now().toString(36).toUpperCase().slice(-6);
    form.hidden = true; const done = $("#contactDone"); done.hidden = false; $("#contactRef").textContent = ref; done.focus();
  });

  /* ---------- site search with suggestions ---------- */
  const INDEX = [
    { label: "Passport: requirements, fees and booking", kind: "Service", keys: "passport new apply ePassport", href: "passport.html" },
    { label: "Passport renewal", kind: "Service", keys: "renew renewal passport expired", href: "passport.html#renewal" },
    { label: "Lost or damaged passport", kind: "Service", keys: "lost damaged mutilated stolen passport", href: "passport.html#lost" },
    { label: "Passport for minors", kind: "Service", keys: "minor child children kid passport", href: "passport.html#minors" },
    { label: "Apostille and authentication", kind: "Service", keys: "apostille authentication red ribbon documents", href: "apostille.html" },
    { label: "Visa-free entry and the e-Visa", kind: "Service", keys: "visa foreign entry etravel tourist evisa", href: "visa.html" },
    { label: "Assistance to Nationals (24/7)", kind: "Help", keys: "atn emergency ofw hotline help repatriation crisis", href: "atn.html" },
    { label: "All consular services and fees", kind: "Service", keys: "services fees requirements consular", href: "services.html" },
    { label: "Consular offices in the Philippines", kind: "Directory", keys: "office branch location consular", href: "offices.html" },
    { label: "Embassies and consulates abroad", kind: "Directory", keys: "embassy consulate post abroad", href: "posts.html" },
    { label: "About the Department", kind: "Page", keys: "about mandate mission vision pillars history", href: "about.html" },
    { label: "Careers and the Foreign Service exam", kind: "Page", keys: "career job vacancy fso exam foreign service officer", href: "careers.html" },
    { label: "Transparency Seal documents", kind: "Page", keys: "transparency budget procurement bids citizen charter foi", href: "transparency.html" },
    { label: "Contact the Department", kind: "Page", keys: "contact feedback complaint email phone address", href: "contact.html" },
    ...D.OFFICES.map(o => ({ label: o.name, kind: "Office", keys: o.city + " " + o.address + " " + o.region, href: "offices.html?q=" + encodeURIComponent(o.city) })),
    ...Object.entries(D.POSTS).flatMap(([k, [, l]]) => l.map(p => ({ label: `Philippine ${p[2]} in ${p[0]}`, kind: "Post", keys: p[1] + " embassy consulate", href: `posts.html?q=${encodeURIComponent(p[0])}` }))),
    ...D.NEWS.map(n => ({ label: n.title, kind: "News", keys: n.badge + " " + n.summary, href: "article.html?id=" + n.id }))
  ];
  const find = q => { const w = norm(q).split(/\s+/).filter(Boolean); if (!w.length) return [];
    return INDEX.map(e => { const hay = norm(e.label + " " + e.keys), lab = norm(e.label); if (!w.every(x => hay.includes(x))) return null;
      return { e, s: w.reduce((a, x) => a + (lab.includes(x) ? 2 : 1), 0) + (lab.startsWith(w[0]) ? 2 : 0) + (e.kind === "Service" ? 1 : 0) }; }).filter(Boolean).sort((a, b) => b.s - a.s).slice(0, 7).map(x => x.e); };
  const mark = (label, q) => { let out = esc(label); norm(q).split(/\s+/).filter(x => x.length > 1).forEach(x => { out = out.replace(new RegExp("(" + x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig"), "<mark>$1</mark>"); }); return out; };
  $$("[data-search]").forEach(form => {
    const input = $("input", form), sug = $(".sug", form); let items = [], act = -1;
    const close = () => { sug.hidden = true; input.setAttribute("aria-expanded", "false"); input.removeAttribute("aria-activedescendant"); act = -1; };
    const render = () => {
      const q = input.value.trim(); items = find(q);
      if (!q) return close();
      sug.innerHTML = items.length ? items.map((e, i) => `<li role="option" id="${sug.id}-${i}" aria-selected="${i === act}" data-i="${i}"><span>${mark(e.label, q)}</span><small>${e.kind}</small></li>`).join("")
        : `<li class="sug__none" role="option" aria-disabled="true">Press Enter to search the newsroom for “${esc(q)}”.</li>`;
      sug.hidden = false; input.setAttribute("aria-expanded", "true");
      if (act >= 0) input.setAttribute("aria-activedescendant", `${sug.id}-${act}`); else input.removeAttribute("aria-activedescendant");
    };
    const go = e => { close(); leave(e.href); };
    input.addEventListener("input", () => { act = -1; render(); });
    input.addEventListener("keydown", e => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") { if (!items.length) return; e.preventDefault(); act = (act + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length; render(); }
      else if (e.key === "Escape") { if (!sug.hidden) { e.preventDefault(); close(); } else input.blur(); }
    });
    input.addEventListener("blur", () => setTimeout(close, 150));
    sug.addEventListener("mousedown", e => { const li = e.target.closest("[data-i]"); if (li) { e.preventDefault(); go(items[+li.dataset.i]); } });
    form.addEventListener("submit", e => { e.preventDefault(); const q = input.value.trim();
      if (!q) return showToast("Type a keyword such as passport, apostille or visa.");
      const pick = items[act]; if (pick) return go(pick);
      leave("news.html?q=" + encodeURIComponent(q));
    });
  });
  addEventListener("keydown", e => {
    if (e.key !== "/" || e.metaKey || e.ctrlKey || /input|textarea|select/i.test(document.activeElement.tagName) || modal.open) return;
    const desk = $(".hd__in > .search input"); e.preventDefault();
    if (desk && desk.offsetParent) desk.focus(); else { setMenu(true); $("#mnav input").focus(); }
  });
})();
