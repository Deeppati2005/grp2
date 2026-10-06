const DASH_DATA = {
  Employee: {
    title: "Employee Dashboard",
    subtitle: "Report workplace issues and track resolution in real time",
    nav: [
      ["overview", "▦", "Overview"],
      ["report", "＋", "Issue Reporting"],
      ["live", "◷", "Live Status"],
      ["history", "↺", "Past History"],
      ["feedback", "★", "Ratings & Feedback"],
      ["profile", "◉", "Profile"],
    ],
    stats: [
      ["Open Tickets", "3", "2 awaiting support"],
      ["In Progress", "2", "1 due today"],
      ["Resolved", "18", "92% resolved on time"],
      ["Avg. Resolution", "4.2h", "12% faster"],
    ],
    tickets: [
      [
        "R360-1042",
        "Laptop not starting",
        "Resolver Team",
        "In Progress",
        "Today",
      ],
      [
        "R360-1037",
        "VPN connection issue",
        "Network Team",
        "Open",
        "Yesterday",
      ],
      ["R360-1029", "Keyboard replacement", "Facilities", "Resolved", "02 Oct"],
    ],
    history: [
      ["R360-1029", "Keyboard replacement", "Resolved", "02 Oct", "4.8h"],
      ["R360-1018", "Monitor flickering", "Resolved", "28 Sep", "3.1h"],
      ["R360-1006", "VPN access", "Resolved", "21 Sep", "2.7h"],
      ["R360-0998", "Mouse malfunction", "Resolved", "15 Sep", "5.2h"],
    ],
  },
  HR: {
    title: "HR Dashboard",
    subtitle: "Monitor employee workplace support and business impact",
    nav: [
      ["overview", "▦", "Overview"],
      ["report", "＋", "Issue Reporting"],
      ["live", "◷", "Live Status"],
      ["history", "↺", "Past History"],
      ["analytics", "▥", "Analytics"],
      ["impact", "◎", "Employee Impact"],
      ["feedback", "★", "Ratings & Feedback"],
      ["profile", "◉", "Profile"],
    ],
    stats: [
      ["Employees Impacted", "27", "4 fewer than last week"],
      ["Open Issues", "11", "3 high priority"],
      ["Resolved Today", "19", "95% SLA compliance"],
      ["Avg. Resolution", "3.8h", "8% improvement"],
    ],
    tickets: [
      [
        "R360-1042",
        "Laptop not starting",
        "Kolkata Resolver Team",
        "In Progress",
        "Today",
      ],
      ["R360-1041", "AC not cooling", "Facilities", "High Priority", "Today"],
      [
        "R360-1037",
        "VPN connection issue",
        "Resolver Team",
        "Open",
        "Yesterday",
      ],
      ["R360-1032", "Access card issue", "Facilities", "Resolved", "Yesterday"],
    ],
    impact: [
      ["Technology", "14", "52%"],
      ["Facilities", "8", "30%"],
      ["Access & Security", "3", "11%"],
      ["Other", "2", "7%"],
    ],
  },
  Admin: {
    title: "Admin Dashboard",
    subtitle: "Enterprise-wide operational visibility and service governance",
    nav: [
      ["overview", "▦", "Overview"],
      ["report", "＋", "Issue Reporting"],
      ["live", "◷", "Live Status"],
      ["history", "↺", "Past History"],
      ["sla", "◔", "SLA Monitoring"],
      ["performance", "▥", "My Performance"],
      ["analytics", "▥", "Analytics"],
      ["feedback", "★", "Ratings & Feedback"],
      ["profile", "◉", "Profile"],
    ],
    stats: [
      ["Total Tickets", "184", "12% higher than last month"],
      ["Open", "32", "7 high priority"],
      ["SLA Compliance", "96.4%", "+2.1% this month"],
      ["Resolution Rate", "91.8%", "+4.7% this month"],
    ],
    tickets: [
      [
        "R360-1042",
        "Laptop not starting",
        "Resolver Team",
        "In Progress",
        "Today",
      ],
      ["R360-1041", "AC not cooling", "Facilities", "High Priority", "Today"],
      [
        "R360-1037",
        "VPN connection issue",
        "Resolver Team",
        "Open",
        "Yesterday",
      ],
      [
        "R360-1022",
        "Outlook not syncing",
        "Resolver Team",
        "In Progress",
        "Yesterday",
      ],
    ],
  },
};
function user() {
  try {
    return JSON.parse(
      localStorage.getItem("resolver360User") ||
        sessionStorage.getItem("resolver360User") ||
        "null",
    );
  } catch {
    return null;
  }
}
function roleOf(u) {
  return ["Employee", "HR", "Admin"].includes(u?.role) ? u.role : "Employee";
}
let U = user();
let ROLE = roleOf(U);
let DATA = DASH_DATA[ROLE];
let current = "overview";
function navRender() {
  document.getElementById("sideNav").innerHTML = DATA.nav
    .map(
      (x) =>
        `<button class="side-link ${x[0] === current ? "active" : ""}" data-section="${x[0]}"><span class="nav-icon">${x[1]}</span><span>${x[2]}</span></button>`,
    )
    .join("");
  document
    .querySelectorAll(".side-link")
    .forEach((b) => (b.onclick = () => showSection(b.dataset.section)));
}
function showSection(id) {
  current = id;
  navRender();
  renderMain();
  document.getElementById("sidebar").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function statCards() {
  return `<div class="cards">${DATA.stats.map((s) => `<div class="stat-card"><small>${s[0]}</small><strong>${s[1]}</strong><span>↗ ${s[2]}</span></div>`).join("")}</div>`;
}
function ticketTable(rows = DATA.tickets) {
  return `<div class="panel"><div class="panel-head"><h3>Recent Tickets</h3><small>${rows.length} records</small></div><table><thead><tr><th>Ticket ID</th><th>Issue</th><th>Owner/Team</th><th>Status</th><th>Time</th></tr></thead><tbody>${rows.map((r) => `<tr>${r.map((v, i) => `<td>${i === 3 ? `<span class="badge ${v.includes("Resolved") ? "green" : v.includes("High") ? "red" : v.includes("In Progress") ? "orange" : "blue"}">${v}</span>` : v}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
function overview() {
  let extra =
    ROLE === "Employee"
      ? `<div class="panel"><div class="panel-head"><h3>Quick Actions</h3></div><div class="quick-grid"><button class="quick" onclick="showSection('report')"><b>＋ Report an Issue</b><small>Create a new workplace ticket</small></button><button class="quick" onclick="showSection('live')"><b>◷ Track Live Status</b><small>See current ticket progress</small></button><button class="quick" onclick="showSection('history')"><b>↺ Past History</b><small>Review previous resolutions</small></button><button class="quick" onclick="showSection('feedback')"><b>★ Give Feedback</b><small>Rate support experience</small></button></div></div>`
      : `<div class="panel"><div class="panel-head"><h3>${ROLE === "HR" ? "Employee Impact Snapshot" : ROLE === "Admin" ? "Service Performance" : "SLA & Queue Health"}</h3></div>${ROLE === "HR" ? DATA.impact.map((x) => `<div class="metric-row"><b>${x[0]}</b><div class="progress"><i style="width:${x[2]}"></i></div><span>${x[1]}</span></div>`).join("") : ROLE === "Admin" ? ["First Response", "Resolution", "SLA Compliance", "Routing Accuracy"].map((x, i) => `<div class="metric-row"><b>${x}</b><div class="progress"><i style="width:${[94, 92, 96, 89][i]}%"></i></div><span>${[94, 92, 96, 89][i]}%</span></div>`).join("") : ["Open Queue", "Due < 2 Hours", "SLA Met", "Customer Rating"].map((x, i) => `<div class="metric-row"><b>${x}</b><div class="progress"><i style="width:${[62, 35, 96, 94][i]}%"></i></div><span>${["14", "6", "96%", "4.7/5"][i]}</span></div>`).join("")}</div>`;
  return `<div class="welcome"><div><h2>Hello, ${U?.name || "User"} 👋</h2><p>${DATA.subtitle}</p></div><span class="role-pill">${ROLE}</span></div>${statCards()}<div class="grid-2">${ticketTable()}${extra}</div>`;
}
function report() {
  return `<div class="welcome"><div><h2>Issue Reporting</h2><p>Create a workplace hardware or software issue.</p></div></div><div class="panel"><form class="form-grid-dash" onsubmit="submitMock(event)"><label>Issue Type<select><option>Hardware</option><option>Software</option><option>Network</option><option>Access & Security</option><option>Facilities</option></select></label><label>Priority<select><option>Medium</option><option>Low</option><option>High</option><option>Critical</option></select></label><label>Asset ID<input placeholder="Scan or enter asset ID" value="AST-KOL-1042"></label><label>Location<input value="Kolkata Office - Floor 3"></label><label class="full">Issue Description<textarea rows="5" placeholder="Describe the issue..."></textarea></label><div class="full"><button class="primary">Create Ticket</button></div></form></div><div class="panel"><div class="panel-head"><h3>Mock Routing Preview</h3></div><p style="color:var(--muted);font-size:13px">Asset AST-KOL-1042 → Kolkata Office → Hardware → <b>Kolkata Resolver Queue</b></p></div>`;
}
function live() {
  return `<div class="welcome"><div><h2>Live Status</h2><p>Real-time view of active workplace issues.</p></div></div>${ticketTable(DATA.tickets.filter((x) => x[3] !== "Resolved"))}<div class="panel"><div class="panel-head"><h3>Ticket Timeline - R360-1042</h3></div><div class="timeline"><div class="timeline-item"><i class="timeline-dot"></i><div><b>Ticket created</b><small>Today, 09:10 • Asset and location validated</small></div></div><div class="timeline-item"><i class="timeline-dot"></i><div><b>Routed to local resolver</b><small>Today, 09:11 • Kolkata Resolver Queue</small></div></div><div class="timeline-item"><i class="timeline-dot"></i><div><b>Engineer assigned</b><small>Today, 09:26 • Resolver accepted ticket</small></div></div><div class="timeline-item"><i class="timeline-dot"></i><div><b>Resolution in progress</b><small>Today, 09:35 • Diagnostic started</small></div></div></div></div>`;
}
function history() {
  return `<div class="welcome"><div><h2>Past History</h2><p>Previously raised tickets and resolution details.</p></div></div>${ticketTable(DATA.history || DATA.tickets)}<div class="panel"><div class="panel-head"><h3>Resolution Summary</h3></div><p style="color:var(--muted);font-size:13px">Historical mock data shows ticket ownership, status, resolution time and closure details for reporting and audit purposes.</p></div>`;
}
function feedback() {
  return `<div class="welcome"><div><h2>Ratings & Feedback</h2><p>Review service quality and submit feedback.</p></div></div><div class="grid-2"><div class="panel"><div class="panel-head"><h3>Service Ratings</h3><strong class="rating">★★★★★</strong></div><div class="metric-row"><b>Overall Rating</b><div class="progress"><i style="width:94%"></i></div><span>4.7/5</span></div><div class="metric-row"><b>Resolution Quality</b><div class="progress"><i style="width:92%"></i></div><span>4.6/5</span></div><div class="metric-row"><b>Support Experience</b><div class="progress"><i style="width:96%"></i></div><span>4.8/5</span></div></div><div class="panel"><div class="panel-head"><h3>Recent Comments</h3></div><div class="notice"><b>Excellent support</b><p>Issue was resolved quickly and professionally.</p></div><div class="notice"><b>Good communication</b><p>Status updates were clear throughout the process.</p></div></div></div><div class="panel feedback-panel"><div class="panel-head"><h3>Submit Feedback</h3></div><form class="feedback-form" onsubmit="feedbackMock(event)"><label>Ticket<select required><option value="">Select a resolved ticket</option><option>R360-1029 - Keyboard replacement</option><option>R360-1018 - Monitor flickering</option></select></label><label>Rating<select required><option value="">Select a rating</option><option>5 - Excellent</option><option>4 - Good</option><option>3 - Average</option><option>2 - Poor</option><option>1 - Very Poor</option></select></label><label>Comments<textarea rows="4" placeholder="Share your experience..."></textarea></label><button class="primary" type="submit">Submit Feedback</button></form></div>`;
}
function profile() {
  return `<div class="welcome"><div><h2>Profile</h2><p>Your Resolver360 account information.</p></div></div><div class="panel profile"><div class="profile-avatar">${(U?.name || "U")[0].toUpperCase()}</div><div class="info-list"><div><small>Name</small><b>${U?.name || "User"}</b></div><div><small>Role</small><b>${ROLE}</b></div><div><small>Email</small><b>${U?.email || "user@example.com"}</b></div><div><small>Employee ID</small><b>${U?.employeeId || "EMP0000"}</b></div><div><small>Department</small><b>${ROLE === "HR" ? "Human Resources" : ROLE === "Admin" ? "Administration" : "Business Operations"}</b></div><div><small>Location</small><b>Kolkata Office</b></div></div></div>`;
}
function analytics() {
  return `<div class="welcome"><div><h2>Analytics</h2><p>Service performance trends across the workplace.</p></div></div><div class="grid-2"><div class="panel"><div class="panel-head"><h3>Tickets by Month</h3></div><div class="chart">${[
    ["May", 55],
    ["Jun", 68],
    ["Jul", 72],
    ["Aug", 61],
    ["Sep", 84],
    ["Oct", 76],
  ]
    .map(
      (x) =>
        `<div class="bar-wrap"><div class="bar" style="height:${x[1]}%"></div><small>${x[0]}</small></div>`,
    )
    .join(
      "",
    )}</div></div><div class="panel"><div class="panel-head"><h3>Category Distribution</h3></div>${["Hardware 42%", "Software 28%", "Network 18%", "Facilities 12%"].map((x, i) => `<div class="metric-row"><b>${x.split(" ")[0]}</b><div class="progress"><i style="width:${[42, 28, 18, 12][i]}%"></i></div><span>${x.split(" ")[1]}</span></div>`).join("")}</div></div>`;
}
function impact() {
  return `<div class="welcome"><div><h2>Employee Impact</h2><p>Mock view of employees affected by workplace issues.</p></div></div><div class="cards"><div class="stat-card"><small>Employees Impacted</small><strong>27</strong><span>Across 6 teams</span></div><div class="stat-card"><small>Productivity Hours Saved</small><strong>84h</strong><span>This month</span></div><div class="stat-card"><small>Critical Impacts</small><strong>3</strong><span>Under monitoring</span></div><div class="stat-card"><small>Employee Satisfaction</small><strong>4.7/5</strong><span>Positive trend</span></div></div><div class="panel"><div class="panel-head"><h3>Impact by Category</h3></div>${DATA.impact.map((x) => `<div class="metric-row"><b>${x[0]}</b><div class="progress"><i style="width:${x[2]}"></i></div><span>${x[1]}</span></div>`).join("")}</div>`;
}
function sla() {
  return `<div class="welcome"><div><h2>SLA Monitoring</h2><p>Track response and resolution commitments.</p></div></div><div class="cards"><div class="stat-card"><small>SLA Compliance</small><strong>96%</strong><span>+2.1% this week</span></div><div class="stat-card"><small>At Risk</small><strong>4</strong><span>Needs attention</span></div><div class="stat-card"><small>Breached</small><strong>1</strong><span>Escalation created</span></div><div class="stat-card"><small>Avg. Resolution</small><strong>3.6h</strong><span>Within target</span></div></div>${ticketTable(DATA.tickets)}`;
}
function performance() {
  return `<div class="welcome"><div><h2>My Performance</h2><p>Mock performance metrics for ${ROLE} operations.</p></div></div><div class="cards"><div class="stat-card"><small>SLA Score</small><strong>96%</strong><span>Excellent</span></div><div class="stat-card"><small>Tickets Resolved</small><strong>118</strong><span>This month</span></div><div class="stat-card"><small>First Response</small><strong>18m</strong><span>Target &lt; 30m</span></div><div class="stat-card"><small>Rating</small><strong>4.8/5</strong><span>Customer feedback</span></div></div><div class="panel"><div class="panel-head"><h3>Weekly Performance</h3></div>${["Response Time", "Resolution Rate", "SLA Compliance", "Customer Rating"].map((x, i) => `<div class="metric-row"><b>${x}</b><div class="progress"><i style="width:${[91, 94, 96, 97][i]}%"></i></div><span>${[91, 94, 96, 97][i]}%</span></div>`).join("")}</div>`;
}
function renderMain() {
  document.getElementById("dashboardTitle").textContent = DATA.title;
  document.getElementById("dashboardSubtitle").textContent = DATA.subtitle;
  const map = {
    overview,
    report,
    live,
    history,
    feedback,
    profile,
    analytics,
    impact,
    sla,
    performance,
  };
  document.getElementById("mainContent").innerHTML =
    `<section class="section active">${(map[current] || overview)()}</section>`;
}
function submitMock(e) {
  e.preventDefault();
  toast("Mock ticket created: R360-1051 and routed successfully.");
}
function feedbackMock(e) {
  e.preventDefault();
  toast("Feedback submitted successfully.");
}
function toast(msg) {
  const x = document.createElement("div");
  x.className = "toast";
  x.textContent = msg;
  document.body.appendChild(x);
  setTimeout(() => x.remove(), 2500);
}
function setupTheme() {
  const saved = localStorage.getItem("resolver360Theme");
  if (saved === "dark") document.body.classList.add("dark-theme");
  document.getElementById("themeToggle").textContent =
    document.body.classList.contains("dark-theme") ? "☀" : "☾";
  document.getElementById("themeToggle").onclick = () => {
    document.body.classList.toggle("dark-theme");
    const dark = document.body.classList.contains("dark-theme");
    localStorage.setItem("resolver360Theme", dark ? "dark" : "light");
    document.getElementById("themeToggle").textContent = dark ? "☀" : "☾";
  };
}
function setupMenu() {
  const side = document.getElementById("sidebar");
  const menu = document.getElementById("menuButton");
  menu.onclick = () => {
    if (innerWidth <= 760) side.classList.toggle("open");
    else {
      side.classList.toggle("collapsed");
      localStorage.setItem(
        "resolver360SidebarCollapsed",
        side.classList.contains("collapsed") ? "1" : "0",
      );
    }
  };
  if (
    innerWidth > 760 &&
    localStorage.getItem("resolver360SidebarCollapsed") === "1"
  )
    side.classList.add("collapsed");
}
function init() {
  if (!U) {
    location.href = "login.html";
    return;
  }
  document.querySelector("[data-user-name]").textContent = U.name;
  document.querySelector("[data-user-role]").textContent = ROLE;
  document.getElementById("userAvatar").textContent = U.name[0].toUpperCase();
  document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("resolver360User");
    sessionStorage.removeItem("resolver360User");
    location.href = "index.html";
  };
  navRender();
  renderMain();
  setupTheme();
  setupMenu();
}
document.addEventListener("DOMContentLoaded", init);
