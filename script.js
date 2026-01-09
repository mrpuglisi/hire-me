/* ===========================
   Site UI (theme, nav, tabs)
   =========================== */
(function () {
  const body = document.body;

  // Theme switcher
  const select = document.getElementById("vibe");
  if (select) {
    const KEY = "vibe4";
    select.addEventListener("change", () => {
      body.classList.remove('theme-beach','theme-goth','theme-earthy','theme-gray');
      const v = select.value;
      body.classList.add("theme-" + v);
    });
  }

  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => menu.classList.remove("open"))
    );
  }

  // Smooth scroll for in-page anchors
  document.querySelectorAll("[data-scroll]").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Tabs
  const tabs = document.querySelector(".tabs");
  if (tabs) {
    tabs.addEventListener("click", (e) => {
      const btn = e.target.closest("[role=tab]");
      if (!btn) return;
      tabs.querySelectorAll("[role=tab]").forEach((b) => b.setAttribute("aria-selected", "false"));
      btn.setAttribute("aria-selected", "true");
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("show"));
      const id = btn.getAttribute("aria-controls");
      document.getElementById(id)?.classList.add("show");
    });

    document.querySelectorAll('.chip-list button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    btn.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('is-active'));
    btn.classList.add('is-active');
  });
});
  }

  // Year + back to top
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  const toTop = document.getElementById("toTop");
  if (toTop) toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
})();

/* ===========================
   Rotating word effect
   =========================== */
(function () {
  const el = document.querySelector(".rotate-words");
  if (!el) return;

  const wordsAttr = el.getAttribute("data-words");
  if (!wordsAttr) return;

  let words = [];
  try { words = JSON.parse(wordsAttr); } catch { return; }
  if (!Array.isArray(words) || words.length === 0) return;

  let idx = 0;
  const FADE_MS = 500;
  const INTERVAL_MS = 2000;

  setInterval(() => {
    el.classList.add("fade");
    setTimeout(() => {
      idx = (idx + 1) % words.length;
      el.textContent = words[idx];
      el.classList.remove("fade");
    }, FADE_MS);
  }, INTERVAL_MS);
})();

/* ===========================
   Cat mini-game (left-dock, chase, run-back, idle rotation, final static)
   =========================== */
(function () {
  const btn    = document.getElementById("mouseHouse");
  const cat    = document.getElementById("cat");           // <img>
  const cursor = document.getElementById("mouseCursor");   // <img>
  if (!btn || !cat || !cursor) return;

  // Respect touch devices & reduced motion
  if (matchMedia("(pointer: coarse)").matches ||
      matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  /* ---------- Config (edit filenames here) ---------- */
  const EASE_CHASE = 0.14;               // chase responsiveness
  const RUNBACK_MS = 1200;               // run-back duration
  const IDLE_ROTATE_MS = 4000;           // time each idle GIF shows
  const FINAL_STATIC_TIMEOUT = 3600000;  // 1 hour (ms)
  const CLAMP_TO_HERO = false;           // keep chase inside hero if true

  // Your idle playlist (rotates while docked)
  const IDLE_GIFS = [
    "dance-cat.gif",
    "bounce-cat.gif",
    "cat-eating-pizza.gif",
    "pizza-cat-2.gif",
    "writing-cat.gif",
    "cat-upside.gif",
    "cat-sleep.gif"
  ];

  const CAT_RUN      = "cat-run-sprite.gif";          // while moving/chasing
  const FINAL_STATIC = "cat-sleep-static.png"; // the long-idle still

  /* ---------- State ---------- */
  const mouse  = { x: innerWidth / 2, y: innerHeight / 2 };
  const catPos = { x: 0, y: 0 };
  let play = false;
  let rafId = null;          // chase loop
  let backRaf = null;        // run-back loop
  let idleTimer = null;      // rotates idle GIFs
  let finalTimer = null;     // 1h -> final still
  let idleIndex = 0;
  let isFinal = false;

  /* ---------- Helpers ---------- */
  function heroRect() {
    // used only if you clamp; otherwise just for docking Y
    return document.querySelector(".hero")?.getBoundingClientRect()
        || { left: 16, top: 80, right: innerWidth - 16, bottom: 260 };
  }
  function dockLeft() {
    // Left side of screen, aligned to hero top
    const r = heroRect();
    return { x: 24, y: r.top + 40 };
  }
  function placeCat(x, y) {
    catPos.x = x; catPos.y = y;
    cat.style.left = x + "px";
    cat.style.top  = y + "px";
  }
  function faceTowards(targetX) {
    cat.classList.toggle("flip", (targetX - catPos.x) < 0);
  }
  function easeInOutQuad(t){ return t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t; }

  function startChaseLoop(){
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(chaseLoop);
  }
  function stopChaseLoop(){
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  function startIdleCycle(){
    clearInterval(idleTimer);
    resetFinalTimer();
    if (!IDLE_GIFS.length) return;
    idleIndex = 0;
    cat.src = IDLE_GIFS[idleIndex];
    idleTimer = setInterval(() => {
      idleIndex = (idleIndex + 1) % IDLE_GIFS.length;
      cat.src = IDLE_GIFS[idleIndex];
    }, IDLE_ROTATE_MS);
  }
  function stopIdleCycle(){
    clearInterval(idleTimer); idleTimer = null;
    clearTimeout(finalTimer); finalTimer = null;
  }
  function resetFinalTimer(){
    clearTimeout(finalTimer);
    isFinal = false;
    finalTimer = setTimeout(() => {
      stopIdleCycle();
      cat.src = FINAL_STATIC;
      isFinal = true;
    }, FINAL_STATIC_TIMEOUT);
  }

  /* ---------- Toggle handlers ---------- */
  function enablePlay(){
    play = true;
    document.body.classList.add("play-mode");
    btn.setAttribute("aria-pressed", "true");
    stopIdleCycle();
    cancelAnimationFrame(backRaf);
    cat.src = CAT_RUN;
    startChaseLoop();
  }

  function disablePlay(){
    play = false;
    document.body.classList.remove("play-mode");
    btn.setAttribute("aria-pressed", "false");
    stopChaseLoop();
    stopIdleCycle(); // restart after dock (unless final)
    cat.src = CAT_RUN;
    runBackToDock(() => {
      cat.classList.remove("flip");
      if (!isFinal) startIdleCycle();
    });
  }

  btn.addEventListener("click", () => (play ? disablePlay() : enablePlay()));

  /* ---------- Mouse & chase ---------- */
  window.addEventListener("mousemove", (e) => {
    if (!play) return;
    mouse.x = e.clientX; mouse.y = e.clientY;
    cursor.style.left = mouse.x + "px";
    cursor.style.top  = mouse.y + "px";
  });

  function chaseLoop(){
    if (play) {
      let tx = mouse.x, ty = mouse.y;
      if (CLAMP_TO_HERO) {
        const r = heroRect();
        tx = Math.min(Math.max(tx, r.left + 16), r.right - 16);
        ty = Math.min(Math.max(ty, r.top + 16),  r.bottom - 16);
      }
      catPos.x += (tx - catPos.x) * EASE_CHASE;
      catPos.y += (ty - catPos.y) * EASE_CHASE;
      placeCat(catPos.x, catPos.y);
      faceTowards(tx);
    }
    rafId = requestAnimationFrame(chaseLoop);
  }

  /* ---------- Run-back tween ---------- */
  function runBackToDock(done){
    cancelAnimationFrame(backRaf);
    const from = { x: catPos.x, y: catPos.y };
    const to   = dockLeft();
    const start = performance.now();
    faceTowards(to.x);

    function step(now){
      const t = Math.min(1, (now - start) / RUNBACK_MS);
      const k = easeInOutQuad(t);
      placeCat(from.x + (to.x - from.x) * k,
               from.y + (to.y - from.y) * k);
      if (t < 1) {
        backRaf = requestAnimationFrame(step);
      } else {
        backRaf = null;
        done && done();
      }
    }
    backRaf = requestAnimationFrame(step);
  }

  /* ---------- Initial state ---------- */
  const d = dockLeft();
  placeCat(d.x, d.y);
  cat.src = FINAL_STATIC; // Sleeping (static) until prompted

  // If the page regains visibility after the 1-hour freeze, wake the idle cycle
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && !play && isFinal) {
      isFinal = false;
      startIdleCycle();
    }
  });

  // Keep dock aligned on resize when not playing
  window.addEventListener("resize", () => {
    if (play) return;
    const dd = dockLeft();
    placeCat(dd.x, dd.y);
  });
})();
