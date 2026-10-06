function getLoggedInUser() {
  const a = localStorage.getItem("resolver360User"),
    b = sessionStorage.getItem("resolver360User");
  if (a) return JSON.parse(a);
  if (b) return JSON.parse(b);
  return null;
}
function goToLogin() {
  location.href = "login.html";
}
function goToSignup() {
  location.href = "signup.html";
}
function logoutUser() {
  localStorage.removeItem("resolver360User");
  sessionStorage.removeItem("resolver360User");
  location.href = "index.html";
}
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("nav a");
  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((s) => {
      if (scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach((l) =>
      l.classList.toggle("active", l.getAttribute("href") === "#" + current),
    );
  });
});
