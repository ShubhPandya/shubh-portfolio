/* ==========================================================================
   CONFIG & STATE MANAGEMENT
   ========================================================================== */
const API_URL = "https://fa2mm1z6id.execute-api.ap-south-1.amazonaws.com/views";
const EMAIL_ADDRESS = "shubhaiml1@gmail.com";
const RIOT_ID = "iYoungLord#5710";

const ROLE_CONFIG = {
  recruiter: { badge: "Recruiter Mode", color: "neon-orange" },
  admirer:   { badge: "Stealth Mode",   color: "neon-red" },
  batchmate: { badge: "Peer Mode",      color: "neon-blue" }
};

let activePersona = "recruiter";

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
   DASHBOARD TEMPLATE RENDERERS
   ========================================================================== */
function renderDashboardForPersona(persona) {
  const container = document.getElementById("dashboard-dynamic-content");
  
  if (persona === "recruiter") {
    container.innerHTML = `
      <!-- Recruiter Header Card -->
      <div class="dashboard-hero-card border-orange">
        <div class="hero-top-row">
          <div>
            <div class="badge-role-tag neon-orange">Candidate Executive Overview</div>
            <h2 class="hero-name">Shubh Udaybhai Pandya</h2>
            <p class="hero-sub neon-blue">Cloud & Backend Systems Engineer &bull; AWS Certified</p>
          </div>
          <div class="hero-cta-group">
            <a href="https://drive.google.com/file/d/1XseiKJG_uYXwTU4zkX6z93Fh7KUhqfiE/view?usp=sharing" target="_blank" rel="noopener noreferrer" class="btn btn-orange">
              <i class="fa-solid fa-file-arrow-down"></i> One-Page Resume
            </a>
            <button onclick="openEmailClient()" class="btn btn-outline-blue">
              <i class="fa-solid fa-envelope"></i> Quick Connect
            </button>
          </div>
        </div>
      </div>

      <!-- Metric Cards Grid -->
      <div class="stats-kpi-grid">
        <div class="kpi-card border-blue">
          <span class="kpi-number neon-blue">AWS CCP</span>
          <span class="kpi-title">Certified Practitioner</span>
          <p class="kpi-detail">Active 2026 &bull; IAM, VPC, S3, CloudFront & Serverless Architecture[cite: 1]</p>
        </div>
        <div class="kpi-card border-yellow">
          <span class="kpi-number neon-yellow">2 Internships</span>
          <span class="kpi-title">Production Experience</span>
          <p class="kpi-detail">Genisys Group (CI/CD Static Analysis) & Squadron Tech (Kafka Streaming ETL)[cite: 1]</p>
        </div>
        <div class="kpi-card border-orange">
          <span class="kpi-number neon-orange">7.70 CGPA</span>
          <span class="kpi-title">B.Tech Computer Science</span>
          <p class="kpi-detail">Vellore Institute of Technology (VIT Chennai) &bull; Graduated 2025[cite: 1]</p>
        </div>
        <div class="kpi-card border-red">
          <span class="kpi-number neon-red">100%</span>
          <span class="kpi-title">Serverless Architecture</span>
          <p class="kpi-detail">CloudFront CDN, S3 OAC, API Gateway, Lambda & Atomic DynamoDB[cite: 1]</p>
        </div>
      </div>

      <!-- Recruiter Fast-Review Grid -->
      <div class="dashboard-fast-grid">
        <div class="fast-card border-blue">
          <h3 class="fast-heading neon-blue"><i class="fa-solid fa-layer-group"></i> Core Production Capabilities</h3>
          <div class="capabilities-table">
            <div class="capability-row">
              <div class="cap-bullet neon-blue"><i class="fa-solid fa-circle-check"></i></div>
              <div class="cap-label">Serverless:</div>
              <div class="cap-desc">Event-driven microservices using AWS Lambda, API Gateway, and DynamoDB[cite: 1].</div>
            </div>
            <div class="capability-row">
              <div class="cap-bullet neon-blue"><i class="fa-solid fa-circle-check"></i></div>
              <div class="cap-label">Data Systems:</div>
              <div class="cap-desc">Streaming ETL pipelines using Apache Kafka, Python, and MySQL[cite: 1].</div>
            </div>
            <div class="capability-row">
              <div class="cap-bullet neon-blue"><i class="fa-solid fa-circle-check"></i></div>
              <div class="cap-label">CI/CD & DevOps:</div>
              <div class="cap-desc">Automated build/deploy workflows with GitHub Actions and static analysis integration[cite: 1].</div>
            </div>
            <div class="capability-row">
              <div class="cap-bullet neon-blue"><i class="fa-solid fa-circle-check"></i></div>
              <div class="cap-label">Cloud Security:</div>
              <div class="cap-desc">Least-privilege IAM policies, CloudFront Origin Access Control (OAC), and secure API endpoints[cite: 1].</div>
            </div>
          </div>
        </div>

        <div class="fast-card border-yellow">
          <h3 class="fast-heading neon-yellow"><i class="fa-solid fa-compass"></i> Detailed Candidate Files</h3>
          <div class="quick-nav-stack">
            <button onclick="navigateToSection('experience')" class="quick-nav-btn">
              <span><i class="fa-solid fa-briefcase neon-red"></i> Verified Experience Logs[cite: 1]</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>
            <button onclick="navigateToSection('projects')" class="quick-nav-btn">
              <span><i class="fa-solid fa-diagram-project neon-yellow"></i> Production Architecture Projects[cite: 1]</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>
            <button onclick="navigateToSection('tools')" class="quick-nav-btn">
              <span><i class="fa-solid fa-toolbox neon-orange"></i> Full Tech Stack & Tooling[cite: 1]</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>
            <button onclick="navigateToSection('certifications')" class="quick-nav-btn">
              <span><i class="fa-solid fa-certificate neon-blue"></i> AWS Badge & Verification[cite: 1]</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  } else if (persona === "admirer") {
    container.innerHTML = `
      <!-- Admirer Header Card -->
      <div class="dashboard-hero-card border-red">
        <div class="hero-top-row">
          <div>
            <div class="badge-role-tag neon-red">SURVEILLANCE DOSSIER // UNRESTRICTED</div>
            <h2 class="hero-name">Observation Mode: Shubh Pandya</h2>
            <p class="hero-sub neon-yellow">Footprints, Vinyl Grooves, Psychological Thrillers & Gaming Roster</p>
          </div>
          <div class="hero-cta-group">
            <a href="https://www.instagram.com/w_pandya108" target="_blank" class="btn btn-insta">
              <i class="fa-brands fa-instagram"></i> @w_pandya108
            </a>
            <a href="https://open.spotify.com/playlist/2ZzM6HDXX13IuSpX8wkJKI?si=70125441173f4b50" target="_blank" class="btn btn-spotify">
              <i class="fa-brands fa-spotify"></i> 70s-80s-90s Mix
            </a>
          </div>
        </div>
      </div>

      <!-- Admirer KPI Cards -->
      <div class="stats-kpi-grid">
        <div class="kpi-card border-red">
          <span class="kpi-number neon-red">@iYoungLord#5710</span>
          <span class="kpi-title">Valorant Tactical Roster</span>
          <button onclick="copyToClipboard('${RIOT_ID}', 'Valorant Riot ID Copied!')" class="btn btn-outline-red" style="margin-top:0.4rem; padding:0.3rem 0.6rem; font-size:0.75rem;">
            <i class="fa-regular fa-copy"></i> Copy Riot ID
          </button>
        </div>
        <div class="kpi-card border-yellow">
          <span class="kpi-number neon-yellow">70s–90s Mix</span>
          <span class="kpi-title">Vintage Audio Waves</span>
          <p class="kpi-detail">Classic retro chords, timeless songwriting & late-night coding playlists.</p>
        </div>
        <div class="kpi-card border-orange">
          <span class="kpi-number neon-orange">Top 5 Thrillers</span>
          <span class="kpi-title">Cinema Twist Index</span>
          <p class="kpi-detail">Mind-bending plots, unreliable narrators & high-tension storytelling.</p>
        </div>
        <div class="kpi-card border-blue">
          <span class="kpi-number neon-blue">Active Builder</span>
          <span class="kpi-title">LaunchLoop Studio</span>
          <p class="kpi-detail">Iterating and shipping software builds every 15 to 20 days.</p>
        </div>
      </div>

      <!-- Admirer Custom Fast Grid -->
      <div class="dashboard-fast-grid">
        <!-- Column 1: Top 5 Psychological Thrillers with Posters -->
        <div class="fast-card border-red">
          <h3 class="fast-heading neon-red"><i class="fa-solid fa-film"></i> Top 5 Mind-Bending Thrillers</h3>
          <div class="movie-posters-stack">
            
            <div class="movie-poster-card">
              <img src="https://m.media-amazon.com/images/M/MV5BN2FjNWExYzEtY2YzOC00YjNlLTllMTQtNmIwM2Q1YzBhOWM1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" alt="Shutter Island" />
              <div class="movie-poster-details">
                <h4 class="neon-orange">1. Shutter Island (2010)</h4>
                <p>"Proof that sanity is just a matter of perspective (and bad lighthouses)."</p>
              </div>
            </div>

            <div class="movie-poster-card">
              <img src="https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg" alt="Fight Club" />
              <div class="movie-poster-details">
                <h4 class="neon-red">2. Fight Club (1999)</h4>
                <p>"Rule #1 broken instantly; soap has never been this disruptive."</p>
              </div>
            </div>

            <div class="movie-poster-card">
              <img src="https://m.media-amazon.com/images/M/MV5BMWMwMGQzZTItY2JlNC00OWZiLWIyMDctNDk2ZDQ2YjRjMWQ0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg" alt="Se7en" />
              <div class="movie-poster-details">
                <h4 class="neon-yellow">3. Se7en (1995)</h4>
                <p>"Never ask what's in the box unless you're ready to question humanity."</p>
              </div>
            </div>

            <div class="movie-poster-card">
              <img src="https://m.media-amazon.com/images/M/MV5BYzA3NzFmOTgtYWMxMy00MDMzLThkZjUtZjExZDEyYTk0NmQ2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" alt="Primal Fear" />
              <div class="movie-poster-details">
                <h4 class="neon-blue">4. Primal Fear (1996)</h4>
                <p>"A masterclass in why stuttering defense clients need psychiatric therapy."</p>
              </div>
            </div>

            <div class="movie-poster-card">
              <img src="https://m.media-amazon.com/images/M/MV5BZjkxYTA2YjMtNjkzMi00YzdjLWI4N2EtNDMyNDBiMWZhM2JjXkEyXkFqcGdeQXVyNjQ4ODE4MzQ@._V1_.jpg" alt="Zodiac" />
              <div class="movie-poster-details">
                <h4 class="neon-orange">5. Zodiac (2007)</h4>
                <p>"Obsession is a hell of a drug, especially when the cipher never ends."</p>
              </div>
            </div>

          </div>
        </div>

        <!-- Column 2: Vintage Spotify Banner & Social Shortcuts -->
        <div class="fast-card border-yellow">
          <h3 class="fast-heading neon-yellow"><i class="fa-solid fa-compact-disc"></i> Curated Audio Spectrum</h3>
          
          <div class="spotify-retro-banner">
            <div class="spotify-cassette-art">
              <i class="fa-solid fa-record-vinyl"></i>
            </div>
            <div class="spotify-banner-info">
              <h4>70s • 80s • 90s Golden Era</h4>
              <p>Analog synth riffs, classic rock anthems & vintage grooves on loop.</p>
              <a href="https://open.spotify.com/playlist/2ZzM6HDXX13IuSpX8wkJKI?si=70125441173f4b50" target="_blank" class="btn btn-spotify" style="display:inline-flex; width:auto; padding:0.4rem 1rem;">
                <i class="fa-solid fa-play"></i> Open in Spotify
              </a>
            </div>
          </div>

          <h3 class="fast-heading neon-blue" style="margin-top:1.5rem;"><i class="fa-solid fa-share-nodes"></i> Digital Channels</h3>
          <div class="quick-nav-stack">
            <a href="https://www.instagram.com/w_pandya108" target="_blank" class="quick-nav-btn" style="text-decoration:none;">
              <span><i class="fa-brands fa-instagram neon-red"></i> Personal Instagram (@w_pandya108)</span>
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
            <a href="https://www.instagram.com/launchloop.team" target="_blank" class="quick-nav-btn" style="text-decoration:none;">
              <span><i class="fa-solid fa-rocket neon-orange"></i> LaunchLoop Tech Studio (@launchloop.team)</span>
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
            <button onclick="navigateToSection('about')" class="quick-nav-btn">
              <span><i class="fa-solid fa-user neon-blue"></i> Full Bio & Academic Timeline</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  } else if (persona === "batchmate") {
    container.innerHTML = `
      <!-- Batchmate Header Card -->
      <div class="dashboard-hero-card border-blue">
        <div class="hero-top-row">
          <div>
            <div class="badge-role-tag neon-blue">PEER REPOSITORY // VIT CHENNAI CSE</div>
            <h2 class="hero-name">Engineering Hub: Batch of 2021–2025</h2>
            <p class="hero-sub neon-yellow">Startup Builds, System Engineering, Competitive DSA & Tactical 5-Stacks[cite: 1]</p>
          </div>
          <div class="hero-cta-group">
            <a href="https://www.instagram.com/launchloop.team" target="_blank" class="btn btn-orange">
              <i class="fa-solid fa-rocket"></i> LaunchLoop Studio
            </a>
            <button onclick="copyToClipboard('${RIOT_ID}', 'Valorant ID Copied! Ready to queue.')" class="btn btn-blue">
              <i class="fa-solid fa-gamepad"></i> Queue Valorant
            </button>
          </div>
        </div>
      </div>

      <!-- Batchmate KPI Cards -->
      <div class="stats-kpi-grid">
        <div class="kpi-card border-blue">
          <span class="kpi-number neon-blue">LaunchLoop</span>
          <span class="kpi-title">Startup Studio</span>
          <p class="kpi-detail">Building & shipping new software products every 15–20 days with peers.</p>
        </div>
        <div class="kpi-card border-yellow">
          <span class="kpi-number neon-yellow">7.70 CGPA</span>
          <span class="kpi-title">VIT Chennai CSE</span>
          <p class="kpi-detail">Class of 2025 &bull; Core CS foundations: OS, DBMS, Networks & Architecture[cite: 1].</p>
        </div>
        <div class="kpi-card border-red">
          <span class="kpi-number neon-red">@iYoungLord#5710</span>
          <span class="kpi-title">Valorant Riot Tag</span>
          <p class="kpi-detail">Always down for tactical competitive matches or custom lobby scrims.</p>
        </div>
        <div class="kpi-card border-orange">
          <span class="kpi-number neon-orange">AWS + Kafka</span>
          <span class="kpi-title">Primary Backend Stack</span>
          <p class="kpi-detail">FastAPI microservices, real-time event streaming & Docker containers[cite: 1].</p>
        </div>
      </div>

      <!-- Batchmate Fast Review Grid -->
      <div class="dashboard-fast-grid">
        <div class="fast-card border-blue">
          <h3 class="fast-heading neon-blue"><i class="fa-solid fa-code-fork"></i> Collaborative Engineering Tracks</h3>
          <div class="capabilities-table">
            <div class="capability-row">
              <div class="cap-bullet neon-blue"><i class="fa-solid fa-circle-check"></i></div>
              <div class="cap-label">LaunchLoop:</div>
              <div class="cap-desc">Co-founded tech studio building rapid-iteration micro-products & Indian creator tools.</div>
            </div>
            <div class="capability-row">
              <div class="cap-bullet neon-blue"><i class="fa-solid fa-circle-check"></i></div>
              <div class="cap-label">Backend Collabs:</div>
              <div class="cap-desc">Available for hackathons and high-throughput system builds using FastAPI & AWS[cite: 1].</div>
            </div>
            <div class="capability-row">
              <div class="cap-bullet neon-blue"><i class="fa-solid fa-circle-check"></i></div>
              <div class="cap-label">Problem Solving:</div>
              <div class="cap-desc">Continuous algorithmic problem solving across Data Structures & Algorithms[cite: 1].</div>
            </div>
            <div class="capability-row">
              <div class="cap-bullet neon-blue"><i class="fa-solid fa-circle-check"></i></div>
              <div class="cap-label">Gaming & Chill:</div>
              <div class="cap-desc">Self-hosted Docker Minecraft servers & competitive Valorant comp grind.</div>
            </div>
          </div>
        </div>

        <div class="fast-card border-orange">
          <h3 class="fast-heading neon-orange"><i class="fa-solid fa-cubes"></i> Explore Tech Blueprints</h3>
          <div class="quick-nav-stack">
            <button onclick="navigateToSection('projects')" class="quick-nav-btn">
              <span><i class="fa-solid fa-diagram-project neon-yellow"></i> Production Architecture Projects[cite: 1]</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>
            <button onclick="navigateToSection('tools')" class="quick-nav-btn">
              <span><i class="fa-solid fa-toolbox neon-orange"></i> Full Tech Stack & Skills Matrix[cite: 1]</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>
            <button onclick="navigateToSection('experience')" class="quick-nav-btn">
              <span><i class="fa-solid fa-briefcase neon-red"></i> Verified Internship Track Record[cite: 1]</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>
            <a href="https://github.com/ShubhPandya" target="_blank" class="quick-nav-btn" style="text-decoration:none;">
              <span><i class="fa-brands fa-github neon-blue"></i> GitHub Repositories (@ShubhPandya)[cite: 1]</span>
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </div>
        </div>
      </div>
    `;
  }
}

/* ==========================================================================
   SMART UTILITY DISPATCHERS
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
      activePersona = role;
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

  // Render the tailored dashboard for the chosen role
  renderDashboardForPersona(roleKey);

  // Remove viewport scroll-lock class when leaving Screen 1
  document.body.classList.remove("role-screen-active");

  // Switch to Screen 2 and load dashboard
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