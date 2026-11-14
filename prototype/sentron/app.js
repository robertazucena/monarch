/* Sentron Ops · console app (concept). Works from file://. Routes are #pagename.
   One loop: plant reading -> alarm -> call -> dispatch -> visit -> signed report -> reading back to normal.
   Client names: sentron.com.sg. Readings, equipment, jobs and reports: SAMPLE data, simulated live. */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pad = n => String(n).padStart(2, "0");
  const hm = h => { const m = Math.round(h * 60); return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`; };
  const esc = v => String(v).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const jit = a => (rnd() - .5) * 2 * a;
  const f1 = v => v.toFixed(1), f2 = v => v.toFixed(2);

  /* ---------- floors ---------- */
  const FLOORS = [
    { id: "overview", l: "L01", n: "Overview", s: "The whole loop at a glance: delivery against target bands, today's alarms, and what is happening right now." },
    { id: "plant", l: "L02", n: "Plant", s: "Live readings from the buildings we look after. Out-of-range readings raise alarms." },
    { id: "faults", l: "L03", n: "Faults", s: "Every alarm from the building systems and every phoned-in call, and where each one is in the loop." },
    { id: "dispatch", l: "L04", n: "Dispatch", s: "Put calls and due visits on a crew. Skills, clashes and travel are checked." },
    { id: "buildings", l: "L05", n: "Buildings", s: "Contracts and the equipment register: every unit, its readings and its history." },
    { id: "reports", l: "L06", n: "Reports", s: "Each report traced back to the reading or call that started it." }
  ];
  const byId = Object.fromEntries(FLOORS.map(f => [f.id, f]));

  /* ---------- clock: real SGT in working hours, otherwise a demo morning ---------- */
  const sgt = () => new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }));
  const r0 = sgt(), realH = r0.getHours() + r0.getMinutes() / 60;
  const DEMO = realH >= 8.75 && realH <= 16.5 ? null : 9 + 40 / 60;
  const t0 = Date.now();
  const nowH = () => DEMO === null ? (d => d.getHours() + d.getMinutes() / 60)(sgt()) : DEMO + (Date.now() - t0) / 3.6e6;
  const P = h => Math.min(1, Math.max(0, (h - 8) / 10));
  const q15 = h => Math.ceil(h * 4 - 1e-6) / 4;
  const hmd = h => hm(((h % 24) + 24) % 24);

  /* ---------- event log: every BMS read and every step of the loop ---------- */
  const FEED = [];
  let feedOn = false, feedN = 0;
  const log = (k, t, h = nowH()) => { FEED.unshift({ h, k, t, n: ++feedN }); if (FEED.length > 80) FEED.pop(); if (feedOn) onLog(); };

  /* ---------- regions and travel ---------- */
  const REG = { w: "West", n: "North", ne: "North-East", c: "Central", e: "East" };
  const TR = { c: { c: 15, w: 30, n: 30, ne: 30, e: 30 }, w: { w: 15, c: 30, n: 40, ne: 60, e: 60 }, n: { n: 15, c: 30, w: 40, ne: 30, e: 45 }, ne: { ne: 15, c: 30, n: 30, e: 30, w: 60 }, e: { e: 15, c: 30, ne: 30, n: 45, w: 60 } };
  const travel = (a, b) => (a && b ? TR[a][b] : 0) / 60;

  /* ---------- crews and skills ---------- */
  const SK = { AHU: "Air handling units", CHW: "Chilled-water plant", DX: "Split and VRV", SMK: "Smoke control", CLN: "Coil cleaning" };
  const CREWS = [
    { id: "C01", n: "Crew 01", size: 3, sk: ["AHU", "DX", "CLN"] },
    { id: "C02", n: "Crew 02", size: 3, sk: ["AHU", "DX"] },
    { id: "C03", n: "Crew 03", size: 4, sk: ["AHU", "CHW"] },
    { id: "C04", n: "Crew 04", size: 2, sk: ["CLN", "DX"] },
    { id: "C05", n: "Crew 05", size: 6, sk: ["DX"] },
    { id: "C06", n: "Crew 06", size: 3, sk: ["SMK", "AHU"] }
  ];
  const crew = id => CREWS.find(c => c.id === id);
  const TYPES = { svc: { n: "Servicing", c: "t-svc" }, cln: { n: "Cleaning", c: "t-cln" }, flt: { n: "Call-out", c: "t-flt" }, ins: { n: "Installation", c: "t-ins" }, smk: { n: "Smoke control", c: "t-smk" } };

  /* ---------- buildings, plants and equipment ---------- */
  const LIM = { satOver: 2, dp: 250, vib: 4.5, eff: .72, dt: 4.5 };
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const B = [
    { id: "t4", n: "Changi Airport Terminal 4", short: "Changi T4", reg: "e", sec: "Airport", crit: true, plan: 12, done: 10, start: 0, renew: "Jun 2027", chillers: [2, 3], load: 1450, eff: .61, dt: 5.6, sp: 14,
      zones: ["Departure hall", "Arrival hall", "Gates G1–G9", "Gates G10–G21", "Baggage hall", "Retail level 2", "Food court", "Offices level 3"] },
    { id: "rh", n: "Raffles Hospital", short: "Raffles Hospital", reg: "c", sec: "Healthcare", crit: true, plan: 12, done: 10, start: 0, renew: "Sep 2027", chillers: [2, 3], load: 980, eff: .64, dt: 5.4, sp: 13,
      zones: ["Emergency", "Operating theatres", "Wards level 5", "Wards level 6", "Clinic B", "Lobby"] },
    { id: "mah", n: "Mount Alvernia Hospital", short: "Mount Alvernia", reg: "c", sec: "Healthcare", crit: true, plan: 6, done: 5, start: 0, renew: "Dec 2026", chillers: [1, 2], load: 620, eff: .66, dt: 5.2, sp: 13,
      zones: ["Ward 3", "Ward 4", "Day surgery", "Imaging", "Lobby", "Kitchen"] },
    { id: "mandai", n: "SMRT Mandai Depot", short: "Mandai Depot", reg: "n", sec: "Transport", plan: 4, done: 3, start: 1, renew: "Mar 2027", chillers: [2, 2], load: 540, eff: .63, dt: 5.5, sp: 14,
      zones: ["Operations control", "Workshop", "Offices", "Stores", "Canteen"] },
    { id: "wdl", n: "SMRT Woodlands Transport Hub", short: "Woodlands Hub", reg: "n", sec: "Transport", plan: 6, done: 5, start: 0, renew: "Jan 2027", chillers: [1, 2], load: 410, eff: .62, dt: 5.7, sp: 14,
      zones: ["Bus concourse", "Interchange level 1", "Offices", "Retail", "Staff rest"] },
    { id: "srr", n: "St. Regis Residences", short: "St. Regis Residences", reg: "c", sec: "Residential", plan: 6, done: 5, start: 1, renew: "Aug 2027", chillers: [1, 2], load: 260, eff: .68, dt: 5.3, sp: 15,
      zones: ["Lobby", "Clubhouse", "Gym", "Function room"] },
    // contracts without a BMS link: split and VRV units, serviced on visits, problems come in by phone
    { id: "pv", n: "Parc Vista Condominium", reg: "w", sec: "Residential", plan: 6, done: 5, start: 1, renew: "Apr 2027", dx: 6, zones: ["Clubhouse", "Gym", "Function room", "Guardhouse", "Management office", "Lobby A"] },
    { id: "jd", n: "Jardine Condo, Dunearn Road", reg: "c", sec: "Residential", plan: 4, done: 3, start: 2, renew: "May 2027", dx: 4, zones: ["Clubhouse", "Gym", "Lobby", "Management office"] },
    { id: "ur", n: "Urban Resorts, Cairnhill Road", reg: "c", sec: "Residential", plan: 6, done: 5, start: 0, renew: "Jan 2027", dx: 4, zones: ["Lobby", "Gym", "Sky lounge", "Management office"] },
    { id: "ms", n: "8 @ Mount Sophia", reg: "c", sec: "Residential", plan: 4, done: 3, start: 0, renew: "Oct 2027", dx: 4, zones: ["Clubhouse", "Lobby", "Gym", "Function room"] },
    { id: "gg", n: "Gallop Green Condominium", reg: "c", sec: "Residential", plan: 4, done: 3, start: 2, renew: "Mar 2027", dx: 3, zones: ["Clubhouse", "Lobby", "Management office"] },
    { id: "rr", n: "Roland Restaurant", reg: "c", sec: "Commercial", plan: 4, done: 3, start: 1, renew: "Feb 2027", dx: 3, zones: ["Dining room", "Private room", "Kitchen"] }
  ];
  const bOf = id => B.find(b => b.id === id);
  const bByName = n => B.find(b => b.n === n);
  const live = b => !b.dx;
  const dstr = daysAgo => { const d = new Date(Date.now() - daysAgo * 864e5); return `${d.getDate()} ${MONTHS[d.getMonth()]}`; };

  // equipment register
  B.forEach(b => {
    b.units = b.zones.map((z, i) => {
      const tag = live(b) ? `AHU-${pad(i + 1)}` : `FCU-${pad(i + 1)}`;
      const u = { tag, type: live(b) ? "AHU" : "FCU", kind: live(b) ? "Chilled-water AHU" : "Split unit, R410A", zone: z, b: b.id,
        sp: b.sp, base: { sat: (b.sp || 0) + jit(.3), dp: 140 + rnd() * 70, vib: 1.4 + rnd() * 1.4 }, svc: 6 + Math.floor(rnd() * 20), filt: 20 + Math.floor(rnd() * 60), hist: [] };
      Object.assign(u, { sat: u.base.sat, dp: u.base.dp, vib: u.base.vib });
      const crews = ["Crew 01", "Crew 02", "Crew 03", "Crew 04"];
      u.hist.push({ d: dstr(u.svc), t: "Service", x: `Routine servicing · ${crews[i % 4]}` });
      u.hist.push({ d: dstr(u.filt), t: "Filters", x: live(b) ? "Bag filters changed (F7)" : "Filters washed" });
      if (!live(b) && rnd() > .5) u.hist.push({ d: dstr(40 + Math.floor(rnd() * 90)), t: "Refrigerant", x: `R410A top-up ${f1(.4 + rnd())} kg · leak test passed` });
      u.hist.push({ d: dstr(u.svc + 30 * (12 / b.plan)), t: "Service", x: `Routine servicing · ${crews[(i + 1) % 4]}` });
      return u;
    });
  });
  // the faults behind today's alarms
  const unit = (bid, tag) => bOf(bid).units.find(u => u.tag === tag);
  Object.assign(unit("t4", "AHU-07").base, { sat: 17.9 });
  Object.assign(unit("rh", "AHU-05").base, { dp: 318 });
  Object.assign(unit("mah", "AHU-03").base, { vib: 7.2 });
  ["t4:AHU-07", "rh:AHU-05", "mah:AHU-03"].forEach(k => { const [b, t] = k.split(":"); const u = unit(b, t); Object.assign(u, { sat: u.base.sat, dp: u.base.dp, vib: u.base.vib }); });
  Object.assign(bOf("mandai"), { eff: .84, dt: 3.6, faultFrom: 3 }); // low ΔT since 03:00
  unit("rh", "AHU-02").hist.unshift({ d: dstr(1), t: "Call-out", x: "Supply air 16.4 °C vs 13 °C · valve actuator replaced · R-2611" });
  unit("wdl", "AHU-03").hist.unshift({ d: dstr(2), t: "Call-out", x: "Filter ΔP 296 Pa · filters changed · R-2609" });

  // plant readings, simulated live
  function plant(b, h = nowH()) {
    const day = .72 + .28 * Math.max(0, Math.sin(((h - 6) / 14) * Math.PI));
    const load = b.load * day * (1 + jit(.015));
    const eff = b.eff + jit(.008);
    const chws = 6.7 + jit(.08), dt = b.dt + jit(.1);
    return { load, kw: load * eff, eff, chws, chwr: chws + dt, dt };
  }
  function tick() {
    B.filter(live).forEach(b => {
      b.now = plant(b);
      b.units.forEach(u => { u.sat = u.base.sat + jit(.15); u.dp = u.base.dp + jit(3); u.vib = Math.max(.6, u.base.vib + jit(.12)); });
    });
  }
  tick();
  // 24 h efficiency history for the trend (hourly)
  B.filter(live).forEach(b => {
    b.trend = Array.from({ length: 25 }, (_, i) => {
      const hh = nowH() - 24 + i, hod = ((hh % 24) + 24) % 24;
      const bad = b.faultFrom != null && hh >= b.faultFrom && hh > 0;
      return { h: hh, v: (bad ? b.eff : (bOf(b.id).id === "mandai" ? .63 : b.eff)) + (hod < 6 ? .03 : 0) + jit(.012) };
    });
  });

  /* ---------- alarms (from rules) and calls ---------- */
  const ALARMS = new Map(); // key -> { key, b, tag, kind, p, since, status, call }
  const SEED_SINCE = { "t4:AHU-07:sat": 7.8, "rh:AHU-05:dp": 6.5, "mah:AHU-03:vib": 8.3, "mandai:plant:plant": 3 };
  function evaluate() {
    const h = nowH(), seen = new Set();
    B.filter(live).forEach(b => {
      const add = (tag, kind, p, read, lim, issue, skill, dur) => {
        const key = `${b.id}:${tag}:${kind}`; seen.add(key);
        const a = ALARMS.get(key);
        if (a) Object.assign(a, { read, lim });
        else {
          ALARMS.set(key, { key, b: b.id, tag, kind, p, read, lim, issue, skill, dur, since: Math.min(h, SEED_SINCE[key] ?? h), status: "new", call: null });
          if (feedOn) log("Alarm", `${b.short} ${tag === "plant" ? "chiller plant" : tag} · ${read} · ${lim}`);
        }
      };
      b.units.forEach(u => {
        if (u.sat > u.sp + LIM.satOver) add(u.tag, "sat", b.crit && u.sat > u.sp + 3 ? 1 : 2, `Supply air ${f1(u.sat)} °C`, `Setpoint ${u.sp} °C`, "Supply air too warm", "AHU", 2);
        if (u.dp > LIM.dp) add(u.tag, "dp", b.crit ? 2 : 3, `Filter ΔP ${Math.round(u.dp)} Pa`, `Limit ${LIM.dp} Pa`, "Filters blocked", "AHU", 1);
        if (u.vib > LIM.vib) add(u.tag, "vib", 2, `Fan vibration ${f1(u.vib)} mm/s`, `Limit ${LIM.vib} mm/s`, "Fan bearing wearing", "AHU", 2);
      });
      if (b.now.eff > LIM.eff || b.now.dt < LIM.dt) add("plant", "plant", 3, `${f2(b.now.eff)} kW/RT · ΔT ${f1(b.now.dt)} °C`, `Target ≤ ${LIM.eff} kW/RT · ΔT ≥ ${LIM.dt} °C`, "Low chilled-water ΔT, plant inefficient", "CHW", 1.5);
    });
    ALARMS.forEach(a => { if (!seen.has(a.key) && a.status !== "cleared") { a.status = "cleared"; a.cleared = h; if (feedOn) log("Restored", `${bOf(a.b).short} ${a.tag === "plant" ? "chiller plant" : a.tag} back in range · ${a.issue.toLowerCase()} fixed`); } });
  }

  let callNo = 1040;
  const CALLS = [];
  function raise(key) {
    const a = ALARMS.get(key); if (!a || a.call) return;
    const b = bOf(a.b), c = { id: `C-${++callNo}`, src: "alarm", alarm: key, b: b.id, site: b.n, reg: b.reg, unit: a.tag === "plant" ? "Chiller plant" : a.tag, issue: a.issue, read: a.read, lim: a.lim, p: a.p, at: nowH(), dur: a.dur, skill: a.skill, status: "To schedule", job: null };
    a.call = c.id; a.status = "raised"; CALLS.unshift(c);
    return c;
  }
  // phoned-in calls already waiting
  [["ms", "FCU-03", "Water dripping from ceiling grille", 2, 8.9], ["gg", "FCU-02", "No cooling in clubhouse", 2, 9.1]].forEach(([bid, u, d, p, at]) => {
    const b = bOf(bid); CALLS.push({ id: `C-${++callNo}`, src: "phone", b: bid, site: b.n, reg: b.reg, unit: u, issue: d, read: "Phoned in by the managing agent", p, at: Math.min(at, nowH()), dur: 1.5, skill: "DX", status: "To schedule", job: null });
  });

  /* ---------- today's jobs ---------- */
  let jobNo = 100;
  const JOBS = [
    { c: "C01", t: "svc", s: 8.5, e: 10.5, b: "pv", what: "Visit 6 of 6 · all fan coils" },
    { c: "C01", t: "svc", s: 11.5, e: 13.5, b: "ur", what: "Visit 6 of 6 · lobby and gym" },
    { c: "C02", t: "svc", s: 8, e: 12, b: "mandai", what: "Visit 4 of 4 · AHU servicing" },
    { c: "C02", t: "svc", s: 13, e: 16.5, b: "wdl", what: "Visit 6 of 6 · AHU servicing" },
    { c: "C03", t: "svc", s: 11, e: 17.5, b: "t4", what: "Visit 11 of 12 · departure hall AHUs" },
    { c: "C04", t: "cln", s: 9, e: 12, b: "srr", what: "Chemical cleaning · 4 AHU coils" },
    { c: "C04", t: "cln", s: 13.5, e: 15.5, b: "jd", what: "Steam cleaning · clubhouse units" },
    { c: "C05", t: "ins", s: 8, e: 18, site: "Changi Airport Terminal 5", reg: "e", what: "VRV indoor units, level 2" },
    { c: "C06", t: "smk", s: 8.5, e: 12.5, site: "Changi Airport Terminal 2", reg: "e", what: "Smoke control · commissioning tests" },
    { c: "C06", t: "smk", s: 14, e: 17, site: "Gardens by the Bay", reg: "c", what: "Smoke damper cycling" }
  ].map(j => ({ ...j, id: `J${++jobNo}`, site: j.site || bOf(j.b).n, reg: j.reg || bOf(j.b).reg }));
  // the Changi T4 alarm was raised before 08:00 and is already on Crew 03
  evaluate();
  { const c = raise("t4:AHU-07:sat"); c.at = 7.85; const j = { id: `J${++jobNo}`, c: "C03", t: "flt", s: 8.5, e: 10.5, b: "t4", site: c.site, reg: "e", what: `${c.unit} · ${c.issue}`, call: c.id }; JOBS.push(j); c.job = j.id; c.status = "Booked"; }
  const jobState = j => j.done ? "done" : j.inAt != null ? "live" : (j.t !== "flt" && j.e <= nowH()) ? "done" : j.s <= nowH() ? (j.e <= nowH() ? "over" : "live") : "";

  /* ---------- visits due, not yet booked ---------- */
  const VISITS = [
    { id: "V1", b: "ms", what: "Visit 4 of 4 · clubhouse units", dur: 2, skill: "DX", t: "svc" },
    { id: "V2", b: "rh", what: "Visit 11 of 12 · AHU servicing", dur: 3, skill: "AHU", t: "svc" },
    { id: "V3", b: "rr", what: "Visit 4 of 4 · kitchen exhaust and fan coils", dur: 2, skill: "DX", t: "svc" }
  ].map(v => ({ ...v, site: bOf(v.b).n, reg: bOf(v.b).reg, booked: false }));

  /* ---------- reports ---------- */
  let repNo = 2613;
  const REPORTS = [
    { no: "R-2613", b: "mandai", site: "SMRT Mandai Depot", unit: "AHU-02", kind: "Servicing", date: "Yesterday", crew: "Crew 02", status: "Awaiting signature",
      chain: [["Visit", "Yesterday 13:00–16:00", "Visit 3 of 4 · Crew 02"], ["Report", "Yesterday 16:20", "Filters washed, coils checked, drain cleared"]] },
    { no: "R-2611", b: "rh", site: "Raffles Hospital", unit: "AHU-02", kind: "Call-out", date: "Yesterday", crew: "Crew 03", status: "Signed",
      chain: [["Reading", "Yesterday 10:42", "Supply air 16.4 °C · setpoint 13 °C"], ["Alarm", "Yesterday 10:47", "P1 · supply air too warm"], ["Call", "Yesterday 10:51", "C-1037 raised by the ops desk"], ["Visit", "Yesterday 12:15–13:45", "Crew 03 · valve actuator replaced"], ["Report", "Yesterday 14:02", "Signed by the hospital's facilities manager"]] },
    { no: "R-2609", b: "wdl", site: "SMRT Woodlands Transport Hub", unit: "AHU-03", kind: "Call-out", date: "2 days ago", crew: "Crew 02", status: "Signed",
      chain: [["Reading", "Wed 08:05", "Filter ΔP 296 Pa · limit 250 Pa"], ["Alarm", "Wed 08:05", "P3 · filters blocked"], ["Call", "Wed 08:30", "C-1031 raised by the ops desk"], ["Visit", "Wed 14:00–15:00", "Crew 02 · bag filters changed"], ["Report", "Wed 15:12", "Signed by SMRT depot engineer"]] },
    { no: "R-2605", b: "ur", site: "Urban Resorts, Cairnhill Road", unit: "FCU-02", kind: "Call-out", date: "3 days ago", crew: "Crew 04", status: "Signed",
      chain: [["Call", "Tue 09:20", "C-1026 · phoned in: noisy fan in the gym"], ["Visit", "Tue 13:30–14:30", "Crew 04 · fan motor replaced"], ["Report", "Tue 14:41", "Signed by the managing agent"]] }
  ];

  /* ---------- preloader ---------- */
  const boot = $("#boot"), bar = $("#bootBar");
  function load(f, ms) {
    $("#bootZone").textContent = `${f.l} · ${f.n}`;
    boot.classList.remove("off", "spin");
    bar.style.transition = "none"; bar.style.setProperty("--p", 0); void bar.offsetWidth;
    bar.style.transition = `transform ${ms}ms cubic-bezier(.4,0,.2,1)`; bar.style.setProperty("--p", 1);
    setTimeout(() => boot.classList.add("spin"), ms * .35);
    setTimeout(() => boot.classList.add("off"), ms + 120);
  }

  /* ---------- riser nav + router ---------- */
  const rail = $(".rail"), menuBtn = $("#menuBtn");
  const counts = () => ({ faults: [...ALARMS.values()].filter(a => a.status === "new").length, dispatch: pool().length });
  function paintFloors() {
    const c = counts();
    $("#floors").innerHTML = FLOORS.map(f => `<li><a class="flr" href="#${f.id}" data-id="${f.id}"${f.id === current ? ' aria-current="page"' : ""}><span class="flr__l">${f.l}</span><span class="flr__n">${f.n}</span>${c[f.id] ? `<span class="flr__c${f.id === "faults" ? " hot" : ""}" aria-label="${c[f.id]} waiting">${c[f.id]}</span>` : "<span></span>"}</a></li>`).join("");
  }
  menuBtn.addEventListener("click", () => menuBtn.setAttribute("aria-expanded", rail.classList.toggle("open")));
  let current = null, first = true;
  function route() {
    const h = location.hash.slice(1);
    if (h && !byId[h] && document.getElementById(h)) { if (!current) show(byId.overview); return; }
    show(byId[h] || byId.overview);
  }
  function show(f) {
    if (current === f.id && !first) return;
    current = f.id;
    $$("[data-view]").forEach(v => (v.hidden = v.dataset.view !== f.id));
    $("#topK").textContent = `${f.l} · ${f.n}`; $("#topH").textContent = f.n; $("#topS").textContent = f.s;
    document.title = `${f.n} · Sentron Ops (concept)`;
    render(); paintFloors();
    rail.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false");
    load(f, RM ? 150 : first ? 1000 : 550);
    if (!first) { scrollTo(0, 0); $("#main").focus({ preventScroll: true }); }
    first = false;
    setTimeout(scrollNow, 80);
  }
  addEventListener("hashchange", route);
  const go = id => { location.hash = id; };

  /* ---------- shared UI ---------- */
  const tag = (t, cls = "") => `<span class="tag ${cls}">${t}</span>`;
  const pri = p => `<span class="pri${p === 1 ? " p1" : ""}">P${p}</span>`;
  function tabs(el, opts, cur, on) {
    el.innerHTML = opts.map(([k, n]) => `<button class="key key--tab" type="button" data-k="${k}" aria-pressed="${k === cur}">${n}</button>`).join("");
    el.onclick = e => { const b = e.target.closest("[data-k]"); if (!b) return; $$("[data-k]", el).forEach(x => x.setAttribute("aria-pressed", x === b)); on(b.dataset.k); };
  }
  function mlist(el, items, sel, label, pick) {
    el.innerHTML = items.map((it, i) => `<button class="mi" type="button" role="tab" data-i="${i}" aria-selected="${i === sel}" tabindex="${i === sel ? 0 : -1}">${label(it)}</button>`).join("");
    el.onclick = e => { const b = e.target.closest(".mi"); if (b) pick(+b.dataset.i, true); };
    el.onkeydown = e => {
      const d = { ArrowDown: 1, ArrowUp: -1 }[e.key]; if (!d) return;
      e.preventDefault(); const n = (sel + d + items.length) % items.length; pick(n); $(`.mi[data-i="${n}"]`, el).focus();
    };
  }
  const jump = sel => { if (innerWidth <= 1020) $(sel).scrollIntoView({ behavior: RM ? "auto" : "smooth", block: "start" }); };
  const tEl = Object.assign(document.createElement("div"), { className: "toast", role: "status" });
  document.body.append(tEl);
  let tT;
  function toast(m) { tEl.textContent = m; tEl.classList.add("on"); clearTimeout(tT); tT = setTimeout(() => tEl.classList.remove("on"), 3600); }

  /* =====================================================================
     L01 PLANT
     ===================================================================== */
  const LIVE = B.filter(live);
  let bSel = 0;
  const bAlarms = b => [...ALARMS.values()].filter(a => a.b === b.id && a.status !== "cleared");
  function reads() {
    const al = [...ALARMS.values()].filter(a => a.status !== "cleared"), h = nowH();
    const out = new Set(JOBS.filter(j => j.s <= h && j.e > h && !j.done).map(j => j.c)).size;
    const worst = LIVE.reduce((w, b) => (b.now.eff > w.now.eff ? b : w));
    $("#reads").innerHTML = `
      <div class="read${al.filter(a => a.status === "new").length ? " warm" : ""}"><p class="read__k">Alarms needing a call</p><p class="read__v"><b>${al.filter(a => a.status === "new").length}</b><span>of ${al.length} active</span></p><p class="read__s">${al.filter(a => a.p === 1).length} at P1 · airport and hospitals first</p></div>
      <div class="read"><p class="read__k">To schedule</p><p class="read__v"><b>${pool().length}</b><span>calls and visits</span></p><p class="read__s">${(n => `${n} call${n === 1 ? "" : "s"} booked on crews`)(CALLS.filter(c => c.status === "Booked").length)}</p></div>
      <div class="read"><p class="read__k">Crews on site</p><p class="read__v"><b>${out}</b><span>of ${CREWS.length}</span></p><p class="read__s">${JOBS.filter(j => !j.done && j.s > h).length} more jobs today</p></div>
      <div class="read"><p class="read__k">Least efficient plant</p><p class="read__v"><b>${f2(worst.now.eff)}</b><span>kW/RT</span></p><p class="read__s">${worst.short} · target ≤ ${LIM.eff}</p></div>`;
  }
  function plantList() {
    mlist($("#bList"), LIVE, bSel, b => {
      const a = bAlarms(b), n = a.filter(x => x.status === "new").length;
      return `<span class="mi__n">${b.n}</span><span class="mi__s">${b.sec} · ${f2(b.now.eff)} kW/RT</span><span class="mi__r">${a.length ? tag(`${a.length} alarm${a.length > 1 ? "s" : ""}`, n ? "tag--warm" : "tag--cool") : tag("Normal", "tag--ok")}</span>`;
    }, (i, click) => { bSel = i; plantList(); plantDet(); click && jump("#plantDet"); });
  }
  const row = (k, v, u, t, bad) => `<div class="pv${bad ? " bad" : ""}"><dt>${k}</dt><dd><b data-pv="${k}">${v}</b><span>${u}</span></dd><p>${t}</p></div>`;
  function plantPanel(b) {
    const p = b.now;
    return `<dl class="pvs">
      ${row("Cooling load", Math.round(p.load), "RT", `${b.chillers[0]} of ${b.chillers[1]} chillers running`)}
      ${row("Plant power", Math.round(p.kw), "kW", "Chillers, pumps and towers")}
      ${row("Efficiency", f2(p.eff), "kW/RT", `Target ≤ ${LIM.eff}`, p.eff > LIM.eff)}
      ${row("Chilled water out", f1(p.chws), "°C", "Setpoint 6.7 °C")}
      ${row("Chilled water back", f1(p.chwr), "°C", "")}
      ${row("ΔT", f1(p.dt), "°C", `Design 5.5 · alarm below ${LIM.dt}`, p.dt < LIM.dt)}
    </dl>`;
  }
  function trend(b) {
    const W = 640, H = 200, L = 40, R = 12, T = 14, Bm = 26, lo = .5, hi = .9;
    const x = i => L + (i / 24) * (W - L - R), y = v => T + (H - T - Bm) * (1 - (v - lo) / (hi - lo));
    const pts = b.trend.map((d, i) => `${x(i).toFixed(1)},${y(Math.min(hi, d.v)).toFixed(1)}`).join(" ");
    let s = "";
    [.5, .6, .7, .8, .9].forEach(v => (s += `<line class="gl" x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}"/><text class="ax" x="${L - 8}" y="${y(v)}" text-anchor="end" dominant-baseline="central">${v.toFixed(1)}</text>`));
    [0, 6, 12, 18, 24].forEach(i => (s += `<text class="ax" x="${x(i)}" y="${H - 6}" text-anchor="middle">${i === 24 ? "Now" : hm(((b.trend[i].h % 24) + 24) % 24)}</text>`));
    s += `<line class="tgt" x1="${L}" x2="${W - R}" y1="${y(LIM.eff)}" y2="${y(LIM.eff)}"/><text class="tgt-l" x="${W - R}" y="${y(LIM.eff) - 6}" text-anchor="end">Alarm above ${LIM.eff}</text>`;
    s += `<polyline class="ln" points="${pts}"/><circle class="dot" cx="${x(24)}" cy="${y(Math.min(hi, b.trend[24].v))}" r="4"/>`;
    s += `<line class="xh" id="xh" x1="0" x2="0" y1="${T}" y2="${H - Bm}" hidden/><circle class="xd" id="xd" r="4" hidden/><rect class="hit" x="${L}" y="${T}" width="${W - L - R}" height="${H - T - Bm}"/>`;
    return `<div class="trend" id="trend"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Plant efficiency over the last 24 hours, now ${f2(b.trend[24].v)} kW/RT">${s}</svg><div class="tip" id="tip" hidden></div></div>`;
  }
  function bindTrend(b) {
    const box = $("#trend"); if (!box) return;
    const svg = $("svg", box), tip = $("#tip"), xh = $("#xh"), xd = $("#xd");
    const W = 640, L = 40, R = 12, T = 14, H = 200, Bm = 26, lo = .5, hi = .9;
    const move = e => {
      const r = svg.getBoundingClientRect(), vx = ((e.clientX - r.left) / r.width) * W;
      const i = Math.max(0, Math.min(24, Math.round(((vx - L) / (W - L - R)) * 24))), d = b.trend[i];
      const cx = L + (i / 24) * (W - L - R), cy = T + (H - T - Bm) * (1 - (Math.min(hi, d.v) - lo) / (hi - lo));
      xh.setAttribute("x1", cx); xh.setAttribute("x2", cx); xd.setAttribute("cx", cx); xd.setAttribute("cy", cy); xh.removeAttribute("hidden"); xd.removeAttribute("hidden");
      tip.hidden = false; tip.textContent = `${i === 24 ? "Now" : hm(((d.h % 24) + 24) % 24)} · ${f2(d.v)} kW/RT${d.v > LIM.eff ? " · above alarm" : ""}`;
      tip.style.left = `${(cx / W) * r.width}px`; tip.style.top = `${(cy / H) * r.height}px`;
    };
    svg.addEventListener("pointermove", move);
    svg.addEventListener("pointerleave", () => { tip.hidden = true; xh.setAttribute("hidden", ""); xd.setAttribute("hidden", ""); });
  }
  const alarmCell = a => !a ? tag("Normal", "tag--ok")
    : a.status === "new" ? `<button class="btn btn--warm btn--s" type="button" data-raise="${a.key}">Raise call</button>`
    : `<button class="lnk" type="button" data-callgo="${a.call}">${a.call} · ${CALLS.find(c => c.id === a.call).status}</button>`;
  function unitRow(b, u) {
    const al = bAlarms(b).filter(a => a.tag === u.tag), a = al.find(x => x.status === "new") || al[0];
    const satBad = u.sat > u.sp + LIM.satOver, dpBad = u.dp > LIM.dp, vibBad = u.vib > LIM.vib;
    return `<tr><td class="nw"><button class="lnk" type="button" data-unit="${b.id}:${u.tag}">${u.tag}</button></td><td>${u.zone}</td>
      <td class="nw${satBad ? " bad" : ""}" data-u="${u.tag}:sat">${f1(u.sat)} <span class="sub-i">/ ${u.sp} °C</span></td>
      <td class="${dpBad ? "bad" : ""}"><span class="meter" role="img" aria-label="Filter pressure drop ${Math.round(u.dp)} pascals, limit ${LIM.dp}"><i style="width:${Math.min(100, (u.dp / 350) * 100)}%"></i><b style="left:${(LIM.dp / 350) * 100}%"></b></span><span class="sub-i" data-u="${u.tag}:dp">${Math.round(u.dp)} Pa</span></td>
      <td class="nw${vibBad ? " bad" : ""}" data-u="${u.tag}:vib">${f1(u.vib)} <span class="sub-i">mm/s</span></td>
      <td>${alarmCell(a)}</td></tr>`;
  }
  function plantDet() {
    const b = LIVE[bSel], pa = bAlarms(b).find(a => a.tag === "plant");
    $("#plantDet").setAttribute("aria-labelledby", "pdH");
    $("#plantDet").innerHTML = `
      <section class="card">
        <div class="card__hd"><div><p class="mono top__k">${b.sec} · ${REG[b.reg]} · <span class="livedot" aria-hidden="true"></span>live, every 5 s</p><h2 class="det__h" id="pdH">${b.n}</h2></div>
          ${pa ? `<div class="pa">${tag("Plant alarm", "tag--warm")}<span>${pa.issue}</span>${alarmCell(pa)}</div>` : ""}</div>
        <div id="pvs">${plantPanel(b)}</div>
      </section>
      <section class="card">
        <div class="card__hd"><div><h3 class="card__h">Plant efficiency, last 24 hours</h3><p class="card__s">kW of plant power per refrigeration ton · lower is better · hover the line</p></div></div>
        ${trend(b)}
      </section>
      <section class="card">
        <div class="card__hd"><div><h3 class="card__h">Air handling units</h3><p class="card__s">Supply air against setpoint, filter pressure drop and fan vibration</p></div></div>
        <div class="tblw"><table class="tbl" id="uTbl"><caption class="vh">Air handling units at ${b.n}</caption><thead><tr><th scope="col">Unit</th><th scope="col">Serves</th><th scope="col">Supply air</th><th scope="col">Filter ΔP</th><th scope="col">Vibration</th><th scope="col">Status</th></tr></thead>
        <tbody>${b.units.map(u => unitRow(b, u)).join("")}</tbody></table></div>
      </section>`;
    bindTrend(b);
  }
  // live refresh: only the numbers change, so focus and hover survive
  function plantLive() {
    const b = LIVE[bSel]; if (!b || current !== "plant") return;
    $$("[data-pv]").forEach(el => {
      const k = el.dataset.pv, p = b.now;
      el.textContent = { "Cooling load": Math.round(p.load), "Plant power": Math.round(p.kw), Efficiency: f2(p.eff), "Chilled water out": f1(p.chws), "Chilled water back": f1(p.chwr), "ΔT": f1(p.dt) }[k];
    });
    b.units.forEach(u => {
      const s = $(`[data-u="${u.tag}:sat"]`); if (s) s.firstChild.textContent = `${f1(u.sat)} `;
      const d = $(`[data-u="${u.tag}:dp"]`); if (d) d.textContent = `${Math.round(u.dp)} Pa`;
      const v = $(`[data-u="${u.tag}:vib"]`); if (v) v.firstChild.textContent = `${f1(u.vib)} `;
    });
  }

  /* =====================================================================
     L03 FAULTS (alarms and calls)
     ===================================================================== */
  let alTab = "open";
  const ago = h => { const m = Math.max(0, Math.round((nowH() - h) * 60)); return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${pad(m % 60)} min`; };
  const RESP = { 1: 2, 2: 4 };
  function respond(c) {
    if (!RESP[c.p]) return "Next working day";
    const due = c.at + RESP[c.p];
    if (c.job) { const j = JOBS.find(x => x.id === c.job); return j.s <= due ? `On time · crew at ${hm(j.s)}` : `<span class="late">Late · crew at ${hm(j.s)}, due ${hm(due)}</span>`; }
    return nowH() > due ? `<span class="late">Overdue since ${hm(due)}</span>` : `Respond by ${hm(due)}`;
  }
  function alarmsView() {
    const all = [...ALARMS.values()].sort((a, b) => a.p - b.p || a.since - b.since);
    const rows = all.filter(a => alTab === "all" || (alTab === "open" ? a.status === "new" : alTab === "raised" ? a.status === "raised" : a.status === "cleared"));
    $("#alS").textContent = `${all.filter(a => a.status === "new").length} need a call · ${all.filter(a => a.status === "raised").length} with a call · ${all.filter(a => a.status === "cleared").length} cleared today`;
    $("#alTbl").innerHTML = `<caption class="vh">Alarms</caption><thead><tr><th scope="col">P</th><th scope="col">Building and unit</th><th scope="col">Reading</th><th scope="col">Since</th><th scope="col">Next step</th></tr></thead><tbody>${rows.map(a => {
      const b = bOf(a.b);
      return `<tr><td>${pri(a.p)}</td><td><b>${b.n}</b><span class="sub">${a.tag === "plant" ? "Chiller plant" : `<button class="lnk" type="button" data-unit="${b.id}:${a.tag}">${a.tag}</button> · ${b.units.find(u => u.tag === a.tag).zone}`} · ${a.issue}</span></td>
        <td><b class="mono-v">${a.read}</b><span class="sub">${a.lim}</span></td><td class="nw">${hm(a.since)}<span class="sub">${a.status === "cleared" ? `cleared ${hm(a.cleared)}` : ago(a.since)}</span></td>
        <td>${a.status === "cleared" ? tag("Cleared", "tag--ok") : alarmCell(a)}</td></tr>`;
    }).join("") || `<tr><td colspan="5" class="empty">Nothing here.</td></tr>`}</tbody>`;
    $("#clS").textContent = `${CALLS.length} today · response targets P1 2 h, P2 4 h, P3 next working day`;
    $("#clTbl").innerHTML = `<caption class="vh">Calls</caption><thead><tr><th scope="col">Call</th><th scope="col">Site</th><th scope="col">Status</th><th scope="col">Response</th></tr></thead><tbody>${CALLS.map(c => `
      <tr><td class="nw"><code>${c.id}</code><span class="sub">${pri(c.p)} ${c.src === "alarm" ? "from alarm" : "phoned in"}</span></td><td><b>${esc(c.site)}</b><span class="sub">${esc(c.unit)} · ${esc(c.issue)}</span></td>
      <td>${c.status === "To schedule" ? `<button class="lnk" type="button" data-callgo="${c.id}">To schedule</button>` : c.job ? `<button class="lnk" type="button" data-job="${c.job}">${c.status} · ${crew(JOBS.find(j => j.id === c.job).c).n}</button>` : c.status}</td>
      <td>${c.status === "Done" ? tag("Done", "tag--ok") : respond(c)}</td></tr>`).join("")}</tbody>`;
  }
  tabs($("#alTabs"), [["open", "Need a call"], ["raised", "Call raised"], ["cleared", "Cleared"], ["all", "All"]], alTab, k => { alTab = k; alarmsView(); });
  $("#siteList").innerHTML = B.map(b => `<option value="${esc(b.n)}">`).join("");
  $("#callForm").addEventListener("submit", e => {
    e.preventDefault();
    const f = e.target, site = f.site.value.trim(), u = f.unit.value.trim().toUpperCase(), d = f.d.value.trim(), p = +f.p.value;
    const miss = [!site && "site", !u && "unit tag", !d && "what the caller said"].filter(Boolean);
    $("#callErr").textContent = miss.length ? `Add the ${miss.join(", ")}.` : "";
    if (miss.length) { f[!site ? "site" : !u ? "unit" : "d"].focus(); return; }
    const b = bByName(site);
    const c = { id: `C-${++callNo}`, src: "phone", b: b ? b.id : null, site, reg: b ? b.reg : "c", unit: u, issue: d, read: "Phoned in", p, at: nowH(), dur: p === 1 ? 2 : 1.5, skill: /^AHU/.test(u) ? "AHU" : "DX", status: "To schedule", job: null };
    CALLS.unshift(c); f.reset(); log("Call", `${c.id} phoned in · ${site} ${u}: ${d}`); render(); paintFloors();
    toast(`${c.id} for ${site} is waiting in Dispatch`);
  });

  /* =====================================================================
     L03 DISPATCH: pool -> crew, with skills, clashes and travel
     ===================================================================== */
  function pool() {
    return [
      ...CALLS.filter(c => c.status === "To schedule").map(c => ({ id: c.id, kind: "call", t: "flt", site: c.site, reg: c.reg, unit: c.unit, what: `${c.unit} · ${c.issue}`, read: c.read, p: c.p, dur: c.dur, skill: c.skill, call: c })),
      ...VISITS.filter(v => !v.booked).map(v => ({ id: v.id, kind: "visit", t: v.t, site: v.site, reg: v.reg, what: v.what, dur: v.dur, skill: v.skill, p: 9, visit: v }))
    ].sort((a, b) => a.p - b.p);
  }
  const lane = cid => JOBS.filter(j => j.c === cid).sort((a, b) => a.s - b.s);
  function fits(cid, s, dur, reg) {
    if (s < q15(nowH()) || s + dur > 18) return false;
    return lane(cid).every(j => s + dur + travel(reg, j.reg) <= j.s || s >= j.e + travel(j.reg, reg));
  }
  function earliest(cid, from, dur, reg) {
    for (let s = Math.max(q15(nowH()), q15(from)); s + dur <= 18; s += .25) if (fits(cid, s, dur, reg)) return s;
    return null;
  }
  function suggestions(it) {
    return CREWS.filter(c => c.sk.includes(it.skill)).map(c => {
      const s = earliest(c.id, nowH(), it.dur, it.reg); if (s == null) return null;
      const prev = lane(c.id).filter(j => j.e <= s).pop();
      return { c, s, tr: prev ? travel(prev.reg, it.reg) : 0, from: prev ? REG[prev.reg] : null };
    }).filter(Boolean).sort((a, b) => a.s - b.s).slice(0, 3);
  }
  let poolSel = null, freshJob = null;
  function book(it, cid, s) {
    const j = { id: `J${++jobNo}`, c: cid, t: it.t, s, e: s + it.dur, site: it.site, reg: it.reg, what: it.what, b: it.call ? it.call.b : it.visit.b };
    if (it.call) { j.call = it.call.id; it.call.job = j.id; it.call.status = "Booked"; }
    else it.visit.booked = true;
    JOBS.push(j); freshJob = j.id; poolSel = null;
    log("Dispatch", `${it.call ? it.call.id : it.what.split(" · ")[0]} · ${it.site} booked on ${crew(cid).n}, ${hm(s)}–${hm(s + it.dur)}`);
    if (it.call && it.call.alarm) fold("mtc", (nowH() - ALARMS.get(it.call.alarm).since) * 60);
    render(); paintFloors();
    toast(`${it.site} booked on ${crew(cid).n}, ${hm(s)}–${hm(s + it.dur)}`);
  }
  function dispatchView() {
    const items = pool();
    $("#poolS").textContent = items.length ? `${items.filter(i => i.kind === "call").length} calls · ${items.filter(i => i.kind === "visit").length} visits due` : "All caught up";
    $("#pool").innerHTML = items.length ? items.map(it => {
      const open = poolSel === it.id, sug = open ? suggestions(it) : [];
      return `<li class="pc${open ? " open" : ""}${it.kind === "call" ? " pc--call" : ""}" data-pool="${it.id}">
        <button class="pc__b" type="button" aria-expanded="${open}">
          <span class="pc__top">${it.kind === "call" ? pri(it.p) : tag("Visit due", "tag--cool")}<span class="pc__sk">${it.skill} · ${it.dur} h · ${REG[it.reg]}</span></span>
          <b>${esc(it.site)}</b><span class="sub">${esc(it.what)}</span>${it.kind === "call" ? `<span class="pc__read">${esc(it.read)}</span>` : ""}
        </button>
        ${open ? `<div class="sug"><p class="mono">Best slots · needs ${SK[it.skill]}</p>${sug.length ? sug.map(x => `<button class="sug__b" type="button" data-book="${it.id}" data-c="${x.c.id}" data-s="${x.s}"><b>${x.c.n} · ${hm(x.s)}</b><span>${x.from ? `${Math.round(x.tr * 60)} min from ${x.from}` : "First job of the day"}</span></button>`).join("") : `<p class="sub">No crew with ${SK[it.skill]} is free before 18:00.</p>`}</div>` : ""}
      </li>`;
    }).join("") : `<li class="pool__none">Nothing waiting. Every call and due visit is on a crew.</li>`;
    lanes();
  }
  function lanes() {
    const h = nowH();
    $("#hours").innerHTML = Array.from({ length: 10 }, (_, i) => `<span>${pad(8 + i)}:00</span>`).join("");
    $("#lanesBody").innerHTML = CREWS.map(c => {
      const js = lane(c.id), booked = js.reduce((t, j) => t + (j.e - j.s), 0);
      let trv = "";
      js.forEach((j, i) => { const p = js[i - 1]; if (p && p.reg !== j.reg) { const t = travel(p.reg, j.reg); trv += `<i class="trv" style="--s:${(j.s - t - 8) / 10};--w:${t / 10}" title="${Math.round(t * 60)} min travel from ${REG[p.reg]}"></i>`; } });
      return `<div class="lane" data-lane="${c.id}" style="--p:${P(h)}">
        <div class="lane__lbl"><b>${c.n}</b><span>${c.sk.join(" · ")} · ${booked} h booked</span></div>${trv}
        ${js.map(j => {
          const st = jobState(j);
          return `<button class="job ${TYPES[j.t].c} ${st}${freshJob === j.id ? " new" : ""}" type="button" data-job="${j.id}" style="--s:${(j.s - 8) / 10};--w:${(j.e - j.s) / 10}"
            aria-label="${esc(j.site)}, ${TYPES[j.t].n}, ${hm(j.s)} to ${hm(j.e)}${st === "done" ? ", done" : st === "live" ? ", on site now" : st === "over" ? ", running over" : ""}"><b>${esc(j.site)}</b><span>${hm(j.s)}–${hm(j.e)} · ${esc(j.what)}</span></button>`;
        }).join("")}</div>`;
    }).join("");
    $("#dispS").textContent = `08:00 to 18:00 · now ${hm(h)} · travel shown between regions`;
    freshJob = null;
  }
  $("#lanes").addEventListener("scroll", e => $(".lanes__in").style.setProperty("--sx", e.target.scrollLeft + "px"), { passive: true });
  const scrollNow = () => { const L = $("#lanes"); if (L.offsetParent && L.scrollWidth > L.clientWidth) L.scrollLeft = Math.max(0, P(nowH()) * (L.scrollWidth - 168) - L.clientWidth / 2 + 168); };
  $("#pool").addEventListener("click", e => {
    const bk = e.target.closest("[data-book]");
    if (bk) { const it = pool().find(i => i.id === bk.dataset.book); return book(it, bk.dataset.c, +bk.dataset.s); }
    const b = e.target.closest(".pc__b"); if (!b || dragMoved) return;
    const id = b.closest("[data-pool]").dataset.pool; poolSel = poolSel === id ? null : id; dispatchView();
    const nb = $(`[data-pool="${id}"] .pc__b`); nb && nb.focus();
  });

  // drag a pool card onto a lane
  const ghost = $("#ghost");
  let drag = null, dragMoved = false;
  $("#pool").addEventListener("pointerdown", e => {
    const card = e.target.closest(".pc__b"); if (!card || e.button !== 0) return;
    const it = pool().find(i => i.id === card.closest("[data-pool]").dataset.pool);
    drag = { it, x: e.clientX, y: e.clientY, on: false }; dragMoved = false;
  });
  addEventListener("pointermove", e => {
    if (!drag) return;
    if (!drag.on && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 6) {
      drag.on = dragMoved = true; ghost.hidden = false; document.body.classList.add("dragging");
      ghost.innerHTML = `<b>${esc(drag.it.site)}</b><span>${drag.it.dur} h · needs ${drag.it.skill}</span>`;
    }
    if (!drag.on) return;
    e.preventDefault();
    ghost.style.transform = `translate(${e.clientX + 12}px,${e.clientY + 12}px)`;
    $$(".lane").forEach(l => l.classList.remove("over", "nope"));
    const ln = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-lane]");
    if (ln) {
      const ok = crew(ln.dataset.lane).sk.includes(drag.it.skill);
      ln.classList.add(ok ? "over" : "nope");
      const r = $(".lanes__body").getBoundingClientRect();
      const s = Math.round((8 + ((e.clientX - r.left) / (r.width)) * 10) * 4) / 4;
      ghost.querySelector("span").textContent = ok ? `Drop at about ${hm(Math.max(8, s))}` : `${crew(ln.dataset.lane).n} can't do ${SK[drag.it.skill].toLowerCase()}`;
      drag.lane = ln.dataset.lane; drag.s = s; drag.ok = ok;
    } else drag.lane = null;
  }, { passive: false });
  addEventListener("pointercancel", () => { if (drag) { drag = null; ghost.hidden = true; document.body.classList.remove("dragging"); $$(".lane").forEach(l => l.classList.remove("over", "nope")); } });
  addEventListener("pointerup", () => {
    if (!drag) return;
    const d = drag; drag = null; ghost.hidden = true; document.body.classList.remove("dragging");
    $$(".lane").forEach(l => l.classList.remove("over", "nope"));
    if (!d.on || !d.lane) return setTimeout(() => (dragMoved = false), 0);
    setTimeout(() => (dragMoved = false), 0);
    if (!d.ok) return toast(`${crew(d.lane).n} doesn't have ${SK[d.it.skill].toLowerCase()} on the crew`);
    const s = earliest(d.lane, Math.max(d.s, 8), d.it.dur, d.it.reg);
    if (s == null) return toast(`${crew(d.lane).n} has no room for ${d.it.dur} h before 18:00`);
    book(d.it, d.lane, s);
    if (Math.abs(s - d.s) > .2) toast(`Moved to ${hm(s)} on ${crew(d.lane).n} to clear other jobs and travel`);
  });

  /* =====================================================================
     L04 BUILDINGS: contracts + equipment register
     ===================================================================== */
  let ctSel = 0;
  const planned = b => Array.from({ length: b.plan }, (_, k) => (b.start + Math.round((k * 12) / b.plan)) % 12).sort((a, c) => a - c);
  function ring(b) {
    const ms = planned(b), done = ms.slice(0, b.done), nxt = ms[b.done];
    const C = 80, R1 = 76, R0 = 56; let s = "";
    MONTHS.forEach((m, i) => {
      const a0 = (i / 12) * 2 * Math.PI + .03, a1 = ((i + 1) / 12) * 2 * Math.PI - .03;
      const pt = (r, a) => `${(C + r * Math.sin(a)).toFixed(1)} ${(C - r * Math.cos(a)).toFixed(1)}`;
      const cls = done.includes(i) ? "on" : i === nxt ? "next" : ms.includes(i) ? "plan" : "";
      const lx = (C + 66 * Math.sin((a0 + a1) / 2)).toFixed(1), ly = (C - 66 * Math.cos((a0 + a1) / 2)).toFixed(1);
      s += `<path class="bseg ${cls}" d="M${pt(R1, a0)}A${R1} ${R1} 0 0 1 ${pt(R1, a1)}L${pt(R0, a1)}A${R0} ${R0} 0 0 0 ${pt(R0, a0)}Z"/><text class="blab ${cls}" x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="central">${m[0]}</text>`;
    });
    return `<div class="bring"><svg viewBox="0 0 160 160" role="img" aria-label="${b.plan} visits a year in ${ms.map(i => MONTHS[i]).join(", ")}. ${b.done} done.">${s}</svg><div class="bring__m"><b>${b.done}/${b.plan}</b><span>visits</span></div></div>`;
  }
  function buildingsView() {
    $("#ctS").textContent = `${B.length} shown · ${LIVE.length} linked to a BMS · Sentron services 26 condominiums in all`;
    mlist($("#ctList"), B, ctSel, b => `<span class="mi__n">${b.n}</span><span class="mi__s">${b.sec} · ${b.units.length} ${live(b) ? "AHUs" : "fan coils"} · ${b.plan} visits a year</span><span class="mi__r">${live(b) ? tag("Live", "tag--cool") : tag("Visits")}</span>`, (i, click) => { ctSel = i; buildingsView(); click && jump("#ctDet"); });
    const b = B[ctSel], ms = planned(b);
    const calls = CALLS.filter(c => c.b === b.id), reps = REPORTS.filter(r => r.b === b.id);
    $("#ctDet").setAttribute("aria-labelledby", "ctDh");
    $("#ctDet").innerHTML = `
      <section class="card">
        <p class="mono top__k">${b.sec} · ${REG[b.reg]} · ${live(b) ? "BMS linked" : "Not monitored, problems come in by phone"}</p><h2 class="det__h" id="ctDh">${b.n}</h2>
        <div class="det__grid">${ring(b)}
          <dl class="dr__dl dr__dl--3"><div><dt>Plan</dt><dd>${b.plan} visits a year</dd></div><div><dt>Visit months</dt><dd>${ms.map(i => MONTHS[i]).join(" ")}</dd></div><div><dt>Renews</dt><dd>${b.renew}</dd></div>
            <div><dt>Equipment</dt><dd>${b.units.length} ${live(b) ? "AHUs + chiller plant" : "split units"}</dd></div><div><dt>Open calls</dt><dd>${calls.filter(c => c.status !== "Done").length}</dd></div><div><dt>Reports this month</dt><dd>${reps.length}</dd></div></dl>
        </div>
        ${live(b) ? `<div class="dr__acts" style="margin-top:14px"><button class="btn btn--line" type="button" data-plantgo="${b.id}">Open live plant</button></div>` : ""}
      </section>
      <section class="card">
        <div class="card__hd"><div><h3 class="card__h">Equipment register</h3><p class="card__s">Pick a unit for its readings and history</p></div></div>
        <div class="tblw"><table class="tbl"><caption class="vh">Equipment at ${b.n}</caption><thead><tr><th scope="col">Unit</th><th scope="col">Type</th><th scope="col">Serves</th><th scope="col">Last service</th><th scope="col">Filters</th><th scope="col">Now</th></tr></thead><tbody>${b.units.map(u => {
          const a = live(b) ? bAlarms(b).find(x => x.tag === u.tag) : null;
          return `<tr><td class="nw"><button class="lnk" type="button" data-unit="${b.id}:${u.tag}">${u.tag}</button></td><td>${u.kind}</td><td>${u.zone}</td><td class="nw">${u.hist.find(h => h.t === "Service" || h.t === "Call-out").d}</td><td class="nw">${u.hist.find(h => h.t === "Filters").d}</td>
          <td>${live(b) ? (a ? tag(a.issue, "tag--warm") : tag("Normal", "tag--ok")) : tag("Not monitored")}</td></tr>`;
        }).join("")}</tbody></table></div>
      </section>`;
  }

  /* =====================================================================
     L05 REPORTS: every report traced back to what started it
     ===================================================================== */
  let rpSel = 0;
  function reportsView() {
    $("#rpS").textContent = `${REPORTS.length} this week · ${REPORTS.filter(r => r.status !== "Signed").length} awaiting the site's signature`;
    rpSel = Math.min(rpSel, REPORTS.length - 1);
    mlist($("#rpList"), REPORTS, rpSel, r => `<span class="mi__n">${r.no} · ${esc(r.site)}</span><span class="mi__s">${r.kind} · ${r.unit} · ${r.date}</span><span class="mi__r">${tag(r.status === "Signed" ? "Signed" : "To sign", r.status === "Signed" ? "tag--ok" : "tag--warm")}</span>`, (i, click) => { rpSel = i; reportsView(); click && jump("#rpDet"); });
    const r = REPORTS[rpSel], steps = ["Reading", "Alarm", "Call", "Visit", "Report"];
    $("#rpDet").setAttribute("aria-labelledby", "rpDh");
    $("#rpDet").innerHTML = `<p class="mono top__k">${r.kind} · ${r.crew} · ${r.date}</p><h2 class="det__h" id="rpDh">${r.no} · ${esc(r.site)}</h2>
      <p class="mono" style="color:var(--mute);margin-bottom:12px">How this report came about</p>
      <ol class="chain">${steps.map(st => { const c = r.chain.find(x => x[0] === st); return `<li class="${c ? "on" : "na"}"><span class="chain__k">${st}</span>${c ? `<b>${esc(c[2])}</b><span class="sub">${c[1]}</span>` : `<span class="sub">${r.kind !== "Call-out" ? "Routine visit, planned in the contract" : st === "Reading" || st === "Alarm" ? "Not monitored · started with a phone call" : ""}</span>`}</li>`; }).join("")}</ol>
      ${r.checks ? `<p class="mono" style="color:var(--mute);margin:20px 0 8px">Checklist</p><ul class="scope">${r.checks.map(x => `<li>✓ ${x}</li>`).join("")}</ul>` : ""}
      <div class="dr__acts" style="margin-top:20px">${r.status === "Signed" ? `<button class="btn" type="button" data-toast="Prototype: report PDFs aren't attached">Open PDF</button>` : `<button class="btn btn--cool" type="button" data-sign="${r.no}">Mark signed by site</button>`}
        ${r.b && bOf(r.b).units.some(u => u.tag === r.unit) ? `<button class="btn btn--line" type="button" data-unit="${r.b}:${r.unit}">${live(bOf(r.b)) ? `See ${r.unit} now` : `${r.unit} history`}</button>` : ""}</div>`;
  }

  /* =====================================================================
     DRAWER: job (complete the visit) and unit (readings + history)
     ===================================================================== */
  const drawer = $("#drawer"), scrim = $("#scrim");
  let lastFocus;
  const CHECK = { svc: ["Filters washed or changed", "Coil and fins checked", "Drain tray cleared", "Readings logged"], cln: ["Chemical applied to coil", "Ten-minute condensation cycle", "Tray emptied, drain flushed", "Steam rinse"], flt: ["Fault found", "Part replaced or repaired", "Unit re-tested, reading back in range", "Site briefed"], ins: ["Permit to work", "Units hung and levelled", "Day log submitted"], smk: ["Fans run on fire mode", "Dampers cycled", "Witness signed"] };
  function openDrawer(html) {
    lastFocus = document.activeElement; $("#drBody").innerHTML = html;
    drawer.hidden = scrim.hidden = false;
    requestAnimationFrame(() => { drawer.classList.add("on"); scrim.classList.add("on"); $(".drawer__x").focus(); });
  }
  function closeDrawer() {
    if (drawer.hidden) return;
    drawer.classList.remove("on"); scrim.classList.remove("on");
    setTimeout(() => (drawer.hidden = scrim.hidden = true), RM ? 0 : 400);
    lastFocus && document.contains(lastFocus) && lastFocus.focus();
  }
  function openJob(id) {
    const j = JOBS.find(x => x.id === id), c = crew(j.c), st = jobState(j), call = j.call && CALLS.find(x => x.id === j.call);
    const canDo = (j.t === "flt" || j.t === "svc" || j.t === "cln") && !j.done && j.b;
    openDrawer(`<span class="dr__tag ${TYPES[j.t].c}">${TYPES[j.t].n}</span><h2 class="dr__h" id="drH">${esc(j.site)}</h2><p class="dr__s">${esc(j.what)}</p>
      ${call ? `<div class="dr__why"><p class="mono">Why we're going</p><b>${esc(call.read)}</b><span class="sub">${call.id} · ${call.src === "alarm" ? `alarm raised ${hm(call.at)}` : `phoned in ${hm(call.at)}`}</span></div>` : ""}
      <dl class="dr__dl"><div><dt>Crew</dt><dd>${c.n} · ${c.size}</dd></div><div><dt>Status</dt><dd>${j.done ? "Done" : st === "live" ? "On site" : st === "over" ? "Running over" : st === "done" ? "Done" : "Booked"}</dd></div>
        <div><dt>Window</dt><dd>${hm(j.s)}–${hm(j.e)}</dd></div><div><dt>Region</dt><dd>${REG[j.reg]}</dd></div></dl>
      ${canDo && st === "" ? `<p class="dr__s" style="margin-bottom:12px">Booked for ${hm(j.s)}. The checklist opens when the crew checks in on site.</p>
        <div class="dr__acts"><button class="btn btn--cool" type="button" data-checkin="${j.id}">Check crew in now (demo)</button><a class="btn btn--line" href="tel:+6564592141">Call ${c.n}</a></div>`
      : canDo ? `<p class="mono" style="color:var(--mute);margin-bottom:8px">Checklist</p><div class="dr__ck" id="ck">${CHECK[j.t].map(x => `<label><input type="checkbox">${x}</label>`).join("")}</div>
        <div class="dr__acts"><button class="btn btn--cool" type="button" data-complete="${j.id}" disabled>Complete visit and file report</button></div><p class="sub" id="ckHint" style="margin-top:8px">Tick every item to complete. ${j.t === "flt" ? "The alarm clears when the reading is back in range." : ""}</p>`
        : `<div class="dr__acts"><a class="btn" href="tel:+6564592141">Call ${c.n}</a></div>`}`);
  }
  function openUnit(key) {
    const [bid, tg] = key.split(":"), b = bOf(bid), u = b.units.find(x => x.tag === tg);
    if (!u) return;
    const al = live(b) ? bAlarms(b).filter(a => a.tag === tg) : [];
    openDrawer(`<span class="dr__tag ${live(b) ? "t-svc" : ""}">${u.kind}</span><h2 class="dr__h" id="drH">${u.tag} · ${u.zone}</h2><p class="dr__s">${b.n}</p>
      ${live(b) ? `<dl class="dr__dl"><div class="${u.sat > u.sp + LIM.satOver ? "bad" : ""}"><dt>Supply air</dt><dd>${f1(u.sat)} °C · setpoint ${u.sp}</dd></div><div class="${u.dp > LIM.dp ? "bad" : ""}"><dt>Filter ΔP</dt><dd>${Math.round(u.dp)} Pa · limit ${LIM.dp}</dd></div><div class="${u.vib > LIM.vib ? "bad" : ""}"><dt>Fan vibration</dt><dd>${f1(u.vib)} mm/s · limit ${LIM.vib}</dd></div><div><dt>Alarm</dt><dd>${al.length ? al.map(a => a.issue).join(", ") : "None"}</dd></div></dl>
        ${al.map(a => `<div class="dr__acts" style="margin-bottom:16px">${alarmCell(a)}</div>`).join("")}` : `<p class="dr__s" style="margin:12px 0 16px">Not linked to a BMS. Readings are logged on each visit.</p>`}
      <p class="mono" style="color:var(--mute);margin-bottom:10px">History</p>
      <ol class="vlog">${u.hist.map(h => `<li><b>${h.d} · ${h.t}</b><span>${esc(h.x)}</span></li>`).join("")}</ol>`);
  }
  // completing a visit closes the loop
  function complete(id) {
    const j = JOBS.find(x => x.id === id); if (!j || j.done) return;
    const h = nowH(); j.done = true;
    const c = crew(j.c), call = j.call && CALLS.find(x => x.id === j.call), b = bOf(j.b);
    const no = `R-${++repNo}`, chain = [];
    let unitTag = call ? call.unit : "All units";
    if (call) {
      call.status = "Done";
      if (call.alarm) {
        const a = ALARMS.get(call.alarm);
        chain.push(["Reading", `Today ${hm(a.since)}`, `${a.read} · ${a.lim}`], ["Alarm", `Today ${hm(a.since)}`, `P${a.p} · ${a.issue}`]);
        // fix the cause, so the reading falls back in range
        fold("mtr", h - a.since);
        if (a.tag === "plant") Object.assign(b, { eff: .63, dt: 5.5 });
        else { const u = b.units.find(x => x.tag === a.tag); Object.assign(u.base, a.kind === "sat" ? { sat: u.sp + .1 } : a.kind === "dp" ? { dp: 150 } : { vib: 1.8 }); }
      }
      chain.push(["Call", `Today ${hm(call.at)}`, `${call.id} · ${call.src === "alarm" ? "raised by the ops desk" : `phoned in: ${call.issue}`}`]);
    }
    chain.push(["Visit", j.inAt != null ? `Today, checked in ${hm(j.inAt)} · booked ${hm(j.s)}` : `Today ${hm(j.s)}–${hm(j.e)}`, `${c.n} · ${j.what}`], ["Report", `Today ${hm(h)}`, "Filed from site, waiting for signature"]);
    const u = b && b.units.find(x => x.tag === unitTag);
    if (u) u.hist.unshift({ d: dstr(0), t: call ? "Call-out" : "Service", x: `${j.what} · ${c.n} · ${no}` });
    else if (b) b.units.forEach(x => x.hist.unshift({ d: dstr(0), t: "Service", x: `Routine servicing · ${c.n} · ${no}` }));
    REPORTS.unshift({ no, b: j.b, site: j.site, unit: unitTag, kind: call ? "Call-out" : TYPES[j.t].n, date: "Today", crew: c.n, status: "Awaiting signature", chain, checks: CHECK[j.t] });
    MET[0].hist[11]++;
    log("Report", `${no} filed from site · ${j.site} · ${c.n}`);
    tick(); evaluate(); closeDrawer(); render(); paintFloors();
    toast(`${no} filed for ${j.site}${call && call.alarm ? ". Alarm cleared." : ""}`);
  }

  /* ---------- global clicks ---------- */
  document.addEventListener("click", e => {
    const t = e.target;
    const r = t.closest("[data-raise]"); if (r) { const c = raise(r.dataset.raise); log("Call", `${c.id} raised for ${c.site} · ${c.unit}`); render(); paintFloors(); return toast(`${c.id} raised for ${c.site} · waiting in Dispatch`); }
    const cg = t.closest("[data-callgo]"); if (cg) { const c = CALLS.find(x => x.id === cg.dataset.callgo); closeDrawer(); if (c.status === "To schedule") { poolSel = c.id; go("dispatch"); render(); } else if (c.job) openJob(c.job); return; }
    const jb = t.closest("[data-job]"); if (jb) return openJob(jb.dataset.job);
    const un = t.closest("[data-unit]"); if (un) return openUnit(un.dataset.unit);
    const cq = t.closest("[data-ctgo]"); if (cq) { ctSel = +cq.dataset.ctgo; go("buildings"); render(); return; }
    const pg = t.closest("[data-plantgo]"); if (pg) { bSel = LIVE.findIndex(b => b.id === pg.dataset.plantgo); go("plant"); render(); return; }
    const ci = t.closest("[data-checkin]");
    if (ci) { const j = JOBS.find(x => x.id === ci.dataset.checkin); j.inAt = nowH(); log("Visit", `${crew(j.c).n} checked in on site · ${j.site}`); render(); return openJob(j.id); }
    const cp = t.closest("[data-complete]"); if (cp) return complete(cp.dataset.complete);
    const sg = t.closest("[data-sign]"); if (sg) { REPORTS.find(x => x.no === sg.dataset.sign).status = "Signed"; log("Report", `${sg.dataset.sign} signed by the client`); render(); return toast(`${sg.dataset.sign} marked as signed`); }
    const ts = t.closest("[data-toast]"); if (ts) return toast(ts.dataset.toast);
    if (t.closest("[data-close]") || t === scrim) closeDrawer();
  });
  document.addEventListener("change", e => {
    if (!e.target.closest("#ck")) return;
    const all = $$("#ck input"), done = all.every(i => i.checked), btn = $("[data-complete]");
    btn.disabled = !done; $("#ckHint").textContent = done ? "Ready to file." : `${all.filter(i => i.checked).length} of ${all.length} ticked.`;
  });
  addEventListener("keydown", e => {
    if (drawer.hidden) return;
    if (e.key === "Escape") closeDrawer();
    if (e.key === "Tab") {
      const f = $$("a,button:not([disabled]),input", drawer), a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
  });

  /* =====================================================================
     L01 OVERVIEW: delivery against target bands, alarms today, live events
     ===================================================================== */
  // weekly delivery metrics, oldest first (SAMPLE history). This week's point also takes in what happens in this session.
  const MET = [
    { id: "vis", n: "Visits completed", u: "this week", up: true, d: 0, hist: [41, 44, 43, 46, 45, 48, 47, 50, 49, 52, 51, 54], tiers: [50, 40, 30], tgt: 50, how: "Servicing, cleaning and call-outs closed with a report" },
    { id: "mtc", n: "Alarm to crew", u: "min, median", d: 0, hist: [64, 61, 58, 57, 52, 55, 49, 46, 44, 42, 40, 38], tiers: [30, 60, 120], tgt: 30, how: "From the alarm to a crew booked on it" },
    { id: "rep", n: "Repeat faults", u: "% of call-outs", d: 1, hist: [9.8, 9.1, 9.4, 8.7, 8.2, 8.5, 7.6, 7.4, 7.1, 6.8, 6.6, 6.2], tiers: [5, 10, 15], tgt: 5, how: "Same unit back with the same fault within 30 days" },
    { id: "mtr", n: "Time to restore", u: "h, median", d: 1, hist: [5.6, 5.2, 5.4, 4.9, 4.6, 4.8, 4.1, 4.0, 3.8, 3.7, 3.5, 3.4], tiers: [2, 4, 8], tgt: 2, how: "From the alarm to the reading back in range" }
  ];
  const TN = ["Elite", "High", "Medium", "Low"];
  const fmtM = (m, v) => (m.d ? v.toFixed(m.d) : String(Math.round(v)));
  const tierOf = (m, v) => { const i = m.tiers.findIndex(t => (m.up ? v >= t : v < t)); return TN[i < 0 ? 3 : i]; };
  // fold one new case into this week's median (about 20 cases a week)
  function fold(id, x) { const m = MET.find(k => k.id === id); m.hist[11] = (m.hist[11] * 20 + x) / 21; }
  const H0 = nowH();
  let lastRead = Date.now(), beatI = 0;
  const beat = b => `${b.short} · ${b.units.length} AHUs and plant read · ${f2(b.now.eff)} kW/RT, ΔT ${f1(b.now.dt)} °C`;
  const dur = h => (h < 1 ? `${Math.round(h * 60)} min` : `${Math.floor(h)} h ${pad(Math.round((h % 1) * 60))} min`);

  // shared hover: crosshair, dot, band and a tooltip that stays inside the chart
  const CH = {};
  function hover(box, d) {
    if (!box || !d) return;
    const svg = $("svg", box), tip = $(".tip", box), xh = $(".xh", box), xd = $(".xd", box), hl = $(".hl", box);
    svg.addEventListener("pointermove", e => {
      const r = svg.getBoundingClientRect(), vx = ((e.clientX - r.left) / r.width) * d.W;
      let i = 0; d.pts.forEach((p, k) => { if (Math.abs(p[0] - vx) < Math.abs(d.pts[i][0] - vx)) i = k; });
      const [cx, cy, label] = d.pts[i];
      if (xh) { xh.setAttribute("x1", cx); xh.setAttribute("x2", cx); xh.removeAttribute("hidden"); }
      if (xd) { xd.setAttribute("cx", cx); xd.setAttribute("cy", cy); xd.removeAttribute("hidden"); }
      if (hl) { hl.setAttribute("x", cx - d.bw / 2); hl.classList.add("on"); }
      tip.hidden = false; tip.textContent = label;
      const half = tip.offsetWidth / 2, px = (cx / d.W) * r.width;
      tip.style.left = `${Math.max(half, Math.min(r.width - half, px))}px`; tip.style.top = `${(cy / d.H) * r.height}px`;
    });
    svg.addEventListener("pointerleave", () => { tip.hidden = true; xh && xh.setAttribute("hidden", ""); xd && xd.setAttribute("hidden", ""); hl && hl.classList.remove("on"); });
  }

  // status bar
  function sbar() {
    const act = [...ALARMS.values()].filter(a => a.status !== "cleared"), nw = act.filter(a => a.status === "new").length;
    const site = new Set(JOBS.filter(j => jobState(j) === "live" || jobState(j) === "over").map(j => j.c)).size;
    const pts = LIVE.reduce((t, b) => t + b.units.length * 3 + 6, 0);
    $("#sbar").innerHTML = `<span class="sbar__live"><i></i>Live</span><span>BMS links <b>${LIVE.length}/${LIVE.length}</b> online</span><span><b>${pts}</b> points every 5 s</span><span class="${nw ? "warm" : ""}">Alarms open <b>${act.length}</b>${nw ? ` · ${nw} need a call` : ""}</span><span>To schedule <b>${pool().length}</b></span><span>Crews on site <b>${site}/${CREWS.length}</b></span><span class="sbar__ago" id="ago">Last reading ${Math.round((Date.now() - lastRead) / 1000)} s ago</span>`;
  }

  // the four delivery metrics
  function spark(m) {
    const W = 240, H = 64, L = 2, R = 2, T = 16, Bm = 4, all = [...m.hist, m.tgt];
    let lo = Math.min(...all), hi = Math.max(...all); const pd = (hi - lo) * .1; lo -= pd; hi += pd;
    const x = i => L + (i * (W - L - R)) / 11, y = v => T + (H - T - Bm) * (1 - (v - lo) / (hi - lo));
    const unit = m.id === "vis" ? "visits" : m.u.split(",")[0];
    const pts = m.hist.map((v, i) => [x(i), y(v), `${i === 11 ? "This week" : `${11 - i} wk ago`} · ${fmtM(m, v)} ${unit}`]);
    CH[m.id] = { W, H, pts };
    const ty = y(m.tgt);
    return `<div class="spark" id="sp-${m.id}"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${m.n}, last 12 weeks: ${m.hist.map(v => fmtM(m, v)).join(", ")}">
      <line class="sp-tg" x1="${L}" x2="${W - R}" y1="${ty}" y2="${ty}"/><text class="sp-tl" x="${L}" y="${ty - 5}">Elite ${m.up ? "≥" : "<"} ${m.tgt}</text>
      <polyline class="sp-ln" points="${pts.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ")}"/>
      <circle class="dot" cx="${pts[11][0]}" cy="${pts[11][1]}" r="4"/>
      <line class="xh" x1="0" x2="0" y1="4" y2="${H}" hidden/><circle class="xd" r="4" hidden/><rect class="hit" x="0" y="0" width="${W}" height="${H}"/></svg><div class="tip" hidden></div></div>`;
  }
  function kpis() {
    $("#kpis").innerHTML = MET.map(m => {
      const v = m.hist[11], d = v - m.hist[7], better = m.up ? d > 0 : d < 0, tr = tierOf(m, v);
      const flat = Math.abs(d) < (m.d ? .05 : .5);
      return `<article class="card kpi"><div class="kpi__hd"><h2 class="kpi__n">${m.n}</h2><span class="tier tier--${tr.toLowerCase()}" title="Sentron target band">${tr}</span></div>
        <p class="kpi__v"><b>${fmtM(m, v)}</b><span>${m.u}</span></p>
        <p class="kpi__d">${flat ? "Level with 4 weeks ago" : `<em class="${better ? "" : "worse"}">${d > 0 ? "▲" : "▼"} ${fmtM(m, Math.abs(d))}</em> vs 4 weeks ago · ${better ? "better" : "worse"}`}</p>
        ${spark(m)}<p class="kpi__how">${m.how}</p></article>`;
    }).join("");
    MET.forEach(m => hover($(`#sp-${m.id}`), CH[m.id]));
  }

  // alarms raised vs restored, last 24 h in 2-hour blocks: sample history plus every alarm in this console
  const AR = (() => {
    let prev = 1;
    return Array.from({ length: 12 }, (_, k) => {
      const s = H0 - 24 + k * 2, hod = ((s + 1) % 24 + 24) % 24, day = hod > 7 && hod < 20;
      const r = Math.round(rnd() * (day ? 3.2 : 1.3)), x = Math.round(prev * .8 + rnd() * .9);
      prev = r; return { s, e: s + 2, r, x };
    });
  })();
  const bk = t => Math.max(0, Math.min(11, Math.floor((t - (H0 - 24)) / 2)));
  const barP = (x, y0, w, h, c) => {
    if (h <= 0) return "";
    const r = Math.min(4, h, w / 2), t = y0 - h;
    return `<path class="${c}" d="M${x},${y0}V${t + r}Q${x},${t} ${x + r},${t}H${x + w - r}Q${x + w},${t} ${x + w},${t + r}V${y0}Z"/>`;
  };
  function arChart() {
    const box = $("#arChart"), d = AR.map(b => ({ ...b }));
    ALARMS.forEach(a => { d[bk(a.since)].r++; if (a.status === "cleared") d[bk(a.cleared)].x++; });
    const W = Math.max(300, Math.round(box.clientWidth || 720)), H = innerWidth > 640 ? 330 : 240, L = 28, R = 4, T = 12, Bm = 26;
    const top = Math.max(4, ...d.map(b => Math.max(b.r, b.x))), mx = top + (top % 2), step = mx > 6 ? 2 : 1;
    const bw = (W - L - R) / 12, w = Math.max(4, Math.min(16, (bw - 12) / 2)), y0 = H - Bm, sy = v => ((y0 - T) * v) / mx;
    let s = "";
    for (let v = 0; v <= mx; v += step) s += `<line class="gl" x1="${L}" x2="${W - R}" y1="${y0 - sy(v)}" y2="${y0 - sy(v)}"/><text class="ax" x="${L - 8}" y="${y0 - sy(v)}" text-anchor="end" dominant-baseline="central">${v}</text>`;
    s += `<rect class="hl" x="0" y="${T}" width="${bw}" height="${y0 - T}"/>`;
    const pts = [];
    d.forEach((b, k) => {
      const cx = L + bw * (k + .5);
      s += barP(cx - w - 1, y0, w, sy(b.r), "br-r") + barP(cx + 1, y0, w, sy(b.x), "br-s");
      if (k % 3 === 0 && (k < 9 || W > 420)) s += `<text class="ax" x="${L + bw * k}" y="${H - 6}">${hmd(b.s)}</text>`;
      pts.push([cx, y0 - sy(Math.max(b.r, b.x)), `${hmd(b.s)}–${k === 11 ? "now" : hmd(b.e)} · ${b.r} raised · ${b.x} restored`]);
    });
    s += `<text class="ax" x="${W - R}" y="${H - 6}" text-anchor="end">Now</text><line class="xh" x1="0" x2="0" y1="0" y2="0" hidden/><rect class="hit" x="${L}" y="0" width="${W - L - R}" height="${H}"/>`;
    const tr = d.reduce((t, b) => t + b.r, 0), tx = d.reduce((t, b) => t + b.x, 0);
    CH.ar = { W, H, pts, bw };
    box.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Alarms in the last 24 hours: ${tr} raised, ${tx} restored">${s}</svg><div class="tip" hidden></div>`;
    hover(box, CH.ar);
    $("#arLg").innerHTML = `<li><i style="background:var(--s-raised)"></i>Raised <b>${tr}</b></li><li><i style="background:var(--s-restored)"></i>Restored <b>${tx}</b></li>`;
    const act = [...ALARMS.values()].filter(a => a.status !== "cleared").sort((a, b) => a.since - b.since), old = act[0];
    $("#arFt").innerHTML = `<span><b>${act.length}</b>open now</span><span><b>${act.filter(a => a.status === "new").length}</b>waiting for a call</span>${old ? `<span>Oldest open: ${bOf(old.b).short} ${old.tag === "plant" ? "chiller plant" : old.tag}, ${dur(nowH() - old.since)}</span>` : "<span>Nothing open</span>"}`;
  }

  // live events
  const KIND = { BMS: "", Alarm: "tag--warm", Restored: "tag--ok", Call: "tag--cool", Dispatch: "tag--cool", Visit: "tag--cool", Report: "tag--ok" };
  let feedSeen = 0;
  function feedPaint() {
    const el = $("#feed");
    el.innerHTML = FEED.slice(0, 40).map(e => `<li class="ev${e.k === "BMS" ? " bms" : ""}${feedSeen && e.n > feedSeen && !RM ? " new" : ""}"><time>${hmd(e.h)}</time>${tag(e.k, KIND[e.k])}<p>${esc(e.t)}</p></li>`).join("");
    feedSeen = FEED[0] ? FEED[0].n : 0;
  }
  function onLog() { if (current === "overview") feedPaint(); }
  function seedFeed() {
    const ev = [];
    ALARMS.forEach(a => ev.push({ h: a.since, k: "Alarm", t: `${bOf(a.b).short} ${a.tag === "plant" ? "chiller plant" : a.tag} · ${a.read} · ${a.lim}` }));
    CALLS.forEach(c => ev.push({ h: c.at, k: "Call", t: c.src === "alarm" ? `${c.id} raised for ${c.site} · ${c.unit}` : `${c.id} phoned in · ${c.site} ${c.unit}: ${c.issue}` }));
    CALLS.filter(c => c.job).forEach(c => { const j = JOBS.find(x => x.id === c.job); ev.push({ h: c.at + .08, k: "Dispatch", t: `${c.id} · ${c.site} booked on ${crew(j.c).n}, ${hm(j.s)}–${hm(j.e)}` }); });
    JOBS.filter(j => j.s <= H0).forEach(j => ev.push({ h: j.s, k: "Visit", t: `${crew(j.c).n} on site · ${j.site}` }));
    JOBS.filter(j => j.e <= H0 && jobState(j) === "done").forEach(j => ev.push({ h: j.e, k: "Visit", t: `${crew(j.c).n} finished · ${j.site}` }));
    for (let m = 2; m >= 1; m--) ev.push({ h: H0 - (m * 30) / 3600, k: "BMS", t: beat(LIVE[m % LIVE.length]) });
    ev.filter(e => e.h <= H0).sort((a, b) => a.h - b.h).forEach(e => log(e.k, e.t, e.h));
  }

  // plant efficiency by building, bars from zero
  function effb() {
    const hi = 1, pc = v => Math.max(0, Math.min(100, (v / hi) * 100));
    $("#effb").innerHTML = LIVE.map(b => {
      const v = b.now.eff, bad = v > LIM.eff;
      return `<li class="${bad ? "bad" : ""}"><span>${b.short}</span><b>${f2(v)}${bad ? " · above limit" : ""}</b><span class="effb__t" aria-hidden="true"><i style="width:${pc(v)}%"></i><span class="lim" style="left:${pc(LIM.eff)}%"></span></span></li>`;
    }).join("");
    $("#effK").textContent = `Scale 0 to 1.0 kW/RT. The upright line marks the alarm limit, ${LIM.eff}.`;
  }

  // building status board
  function bState(b) {
    const al = live(b) ? bAlarms(b) : [], nw = al.filter(a => a.status === "new");
    const onSite = JOBS.find(j => j.b === b.id && (jobState(j) === "live" || jobState(j) === "over"));
    const calls = CALLS.filter(c => c.b === b.id && c.status !== "Done");
    if (nw.length) return ["alarm", `${nw.length} alarm${nw.length > 1 ? "s" : ""} · needs a call`];
    if (onSite) return ["site", `${crew(onSite.c).n} on site`];
    if (calls.length) return ["call", `${calls[0].id} ${calls[0].status === "Booked" ? "booked" : "to schedule"}`];
    return live(b) ? ["ok", "Normal · BMS live"] : ["dx", "Normal · visits only"];
  }
  function board() {
    const st = B.map(bState);
    $("#bdS").textContent = `${st.filter(x => x[0] === "alarm").length} need a call · ${st.filter(x => x[0] === "site").length} with a crew on site · ${B.length} under contract`;
    $("#board").innerHTML = B.map((b, i) => `<button class="bt ${st[i][0]}" type="button" ${live(b) ? `data-plantgo="${b.id}"` : `data-ctgo="${i}"`}><b>${esc(b.short || b.n.replace(/,.*$/, ""))}</b><span>${st[i][1]}</span></button>`).join("");
  }

  // crews now
  function crews() {
    const h = nowH(); let on = 0, hrs = 0;
    $("#crw").innerHTML = CREWS.map(c => {
      const js = JOBS.filter(j => j.c === c.id).sort((a, b) => a.s - b.s);
      const now = js.find(j => jobState(j) === "live" || jobState(j) === "over"), nx = js.find(j => !j.done && j.s > h && j !== now);
      const used = js.reduce((t, j) => t + (j.e - j.s), 0); hrs += used; if (now) on++;
      const st = now ? `On site · ${now.site}${jobState(now) === "over" ? " · running over" : ""}` : nx ? `${nx.s - h < .75 ? "Travelling to" : `Free until ${hm(nx.s)}, then`} ${nx.site}` : "Free for the rest of the day";
      const tg = now ? tag(TYPES[now.t].n, now.t === "flt" ? "tag--warm" : "tag--cool") : tag(nx ? "Between jobs" : "Free");
      const inner = `<span class="cr__n">${c.n} · ${c.size}</span>${tg}<span class="cr__s">${esc(st)}</span><span class="cr__u" title="${Math.round(used * 10)}% of the day booked"><i style="width:${Math.min(100, used * 10)}%"></i></span>`;
      return now ? `<button class="cr" type="button" data-job="${now.id}">${inner}</button>` : `<div class="cr">${inner}</div>`;
    }).join("");
    $("#crS").textContent = `${on} of ${CREWS.length} on site · ${Math.round((hrs / (CREWS.length * 10)) * 100)}% of crew hours booked`;
  }

  function controlView() { sbar(); kpis(); arChart(); feedPaint(); effb(); board(); crews(); }

  /* ---------- light / dark switch (saved per browser) ---------- */
  const meta = $('meta[name="theme-color"]');
  function theme(t, save) {
    document.documentElement.dataset.theme = t;
    $$("[data-theme-set]").forEach(b => b.setAttribute("aria-pressed", b.dataset.themeSet === t));
    meta.content = t === "light" ? "#f8fbfb" : "#060b0d";
    if (save) try { localStorage.setItem("sentron-theme", t); } catch (e) { /* private mode: still switches */ }
  }
  theme(document.documentElement.dataset.theme === "light" ? "light" : "dark", false); // a ?theme= link doesn't overwrite the saved choice
  $("#theme").addEventListener("click", e => { const b = e.target.closest("[data-theme-set]"); if (b) theme(b.dataset.themeSet, true); });

  /* ---------- render + clock ---------- */
  const dateF = new Intl.DateTimeFormat("en-SG", { timeZone: "Asia/Singapore", weekday: "short", day: "numeric", month: "short" });
  function clock() {
    const h = nowH();
    $("#clock").textContent = hm(h); $("#date").textContent = dateF.format(new Date());
    $$(".now").forEach(n => { n.style.setProperty("--p", P(h)); $("b", n).textContent = hm(h); });
  }
  function render() {
    reads();
    if (current === "overview") controlView();
    if (current === "plant") { plantList(); plantDet(); }
    if (current === "faults") alarmsView();
    if (current === "dispatch") dispatchView();
    if (current === "buildings") buildingsView();
    if (current === "reports") reportsView();
  }

  clock(); evaluate(); seedFeed(); route(); feedOn = true;
  setInterval(() => { const a = $("#ago"); if (a && current === "overview") a.textContent = `Last reading ${Math.round((Date.now() - lastRead) / 1000)} s ago`; }, 1000);
  let rzT; addEventListener("resize", () => { clearTimeout(rzT); rzT = setTimeout(() => current === "overview" && arChart(), 200); });
  // live: readings every 5 s (numbers only), the rest every minute
  setInterval(() => {
    tick(); lastRead = Date.now(); evaluate();
    if (++beatI % 6 === 0) log("BMS", beat(LIVE[(beatI / 6) % LIVE.length])); // one BMS line every 30 s, so loop events stay readable
    if (current === "overview") { sbar(); effb(); board(); crews(); }
    const n = [...ALARMS.values()].filter(a => a.status === "new").length;
    if (current === "plant") { plantLive(); $("#bList .mi__s") && $$("#bList .mi__s").forEach((el, i) => (el.textContent = `${LIVE[i].sec} · ${f2(LIVE[i].now.eff)} kW/RT`)); }
    if (n !== counts.last) { counts.last = n; paintFloors(); }
  }, 5000);
  setInterval(() => { clock(); if (!drag && drawer.hidden && !document.activeElement.closest?.("form")) render(); }, 60000);
})();
