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

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  fetchRoleCounters();
  setupRoleCards();
});

// Read-only fetch on initial screen load
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

// Increment counter for chosen persona
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
   EXPLICIT DASHBOARD DISPLAY CONTROLLER
   ========================================================================== */
function activatePersonaDashboard(roleKey) {
  const dashboards = ["recruiter", "admirer", "batchmate"];
  
  dashboards.forEach((d) => {
    const el = document.getElementById(`persona-${d}`);
    if (el) {
      if (d === roleKey) {
        el.style.display = "block";
      } else {
        el.style.display = "none";
      }
    }
  });
}

/* ==========================================================================
   UTILITY ACTIONS (EMAIL & CLIPBOARD)
   ========================================================================== */
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
      if (!win) {
        window.location.href = `mailto:${EMAIL_ADDRESS}`;
      }
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

/* ==========================================================================
   ROLE HANDLING & SCREEN TRANSITION
   ========================================================================== */
function setupRoleCards() {
  document.querySelectorAll(".role-card").forEach((card) => {
    card.addEventListener("click", () => {
      const role = card.getAttribute("data-role");
      incrementRoleCounter(role);
      enterPortfolio(role);
    });
  });
}

function enterPortfolio(roleKey) {
  const role = ROLE_CONFIG[roleKey];
  if (!role) return;

  const badge = document.getElementById("current-role-badge");
  badge.innerText = role.badge;
  badge.className = `nav-role-badge ${role.color}`;

  // Hardcode explicit display for only the selected persona dashboard
  activatePersonaDashboard(roleKey);

  // Remove viewport scroll lock
  document.body.classList.remove("role-screen-active");

  // Show main content and focus dashboard page
  document.getElementById("role-selector-screen").classList.remove("active");
  document.getElementById("main-content-screen").classList.add("active");
  navigateToSection("dashboard");
}

/* ==========================================================================
   MULTI-PAGE SECTION NAVIGATION
   ========================================================================== */
function setupNavigation() {
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

  document.getElementById("switch-role-btn").addEventListener("click", () => {
    dropdownMenu.classList.remove("active");
    document.getElementById("main-content-screen").classList.remove("active");
    document.getElementById("role-selector-screen").classList.add("active");
    
    // Re-enable strict viewport lock on Screen 1
    document.body.classList.add("role-screen-active");

    document.getElementById("current-role-badge").innerText = "Select Persona";
    document.getElementById("current-role-badge").className = "nav-role-badge";
    fetchRoleCounters();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function navigateToSection(sectionId) {
  document.querySelectorAll(".page-view").forEach((page) => {
    page.classList.remove("active");
  });

  const targetPage = document.getElementById(`page-${sectionId}`);
  if (targetPage) {
    targetPage.classList.add("active");
  }

  document.querySelectorAll(".nav-menu-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.getAttribute("onclick")?.includes(sectionId)) {
      btn.classList.add("active");
    }
  });

  document.getElementById("dropdown-menu").classList.remove("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}