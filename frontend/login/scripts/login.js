const email = document.getElementById("login-email");
const password = document.getElementById("login-pass");
const loginForm = document.getElementById("login-form");
const loginBtn = document.getElementById("login-btn");
const errorBox = document.getElementById("error-box");

const currentPath = window.location.pathname;
const currentUser = JSON.parse(localStorage.getItem("user")) || null;

const isLoginPage = currentPath.includes("/login/login.html");
const isAdmin = currentUser?.role === "ADMIN";

if (!currentUser && !isLoginPage) {
  window.location.href = `/frontend/login/login.html`;
}

if (currentUser && isLoginPage) {
  if (isAdmin) {
    window.location.href = `/frontend/dashboard/dashboard.html`;
  } else {
    window.location.href = `/frontend/menu/menu.html`;
  }
}

let loading = false;

function setLoading(state) {
  loading = state;

  email.disabled = state;
  password.disabled = state;
  loginBtn.disabled = state;

  if (state) {
    loginBtn.innerText = "Logging in...";
    loginBtn.classList.add("loading");
  } else {
    loginBtn.innerText = "Login";
    loginBtn.classList.remove("loading");
  }
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const emailVal = email.value.trim();
  const passwordVal = password.value.trim();

  if (!emailVal || !passwordVal) {
    showError("Please fill in all fields.");
    return;
  }

  if (passwordVal.length < 6) {
    showError("Password must be at least 6 characters long.");
    return;
  }

  await handleLogin(emailVal, passwordVal);
});

function showError(message) {
  errorBox.textContent = message;
  errorBox.style.display = "block";
}

function clearError() {
  errorBox.textContent = "";
  errorBox.style.display = "none";
}

async function handleLogin(email, password) {
  try {
    clearError();
    setLoading(true);
    const response = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();
    if (!response.ok) {
      showError(result.error || "Login failed");
      return;
    }
    localStorage.setItem("isLogged", "true");
    localStorage.setItem("user", JSON.stringify(result.data));

    if (result.data.role === "ADMIN") {
      window.location.href = "/frontend/dashboard/dashboard.html";
      return;
    }
    window.location.href = "/frontend/menu/menu.html";
  } catch (error) {
    console.error("Login failed:", error);
    showError("Something went wrong. Try again.");
  } finally {
    setLoading(false);
  }
}

function togglePassword() {
  const input = document.getElementById("login-pass");
  input.type = input.type === "password" ? "text" : "password";
}
