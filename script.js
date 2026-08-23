/* ==========================================================================
   CONFIG & STATE MANAGEMENT
   ========================================================================== */
const API_URL = "https://fa2mm1z6id.execute-api.ap-south-1.amazonaws.com/views";
const EMAIL_ADDRESS = "shubhaiml1@gmail.com";

const ROLE_CONFIG = {
  recruiter: { badge: "Recruiter Mode", color: "neon-orange" },
  admirer:   { badge: "Stealth Mode",   color: "neon-red" },
  batchmate: { badge: "Peer Mode",      color: "neon-blue" }
};

let currentPersona = "recruiter";

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  setupBurgerMenu();
  fetchRoleCounters();

  // Handle native Browser/Phone Back & Forward navigation
  window.addEventListener("popstate", (e) => {
    if (e.state && e.state.view) {
      if (e.state.view === "home") {
        renderPersonaSelector(false);
      } else {
        renderSection(e.state.view, e.state.persona || currentPersona, false);
      }
    } else {
      renderPersonaSelector(false);
    }
  });

  // Check initial URL hash on page load
  const hash = window.location.hash.replace("#", "");
  if (["recruiter", "admirer", "batchmate"].includes(hash)) {
    selectPersona(hash, false);
  } else if (["dashboard", "about", "projects", "experience", "certifications", "tools"].includes(hash)) {
    selectPersona("recruiter", false);
    navigateTo(hash, false);
  } else {
    renderPersonaSelector(false);
  }
});

/* ==========================================================================
   API TELEMETRY
   ========================================================================== */
async function fetchRoleCounters() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("API Gateway unreachable");
    const data = await res.json();
    updateCounterUI(data);
  } catch (err) {
    console.warn("API offline, fallback counters initialized:", err);
    document.getElementById("recruiter-count").innerText = "0";
    document.getElementById("admirer-count").innerText = "0";
    document.getElementById("batchmate-count").innerText = "0";
  }
}

async function incrementRoleCounter(role) {
  try {
    const res = await fetch(`${API_URL}?role=${encodeURIComponent(role)}`);
    if (!res.ok) throw new Error("Increment request failed");
    const data = await res.json();
    updateCounterUI(data);
  } catch (err) {
    console.warn("Could not increment remote counter:", err);
  }
}

function updateCounterUI(data) {
  document.getElementById("recruiter-count").innerText = data.recruiter_views ?? 0;
  document.getElementById("admirer-count").innerText = data.admirer_views ?? 0;
  document.getElementById("batchmate-count").innerText = data.batchmate_views ?? 0;
}

/* ==========================================================================
   CORE PERSONA SELECTION & ROUTING
   ========================================================================== */
function selectPersona(roleKey, pushToHistory = true) {
  if (!ROLE_CONFIG[roleKey]) roleKey = "recruiter";
  currentPersona = roleKey;

  // Increment counter in DynamoDB
  incrementRoleCounter(roleKey);

  // Update Navbar Badge
  const role = ROLE_CONFIG[roleKey];
  const badge = document.getElementById("current-role-badge");
  badge.innerText = role.badge;
  badge.className = `nav-role-badge ${role.color}`;

  // Switch View Screens
  document.body.classList.remove("role-screen-active");
  document.getElementById("role-selector-screen").classList.remove("active");
  document.getElementById("main-content-screen").classList.add("active");

  // Show only matching sub-dashboard
  activatePersonaDashboard(roleKey);

  // Focus dashboard section
  renderSection("dashboard", roleKey, pushToHistory);
}

function activatePersonaDashboard(roleKey) {
  const dashboards = ["recruiter", "admirer", "batchmate"];
  dashboards.forEach((d) => {
    const el = document.getElementById(`persona-${d}`);
    if (el) {
      if (d === roleKey) {
        el.classList.add("active");
      } else {
        el.classList.remove("active");
      }
    }
  });
}

function navigateTo(sectionId, pushToHistory = true) {
  renderSection(sectionId, currentPersona, pushToHistory);
}

function renderSection(sectionId, persona = currentPersona, pushToHistory = true) {
  document.body.classList.remove("role-screen-active");
  document.getElementById("role-selector-screen").classList.remove("active");
  document.getElementById("main-content-screen").classList.add("active");

  // Hide all sections
  document.querySelectorAll(".page-view").forEach((page) => {
    page.classList.remove("active");
  });

  // Show chosen section
  const targetPage = document.getElementById(`page-${sectionId}`);
  if (targetPage) {
    targetPage.classList.add("active");
  }

  // Ensure chosen dashboard is active
  if (sectionId === "dashboard") {
    activatePersonaDashboard(persona);
  }

  // Update Nav highlighting
  document.querySelectorAll(".nav-menu-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.getAttribute("onclick")?.includes(sectionId)) {
      btn.classList.add("active");
    }
  });

  // Push to browser history
  if (pushToHistory) {
    history.pushState({ view: sectionId, persona: persona }, "", `#${sectionId}`);
  }

  document.getElementById("dropdown-menu").classList.remove("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function switchPersonaScreen(pushToHistory = true) {
  renderPersonaSelector(pushToHistory);
}

function renderPersonaSelector(pushToHistory = true) {
  document.getElementById("dropdown-menu").classList.remove("active");
  document.getElementById("main-content-screen").classList.remove("active");
  document.getElementById("role-selector-screen").classList.add("active");
  
  document.body.classList.add("role-screen-active");
  document.getElementById("current-role-badge").innerText = "Select Persona";
  document.getElementById("current-role-badge").className = "nav-role-badge";

  if (pushToHistory) {
    history.pushState({ view: "home" }, "", window.location.pathname);
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ==========================================================================
   BURGER MENU & UTILITIES
   ========================================================================== */
function setupBurgerMenu() {
  const burgerBtn = document.getElementById("burger-btn");
  const dropdownMenu = document.getElementById("dropdown-menu");

  burgerBtn.addEventListener("click", () => {
    dropdownMenu.classList.toggle("active");
  });

  document.addEventListener("click", (e) => {
    if (!burgerBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.classList.remove("active");
    }
  });
}

function openEmailClient() {
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) {
    window.location.href = `mailto:${EMAIL_ADDRESS}?subject=Opportunity%20Discussion%20-%20Shubh%20Pandya`;
  } else {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL_ADDRESS)}&su=${encodeURIComponent("Opportunity Discussion - Shubh Pandya")}`;
    const win = window.open(gmailUrl, '_blank');
    navigator.clipboard.writeText(EMAIL_ADDRESS).then(() => {
      showToast("Email copied to clipboard!");
    }).catch(() => {
      if (!win) window.location.href = `mailto:${EMAIL_ADDRESS}`;
    });
  }
}

function copyToClipboard(text, successMsg) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(successMsg);
  }).catch(() => {
    showToast(text);
  });
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}