/* ==========================================================================
   CONFIG & STATE MANAGEMENT
   ========================================================================== */
const API_URL = "https://fa2mm1z6id.execute-api.ap-south-1.amazonaws.com/views";

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

// Read-only fetch on page 1 load
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

// Increment specifically on role selection click
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

  // Switch to screen 2 and load default page (About)
  document.getElementById("role-selector-screen").classList.remove("active");
  document.getElementById("main-content-screen").classList.add("active");
  navigateToSection("about");
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

  // Switch persona button back to Screen 1
  document.getElementById("switch-role-btn").addEventListener("click", () => {
    dropdownMenu.classList.remove("active");
    document.getElementById("main-content-screen").classList.remove("active");
    document.getElementById("role-selector-screen").classList.add("active");
    document.getElementById("current-role-badge").innerText = "Select Persona";
    document.getElementById("current-role-badge").className = "nav-role-badge";
    fetchRoleCounters();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Router for switching between the 5 dedicated section pages
function navigateToSection(sectionId) {
  // Hide all pages
  document.querySelectorAll(".page-view").forEach((page) => {
    page.classList.remove("active");
  });

  // Show selected page
  const targetPage = document.getElementById(`page-${sectionId}`);
  if (targetPage) {
    targetPage.classList.add("active");
  }

  // Update active state on nav menu buttons
  document.querySelectorAll(".nav-menu-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.getAttribute("onclick")?.includes(sectionId)) {
      btn.classList.add("active");
    }
  });

  // Close dropdown menu if open
  document.getElementById("dropdown-menu").classList.remove("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}