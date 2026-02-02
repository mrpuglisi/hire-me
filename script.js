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

