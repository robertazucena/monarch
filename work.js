/* Monarch Labs — work view.
   Each service is a category of projects. Clicking the current service word (or "See the work") zooms into it:
   the photo showing in its letters grows out of the word to fill the frame while the word itself blows past, and the
   category opens on that photo: the service name, its line, an index, then each project.
   The tabs, or "Next service" at the end, switch category with a crossfade; Back, the X, Escape or the browser's
   Back button zoom out into the word again, on whichever service was open.
   Projects: Sentron Ops, DepEd Philippines, Howely, DFA Philippines, Nowhere, Courtly and Steady, written as Monarch studies (overview, challenge / insight / solution, the
   four-phase approach, what we built). A project opens in two columns: its live HTML prototype
   (prototype/<id>/) on the left with four more screens (work/<id>-n.webp) below it, and the study on the right in its
   own scroll; picking a screen loads that page in the prototype. */
(() => {
  "use strict";
  const S = {
    howely: { name: "Howely", field: "Web design · Logistics, Singapore", status: "Concept · 2026",
      title: "A logistics website where one parcel carries you from port to porch.",
      caps: ["Brand refresh", "Web design", "3D motion", "Prototype"],
      pages: [["Home", "index.html"], ["About", "index.html#about"], ["Services", "index.html#services"], ["Resources", "index.html#resources"], ["Contact", "index.html#contact"], ["A guide", "index.html#customs-clearance"]],
      overview: "Howely is a Singapore third-party logistics company that moves, stores and ships for small businesses, start-ups and overseas brands landing in the city. This concept rebuilds its website around one idea: a single 3D parcel that travels the page with you, from the hero to a live waybill, a services setup, a packing slip and the footer, so the journey of the goods becomes the way you read the site. Ten services become a tick-box setup that follows you to the booking form, and every page sits in one paper, ink and signal-orange system.",
      story: ["Logistics sites list services in grids of icons and stock photos, so a small business can’t picture what handing over its supply chain would look like.",
        "People don’t buy a 3PL. They buy <em>the confidence that a parcel gets there</em>.",
        "Let one parcel make the journey on screen, and let visitors build their setup as they read."],
      steps: [["Research", "Read howely.com.sg end to end: ten services, the value-added extras, the industries served, the free consultation and seven guides."],
        ["Direction", "Split editorial frames, monochrome plus one signal orange, and an object that breaks the frame, chosen over the usual icon grid."],
        ["Brand", "Redrew the HS monogram as two posts with an orange box between them, set everything in Archivo, and kept the palette to paper, ink and signal."],
        ["Build", "Hand-built in HTML, CSS and JavaScript as one hash-routed site that opens from a file, with a CSS 3D parcel and no libraries."]],
      built: [["The travelling parcel", "One 3D box that spins in the preloader, lands on a looping port-to-porch reel in the hero and glides to a dock in every section."],
        ["Tick-box setup", "Pick from ten services, watch the chain build in a sticky bar, and find it waiting on the booking form."],
        ["Services catalogue", "A master-detail index with a route strip per service, a conveyor of seven bays and a clickable warehouse floor plan."],
        ["Guides and booking", "Seven guides on a manifest list with route-line contents, and a booking docket beside a map of the warehouse."]] },
    dfa: { name: "DFA Philippines", field: "Web design · Government, Philippines", status: "Concept · 2026",
      title: "A foreign affairs website that answers the citizen’s errand first, and doubles as a template for every department.",
      caps: ["Information architecture", "Web design", "Design system", "Prototype"],
      pages: [["Home", "index.html"], ["Consular services", "services.html"], ["Passport", "passport.html"], ["Newsroom", "news.html"], ["Embassies & consulates", "posts.html"], ["Consular offices", "offices.html"], ["Assistance to Nationals", "atn.html"], ["Transparency", "transparency.html"], ["An advisory", "article.html?id=10"]],
      overview: "The Department of Foreign Affairs serves Filipinos at home and in more than 80 countries: passports, apostilles, visas and round-the-clock help for workers abroad. This concept rebuilds its website as a 14-page, citizen-first service. Requirements, fees and release times sit beside the consular office locator on the home page, advisories can be filtered and searched, embassies and consulates are grouped by region, and the 24/7 emergency line is never more than one tap away. The shell is built as a template, so another department can reuse it by editing one config block.",
      story: ["Government sites bury fees and requirements under press releases, so people pay fixers for appointments that are free.",
        "Citizens don’t visit a department. They come with <em>one errand and very little time</em>.",
        "Put every errand’s requirements, fees and nearest office up front, and warn against fixers before anything else."],
      steps: [["Research", "Mapped the original draft section by section and checked the real figures: ₱950 and ₱1,200 passports, ₱100 and ₱200 apostilles, released in five or two working days."],
        ["Direction", "Kept the draft’s seven sections and the flag’s navy, royal blue, red and gold, and raised the craft in type, spacing, contrast and motion."],
        ["Brand", "A sun-seal mark, a three-colour flag stripe across the header and footer, and Plus Jakarta Sans with Inter used the same way on every page."],
        ["Build", "Hand-built in HTML, CSS and JavaScript as 14 static pages that open from a file. One shared shell writes the header, menus and footer, and the department’s data lives in one file."]],
      built: [["Errand-first home", "Service cards, a requirements and fees panel with a checklist, and a consular office locator side by side."],
        ["Advisories and stories", "A crossfading carousel of featured stories with photos, plus advisories you can filter and search, each with its own article page."],
        ["Directory of posts", "Every Philippine embassy and consulate by region with search, and the consular offices across the Philippines."],
        ["A template for departments", "One config block for the name, seal, menus, hotlines and footer, so the next department starts from a working site."]] },
    sentron: { name: "Sentron Ops", field: "Product design · Building services, Singapore", status: "Concept · 2026",
      title: "An operations console where every alarm runs one loop, from the first reading to a signed report.",
      caps: ["Product strategy", "Dashboard design", "Data visualisation", "Prototype"],
      pages: [["Overview", "index.html?theme=light#overview"], ["Plant", "index.html?theme=light#plant"], ["Faults", "index.html?theme=light#faults"], ["Dispatch", "index.html?theme=light#dispatch"], ["Buildings", "index.html?theme=light#buildings"], ["Reports", "index.html?theme=light#reports"]],
      overview: "Sentron Engineering services air-conditioning and smoke-control systems across Singapore, from Changi Airport and Raffles Hospital to condominiums and depots, and sells system-operation data analysis as a service. This concept turns that service into the console the ops desk would run on. Live building-system readings raise alarms, an alarm becomes a call in one tap, Dispatch suggests the crew with the right skills and the least travel, the crew checks in and works through a checklist, and the signed report clears the alarm when the reading falls back in range. The Overview tracks delivery the way software teams track releases: visits completed, alarm-to-crew time, repeat faults and time to restore, each against a target band.",
      story: ["Readings, phoned-in faults, crew schedules and service reports sit in separate places, so nobody can see whether a problem is actually fixed.",
        "An alarm isn’t done when a crew is sent. It’s done <em>when the reading is back in range</em>.",
        "One loop on one console: reading, alarm, call, dispatch, visit, report, and the reading again."],
      steps: [["Research", "Read sentron.com.sg end to end: its services, the buildings it looks after and its data-analysis offer. Client names are real; every reading and job is labelled sample data."],
        ["Direction", "Dropped the website redesign for the tool the business needs, then rebuilt a nine-screen console as one connected loop after a first pass felt disconnected."],
        ["Brand", "A new mark, an S drawn as one run of duct split by a damper blade, a riser-shaft navigation where each view is a floor, and light and dark themes."],
        ["Build", "Six floors in one static page that opens from a file, with simulated live readings every five seconds and chart colours checked for colour-blind readers."]],
      built: [["Overview", "Four delivery metrics with target bands and 12-week trends, alarms raised against restored, and a live event stream."],
        ["Plant", "Chiller-plant readings and every air handler per building, with a 24-hour efficiency trend."],
        ["Dispatch", "Drag a call onto a crew, or take one of three suggested slots; skills, clashes and travel between regions are checked."],
        ["Reports", "Every report traced back to the reading or call that started it, and filed straight from the crew’s checklist."]] },
    dost: { name: "DOST Philippines", field: "Web design · Government, Philippines", status: "Concept · 2026",
      title: "A science department website that answers what DOST can do for you, built on the DFA template.",
      caps: ["Information architecture", "Web design", "Content design", "Prototype"],
      pages: [["Home", "index.html"], ["Programs & services", "programs.html"], ["Agencies & councils", "agencies.html"], ["Announcements", "announcements.html"], ["Regional offices", "offices.html"], ["About", "about.html"], ["News", "news.html"], ["Contact", "contact.html"], ["Transparency", "transparency.html"], ["A story", "article.html?id=8"]],
      overview: "The Department of Science and Technology funds research, gives out science scholarships, helps small businesses upgrade, and runs the country’s weather and earthquake warnings through PAGASA and PHIVOLCS. Its website spreads that across 19 agencies, 16 regional sites and years of uploads. This concept rebuilds it as 10 pages for students, business owners, researchers and anyone checking a hazard. Scholarships, SETUP, research grants and today’s outlook sit on the home page; announcements, the 19 agencies and the 16 regional offices can be filtered and searched; and site search reaches every program, office, call and story. It is the third department built on the DFA template.",
      story: ["DOST’s site files everything by the agency that owns it, so a student, a business owner or a researcher has to know the org chart first.",
        "People don’t look for an agency. They look for <em>a scholarship, a grant or a warning</em>.",
        "Lead with the four things people come for, put all 19 agencies and 16 regions on one searchable map, and keep the hazard bulletins one tap away."],
      steps: [["Research", "Read dost.gov.ph end to end and kept only what was verified there: the mandate, 19 agencies and their services, 16 regional sites, 10 announcements, 8 news stories and the Central Office locals."],
        ["Direction", "Kept the template’s sections and turned Issuances into Announcements, since DOST publishes calls and notices rather than numbered orders."],
        ["Brand", "Same seal style and type as DFA and DepEd; the deep blue of DOST’s seal with a laboratory cyan, and a four-circle seal from its logo."],
        ["Build", "10 static pages that open from a file, made by swapping the template’s tokens, config and data, with a photo banner on every inner page."]],
      built: [["Four front doors", "Scholarships, SETUP for small business, research grants and weather and hazard bulletins as the home page’s four cards."],
        ["One search for everything", "Programs, agencies, regional offices, calls and stories in one search box with suggestions as you type."],
        ["Agencies, explained", "All 19 councils, institutes and advisory bodies in four groups, each with what it does and its own website."],
        ["Template, proven again", "The third department on the DFA shell: same structure, its own colours, content and seal."]] },
    deped: { name: "DepEd Philippines", field: "Web design · Government, Philippines", status: "Concept · 2026",
      title: "An education website that puts learners, parents and teachers ahead of the press releases, built on the DFA template.",
      caps: ["Information architecture", "Web design", "Design system", "Prototype"],
      pages: [["Home", "index.html"], ["K to 12", "k12.html"], ["Alternative Learning System", "als.html"], ["Teachers", "teachers.html"], ["Issuances", "issuances.html"], ["Regional offices", "offices.html"], ["Programs", "programs.html"], ["Newsroom", "news.html"], ["About", "about.html"], ["A story", "article.html?id=1"]],
      overview: "The Department of Education runs basic schooling for millions of Filipino learners, from Kindergarten to Grade 12, plus the Alternative Learning System for those who learn outside school. This concept rebuilds its website as a 13-page service for learners, parents and teachers. ALS enrolment, Senior High School and teacher support sit on the home page, DepEd Orders and Memoranda can be searched by number or topic, the 16 regional offices show whether they are open, and help with a school concern is one tap away. It is the second department built on the DFA template: same shell and type, its own colours.",
      story: ["DepEd’s site stacks orders, memos and news in one feed, so a parent looking for enrolment or a teacher looking for training has to dig.",
        "Families don’t read memoranda. They need <em>the next step for their learner</em>.",
        "Lead with the learner’s and teacher’s errands, make every order searchable, and keep the help line close."],
      steps: [["Research", "Read deped.gov.ph end to end and kept only what was verified there: DO 023 and DM 064 of 2026, the 231,725 teacher laptops, the PAAC lines and the 16 regions."],
        ["Direction", "Kept the DFA template’s sections and merged the thin pages: Senior High School into K to 12 and NEAP into Teachers."],
        ["Brand", "Same seal style, Plus Jakarta Sans and Inter as DFA; chalkboard green and marigold give DepEd its own character, with a book-and-flame seal."],
        ["Build", "13 static pages that open from a file, made by swapping the template’s tokens, config and data, with a photo banner on every inner page."]],
      built: [["Learner-first home", "ALS, Senior High School, teacher growth and learner protection as four cards under an El Niño advisory."],
        ["Issuances finder", "DepEd Orders, Memoranda and Official Statements with tabs and search by number or keyword."],
        ["Regional offices", "All 16 regions by island group, with the provinces they cover and whether they are open right now."],
        ["Template, proven", "The second department built from the DFA shell, so a third starts from a working site."]] },
    nowhere: { name: "Nowhere", field: "Product design · Singapore property", status: "Concept · 2026",
      title: "Homes in Singapore, ranked by your week: door-to-door minutes and the cash you pay after CPF.",
      caps: ["Brand", "Product design", "Map UX", "Prototype"],
      pages: [["Landing", "index.html"], ["Find a home", "find.html"], ["Home details", "home.html?id=1"], ["Shortlist", "shortlist.html"], ["Viewings", "viewings.html"], ["Make an offer", "offer.html?id=1"], ["Agent workspace", "agent.html"], ["List a home", "list.html"]],
      overview: "Nowhere is a concept property platform for Singapore that ranks homes by the week you actually live. Buyers pin the places that fill their week, like work, their parents and their children’s school, add what they earn and what sits in CPF, and every home is ordered by door-to-door minutes and the cash they would pay each month after CPF and grants. On the other side, agents and owners get a workspace to list homes, handle viewing requests and see how well a buyer fits without ever seeing their income.",
      story: ["Property portals filter by price and bedrooms, so the real cost of a home, the hours spent getting to work, school and family, never shows up.",
        "People don’t buy a flat. They buy <em>the week that comes with it</em>.",
        "Tell it where your week happens, and every home is ranked for you."],
      steps: [["Research", "Read the 2026 market, grants, CPF and loan rules, and the pain points buyers report, from fake listings to stale ones."],
        ["Direction", "Three directions; the one that stayed put the buyer’s life, not the listing, at the centre of the search."],
        ["Brand", "A name that belongs to no single language, set in Bodoni on warm paper, with Home in English, Chinese, Malay and Tamil."],
        ["Build", "Hand-built in HTML, CSS and JavaScript on live OneMap tiles and address search, with every figure worked out in the browser."]],
      built: [["Life-first search", "Pin work, parents and school on the map, and the homes reorder by real door-to-door minutes."],
        ["Money after CPF", "Monthly cash after CPF, grants such as the Proximity Housing Grant, and the lease left when the loan ends."],
        ["Home details", "Photos, a filmed-style walkthrough tied to a floor plan you can expand and zoom, your week from this door and a viewing request."],
        ["Agent workspace", "Listings, viewing requests with a buyer’s fit but never their income, and a guided listing flow with address search."]] },
    courtly: { name: "Courtly", field: "Product design · Sports court booking", status: "Shipped · 2025",
      title: "Your all-in-one platform for sports court bookings.",
      caps: ["Product design", "Design system", "Prototypes"],
      pages: [["Dashboard", "index.html"], ["Court details", "court-details.html"], ["Booking", "booking.html"], ["Community games", "community.html"], ["Profile", "profile.html"], ["Edit profile", "edit-profile.html"]],
      overview: "Courtly helps people discover nearby venues, reserve courts and manage their bookings in one place. The dashboard offers personalised recommendations, upcoming schedules, booking history and activity streaks that encourage regular play. With a clean, intuitive interface, users can quickly find courts, join community matches and stay active.",
      story: ["Booking a court usually means calls, chat groups and guesswork about what’s free.",
        "People don’t want a court. They want <em>a game tonight</em>.",
        "Discovery, booking and community in one calm flow."],
      steps: [["Flow", "Mapped the shortest path from “I want to play” to a confirmed slot."],
        ["System", "Built a green and slate token system in Geist, shared across every page."],
        ["Design", "Designed in Figma with auto layout so every screen translated cleanly to code."],
        ["Build", "Hand-built six pages in HTML, CSS and JavaScript, with one stylesheet and one script."]],
      built: [["Dashboard", "Favourite-sport filters, nearby courts with ratings and prices, and your upcoming and past bookings."],
        ["Slot booking", "Facilities, today’s open slots and a clear checkout."],
        ["Community games", "Join open games like a basketball run tonight or a futsal league."],
        ["Profile", "Stats, achievements, activity, payment methods and notifications."]] },
    steady: { name: "Steady", field: "Product design · Health and wellness", status: "Shipped · 2026",
      title: "A calmer, smarter way to stay on top of your wellbeing.",
      caps: ["Product design", "Design system", "Prototypes"],
      pages: [["Today", "index.html"], ["Nourish", "health.html"], ["Sleep", "sleep.html"], ["Circle", "circle.html"], ["Rhythm", "rhythm.html"], ["Profile", "profile.html"]],
      overview: "Steady brings daily health habits into one calm view, reading heart rate, sleep, steps and meals as one line through the day. Every screen opens on a slow, quiet film of the time of day, with the sun or moon on its arc and the hours of daylight left. A two-minute breathing pause, a companion that answers when asked and a morning routine that can be skipped without guilt sit on top, and the same six screens work on a phone and as a web app on desktop.",
      story: ["Health apps tend to shout numbers at you. Most people just want to know how they’re doing today.",
        "Wellness data should feel <em>reassuring</em>, not clinical.",
        "Five calm spaces, one steady companion, and the time of day always in view."],
      steps: [["Tone", "Set a calm voice on a black page: a full-width film for each time of day, solid pearl cards that overlap it, brushed graphite panels and black pill actions."],
        ["Structure", "Split the day into five spaces plus a profile, with a tab bar on phones and a floating top bar on desktop whose highlight slides to the item under the cursor."],
        ["Components", "Defined the shell, charts, companion, sheets and toasts once and reused them on every screen."],
        ["Build", "Compiled self-contained pages from shared CSS and JavaScript, so they open anywhere."]],
      built: [["Today", "A daily overview of how you’re doing, with a two-minute breathing pause built in."],
        ["Nourish log", "Mindful eating, logged with a single “Log food” action."],
        ["Sleep and routine", "Sleep goals with a simple trend line and a morning routine."],
        ["Wellness circle", "Friends, peers and wellness pros, with peer chat built in."]] }
  };
  /* the four approach steps, Monarch's phases */
  /* the four screens under the prototype (indexes into pages; the prototype opens on page 0) */
  const FOUR = { dost: [1, 2, 3, 4], sentron: [1, 2, 3, 5], deped: [1, 2, 3, 4], howely: [1, 2, 3, 4], dfa: [1, 2, 3, 5], nowhere: [1, 2, 5, 6], courtly: [1, 2, 3, 4], steady: [1, 2, 3, 4] };
  const PHASE = ["Frame", "Find", "Form", "Field"], STORY = ["Challenge", "Insight", "Solution"];
  const img = (f, w, h, alt) => `<img src="work/${f}" width="${w}" height="${h}" alt="${alt}" loading="lazy" decoding="async">`;
  /* service → projects (a project can sit in more than one); order: Strategy, Experience, Intelligence, Knowledge, Automation, Creative */
  const BY = [["nowhere"], ["dost", "sentron", "deped", "howely", "dfa", "courtly", "steady"], ["dost", "sentron", "steady", "nowhere"], ["dost", "nowhere"], ["courtly"], ["howely", "steady", "nowhere"]];

  const root = document.documentElement, work = document.getElementById("work");
  if (!work) return;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pad = n => String(n).padStart(2, "0");
  const words = $$(".reel>span"), descs = $$(".desc span"), see = $(".see"), word = $(".word");
  const scroll = $(".work-scroll", work), inner = $(".work-in", work), tabs = $(".work-tabs", work);
  const layers = $$(".work-bg i", work);
  /* everything about a service comes from the hero itself: name, side bearing, photos, line */
  const cut = b => getComputedStyle(b).getPropertyValue("--img").trim();   /* the photo cut this device uses (see .t>b in styles.css) */
  const SV = words.map((w, k) => {
    const t = $(".t", w);
    return { name: t.firstChild.textContent.trim(), lsb: t.style.getPropertyValue("--lsb"),
      imgs: $$(".t>b", w).map(cut), desc: descs[k] ? descs[k].textContent : "" };
  });
  const slug = k => SV[k].name.toLowerCase();
  const hi = img => img.replace(/w=\d+/, "w=2400");       /* full-frame backdrop: a sharper copy, swapped in once loaded */
  const urlOf = img => (img.match(/url\(['"]?([^'")]+)/) || [])[1];

  /* ---------- render ---------- */
  tabs.innerHTML = SV.map((s, k) => `<button type="button" role="tab" data-k="${k}">${s.name}</button>`).join("");
  /* the bench: the live prototype in a browser window (or a phone), drawn at its real width (1440 or 390) and
     scaled to fit the space it has, so it reads as the product, not a squeezed copy */
  const benchHTML = (id, d) => `<div class="b-bench" data-bench="${id}">
      <div class="b-stage">
        <div class="b-win">
          <div class="b-chrome"><span aria-hidden="true"><i></i><i></i><i></i></span><em>${d.name.toLowerCase()}<b>/</b></em></div>
          <div class="b-view" style="--poster:url('work/${id}-0.webp')"><iframe title="${d.name}, live prototype: ${d.pages[0][0]}" src="prototype/${id}/${d.pages[0][1]}"></iframe>
            <button type="button" class="b-shield"><span>Tap to try the prototype</span></button></div>
        </div>
      </div>
      <div class="b-cap"><p><i class="dot" aria-hidden="true"></i><span>Live prototype · <b data-bpage>${d.pages[0][0]}</b></span></p><button type="button" class="b-done">Done</button>
        <div class="b-dev" role="group" aria-label="Device"><button type="button" data-bdev="desk" aria-pressed="true">Desktop</button><button type="button" data-bdev="phone" aria-pressed="false">Phone</button></div></div>
    </div>`;
  /* one project, as a Monarch study: the prototype stays on the left, the study scrolls on the right */
  const studyHTML = (id, j, k) => {
    const d = S[id], ids = BY[k];
    return `<article class="w-study" id="s-${id}" aria-labelledby="h-${id}">
      <div class="s-info">
        <button class="s-min" type="button" aria-expanded="true" aria-controls="sc-${id}" aria-label="Hide the study, widen the prototype" title="Hide the study"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5"/></svg></button>
        <button class="s-tab" type="button" tabindex="-1" aria-hidden="true" data-unmin><span>The study · ${d.name}</span></button>
        <div class="s-rail" aria-hidden="true"><i></i></div>
        <div class="s-scroll" id="sc-${id}" tabindex="0" aria-label="About ${d.name}">
          <div class="s-head"><span class="s-idx">${pad(j + 1)} / ${pad(ids.length)}<i class="dot" aria-hidden="true"></i>${d.status}</span></div>
          <h3 class="s-name" id="h-${id}" tabindex="-1">${d.name}</h3>
          <p class="s-field">${d.field}</p>
          <p class="s-title">${d.title}</p>
          <p class="s-caps">${d.caps.join(" · ")}</p>
          <section class="s-sec"><h4>Overview</h4><p class="s-lead">${d.overview}</p></section>
          <section class="s-sec"><h4>Challenge, insight, solution</h4><ol class="s-story">${d.story.map((p, n) => `<li><small>${pad(n + 1)}</small><h5>${STORY[n]}</h5><p>${p}</p></li>`).join("")}</ol></section>
          <section class="s-sec"><h4>Approach</h4><ol class="s-steps">${d.steps.map((t, n) => `<li><small>${pad(n + 1)} · ${PHASE[n]}</small><b>${t[0]}</b><p>${t[1]}</p></li>`).join("")}</ol></section>
          <section class="s-sec"><h4>What we built</h4><ul class="s-built">${d.built.map(b => `<li><b>${b[0]}</b><p>${b[1]}</p></li>`).join("")}</ul></section>
          ${footHTML(k, id, "w-foot-in")}
        </div>
        <span class="s-fade s-fade-t" aria-hidden="true"></span><span class="s-fade s-fade-b" aria-hidden="true"></span>
        <p class="s-more" aria-hidden="true">Scroll <i>↓</i></p>
      </div>
      <div class="s-live">
        ${benchHTML(id, d)}
        <ol class="s-four" aria-label="More ${d.name} screens">${FOUR[id].map(n => `<li><button type="button" data-shot="${n}" aria-pressed="false" aria-label="Open ${d.pages[n][0]} in the prototype">${img(id + "-" + n + ".webp", 1200, 750, "")}<span>${d.pages[n][0]}</span></button></li>`).join("")}</ol>
      </div>
    </article>`;
  };
  /* the service page shows its projects as blocks; a block opens that project */
  const CARD = { dost: ["dost-0", 0, "DOST Philippines home page"], sentron: ["sentron-0", 0, "Sentron Ops overview with delivery metrics and live charts"], deped: ["deped-0", 0, "DepEd Philippines home page"], howely: ["howely-0", 0, "Howely home page"], dfa: ["dfa-0", 0, "DFA Philippines home page"], nowhere: ["nowhere-0", 0, "Nowhere landing page"], courtly: ["courtly-phones", 1, "Courtly app screens on three phones"], steady: ["steady-phones", 1, "Steady app screens on three phones"] };
  const cardHTML = (id, j) => {
    const d = S[id], c = CARD[id];
    const media = c[1] ? `<span class="w-shot phones">${img(c[0] + ".webp", 1200, 750, c[2])}</span>`
      : `<span class="w-shot win"><span class="w-bar" aria-hidden="true"><i></i><i></i><i></i></span>${img(c[0] + ".webp", 1200, 750, c[2])}</span>`;
    return `<article class="w-card rv" id="c-${id}" style="--d:${j % 2}">
      <button type="button" data-open="${id}" aria-label="Open the ${d.name} project">
        <span class="w-media">${media}</span>
        <span class="w-meta"><span><b>${d.name}</b><small>${d.field}</small></span><span class="w-view" aria-hidden="true">( View <i>→</i> )</span></span>
      </button>
    </article>`;
  };
  const footHTML = (k, id, cls) => {
    const ids = BY[k], at = ids.indexOf(id), nxp = id && at < ids.length - 1 ? ids[at + 1] : null, nx = (k + 1) % SV.length;
    return `<footer class="w-foot${cls ? " " + cls : " rv"}">
        ${nxp ? `<button class="w-next" type="button" data-open="${nxp}"><small>Next project</small><span>${S[nxp].name}</span><i aria-hidden="true">→</i></button>`
          : `<button class="w-next" type="button" data-k="${nx}"><small>Next service</small><span>${SV[nx].name}</span><i aria-hidden="true">→</i></button>`}
        <div class="w-foot-row">
          <p class="w-note">Selected projects. Each one opens as a working prototype.</p>
          <a class="btn dark" href="contact.html">Start a project <i aria-hidden="true">↗</i></a>
        </div>
      </footer>`;
  };
  const live = (url, name) => { const a = $(".work-live", work); a.href = url; a.setAttribute("aria-label", `Open the ${name} live prototype in a new tab`); };
  let proj = null, reveal = 0;   /* reveal: the timer that unfolds a project's study */
  const render = (k, id, dry) => {
    const ids = BY[k], s = SV[k];
    const markup = id ? `${studyHTML(id, ids.indexOf(id), k)}
      ${footHTML(k, id, "w-foot-out")}` : `<div class="w-intro">
        <p class="w-eye" style="--d:0"><i class="dot" aria-hidden="true"></i>${pad(k + 1)} / ${pad(SV.length)} &nbsp;·&nbsp; ${pad(ids.length)} ${ids.length > 1 ? "projects" : "project"}</p>
        <h2 class="w-word" id="w-title" style="--d:1">${s.name}</h2>
        <p class="w-desc" style="--d:2">${s.desc}</p>
      </div>
      <section class="w-grid" aria-label="${s.name} projects">${ids.map(cardHTML).join("")}</section>
      ${footHTML(k)}`;
    if (dry) return markup;
    proj = id || null;
    inner.innerHTML = markup;
    /* the top-left button: back to the services (closes the view), or, inside a project, back to its service */
    /* "Open live prototype": in the top bar, just before the close button, on project pages only */
    $(".work-live", work).hidden = !id;
    if (id) live(`prototype/${id}/${S[id].pages[0][1]}`, S[id].name);
    const wb = $(".work-back", work);
    wb.innerHTML = `<i aria-hidden="true">←</i> ${id ? "All " + s.name : "Services"}`;
    wb.setAttribute("aria-label", id ? `All ${s.name} projects` : "Back to the services");
    $$("[role=tab]", tabs).forEach(b => { const on = +b.dataset.k === k; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; });
    work.setAttribute("aria-label", s.name + " work");
    scroll.scrollTop = 0;
    size();
    $$("[data-bench]", inner).forEach(b => bench(b, 0, innerWidth < 700 ? "phone" : "desk"));
    $$(".s-info", inner).forEach(infoScroll);
    clearTimeout(reveal);
    if (id && (mini || split.matches)) minimise(true, true);   /* a project opens on its screens only; the study unfolds 3 s later (toProject) */
    watch();
  };
  /* panels rise into place as they scroll in */
  let io;
  const watch = () => {
    if (io) io.disconnect();
    const els = $$(".rv", inner);
    if (still || !("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("seen")); return; }
    /* project cards arrive one by one: the first screenful queues up after the intro (eyebrow, title, line), and
       cards scrolled into view later follow each other in reading order instead of landing in pairs */
    let first = true;
    io = new IntersectionObserver(es => {
      let q = 0;
      es.forEach(e => {
        if (!e.isIntersecting) return;
        const t = e.target;
        if (t.closest(".w-grid")) {
          t.style.transitionDelay = `${(first ? 620 : 0) + q++ * 160}ms`;
          t.addEventListener("transitionend", () => { t.style.transitionDelay = ""; }, { once: true });
        }
        t.classList.add("seen"); io.unobserve(t);
      });
      first = false;
    }, { root: scroll, threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach(e => io.observe(e));
  };

  /* ---------- backdrop: two layers so a category switch crossfades ---------- */
  let front = 0;
  const setBg = (img, fade) => {
    const L = fade ? layers[1 - front] : layers[front];
    L.style.setProperty("--img", img);
    if (fade) { layers[front].classList.remove("on"); L.classList.add("on"); front = 1 - front; }
    else { L.classList.add("on"); layers[1 - front].classList.remove("on"); }
    const u = urlOf(hi(img));                                /* upgrade to the sharp copy when it arrives */
    if (u) { const im = new Image(); im.onload = () => { if (L.style.getPropertyValue("--img") === img) L.style.setProperty("--img", `url('${u}')`); }; im.src = u; }
    return L;
  };

  /* ---------- settled: while the work view is simply open, nothing under it is drawn ----------
     The hero (its word blown up past the screen), the glass frame and the colour fields stay composited under the
     opaque sheet: tens of millions of pixels the GPU keeps drawing every frame, which shows as flashes while scrolling.
     So once the view has finished opening they are hidden, and the clip masks the opening needed are dropped; closing
     puts both back first, so the zoom out starts from exactly the same picture. */
  let settleT;
  const settleSoon = () => { clearTimeout(settleT); settleT = setTimeout(() => {
    if (!isOpen() || busy) return;
    work.style.clipPath = "none"; work.classList.add("settled"); root.classList.add("work-still");
  }, 1100); };
  const unsettle = () => {
    clearTimeout(settleT);
    if (!work.classList.contains("settled")) return;
    root.classList.remove("work-still"); work.classList.remove("settled");
    work.style.clipPath = full(); void work.offsetWidth;
  };

  /* ---------- open / switch / close ---------- */
  let cur = -1, busy = false, pushed = false;
  const isOpen = () => root.classList.contains("work-open");
  const tOf = k => $(".t", words[k]);
  const shownImg = k => { const b = $(".t>b.on", words[k]); return b ? cut(b) : SV[k].imgs[0]; };
  /* the word's box relative to the frame, as a clip-path inset, and the backdrop transform that sits the photo
     on the word (scaled to the word's width, centred on it) */
  const geo = r => {
    const f = work.getBoundingClientRect(), s = r.width / f.width;
    return { clip: `inset(${r.top - f.top}px ${f.right - r.right}px ${f.bottom - r.bottom}px ${r.left - f.left}px round 0px)`,
      tf: `translate(${r.left - f.left}px,${r.top - f.top + r.height / 2 - f.height * s / 2}px) scale(${s})` };
  };
  const full = () => "inset(0px 0px 0px 0px round 0px)";
  const loading = () => { const p = document.getElementById("pre"); return p && !p.classList.contains("done"); };

  const open = (k, direct) => {
    if (busy || isOpen() || (loading() && !direct)) return;
    busy = true; cur = k;
    if (window.MLHero) MLHero.stop();
    render(k);
    work.hidden = false;
    const L = setBg(shownImg(k), false);
    root.classList.add("work-open");
    const done = () => { work.classList.add("ready"); busy = false; scroll.focus({ preventScroll: true }); settleSoon(); };
    if (still) { work.style.clipPath = ""; L.style.transform = ""; work.classList.add("full"); done(); return; }
    /* landing straight on a service (a refresh): no zoom in, but leave the same end state the zoom leaves, so closing
       can zoom back out of it (a clip-path of none can't animate to the word's box; the hero must already be blown past) */
    if (direct) { work.style.clipPath = full(); L.style.transform = "none"; work.classList.add("full"); root.classList.add("zoom"); done(); return; }
    /* clicked while the hero is still assembling: end that intro first, or its transitions replace the word's
       zoom transition and the word jumps instead of blowing past */
    if (root.classList.contains("pre-intro")) {
      root.classList.remove("pre-intro", "in");
      document.querySelectorAll("[style*='--in']").forEach(el => el.style.removeProperty("--in"));
      void word.offsetWidth;
    }
    const r = tOf(k).getBoundingClientRect(), g = geo(r), w = word.getBoundingClientRect();
    word.style.transformOrigin = `${r.left + r.width / 2 - w.left}px ${r.top + r.height / 2 - w.top}px`;
    work.classList.add("snap"); L.classList.add("snap");
    work.style.clipPath = g.clip; L.style.transform = g.tf;
    void work.offsetWidth;                                     /* commit the start before zooming */
    work.classList.remove("snap"); L.classList.remove("snap");
    work.classList.add("full"); root.classList.add("zoom");
    work.style.clipPath = full(); L.style.transform = "none";
    setTimeout(done, 760);                                   /* the sheet opens as the photo lands */
  };

  const switchTo = k => {
    if (busy || k === cur) return;
    busy = true; cur = k;
    const L = setBg(SV[k].imgs[0], true);
    L.style.transform = "";
    work.classList.add("swap");                               /* the sheet stays; only its content crossfades */
    setTimeout(() => {
      render(k);
      void work.offsetWidth;
      work.classList.remove("swap"); busy = false;
      scroll.focus({ preventScroll: true });
    }, still ? 0 : 380);
    if (pushed) history.replaceState({ work: k }, "", "#work-" + slug(k));
  };

  const close = () => {
    if (busy || !isOpen()) return;
    busy = true;
    unsettle();
    const k = cur, L = layers[front];
    if (window.MLHero && MLHero.i !== k) MLHero.jump(k);
    root.classList.add("work-closing");   /* the word's smudge filter comes back now, while the photo still hides the word */
    work.classList.remove("ready");
    const end = () => {
      work.hidden = true;
      work.classList.remove("full", "swap");
      work.style.clipPath = ""; L.style.transform = "";
      root.classList.remove("work-open", "zoom", "work-closing");
      word.style.transformOrigin = "";
      busy = false;
      if (/^#work-/.test(location.hash)) history.replaceState(null, "", location.pathname + location.search);
      if (window.MLHero) MLHero.start();
      if (see) see.focus({ preventScroll: true });
    };
    if (still) { end(); return; }
    /* measure the word at rest (the zoom transform switched off for one read) */
    root.classList.add("measure");
    const r = tOf(k).getBoundingClientRect(), w = word.getBoundingClientRect();
    word.style.transformOrigin = `${r.left + r.width / 2 - w.left}px ${r.top + r.height / 2 - w.top}px`;
    void word.offsetWidth;
    root.classList.remove("measure");
    const g = geo(r);
    setTimeout(() => {                                       /* the sheet closes first, then the photo zooms back into the word */
      work.style.clipPath = g.clip; L.style.transform = g.tf;
      root.classList.remove("zoom");
      setTimeout(() => work.classList.remove("full"), 700);   /* the photo melts back into the letters at the end */
      setTimeout(end, 1320);                                  /* after the photo's fade (700 + 600 ms) has finished */
    }, 520);
  };

  /* ---------- wiring ---------- */
  const openHere = () => {
    const k = window.MLHero ? MLHero.i : 0;
    if (!isOpen()) { history.pushState({ work: k }, "", "#work-" + slug(k)); pushed = true; }
    open(k);
  };
  /* close directly, never with history.back(): the live prototype's own navigation shares the tab's history, so
     "back" would only step the iframe to its previous screen (Courtly does this). close() strips the #work- hash. */
  const leave = () => { pushed = false; close(); };
  addEventListener("popstate", () => { if (isOpen() && !/^#work-/.test(location.hash)) { pushed = false; close(); } });

  /* the word itself: only the letters of the current service count as the target */
  const onWord = e => { const r = tOf(window.MLHero ? MLHero.i : 0).getBoundingClientRect(); return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom; };
  word.addEventListener("click", e => { if (onWord(e)) openHere(); });
  word.addEventListener("mousemove", e => root.classList.toggle("hot", onWord(e) && !loading()));
  word.addEventListener("mouseleave", () => root.classList.remove("hot"));
  if (see) see.addEventListener("click", openHere);
  /* the button's count follows the service on screen */
  const count = k => { if (see) { $("b", see).textContent = pad(BY[k].length); see.setAttribute("aria-label", `See the ${SV[k].name} work: ${BY[k].length} ${BY[k].length > 1 ? "projects" : "project"}`); } };
  count(0);
  document.addEventListener("ml:service", e => count(e.detail));

  $(".work-back", work).addEventListener("click", () => { if (proj) toGrid(); else leave(); });
  $(".work-x", work).addEventListener("click", leave);
  tabs.addEventListener("click", e => { const b = e.target.closest("[data-k]"); if (b) switchTo(+b.dataset.k); });
  tabs.addEventListener("keydown", e => {                    /* arrow keys move along the tabs */
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const k = (cur + (e.key === "ArrowRight" ? 1 : -1) + SV.length) % SV.length;
    switchTo(k); setTimeout(() => $(`[data-k="${k}"]`, tabs).focus(), 20);
  });
  inner.addEventListener("click", e => {
    const op = e.target.closest("[data-open]"), bk = e.target.closest("[data-back]");
    if (op) { toProject(op.dataset.open); return; }
    if (bk) { toGrid(); return; }
    const to = e.target.closest("[data-to]"), nx = e.target.closest(".w-next[data-k]");
    if (to) { const el = document.getElementById(to.dataset.to); if (el) scroll.scrollTo({ top: el.offsetTop - 12, behavior: still ? "auto" : "smooth" }); }
    if (nx) switchTo(+nx.dataset.k);
    const dv = e.target.closest("[data-bdev]"), sh = e.target.closest("[data-shot]");
    if (dv) bench(e.target.closest("[data-bench]"), null, dv.dataset.bdev);
    if (sh) {
      const b = $("[data-bench]", inner), on = sh.getAttribute("aria-pressed") === "true";
      bench(b, on ? 0 : +sh.dataset.shot, null);                 /* picking the open screen again goes back to the first page */
      if (!split.matches) scroll.scrollTo({ top: b.getBoundingClientRect().top - scroll.getBoundingClientRect().top + scroll.scrollTop - 16, behavior: still ? "auto" : "smooth" });
    }
    if (e.target.closest(".b-shield")) e.target.closest("[data-bench]").classList.add("on");
    if (e.target.closest(".b-done")) e.target.closest("[data-bench]").classList.remove("on");
    if (e.target.closest(".s-min, [data-unmin]")) { clearTimeout(reveal); minimise(!mini); }
  });
  /* two columns from 1000px: the article takes the height of the scroll area, the study scrolls inside it */
  const split = matchMedia("(min-width:1000px)");
  const size = () => inner.style.setProperty("--sh", scroll.clientHeight + "px");
  /* the bench: load a page and/or switch device */
  const bench = (box, n, dev) => {
    if (!box) return;
    const d = S[box.dataset.bench], fr = $("iframe", box);
    if (dev) {
      box.classList.toggle("is-phone", dev === "phone");
      $$("[data-bdev]", box).forEach(b => b.setAttribute("aria-pressed", b.dataset.bdev === dev));
    }
    if (n != null && d.pages[n]) {
      const p = d.pages[n], url = `prototype/${box.dataset.bench}/${p[1]}`;
      if (fr.getAttribute("src") !== url) fr.setAttribute("src", url);
      fr.title = `${d.name}, live prototype: ${p[0]}`;
      $(".b-chrome b", box).textContent = "/" + p[1].replace("index.html", "").replace(/\.html.*$/, "");
      live(url, d.name);
      $("[data-bpage]", box).textContent = p[0];
      $$("[data-shot]", inner).forEach(b => b.setAttribute("aria-pressed", +b.dataset.shot === n));
    }
    fit(box);
  };
  /* scale the page into the room the stage has: by width, and in two columns by height too */
  const fit = (box, force) => {
    const stage = $(".b-stage", box), win = $(".b-win", box), view = $(".b-view", box), fr = $("iframe", box);
    const phone = box.classList.contains("is-phone"), W = phone ? 390 : 1440, H = phone ? 844 : 900, bar = phone ? 0 : 38;
    const cs = getComputedStyle(stage), aw = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const ah = split.matches ? stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) : Infinity;
    let w = force != null ? force - (phone ? 18 : 0) : Math.min(aw, phone ? 340 : Infinity, (ah - bar - (phone ? 18 : 0)) * W / H);
    if (!(w > 0)) return;
    const k = w / W;
    win.style.width = w + (phone ? 18 : 0) + "px"; view.style.height = H * k + "px";
    fr.style.width = W + "px"; fr.style.height = H + "px"; fr.style.transform = `scale(${k})`;
  };
  /* the study column's own scroll: a progress rail, soft fades top and bottom, and a hint that goes once it moves */
  const infoScroll = box => {
    const sc = $(".s-scroll", box), rail = $(".s-rail i", box), ft = $(".s-fade-t", box), fb = $(".s-fade-b", box), more = $(".s-more", box);
    let raf = 0, top = null, end = null;
    const upd = () => {
      raf = 0;
      const max = sc.scrollHeight - sc.clientHeight, y = sc.scrollTop, t = max > 0 ? y / max : 1;
      rail.style.transform = `scaleY(${Math.max(.04, t)})`;
      const a = y < 4, z = max - y < 4;                     /* touch the fades only when the state changes */
      if (a !== top) { top = a; ft.style.opacity = a ? 0 : 1; more.style.opacity = a && !z ? 1 : 0; }
      if (z !== end) { end = z; fb.style.opacity = z ? 0 : 1; if (z) more.style.opacity = 0; }
    };
    sc.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true }); upd();
    /* the wheel over the prototype column (its stage, caption and screens, not the live page itself) reads the study */
    /* it glides to where the wheel points instead of jumping a notch at a time */
    const live = box.nextElementSibling;
    let tgt = null, glideRaf = 0;
    const glide = () => {
      const d = tgt - sc.scrollTop;
      if (Math.abs(d) < .6) { sc.scrollTop = tgt; tgt = null; glideRaf = 0; return; }
      sc.scrollTop += d * .2; glideRaf = requestAnimationFrame(glide);
    };
    sc.addEventListener("wheel", () => { tgt = null; cancelAnimationFrame(glideRaf); glideRaf = 0; }, { passive: true });
    if (live) live.addEventListener("wheel", e => {
      if (!split.matches || mini || e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      const max = sc.scrollHeight - sc.clientHeight, dy = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;
      tgt = Math.max(0, Math.min(max, (tgt == null ? sc.scrollTop : tgt) + dy));
      if (still) { sc.scrollTop = tgt; tgt = null; return; }
      if (!glideRaf) glideRaf = requestAnimationFrame(glide);
    }, { passive: false });
  };
  /* ---------- block ⇄ project ----------
     A project is a page of its own, so moving to it (or back to its service, or on to the next project) is the same
     page change as Studio or Contact: the preloader panel wipes in from the left, the new view is drawn under it while
     the name decodes and the percentage counts the live prototype in, then the panel wipes off left to right
     (MLPre.cover in preload.js). Back lands on the block the project was opened from. */
  let moving = false;
  const focusName = () => { const h = $(".s-name", inner); if (h) h.focus({ preventScroll: true }); };
  const page = (draw, wait) => {
    if (moving || busy) return null;
    if (still || !window.MLPre) { draw(); return Promise.resolve(); }
    moving = true;
    return MLPre.cover(draw, wait).then(() => { moving = false; });
  };
  const frameLoad = () => { const fr = $(".b-view iframe", inner); return fr && new Promise(r => { fr.addEventListener("load", r, { once: true }); setTimeout(r, 4000); }); };
  /* the project shows only its prototype and screens first; once the page is in, the study unfolds after 3 s
     (unless the visitor folded or unfolded it themselves, or left, in the meantime) */
  const toProject = id => {
    const p = page(() => { render(cur, id); scroll.scrollTop = 0; focusName(); }, frameLoad);
    if (p) p.then(() => { clearTimeout(reveal); if (proj === id && mini && split.matches) reveal = setTimeout(() => { if (proj === id && mini) minimise(false); }, 3000); });
  };
  const toGrid = () => {
    const was = proj;
    page(() => {
      render(cur);
      $$(".rv", inner).forEach(e => e.classList.add("seen"));
      const c = was && document.getElementById("c-" + was);
      if (c) {
        const top = c.getBoundingClientRect().top - scroll.getBoundingClientRect().top + scroll.scrollTop;
        scroll.scrollTop = Math.max(0, top - (scroll.clientHeight - c.offsetHeight) / 2);
        $("button", c).focus({ preventScroll: true });
      }
    });
  };

  /* hide / show the study: its column folds to a strip and the prototype column widens; the page is re-fitted every
     frame while the columns move, so the prototype grows with them instead of jumping at the end */
  let mini = false, flight = null;
  /* the four screens fly between the row under the prototype and the column beside it: each one is measured where it
     is and where the new layout puts it, then a copy glides (and scales) from one to the other while the study column
     folds; the screen nearest the destination leaves first. The real screens show again when the last copy lands. */
  const land = () => { if (flight) { flight(); flight = null; } };
  const fly = (art, items, F, L, toSide, after) => {
    const A = art.getBoundingClientRect(), layer = document.createElement("div"), n = items.length;
    layer.className = "s-fly"; layer.setAttribute("aria-hidden", "true");
    art.appendChild(layer); art.classList.add("flying");
    const anims = items.map((li, i) => {
      const f = F[i], l = L[i], c = li.firstElementChild.cloneNode(true);
      c.removeAttribute("data-shot"); c.tabIndex = -1;
      c.style.cssText = `left:${l.left - A.left}px;top:${l.top - A.top}px;width:${l.width}px`;
      layer.appendChild(c);
      const order = toSide ? n - 1 - i : i;                    /* folding: the right-most leads; unfolding: the top one */
      return c.animate([
        { transform: `translate(${f.left - l.left}px,${f.top - l.top}px) scale(${f.width / l.width})` },
        { transform: `translate(${(f.left - l.left) * .12}px,${(f.top - l.top) * .12 - 10}px) scale(${1 + (f.width / l.width - 1) * .12})`, offset: .82 },
        { transform: "none" }
      ], { duration: 900, delay: order * 70, easing: "cubic-bezier(.65,0,.25,1)", fill: "backwards" });
    });
    const end = () => { anims.forEach(x => x.cancel()); layer.remove(); art.classList.remove("flying"); after(); };
    flight = end;
    Promise.all(anims.map(x => x.finished)).then(() => { if (flight === end) { end(); flight = null; } }, () => {});
  };
  const minimise = (on, now) => {
    mini = on;
    const art = $(".w-study", inner); if (!art) return;
    land();
    const info = $(".s-info", art), box = $("[data-bench]", art), items = $$(".s-four li", art);
    const animate = !now && !still && split.matches && items.length;
    const F = animate ? items.map(li => li.getBoundingClientRect()) : null, w0 = info.getBoundingClientRect().width;
    const G0 = animate && box ? [$(".b-stage", box).getBoundingClientRect().width, $(".b-stage", box).getBoundingClientRect().height, $(".b-win", box).getBoundingClientRect().width] : null;
    if (now) art.classList.add("snap");                        /* a new project opens already folded: no animation */
    if (animate) art.classList.add("measure");                 /* jump to the new layout for one read... */
    art.classList.toggle("min", on);
    const b = $(".s-min", art);
    b.setAttribute("aria-expanded", !on);
    b.setAttribute("aria-label", on ? "Show the study" : "Hide the study, widen the prototype");
    b.title = on ? "Show the study" : "Hide the study";
    if (!box) return;
    if (!animate) { fit(box); requestAnimationFrame(() => { fit(box); art.classList.remove("snap"); }); return; }
    const stage = $(".b-stage", box), win = $(".b-win", box), g = () => [stage.getBoundingClientRect().width, stage.getBoundingClientRect().height, win.getBoundingClientRect().width];
    fit(box);
    const L = items.map(li => li.getBoundingClientRect()), G1 = g(), i1 = info.getBoundingClientRect().width;   /* ...where it all ends up */
    info.style.flexBasis = w0 + "px"; void art.offsetWidth;     /* then fold the column from where it was */
    art.classList.remove("measure"); void art.offsetWidth;
    info.style.flexBasis = "";
    /* while it moves, the stage and the window are sized from start to end in step with the column, so nothing
       shrinks first or jumps when the screens land */
    const settle = () => { stage.style.width = stage.style.height = ""; fit(box); };
    fly(art, items, F, L, on, settle);
    const lerp = (x, y, p) => x + (y - x) * p;
    const step = () => {
      if (!art.classList.contains("flying")) return;
      const p = Math.min(1, Math.max(0, (w0 - info.getBoundingClientRect().width) / (w0 - i1 || 1)));
      stage.style.width = lerp(G0[0], G1[0], p) + "px"; stage.style.height = lerp(G0[1], G1[1], p) + "px";
      fit(box, lerp(G0[2], G1[2], p));
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };


  const relayout = () => { size(); $$("[data-bench]", inner).forEach(fit); $$(".s-info", inner).forEach(b => $(".s-scroll", b).dispatchEvent(new Event("scroll"))); };
  if ("ResizeObserver" in window) new ResizeObserver(relayout).observe(scroll);
  else addEventListener("resize", relayout);
  work.addEventListener("keydown", e => {
    if (e.key === "Escape") { e.preventDefault(); if (proj) toGrid(); else leave(); return; }
    if (e.key !== "Tab") return;                             /* keep focus inside while open */
    const f = $$("button,[href],[tabindex='0']", work).filter(el => el.offsetParent !== null);
    if (!f.length) return;
    const a = f[0], z = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === a || document.activeElement === scroll)) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  });
  /* the top bar turns to a darker glass once the studies scroll under it */
  scroll.addEventListener("scroll", () => work.classList.toggle("under", scroll.scrollTop > 4), { passive: true });

  /* a link straight to #work-intelligence (or a refresh there) lands on the work view already open, with no zoom:
     the loader panel just wipes off it (html.direct, set by preload.js, holds the opening transitions back) */
  const m = location.hash.match(/^#work-(\w+)/), dk = m ? SV.findIndex(s => s.name.toLowerCase() === m[1]) : -1;
  if (dk >= 0) { if (window.MLHero) MLHero.jump(dk); open(dk, true); }
})();
