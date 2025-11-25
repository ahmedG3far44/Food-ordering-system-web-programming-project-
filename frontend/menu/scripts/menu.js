const navElements = document.querySelectorAll("nav a");
const currentUser = JSON.parse(localStorage.getItem("user")) || null;
const isLogged = localStorage.getItem("isLogged") === "true";

const currentPath = window.location.pathname;

// Prevent infinite redirect loop
if (!currentUser && !currentPath.includes("login.html")) {
  window.location.href = "/frontend/login/login.html";
}

const logoutBtn = document.querySelector(".logout-button");

// Show/hide logout button safely
if (logoutBtn) {
  if (!currentUser) {
    logoutBtn.style.display = "none";
  } else {
    logoutBtn.style.display = "inline-block";
  }

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");
    localStorage.setItem("isLogged", "false");
    window.location.href = "/frontend/login/login.html";
  });
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

// Menu page specific code can go here

// Menu Data
// const menuItems = [
//   {
//     id: 1,
//     name: "Spicy Ramen Bowl",
//     price: 14.5,
//     category: "ramen",
//     availability: "15 Bowls Available",
//     image:
//       "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
//   },
//   {
//     id: 2,
//     name: "Gyoza Dumplings",
//     price: 8.0,
//     category: "dumplings",
//     availability: "22 Servings Available",
//     image:
//       "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop",
//   },
//   {
//     id: 3,
//     name: "Miso Soup",
//     price: 4.5,
//     category: "soup",
//     availability: "30 Bowls Available",
//     image:
//       "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=300&fit=crop",
//   },
//   {
//     id: 4,
//     name: "California Roll",
//     price: 12.0,
//     category: "roll",
//     availability: "18 Rolls Available",
//     image:
//       "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
//   },
//   {
//     id: 5,
//     name: "Edamame",
//     price: 6.0,
//     category: "soup",
//     availability: "25 Servings Available",
//     image:
//       "https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=400&h=300&fit=crop",
//   },
//   {
//     id: 6,
//     name: "Spicy Ramen Bowl",
//     price: 14.5,
//     category: "ramen",
//     availability: "15 Bowls Available",
//     image:
//       "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
//   },
//   {
//     id: 7,
//     name: "Gyoza Dumplings",
//     price: 8.0,
//     category: "dumplings",
//     availability: "22 Servings Available",
//     image:
//       "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop",
//   },
//   {
//     id: 8,
//     name: "California Roll",
//     price: 12.0,
//     category: "roll",
//     availability: "18 Rolls Available",
//     image:
//       "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
//   },
// ];

// Cart State
let menuItems = [];

async function getAllMenuItems() {
  try {
    const response = await fetch("http://localhost:4000/api/menu");
    if (!response.ok) {
      alert(response.message);
      return;
    }
    const result = await response.json();
    console.log(result.data);
    menuItems = result.data;
  } catch (error) {
    console.log(error.message);
    return;
  }
}

let cart = [];
let currentCategory = "all";

document.addEventListener("DOMContentLoaded", async () => {
  // loadUserInfo();
  await getAllMenuItems();
  // loadCart();
  console.log(menuItems, "menu items list: ");
  renderMenu(menuItems);
});

// Load user information from localStorage
function loadUserInfo() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      document.getElementById("userName").innerText = user.name;
    }
  } catch (error) {
    console.error("Error loading user info:", error);
  }
}

// Load cart from localStorage
function loadCart() {
  try {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      cart = JSON.parse(savedCart);
      updateCartUI();
    }
  } catch (error) {
    console.error("Error loading cart:", error);
  }
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  console.log("cart saved: ");
  console.log(JSON.parse(localStorage.getItem("cart")));
}

// Render menu items
function renderMenu(items) {
  const menuGrid = document.getElementById("menuGrid");
  menuGrid.innerHTML = "";

  items.forEach((item) => {
    const menuCard = createMenuCard(item);
    menuGrid.appendChild(menuCard);
  });

  updateResultsCount(items.length);
}

// Create menu card element
function createMenuCard(item) {
  const card = document.createElement("div");
  card.className = "menu-item";
  card.innerHTML = `
        <img src="${item.image_url}" alt="${item.name}" 
    class="item-image">
        <div class="item-details">
            <div class="item-header">
                <h3 class="item-name">${item.name}</h3>
                <span class="item-price">$${parseFloat(item.price).toFixed(
                  2
                )}</span>
            </div>
            <p class="item-availability">${
              item.is_available === 1 ? "In stock" : "N/A"
            }</p>
            <button class="add-to-cart-btn" onclick="addToCart(${
              item.item_id
            })">
                <i class="fas fa-shopping-cart"></i>
                Add to Cart
            </button>
        </div>
    `;
  return card;
}

// Add item to cart
function addToCart(itemId) {
  const item = menuItems.find((i) => i.id === itemId);
  if (!item) return;

  const existingItem = cart.find((i) => i.id === itemId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      ...item,
      quantity: 1,
    });
  }

  saveCart(cart);
  updateCartUI();
  showNotification("Item added to cart!");
}

// Remove item from cart
function removeFromCart(itemId) {
  cart = cart.filter((item) => item.id !== itemId);
  saveCart();
  updateCartUI();
}

// Update item quantity
function updateQuantity(itemId, delta) {
  const item = cart.find((i) => i.id === itemId);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    removeFromCart(itemId);
  } else {
    saveCart();
    updateCartUI();
  }
}

// Update cart UI
function updateCartUI() {
  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const totalPrice = document.getElementById("totalPrice");

  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  // Update cart items
  if (cart.length === 0) {
    cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-basket"></i>
                <p>Your cart is empty</p>
            </div>
        `;
  } else {
    cartItems.innerHTML = cart
      .map(
        (item) => `
            <div class="cart-item">
                <img src="${item.image_url}" alt="${
          item.name
        }" class="cart-item-image" onerror="this.src='https://via.placeholder.com/70x70?text=Food'">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${(
                      item.price * item.quantity
                    ).toFixed(2)}</div>
                    <div class="cart-item-actions">
                        <button class="quantity-btn" onclick="updateQuantity(${
                          item.id
                        }, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${
                          item.id
                        }, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${
                  item.id
                })">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `
      )
      .join("");
  }

  // Update total price
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalPrice.textContent = `$${total.toFixed(2)}`;
}

// Toggle cart sidebar
function toggleCart() {
  const cartSidebar = document.getElementById("cartSidebar");
  const cartOverlay = document.getElementById("cartOverlay");

  cartSidebar.classList.toggle("active");
  cartOverlay.classList.toggle("active");
}

// Filter menu by category
function filterCategory(category) {
  currentCategory = category;

  // Update active button
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");

  // Filter and render
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  filterMenu();
}

// Filter menu by search and category
function filterMenu() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();

  let filtered = menuItems;

  // Filter by category
  if (currentCategory !== "all") {
    filtered = filtered.filter((item) => item.category === currentCategory);
  }

  // Filter by search term
  if (searchTerm) {
    filtered = filtered.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
    );
  }

  renderMenu(filtered);
}

// Update results count
function updateResultsCount(count) {
  const resultsCount = document.getElementById("resultsCount");
  resultsCount.textContent = `${count} ${count === 1 ? "Result" : "Results"}`;
}

// Checkout function
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (
    confirm(
      `Proceed to checkout?\n\nItems: ${itemCount}\nTotal: $${total.toFixed(2)}`
    )
  ) {
    // Here you would typically redirect to a checkout page
    // For now, we'll just show a success message
    alert("Order placed successfully! Thank you for your purchase.");

    // Clear cart
    cart = [];
    saveCart();
    updateCartUI();
    toggleCart();
  }
}

// Show notification
function showNotification(message) {
  // Create notification element
  const notification = document.createElement("div");
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
  notification.innerHTML = `
        <i class="fas fa-check-circle"></i> ${message}
    `;

  // Add animation keyframes
  if (!document.getElementById("notification-styles")) {
    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = "slideIn 0.3s ease reverse";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}
