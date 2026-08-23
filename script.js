/* ==========================================================================
   GLOBAL CONFIGURATION & STATE
   ========================================================================== */
const API_URL = "https://fa2mm1z6id.execute-api.ap-south-1.amazonaws.com/views";
const EMAIL_ADDRESS = "shubhaiml1@gmail.com";
const DISCORD_USER_ID = "690536566774431794";
const DISCORD_USERNAME = "ryuk2714";

const ROLE_CONFIG = {
  recruiter: { badge: "Recruiter Mode", color: "neon-orange" },
  admirer:   { badge: "Stealth Mode",   color: "neon-red" },
  batchmate: { badge: "Peer Mode",      color: "neon-blue" }
};

window.currentPersona = "recruiter";

/* ==========================================================================
   GLOBAL PERSONA ROUTING (DIRECT CALLS)
   ========================================================================== */
window.selectPersona = function(roleKey, pushToHistory = true) {
  if (!ROLE_CONFIG[roleKey]) roleKey = "recruiter";
  window.currentPersona = roleKey;

  // Telemetry API increment
  incrementRoleCounter(roleKey);

  // Update Navbar Badge
  const role = ROLE_CONFIG[roleKey];
  const badge = document.getElementById("current-role-badge");
  if (badge) {
    badge.innerText = role.badge;
    badge.className = `nav-role-badge ${role.color}`;
  }

  // Switch Screen Views
  document.body.classList.remove("role-screen-active");
  
  const roleScreen = document.getElementById("role-selector-screen");
  const mainScreen = document.getElementById("main-content-screen");
  if (roleScreen) roleScreen.classList.remove("active");
  if (mainScreen) mainScreen.classList.add("active");

  // Activate only the selected dashboard sub-view
  activatePersonaDashboard(roleKey);

  // Render dashboard page
  window.renderSection("dashboard", roleKey, pushToHistory);
};

window.activatePersonaDashboard = function(roleKey) {
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
};

window.navigateTo = function(sectionId, pushToHistory = true) {
  window.renderSection(sectionId, window.currentPersona, pushToHistory);
};

window.renderSection = function(sectionId, persona = window.currentPersona, pushToHistory = true) {
  document.body.classList.remove("role-screen-active");

  const roleScreen = document.getElementById("role-selector-screen");
  const mainScreen = document.getElementById("main-content-screen");
  if (roleScreen) roleScreen.classList.remove("active");
  if (mainScreen) mainScreen.classList.add("active");

  // Hide all sections
  document.querySelectorAll(".page-view").forEach((page) => {
    page.classList.remove("active");
  });

  // Show target section
  const targetPage = document.getElementById(`page-${sectionId}`);
  if (targetPage) {
    targetPage.classList.add("active");
  }

  // Ensure sub-dashboard is correctly matched
  if (sectionId === "dashboard") {
    window.activatePersonaDashboard(persona);
  }

  // Update Nav highlighting
  document.querySelectorAll(".nav-menu-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.getAttribute("onclick") && btn.getAttribute("onclick").includes(sectionId)) {
      btn.classList.add("active");
    }
  });

  // Push to history state for Back/Forward buttons
  if (pushToHistory) {
    history.pushState({ view: sectionId, persona: persona }, "", `#${sectionId}`);
  }

  const dropdownMenu = document.getElementById("dropdown-menu");
  if (dropdownMenu) dropdownMenu.classList.remove("active");
  
  window.scrollTo({ top: 0, behavior: "smooth" });
};

window.switchPersonaScreen = function(pushToHistory = true) {
  window.renderPersonaSelector(pushToHistory);
};

window.renderPersonaSelector = function(pushToHistory = true) {
  const dropdownMenu = document.getElementById("dropdown-menu");
  if (dropdownMenu) dropdownMenu.classList.remove("active");

  const mainScreen = document.getElementById("main-content-screen");
  const roleScreen = document.getElementById("role-selector-screen");
  if (mainScreen) mainScreen.classList.remove("active");
  if (roleScreen) roleScreen.classList.add("active");
  
  document.body.classList.add("role-screen-active");

  const badge = document.getElementById("current-role-badge");
  if (badge) {
    badge.innerText = "Select Persona";
    badge.className = "nav-role-badge";
  }

  if (pushToHistory) {
    history.pushState({ view: "home" }, "", window.location.pathname);
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
};

/* ==========================================================================
   INITIALIZATION & HISTORY ROUTER
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  setupBurgerMenu();
  fetchRoleCounters();

  // Handle native Browser Back/Forward navigation
  window.addEventListener("popstate", (e) => {
    if (e.state && e.state.view) {
      if (e.state.view === "home") {
        window.renderPersonaSelector(false);
      } else {
        window.renderSection(e.state.view, e.state.persona || window.currentPersona, false);
      }
    } else {
      window.renderPersonaSelector(false);
    }
  });

  // Check initial URL hash
  const hash = window.location.hash.replace("#", "");
  if (["recruiter", "admirer", "batchmate"].includes(hash)) {
    window.selectPersona(hash, false);
  } else if (["dashboard", "about", "projects", "experience", "certifications", "tools"].includes(hash)) {
    window.selectPersona("recruiter", false);
    window.navigateTo(hash, false);
  } else {
    window.renderPersonaSelector(false);
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
    console.warn("API offline, default counters active:", err);
    updateCounterUI({ recruiter_views: 0, admirer_views: 0, batchmate_views: 0 });
  }
}

async function incrementRoleCounter(role) {
  try {
    const res = await fetch(`${API_URL}?role=${encodeURIComponent(role)}`);
    if (!res.ok) throw new Error("Increment request failed");
    const data = await res.json();
    updateCounterUI(data);
  } catch (err) {
    console.warn("Could not increment counter:", err);
  }
}

function updateCounterUI(data) {
  const rec = document.getElementById("recruiter-count");
  const adm = document.getElementById("admirer-count");
  const bat = document.getElementById("batchmate-count");
  if (rec) rec.innerText = data.recruiter_views ?? 0;
  if (adm) adm.innerText = data.admirer_views ?? 0;
  if (bat) bat.innerText = data.batchmate_views ?? 0;
}

/* ==========================================================================
   BURGER MENU & UTILITIES
   ========================================================================== */
window.toggleMenu = function() {
  const dropdownMenu = document.getElementById("dropdown-menu");
  if (dropdownMenu) dropdownMenu.classList.toggle("active");
};

function setupBurgerMenu() {
  const burgerBtn = document.getElementById("burger-btn");
  const dropdownMenu = document.getElementById("dropdown-menu");

  document.addEventListener("click", (e) => {
    if (burgerBtn && dropdownMenu && !burgerBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.classList.remove("active");
    }
  });
}

window.handleDiscordClick = function() {
  // Open direct Discord profile link
  window.open(`https://discord.com/users/${DISCORD_USER_ID}`, "_blank");
  // Also copy username to clipboard for convenience
  window.copyToClipboard(DISCORD_USERNAME, `Discord User (@${DISCORD_USERNAME}) copied & profile opened!`);
};

window.openEmailClient = function() {
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) {
    window.location.href = `mailto:${EMAIL_ADDRESS}?subject=Opportunity%20Discussion%20-%20Shubh%20Pandya`;
  } else {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL_ADDRESS)}&su=${encodeURIComponent("Opportunity Discussion - Shubh Pandya")}`;
    const win = window.open(gmailUrl, '_blank');
    navigator.clipboard.writeText(EMAIL_ADDRESS).then(() => {
      window.showToast("Email copied to clipboard!");
    }).catch(() => {
      if (!win) window.location.href = `mailto:${EMAIL_ADDRESS}`;
    });
  }
};

window.copyToClipboard = function(text, successMsg) {
  navigator.clipboard.writeText(text).then(() => {
    window.showToast(successMsg);
  }).catch(() => {
    window.showToast(text);
  });
};

window.showToast = function(message) {
  const toast = document.getElementById("toast");
  if (toast) {
    toast.innerText = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }
};