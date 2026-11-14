/* Department of Science and Technology · concept. All department content lives here (DEPARTMENT SWAP).
   Sources: dost.gov.ph home page, Announcements, Contact Us, Mandate, The Secretary and History & Logo pages, read 14 Nov 2026.
   Only items that appear on the official site are used. dost.gov.ph shows no dates on announcements, so none are given. */
window.DATA = (() => {
  /* Announcements: calls, guidelines and public notices as listed on the home page, newest first */
  const A = "https://www.dost.gov.ph/23-announcements/";
  const ISSUANCES = [
    { type: "DO", no: "Press release", date: "", title: "2026 Call Conference", href: A + "4298-2026-call-conference-press-pelease.html" },
    { type: "DO", no: "Call for proposals", date: "", title: "2026 MECO-TECO Joint Research Program", href: A + "4284-call-for-proposals-2026-meco-teco-joint-research-program.html" },
    { type: "DM", no: "Resource", date: "", title: "Wave of Action: DOST Water Projects & Technologies, Volume II", href: A + "4278-wave-of-action-dost-water-programs-and-technologies-2.html" },
    { type: "DO", no: "Call for applications", date: "", title: "2026 MECO-TECO Sandwich Scholarship Program", href: A + "4277-call-for-application-2026-meco-teco-sandwich-scholarship-program.html" },
    { type: "DO", no: "Call for proposals", date: "", title: "2026 DOST-JSPS Joint Research Project", href: A + "4049-call-for-proposals-for-the-2026-dost-jsps-joint-research-project.html" },
    { type: "OS", no: "Public advisory", date: "", title: "Social Media Cards Against Online Sexual Abuse and Exploitation (OSAEC)", href: A + "2408-social-media-cards-against-online-sexual-abuse-and-exploitation-osaec.html" },
    { type: "DM", no: "Resource", date: "", title: "Wave of Action: DOST Water Programs and Technologies", href: A + "2368-wave-of-action-dost-water-programs-and-technologies.html" },
    { type: "DM", no: "Guidelines", date: "", title: "Implementing Guidelines for the Startup Grant Fund of the Department of Science and Technology", href: A + "2363-implementing-guidelines-for-the-startup-grant-fund-of-the-department-of-science-and-tec" },
    { type: "DM", no: "Briefer", date: "", title: "SALIKSIK R&D Briefer", href: A + "2211-saliksik-r-d-briefer.html" },
    { type: "OS", no: "Notice to the public", date: "", title: "Abolition of the Technology Resource Center (TRC)", href: A + "1185-notice-to-the-public-abolition-of-the-technology-resource-center-trc.html" }
  ];
  const ISS_TYPES = [["ALL", "All"], ["DO", "Calls"], ["DM", "Guidelines"], ["OS", "Notices"]];

  /* Regional offices: 16 DOST regional offices by island group. Office hours are the standard
     government Monday-to-Friday schedule. */
  const R = (name, region, city, address, web) => ({ name, region, city, address, web, days: [0, 4], open: 8, close: 17, services: "Regional office" });
  const OFFICES = [
    R("DOST-NCR", "LUZON", "Metro Manila", "National Capital Region · 16 cities and Pateros", "http://ncr.dost.gov.ph"),
    R("DOST-CAR", "LUZON", "Cordillera", "Abra, Apayao, Benguet, Ifugao, Kalinga, Mountain Province", "http://car.dost.gov.ph"),
    R("DOST Region I", "LUZON", "Ilocos", "Ilocos Norte, Ilocos Sur, La Union, Pangasinan", "http://region1.dost.gov.ph"),
    R("DOST Region II", "LUZON", "Cagayan Valley", "Batanes, Cagayan, Isabela, Nueva Vizcaya, Quirino", "http://region2.dost.gov.ph"),
    R("DOST Region III", "LUZON", "Central Luzon", "Aurora, Bataan, Bulacan, Nueva Ecija, Pampanga, Tarlac, Zambales", "http://region3.dost.gov.ph"),
    R("DOST Region IV-A", "LUZON", "CALABARZON", "Cavite, Laguna, Batangas, Rizal, Quezon", "http://region4a.dost.gov.ph"),
    R("DOST Region IV-B", "LUZON", "MIMAROPA", "Occidental and Oriental Mindoro, Marinduque, Romblon, Palawan", "http://region4b.dost.gov.ph"),
    R("DOST Region V", "LUZON", "Bicol", "Albay, Camarines Norte, Camarines Sur, Catanduanes, Masbate, Sorsogon", "http://region5.dost.gov.ph"),
    R("DOST Region VI", "VISAYAS", "Western Visayas", "Aklan, Antique, Capiz, Guimaras, Iloilo", "http://region6.dost.gov.ph"),
    R("DOST Region VII", "VISAYAS", "Central Visayas", "Bohol, Cebu, Siquijor", "http://region7.dost.gov.ph"),
    R("DOST Region VIII", "VISAYAS", "Eastern Visayas", "Biliran, Eastern Samar, Leyte, Northern Samar, Samar, Southern Leyte", "http://region8.dost.gov.ph"),
    R("DOST Region IX", "MINDANAO", "Zamboanga Peninsula", "Zamboanga del Norte, Zamboanga del Sur, Zamboanga Sibugay", "http://region9.dost.gov.ph"),
    R("DOST Region X", "MINDANAO", "Northern Mindanao", "Bukidnon, Camiguin, Lanao del Norte, Misamis Occidental, Misamis Oriental", "http://region10.dost.gov.ph"),
    R("DOST Region XI", "MINDANAO", "Davao Region", "Davao de Oro, Davao del Norte, Davao del Sur, Davao Occidental, Davao Oriental", "http://region11.dost.gov.ph"),
    R("DOST Region XII", "MINDANAO", "SOCCSKSARGEN", "Cotabato, Sarangani, South Cotabato, Sultan Kudarat", "http://region12.dost.gov.ph"),
    R("DOST Caraga", "MINDANAO", "Caraga", "Agusan del Norte, Agusan del Sur, Dinagat Islands, Surigao del Norte, Surigao del Sur", "http://caraga.dost.gov.ph")
  ];
  const REGIONS = [["ALL", "All regions"], ["LUZON", "Luzon"], ["VISAYAS", "Visayas"], ["MINDANAO", "Mindanao"]];

  /* News: DOST's own headlines, with a one-line summary of what the article reports.
     img = local photo (media/news, Unsplash licence, illustrative only), credit = photographer.
     FEATURED = the ids in the carousel, in order. */
  const N = "https://www.dost.gov.ph/knowledge-resources/news/";
  const FEATURED = [8, 2, 5, 3];
  const NEWS = [
    { id: 1, cat: "COMMUNITY", badge: "Communities", date: "12 Nov 2026", title: "DOST CEST to honor best community programs at 2026 NSTW",
      url: N + "4598-dost-cest-to-honor-best-community-programs-at-2026-nstw.html",
      summary: "The Community Empowerment thru Science and Technology program will recognise its best community programs during the 2026 National Science, Technology and Innovation Week.",
      body: ["The Community Empowerment thru Science and Technology (CEST) program will recognise its best community programs during the 2026 National Science, Technology and Innovation Week (NSTW)."] },
    { id: 2, img: "media/news/n1.webp", credit: "Daniel Dan / Unsplash", cat: "AGRI", badge: "Agriculture", date: "11 Nov 2026", title: "Smart agri-tech to help improve cacao farming in Apayao",
      url: N + "4592-smart-agri-tech-to-help-improve-cacao-farming-in-apayao.html",
      summary: "Smart agriculture technology from DOST is set to help cacao farmers in Apayao improve their farming.",
      body: ["Smart agriculture technology from DOST is set to help cacao farmers in Apayao improve their farming."] },
    { id: 3, img: "media/news/n2.webp", credit: "Leonie Clough / Unsplash", cat: "COMMUNITY", badge: "Communities", date: "11 Nov 2026", title: "Newly deployed e-vehicles to move Apayao folks",
      url: N + "4591-newly-deployed-e-vehicles-to-move-apayao-folks.html",
      summary: "Electric vehicles newly deployed in Luna, Apayao will carry residents around the town.",
      body: ["Electric vehicles newly deployed in Luna, Apayao will carry residents around the town."] },
    { id: 4, cat: "DEPT", badge: "Department", date: "11 Nov 2026", title: "Science department pushes for data that matters",
      url: N + "4590-science-department-pushes-for-data-that-matters.html",
      summary: "The science department makes the case for data that matters.",
      body: ["The science department makes the case for data that matters."] },
    { id: 5, img: "media/news/n3.webp", credit: "Daniele Franchi / Unsplash", cat: "HAZARD", badge: "Weather & hazards", date: "9 Nov 2026", title: "DOST-PAGASA to build Doppler radar station in Abucay, Bataan for enhanced weather monitoring",
      url: N + "4589-dost-pagasa-to-build-doppler-radar-station-in-abucay-bataan-for-enhanced-weather-monitoring.html",
      summary: "PAGASA will build a Doppler weather radar station in Abucay, Bataan.",
      body: ["PAGASA will build a Doppler weather radar station in Abucay, Bataan."] },
    { id: 6, cat: "DEPT", badge: "Department", date: "9 Nov 2026", title: "DOST-STII strengthens its commitment to promote disability sensitivity and awareness",
      url: N + "4588-dost-stii-strengthens-its-commitment-to-promote-disability-sensitivity-and-awareness-2.html",
      summary: "The Science and Technology Information Institute strengthens its commitment to promoting disability sensitivity.",
      body: ["The Science and Technology Information Institute strengthens its commitment to promoting disability sensitivity."] },
    { id: 7, cat: "AGRI", badge: "Agriculture", date: "9 Nov 2026", title: "Featured in 2026 NSTW: New agri-aqua yield-improving techs",
      url: N + "4587-featured-in-2026-nstw-new-agri-aqua-yield-improving-techs.html",
      summary: "New agriculture and aquaculture technologies that improve yields are featured at the 2026 NSTW in General Santos City.",
      body: ["New agriculture and aquaculture technologies that improve yields are featured at the 2026 NSTW in General Santos City."] },
    { id: 8, img: "media/news/n4.webp", credit: "Karlo King / Unsplash", cat: "HAZARD", badge: "Weather & hazards", date: "9 Nov 2026", title: "DOST launches flood forecasting center for Apayao-Abulug River Basin",
      url: N + "4586-dost-launches-flood-forecasting-center-for-apayao-abulug-river-basin.html",
      summary: "A Flood Forecasting and Warning Center for the Apayao-Abulug River Basin was inaugurated in Luna, Apayao on 4 November 2026.",
      body: ["A Flood Forecasting and Warning Center for the Apayao-Abulug River Basin was inaugurated in Luna, Apayao on 4 November 2026."] }
  ];
  const CATS = [["ALL", "All news"], ["HAZARD", "Weather & hazards"], ["AGRI", "Agriculture"], ["COMMUNITY", "Communities"], ["DEPT", "Department"]];

  /* Site search: fixed entries (offices, news and announcements are added from the lists above) */
  const SEARCH = [
    { label: "About DOST: mandate, mission and vision", kind: "Page", keys: "about mandate mission vision history logo secretary solidum", href: "about.html" },
    { label: "S&T Scholarships (DOST-SEI)", kind: "Program", keys: "scholarship iskolar sei undergraduate graduate ra 7687 merit", href: "programs.html#scholarships" },
    { label: "SETUP for MSMEs", kind: "Program", keys: "setup small enterprise technology upgrading msme business", href: "programs.html#setup" },
    { label: "Grants-In-Aid (GIA) Program", kind: "Program", keys: "gia grants in aid research funding proposal dpmis", href: "https://dpmisv2.dost.gov.ph/" },
    { label: "Balik Scientist Program", kind: "Program", keys: "balik scientist bsp filipino scientists abroad return", href: "http://bsp.dost.gov.ph/" },
    { label: "DOST-JSPS Joint Scientific Research Program", kind: "Program", keys: "jsps japan joint research proposal", href: "https://www.dost.gov.ph/products-and-services/application-to-the-dost-jsps-joint-scientific-research-program.html" },
    { label: "Community Empowerment thru S&T (CEST)", kind: "Program", keys: "cest community empowerment barangay livelihood", href: "programs.html#cest" },
    { label: "PAGASA weather forecasts", kind: "Hazards", keys: "pagasa weather typhoon rain forecast", href: "https://www.pagasa.dost.gov.ph/" },
    { label: "PHIVOLCS earthquake and volcano bulletins", kind: "Hazards", keys: "phivolcs earthquake volcano tsunami bulletin", href: "https://www.phivolcs.dost.gov.ph/" },
    { label: "Attached agencies and councils", kind: "Page", keys: "agencies councils pcaarrd pchrd pcieerd asti fnri fprdi itdi mirdc pnri ptri pshs sei stii tapi nast nrcp", href: "agencies.html" },
    { label: "Contact DOST", kind: "Page", keys: "contact phone trunkline address bicutan taguig", href: "contact.html" },
    { label: "Transparency Seal", kind: "Page", keys: "transparency budget procurement bids saln foi", href: "transparency.html" }
  ];

  return { ISSUANCES, ISS_TYPES, ISS_TONE: { DO: "royal", DM: "amber", OS: "red" }, OFFICES, REGIONS, NEWS, FEATURED, CATS, SEARCH, POSTS: {}, FAQ: {} };
})();
