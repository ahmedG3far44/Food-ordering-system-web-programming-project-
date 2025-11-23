// import {
//   getAllOrders,
//   updateOrderStatus,
// } from "../controllers/admin.controller";

// const userModel = {
//   id: 1,
//   email: "",
//   password: "",
//   full_name: "",
//   role: "customer",
//   phone: "",
//   cart: [],
//   orders: [],
//   created_at: "",
//   updated_at: "",
// };
// const menuModel = {
//   id: 1,
//   name: "",
//   description: "",
//   price: 0.0,
//   image: "",
//   category: "",
// };

// const cartModel = {
//   id: 1,
//   user_id: 1,
//   items: [
//     {
//       menu_item_id: 1,
//       quantity: 2,
//       price: 0.0,
//     },
//   ],
//   total_amount: 0.0,
// };

// const orderModel = {
//   id: 1,
//   user_id: 1,
//   items: [
//     {
//       menu_item_id: 1,
//       quantity: 2,
//       price: 0.0,
//     },
//   ],
//   order_date: "",
//   total_amount: 0.0,
// };
// const itemsModel = {
//   id: 1,
//   order_id: 1,
//   menu_item_id: 1,
//   quantity: 2,
//   price: 0.0,
//   subtotal: 0.0,
// };

// table users
// table menu_items
// table orders
// table order_items
// table categories
// table carts
// table cart_items

const SQL = {
  // auth Queries
  loginUser: (email) => `SELECT * FROM users WHERE email ='${email}';`,
  registerUser: (user) =>
    `INSERT INTO users (email, password, full_name, role, phone) VALUES ('${user.email}', '${user.password}', '${user.full_name}', '${user.role}', '${user.phone}');`,
  getUserById: (id) => `SELECT * FROM users WHERE id =${id};`,

  // Cart Queries
  getUserCart: (userId) => `SELECT * FROM carts WHERE user_id =${userId};`,
  addItemsToCart: (cartId, item) =>
    `INSERT INTO cart_items (cart_id, menu_item_id, quantity, price) VALUES (${cartId}, ${item.menu_item_id}, ${item.quantity}, ${item.price});`,
  removeMenuItemsFromCart: (cartId) =>
    `DELETE FROM cart_items WHERE cart_id = ${cartId};`,
  updateCartItemQuantity: (cartId, menuItemId, quantity) =>
    `UPDATE cart_items SET quantity = ${quantity} WHERE cart_id = ${cartId} AND menu_item_id = ${menuItemId};`,
  clearCart: (cartId) => `DELETE FROM cart_items WHERE cart_id = ${cartId};`,


  // Menu Queries
  getMenuItems: () => `SELECT * FROM menu_items;`,
  createNewMenuItem: (item) =>
    `INSERT INTO menu_items (name, description, price, image, category) VALUES ('${item.name}', '${item.description}', ${item.price}, '${item.image}', '${item.category}');`,
  updateMenuItem: (itemId, item) =>
    `UPDATE menu_items SET name='${item.name}', description='${item.description}', price=${item.price}, image='${item.image}', category='${item.category}' WHERE id=${itemId};`,
  deleteMenuItem: (itemId) => `DELETE FROM menu_items WHERE id = ${itemId};`,

  // Order Queries
  getAllOrders: () => `SELECT * FROM orders;`,
  getAllUserOrders: (userId) => `SELECT * FROM orders WHERE user_id =${userId};`,
  createNewOrder: (order) =>
    `INSERT INTO orders (user_id, total_amount, order_date) VALUES (${order.user_id}, ${order.total_amount}, '${order.order_date}');`,
  updateOrderStatus: (orderId, status) =>
    `UPDATE orders SET status = '${status}' WHERE id = ${orderId};`,
};

export default SQL;
