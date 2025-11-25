
const navElements = document.querySelectorAll("nav a");
const isLogged = localStorage.getItem("isLogged") === "true";
const currentUser = JSON.parse(localStorage.getItem("user")) || null;

if (!currentUser) {
  window.location.href = `/frontend/login/login.html`;
}

if (!currentUser) {
  document.querySelector(".logout-button").style.display = "none";
} else {
  document.querySelector(".logout-button").style.display = "inline-block";
}

navElements.forEach((navEl) => {
  const role = currentUser ? currentUser.role : null;
  switch (role) {
    case "ADMIN":
      if (
        navEl.getAttribute("data-path").includes("login") ||
        navEl.getAttribute("data-path").includes("register") ||
        navEl.getAttribute("data-path").includes("checkout") ||
        navEl.getAttribute("data-path").includes("cart") ||
        navEl.getAttribute("data-path").includes("orders")
      ) {
        navEl.style.display = "none";
      } else {
        navEl.style.display = "inline-block";
      }
      break;
    case "USER":
      if (
        navEl.getAttribute("data-path").includes("dashboard") ||
        navEl.getAttribute("data-path").includes("login") ||
        navEl.getAttribute("data-path").includes("register")
      ) {
        navEl.style.display = "none";
      } else {
        navEl.style.display = "inline-block";
      }
      break;
    default:
      // No user logged in
      if (!isLogged) {
        if (
          navEl.getAttribute("data-path").includes("checkout") ||
          navEl.getAttribute("data-path").includes("cart") ||
          navEl.getAttribute("data-path").includes("dashboard") ||
          navEl.getAttribute("data-path").includes("orders")
        ) {
          navEl.style.display = "none";
        } else {
          navEl.style.display = "inline-block";
        }
      }
  }
});

const logoutBtn = document.querySelector(".logout-button");

function handleLogout() {
  localStorage.removeItem("user");
  localStorage.setItem("isLogged", "false");
  window.location.href = `/frontend/login/login.html`;
  logoutBtn.style.display = "none";
}

logoutBtn.addEventListener("click", handleLogout);
