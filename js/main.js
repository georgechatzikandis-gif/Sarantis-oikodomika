/* =========================================================
   ΣΑΡΑΝΤΗΣ — Οικοδομικά Υλικά · interactions & animation
   ========================================================= */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const body = document.body;
  const T = (gr) => (window.I18N ? window.I18N.t(gr) : gr);
  const isEN = () => document.documentElement.lang === "en";

  /* ---------- Split text into letters ---------- */
  $$("[data-split]").forEach((el) => {
    const text = el.textContent;
    el.dataset.orig = text;
    el.textContent = "";
    el.setAttribute("aria-hidden", "true");
    [...text].forEach((ch, i) => {
      const outer = document.createElement("span");
      outer.className = "ch";
      const inner = document.createElement("span");
      inner.textContent = ch === " " ? " " : ch;
      inner.style.setProperty("--i", i);
      outer.appendChild(inner);
      el.appendChild(outer);
    });
  });

  /* Nav hover labels (rolling text) */
  $$(".nav__link").forEach((a) => a.setAttribute("data-label", a.textContent.trim()));

  /* ---------- Loader ---------- */
  const loader = $("#loader");
  const bar = $("#loaderBar");
  const pct = $("#loaderPct");
  let progress = 0;
  let loaded = false;
  const start = performance.now();
  const MIN_TIME = reduceMotion ? 0 : 1500;

  window.addEventListener("load", () => { loaded = true; });
  // Safety: never block the page for more than 5s
  setTimeout(() => { loaded = true; }, 5000);

  function tickLoader(now) {
    const elapsed = now - start;
    const target = loaded ? 100 : Math.min(90, (elapsed / MIN_TIME) * 90);
    progress += (target - progress) * 0.08 + (loaded ? 0.6 : 0);
    progress = Math.min(progress, 100);
    bar.style.width = progress + "%";
    pct.textContent = Math.round(progress);
    if (progress >= 100 && elapsed >= MIN_TIME) return finishLoader();
    requestAnimationFrame(tickLoader);
  }
  function finishLoader() {
    loader.classList.add("is-done");
    body.classList.remove("is-loading");
    setTimeout(() => body.classList.add("is-ready"), 200);
    // reveal hero bits in sequence
    $$(".hero .reveal-up").forEach((el, i) => {
      el.style.setProperty("--delay", 0.7 + i * 0.15 + "s");
      setTimeout(() => el.classList.add("is-in"), 200);
    });
    setTimeout(() => loader.remove(), 1400);
  }
  requestAnimationFrame(tickLoader);

  /* ---------- Scroll reveal ---------- */
  const revealEls = $$(".reveal-up:not(.hero .reveal-up), .reveal-mask, .stat");
  // Stagger siblings
  const groups = new Map();
  revealEls.forEach((el) => {
    const p = el.parentElement;
    if (!groups.has(p)) groups.set(p, []);
    groups.get(p).push(el);
  });
  groups.forEach((list) => list.forEach((el, i) => {
    if (!el.style.getPropertyValue("--delay")) el.style.setProperty("--delay", Math.min(i * 0.09, 0.6) + "s");
  }));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      $$("[data-count], [data-count-since]", e.target).forEach(runCounter);
      if (e.target.matches("[data-count], [data-count-since]")) runCounter(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
  revealEls.forEach((el) => io.observe(el));

  /* ---------- Counters ---------- */
  function runCounter(el) {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    const end = el.dataset.countSince
      ? new Date().getFullYear() - parseInt(el.dataset.countSince, 10)
      : parseInt(el.dataset.count, 10);
    if (reduceMotion) { el.textContent = end; return; }
    const dur = 1800;
    const t0 = performance.now();
    const step = (t) => {
      const k = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - k, 4);
      el.textContent = Math.round(end * eased);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------- Header, progress, parallax (one scroll loop) ---------- */
  const header = $("#header");
  const progressBar = $("#progress");
  const toTop = $("#toTop");
  const heroMark = $("#heroMark");
  const parallaxEls = $$(".parallax");
  const ghostWords = $$(".services__bg span").map((el) => ({
    el, sec: el.closest("section"), dir: el.parentElement.classList.contains("services__bg--rev") ? -1 : 1,
  }));
  let lastY = window.scrollY;
  let ticking = false;
  let mouseX = 0, mouseY = 0;

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    progressBar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    header.classList.toggle("is-scrolled", y > 30);
    const navOpen = $("#nav").classList.contains("is-open");
    header.classList.toggle("is-hidden", !navOpen && y > lastY && y > 400);
    lastY = y;

    toTop.classList.toggle("is-visible", y > innerHeight * 0.8);

    if (!reduceMotion) {
      if (heroMark && y < innerHeight * 1.2) {
        heroMark.style.transform =
          `translate3d(${mouseX * 18}px, ${y * 0.35 + mouseY * 14}px, 0) rotate(${y * 0.04}deg) scale(${1 - y * 0.0004})`;
      }
      parallaxEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        const center = r.top + r.height / 2 - innerHeight / 2;
        el.style.setProperty("--py", `${-center * parseFloat(el.dataset.speed || 0.1) - r.height * 0.08}px`);
      });
      ghostWords.forEach(({ el, sec, dir }) => {
        const r = sec.getBoundingClientRect();
        if (r.bottom > 0 && r.top < innerHeight) {
          el.style.setProperty("--sx", `${(r.top - innerHeight / 2) * 0.4 * dir}px`);
        }
      });
    }
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  /* ---------- Active nav link ---------- */
  const navLinks = $$(".nav__link");
  const sectionIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("section[id]").forEach((s) => sectionIO.observe(s));

  /* ---------- Mobile menu ---------- */
  const burger = $("#burger");
  const nav = $("#nav");
  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", T(open ? "Κλείσιμο μενού" : "Άνοιγμα μενού"));
    body.style.overflow = open ? "hidden" : "";
    if (open) header.classList.remove("is-hidden");
  }
  burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  $$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* ---------- Custom cursor ---------- */
  if (finePointer && !reduceMotion) {
    const cursor = $("#cursor");
    const dot = $("#cursorDot");
    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    window.addEventListener("mousemove", (e) => {
      tx = e.clientX; ty = e.clientY;
      cursor.style.opacity = 1; dot.style.opacity = 1;
      dot.style.transform = `translate(${tx}px, ${ty}px)`;
    });
    (function loop() {
      cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(loop);
    })();
    $$("a, button, .card, input, textarea").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
    });
    document.addEventListener("mouseleave", () => { cursor.style.opacity = 0; dot.style.opacity = 0; });
    document.addEventListener("mouseenter", () => { cursor.style.opacity = 1; dot.style.opacity = 1; });
  }

  /* ---------- Hero mouse parallax ---------- */
  if (finePointer && !reduceMotion) {
    $("#hero").addEventListener("mousemove", (e) => {
      mouseX = e.clientX / innerWidth - 0.5;
      mouseY = e.clientY / innerHeight - 0.5;
      if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reduceMotion) {
    $$(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------- Card tilt + spotlight ---------- */
  if (finePointer && !reduceMotion) {
    $$(".tilt").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", px * 100 + "%");
        card.style.setProperty("--my", py * 100 + "%");
        card.style.transform = `rotateX(${(0.5 - py) * 10}deg) rotateY(${(px - 0.5) * 12}deg) translateY(-6px)`;
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  /* ---------- Hero canvas: floating construction blocks ---------- */
  const canvas = $("#heroCanvas");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let w, h, dpr, parts = [];
    const pointer = { x: -9999, y: -9999 };
    let particleRGB = "255,255,255";
    const readParticle = () => { particleRGB = getComputedStyle(document.documentElement).getPropertyValue("--particle").trim() || "255,255,255"; };
    readParticle();
    document.addEventListener("themechange", readParticle);

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(70, (w * h) / 22000));
      parts = Array.from({ length: count }, () => spawn(true));
    }
    function spawn(initial) {
      const yellow = Math.random() < 0.28;
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : h + 20,
        s: 2 + Math.random() * (yellow ? 7 : 5),
        vy: 0.15 + Math.random() * 0.45,
        vx: (Math.random() - 0.5) * 0.2,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.01,
        a: 0.15 + Math.random() * 0.5,
        c: yellow ? "255,214,10" : null,
      };
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        const dx = p.x - pointer.x, dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 16000) { const f = (16000 - d2) / 16000 * 1.6; const d = Math.sqrt(d2) || 1; p.x += dx / d * f; p.y += dy / d * f; }
        p.y -= p.vy; p.x += p.vx; p.rot += p.vr;
        if (p.y < -20) parts[i] = spawn(false);
        const fade = Math.min(1, p.y / (h * 0.25));
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = `rgba(${p.c || particleRGB},${p.a * fade})`;
        ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s);
        ctx.restore();
      }
      // connecting lines between near particles
      ctx.lineWidth = 1;
      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
          const a = parts[i], b = parts[j];
          const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
          if (d2 < 9000) {
            ctx.strokeStyle = `rgba(${particleRGB},${0.08 * (1 - d2 / 9000)})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      if (heroVisible) requestAnimationFrame(draw);
    }
    let heroVisible = true;
    new IntersectionObserver(([e]) => {
      const was = heroVisible;
      heroVisible = e.isIntersecting;
      if (heroVisible && !was) requestAnimationFrame(draw);
    }).observe(canvas);
    canvas.parentElement.addEventListener("mousemove", (e) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
    });
    canvas.parentElement.addEventListener("mouseleave", () => { pointer.x = pointer.y = -9999; });
    window.addEventListener("resize", resize);
    resize();
    requestAnimationFrame(draw);
  }

  /* ---------- Contact form (opens the visitor's email app) ---------- */
  const form = $("#contactForm");
  const note = $("#formNote");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    $$("[required]", form).forEach((f) => {
      const bad = !f.value.trim();
      f.parentElement.classList.toggle("is-invalid", bad);
      if (bad) ok = false;
    });
    if (!ok) { note.textContent = T("Συμπληρώστε τα υποχρεωτικά πεδία."); return; }
    const data = new FormData(form);
    const to = ($(".act--mail") || {}).getAttribute?.("href")?.replace("mailto:", "") || "";
    const subject = `Αίτημα από ${data.get("name")}`;
    const bodyTxt = `Όνομα: ${data.get("name")}\nΤηλέφωνο: ${data.get("phone")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyTxt)}`;
    note.textContent = T("Ευχαριστούμε! Ανοίγει η εφαρμογή email για να στείλετε το μήνυμα.");
    form.reset();
  });
  $$("input, textarea", form).forEach((f) => f.addEventListener("input", () => f.parentElement.classList.remove("is-invalid")));

  /* ---------- Ripple + press feedback (mouse & touch) ---------- */
  $$(".ripple").forEach((el) => {
    el.addEventListener("pointerdown", (e) => {
      const r = el.getBoundingClientRect();
      const w = document.createElement("span");
      w.className = "ripple__wave";
      w.style.left = e.clientX - r.left + "px";
      w.style.top = e.clientY - r.top + "px";
      w.style.setProperty("--rs", Math.ceil(Math.hypot(r.width, r.height) / 10));
      el.appendChild(w);
      w.addEventListener("animationend", () => w.remove());
      el.classList.remove("is-pressed");
      void el.offsetWidth; // restart icon animations
      el.classList.add("is-pressed");
      clearTimeout(el._pt);
      el._pt = setTimeout(() => el.classList.remove("is-pressed"), 900);
    });
  });

  /* ---------- Mobile dock: show after the hero ---------- */
  const dock = $("#dock");
  if (dock) {
    const showDock = () => dock.classList.toggle("is-visible", window.scrollY > innerHeight * 0.6);
    window.addEventListener("scroll", showDock, { passive: true });
    showDock();
  }

  /* ---------- Light / dark theme ---------- */
  const root = document.documentElement;
  const themeBtn = $("#themeToggle");
  const metaTheme = $('meta[name="theme-color"]');
  function syncThemeUI() {
    const light = root.dataset.theme === "light";
    themeBtn.setAttribute("aria-label", T(light ? "Εναλλαγή σε σκούρο θέμα" : "Εναλλαγή σε φωτεινό θέμα"));
    themeBtn.setAttribute("aria-pressed", String(light));
    if (metaTheme) metaTheme.setAttribute("content", light ? "#f3f2ee" : "#0a0a0a");
  }
  function applyTheme(next) {
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    syncThemeUI();
    document.dispatchEvent(new Event("themechange"));
  }
  syncThemeUI();
  document.addEventListener("langchange", syncThemeUI);
  themeBtn.addEventListener("click", () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    themeBtn.classList.remove("is-spin"); void themeBtn.offsetWidth; themeBtn.classList.add("is-spin");
    if (document.startViewTransition && !reduceMotion) {
      const r = themeBtn.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      root.style.setProperty("--tx", x + "px");
      root.style.setProperty("--ty", y + "px");
      root.style.setProperty("--tr", Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + "px");
      document.startViewTransition(() => applyTheme(next));
    } else {
      root.classList.add("theme-anim");
      applyTheme(next);
      setTimeout(() => root.classList.remove("theme-anim"), 600);
    }
  });

  /* ---------- Hero video (always plays; pauses only while off-screen to save battery) ---------- */
  const video = $("#heroVideo");
  if (video) {
    const play = () => { const pr = video.play(); if (pr && pr.catch) pr.catch(() => {}); };
    play();
    new IntersectionObserver(([e]) => { e.isIntersecting ? play() : video.pause(); }, { threshold: 0.05 }).observe(video);
  }

  /* ---------- Section photo parallax ---------- */
  const secBgs = $$(".sec-bg img");
  if (secBgs.length && !reduceMotion) {
    let bgTick = false;
    const moveBgs = () => {
      secBgs.forEach((img) => {
        const r = img.parentElement.getBoundingClientRect();
        if (r.bottom < -100 || r.top > innerHeight + 100) return;
        const off = (r.top + r.height / 2 - innerHeight / 2) * -0.12;
        const lim = r.height * 0.09;
        img.style.setProperty("--bgy", Math.max(-lim, Math.min(lim, off)) + "px");
      });
      bgTick = false;
    };
    window.addEventListener("scroll", () => { if (!bgTick) { bgTick = true; requestAnimationFrame(moveBgs); } }, { passive: true });
    window.addEventListener("resize", moveBgs);
    moveBgs();
  }

  /* ---------- Partners carousel (3D coverflow) ---------- */
  const pc = $("#pcarousel");
  if (pc) {
    const slides = $$(".pc-slide", pc);
    const dots = $$(".pc-dot");
    const dotsWrap = $(".pc-dots");
    const live = $("#pcLive");
    const n = slides.length;
    const DUR = 3500;
    let cur = 0, timer = null, hovering = false, visible = false, dragX = null, dragDX = 0;
    document.documentElement.style.setProperty("--pc-dur", DUR + "ms");

    const wrap = (d) => { d = ((d % n) + n) % n; return d > n / 2 ? d - n : d; };
    function render(extra = 0) {
      slides.forEach((s, i) => {
        const d = wrap(i - cur) + extra;
        const ad = Math.min(Math.abs(d), 3);
        s.style.setProperty("--d", d);
        s.style.setProperty("--ad", ad);
        s.style.setProperty("--z", 100 - Math.round(ad * 10));
        s.style.setProperty("--op", ad > 2.2 ? 0 : 1 - ad * 0.18);
        s.classList.toggle("is-active", i === cur);
        s.setAttribute("aria-hidden", i === cur ? "false" : "true");
      });
      dots.forEach((d, i) => {
        d.classList.remove("is-active");
        if (i === cur) { void d.offsetWidth; d.classList.add("is-active"); }
        d.setAttribute("aria-current", i === cur ? "true" : "false");
      });
    }
    function go(i, announce) {
      cur = ((i % n) + n) % n;
      render();
      if (announce) live.textContent = slides[cur].querySelector("figcaption").textContent;
      restart();
    }
    function restart() {
      clearInterval(timer);
      const auto = !reduceMotion && visible && !hovering;
      pc.classList.toggle("is-paused", !auto);
      dotsWrap.classList.toggle("no-auto", reduceMotion);
      if (auto) timer = setInterval(() => go(cur + 1), DUR);
    }

    $(".pc-arrow--prev", pc).addEventListener("click", () => go(cur - 1, true));
    $(".pc-arrow--next", pc).addEventListener("click", () => go(cur + 1, true));
    dots.forEach((d) => d.addEventListener("click", () => go(+d.dataset.go, true)));
    slides.forEach((s, i) => s.addEventListener("click", () => { if (Math.abs(dragDX) < 6 && i !== cur) go(i, true); }));
    pc.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); go(cur - 1, true); }
      if (e.key === "ArrowRight") { e.preventDefault(); go(cur + 1, true); }
    });
    if (finePointer) {
      pc.addEventListener("mouseenter", () => { hovering = true; restart(); });
      pc.addEventListener("mouseleave", () => { hovering = false; restart(); });
    }

    // drag / swipe
    pc.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".pc-arrow")) return;
      dragX = e.clientX; dragDX = 0;
      pc.setPointerCapture(e.pointerId);
    });
    pc.addEventListener("pointermove", (e) => {
      if (dragX === null) return;
      dragDX = e.clientX - dragX;
      if (Math.abs(dragDX) > 6) {
        pc.classList.add("is-dragging");
        render(dragDX / (slides[0].offsetWidth * 0.6));
      }
    });
    const endDrag = () => {
      if (dragX === null) return;
      pc.classList.remove("is-dragging");
      const w = slides[0].offsetWidth * 0.6;
      const steps = Math.round(-dragDX / w) || (Math.abs(dragDX) > 50 ? -Math.sign(dragDX) : 0);
      dragX = null;
      if (steps) go(cur + steps, true); else render();
      setTimeout(() => { dragDX = 0; }, 0);
    };
    pc.addEventListener("pointerup", endDrag);
    pc.addEventListener("pointercancel", endDrag);

    new IntersectionObserver(([e]) => { visible = e.isIntersecting; restart(); }, { threshold: 0.3 }).observe(pc);
    render();
  }

  /* ---------- Opening hours: live open / closed (Rhodes time) ---------- */
  const hoursCard = $("#hoursCard");
  if (hoursCard) {
    const rows = $$(".hrow", hoursCard);
    const statusEl = $("#hoursStatus");
    const statusTxt = $(".hstatus__txt", statusEl);
    const note = $("#hoursNote");
    const DAY_GEN = ["", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο", "Κυριακή"];
    const sched = {};
    rows.forEach((r) => {
      sched[r.dataset.day] = r.dataset.open ? { o: +r.dataset.open, c: +r.dataset.close } : null;
    });
    const fmt = (m) => String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
    const dur = (m) => {
      const h = Math.floor(m / 60), mm = m % 60;
      if (isEN()) {
        const hs = h ? `${h} ${h === 1 ? "hour" : "hours"}` : "";
        const ms = mm ? `${mm} min` : "";
        return hs && ms ? `${hs} ${ms}` : hs || ms;
      }
      if (h && mm) return `${h} ${h === 1 ? "ώρα" : "ώρες"} και ${mm}′`;
      if (h) return `${h} ${h === 1 ? "ώρα" : "ώρες"}`;
      return `${mm}′`;
    };
    function athensNow() {
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Athens", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
      }).formatToParts(new Date());
      const get = (t) => parts.find((p) => p.type === t).value;
      const day = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }[get("weekday")];
      return { day, min: (+get("hour") % 24) * 60 + +get("minute") };
    }
    let lastState = null;
    function updateHours() {
      const { day, min } = athensNow();
      const t = sched[day];
      const open = !!t && min >= t.o && min < t.c;

      hoursCard.classList.toggle("is-open", open);
      hoursCard.classList.toggle("is-closed", !open);
      $$("[data-open-chip]").forEach((chip) => {
        chip.classList.toggle("is-open", open);
        chip.classList.toggle("is-closed", !open);
        chip.querySelector("span").textContent = T(open ? "Ανοιχτά τώρα" : "Κλειστά τώρα");
      });
      const label = T(open ? "Ανοιχτά τώρα" : "Κλειστά τώρα");
      if (lastState !== open || statusTxt.textContent !== label) {
        statusTxt.textContent = label;
        statusEl.classList.remove("is-flip"); void statusEl.offsetWidth; statusEl.classList.add("is-flip");
        lastState = open;
      }

      if (open) {
        note.innerHTML = isEN() ? `Closes in <b>${dur(t.c - min)}</b> (at ${fmt(t.c)})` : `Κλείνει σε <b>${dur(t.c - min)}</b> (στις ${fmt(t.c)})`;
      } else if (t && min < t.o) {
        note.innerHTML = isEN() ? `Opens today in <b>${dur(t.o - min)}</b> (at ${fmt(t.o)})` : `Ανοίγει σήμερα σε <b>${dur(t.o - min)}</b> (στις ${fmt(t.o)})`;
      } else {
        let d = day, k = 0;
        do { d = d % 7 + 1; k++; } while (!sched[d] && k < 7);
        const when = k === 1 ? (isEN() ? "tomorrow" : "αύριο") : T(DAY_GEN[d]);
        note.innerHTML = isEN() ? `Opens <b>${when}</b> at ${fmt(sched[d].o)}` : `Ανοίγει <b>${when}</b> στις ${fmt(sched[d].o)}`;
      }

      rows.forEach((r) => {
        const today = +r.dataset.day === day;
        r.classList.toggle("is-today", today);
        if (today) r.style.setProperty("--now", (min / 1440) * 100 + "%");
      });

      // clock hands show the current time in Rhodes
      const h = Math.floor(min / 60) % 12, m = min % 60;
      $("#clockH").style.transform = `rotate(${h * 30 + m * 0.5}deg)`;
      $("#clockM").style.transform = `rotate(${m * 6}deg)`;
    }
    updateHours();
    setInterval(updateHours, 30000);
    document.addEventListener("langchange", updateHours);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) updateHours(); });
  }

  /* ---------- Background sound with speaker toggle ---------- */
  const audio = $("#siteAudio");
  const sBtn = $("#soundToggle");
  if (audio && sBtn) {
    const VOL = 0.6;
    let wantOn = true;
    try { wantOn = localStorage.getItem("sound") !== "off"; } catch (e) {}
    let fadeRaf = null;
    const fadeTo = (target, ms, done) => {
      cancelAnimationFrame(fadeRaf);
      const from = audio.volume, t0 = performance.now();
      const step = (t) => {
        const k = Math.min((t - t0) / ms, 1);
        audio.volume = from + (target - from) * k;
        if (k < 1) fadeRaf = requestAnimationFrame(step); else if (done) done();
      };
      fadeRaf = requestAnimationFrame(step);
    };
    const setUI = () => {
      const on = !audio.paused;
      sBtn.classList.toggle("is-on", on);
      sBtn.classList.toggle("is-waiting", !on && wantOn);
      sBtn.setAttribute("aria-pressed", String(on));
      sBtn.setAttribute("aria-label", T(on ? "Απενεργοποίηση ήχου" : "Ενεργοποίηση ήχου"));
      sBtn.classList.remove("is-flip"); void sBtn.offsetWidth; sBtn.classList.add("is-flip");
    };
    const start = () => {
      audio.volume = 0;
      const pr = audio.play();
      if (pr && pr.then) pr.then(() => fadeTo(VOL, 1500)).catch(() => {});
      else fadeTo(VOL, 1500);
    };
    const stop = () => fadeTo(0, 400, () => audio.pause());
    audio.addEventListener("play", setUI);
    audio.addEventListener("pause", setUI);
    document.addEventListener("langchange", setUI);

    sBtn.addEventListener("click", () => {
      if (audio.paused) { wantOn = true; start(); }
      else { wantOn = false; stop(); }
      try { localStorage.setItem("sound", wantOn ? "on" : "off"); } catch (e) {}
      setUI();
    });

    // Browsers block sound until the visitor interacts: try now, otherwise start on the first tap/click/key.
    const firstTouch = (e) => {
      if (e.target.closest && e.target.closest("#soundToggle")) return;
      ["pointerdown", "keydown", "touchend"].forEach((ev) => window.removeEventListener(ev, firstTouch, true));
      if (wantOn && audio.paused) start();
    };
    if (wantOn) {
      start();
      ["pointerdown", "keydown", "touchend"].forEach((ev) => window.addEventListener(ev, firstTouch, true));
    }
    // pause when the tab is in the background, resume when back
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) { if (!audio.paused) { audio.pause(); audio.dataset.resume = "1"; } }
      else if (audio.dataset.resume) { delete audio.dataset.resume; if (wantOn) start(); }
    });
    setUI();
  }

  /* ---------- Always start at the top; menu links scroll without adding #… to the address ---------- */
  const toTopNow = () => {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = prev;
  };
  toTopNow();
  window.addEventListener("load", toTopNow);
  window.addEventListener("pageshow", (e) => { if (e.persisted) toTopNow(); });
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    const target = id === "#" || id === "#top" ? document.body : document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    if (target === document.body) window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    else target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  });

  /* ---------- Reviews: animated score ---------- */
  const rvSum = $("#rvSummary");
  if (rvSum) {
    const scoreEl = $(".rv-summary__score", rvSum);
    const target = parseFloat(scoreEl.dataset.score);
    const rows = $(".rv-rows");
    new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        if (e.target === rvSum) {
          if (reduceMotion) { scoreEl.textContent = target.toFixed(1); }
          else {
            const t0 = performance.now();
            const tick = (t) => {
              const k = Math.min((t - t0) / 1600, 1);
              scoreEl.textContent = (target * (1 - Math.pow(1 - k, 3))).toFixed(1);
              if (k < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        }
        obs.unobserve(e.target);
      });
    }, { threshold: 0.3 }).observe(rvSum);
    if (rows) new IntersectionObserver(([e], obs) => { if (e.isIntersecting) { rows.classList.add("is-in"); obs.disconnect(); } }, { threshold: 0.2 }).observe(rows);
  }

  /* ---------- Footer reveal ---------- */
  const footerEl = $(".footer");
  if (footerEl) new IntersectionObserver(([e], obs) => { if (e.isIntersecting) { footerEl.classList.add("is-in"); obs.disconnect(); } }, { threshold: 0.08 }).observe(footerEl);

  /* ---------- Year ---------- */
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Language (Greek / English) ---------- */
  if (window.I18N) window.I18N.init();
})();
