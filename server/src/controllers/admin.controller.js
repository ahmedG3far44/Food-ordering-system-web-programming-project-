import { promisePool } from "../config/database.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const { period = "today" } = req.query;

    let dateFilter = "";
    if (period === "today") {
      dateFilter = "DATE(created_at) = CURDATE()";
    } else if (period === "week") {
      dateFilter = "created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
    } else if (period === "month") {
      dateFilter = "created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
    }

    // Total orders and revenue
    const [orderStats] = await promisePool.query(
      `SELECT 
        COUNT(*) as total_orders,
        SUM(final_amount) as total_revenue,
        AVG(final_amount) as average_order_value
       FROM orders
       WHERE ${dateFilter}`
    );

    // Orders by status
    const [statusBreakdown] = await promisePool.query(
      `SELECT 
        status,
        COUNT(*) as count
       FROM orders
       WHERE ${dateFilter}
       GROUP BY status`
    );

    // Top selling items
    const [topItems] = await promisePool.query(
      `SELECT 
        mi.id, mi.name, mi.image_url,
        SUM(oi.quantity) as total_sold,
        SUM(oi.subtotal) as revenue
       FROM order_items oi
       JOIN menu_items mi ON oi.menu_item_id = mi.id
       JOIN orders o ON oi.order_id = o.id
       WHERE ${dateFilter.replace("created_at", "o.created_at")}
       GROUP BY mi.id, mi.name, mi.image_url
       ORDER BY total_sold DESC
       LIMIT 10`
    );

    // Recent reviews
    const [recentReviews] = await promisePool.query(
      `SELECT 
        r.id, r.rating, r.comment, r.created_at,
        u.full_name as user_name,
        mi.name as menu_item_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       JOIN menu_items mi ON r.menu_item_id = mi.id
       ORDER BY r.created_at DESC
       LIMIT 5`
    );

    res.json({
      success: true,
      data: {
        orderStats: orderStats[0],
        statusBreakdown,
        topItems,
        recentReviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const { status, search, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT 
        o.id, o.order_number, o.status, o.final_amount, o.payment_status,
        o.estimated_delivery_time, o.created_at,
        u.full_name as customer_name, u.email as customer_email, u.phone as customer_phone,
        a.street_address, a.city
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN addresses a ON o.delivery_address_id = a.id
      WHERE 1=1
    `;

    const params = [];

    if (status) {
      query += " AND o.status = ?";
      params.push(status);
    }

    if (search) {
      query +=
        " AND (o.order_number LIKE ? OR u.full_name LIKE ? OR u.email LIKE ?)";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ` ORDER BY o.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const [orders] = await promisePool.query(query, params);

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  const connection = await promisePool.getConnection();

  try {
    await connection.beginTransaction();

    const { orderId } = req.params;
    const { status, notes } = req.body;

    // Validate status transition
    const [orders] = await connection.query(
      "SELECT status FROM orders WHERE id = ?",
      [orderId]
    );

    if (orders.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const currentStatus = orders[0].status;

    // Define valid status transitions
    const validTransitions = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["preparing", "cancelled"],
      preparing: ["on_the_way", "cancelled"],
      on_the_way: ["delivered"],
      delivered: [],
      cancelled: [],
    };

    if (!validTransitions[currentStatus].includes(status)) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: `Cannot transition from ${currentStatus} to ${status}`,
      });
    }

    // Update order status
    const updateData = { status };
    if (status === "delivered") {
      updateData.delivered_at = new Date();
      updateData.payment_status = "completed";
    }

    const updateFields = Object.keys(updateData)
      .map((key) => `${key} = ?`)
      .join(", ");
    const updateValues = Object.values(updateData);

    await connection.query(`UPDATE orders SET ${updateFields} WHERE id = ?`, [
      ...updateValues,
      orderId,
    ]);

    // Add to status history
    await connection.query(
      `INSERT INTO order_status_history (order_id, status, notes)
       VALUES (?, ?, ?)`,
      [orderId, status, notes || `Status updated to ${status}`]
    );

    await connection.commit();

    res.json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

export const getSalesReport = async (req, res, next) => {
  try {
    const { start_date, end_date, group_by = "day" } = req.query;

    let dateFormat = "%Y-%m-%d";
    if (group_by === "month") dateFormat = "%Y-%m";
    if (group_by === "year") dateFormat = "%Y";

    let query = `
      SELECT 
        DATE_FORMAT(created_at, ?) as period,
        COUNT(*) as order_count,
        SUM(final_amount) as total_revenue,
        AVG(final_amount) as avg_order_value,
        SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as completed_orders,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders
      FROM orders
      WHERE 1=1
    `;

    const params = [dateFormat];

    if (start_date) {
      query += " AND DATE(created_at) >= ?";
      params.push(start_date);
    }

    if (end_date) {
      query += " AND DATE(created_at) <= ?";
      params.push(end_date);
    }

    query += " GROUP BY period ORDER BY period DESC";

    const [report] = await promisePool.query(query, params);

    // Calculate totals
    const totals = report.reduce(
      (acc, row) => ({
        totalOrders: acc.totalOrders + parseInt(row.order_count),
        totalRevenue: acc.totalRevenue + parseFloat(row.total_revenue),
        completedOrders: acc.completedOrders + parseInt(row.completed_orders),
        cancelledOrders: acc.cancelledOrders + parseInt(row.cancelled_orders),
      }),
      {
        totalOrders: 0,
        totalRevenue: 0,
        completedOrders: 0,
        cancelledOrders: 0,
      }
    );

    res.json({
      success: true,
      data: {
        report,
        totals,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getItemPerformance = async (req, res, next) => {
  try {
    const { start_date, end_date, limit = 20 } = req.query;

    let query = `
      SELECT 
        mi.id, mi.name, mi.price, mi.image_url,
        mi.avg_rating, mi.total_reviews,
        COUNT(DISTINCT oi.order_id) as order_count,
        SUM(oi.quantity) as total_quantity_sold,
        SUM(oi.subtotal) as total_revenue
      FROM menu_items mi
      LEFT JOIN order_items oi ON mi.id = oi.menu_item_id
      LEFT JOIN orders o ON oi.order_id = o.id
      WHERE 1=1
    `;

    const params = [];

    if (start_date) {
      query += " AND DATE(o.created_at) >= ?";
      params.push(start_date);
    }

    if (end_date) {
      query += " AND DATE(o.created_at) <= ?";
      params.push(end_date);
    }

    query += `
      GROUP BY mi.id, mi.name, mi.price, mi.image_url, mi.avg_rating, mi.total_reviews
      ORDER BY total_revenue DESC
      LIMIT ?
    `;
    params.push(parseInt(limit));

    const [items] = await promisePool.query(query, params);

    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomerInsights = async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;

    // Top customers by order value
    const [topCustomers] = await promisePool.query(
      `SELECT 
        u.id, u.full_name, u.email, u.phone,
        COUNT(o.id) as total_orders,
        SUM(o.final_amount) as total_spent,
        AVG(o.final_amount) as avg_order_value,
        MAX(o.created_at) as last_order_date
       FROM users u
       JOIN orders o ON u.id = o.user_id
       WHERE o.status = 'delivered'
       GROUP BY u.id, u.full_name, u.email, u.phone
       ORDER BY total_spent DESC
       LIMIT ?`,
      [parseInt(limit)]
    );

    // New customers this month
    const [newCustomers] = await promisePool.query(
      `SELECT COUNT(*) as count
       FROM users
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
       AND role = 'customer'`
    );

    res.json({
      success: true,
      data: {
        topCustomers,
        newCustomersThisMonth: newCustomers[0].count,
      },
    });
  } catch (error) {
    next(error);
  }
};
