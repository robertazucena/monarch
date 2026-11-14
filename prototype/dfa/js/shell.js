/* Shared shell: icon sprite, GOV.PH bar, header with menus, footer, modal and toast.
   Every page loads this file right after <body>; it writes the top of the page where the script tag sits,
   and DFA.bottom() writes the footer. One source, so a menu change happens once, and it works from file://.

   DEPARTMENT SWAP: edit SITE below (name, menus, hotlines, footer links). Nothing else in this file
   needs to change for a new department. */
(() => {
  const SITE = {
    short: "DFA",
    name: "Department of Foreign Affairs",
    country: "Republic of the Philippines",
    official: "https://dfa.gov.ph/",
    officialLabel: "dfa.gov.ph",
    emergency: { label: "OFW Emergency", short: "ATN", tel: "+63288344996", display: "(+632) 8834-4996" },
    nav: [
      { id: "about", label: "About", items: [
        ["about.html", "About the Department", "Mandate, mission and the three pillars"],
        ["about.html#history", "History", "From 1898 to a network of 94 posts"],
        ["about.html#organisation", "Organisation", "Offices, attached agencies and leadership"],
        ["careers.html", "Careers", "Foreign Service exam and open positions"] ] },
      { id: "services", label: "Consular Services", items: [
        ["services.html", "All consular services", "Requirements, fees and processing times"],
        ["passport.html", "Passport", "New, renewal, minors and lost passports"],
        ["apostille.html", "Apostille", "Authenticating documents for use abroad"],
        ["visa.html", "Visa & entry", "Visa-free entry, e-Visa and visa types"],
        ["atn.html", "Assistance to Nationals", "24/7 help for Filipinos overseas"] ] },
      { id: "offices", label: "Offices & Posts", items: [
        ["offices.html", "Consular offices", "DFA offices across the Philippines"],
        ["posts.html", "Embassies & consulates", "Philippine posts in 80+ countries"] ] },
      { id: "news", label: "Newsroom", href: "news.html" },
      { id: "transparency", label: "Transparency", href: "transparency.html" },
      { id: "contact", label: "Contact", href: "contact.html" }
    ],
    hotlines: [
      ["Passport appointment", "+63282343488", "(+632) 8234-3488"],
      ["Apostille inquiries", "+63286519400", "(+632) 8651-9400"],
      ["OFW Emergency ATN", "+63288344996", "(+632) 8834-4996", true]
    ],
    footer: [
      ["The Department", [["about.html", "About the DFA"], ["about.html#history", "History"], ["about.html#organisation", "Organisation"], ["careers.html", "Careers"]]],
      ["Services", [["passport.html", "Passport"], ["apostille.html", "Apostille"], ["visa.html", "Visa & entry"], ["atn.html", "Assistance to Nationals"], ["offices.html", "Consular offices"], ["posts.html", "Embassies & consulates"]]],
      ["Government", [["https://www.gov.ph/", "GOV.PH"], ["https://www.officialgazette.gov.ph/", "Official Gazette"], ["https://www.foi.gov.ph/", "Freedom of Information"], ["https://arta.gov.ph/", "Anti-Red Tape Authority"], ["https://data.gov.ph/", "Open Data Philippines"]]]
    ]
  };

  const ICONS = {
    sun: '<symbol id="i-sun" viewBox="0 0 48 48"><circle cx="24" cy="24" r="18" fill="none" stroke="#fcd116" stroke-width="1.5" stroke-dasharray="3 2"/><circle cx="24" cy="24" r="9" fill="#0038a8" stroke="#fff" stroke-width="1.5"/><path d="M24 6v5M24 37v5M6 24h5M37 24h5M11.3 11.3l3.5 3.5M33.2 33.2l3.5 3.5M36.7 11.3l-3.5 3.5M14.8 33.2l-3.5 3.5" stroke="#fcd116" stroke-width="2" stroke-linecap="round"/><circle cx="24" cy="24" r="3.5" fill="#fcd116"/></symbol>',
    passport: '<rect x="5" y="2.5" width="14" height="19" rx="2"/><circle cx="12" cy="10" r="3.2"/><path d="M9 16.5h6"/>',
    doc: '<path d="M14 2.5H7a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7.5z"/><path d="M14 2.5v5h5"/><circle cx="12" cy="14" r="2.6"/><path d="m10.6 16.2-.9 3.3 2.3-1.1 2.3 1.1-.9-3.3"/>',
    plane: '<path d="M10.2 13.8 3 11l1.6-1.6 9.5 1.2 4.2-4.2a2 2 0 0 1 2.9 2.9l-4.2 4.2 1.2 9.5L16.6 21l-2.8-7.2"/><path d="m6.5 17.5-2-2"/>',
    life: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="m5.6 5.6 3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    phone: '<path d="M21 16.5v3a2 2 0 0 1-2.2 2A19 19 0 0 1 2.5 5.2 2 2 0 0 1 4.5 3h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.4 10.9a16 16 0 0 0 4.7 4.7l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    out: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    shield: '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6z"/><path d="m9 12 2 2 4-4"/>',
    chev: '<path d="m6 9 6 6 6-6"/>',
    check: '<path d="M5 12.5 10 17l9-10"/>',
    alert: '<path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    building: '<path d="M3 21h18M5 21V10l7-5 7 5v11"/><path d="M9 21v-6h6v6M9 12h.01M15 12h.01"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.2a5 5 0 0 1 5.5 5.8"/>',
    book: '<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H20v15H5.5A1.5 1.5 0 0 0 4 19.5z"/><path d="M4 19.5A1.5 1.5 0 0 0 5.5 21H20"/>',
    brief: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z"/>',
    scale: '<path d="M12 3v18M5 21h14M6 7h12M6 7l-3 7a3 3 0 0 0 6 0zM18 7l-3 7a3 3 0 0 0 6 0z"/>',
    home: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/>'
  };
  const sprite = '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' +
    Object.entries(ICONS).map(([k, v]) => k === "sun" ? v : `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join("") + "</svg>";

  const ic = id => `<svg aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const ext = h => /^https?:/.test(h) ? ' target="_blank" rel="noopener"' : "";
  const section = document.body.dataset.section || "";

  const desk = SITE.nav.map(g => g.items
    ? `<div class="nav__g"><button class="nav__t${g.id === section ? " is-on" : ""}" type="button" aria-expanded="false" aria-controls="dd-${g.id}"${g.id === section ? ' data-current' : ""}>${g.label}${ic("chev")}</button>
        <div class="dd" id="dd-${g.id}">${g.items.map(([h, t, d]) => `<a class="dd__a" href="${h}"><b>${t}</b><span>${d}</span>${ic("arrow")}</a>`).join("")}</div></div>`
    : `<a class="nav__t${g.id === section ? " is-on" : ""}" href="${g.href}"${g.id === section ? ' aria-current="page" data-current' : ""}>${g.label}</a>`).join("");

  const mob = SITE.nav.map(g => g.items
    ? `<div class="mnav__g"><p class="mnav__k">${g.label}</p>${g.items.map(([h, t]) => `<a href="${h}">${t}</a>`).join("")}</div>`
    : `<div class="mnav__g"><a class="mnav__solo" href="${g.href}">${g.label}</a></div>`).join("");

  const top = `${sprite}
<a class="skip" href="#main">Skip to content</a>
<div class="util" id="top">
  <div class="wrap util__in">
    <div class="util__l"><a class="govph" href="https://www.gov.ph/" target="_blank" rel="noopener"><i></i>GOV.PH</a><span class="util__rep">${SITE.country}</span></div>
    <div class="util__r">
      <p class="util__clock" title="Philippine Standard Time (Asia/Manila)">${ic("clock")}<span class="util__lbl">Philippine Standard Time</span><time id="pst">--</time></p>
      <button class="atn" type="button" data-open="atn"><i class="atn__dot"></i>24/7 <span class="atn__l">${SITE.emergency.label}</span> ${SITE.emergency.short}</button>
    </div>
  </div>
</div>
<header class="hd" id="hd">
  <div class="hd__flag" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="wrap hd__in">
    <a class="brand" href="index.html" aria-label="${SITE.name}, home">
      <span class="brand__seal"><svg viewBox="0 0 48 48"><use href="#i-sun"/></svg></span>
      <span class="brand__t"><small>${SITE.country}</small>${SITE.name}</span>
    </a>
    <nav class="nav" aria-label="Main">${desk}</nav>
    <form class="search" role="search" data-search action="news.html">
      ${ic("search")}
      <input type="search" name="q" placeholder="Search passport, apostille, offices…" aria-label="Search the ${SITE.short} website" autocomplete="off" aria-controls="sugA" aria-expanded="false">
      <kbd>/</kbd>
      <ul class="sug" id="sugA" role="listbox" hidden></ul>
    </form>
    <button class="hd__menu" type="button" id="menuBtn" aria-expanded="false" aria-controls="mnav" aria-label="Open menu">${ic("menu")}</button>
  </div>
  <div class="mnav" id="mnav" hidden>
    <form class="search search--m" role="search" data-search action="news.html">
      ${ic("search")}
      <input type="search" name="q" placeholder="Search the ${SITE.short} website…" aria-label="Search the ${SITE.short} website" autocomplete="off" aria-controls="sugB" aria-expanded="false">
      <ul class="sug" id="sugB" role="listbox" hidden></ul>
    </form>
    <nav class="mnav__nav" aria-label="Mobile">${mob}</nav>
  </div>
</header>`;

  const bottom = () => `
<footer class="ft">
  <div class="ft__flag" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="wrap ft__head">
    <a class="ft__brand" href="index.html"><span class="brand__seal brand__seal--sm"><svg viewBox="0 0 48 48"><use href="#i-sun"/></svg></span><span><small>${SITE.country}</small>${SITE.name}</span></a>
    <ul class="ft__hot" aria-label="Hotlines">${SITE.hotlines.map(([l, t, d, red]) => `<li${red ? ' class="is-red"' : ""}><span>${l}</span><a href="tel:${t}">${d}</a></li>`).join("")}</ul>
  </div>
  <div class="wrap ft__grid">
    ${SITE.footer.map(([k, links]) => `<div><h2 class="ft__k">${k}</h2><ul class="ft__links">${links.map(([h, t]) => `<li><a href="${h}"${ext(h)}>${t}</a></li>`).join("")}</ul></div>`).join("")}
    <div class="ft__acc"><h2 class="ft__k">Accountability</h2><p class="ft__txt">All content is in the public domain unless otherwise stated.</p>
      <div class="ft__seals"><a class="seal seal--gold" href="transparency.html">${ic("shield")}Transparency Seal</a><a class="seal" href="https://www.foi.gov.ph/" target="_blank" rel="noopener">eFOI Portal</a></div></div>
  </div>
  <div class="wrap ft__bot">
    <p>Concept redesign for a portfolio, not affiliated with the ${SITE.name}. For official services visit <a href="${SITE.official}" target="_blank" rel="noopener">${SITE.officialLabel}</a>.</p>
    <a href="#top" class="ft__top">Back to top${ic("arrow")}</a>
  </div>
</footer>
<dialog class="modal" id="modal" aria-labelledby="modalT">
  <div class="modal__hd"><h2 class="modal__t" id="modalT"></h2><button class="modal__x" type="button" data-close aria-label="Close">${ic("x")}</button></div>
  <div class="modal__b" id="modalB"></div>
  <div class="modal__ft"><button class="btn btn--ghost" type="button" data-close>Close window</button></div>
</dialog>
<div class="toast" id="toast" role="status" aria-live="polite">${ic("info")}<span id="toastT"></span></div>`;

  document.currentScript.insertAdjacentHTML("beforebegin", top);
  window.DFA = { SITE, ic, bottom: () => document.currentScript.insertAdjacentHTML("beforebegin", bottom()) };
})();
