const securityQuestions = [
  "What is your mother's maiden name?",
  "What was the name of your first school?",
  "What was the name of your first pet?",
  "What is your favourite childhood nickname?",
  "What city were you born in?",
  "What was your first mobile phone model?",
  "What is the name of your favourite teacher?",
];
const mockUsers = [
  {
    name: "Soham",
    email: "soham@resolver360.com",
    password: "Soham@123",
    employeeId: "EMP1001",
    role: "Employee",
    securityQuestion: "What was the name of your first school?",
    securityAnswer: "abc school",
  },
  {
    name: "Priya Sharma",
    email: "priya@resolver360.com",
    password: "Priya@123",
    employeeId: "HR1001",
    role: "HR",
    securityQuestion: "What is your mother's maiden name?",
    securityAnswer: "sharma",
  },
  {
    name: "Amit Das",
    email: "amit@resolver360.com",
    password: "Amit@123",
    employeeId: "ADM1001",
    role: "Admin",
    securityQuestion: "What city were you born in?",
    securityAnswer: "kolkata",
  },
];
function getRegisteredUsers() {
  try {
    return JSON.parse(
      localStorage.getItem("resolver360RegisteredUsers") || "[]",
    );
  } catch {
    return [];
  }
}
function saveRegisteredUsers(u) {
  localStorage.setItem("resolver360RegisteredUsers", JSON.stringify(u));
}
function getAllUsers() {
  return [...mockUsers, ...getRegisteredUsers()];
}
function getPasswordOverride(email) {
  try {
    return (
      JSON.parse(localStorage.getItem("resolver360PasswordOverrides") || "{}")[
        email.toLowerCase()
      ] || null
    );
  } catch {
    return null;
  }
}
function findUserByEmail(email) {
  const u = getAllUsers().find(
    (x) => x.email.toLowerCase() === email.toLowerCase(),
  );
  if (!u) return null;
  const copy = { ...u };
  const override = getPasswordOverride(email);
  if (override) copy.password = override;
  return copy;
}
function showAuthMessage(el, msg, type) {
  if (!el) return;
  el.textContent = msg;
  el.className = "auth-message " + type;
}
function loadQuestions() {
  ["securityQuestion", "forgotSecurityQuestion"].forEach((id) => {
    const s = document.getElementById(id);
    if (!s) return;
    s.innerHTML = '<option value="">Select a security question</option>';
    securityQuestions.forEach((q) => {
      const o = document.createElement("option");
      o.value = q;
      o.textContent = q;
      s.appendChild(o);
    });
  });
}
function setupLogin() {
  const f = document.getElementById("loginForm");
  if (!f) return;
  f.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim(),
      password = document.getElementById("loginPassword").value,
      msg = document.getElementById("loginMessage"),
      u = findUserByEmail(email);
    if (!email || !password)
      return showAuthMessage(
        msg,
        "Please enter your email and password.",
        "error",
      );
    if (!u)
      return showAuthMessage(
        msg,
        "No account found with this email address.",
        "error",
      );
    if (u.password !== password)
      return showAuthMessage(
        msg,
        "Incorrect password. Please try again.",
        "error",
      );
    localStorage.removeItem("resolver360User");
    sessionStorage.removeItem("resolver360User");
    const remember = document.getElementById("rememberMe");
    (remember && remember.checked ? localStorage : sessionStorage).setItem(
      "resolver360User",
      JSON.stringify(u),
    );
    showAuthMessage(msg, "Login successful. Redirecting...", "success");
    setTimeout(() => (location.href = "dashboard.html"), 500);
  });
}
function setupSignup() {
  const f = document.getElementById("signupForm");
  if (!f) return;
  f.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("signupName").value.trim(),
      email = document.getElementById("signupEmail").value.trim(),
      employeeId = document.getElementById("employeeId").value.trim(),
      role = document.getElementById("signupRole").value,
      password = document.getElementById("signupPassword").value,
      confirm = document.getElementById("confirmPassword").value,
      q = document.getElementById("securityQuestion").value,
      a = document.getElementById("securityAnswer").value.trim(),
      msg = document.getElementById("signupMessage");
    if (
      !name ||
      !email ||
      !employeeId ||
      !role ||
      !password ||
      !confirm ||
      !q ||
      !a
    )
      return showAuthMessage(
        msg,
        "Please fill in all required fields.",
        "error",
      );
    if (!/^\S+@\S+\.\S+$/.test(email))
      return showAuthMessage(
        msg,
        "Please enter a valid email address.",
        "error",
      );
    if (password.length < 8)
      return showAuthMessage(
        msg,
        "Password must contain at least 8 characters.",
        "error",
      );
    if (password !== confirm)
      return showAuthMessage(msg, "Passwords do not match.", "error");
    if (findUserByEmail(email))
      return showAuthMessage(
        msg,
        "An account with this email already exists.",
        "error",
      );
    const users = getRegisteredUsers();
    users.push({
      name,
      email,
      password,
      employeeId,
      role,
      securityQuestion: q,
      securityAnswer: a.toLowerCase(),
    });
    saveRegisteredUsers(users);
    showAuthMessage(
      msg,
      "Account created successfully. Redirecting to login...",
      "success",
    );
    setTimeout(() => (location.href = "login.html"), 800);
  });
}
function setupForgot() {
  const f = document.getElementById("forgotPasswordForm");
  if (!f) return;
  f.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document
        .getElementById("forgotEmail")
        .value.trim()
        .toLowerCase(),
      q = document.getElementById("forgotSecurityQuestion").value,
      a = document
        .getElementById("forgotSecurityAnswer")
        .value.trim()
        .toLowerCase(),
      p = document.getElementById("newPassword").value,
      c = document.getElementById("confirmNewPassword").value,
      msg = document.getElementById("forgotPasswordMessage"),
      u = getAllUsers().find((x) => x.email.toLowerCase() === email);
    if (!u)
      return showAuthMessage(
        msg,
        "No account found with this email address.",
        "error",
      );
    if (u.securityQuestion !== q)
      return showAuthMessage(msg, "Security question does not match.", "error");
    if (u.securityAnswer.toLowerCase() !== a)
      return showAuthMessage(msg, "Security answer is incorrect.", "error");
    if (p.length < 8)
      return showAuthMessage(
        msg,
        "New password must contain at least 8 characters.",
        "error",
      );
    if (p !== c)
      return showAuthMessage(msg, "New passwords do not match.", "error");
    const users = getRegisteredUsers(),
      i = users.findIndex((x) => x.email.toLowerCase() === email);
    if (i >= 0) {
      users[i].password = p;
      saveRegisteredUsers(users);
    } else {
      const o = JSON.parse(
        localStorage.getItem("resolver360PasswordOverrides") || "{}",
      );
      o[email] = p;
      localStorage.setItem("resolver360PasswordOverrides", JSON.stringify(o));
    }
    showAuthMessage(
      msg,
      "Password changed successfully. Redirecting to login...",
      "success",
    );
    setTimeout(() => (location.href = "login.html"), 800);
  });
}
function setupPasswordToggle() {
  document.querySelectorAll("[data-password-toggle]").forEach((b) =>
    b.addEventListener("click", () => {
      const x = document.getElementById(b.dataset.passwordToggle);
      if (x.type === "password") {
        x.type = "text";
        b.textContent = "Hide";
      } else {
        x.type = "password";
        b.textContent = "Show";
      }
    }),
  );
}
document.addEventListener("DOMContentLoaded", () => {
  loadQuestions();
  setupLogin();
  setupSignup();
  setupForgot();
  setupPasswordToggle();
});
