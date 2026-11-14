/* DEPARTMENT DATA. Everything a page lists or filters lives here, so a new department swaps this file.
   Figures follow dfa.gov.ph / consular.dfa.gov.ph at the time of writing; check the official site before relying on them. */
window.DATA = (() => {
  /* requirements & fees tool (home + services) */
  const SVC = {
    new_passport: { tab: "New Passport", title: "New adult passport (10-year validity)",
      reg: ["₱950"], exp: ["₱1,200"], regD: "12 working days in Metro Manila", expD: "6 working days in Metro Manila, 7 outside",
      url: ["https://www.passport.gov.ph/", "passport.gov.ph"], page: "passport.html",
      note: "Personal appearance is required. Senior citizens, persons with disability, pregnant women and children 7 and under may use the Courtesy Lane.",
      list: ["Confirmed online appointment and printed application form", "Original and photocopy of your PSA birth certificate on security paper", "At least one valid government-issued ID (PhilID or ePhilID, driver’s licence, UMID, PRC ID)", "Married women using their husband’s surname: original PSA marriage certificate"] },
    renewal: { tab: "Passport Renewal", title: "ePassport renewal (adult, 10-year validity)",
      reg: ["₱950"], exp: ["₱1,200"], regD: "12 working days in Metro Manila", expD: "6 working days in Metro Manila, 7 outside",
      url: ["https://www.passport.gov.ph/", "passport.gov.ph"], page: "passport.html#renewal",
      note: "You don’t need a PSA birth certificate for a plain renewal of an existing ePassport, unless you are changing your civil status or personal details.",
      list: ["Confirmed online appointment and printed application form", "Your current Philippine ePassport and a photocopy of its data page", "Civil registry documents only if you are updating your name or marital status"] },
    apostille: { tab: "Apostille", title: "Document apostille and authentication",
      reg: ["₱100", "per document"], exp: ["₱200", "per document"], regD: "Released in 5 working days", expD: "Released in 2 working days",
      url: ["https://www.apostille.gov.ph/", "apostille.gov.ph"], page: "apostille.html",
      note: "Documents from PSA, NBI, CHED, DepEd and LTO must be verified by the issuing agency first. Release times follow the DFA advisory of 15 May 2023.",
      list: ["Confirmed apostille online appointment slip", "The original public document (PSA certificate, NBI clearance, diploma or TOR with CAV, SPA)", "Valid government-issued ID of the applicant or authorised representative", "If a representative files: signed authorisation letter or SPA and a photocopy of the owner’s ID"] },
    lost_passport: { tab: "Lost / Damaged", title: "Replacement of a lost or damaged ePassport",
      reg: ["₱1,300", "incl. ₱350 penalty"], exp: ["₱1,550", "incl. ₱350 penalty"], regD: "12 working days after clearance", expD: "6 working days after clearance",
      url: ["https://www.passport.gov.ph/", "passport.gov.ph"], page: "passport.html#lost",
      note: "A lost passport that is still valid goes through a 15-working-day clearing period before a replacement can be issued.",
      list: ["Confirmed online appointment and printed application form", "Notarised affidavit of loss, or affidavit of mutilation for a damaged passport", "Original PSA birth certificate and a valid government-issued ID", "Police report in English, if the lost passport is still valid"] }
  };

  /* services hub */
  const SERVICES = [
    { icon: "passport", tone: "royal", group: "For Filipinos", title: "Passport", href: "passport.html", text: "Apply for a new passport, renew, replace a lost one, or apply for a minor.", fee: "From ₱950", time: "6–12 working days" },
    { icon: "doc", tone: "amber", group: "For Filipinos", title: "Apostille", href: "apostille.html", text: "Authenticate Philippine public documents for use in Apostille Convention countries.", fee: "₱100 per document", time: "2–5 working days" },
    { icon: "life", tone: "red", group: "For Filipinos abroad", title: "Assistance to Nationals", href: "atn.html", text: "Legal, medical and repatriation help for Filipinos in distress overseas.", fee: "Free", time: "24/7" },
    { icon: "book", tone: "royal", group: "For Filipinos abroad", title: "Civil registry abroad", href: "posts.html", text: "Report a birth, marriage or death that happened abroad at the post covering your city.", fee: "Set by each post", time: "Varies by post" },
    { icon: "scale", tone: "green", group: "For Filipinos abroad", title: "Notarial services", href: "posts.html", text: "Acknowledgements, affidavits and special powers of attorney signed abroad.", fee: "Set by each post", time: "Same day at most posts" },
    { icon: "plane", tone: "green", group: "For foreign nationals", title: "Visa & entry", href: "visa.html", text: "Visa-free entry, the Philippine e-Visa and visa types for longer stays.", fee: "From US$30 (e-Visa)", time: "Up to 15 working days" }
  ];

  /* consular offices in the Philippines. days = [first, last] index into Mon..Sun; hours are 24h */
  const OFFICES = [
    { name: "DFA ASEANA (Office of Consular Affairs)", region: "NCR", city: "Parañaque", address: "Bradco Ave. cor. Macapagal Blvd., Parañaque City", days: [0, 4], open: 8, close: 17, services: "Passport, Apostille, Courtesy Lane" },
    { name: "DFA NCR East (SM Megamall)", region: "NCR", city: "Mandaluyong", address: "7th Floor, Building C, SM Megamall, Mandaluyong City", days: [0, 5], open: 10, close: 18, services: "Passport & Apostille" },
    { name: "DFA NCR South (Alabang)", region: "NCR", city: "Muntinlupa", address: "Metro Alabang Town Center, Muntinlupa City", days: [0, 5], open: 10, close: 18, services: "Passport & Apostille" },
    { name: "DFA NCR Northeast (Ali Mall Cubao)", region: "NCR", city: "Quezon City", address: "Level 2, Ali Mall, Araneta City, Quezon City", days: [0, 5], open: 10, close: 18, services: "Passport & Apostille" },
    { name: "DFA CO Baguio", region: "LUZON", city: "Baguio", address: "Upper Basement, SM City Baguio, Luneta Hill, Baguio City", days: [0, 4], open: 9, close: 17, services: "Passport & Apostille" },
    { name: "DFA CO La Union", region: "LUZON", city: "San Fernando, La Union", address: "CSI Mall, San Fernando City, La Union", days: [0, 4], open: 9, close: 17, services: "Passport services" },
    { name: "DFA CO Ilocos Norte", region: "LUZON", city: "Laoag", address: "Robinsons Place Ilocos, San Nicolas, Ilocos Norte", days: [0, 4], open: 9, close: 17, services: "Passport services" },
    { name: "DFA CO Tuguegarao", region: "LUZON", city: "Tuguegarao", address: "Robinsons Place Tuguegarao, Tuguegarao City, Cagayan", days: [0, 4], open: 9, close: 17, services: "Passport services" },
    { name: "DFA CO Pampanga (San Fernando)", region: "LUZON", city: "San Fernando, Pampanga", address: "2nd Floor, Robinsons StarMills, City of San Fernando, Pampanga", days: [0, 4], open: 9, close: 17, services: "Passport & Apostille" },
    { name: "DFA CO Lipa", region: "LUZON", city: "Lipa", address: "Robinsons Place Lipa, Lipa City, Batangas", days: [0, 4], open: 9, close: 17, services: "Passport services" },
    { name: "DFA CO Lucena", region: "LUZON", city: "Lucena", address: "SM City Lucena, Lucena City, Quezon", days: [0, 4], open: 9, close: 17, services: "Passport services" },
    { name: "DFA CO Puerto Princesa", region: "LUZON", city: "Puerto Princesa", address: "Robinsons Place Palawan, Puerto Princesa City", days: [0, 4], open: 9, close: 17, services: "Passport services" },
    { name: "DFA CO Legazpi", region: "LUZON", city: "Legazpi", address: "3rd Floor, Pacific Mall Legazpi, Landco Business Park, Legazpi City", days: [0, 4], open: 9, close: 17, services: "Passport services" },
    { name: "DFA CO Cebu", region: "VISAYAS", city: "Mandaue", address: "4th Level, Pacific Mall-Metro Mandaue, Mandaue City, Cebu", days: [0, 4], open: 9, close: 17, services: "Passport & Apostille" },
    { name: "DFA CO Iloilo", region: "VISAYAS", city: "Iloilo", address: "3rd Floor, Robinsons Place Iloilo, Quezon St., Iloilo City", days: [0, 4], open: 9, close: 17, services: "Passport & Apostille" },
    { name: "DFA CO Bacolod", region: "VISAYAS", city: "Bacolod", address: "Robinsons Place Bacolod, Mandalagan, Bacolod City", days: [0, 4], open: 9, close: 17, services: "Passport services" },
    { name: "DFA CO Tacloban", region: "VISAYAS", city: "Tacloban", address: "Robinsons Place Tacloban, Marasbaras, Tacloban City", days: [0, 4], open: 9, close: 17, services: "Passport services" },
    { name: "DFA CO Dumaguete", region: "VISAYAS", city: "Dumaguete", address: "Robinsons Place Dumaguete, Calindagan, Dumaguete City", days: [0, 4], open: 9, close: 17, services: "Passport services" },
    { name: "DFA CO Davao", region: "MINDANAO", city: "Davao", address: "3rd Floor, SM City Davao, Quimpo Blvd., Ecoland, Davao City", days: [0, 4], open: 9, close: 17, services: "Passport & Apostille" },
    { name: "DFA CO Cagayan de Oro", region: "MINDANAO", city: "Cagayan de Oro", address: "5th Floor, Centrio Ayala Mall, C.M. Recto Ave., Cagayan de Oro", days: [0, 4], open: 9, close: 17, services: "Passport & Apostille" },
    { name: "DFA CO General Santos", region: "MINDANAO", city: "General Santos", address: "KCC Mall of Gensan, General Santos City", days: [0, 4], open: 9, close: 17, services: "Passport services" },
    { name: "DFA CO Zamboanga", region: "MINDANAO", city: "Zamboanga", address: "KCC Mall de Zamboanga, Zamboanga City", days: [0, 4], open: 9, close: 17, services: "Passport services" },
    { name: "DFA CO Butuan", region: "MINDANAO", city: "Butuan", address: "Robinsons Place Butuan, Butuan City", days: [0, 4], open: 9, close: 17, services: "Passport services" }
  ];
  const REGIONS = [["ALL", "All regions"], ["NCR", "Metro Manila"], ["LUZON", "Luzon"], ["VISAYAS", "Visayas"], ["MINDANAO", "Mindanao"]];

  /* newsroom. body = paragraphs; url = original on the official site where one exists */
  /* DEPARTMENT SWAP: news. img = local photo (media/news, Unsplash licence), credit = photographer.
     FEATURED = the ids shown in the home and newsroom carousel, in order. */
  const FEATURED = [10, 1, 3, 5];
  const NEWS = [
    { id: 1, img: "media/news/n1.webp", credit: "Priscilla Du Preez", cat: "CONSULAR", badge: "Consular Advisory", date: "Standing advisory", title: "Strict advisory against online passport appointment scammers and fixers",
      summary: "Passport appointment slots are booked only through passport.gov.ph, and booking is completely free.",
      body: ["The Department of Foreign Affairs does not authorise any social media page, travel agency or individual to sell passport appointment slots.", "Book only through the official portal at passport.gov.ph and pay only through the authorised payment channels listed there. Report anyone selling slots to the Office of Consular Affairs."] },
    { id: 7, img: "media/news/n7.webp", credit: "Lumin Osity", cat: "TRAVEL", badge: "Travel Advisory", date: "Standing advisory", title: "How crisis alert levels work, and what each one asks of you",
      summary: "Alert Levels 1 to 4 tell Filipinos in a country what to do, from taking precautions to mandatory repatriation.",
      body: ["Alert Level 1 (precautionary phase) asks Filipinos to take precautions and stay informed. Alert Level 2 (restriction phase) restricts non-essential movement and bars new deployment of workers.", "Alert Level 3 (voluntary repatriation) offers government-funded return flights to those who want to come home. Alert Level 4 (mandatory repatriation) means everyone is asked to leave the country, with the government arranging travel.", "Check the current alert level for your host country with the nearest Philippine Embassy or Consulate General before you travel."] },
    { id: 8, img: "media/news/n8.webp", credit: "Holiday Extras", cat: "TRAVEL", badge: "Travel Reminder", date: "Standing advisory", title: "Register on eTravel within 72 hours before you fly to the Philippines",
      summary: "Every arriving passenger, Filipino or foreign, completes the free eTravel registration before departure.",
      body: ["eTravel at etravel.gov.ph replaced the paper arrival card. It is free; any site that charges a fee is not official.", "Keep the QR code you receive on your phone or printed. Airline staff and immigration officers may ask to see it."] },
    { id: 2, img: "media/news/n2.webp", credit: "Markus Spiske", cat: "CONSULAR", badge: "Consular Advisory", date: "15 May 2023", title: "Authenticated documents now released in 5 working days, or 2 when expedited",
      summary: "The DFA adjusted the release dates for apostille and authentication services.",
      body: ["Starting 15 May 2023, documents for regular processing are released after five working days and expedited documents after two working days.", "Applicants who chose courier delivery receive their documents through the courier after the release date."], url: "https://dfa.gov.ph/dfa-news/statements-and-advisoriesupdate/32435-public-advisory-adjusted-dates-of-release-for-authentication-services-2" },
    { id: 9, img: "media/news/n9.webp", credit: "Hector Reyes", cat: "CONSULAR", badge: "Consular Advisory", date: "Standing advisory", title: "Who can use the passport Courtesy Lane without an appointment",
      summary: "Senior citizens, persons with disability, pregnant women, solo parents and young children may walk in.",
      body: ["The Courtesy Lane serves senior citizens, persons with disability, pregnant women, solo parents and children 7 years old and below together with their parents.", "Bring proof of eligibility, such as a senior citizen ID, PWD ID or solo parent ID, together with the usual passport requirements. Each consular office sets a daily Courtesy Lane cut-off, so arrive early."] },
    { id: 3, img: "media/news/n3.webp", credit: "BaljkanN4", cat: "TRAVEL", badge: "OFW Notice", date: "OFW welfare notice", title: "24/7 Assistance-to-Nationals hotlines active at all foreign service posts",
      summary: "Filipinos overseas who need urgent legal, medical or crisis help can contact the nearest embassy or the Manila ATN operations centre.",
      body: ["All Philippine foreign service posts keep round-the-clock Assistance-to-Nationals duty officers.", "Overseas Filipinos in distress are encouraged to register their location with the nearest Philippine Embassy or Consulate General for rapid emergency coordination."] },
    { id: 10, img: "media/news/n10.webp", credit: "Saj Shafique", cat: "DIPLOMACY", badge: "Foreign Policy", date: "2026", title: "The Philippines takes up the ASEAN Chairmanship for 2026",
      summary: "The Department leads preparations for a year of ASEAN meetings hosted across the country.",
      body: ["As ASEAN Chair, the Philippines hosts the ASEAN Summits and ministerial meetings and sets the year’s priorities for the region.", "The Department of Foreign Affairs coordinates the national organising effort with other government agencies and host cities."] },
    { id: 11, img: "media/news/n11.webp", credit: "Al Reile Dela Torre", cat: "CONSULAR", badge: "Public Service", date: "Recurring", title: "Passport on Wheels brings passport processing to provinces and towns",
      summary: "Mobile passport units visit communities far from a consular office, with the same requirements and fees.",
      body: ["Passport on Wheels sets up a mobile passport office in partnership with local government units. Applicants still book a slot and bring the usual documents.", "Watch the social media pages of your local government and the DFA for upcoming schedules in your area."] },
    { id: 4, img: "media/news/n4.webp", credit: "Scott Graham", cat: "CONSULAR", badge: "Public Advisory", date: "14 May 2019", title: "The Apostille Convention takes effect in the Philippines",
      summary: "Philippine public documents are now authenticated with an apostille instead of the red ribbon.",
      body: ["From 14 May 2019, documents authenticated by the DFA carry an apostille certificate, recognised in every country that is a party to the Apostille Convention, without further legalisation by a foreign embassy.", "Documents for countries that are not party to the Convention are still authenticated by the DFA and then legalised by that country’s embassy."], url: "https://dfa.gov.ph/authentication-functions/113-newsroom/public-advisory/22114-public-advisory-apostille-convention-on-authentication-of-documents-takes-effect-in-ph-on-14-may-2019" },
    { id: 12, img: "media/news/n12.webp", credit: "Aditya Romansa", cat: "CONSULAR", badge: "Consular Reminder", date: "Standing advisory", title: "Report births and marriages abroad at the post that covers your city",
      summary: "Events that happen overseas are recorded in the Philippine civil registry through the nearest foreign service post.",
      body: ["A Report of Birth or Report of Marriage is filed with the Philippine Embassy or Consulate General with jurisdiction over the place where the event happened.", "The post forwards the record to the Philippine Statistics Authority, after which a PSA copy can be requested in the Philippines."] },
    { id: 5, img: "media/news/n5.webp", credit: "Michael Maga-ao", cat: "DIPLOMACY", badge: "Foreign Policy", date: "Bilateral relations", title: "Philippines strengthens maritime cooperation and labour protection agreements",
      summary: "Active engagement with ASEAN and international partners to safeguard Filipino seafarers and migrant workers.",
      body: ["Through bilateral consular consultations and multilateral forums, the Department advances rules-based maritime security.", "It also negotiates stronger bilateral labour agreements that protect the rights and welfare of Overseas Filipino Workers."] },
    { id: 6, img: "media/news/n6.webp", credit: "Jeanne Paredes", cat: "DIPLOMACY", badge: "Press Release", date: "June 2024", title: "The DFA celebrates its 126th founding anniversary",
      summary: "Founded in 1898, the Department marks more than a century of Philippine diplomacy.",
      body: ["The Department of Foreign Affairs traces its founding to 23 June 1898.", "Today it is guided by the constitutional mandate of an independent foreign policy, anchored on national security, economic security and the protection of Filipinos overseas."], url: "https://dfa.gov.ph/dfa-news/dfa-releasesupdate/35109-dfa-celebrates-its-126th-founding-anniversary" }
  ];
  const CATS = [["ALL", "All updates"], ["CONSULAR", "Consular advisories"], ["TRAVEL", "Travel & OFW alerts"], ["DIPLOMACY", "Foreign policy"]];

  /* foreign service posts: [city, country, type, IANA time zone] */
  const POSTS = {
    asia: ["Asia & Pacific", [["Tokyo", "Japan", "Embassy", "Asia/Tokyo"], ["Osaka", "Japan", "Consulate General", "Asia/Tokyo"], ["Seoul", "South Korea", "Embassy", "Asia/Seoul"], ["Beijing", "China", "Embassy", "Asia/Shanghai"], ["Shanghai", "China", "Consulate General", "Asia/Shanghai"], ["Guangzhou", "China", "Consulate General", "Asia/Shanghai"], ["Xiamen", "China", "Consulate General", "Asia/Shanghai"], ["Chongqing", "China", "Consulate General", "Asia/Shanghai"], ["Hong Kong", "China (SAR)", "Consulate General", "Asia/Hong_Kong"], ["Macau", "China (SAR)", "Consulate General", "Asia/Macau"], ["Singapore", "Singapore", "Embassy", "Asia/Singapore"], ["Kuala Lumpur", "Malaysia", "Embassy", "Asia/Kuala_Lumpur"], ["Kota Kinabalu", "Malaysia", "Consulate General", "Asia/Kuching"], ["Jakarta", "Indonesia", "Embassy", "Asia/Jakarta"], ["Manado", "Indonesia", "Consulate General", "Asia/Makassar"], ["Bangkok", "Thailand", "Embassy", "Asia/Bangkok"], ["Hanoi", "Vietnam", "Embassy", "Asia/Ho_Chi_Minh"], ["Ho Chi Minh City", "Vietnam", "Consulate General", "Asia/Ho_Chi_Minh"], ["Phnom Penh", "Cambodia", "Embassy", "Asia/Phnom_Penh"], ["Vientiane", "Laos", "Embassy", "Asia/Vientiane"], ["Yangon", "Myanmar", "Embassy", "Asia/Yangon"], ["Bandar Seri Begawan", "Brunei", "Embassy", "Asia/Brunei"], ["Dili", "Timor-Leste", "Embassy", "Asia/Dili"], ["New Delhi", "India", "Embassy", "Asia/Kolkata"], ["Dhaka", "Bangladesh", "Embassy", "Asia/Dhaka"], ["Islamabad", "Pakistan", "Embassy", "Asia/Karachi"], ["Canberra", "Australia", "Embassy", "Australia/Sydney"], ["Sydney", "Australia", "Consulate General", "Australia/Sydney"], ["Wellington", "New Zealand", "Embassy", "Pacific/Auckland"], ["Port Moresby", "Papua New Guinea", "Embassy", "Pacific/Port_Moresby"], ["Hagåtña", "Guam (USA)", "Consulate General", "Pacific/Guam"]]],
    me: ["Middle East & Africa", [["Riyadh", "Saudi Arabia", "Embassy", "Asia/Riyadh"], ["Jeddah", "Saudi Arabia", "Consulate General", "Asia/Riyadh"], ["Abu Dhabi", "United Arab Emirates", "Embassy", "Asia/Dubai"], ["Dubai", "United Arab Emirates", "Consulate General", "Asia/Dubai"], ["Doha", "Qatar", "Embassy", "Asia/Qatar"], ["Kuwait City", "Kuwait", "Embassy", "Asia/Kuwait"], ["Manama", "Bahrain", "Embassy", "Asia/Bahrain"], ["Muscat", "Oman", "Embassy", "Asia/Muscat"], ["Amman", "Jordan", "Embassy", "Asia/Amman"], ["Beirut", "Lebanon", "Embassy", "Asia/Beirut"], ["Baghdad", "Iraq", "Embassy", "Asia/Baghdad"], ["Tehran", "Iran", "Embassy", "Asia/Tehran"], ["Tel Aviv", "Israel", "Embassy", "Asia/Jerusalem"], ["Cairo", "Egypt", "Embassy", "Africa/Cairo"], ["Tripoli", "Libya", "Embassy", "Africa/Tripoli"], ["Rabat", "Morocco", "Embassy", "Africa/Casablanca"], ["Abuja", "Nigeria", "Embassy", "Africa/Lagos"], ["Dakar", "Senegal", "Embassy", "Africa/Dakar"], ["Addis Ababa", "Ethiopia", "Embassy", "Africa/Addis_Ababa"], ["Nairobi", "Kenya", "Embassy", "Africa/Nairobi"], ["Pretoria", "South Africa", "Embassy", "Africa/Johannesburg"]]],
    eu: ["Europe", [["London", "United Kingdom", "Embassy", "Europe/London"], ["Dublin", "Ireland", "Embassy", "Europe/Dublin"], ["Paris", "France", "Embassy", "Europe/Paris"], ["Berlin", "Germany", "Embassy", "Europe/Berlin"], ["Frankfurt", "Germany", "Consulate General", "Europe/Berlin"], ["Madrid", "Spain", "Embassy", "Europe/Madrid"], ["Barcelona", "Spain", "Consulate General", "Europe/Madrid"], ["Lisbon", "Portugal", "Embassy", "Europe/Lisbon"], ["Rome", "Italy", "Embassy", "Europe/Rome"], ["Milan", "Italy", "Consulate General", "Europe/Rome"], ["Vatican City", "Holy See", "Embassy", "Europe/Rome"], ["The Hague", "Netherlands", "Embassy", "Europe/Amsterdam"], ["Brussels", "Belgium", "Embassy", "Europe/Brussels"], ["Bern", "Switzerland", "Embassy", "Europe/Zurich"], ["Geneva", "Switzerland", "Permanent Mission", "Europe/Zurich"], ["Vienna", "Austria", "Embassy", "Europe/Vienna"], ["Prague", "Czechia", "Embassy", "Europe/Prague"], ["Warsaw", "Poland", "Embassy", "Europe/Warsaw"], ["Budapest", "Hungary", "Embassy", "Europe/Budapest"], ["Athens", "Greece", "Embassy", "Europe/Athens"], ["Stockholm", "Sweden", "Embassy", "Europe/Stockholm"], ["Oslo", "Norway", "Embassy", "Europe/Oslo"], ["Moscow", "Russia", "Embassy", "Europe/Moscow"], ["Ankara", "Türkiye", "Embassy", "Europe/Istanbul"]]],
    am: ["Americas", [["Washington, DC", "United States", "Embassy", "America/New_York"], ["New York", "United States", "Consulate General", "America/New_York"], ["New York", "United Nations", "Permanent Mission", "America/New_York"], ["Chicago", "United States", "Consulate General", "America/Chicago"], ["Los Angeles", "United States", "Consulate General", "America/Los_Angeles"], ["San Francisco", "United States", "Consulate General", "America/Los_Angeles"], ["Honolulu", "United States", "Consulate General", "Pacific/Honolulu"], ["Ottawa", "Canada", "Embassy", "America/Toronto"], ["Toronto", "Canada", "Consulate General", "America/Toronto"], ["Vancouver", "Canada", "Consulate General", "America/Vancouver"], ["Calgary", "Canada", "Consulate General", "America/Edmonton"], ["Mexico City", "Mexico", "Embassy", "America/Mexico_City"], ["Havana", "Cuba", "Embassy", "America/Havana"], ["Brasília", "Brazil", "Embassy", "America/Sao_Paulo"], ["Buenos Aires", "Argentina", "Embassy", "America/Argentina/Buenos_Aires"], ["Santiago", "Chile", "Embassy", "America/Santiago"]]]
  };

  const FAQ = {
    passport: [
      ["Do I need an appointment?", "Yes. Book a free slot at passport.gov.ph. Only Courtesy Lane applicants (senior citizens, persons with disability, pregnant women, solo parents and children 7 and under with their parents) may walk in."],
      ["Can someone else pick up my passport?", "Yes, with a signed authorisation letter, your official receipt and valid IDs of both you and your representative. Courier delivery can also be chosen when you apply."],
      ["How long is a passport valid?", "Ten years for applicants 18 and older, five years for minors."],
      ["My passport was issued with a typo. What do I do?", "Bring the passport and your PSA birth certificate to the office that issued it. Errors made by the DFA are corrected free of charge."]
    ],
    apostille: [
      ["Which countries accept an apostille?", "Every country that is a party to the 1961 Apostille Convention. For other countries the DFA authenticates the document and the destination country’s embassy legalises it."],
      ["Do I need to have my document verified first?", "Documents issued by PSA, NBI, CHED, DepEd, TESDA, LTO and other agencies must be on security paper or verified by the issuing agency before the DFA can apostille them."],
      ["Can I apostille a photocopy?", "Only certified true copies issued by the agency that holds the original. Ordinary photocopies, even when notarised, are not accepted for most documents."]
    ],
    atn: [
      ["Is Assistance to Nationals free?", "Yes. Help from the Philippine Embassy, Consulate General and the DFA in Manila is free of charge."],
      ["Can the embassy pay my debts or legal fees?", "The ATN fund can pay for legal counsel in some cases and repatriation in crises, but it cannot pay personal debts, fines or bail."],
      ["How do I report a missing relative abroad?", "Call the ATN hotline or email oumwa@dfa.gov.ph with the person’s full name, passport number, last known address, employer and the date of last contact."]
    ],
    visa: [
      ["Who can enter without a visa?", "Nationals of over 150 countries may enter visa-free for up to 30 days for tourism or business, with a passport valid six months beyond the stay and a return ticket."],
      ["Can I extend my stay?", "Yes. Extensions are filed with the Bureau of Immigration in the Philippines, not with the DFA."],
      ["Who uses the e-Visa?", "Applicants from countries covered by the Philippine e-Visa system apply at visa.gov.ph; others apply at the Philippine Embassy or Consulate General with jurisdiction over their residence."]
    ]
  };

  return { SVC, SERVICES, OFFICES, REGIONS, NEWS, FEATURED, CATS, POSTS, FAQ };
})();
