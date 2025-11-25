const currentUser = JSON.parse(localStorage.getItem("user")) || null;

if (!currentUser) {
  window.location.href = `/frontend/login/login.html`;
}

if (currentUser.role !== "ADMIN") {
  window.location.href = `/frontend/menu/menu.html`;
}

const dashboardNavLinks = document.querySelectorAll(".sidebar nav a");

dashboardNavLinks.forEach((navEl) => {
  navEl.classList.toggle(
    "active",
    navEl
      .getAttribute("href")
      .includes(window.location.pathname.split("/").pop().split(".html")[0])
  );
  console.log(window.location.pathname.split("/").pop().split(".html")[0]);
});

const logoutBtn = document.querySelector(".logout-btn");

function handleLogout() {
  localStorage.removeItem("user");
  localStorage.setItem("isLogged", "false");
  window.location.href = `/frontend/login/login.html`;
  logoutBtn.style.display = "none";
}

logoutBtn.addEventListener("click", handleLogout);

// Mos3ab dashboard code:
// Show/Hide Sections
function showSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => section.classList.remove("active"));

  // Remove active class from all menu items
  const menuItems = document.querySelectorAll(".menu-item");
  menuItems.forEach((item) => item.classList.remove("active"));

  // Show selected section
  document.getElementById(sectionId).classList.add("active");

  // Add active class to clicked menu item
  event.target.closest(".menu-item").classList.add("active");
}

const adminNameDisplay = document.querySelector(".admin-name");

adminNameDisplay.textContent = currentUser ? currentUser.name : "Admin";
// Search Orders
function searchOrders() {
  const searchInput = document.querySelector("#orders .search-input");
  const filter = searchInput.value.toUpperCase();
  const table = document.querySelector("#orders .data-table");
  const rows = table.getElementsByTagName("tr");

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.getElementsByTagName("td");
    let found = false;

    // Search in all cells
    for (let j = 0; j < cells.length; j++) {
      if (cells[j].textContent.toUpperCase().indexOf(filter) > -1) {
        found = true;
        break;
      }
    }

    row.style.display = found ? "" : "none";
  }
}

// Filter Orders by Status
function filterOrderStatus() {
  const statusFilter = document.querySelector("#orders .filter-select").value;
  const table = document.querySelector("#orders .data-table");
  const rows = table.getElementsByTagName("tr");

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const statusCell = row.querySelector(".status-badge");

    if (statusFilter === "All Status") {
      row.style.display = "";
    } else {
      const rowStatus = statusCell.textContent.trim();
      row.style.display = rowStatus === statusFilter ? "" : "none";
    }
  }
}

// Search Customers
function searchCustomers() {
  const searchInput = document.querySelector("#customers .search-input");
  const filter = searchInput.value.toUpperCase();
  const table = document.querySelector("#customers .data-table");
  const rows = table.getElementsByTagName("tr");

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.getElementsByTagName("td");
    let found = false;

    // Search in all cells
    for (let j = 0; j < cells.length; j++) {
      if (cells[j].textContent.toUpperCase().indexOf(filter) > -1) {
        found = true;
        break;
      }
    }

    row.style.display = found ? "" : "none";
  }
}

// Edit Order
function editOrder(button) {
  const row = button.closest("tr");
  const orderId = row.querySelector("td:first-child").textContent;
  const customer = row.querySelector("td:nth-child(2)").textContent;
  const items = row.querySelector("td:nth-child(3)").textContent;

  const newItems = prompt(`Edit items for ${orderId}:`, items);
  if (newItems !== null) {
    row.querySelector("td:nth-child(3)").textContent = newItems;
    alert(`Order ${orderId} updated successfully!`);
  }
}

// Delete Order
function deleteOrder(button) {
  const row = button.closest("tr");
  const orderId = row.querySelector("td:first-child").textContent;

  if (confirm(`Are you sure you want to delete order ${orderId}?`)) {
    row.remove();
    alert(`Order ${orderId} deleted successfully!`);
  }
}

// Edit Menu Item
function editMenuItem(button) {
  const card = button.closest(".item-card");
  const itemName = card.querySelector(".item-info h3").textContent;
  const itemPrice = card.querySelector(".item-price").textContent;

  const newPrice = prompt(
    `Edit price for ${itemName}:`,
    itemPrice.replace("$", "")
  );
  if (newPrice !== null && newPrice !== "") {
    card.querySelector(".item-price").textContent =
      "$" + parseFloat(newPrice).toFixed(2);
    alert(`${itemName} updated successfully!`);
  }
}

// Delete Menu Item
function deleteMenuItem(button) {
  const card = button.closest(".item-card");
  const itemName = card.querySelector(".item-info h3").textContent;

  if (confirm(`Are you sure you want to delete ${itemName}?`)) {
    card.remove();
    alert(`${itemName} deleted successfully!`);
  }
}

// Add New Item
function addNewItem() {
  const itemName = prompt("Enter item name:");
  if (!itemName) return;

  const itemPrice = prompt("Enter item price:");
  if (!itemPrice) return;

  const itemImage = prompt(
    "Enter image URL (or press Enter for default):",
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
  );

  const itemsGrid = document.querySelector(".items-grid");

  const newItemHTML = `
        <div class="item-card">
            <div class="item-image">
                <img src="${itemImage}" alt="${itemName}">
            </div>
            <div class="item-info">
                <h3>${itemName}</h3>
                <p class="item-price">$${parseFloat(itemPrice).toFixed(2)}</p>
                <p class="item-status">In Stock</p>
                <div class="item-actions">
                    <button class="btn-small btn-edit" onclick="editMenuItem(this)">Edit</button>
                    <button class="btn-small btn-delete" onclick="deleteMenuItem(this)">Delete</button>
                </div>
            </div>
        </div>
    `;

  itemsGrid.insertAdjacentHTML("beforeend", newItemHTML);
  alert(`${itemName} added successfully!`);
}

// Logout Function
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    window.location.href = "login.html";
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  // Set the dashboard as default active section
  document.getElementById("dashboard").classList.add("active");

  // Add event listeners for search inputs
  const ordersSection = document.querySelector("#orders");
  if (ordersSection) {
    const searchInput = ordersSection.querySelector(".search-input");
    const filterSelect = ordersSection.querySelector(".filter-select");

    if (searchInput) searchInput.addEventListener("keyup", searchOrders);
    if (filterSelect)
      filterSelect.addEventListener("change", filterOrderStatus);
  }

  const customersSection = document.querySelector("#customers");
  if (customersSection) {
    const searchInput = customersSection.querySelector(".search-input");
    if (searchInput) searchInput.addEventListener("keyup", searchCustomers);
  }
});
