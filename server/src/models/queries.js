// sql.js
const SQL = {
  getUserCart: () => `
    SELECT c.cart_id, ci.cart_item_id, ci.quantity, ci.notes, m.*
    FROM carts c
    LEFT JOIN cart_items ci ON c.cart_id = ci.cart_id
    LEFT JOIN menu m ON ci.item_id = m.item_id
    WHERE c.user_id = ?;
  `,

  addItemToCart: () => `
    INSERT INTO cart_items (cart_id, item_id, quantity, notes)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity);
  `,

  removeItemFromCart: () => `
    DELETE FROM cart_items WHERE cart_id = ? AND item_id = ?;
  `,

  clearCart: () => `
    DELETE FROM cart_items WHERE cart_id = ?;
  `,

  updateItemCartQuantity: () => `
    UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND item_id = ?;
  `,

  createOrder: () => `
    INSERT INTO orders (user_id, total_amount, payment_method, payment_status, order_status)
    VALUES (?, ?, ?, 'pending', 'pending');
  `,

  addOrderItem: () => `
    INSERT INTO order_items (order_id, item_id, name_at_purchase, price_at_purchase, quantity, notes)
    VALUES (?, ?, ?, ?, ?, ?);
  `,

  clearUserCart: () => `
    DELETE FROM cart_items WHERE cart_id = ?;
  `,

  updateOrderStatus: () => `
    UPDATE orders SET order_status = ? WHERE order_id = ?;
  `,

  isUserExist: () => `
    SELECT * FROM users WHERE email = ? LIMIT 1;
  `,

  registerNewUser: () => `
    INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?);
  `,

  getUserOrders: () => `
    SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC;
  `,

  getAllOrders: () => `
    SELECT * FROM orders ORDER BY created_at DESC;
  `,

  isMenuItemExists: () => `
  SELECT * FROM menu WHERE item_id= ? ORDER BY created_at DESC;`,
  addNewMenuItem: () => `
    INSERT INTO menu (name, description, image_url, price)
    VALUES (?, ?, ?, ?);
  `,

  updateMenuItemById: () => `
    UPDATE menu SET name=?, description=?, image_url=?, price=?, is_available=?
    WHERE item_id = ?;
  `,

  deleteMenuItem: () => `
    DELETE FROM menu WHERE item_id = ?;
  `,

  getAllMenuItems: () => `
    SELECT * FROM menu ORDER BY created_at DESC;
  `,

  getCurrentUser: () => `
    SELECT user_id, name, email, phone, role, is_active FROM users WHERE user_id = ?;
  `,
};
export default SQL;
