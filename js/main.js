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

  /* ---------- Split text into letters ---------- */
  $$("[data-split]").forEach((el) => {
    const text = el.textContent;
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
  const servicesBg = $(".services__bg span");
  const services = $(".services");
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
      if (servicesBg) {
        const r = services.getBoundingClientRect();
        if (r.bottom > 0 && r.top < innerHeight) {
          servicesBg.style.setProperty("--sx", `${(r.top - innerHeight / 2) * 0.4}px`);
        }
      }
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
    burger.setAttribute("aria-label", open ? "Κλείσιμο μενού" : "Άνοιγμα μενού");
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
    if (!ok) { note.textContent = "Συμπληρώστε τα υποχρεωτικά πεδία."; return; }
    const data = new FormData(form);
    const to = ($(".act--mail") || {}).getAttribute?.("href")?.replace("mailto:", "") || "";
    const subject = `Αίτημα από ${data.get("name")}`;
    const bodyTxt = `Όνομα: ${data.get("name")}\nΤηλέφωνο: ${data.get("phone")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyTxt)}`;
    note.textContent = "Ευχαριστούμε! Ανοίγει η εφαρμογή email για να στείλετε το μήνυμα.";
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
    themeBtn.setAttribute("aria-label", light ? "Εναλλαγή σε σκούρο θέμα" : "Εναλλαγή σε φωτεινό θέμα");
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

  /* ---------- Hero video ---------- */
  const video = $("#heroVideo");
  const vBtn = $("#videoToggle");
  if (video && vBtn) {
    const setBtn = () => {
      vBtn.classList.toggle("is-paused", video.paused);
      vBtn.setAttribute("aria-label", video.paused ? "Αναπαραγωγή βίντεο" : "Παύση βίντεο");
    };
    if (reduceMotion) { video.removeAttribute("autoplay"); video.pause(); }
    else { const pr = video.play(); if (pr && pr.catch) pr.catch(() => {}); }
    video.addEventListener("play", setBtn);
    video.addEventListener("pause", setBtn);
    vBtn.addEventListener("click", () => { video.paused ? video.play() : video.pause(); });
    // save battery: pause when the hero is off-screen
    let userPaused = false;
    vBtn.addEventListener("click", () => { userPaused = video.paused; });
    new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) video.pause();
      else if (!userPaused && !reduceMotion) video.play().catch(() => {});
    }, { threshold: 0.05 }).observe(video);
    setBtn();
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

  /* ---------- Year ---------- */
  $("#year").textContent = new Date().getFullYear();
})();
