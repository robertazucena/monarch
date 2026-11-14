/* Cipher — AI control room. One loop: an objective is routed to the divisions it needs (the wheel locks onto them),
   lands in the ledger as a draft, and the decisions you approve move the objectives, the watch list and the tally.
   Hash routes (#control is the home); the same preloader on every route. All figures are SAMPLE data. Works from file://. */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const NS = "http://www.w3.org/2000/svg";
  const pad = n => String(n).padStart(2, "0");
  const words = ["Nothing", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];

  /* ---------------- data (SAMPLE) ---------------- */
  const DIVS = [
    { k: "I", name: "Intelligence", role: "Research, analysis, patterns, opportunities and risks, turned into evidence-based recommendations.",
      now: "Competitor brief: regional fintech. Two figures still rest on a single source.", load: 8,
      move: "Frame the question and gather the evidence before anyone commits.",
      keys: ["research", "analy", "market", "competitor", "compet", "risk", "opportun", "trend", "evaluat", "assess", "decide", "decision", "insight", "why", "investigat", "pricing"] },
    { k: "O", name: "Operations", role: "Plans, priorities and workflows: complex objectives broken into steps with owners and dates.",
      now: "Q1 launch plan: milestones set, launch copy awaiting approval.", load: 9,
      move: "Break it into milestones, each with an owner and a date.",
      keys: ["plan", "launch", "schedul", "priorit", "workflow", "project", "coordinat", "roadmap", "hire", "hiring", "process", "organis", "organiz", "steps", "team", "budget", "event", "rollout"] },
    { k: "T", name: "Technology", role: "Code, websites, debugging, security awareness, system architecture and troubleshooting.",
      now: "Website security audit: waiting on access to the production server.", load: 6,
      move: "Audit what exists before writing a single line.",
      keys: ["code", "website", "site", "app", "bug", "debug", "secur", "cyber", "api", "deploy", "server", "architect", "build", "software", "integrat", "database", "migrat", "automat"] },
    { k: "C", name: "Creative Studio", role: "Brand identities, UI and UX, digital products, design systems and creative strategy.",
      now: "Studio brand refresh: two routes ready for your choice.", load: 7,
      move: "Sketch two directions and test both against the brief.",
      keys: ["brand", "logo", "design", "product", "ui", "ux", "visual", "identity", "campaign", "creative", "prototype", "pitch", "deck", "story", "content", "packag"] },
    { k: "K", name: "Knowledge Base", role: "Files, documentation and research, organised and connected, with the verified kept apart from the assumed.",
      now: "Clean-up: 214 of 300 documents tagged and cross-referenced.", load: 5,
      move: "Pull every relevant file, and mark what is verified and what is assumed.",
      keys: ["doc", "file", "note", "reference", "archive", "wiki", "policy", "summar", "find", "recall", "knowledge", "library", "manual", "contract", "source"] },
    { k: "M", name: "System Monitoring", role: "Progress, deadlines, reminders and status reports. Bottlenecks flagged early; live status only when the data supports it.",
      now: "Watching five objectives and four bottlenecks.", load: 4,
      move: "Set checkpoints, and tell you the moment anything slips.",
      keys: ["deadline", "status", "track", "progress", "remind", "overdue", "report", "monitor", "bottleneck", "week", "today", "due", "kpi", "metric"] }
  ];
  const DK = Object.fromEntries(DIVS.map((d, i) => [d.k, i]));
  const OBJS = [
    { id: "launch", name: "Q1 product launch plan", divs: "OT", p: 62, meta: "Due in 9 days" },
    { id: "brief", name: "Competitor brief: regional fintech", divs: "IK", p: 85, meta: "Due in 3 days" },
    { id: "brand", name: "Studio brand refresh", divs: "C", p: 40, meta: "Due in 12 days · awaiting a route" },
    { id: "audit", name: "Website security audit", divs: "TM", p: 25, risk: true, meta: "Due in 5 days · blocked" },
    { id: "kb", name: "Knowledge base clean-up", divs: "K", p: 70, meta: "Due in 6 days" },
    { id: "perf", name: "Mobile app performance pass", desk: true, divs: "T", p: 48, meta: "Due in 7 days · two screens left" },
    { id: "qa", name: "Hire a contract QA engineer", desk: true, divs: "O", p: 55, meta: "Due in 8 days · two candidates shortlisted" },
    { id: "inv", name: "November investor update", desk: true, divs: "IM", p: 30, meta: "Due in 10 days · figures being checked" },
    { id: "mail", name: "Onboarding emails rewrite", desk: true, divs: "CK", p: 15, meta: "Due in 13 days" },
    { id: "uptime", name: "Weekly status report and uptime review", desk: true, divs: "M", p: 80, meta: "Due tomorrow · figures in" },
    { id: "deck", name: "Sales deck refresh for Q1", desk: true, divs: "C", p: 35, meta: "Due in 11 days · new cover drafted" },
    { id: "market", name: "Southeast Asia market sizing", desk: true, divs: "I", p: 60, meta: "Due in 9 days · three markets of five done" },
    { id: "vendor", name: "Vendor contract renewals", desk: true, divs: "O", p: 20, meta: "Due in 14 days · four contracts to review" }
  ];
  const WATCH = [
    { id: "access", name: "Security audit waiting on production server access", divs: "T", p: 4, v: true, meta: "Blocked for 3 days" },
    { id: "copy", name: "Launch copy not yet approved", divs: "O", p: 3, v: true, meta: "Holding two milestones" },
    { id: "source", name: "Two competitor figures from a single source", divs: "IK", p: 2, v: false, meta: "Treat as assumed until a second source agrees" },
    { id: "route", name: "Brand refresh waiting on a choice of route", divs: "C", p: 2, v: true, meta: "Both routes are ready" }
  ];
  const DECIDE = [
    { id: "date", title: "Approve the Q1 launch date: 3 March", divs: "OT",
      ctx: "Operations and Technology agree on it. Marketing would prefer a week later; I would not.",
      yes: () => { bump("launch", 8); drop("copy"); }, done: "Launch date approved. Operations will release the copy hold." },
    { id: "access", title: "Grant Technology access to the production server", divs: "TM",
      ctx: "The security audit has waited three days for it. Access ends when the audit does.",
      yes: () => { const o = OBJS.find(x => x.id === "audit"); o.risk = false; o.meta = "Due in 5 days · under way"; bump("audit", 10); drop("access"); },
      done: "Access granted until the audit closes. I shall keep an eye on it, Sir." },
    { id: "route", title: "Choose a direction for the studio brand refresh", divs: "C",
      ctx: "Creative Studio has two routes ready. Route B tested better; Route A is braver.",
      yes: () => { bump("brand", 15); const o = OBJS.find(x => x.id === "brand"); o.meta = "Due in 12 days · Route B"; drop("route"); },
      done: "Route B it is. Creative Studio is already sharpening it." }
  ];
  const HORIZON = [
    { d: 1, name: "Weekly status report", t: "ok", e: 1 },
    { d: 3, name: "Competitor brief", t: "ok", e: 2 },
    { d: 5, name: "Security audit", t: "risk", e: 3, obj: "audit" },
    { d: 6, name: "Knowledge base clean-up", t: "ok", e: 1 },
    { d: 9, name: "Q1 launch plan", t: "watch", e: 3 },
    { d: 12, name: "Brand refresh", t: "ok", e: 2 },
    { d: 14, name: "Board pack", t: "watch", e: 2 }
  ];
  /* requests handled per hour over the last 24 hours, oldest first (the last one is the current hour) */
  const SIGNAL = [14, 9, 6, 4, 3, 5, 11, 22, 38, 52, 61, 58, 64, 72, 88, 81, 69, 57, 49, 44, 37, 31, 26, 33];
  const CLOSE = ["Nothing has been executed yet. I prefer to be asked twice.", "No action taken: merely a plan, elegantly arranged.",
    "Nothing is under way until you say so, Sir.", "Drafted, not done. I would hate to be accused of enthusiasm."];

  /* ---------------- preloader + router ---------------- */
  const pre = $("#pre"), num = $(".pre-num", pre), name = $(".pre-name", pre);
  const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  const runLoader = done => {
    if (still) { pre.classList.add("gone"); done(); return; }
    pre.classList.remove("gone");
    const W = name.dataset.w, t0 = performance.now(), D = 1500;
    const step = now => {
      const p = Math.min(1, (now - t0) / D), settled = Math.floor(p * (W.length + 1));
      name.textContent = [...W].map((c, i) => i < settled ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]).join("");
      num.textContent = pad(Math.round(p * 99) + (p === 1 ? 1 : 0)).replace("100", "100");
      if (p < 1) requestAnimationFrame(step);
      else setTimeout(() => { pre.classList.add("gone"); done(); }, 250);
    };
    requestAnimationFrame(step);
  };
  const ROUTES = { control: "Cipher — AI Control Room", dashboard: "Dashboard — Cipher" };
  let route = "";
  const show = r => {
    route = r;
    $$(".view").forEach(v => v.classList.toggle("on", v.dataset.view === r));
    document.title = ROUTES[r];
    scrollTo(0, 0);
  };
  /* moving to another page: the current page fades out, the next one fades in (the preloader is for arrival only) */
  const app = $("#app");
  const swap = r => {
    if (still) { show(r); return; }
    app.classList.add("leaving");
    setTimeout(() => {
      show(r);
      app.classList.replace("leaving", "entering");
      requestAnimationFrame(() => requestAnimationFrame(() => app.classList.remove("entering")));
    }, 420);
  };
  /* #ledger, #divisions and #protocol are sections of the control room: they open it scrolled to the section */
  const SECTS = ["ledger", "divisions", "protocol"];
  const sectOf = () => { const h = location.hash.slice(1); return SECTS.includes(h) ? h : ""; };
  const toSect = (k, smooth) => { const t = document.getElementById(k); if (t) t.scrollIntoView({ behavior: smooth && !still ? "smooth" : "auto" }); };
  const routeOf = () => { const h = location.hash.slice(1); return ROUTES[h] ? h : "control"; };
  if (!ROUTES[location.hash.slice(1)] && !sectOf()) history.replaceState(null, "", "#control");
  show(routeOf());
  let ready = false;
  const fontsIn = document.fonts ? Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1500))]) : Promise.resolve();
  fontsIn.then(() => runLoader(() => { ready = true; start(); if (sectOf()) toSect(sectOf(), false); }));
  addEventListener("hashchange", () => {
    const k = sectOf();
    if (k) { if (route === "control") toSect(k, true); else { swap("control"); setTimeout(() => toSect(k, false), 480); } return; }
    const r = routeOf();
    if (r === route) { scrollTo({ top: 0, behavior: still ? "auto" : "smooth" }); return; }
    swap(r);
  });

  /* ---------------- clock + greeting ---------------- */
  const tick = () => {
    const d = new Date();
    $$("[data-clock]").forEach(c => { c.textContent = pad(d.getHours()) + ":" + pad(d.getMinutes()); });
    const h = d.getHours();
    $$("[data-greet]").forEach(g => { g.textContent = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"; });
  };
  tick(); setInterval(tick, 20000);

  /* ---------------- the wheel (a factory: the hero's large wheel and the dashboard's small one) ---------------- */
  const el = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
  const pt = (r, a) => [r * Math.cos(a * Math.PI / 180), r * Math.sin(a * Math.PI / 180)];
  const arc = (r, a0, a1) => { const [x0, y0] = pt(r, a0), [x1, y1] = pt(r, a1); return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`; };
  const centre = i => -90 + 60 * i;                                   /* 01 at the top, clockwise */
  let gradOnce = false;
  const makeWheel = (svg, onPick) => {
    if (!gradOnce) {                                                  /* the gradients live in the first wheel; ids are document-wide */
      gradOnce = true;
      el("defs", {}, svg).innerHTML = `<linearGradient id="w-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c9b5ff"/><stop offset="1" stop-color="#7c4dff"/></linearGradient>
        <radialGradient id="w-glow"><stop offset="0" stop-color="#7c4dff" stop-opacity=".55"/><stop offset=".6" stop-color="#6a3ce6" stop-opacity=".12"/><stop offset="1" stop-color="#6a3ce6" stop-opacity="0"/></radialGradient>`;
    }
    el("circle", { class: "w-glow", r: 190 }, svg);
    el("circle", { class: "w-ring", r: 300 }, svg);
    el("circle", { class: "w-dots", r: 160 }, svg);
    const letters = el("g", { class: "w-letters" }, svg);
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach((c, i) => {
      const a = -90 + i * 360 / 26, [x, y] = pt(200, a);
      el("text", { x: x.toFixed(1), y: y.toFixed(1), transform: `rotate(${a + 90} ${x.toFixed(1)} ${y.toFixed(1)})` }, letters).textContent = c;
    });
    const links = el("g", {}, svg);
    const segs = DIVS.map((d, i) => {
      const g = el("g", { class: "w-div", "data-i": i }, svg), c = centre(i);
      const [h0x, h0y] = pt(214, c - 30), [h1x, h1y] = pt(214, c + 30), [o0x, o0y] = pt(330, c - 30), [o1x, o1y] = pt(330, c + 30);
      el("path", { class: "w-hit", d: `M${h0x} ${h0y}A214 214 0 0 1 ${h1x} ${h1y}L${o1x} ${o1y}A330 330 0 0 0 ${o0x} ${o0y}Z` }, g);
      for (let j = 0; j < 12; j++) {
        const a = c - 27.5 + j * 5, [x0, y0] = pt(224, a), [x1, y1] = pt(242, a);
        el("line", { class: "w-tick" + (j < d.load ? " lit" : ""), x1: x0.toFixed(1), y1: y0.toFixed(1), x2: x1.toFixed(1), y2: y1.toFixed(1) }, g);
      }
      el("path", { class: "w-seg", d: arc(262, c - 26, c + 26) }, g);
      /* label outside the ring: centred at top and bottom, outward on the sides; the bottom label tucks to the left
         of its segment, clear of the hero's reading card in the corner */
      const la = i === 3 ? 108 : c, [lx, ly] = pt(290, la), side = i === 3 ? "end" : Math.abs(Math.cos(c * Math.PI / 180)) < 0.2 ? "middle" : Math.cos(c * Math.PI / 180) > 0 ? "start" : "end";
      const t = el("text", { class: "w-lbl", x: lx.toFixed(1), y: (ly + (ly < -200 ? -4 : ly > 200 ? 12 : 4)).toFixed(1), "text-anchor": side }, g);
      el("tspan", { class: "n" }, t).textContent = pad(i + 1);
      el("tspan", { class: "nm" }, t).textContent = "  " + d.name;
      g.addEventListener("click", () => onPick(i));
      return g;
    });
    /* the core: the emblem's C, opening towards the division in focus, with a pointer bead in the opening */
    const core = el("g", { class: "w-core" }, svg);
    const [cx0, cy0] = pt(86, -40), [cx1, cy1] = pt(86, 40);
    el("path", { d: `M${cx0.toFixed(2)} ${cy0.toFixed(2)}A86 86 0 1 0 ${cx1.toFixed(2)} ${cy1.toFixed(2)}` }, core);
    el("circle", { class: "dot", r: 24 }, core);
    el("circle", { class: "w-ptr", cx: 132, cy: 0, r: 6 }, core);
    let angle = 0;
    const aim = i => { let d = ((centre(i) - angle) % 360 + 540) % 360 - 180; angle += d; core.style.transform = `rotate(${angle}deg)`; };
    return {
      aim,
      select: i => { segs.forEach((g, k) => g.classList.toggle("sel", k === i)); aim(i); },
      seek: on => letters.classList.toggle("seek", on),
      reset: () => { segs.forEach(g => g.classList.remove("eng", "sel")); links.innerHTML = ""; },
      engage: i => { aim(i); segs[i].classList.add("eng"); },
      link: divs => {
        for (let a = 0; a < divs.length; a++) for (let b = a + 1; b < divs.length; b++) {
          const [x0, y0] = pt(214, centre(divs[a])), [x1, y1] = pt(214, centre(divs[b]));
          el("path", { class: "w-link", d: `M${x0.toFixed(1)} ${y0.toFixed(1)}Q${((x0 + x1) * .2).toFixed(1)} ${((y0 + y1) * .2).toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}` }, links);
        }
      }
    };
  };
  const WHEELS = [makeWheel($("[data-wheel] svg"), i => { pause(); select(i, true); })];
  const deskSvg = $("[data-dwheel] svg");
  if (deskSvg) WHEELS.push(makeWheel(deskSvg, i => { pause(); focusOn(focus === i ? -1 : i); }));

  /* ---------------- selection, idle cycle ---------------- */
  let sel = 0, engaged = [], idle = 0, held = 0, focus = -1;
  const railMark = $("[data-rail-mark]"), railA = $("[data-rail-a]");
  const select = (i, show) => {
    sel = i;
    WHEELS.forEach(w => w.select(i));
    railMark.style.transform = "translateY(" + (i * 25) + "px)";
    railA.textContent = pad(i + 1);
    if (show) card("division");
  };
  const pause = () => { held = Date.now() + 20000; };
  const cycle = () => { if (Date.now() < held || engaged.length || focus >= 0 || document.hidden) return; select((sel + 1) % 6, false); };
  const clearEng = () => { engaged = []; WHEELS.forEach(w => w.reset()); select(sel, false); renderMods(); };

  /* ---------------- the reading card ---------------- */
  const cardEl = $("[data-card]");
  let mode = "decide", reply = null;
  const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const code = s => s.split("").join("·");
  const card = m => {
    mode = m;
    let h = "";
    if (m === "decide") {
      if (DECIDE.length) {
        const d = DECIDE[0];
        h = `<p class="c-k"><span>Your judgement</span><span>${pad(1)}/${pad(DECIDE.length)} · ${code(d.divs)}</span></p>
          <p class="c-h">${esc(d.title)}</p><p class="c-t">${esc(d.ctx)}</p>
          <div class="c-row"><button class="c-btn solid" type="button" data-act="yes">Approve</button><button class="c-btn" type="button" data-act="defer">Defer</button></div>`;
      } else {
        h = `<p class="c-k"><span>Your judgement</span><span>Clear</span></p>
          <p class="c-h">Nothing awaits you, Sir.</p><p class="c-t">Enjoy it. It rarely lasts.</p>
          <div class="c-row"><button class="c-btn" type="button" data-act="brief">Brief me</button></div>`;
      }
    } else if (m === "done") {
      h = `<p class="c-k"><span>Decision recorded</span><span>${clock()}</span></p><p class="c-h">${esc(reply)}</p>
        <div class="c-row"><button class="c-btn solid" type="button" data-act="next">${DECIDE.length ? "Next decision" : "Done"}</button></div>`;
    } else if (m === "reply") {
      const r = reply;
      h = `<p class="c-k"><span>Routed · ${code(r.divs.map(i => DIVS[i].k).join(""))}</span><span>${clock()}</span></p>
        <p class="c-h">Understood, Sir.</p>
        <p class="c-t">“${esc(r.text)}” calls for ${list(r.divs.map(i => DIVS[i].name))}.</p>
        <ol class="c-steps">${r.divs.map(i => `<li><b>${DIVS[i].k}</b><span>${esc(DIVS[i].move)}</span></li>`).join("")}</ol>
        <p class="c-note">${esc(r.close)} Added to the ledger as a draft.</p>
        <div class="c-row"><button class="c-btn solid" type="button" data-act="ledger">See the ledger</button><button class="c-btn" type="button" data-act="clear">Clear</button></div>`;
    } else if (m === "division") {
      const d = DIVS[sel];
      h = `<p class="c-k"><span>Division ${pad(sel + 1)} · ${d.k}</span><span>Load ${d.load} of 12</span></p>
        <p class="c-h">${d.name}</p><p class="c-t">${esc(d.role)}</p>
        <div class="c-load">${dial(d.load, 38, true)}<span>${esc(d.now)}</span></div>
        <div class="c-row"><button class="c-btn" type="button" data-act="back">Back to decisions</button></div>`;
    } else if (m === "brief") {
      h = `<p class="c-k"><span>Briefing</span><span>${clock()}</span></p><p class="c-h">${esc(greeting())}, in brief.</p>
        <p class="c-t">${esc(briefing())}</p>
        <div class="c-row"><button class="c-btn solid" type="button" data-act="ledger">Open the ledger</button><button class="c-btn" type="button" data-act="back">Back</button></div>`;
    }
    cardEl.innerHTML = h;
  };
  const clock = () => { const d = new Date(); return pad(d.getHours()) + ":" + pad(d.getMinutes()); };
  const greeting = () => { const h = new Date().getHours(); return h < 12 ? "Your morning" : h < 18 ? "Your afternoon" : "Your evening"; };
  const list = a => a.length < 2 ? a[0] : a.slice(0, -1).join(", ") + " and " + a[a.length - 1];
  const briefing = () => {
    const live = route === "dashboard" ? OBJS.length : OBJS.filter(o => !o.desk).length, worst = OBJS.find(o => o.risk) || OBJS.slice().sort((a, b) => a.p - b.p)[0];
    const peak = SIGNAL.indexOf(Math.max(...SIGNAL)), hr = (new Date().getHours() - (SIGNAL.length - 1 - peak) + 24) % 24;
    const dn = DECIDE.length;
    return `${words[live] || live} objectives in flight; ${worst.name.toLowerCase()} is the one I would watch. ` +
      `${dn ? (words[dn] + (dn > 1 ? " decisions await" : " decision awaits") + " you") : "No decisions await you"}. ` +
      `Signal peaked at ${pad(hr)}:00 with ${Math.max(...SIGNAL)} requests. Everything else is behaving, for now.`;
  };
  cardEl.addEventListener("click", e => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    const a = b.dataset.act;
    if (a === "yes") { reply = approve(); card("done"); }
    else if (a === "defer") { defer(); card("decide"); }
    else if (a === "next" || a === "back") card("decide");
    else if (a === "brief") card("brief");
    else if (a === "ledger") $("#ledger").scrollIntoView({ behavior: still ? "auto" : "smooth" });
    else if (a === "clear") { clearEng(); card("decide"); }
  });
  /* "Brief me": the hero answers in its card, the dashboard in the conversation */
  $$("[data-brief]").forEach(b => b.addEventListener("click", () => {
    if (route === "dashboard") say("cipher", briefing(), { title: greeting() + ", in brief." }); else card("brief");
  }));

  /* decisions, shared by the hero card and the dashboard deck: every change refreshes both */
  const approve = () => {
    const d = DECIDE.shift(); d.yes();
    DECIDED.unshift({ t: clock(), how: "Approved", title: d.title, fresh: true });
    wire(d.divs[0], "Decision approved: " + d.title.charAt(0).toLowerCase() + d.title.slice(1));
    refresh(); return d.done;
  };
  const defer = () => { const d = DECIDE.shift(); DECIDE.push(d); DECIDED.unshift({ t: clock(), how: "Deferred", title: d.title, fresh: true }); wire("M", "Deferred: " + d.title.charAt(0).toLowerCase() + d.title.slice(1)); refresh(); };

  /* ---------------- routing an objective (from the hero console or the dashboard's command line) ---------------- */
  const route_ = text => {
    const t = text.toLowerCase();
    /* keys match at the start of a word ("plan" finds "planning", "doc" finds "document"); a few short ones only as
       whole words, so "ui" never fires on "build" nor "app" on "approve" */
    const WHOLE = ["ui", "ux", "api", "app", "kpi", "why"];
    const hit = k => new RegExp("\\b" + k + (WHOLE.includes(k) ? "\\b" : "")).test(t);
    let hits = DIVS.map((d, i) => [i, d.keys.filter(hit).length]).filter(x => x[1] > 0).sort((a, b) => b[1] - a[1]).map(x => x[0]);
    if (!hits.length) hits = [0, 1];                                  /* analyse before recommending */
    return hits.slice(0, 3).sort((a, b) => a - b);
  };
  let busy = false;
  const ask = (text, form, from) => {
    text = text.trim().replace(/\s+/g, " ");
    if (busy) return false;
    if (text.length < 4) { form.classList.remove("shake"); void form.offsetWidth; form.classList.add("shake"); form.querySelector("input").focus(); return false; }
    busy = true; pause();
    const divs = route_(text);
    engaged = [];
    WHEELS.forEach(w => { w.reset(); w.seek(true); });
    if (from === "dashboard") say("sir", text);
    const STEP = still ? 0 : 520;
    divs.forEach((i, n) => setTimeout(() => { WHEELS.forEach(w => w.engage(i)); engaged.push(i); renderMods(); }, n * STEP + (still ? 0 : 300)));
    setTimeout(() => {
      WHEELS.forEach(w => { w.seek(false); w.link(divs); w.aim(divs[0]); });
      sel = divs[0];
      const short = text.length > 60 ? text.slice(0, 58) + "…" : text, close = CLOSE[(Math.random() * CLOSE.length) | 0];
      reply = { text: short, divs, close };
      OBJS.unshift({ id: "n" + Date.now(), name: text.charAt(0).toUpperCase() + text.slice(1, 56) + (text.length > 56 ? "…" : ""),
        divs: divs.map(i => DIVS[i].k).join(""), p: 0, draft: true, meta: "Drafted just now · awaiting your go-ahead" });
      wire(DIVS[divs[0]].k, `Objective routed to ${divs.map(i => DIVS[i].name).join(", ")}`);
      say("cipher", `“${short}” calls for ${list(divs.map(i => DIVS[i].name))}.`, { title: "Understood, Sir.", steps: divs, note: close + " Added to the objectives as a draft." });
      refresh(true);
      if (from === "control") card("reply");
      busy = false;
    }, divs.length * STEP + (still ? 0 : 700));
    return true;
  };
  $$("[data-ask]").forEach(form => {
    const input = form.querySelector("input");
    form.addEventListener("submit", e => { e.preventDefault(); if (ask(input.value, form, form.dataset.ask || "control")) input.value = ""; });
  });
  $$("[data-try]").forEach(b => b.addEventListener("click", () => { const f = $('[data-ask="control"]'); f.querySelector("input").value = b.textContent; if (ask(b.textContent, f, "control")) f.querySelector("input").value = ""; }));

  /* ---------------- tally + headline ---------------- */
  const decode = (node, val) => {
    const v = pad(val);
    if (node.textContent === v) return;
    if (still) { node.textContent = v; return; }
    let n = 0;
    const iv = setInterval(() => { node.textContent = n++ < 8 ? pad((Math.random() * 99) | 0) : v; if (n > 8) clearInterval(iv); }, 45);
  };
  const tally = () => {
    $$('[data-n="objectives"]').forEach(n => decode(n, OBJS.filter(o => !o.desk).length));   /* the control room's tally */
    $$('[data-n="decisions"]').forEach(n => decode(n, DECIDE.length));
    $$('[data-n="risks"]').forEach(n => decode(n, WATCH.filter(w => w.p >= 3).length));
    const n = DECIDE.length;
    $("[data-await]").textContent = n ? `${words[n]} ${n > 1 ? "matters await" : "matter awaits"} your judgement.` : "Nothing awaits your judgement.";
  };

  /* ---------------- ledger ---------------- */
  /* the C gauge: the emblem's C, filling from its top end round to its bottom end */
  const C_PATH = (() => { const [a, b] = pt(20, -40), [c, d] = pt(20, 40); return `M${(26 + a).toFixed(2)} ${(26 + b).toFixed(2)}A20 20 0 1 0 ${(26 + c).toFixed(2)} ${(26 + d).toFixed(2)}`; })();
  const gauge = o => `<svg class="cg${o.risk ? " risk" : o.p >= 100 ? " done" : ""}" viewBox="0 0 52 52" aria-hidden="true">
      <path class="tr" d="${C_PATH}" pathLength="100"/><path class="val" d="${C_PATH}" pathLength="100" data-p="${Math.max(o.p, 2)}"/>
      <text x="26" y="26">${o.p}</text></svg>`;
  const renderObjs = fresh => $$("[data-objs]").forEach(objsEl => {
    const desk = objsEl.hasAttribute("data-focusable"), f = desk && focus >= 0 ? DIVS[focus].k : "";
    const list = OBJS.filter(o => (desk || !o.desk) && (!f || o.divs.includes(f)));   /* the four desk-only objectives stay on the dashboard */
    objsEl.innerHTML = (list.length ? "" : `<li class="empty"><span></span><span class="o-meta">No objectives for ${DIVS[focus].name} at present.</span></li>`) + list.map((o, i) => `<li class="${fresh && i === 0 && o === OBJS[0] ? "new" : ""}">${gauge(o)}
      <span><span class="o-name">${esc(o.name)}</span><span class="o-meta">${esc(o.meta)}</span></span>
      <span class="o-code">${code(o.divs)}<small>${o.draft ? "Draft" : o.risk ? "At risk" : o.p + "%"}</small></span></li>`).join("");
    requestAnimationFrame(() => requestAnimationFrame(() => $$(".val", objsEl).forEach(p => { p.style.strokeDasharray = `${p.dataset.p} 100`; })));
  });
  const bump = (id, n) => { const o = OBJS.find(x => x.id === id); if (o) o.p = Math.min(100, o.p + n); };
  const drop = id => { const k = WATCH.findIndex(w => w.id === id); if (k >= 0) WATCH.splice(k, 1); };

  const sigEl = $("[data-sig]");
  const renderSig = () => {
    const max = Math.max(...SIGNAL), h = new Date().getHours();
    sigEl.innerHTML = SIGNAL.map((v, k) => {
      const hr = (h - (SIGNAL.length - 1 - k) + 24) % 24;
      return `<i style="--v:${(v / max * 100).toFixed(1)};--k:${k}" class="${k === SIGNAL.length - 1 ? "now" : ""}" title="${pad(hr)}:00 · ${v} requests" aria-hidden="true"></i>`;
    }).join("");
    const axis = document.createElement("div"); axis.className = "sig-axis"; axis.setAttribute("aria-hidden", "true");
    axis.innerHTML = SIGNAL.map((v, k) => { const hr = (h - (SIGNAL.length - 1 - k) + 24) % 24; return `<span>${k === SIGNAL.length - 1 ? "Now" : k % 6 === 0 ? pad(hr) : ""}</span>`; }).join("");
    sigEl.after(axis);
    const total = SIGNAL.reduce((a, b) => a + b, 0), peak = SIGNAL.indexOf(max), phr = (h - (SIGNAL.length - 1 - peak) + 24) % 24;
    $("[data-sig-foot]").innerHTML = `<span><b>${total.toLocaleString("en-GB")}</b> requests</span><span>Peak <b>${pad(phr)}:00</b> · ${max}</span><span>This hour <b>${SIGNAL[SIGNAL.length - 1]}</b></span>`;
    sigEl.setAttribute("role", "img");
    sigEl.setAttribute("aria-label", `Requests per hour over the last 24 hours: ${total} in total, peaking at ${max} around ${pad(phr)}:00.`);
  };

  /* the horizon: a half circle from today (left) to fourteen days out (right); beads rise and set along it. Labels
     alternate outside and inside the arc, pointing along its normal, so neighbours never collide */
  const renderHor = () => {
    const W = 640, H = 300, CX = 320, CY = 250, R = 196;
    const at = t => { const th = Math.PI * (1 - t); return [CX + R * Math.cos(th), CY - R * Math.sin(th), Math.cos(th), -Math.sin(th)]; };
    let s = `<svg viewBox="0 -20 ${W} ${H}" role="img" aria-label="Deadlines over the next fourteen days">`;
    s += `<path class="h-arc" d="M${CX - R} ${CY}A${R} ${R} 0 0 1 ${CX + R} ${CY}"/>`;
    for (let k = 1; k < 14; k++) { const [x, y] = at(k / 14); s += `<circle class="h-day" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3"/>`; }
    s += `<line class="h-arc" x1="${CX - R - 30}" y1="${CY}" x2="${CX + R + 30}" y2="${CY}" stroke-dasharray="2 6"/>`;
    s += `<circle class="h-now" cx="${CX - R}" cy="${CY}" r="6"/><text class="h-end" x="${CX - R}" y="${CY + 26}" text-anchor="middle">Today</text>`;
    s += `<text class="h-end" x="${CX + R}" y="${CY + 26}" text-anchor="middle">+14 d</text>`;
    HORIZON.forEach((b, k) => {
      const [x, y, nx, ny] = at(b.d / 14), r = 5 + b.e * 2.6, out = k % 2 === 1;
      const cls = b.obj && !OBJS.find(o => o.id === b.obj && o.risk) ? "ok" : b.t;
      const dx = out ? nx : -nx, dy = out ? ny : -ny, gap = r + (out ? 12 : 14);
      const lx = x + dx * gap, ly = y + dy * gap;
      const anchor = (!out && Math.abs(dx) < 0.8) ? "middle" : dx < -0.35 ? "end" : dx > 0.35 ? "start" : "middle";   /* inside labels stay centred: they converge */
      const ty = ly + (dy < -0.5 ? -18 : dy > 0.5 ? 10 : -4);
      s += `<g><title>${b.name}: in ${b.d} day${b.d > 1 ? "s" : ""}</title><circle class="h-bead ${cls}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}"/>
        <text class="h-lbl" x="${lx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="${anchor}">${b.name}</text>
        <text class="h-sub" x="${lx.toFixed(1)}" y="${(ty + 15).toFixed(1)}" text-anchor="${anchor}">in ${b.d} d</text></g>`;
    });
    $("[data-hor]").innerHTML = s + "</svg>";
  };

  const renderWatch = () => {
    $("[data-watch]").innerHTML = WATCH.length ? WATCH.map(w => `<li>
      <span class="pr p${w.p}" aria-label="Pressure ${w.p} of 5">${"<b>›</b>".repeat(w.p)}${"›".repeat(5 - w.p)}</span>
      <span class="w-name">${esc(w.name)}</span>
      <span class="w-meta"><i class="${w.v ? "v" : "a"}" aria-hidden="true"></i>${w.v ? "Verified" : "Assumed"} · ${code(w.divs)} · ${esc(w.meta)}</span></li>`).join("")
      : `<li><span class="pr" aria-hidden="true">›››››</span><span class="w-name">Nothing is holding anything up.</span><span class="w-meta">Monitoring will say so the moment that changes.</span></li>`;
    renderHor();
  };

  /* the division dial: twelve ticks round a ring, lit to the load */
  const dial = (load, size, onDark) => {
    let t = "";
    for (let j = 0; j < 12; j++) { const a = -90 + j * 30, [x0, y0] = pt(13, a), [x1, y1] = pt(17.5, a);
      t += `<line class="t${j < load ? " lit" : ""}" x1="${(20 + x0).toFixed(1)}" y1="${(20 + y0).toFixed(1)}" x2="${(20 + x1).toFixed(1)}" y2="${(20 + y1).toFixed(1)}"${onDark ? ` style="stroke:${j < load ? "#c9b5ff" : "rgba(255,255,255,.2)"}"` : ""}/>`; }
    return `<svg class="dial" viewBox="0 0 40 40" width="${size}" height="${size}" aria-hidden="true">${t}<text x="20" y="20"${onDark ? ' style="fill:#fff"' : ""}>${load}</text></svg>`;
  };
  $("[data-dossiers]").innerHTML = DIVS.map((d, i) => `<article class="dos" data-i="${i}" tabindex="0" aria-label="${d.name}: open on the wheel">
    <span class="dos-tab">${dial(d.load, 38)}</span>
    <span class="dos-n">${pad(i + 1)} · ${d.k}</span><h3>${d.name}</h3><p class="dos-role">${esc(d.role)}</p>
    <p class="dos-now"><span>Now</span>${esc(d.now)}</p></article>`).join("");
  $$(".dos").forEach(a => {
    const go = () => { pause(); scrollTo({ top: 0, behavior: still ? "auto" : "smooth" }); select(+a.dataset.i, true); };
    a.addEventListener("click", go);
    a.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
  });

  /* section tabs scroll; the brand and "Control room" return to the top */
  $$("[data-go]").forEach(b => b.addEventListener("click", () => $("#" + b.dataset.go).scrollIntoView({ behavior: still ? "auto" : "smooth" })));

  /* ================= the dashboard (#dashboard) ================= */
  /* the conversation: Sir's objectives and Cipher's answers, newest at the bottom */
  const threadEl = $("[data-thread]");
  const say = (who, text, o = {}) => {
    if (!threadEl) return;
    const li = document.createElement("li");
    li.className = "msg " + who;
    li.innerHTML = `<p class="m-k"><span>${who === "sir" ? "Sir" : "Cipher"}</span><time>${clock()}</time></p>
      ${o.title ? `<p class="m-h">${esc(o.title)}</p>` : ""}<p class="m-t">${esc(text)}</p>
      ${o.steps ? `<ol class="m-steps">${o.steps.map(i => `<li><b>${DIVS[i].k}</b><span>${esc(DIVS[i].move)}</span></li>`).join("")}</ol>` : ""}
      ${o.note ? `<p class="m-note">${esc(o.note)}</p>` : ""}`;
    threadEl.appendChild(li);
    threadEl.scrollTo({ top: threadEl.scrollHeight, behavior: still ? "auto" : "smooth" });
  };

  /* the six division modules: load dial, what it is doing, and its state */
  const modsEl = $("[data-mods]");
  const stateOf = i => {
    const k = DIVS[i].k;
    if (engaged.includes(i)) return ["eng", "Engaged"];
    if (DECIDE.some(d => d.divs[0] === k)) return ["wait", "Needs you"];
    if (WATCH.some(w => w.divs.includes(k) && w.p >= 3)) return ["risk", "Blocked"];
    return ["ok", "Working"];
  };
  const renderMods = () => {
    if (!modsEl) return;
    modsEl.innerHTML = DIVS.map((d, i) => { const [c, t] = stateOf(i);
      return `<button class="mod${focus === i ? " on" : ""}" type="button" data-i="${i}" aria-pressed="${focus === i}">
        ${dial(d.load, 44)}<span class="mod-b"><span class="mod-n">${pad(i + 1)} · ${d.k}</span><span class="mod-name">${d.name}</span>
        <span class="mod-s ${c}"><i aria-hidden="true"></i>${t}</span></span></button>`; }).join("");
  };
  if (modsEl) modsEl.addEventListener("click", e => { const b = e.target.closest(".mod"); if (b) { pause(); focusOn(focus === +b.dataset.i ? -1 : +b.dataset.i); } });

  /* focus: one division's view of the objectives and the wire */
  const focusEl = $("[data-focus]");
  const focusOn = i => {
    focus = i;
    if (i >= 0) select(i, false);
    if (focusEl) focusEl.innerHTML = i >= 0 ? `Focus <b>${DIVS[i].name}</b> <button type="button" data-unfocus aria-label="Clear the focus">×</button>` : "All divisions";
    renderMods(); renderObjs(); renderWire();
  };
  if (focusEl) focusEl.addEventListener("click", e => { if (e.target.closest("[data-unfocus]")) focusOn(-1); });

  /* your judgement: the decisions as a deck; Approve sends the top card away, Defer tucks it under */
  const deckEl = $("[data-deck]");
  /* decided today: what you approved or deferred, newest first (two sample entries from earlier) */
  const back0 = m => { const d = new Date(Date.now() - m * 60000); return pad(d.getHours()) + ":" + pad(d.getMinutes()); };
  const DECIDED = [
    { t: back0(95), how: "Approved", title: "Hire a contract QA engineer for the launch" },
    { t: back0(160), how: "Deferred", title: "Move the board pack to the 28th" },
    { t: back0(210), how: "Approved", title: "Pause the paid search test until January" },
    { t: back0(255), how: "Approved", title: "Renew the design tool licences for a year" },
    { t: back0(300), how: "Deferred", title: "Survey the team on the office move" },
    { t: back0(340), how: "Approved", title: "Publish the November changelog" }
  ];
  const logEl = $("[data-log]");
  const renderLog = () => {
    if (!logEl) return;
    logEl.innerHTML = DECIDED.slice(0, 12).map(d => `<li class="${d.fresh ? "new" : ""}"><time>${d.t}</time>
      <span><b class="${d.how === "Approved" ? "y" : "n"}">${d.how}</b>${esc(d.title)}</span></li>`).join("");
    DECIDED.forEach(d => { d.fresh = false; });
  };
  const renderDeck = () => {
    renderLog();
    if (!deckEl) return;
    deckEl.innerHTML = DECIDE.length ? DECIDE.slice(0, 3).map((d, i) => `<article class="dk" style="--i:${i}" ${i ? 'aria-hidden="true"' : ""}>
        <p class="dk-k"><span>${pad(i + 1)} of ${pad(DECIDE.length)}</span><span>${code(d.divs)}</span></p>
        <p class="dk-h">${esc(d.title)}</p><p class="dk-t">${esc(d.ctx)}</p>
        ${i ? "" : `<div class="dk-row"><button class="c-btn solid" type="button" data-dk="yes">Approve</button><button class="c-btn" type="button" data-dk="defer">Defer</button></div>`}
      </article>`).reverse().join("")
      : `<div class="dk-empty"><svg class="mark" viewBox="0 0 48 48" aria-hidden="true"><path d="M33.19 14.81A13 13 0 1 0 33.19 33.19"/><circle cx="24" cy="24" r="4"/></svg><p class="dk-h">Nothing awaits you, Sir.</p><p class="dk-t">Enjoy it. It rarely lasts.</p></div>`;
    /* the deck is as tall as its top card plus the two edges peeking under it, so the log below gets the rest */
    const top = deckEl.querySelector(".dk:last-child");
    deckEl.style.height = top ? (top.offsetHeight + Math.min(DECIDE.length - 1, 2) * 10 + 2) + "px" : "150px";
  };
  if (deckEl) deckEl.addEventListener("click", e => {
    const b = e.target.closest("[data-dk]"); if (!b) return;
    const top = b.closest(".dk"), yes = b.dataset.dk === "yes";
    top.classList.add(yes ? "fly" : "tuck");
    setTimeout(() => { if (yes) { const done = approve(); say("cipher", done, { title: "Decision recorded." }); } else defer(); }, still ? 0 : 420);
  });

  /* the wire: what the divisions report, newest first (a simulated feed of sample events) */
  const WIRE_POOL = [
    ["I", "Second source found for one competitor figure"], ["I", "Pricing scan of three rivals complete"],
    ["O", "Two launch tasks re-prioritised"], ["O", "Milestone “Beta freeze” confirmed for Thursday"],
    ["T", "Dependency update passed all tests"], ["T", "Uptime check: every service responding", false], ["T", "Certificate on the staging site expires in 21 days", true],
    ["C", "Route B type explored in two weights"], ["C", "Icon set: 12 of 24 drawn"],
    ["K", "14 documents tagged and cross-referenced"], ["K", "Duplicate brief merged into the master file"],
    ["M", "Reminder set: board pack due in 14 days"], ["M", "Launch copy approval is now 2 days late", true]
  ];
  const WIRE = [];
  const wire = (k, text, warn) => { WIRE.unshift({ k, text, warn: !!warn, t: clock(), fresh: true }); if (WIRE.length > 40) WIRE.pop(); renderWire(); };
  const wireEl = $("[data-wire]");
  const renderWire = () => {
    if (!wireEl) return;
    const f = focus >= 0 ? DIVS[focus].k : "";
    const list = WIRE.filter(w => !f || w.k === f).slice(0, 14);
    wireEl.innerHTML = list.length ? list.map(w => `<li class="${w.fresh ? "new" : ""}${w.warn ? " warn" : ""}"><time>${w.t}</time>
      <span class="gl" aria-label="${DIVS[DK[w.k]].name}">${w.k}</span><span>${esc(w.text)}</span></li>`).join("")
      : `<li><time>—</time><span class="gl">${f}</span><span>Nothing from ${DIVS[focus].name} yet.</span></li>`;
    WIRE.forEach(w => { w.fresh = false; });
  };
  /* backdate a few entries so the wire is not empty on arrival */
  const back = m => { const d = new Date(Date.now() - m * 60000); return pad(d.getHours()) + ":" + pad(d.getMinutes()); };
  [[118, 7], [104, 2], [91, 10], [77, 5], [63, 8], [52, 3], [42, 9], [31, 4], [18, 11], [9, 12], [3, 0]].forEach(([m, k]) => { const [d, t, w] = WIRE_POOL[k]; WIRE.unshift({ k: d, text: t, warn: !!w, t: back(m) }); });
  let lastPool = -1;
  const feed = () => {
    if (document.hidden || route !== "dashboard") return;
    let k; do { k = (Math.random() * WIRE_POOL.length) | 0; } while (k === lastPool);
    lastPool = k; const [d, t, w] = WIRE_POOL[k]; wire(d, t, w);
  };

  /* the head: status line and the signal strip */
  const renderHead = () => {
    const st = $("[data-dstatus]"); if (!st) return;
    const r = WATCH.filter(w => w.p >= 3).length;
    st.innerHTML = `<span><i class="live" aria-hidden="true"></i>6 of 6 divisions online</span><span><b>${pad(OBJS.length)}</b> objectives</span>` +
      `<span><b>${pad(DECIDE.length)}</b> ${DECIDE.length === 1 ? "decision" : "decisions"} awaiting</span><span class="${r ? "r" : ""}"><b>${pad(r)}</b> ${r === 1 ? "risk" : "risks"}</span>`;
  };
  const dsig = $("[data-dsig]");
  if (dsig) {
    const max = Math.max(...SIGNAL), h = new Date().getHours();
    dsig.innerHTML = SIGNAL.map((v, k) => `<i style="--v:${(v / max * 100).toFixed(1)}" class="${k === SIGNAL.length - 1 ? "now" : ""}" title="${pad((h - (SIGNAL.length - 1 - k) + 24) % 24)}:00 · ${v} requests"></i>`).join("");
  }

  /* one refresh for everything that reads the shared state */
  const refresh = fresh => { tally(); renderObjs(fresh); renderWatch(); renderMods(); renderDeck(); renderHead(); if (mode === "decide") card("decide"); };

  /* ---------------- start ---------------- */
  renderObjs(); renderSig(); renderWatch(); tally(); renderMods(); renderDeck(); renderWire(); renderHead();
  say("cipher", briefing(), { title: greeting() + ", Sir. Here is where things stand." });
  select(0, false); card("decide");
  const start = () => {
    idle = setInterval(cycle, 6500);
    setInterval(feed, 9000);
    const rv = $$(".inst,.dos,.rules,.voice,.sect-head");
    rv.forEach(e => e.classList.add("rv"));
    if ("IntersectionObserver" in window && !still) {
      const io = new IntersectionObserver(es => es.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in"); if (e.target.querySelector("[data-sig]")) sigEl.classList.add("in");
        io.unobserve(e.target);
      }), { threshold: 0.15 });
      rv.forEach(e => io.observe(e));
    } else { rv.forEach(e => e.classList.add("in")); sigEl.classList.add("in"); }
  };
})();
