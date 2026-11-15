/* =========================================================
   ΣΑΡΑΝΤΗΣ — Greek / English language switch
   The page is written in Greek; this swaps visible text and
   accessibility labels to English (and back) without reloading.
   ========================================================= */
(() => {
  "use strict";

  const EN = {
    /* header / nav */
    "ΟΙΚΟΔΟΜΙΚΑ ΥΛΙΚΑ": "BUILDING MATERIALS",
    "Η Εταιρεία": "About us",
    "Προϊόντα": "Products",
    "Υπηρεσίες": "Services",
    "Συνεργάτες": "Partners",
    "Επικοινωνία": "Contact",
    "Κριτικές": "Reviews",
    "Ζητήστε προσφορά": "Get a quote",
    "Ήχος": "Sound",

    /* hero */
    "Ό,τι χρειάζεται το έργο σας,": "Everything your project needs,",
    "κάτω από μία στέγη.": "under one roof.",
    "Δείτε τα προϊόντα": "See our products",

    /* marquee */
    "ΤΣΙΜΕΝΤΑ": "CEMENT", "ΧΡΩΜΑΤΑ": "PAINTS", "ΜΟΝΩΤΙΚΑ": "INSULATION", "ΠΛΕΓΜΑΤΑ": "MESH",
    "ΕΡΓΑΛΕΙΑ": "TOOLS", "ΚΟΛΛΕΣ": "ADHESIVES", "ΣΙΔΗΡΟΣ": "STEEL", "ΥΔΡΑΥΛΙΚΑ": "PLUMBING",

    /* about */
    "χρόνια": "years",
    "δίπλα σας": "by your side",
    "Χτίζουμε": "Building",
    "εμπιστοσύνη": "trust",
    "από το 2007.": "since 2007.",
    "Από το 2007, η": "Since 2007,",
    "Σαράντης Οικοδομικά Υλικά": "Sarantis Building Materials",
    "στέκεται δίπλα σε επαγγελματίες, εργολάβους και ιδιώτες με ποιοτικά υλικά, σωστή τιμή και τη συμβουλή που κάνει τη διαφορά.":
      "has stood by professionals, contractors and homeowners with quality materials, fair prices and the advice that makes the difference.",
    "Στο σύγχρονο κατάστημά μας θα βρείτε ό,τι χρειάζεστε για κάθε φάση του έργου — από τα θεμέλια μέχρι το τελευταίο χέρι βαφής. Επώνυμα brands, μεγάλο απόθεμα και ανθρώπους που ξέρουν τη δουλειά.":
      "In our modern store you'll find everything for every stage of your project — from the foundations to the final coat of paint. Trusted brands, large stock and people who know the job.",
    "Χρόνια εμπειρίας": "Years of experience",
    "Κατηγορίες προϊόντων": "Product categories",
    "Αφοσίωση στον πελάτη": "Customer commitment",

    /* products */
    "Όλα τα υλικά.": "All the materials.",
    "Ένας προορισμός.": "One destination.",
    "Τσιμέντα & Κονιάματα": "Cement & Mortars",
    "Τσιμέντα, έτοιμα κονιάματα, σοβάδες και ενισχυτικά για κάθε εφαρμογή.": "Cement, ready-mix mortars, plasters and additives for every application.",
    "Χρώματα & Βερνίκια": "Paints & Varnishes",
    "Πλαστικά, ακρυλικά, βερνίκια, αστάρια και αξεσουάρ βαφής.": "Emulsions, acrylics, varnishes, primers and painting accessories.",
    "Μονωτικά & Στεγανωτικά": "Insulation & Waterproofing",
    "Θερμομόνωση, υγρομόνωση, μεμβράνες και στεγανωτικά δωμάτων.": "Thermal insulation, damp-proofing, membranes and roof waterproofing.",
    "Πλέγματα & Δίχτυα": "Mesh & Netting",
    "Πλέγματα σοβά, σκίασης, περίφραξης και δίχτυα για κάθε χρήση.": "Plaster mesh, shade netting, fencing and nets for every use.",
    "Εργαλεία": "Tools",
    "Χειρός και ηλεκτρικά εργαλεία, αναλώσιμα και είδη ασφαλείας.": "Hand and power tools, consumables and safety gear.",
    "Σίδηρος & Δομικά": "Steel & Structural",
    "Οπλισμοί, δοκοί, προφίλ και δομικά στοιχεία για γερές κατασκευές.": "Rebar, beams, profiles and structural parts for solid builds.",
    "Πλακίδια & Κόλλες": "Tiles & Adhesives",
    "Κόλλες πλακιδίων, αρμόστοκοι, σιλικόνες και αφρός πολυουρεθάνης.": "Tile adhesives, grouts, silicones and polyurethane foam.",
    "Υδραυλικά": "Plumbing",
    "Σωλήνες, εξαρτήματα, φρεάτια και υλικά αποχέτευσης.": "Pipes, fittings, manholes and drainage materials.",

    /* services */
    "Δεν πουλάμε απλώς υλικά.": "We don't just sell materials.",
    "Στηρίζουμε έργα.": "We support projects.",
    "Τεχνική συμβουλή": "Technical advice",
    "Σας βοηθάμε να διαλέξετε το σωστό υλικό για την κάθε εφαρμογή — χωρίς περιττά έξοδα.": "We help you choose the right material for each job — with no unnecessary costs.",
    "Προσφορές για έργα": "Project quotes",
    "Κοστολόγηση και ειδικές τιμές για επαγγελματίες, εργολάβους και μεγάλες ποσότητες.": "Costing and special prices for professionals, contractors and large quantities.",
    "Μεταφορά υλικών": "Material delivery",
    "Τα υλικά σας φτάνουν εκεί που τα χρειάζεστε, την ώρα που τα χρειάζεστε.": "Your materials arrive where you need them, when you need them.",
    "Επώνυμα brands": "Trusted brands",
    "Συνεργαζόμαστε με αξιόπιστους κατασκευαστές για ποιότητα που διαρκεί.": "We work with reliable manufacturers for quality that lasts.",

    /* partners */
    "Συνεργαζόμαστε με": "We partner with",
    "τους καλύτερους.": "the best.",

    /* reviews */
    "Τι λένε": "What our",
    "οι πελάτες μας.": "customers say.",
    "αξιολογήσεις στο Google": "ratings on Google",
    "Δείτε μας στο Google": "See us on Google",

    /* CTA */
    "Έχετε έργο;": "Got a project?",
    "Ας το χτίσουμε μαζί.": "Let's build it together.",

    /* contact */
    "Ελάτε να": "Come and",
    "μας γνωρίσετε.": "meet us.",
    "Είμαστε στην": "We're in",
    "Κρεμαστή Ρόδου": "Kremasti, Rhodes",
    ", στη Λεωφ. Ελευθερίας 1Α. Πατήστε για κλήση, email ή οδηγίες.": ", at 1A Eleftherias Ave. Tap to call, email or get directions.",
    "Καλέστε μας": "Call us",
    "Στείλτε email": "Send an email",
    "Οδηγίες χάρτη": "Directions",
    "Λεωφ. Ελευθερίας 1Α": "1A Eleftherias Ave",
    "Κρεμαστή 851 04, Ρόδος": "Kremasti 851 04, Rhodes",
    "Στείλτε μας μήνυμα": "Send us a message",
    "Ονοματεπώνυμο": "Full name",
    "Τηλέφωνο": "Phone",
    "Τι χρειάζεστε;": "What do you need?",
    "Αποστολή": "Send",

    /* hours */
    "Ωράριο λειτουργίας": "Opening hours",
    "Δευ–Παρ 07–18 · Σάβ 07–16": "Mon–Fri 07–18 · Sat 07–16",
    "Ανοιχτά τώρα": "Open now",
    "Κλειστά τώρα": "Closed now",
    "Δευτέρα": "Monday", "Τρίτη": "Tuesday", "Τετάρτη": "Wednesday", "Πέμπτη": "Thursday",
    "Παρασκευή": "Friday", "Σάββατο": "Saturday", "Κυριακή": "Sunday",
    "Κλειστά": "Closed",
    "Ωράριο": "Hours",
    "Δευτέρα – Παρασκευή": "Monday – Friday",

    /* mobile dock / footer */
    "Οδηγίες": "Directions",
    "Κλήση": "Call",
    "Χρειάζεστε υλικά για το έργο σας;": "Need materials for your project?",
    "Ό,τι χρειάζεται το έργο σας, κάτω από μία στέγη. Ποιοτικά υλικά, σωστές τιμές και η συμβουλή που κάνει τη διαφορά.":
      "Everything your project needs, under one roof. Quality materials, fair prices and the advice that makes the difference.",
    "EST. 2007 · ΚΡΕΜΑΣΤΗ ΡΟΔΟΥ": "EST. 2007 · KREMASTI, RHODES",
    "Πλοήγηση": "Navigation",
    "Σαράντης Οικοδομικά Υλικά. Με επιφύλαξη παντός δικαιώματος.": "Sarantis Building Materials. All rights reserved.",
    "Επιστροφή επάνω": "Back to top",

    /* accessibility labels & titles */
    "Ενεργοποίηση ήχου": "Turn sound on",
    "Απενεργοποίηση ήχου": "Turn sound off",
    "Σαράντης — αρχική": "Sarantis — home",
    "Κύριο μενού": "Main menu",
    "Εναλλαγή σε φωτεινό θέμα": "Switch to light theme",
    "Εναλλαγή σε σκούρο θέμα": "Switch to dark theme",
    "Φωτεινό / Σκούρο θέμα": "Light / dark theme",
    "Άνοιγμα μενού": "Open menu",
    "Κλείσιμο μενού": "Close menu",
    "Σαράντης": "Sarantis",
    "Κύλιση προς τα κάτω": "Scroll down",
    "Το κατάστημα Σαράντης Οικοδομικά Υλικά": "The Sarantis Building Materials store",
    "Εταιρείες με τις οποίες συνεργαζόμαστε": "Companies we work with",
    "Προηγούμενη εταιρεία": "Previous company",
    "Επόμενη εταιρεία": "Next company",
    "Επιλογή εταιρείας": "Choose a company",
    "5 στα 5 αστέρια": "5 out of 5 stars",
    "4 στα 5 αστέρια": "4 out of 5 stars",
    "Κριτική Google": "Google review",
    "Ακόμη 14 αξιολογήσεις 5 αστέρων": "14 more 5-star ratings",
    "Κλήση στο 22410 92790": "Call 22410 92790",
    "Email στο sarantis1985@hotmail.com": "Email sarantis1985@hotmail.com",
    "Οδηγίες στο Google Maps (ανοίγει νέα καρτέλα)": "Directions on Google Maps (opens a new tab)",
    "Ωράριο ανά ημέρα": "Hours by day",
    "Χάρτης — Σαράντης Οικοδομικά Υλικά, Κρεμαστή": "Map — Sarantis Building Materials, Kremasti",
    "Γρήγορη επικοινωνία": "Quick contact",
    "Μενού υποσέλιδου": "Footer menu",
    "Επιστροφή στην κορυφή": "Back to top",
    "Ελληνικά / English": "Ελληνικά / English",

    /* messages created by the page script */
    "Συμπληρώστε τα υποχρεωτικά πεδία.": "Please fill in the required fields.",
    "Ευχαριστούμε! Ανοίγει η εφαρμογή email για να στείλετε το μήνυμα.": "Thank you! Your email app is opening so you can send the message.",
  };
  // "Μετάβαση στο X" / "Λογότυπο X" (partner carousel)
  ["ISOMAT", "VITEX", "KNAUF", "KEBE", "BAUER"].forEach((b) => {
    EN["Μετάβαση στο " + b] = "Go to " + b;
    EN["Λογότυπο " + b] = b + " logo";
  });

  const META = {
    el: {
      title: "Σαράντης | Οικοδομικά Υλικά",
      desc: "Σαράντης Οικοδομικά Υλικά — τσιμέντα, χρώματα, μονωτικά, πλέγματα, εργαλεία και ό,τι χρειάζεται το έργο σας. Από το 2007.",
    },
    en: {
      title: "Sarantis | Building Materials in Rhodes",
      desc: "Sarantis Building Materials in Kremasti, Rhodes — cement, paints, insulation, mesh, tools and everything your project needs. Since 2007.",
    },
  };

  const norm = (s) => s.replace(/\s+/g, " ").trim();
  const ATTRS = ["aria-label", "title", "alt", "placeholder"];
  const textOrig = new WeakMap();   // text node -> original Greek
  const SKIP = "script, style, .rv-card blockquote, .rv-card strong, .rv-chip, .f-giant, .brand__text strong, .hero__title, [data-i18n-skip]";

  let lang = "el";

  function t(gr) {
    if (lang !== "en") return gr;
    return EN[norm(gr)] || gr;
  }

  function swapText(root) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) {
      const p = n.parentElement;
      if (!p || p.closest(SKIP) || p.closest("[data-split]")) continue;
      let orig = textOrig.get(n);
      if (orig === undefined) {
        if (!norm(n.nodeValue)) continue;
        orig = n.nodeValue;
        textOrig.set(n, orig);
      }
      const key = norm(orig);
      if (lang === "en" && EN[key]) {
        const lead = orig.match(/^\s*/)[0], trail = orig.match(/\s*$/)[0];
        n.nodeValue = lead + EN[key] + trail;
      } else {
        n.nodeValue = orig;
      }
    }
  }

  const GR = {};
  Object.keys(EN).forEach((k) => { GR[EN[k]] = k; });
  function swapAttrs(root) {
    root.querySelectorAll("[aria-label], [title], [alt], [placeholder]").forEach((el) => {
      ATTRS.forEach((a) => {
        if (!el.hasAttribute(a)) return;
        const cur = norm(el.getAttribute(a));
        const next = lang === "en" ? EN[cur] : GR[cur];
        if (next) el.setAttribute(a, next);
      });
    });
  }

  // letter-by-letter subtitle in the hero
  function swapSplit() {
    document.querySelectorAll("[data-split][data-orig]").forEach((el) => {
      const gr = el.dataset.orig;
      const txt = lang === "en" && EN[norm(gr)] ? EN[norm(gr)] : gr;
      if (el.dataset.cur === txt) return;
      el.dataset.cur = txt;
      el.textContent = "";
      [...txt].forEach((ch, i) => {
        const o = document.createElement("span"); o.className = "ch";
        const s = document.createElement("span"); s.textContent = ch === " " ? " " : ch;
        s.style.setProperty("--i", i);
        o.appendChild(s); el.appendChild(o);
      });
    });
  }

  function apply() {
    const html = document.documentElement;
    html.lang = lang;
    document.title = META[lang].title;
    const md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute("content", META[lang].desc);
    swapText(document.body);
    swapAttrs(document.body);
    swapSplit();
    // rolling nav labels use data-label
    document.querySelectorAll(".nav__link").forEach((a) => a.setAttribute("data-label", a.textContent.trim()));
    document.querySelectorAll(".lang-toggle").forEach((b) => {
      b.dataset.lang = lang;
      b.setAttribute("aria-label", lang === "en" ? "Αλλαγή γλώσσας σε Ελληνικά" : "Switch language to English");
    });
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
  }

  function set(next, animate) {
    if (next === lang && !animate) return;
    lang = next === "en" ? "en" : "el";
    try { localStorage.setItem("lang", lang); } catch (e) {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (animate && !reduce) {
      document.body.classList.add("lang-out");
      setTimeout(() => {
        apply();
        document.body.classList.remove("lang-out");
        document.body.classList.add("lang-in");
        setTimeout(() => document.body.classList.remove("lang-in"), 500);
      }, 230);
    } else {
      apply();
    }
  }

  function init() {
    let saved = null;
    try { saved = localStorage.getItem("lang"); } catch (e) {}
    const q = new URLSearchParams(location.search).get("lang");
    let start = q || saved;
    if (!start) {
      // first visit: Greek browsers get Greek, everyone else English
      const nav = (navigator.languages && navigator.languages[0]) || navigator.language || "el";
      start = /^el\b/i.test(nav) ? "el" : "en";
    }
    lang = "el";
    if (start === "en") set("en", false); else apply();
    document.querySelectorAll(".lang-toggle").forEach((b) =>
      b.addEventListener("click", () => set(lang === "en" ? "el" : "en", true))
    );
  }

  window.I18N = { t, init, get lang() { return lang; }, set };
})();
