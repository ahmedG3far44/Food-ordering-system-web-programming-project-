const navElements = document.querySelectorAll("nav a");
const currentUser = JSON.parse(localStorage.getItem("user")) || null;
const isLogged = localStorage.getItem("isLogged") === "true";
const logoutBtn = document.querySelector(".logout-button");

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

function handleLogout() {
  localStorage.removeItem("user");
  localStorage.setItem("isLogged", "false");
  window.location.href = `/frontend/login/login.html`;
  logoutBtn.style.display = "none";
}

logoutBtn.addEventListener("click", handleLogout);

// mos3b code cart.js:
// Increase Quantity
function increaseQuantity(btn) {
  const input = btn.parentElement.querySelector(".quantity-input");
  input.value = parseInt(input.value) + 1;
  updateTotal();
}

// Decrease Quantity
function decreaseQuantity(btn) {
  const input = btn.parentElement.querySelector(".quantity-input");
  if (input.value > 1) {
    input.value = parseInt(input.value) - 1;
    updateTotal();
  }
}

// Remove Item
function removeItem(btn) {
  const item = btn.closest(".cart-item");
  item.remove();
  checkEmptyCart();
  updateTotal();
}

// Check if cart is empty
function checkEmptyCart() {
  const itemsList = document.getElementById("cart-items-list");
  const emptyMessage = document.getElementById("empty-cart-message");
  const orderSummary = document.querySelector(".order-summary");

  if (itemsList.children.length === 0) {
    itemsList.style.display = "none";
    emptyMessage.style.display = "block";
  } else {
    itemsList.style.display = "flex";
    emptyMessage.style.display = "none";
    orderSummary.style.display = "block";
  }
}

// Update Total
function updateTotal() {
  let subtotal = 0;
  const items = document.querySelectorAll(".cart-item");

  items.forEach((item) => {
    const price = parseFloat(
      item.querySelector(".item-price").textContent.replace("$", "")
    );
    const quantity = parseInt(item.querySelector(".quantity-input").value);
    const total = price * quantity;
    item.querySelector(".total-price").textContent = "$" + total.toFixed(2);
    subtotal += total;
  });

  const deliveryFee = items.length > 0 ? 2.99 : 0;
  const tax = subtotal * 0.1;
  const totalAmount = subtotal + deliveryFee + tax;

  document.getElementById("subtotal").textContent = "$" + subtotal.toFixed(2);
  document.getElementById("delivery-fee").textContent =
    "$" + deliveryFee.toFixed(2);
  document.getElementById("tax").textContent = "$" + tax.toFixed(2);
  document.getElementById("total-amount").textContent =
    "$" + totalAmount.toFixed(2);
}

// Apply Promo Code
function applyPromo() {
  const promoCode = document.getElementById("promo-code").value.toUpperCase();
  const discounts = { SAVE10: 0.1, SAVE20: 0.2, SAVE15: 0.15 };

  if (discounts[promoCode]) {
    alert(
      "Promo code " +
        promoCode +
        " applied: " +
        discounts[promoCode] * 100 +
        "% discount"
    );
    // Implement discount logic as needed
  } else {
    alert("Invalid promo code");
  }
}

// Go to Checkout
function goToCheckout() {
  const items = document.querySelectorAll(".cart-item");
  if (items.length === 0) {
    alert("Your cart is empty!");
  } else {
    window.location.href = "/frontend/checkout/checkout.html";
  }
}
