// ---- Settings: change this to the real TYEI email address ----
const CONTACT_EMAIL = "twapiayouthempowermentinitiative26@gmail.com";

// ---- Mobile menu ----
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("nav");

toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.textContent = open ? "Close" : "Menu";
});

nav.addEventListener("click", (e) => {
  if (e.target.closest("a")) {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "Menu";
  }
});

// ---- Join form: opens the visitor's email app with the message filled in ----
const form = document.getElementById("join-form");
const note = document.getElementById("form-note");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const name = (data.get("name") || "").trim();
  const contact = (data.get("contact") || "").trim();

  if (!name || !contact) {
    note.textContent = "Please enter your name and an email or phone number.";
    return;
  }

  const subject = `TYEI enquiry: ${data.get("type")}`;
  const body =
    `Name: ${name}\n` +
    `Contact: ${contact}\n` +
    `Joining as: ${data.get("type")}\n\n` +
    `${data.get("message") || ""}`;

  note.textContent = "Opening your email app to send the message.";
  window.location.href =
    `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

// ---- Smooth transitions between sections ----
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.querySelector(".site-header");
  const bar = document.querySelector(".progress");

  // 1. Content eases in as it scrolls into view
  const targets = [
    ".section-head", ".about-grid > div", ".purpose", ".focus-list li",
    ".photo-card", ".photo-note", ".values > div", ".member-types li",
    ".two-col > div", ".leader-quote", ".leader-formula", ".leader-note",
    ".committee", ".programmes h3", ".programmes li", ".work-grid > div",
    ".safeguard", ".join .copy", "#join-form"
  ];
  const items = [];
  targets.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      const same = [...el.parentElement.children].filter((c) => c.matches(sel));
      el.classList.add("reveal");
      el.style.setProperty("--d", (same.indexOf(el) % 3) * 90 + "ms");
      items.push(el);
    });
  });

  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
  } else {
    const reveal = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add("is-visible");
        setTimeout(() => el.classList.add("is-done"), 1300);
        reveal.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    items.forEach((el) => reveal.observe(el));
  }

  // 2. Progress bar and header shadow
  let ticking = false;
  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = "scaleX(" + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ")";
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { onScroll(); ticking = false; });
  }, { passive: true });
  onScroll();

  // 3. Highlight the menu link of the section being read
  const links = [...document.querySelectorAll('.nav-list a[href^="#"]:not(.btn)')];
  const byTarget = new Map();
  links.forEach((a) => {
    const section = document.querySelector(a.getAttribute("href"));
    if (section) byTarget.set(section, a);
  });
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) => { l.classList.remove("is-active"); l.removeAttribute("aria-current"); });
        const link = byTarget.get(entry.target);
        link.classList.add("is-active");
        link.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    byTarget.forEach((_, section) => spy.observe(section));
  }
})();
