function togglePassword() {
  const passwordInput = document.getElementById("pass");
  const toggleIcon = document.querySelector(".toggle-password");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleIcon.classList.remove("fa-eye-slash");
    toggleIcon.classList.add("fa-eye");
  } else {
    passwordInput.type = "password";
    toggleIcon.classList.remove("fa-eye");
    toggleIcon.classList.add("fa-eye-slash");
  }
}

// Validate individual field
function validateField(field) {
  const inputGroup = field.closest(".input-group");
  const errorMessage = inputGroup.querySelector(".error-message");
  let isValid = true;

  if (!field.value.trim()) {
    isValid = false;
  } else if (field.type === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    isValid = emailRegex.test(field.value);
  } else if (field.id === "phone") {
    const phoneRegex = /^\+?[\d\s\-()]+$/;
    isValid =
      phoneRegex.test(field.value) &&
      field.value.replace(/\D/g, "").length >= 10;
  } else if (field.id === "pass") {
    isValid = field.value.length >= 8;
  }

  if (isValid) {
    inputGroup.classList.remove("error");
    errorMessage.classList.remove("show");
  } else {
    inputGroup.classList.add("error");
    errorMessage.classList.add("show");
  }

  return isValid;
}

// Handle form submission
async function handleRegister(event) {
  event.preventDefault();

  const form = document.getElementById("registerForm");
  const submitBtn = form.querySelector(".submit-btn");

  // Get form values
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const address = document.getElementById("address");
  const password = document.getElementById("pass");

  // Validate all fields
  const fields = [name, email, phone, address, password];
  let isValid = true;

  fields.forEach((field) => {
    if (!validateField(field)) {
      isValid = false;
    }
  });

  if (!isValid) {
    return;
  }

  // Prepare request body
  const requestBody = {
    name: name.value.trim(),
    email: email.value.trim(),
    password: password.value,
    phone: phone.value.trim(),
    address: address.value.trim(),
  };

  // Disable button and show loading state
  submitBtn.disabled = true;
  submitBtn.textContent = "Creating Account...";

  try {
    const response = await fetch("http://localhost:4000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Registration failed");
    }

    // ⚠️ WARNING: Storing user data in localStorage is NOT secure
    // This should be replaced with HTTP-only cookies and JWT tokens
    localStorage.setItem("user", JSON.stringify(result.data));
    localStorage.setItem("isLogged", "true");

    // If the API returns a token, store it (still not ideal, but better than nothing)
    if (result.data.token) {
      localStorage.setItem("authToken", result.data.token);
    }

    // Success - redirect to menu page
    alert("Account created successfully!");
    window.location.href = "/frontend/menu/menu.html";
  } catch (error) {
    console.error("Registration error:", error);
    alert(error.message || "Failed to create account. Please try again.");

    // Re-enable button
    submitBtn.disabled = false;
    submitBtn.textContent = "Create Account";
  }
}

// Attach submit handler
document
  .getElementById("registerForm")
  .addEventListener("submit", handleRegister);

// Add real-time validation
document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("blur", function () {
    validateField(this);
  });
});
