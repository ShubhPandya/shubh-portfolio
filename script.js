/* ==========================================================================
   CONFIG & STATE MANAGEMENT
   ========================================================================== */
const API_URL = "https://fa2mm1z6id.execute-api.ap-south-1.amazonaws.com/views";

const ROLE_DATA = {
  recruiter: {
    badge: "Recruiter Mode",
    color: "neon-orange",
    renderHero: () => `
      <div class="stats-hero-card border-orange">
        <h2 class="neon-orange"><i class="fa-solid fa-briefcase"></i> Candidate Metrics: Shubh Pandya</h2>
        <p style="color: var(--text-muted); margin-top: 5px;">Summary of engineering capabilities and certified AWS competencies.</p>
        <div class="stats-hero-grid">
          <div class="stat-box">
            <span class="stat-number neon-orange">AWS CCP</span>
            <span>Active Cloud Credential</span>
          </div>
          <div class="stat-box">
            <span class="stat-number neon-blue">7.70</span>
            <span>VIT CSE Graduate CGPA</span>
          </div>
          <div class="stat-box">
            <span class="stat-number neon-yellow">2</span>
            <span>Production Internships</span>
          </div>
          <div class="stat-box">
            <span class="stat-number neon-red">100%</span>
            <span>Serverless Infrastructure</span>
          </div>
        </div>
      </div>
    `
  },
  admirer: {
    badge: "Stealth Mode",
    color: "neon-red",
    renderHero: () => `
      <div class="stats-hero-card border-red">
        <h2 class="neon-red"><i class="fa-solid fa-user-secret"></i> Observation Dossier</h2>
        <p style="color: var(--text-muted); margin-top: 5px;">Unfiltered snapshot of engineering patterns and offline pursuits.</p>
        <div class="stats-hero-grid">
          <div class="stat-box">
            <span class="stat-number neon-red">24/7</span>
            <span>Cloud Deployment Uptime</span>
          </div>
          <div class="stat-box">
            <span class="stat-number neon-yellow">100%</span>
            <span>Clean Code Focus</span>
          </div>
          <div class="stat-box">
            <span class="stat-number neon-blue">Tactical</span>
            <span>Non-Tech Mindset</span>
          </div>
        </div>
      </div>
    `
  },
  batchmate: {
    badge: "Peer Mode",
    color: "neon-blue",
    renderHero: () => `
      <div class="stats-hero-card border-blue">
        <h2 class="neon-blue"><i class="fa-solid fa-graduation-cap"></i> VIT Peer Terminal</h2>
        <p style="color: var(--text-muted); margin-top: 5px;">Engineering logs, collaborative stacks, and shared system projects.</p>
        <div class="stats-hero-grid">
          <div class="stat-box">
            <span class="stat-number neon-blue">2021–25</span>
            <span>VIT Chennai Batch</span>
          </div>
          <div class="stat-box">
            <span class="stat-number neon-orange">FastAPI</span>
            <span>Backend Stack</span>
          </div>
          <div class="stat-box">
            <span class="stat-number neon-yellow">GATE</span>
            <span>CS Fundamentals Track</span>
          </div>
        </div>
      </div>
    `
  }
};

/* ==========================================================================
   INITIALIZATION & ROLE COUNTERS
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  fetchRoleCounters(); // Read-only fetch on page load (increments nothing)
  setupRoleCards();
});

// Read-only fetch: fetches current numbers without incrementing
async function fetchRoleCounters() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("API Gateway unreachable");
    const data = await res.json();
    
    updateCounterUI(data);
  } catch (err) {
    console.warn("API offline, using fallback counters:", err);
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
   NAVIGATION & SWITCHING
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
    document.getElementById("current-role-badge").innerText = "Select Persona";
    fetchRoleCounters(); // Refresh stats when returning to role screen
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function setupRoleCards() {
  document.querySelectorAll(".role-card").forEach((card) => {
    card.addEventListener("click", () => {
      const role = card.getAttribute("data-role");
      incrementRoleCounter(role); // Increment ONLY this persona
      selectRole(role);
    });
  });
}

function selectRole(roleKey) {
  const role = ROLE_DATA[roleKey];
  if (!role) return;

  const badge = document.getElementById("current-role-badge");
  badge.innerText = role.badge;
  badge.className = `nav-role-badge ${role.color}`;

  document.getElementById("dynamic-stats-container").innerHTML = role.renderHero();

  document.getElementById("role-selector-screen").classList.remove("active");
  document.getElementById("main-content-screen").classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ==========================================================================
   MODAL WINDOW SYSTEM
   ========================================================================== */
const PROJECT_MODALS = {
  portfolio: {
    title: "Serverless Cloud Portfolio Architecture",
    tag: "AWS & DevOps",
    about: "A globally distributed static website hosted on AWS CloudFront and private S3 with Origin Access Control (OAC). Live interaction counts are handled by an event-driven AWS Lambda microservice updating an Amazon DynamoDB table atomically.",
    hosted: "https://d1f9cvb3gi4lhw.cloudfront.net",
    github: "https://github.com/ShubhPandya/shubh-portfolio"
  },
  cv: {
    title: "Deep Learning Urban Change Detection",
    tag: "Computer Vision & PyTorch",
    about: "A U-Net convolutional neural network designed to identify geographical transformations across multi-spectral satellite imagery. Employs temporal scoring and spatial filtering.",
    hosted: null,
    github: "https://github.com/ShubhPandya"
  }
};

const CERT_MODALS = {
  ccp: {
    title: "AWS Certified Cloud Practitioner (CCP)",
    issuer: "Amazon Web Services",
    purpose: "Validates comprehensive knowledge of AWS Well-Architected Framework, cloud security postures, billing structures, and serverless compute primitives.",
    proofUrl: "https://www.credly.com/badges/09ee341d-97aa-47b1-ac16-6ac2c0cfddc8/public_url"
  }
};

function openProjectModal(key) {
  const p = PROJECT_MODALS[key];
  if (!p) return;

  const content = `
    <h2 style="font-size: 1.4rem; margin-bottom: 0.5rem;">${p.title}</h2>
    <span class="tag" style="background: rgba(255,119,0,0.15); color: var(--neon-orange);">${p.tag}</span>
    <p style="margin: 1.2rem 0; color: var(--text-muted); font-size: 0.95rem;">${p.about}</p>
    ${p.hosted ? `<p style="margin-bottom: 0.8rem;"><a href="${p.hosted}" target="_blank" class="neon-blue" style="text-decoration:none;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Live Deployment</a></p>` : ''}
    <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 1.2rem 0;" />
    <a href="${p.github}" target="_blank" class="btn btn-orange" style="display:inline-block; text-decoration:none;"><i class="fa-brands fa-github"></i> Inspect GitHub Repository</a>
  `;

  document.getElementById("modal-content-body").innerHTML = content;
  document.getElementById("modal-overlay").classList.add("active");
}

function openCertModal(key) {
  const c = CERT_MODALS[key];
  if (!c) return;

  const content = `
    <h2 style="font-size: 1.4rem; margin-bottom: 0.5rem;">${c.title}</h2>
    <p style="color: var(--neon-yellow); font-size: 0.9rem; margin-bottom: 1rem;">Issued by: ${c.issuer}</p>
    <div style="background: rgba(0,0,0,0.4); padding: 1rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 1.5rem;">
      <strong style="color: #fff; display:block; margin-bottom: 5px;">Operational Value:</strong>
      <p style="color: var(--text-muted); font-size: 0.9rem;">${c.purpose}</p>
    </div>
    <a href="${c.proofUrl}" target="_blank" class="btn btn-yellow" style="background: var(--neon-yellow); color:#000; display:inline-block; text-decoration:none;"><i class="fa-solid fa-award"></i> Verify Official Credly Badge</a>
  `;

  document.getElementById("modal-content-body").innerHTML = content;
  document.getElementById("modal-overlay").classList.add("active");
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("active");
}