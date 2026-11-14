/* Department of Education · concept. All department content lives here (DEPARTMENT SWAP).
   Sources: deped.gov.ph home page, Central Office directory, Transparency and Citizen's Charter pages, read 14 Nov 2026.
   Only items that appear on the official site are used; headlines keep DepEd's own Filipino wording. */
window.DATA = (() => {
  /* Issuances: DepEd Orders (DO), Memoranda (DM) and Official Statements, newest first */
  const ISSUANCES = [
    { type: "DO", no: "DO 023, s. 2026", date: "10 Nov 2026", title: "Guidelines on the Strengthened Senior High School Work Immersion, Field Exposure (Off Campus), and Arts Apprenticeship", href: "https://www.deped.gov.ph/deped-orders/" },
    { type: "DM", no: "DM 064, s. 2026", date: "26 Oct 2026", title: "Anticipatory Action, Preparedness, and Protective Measures for the 2026–2027 Super El Niño", href: "https://www.deped.gov.ph/deped-memorandum/" },
    { type: "DM", no: "DM 063, s. 2026", date: "14 Oct 2026", title: "Official List of Winners in the 2026 National Schools Press Conference", href: "https://www.deped.gov.ph/deped-memorandum/" },
    { type: "DO", no: "DO 022, s. 2026", date: "24 Sep 2026", title: "Enhanced Minimum Performance Standards and Specifications for DepEd School Infrastructure and School Furniture", href: "https://www.deped.gov.ph/deped-orders/" },
    { type: "OS", no: "Official Statement", date: "9 Mar 2026", title: "On the Death of a Learner from Taguig City", href: "https://www.deped.gov.ph/" },
    { type: "OS", no: "Official Statement", date: "17 Feb 2026", title: "On the Proposed Three-Term System", href: "https://www.deped.gov.ph/" }
  ];
  const ISS_TYPES = [["ALL", "All"], ["DO", "DepEd Orders"], ["DM", "Memoranda"], ["OS", "Statements"]];

  /* Regional offices: 16 regions by island group (BARMM runs its own ministry). Office hours are the
     standard government Monday-to-Friday schedule. */
  const OFFICES = [
    { name: "DepEd NCR", region: "LUZON", city: "Metro Manila", address: "National Capital Region · 16 cities and Pateros", days: [0, 4], open: 8, close: 17, services: "Regional office" },
    { name: "DepEd CAR", region: "LUZON", city: "Cordillera", address: "Abra, Apayao, Benguet, Ifugao, Kalinga, Mountain Province", days: [0, 4], open: 8, close: 17, services: "Regional office" },
    { name: "DepEd Region I", region: "LUZON", city: "Ilocos", address: "Ilocos Norte, Ilocos Sur, La Union, Pangasinan", days: [0, 4], open: 8, close: 17, services: "Regional office" },
    { name: "DepEd Region II", region: "LUZON", city: "Cagayan Valley", address: "Batanes, Cagayan, Isabela, Nueva Vizcaya, Quirino", days: [0, 4], open: 8, close: 17, services: "Regional office" },
    { name: "DepEd Region III", region: "LUZON", city: "Central Luzon", address: "Aurora, Bataan, Bulacan, Nueva Ecija, Pampanga, Tarlac, Zambales", days: [0, 4], open: 8, close: 17, services: "Regional office" },
    { name: "DepEd Region IV-A", region: "LUZON", city: "CALABARZON", address: "Cavite, Laguna, Batangas, Rizal, Quezon", days: [0, 4], open: 8, close: 17, services: "Regional office" },
    { name: "DepEd MIMAROPA", region: "LUZON", city: "MIMAROPA", address: "Occidental and Oriental Mindoro, Marinduque, Romblon, Palawan", days: [0, 4], open: 8, close: 17, services: "Regional office" },
    { name: "DepEd Region V", region: "LUZON", city: "Bicol", address: "Albay, Camarines Norte, Camarines Sur, Catanduanes, Masbate, Sorsogon", days: [0, 4], open: 8, close: 17, services: "Regional office" },
    { name: "DepEd Region VI", region: "VISAYAS", city: "Western Visayas", address: "Aklan, Antique, Capiz, Guimaras, Iloilo", days: [0, 4], open: 8, close: 17, services: "Regional office" },
    { name: "DepEd Region VII", region: "VISAYAS", city: "Central Visayas", address: "Bohol, Cebu, Siquijor", days: [0, 4], open: 8, close: 17, services: "Regional office" },
    { name: "DepEd Region VIII", region: "VISAYAS", city: "Eastern Visayas", address: "Biliran, Eastern Samar, Leyte, Northern Samar, Samar, Southern Leyte", days: [0, 4], open: 8, close: 17, services: "Regional office" },
    { name: "DepEd Region IX", region: "MINDANAO", city: "Zamboanga Peninsula", address: "Zamboanga del Norte, Zamboanga del Sur, Zamboanga Sibugay", days: [0, 4], open: 8, close: 17, services: "Regional office" },
    { name: "DepEd Region X", region: "MINDANAO", city: "Northern Mindanao", address: "Bukidnon, Camiguin, Lanao del Norte, Misamis Occidental, Misamis Oriental", days: [0, 4], open: 8, close: 17, services: "Regional office" },
    { name: "DepEd Region XI", region: "MINDANAO", city: "Davao Region", address: "Davao de Oro, Davao del Norte, Davao del Sur, Davao Occidental, Davao Oriental", days: [0, 4], open: 8, close: 17, services: "Regional office" },
    { name: "DepEd Region XII", region: "MINDANAO", city: "SOCCSKSARGEN", address: "Cotabato, Sarangani, South Cotabato, Sultan Kudarat", days: [0, 4], open: 8, close: 17, services: "Regional office" },
    { name: "DepEd Caraga", region: "MINDANAO", city: "Caraga", address: "Agusan del Norte, Agusan del Sur, Dinagat Islands, Surigao del Norte, Surigao del Sur", days: [0, 4], open: 8, close: 17, services: "Regional office" }
  ];
  const REGIONS = [["ALL", "All regions"], ["LUZON", "Luzon"], ["VISAYAS", "Visayas"], ["MINDANAO", "Mindanao"]];

  /* News: DepEd's own headlines (Filipino as published), with an English summary.
     img = local photo (media/news, Unsplash licence), credit = photographer.
     FEATURED = the ids in the carousel, in order. */
  const FEATURED = [1, 3, 10, 6];
  const NEWS = [
    { id: 1, img: "media/news/n1.webp", credit: "DepEd", cat: "TEACHERS", badge: "Teachers", date: "9 Nov 2026", title: "PBBM, Angara, ikinasa na ang pamamahagi ng 231,000 bagong laptop para kay titser",
      url: "https://www.deped.gov.ph/2026/11/09/pbbm-angara-ikinasa-na-ang-pamamahagi-ng-231000-bagong-laptop-para-kay-titser/",
      summary: "President Marcos and Secretary Angara launched the nationwide distribution of more than 231,000 laptops for public school teachers.",
      body: ["In Dagupan City, Pangasinan, President Ferdinand R. Marcos Jr. and Education Secretary Sonny Angara launched the nationwide distribution of more than 231,000 laptops for public school teachers under the DepEd Computerization Program. The first 209 units went to ten Dagupan schools, with a ceremonial turnover at Dagupan City National High School.",
        "Of the 231,725 laptops awarded, 169,008 are MacBooks and 62,717 are Windows laptops. Secretary Angara said the aim is to lighten teachers’ paperwork so they can focus on their learners.",
        "DepEd bought the laptops through competitive bidding at about ₱43,000 a unit, saving at least ₱1.4 billion against retail prices. Each comes with a five-year warranty and training, and suppliers have until March 2027 to complete delivery."] },
    { id: 3, img: "media/news/n2.webp", credit: "Septian Setiawan / Unsplash", cat: "LEARNERS", badge: "Senior High School", date: "13 Nov 2026", title: "Dagdag-pondo sa skills training: DepEd, pinalakas ang tulong para sa Senior High School learners",
      summary: "More funding for skills training strengthens support for Senior High School learners.", body: ["More funding for skills training strengthens support for Senior High School learners."] },
    { id: 10, img: "media/news/n3.webp", credit: "Md. Hasanuzzaman Himel / Unsplash", cat: "ADVISORY", badge: "Advisory", date: "26 Oct 2026", title: "Schools prepare for the 2026–2027 Super El Niño",
      summary: "DM 064, s. 2026 sets anticipatory action, preparedness and protective measures for schools ahead of the Super El Niño.", body: ["DM 064, s. 2026 sets anticipatory action, preparedness and protective measures for schools ahead of the Super El Niño."] },
    { id: 6, img: "media/news/n4.webp", credit: "Thomas Park / Unsplash", cat: "SCHOOLS", badge: "Schools", date: "12 Nov 2026", title: "Metro Manila schools, nakatanggap ng 130+ ICT devices mula DepEd, IT-BPM sector",
      summary: "Schools in Metro Manila received more than 130 ICT devices from DepEd and the IT-BPM sector.", body: ["Schools in Metro Manila received more than 130 ICT devices from DepEd and the IT-BPM sector."] },
    { id: 4, cat: "LEARNERS", badge: "Senior High School", date: "13 Nov 2026", title: "DepEd: SHS work immersion, mas ligtas at makabuluhan para sa learners",
      summary: "New rules make Senior High School work immersion safer and more meaningful for learners.", body: ["New rules make Senior High School work immersion safer and more meaningful for learners."] },
    { id: 5, cat: "SCHOOLS", badge: "Schools", date: "12 Nov 2026", title: "Flexible learning sa mga eskwelahan ibabatay sa local conditions sa bagong EO",
      summary: "Under a new Executive Order, flexible learning in schools will be based on local conditions.", body: ["Under a new Executive Order, flexible learning in schools will be based on local conditions."] },
    { id: 8, cat: "LEARNERS", badge: "Learners", date: "11 Nov 2026", title: "Tuition subsidy sa incoming Grade 7 ESC grantees, tataas na matapos ng halos isang dekada",
      summary: "The tuition subsidy for incoming Grade 7 ESC grantees rises for the first time in almost a decade.", body: ["The tuition subsidy for incoming Grade 7 ESC grantees rises for the first time in almost a decade."] },
    { id: 7, cat: "TEACHERS", badge: "Teachers", date: "10 Nov 2026", title: "Mga laptop ng guro, pwedeng i-disable remotely kapag ibinenta — DepEd",
      summary: "Teachers’ laptops can be disabled remotely if they are sold, DepEd says.", body: ["Teachers’ laptops can be disabled remotely if they are sold, DepEd says."] },
    { id: 9, cat: "TEACHERS", badge: "Teachers", date: "9 Nov 2026", title: "Higit 5,400 Pangasinan educators at mental health staff, nanumpa kina PBBM at Angara",
      summary: "More than 5,400 educators and mental health staff from Pangasinan took their oath.", body: ["More than 5,400 educators and mental health staff from Pangasinan took their oath."] },
    { id: 2, cat: "TEACHERS", badge: "Teachers", date: "7 Nov 2026", title: "DepEd: Mga gurong unang beses tatanggap, prayoridad sa higit 231,000 laptop",
      summary: "Teachers receiving a laptop for the first time get priority in the 231,000-unit distribution.", body: ["Teachers receiving a laptop for the first time get priority in the 231,000-unit distribution."] }
  ];
  const CATS = [["ALL", "All news"], ["LEARNERS", "Learners"], ["TEACHERS", "Teachers"], ["SCHOOLS", "Schools"], ["ADVISORY", "Advisories"]];

  /* Site search: fixed entries (offices, news and issuances are added from the lists above) */
  const SEARCH = [
    { label: "About DepEd: vision, mission and core values", kind: "Page", keys: "about mandate vision mission values history organisation secretary angara", href: "about.html" },
    { label: "K to 12 basic education and the MATATAG curriculum", kind: "Page", keys: "k12 kindergarten elementary junior high curriculum matatag ra 10533", href: "k12.html" },
    { label: "Teacher laptop program", kind: "Teachers", keys: "laptop macbook computer guroxl computerization", href: "teachers.html#laptops" },
    { label: "Adopt-a-School and Brigada Eskwela", kind: "Program", keys: "adopt a school brigada eskwela partner donate volunteer", href: "programs.html#adopt" },
    { label: "Project Bukas open data", kind: "Program", keys: "project bukas open data paaralang bukas statistics", href: "programs.html#bukas" },
    { label: "Contact DepEd", kind: "Page", keys: "contact email phone address central office pasig complaint", href: "contact.html" },
    { label: "Alternative Learning System (ALS)", kind: "Program", keys: "als alternative learning out of school youth adult a&e test diploma", href: "als.html" },
    { label: "ALS Accreditation and Equivalency Test", kind: "Program", keys: "a&e test accreditation equivalency als exam", href: "als.html#ae" },
    { label: "Strengthened Senior High School Program", kind: "Program", keys: "shs senior high grade 11 12 work immersion strengthened", href: "k12.html#shs" },
    { label: "Learner Rights and Protection Office", kind: "Help", keys: "learner rights protection bullying abuse report child", href: "programs.html#protection" },
    { label: "Public Assistance Action Center", kind: "Help", keys: "paac action center complaint help concern hotline", href: "contact.html" },
    { label: "NEAP professional development", kind: "Teachers", keys: "neap teacher training professional development matatag curriculum", href: "teachers.html#neap" },
    { label: "Scholarships", kind: "Teachers", keys: "scholarship study grant teacher", href: "teachers.html#scholar" },
    { label: "Professional Development Information System (PDIS)", kind: "Teachers", keys: "pdis login professional development system", href: "https://pdis.deped.gov.ph/" },
    { label: "Learning Management System", kind: "Teachers", keys: "lms training online course", href: "https://training.deped.gov.ph/" },
    { label: "Citizen’s Charter 2026", kind: "Page", keys: "citizens charter service standards arta", href: "transparency.html#charter" },
    { label: "Transparency Seal", kind: "Page", keys: "transparency budget procurement bids saln foi", href: "transparency.html" },
    { label: "Careers at DepEd", kind: "Page", keys: "career job vacancy hiring teacher position", href: "careers.html" }
  ];

  /* Questions on the K to 12 and ALS pages ([question, answer]) */
  const FAQ = {
    k12: [
      ["Is Kindergarten required?", "Yes. Kindergarten is the first year of compulsory basic education, before Grade 1."],
      ["What changes in the Strengthened Senior High School program?", "Learners choose an Academic or Tech-Pro track and pick electives by interest, on top of six core subjects. Full implementation starts in School Year 2026–2027."],
      ["Do private schools follow the three-term calendar?", "Public schools running the strengthened program use a three-term calendar. Private schools may keep the semestral calendar."],
      ["Which track should my child choose?", "Both tracks share the same core subjects. The Academic track suits learners aiming for college; Tech-Pro builds technical skills toward National Certifications. The school’s guidance counsellor can help."]
    ],
    als: [
      ["Who can join ALS?", "Out-of-school youth and adults who did not start or finish elementary or junior high school."],
      ["Does ALS cost anything?", "No. ALS sessions at public Community Learning Centers are free."],
      ["Is the A&E certificate the same as a diploma?", "Passers are certified as comparable graduates of the formal school system at the elementary or junior high school level, so they can go on to Senior High School, skills training or, for junior high passers, college."],
      ["When is the next A&E Test?", "DepEd announces each test through a DepEd Memorandum. Ask your ALS teacher or Schools Division Office, or check the A&E Test page on deped.gov.ph."]
    ]
  };

  return { ISSUANCES, ISS_TYPES, OFFICES, REGIONS, NEWS, FEATURED, CATS, SEARCH, POSTS: {}, FAQ };
})();
