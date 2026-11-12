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
