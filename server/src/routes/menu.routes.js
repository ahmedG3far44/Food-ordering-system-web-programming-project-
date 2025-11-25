import { Router } from "express";

import myDB from "../config/database.js";
import SQL from "../models/queries.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    // const user = req.user;
    // if (!user) {
    //   res.status(400).json({
    //     data: "[ERROR]: Not Authorized User",
    //     message: "user info is required!!!",
    //     success: false,
    //   });
    // }

    const [menuItems] = await myDB.query(SQL.getAllMenuItems());

    if (!menuItems) {
      res.status(404).json({
        data: "[ERROR]: 404 Not found ",
        message: "not found menu item!!!",
        success: false,
      });
    }

    console.log(menuItems);

    res.status(200).json({
      data: menuItems,
      message: "getting all items list successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      data: `[ERROR]: ${error.name}`,
      message: error.message,
      success: false,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    // const itemId = req.params.itemId;
    // const user = req.user;
    const payload = req.body;

    console.log(payload);

    if (!payload) {
      res.status(400).json({
        data: "[ERROR]: can't add new item",
        message: "menu item info is required!!",
        success: false,
      });
    }

    const { name, image, description, price } = payload;

    const [newMenuItem] = await myDB.query(SQL.addNewMenuItem(), [
      name,
      image,
      description,
      price,
    ]);

    if (!newMenuItem) {
      res.status(404).json({
        data: "[ERROR]: 404 Not found ",
        message: "not found menu item!!!",
        success: false,
      });
    }

    const [items] = await myDB.query(SQL.getAllMenuItems());

    res.status(200).json({
      data: items,
      message: "getting all menu items successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      data: `[ERROR]: ${error.name}`,
      message: error.message,
      success: false,
    });
  }
});

router.put("/:itemId", async (req, res) => {
  try {
    const itemId = req.params.itemId;
    // const user = req.user;
    const payload = req.body;

    console.log(payload);

    if (!itemId) {
      res.status(400).json({
        data: "[ERROR]: Invalid Inputs error",
        message: "Item Id is required!!!",
        success: false,
      });
    }

    if (!payload) {
      res.status(400).json({
        data: "[ERROR]: Invalid Inputs error",
        message: "new menu info is required!!!",
        success: false,
      });
    }

    // if (!user) {
    //   res.status(400).json({
    //     data: "[ERROR]: Not Authorized User",
    //     message: "user info is required!!!",
    //     success: false,
    //   });
    // }

    const [menuItem] = await myDB.query(SQL.isMenuItemExists(), [itemId]);

    if (!menuItem) {
      res.status(404).json({
        data: "[ERROR]: 404 Not found ",
        message: "not found menu item!!!",
        success: false,
      });
    }

    const { name, description, image, price, is_available } = payload;

    const [updatedMenuItem] = await myDB.query(SQL.updateMenuItemById(), [
      name,
      description,
      image,
      price,
      is_available,
      parseInt(itemId),
    ]);

    console.log(updatedMenuItem);

    const [items] = await myDB.query(SQL.getAllMenuItems());

    res.status(200).json({
      data: items,
      message: `updated menu item with ID: ${itemId} successfully`,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      data: `[ERROR]: ${error.name}`,
      message: error.message,
      success: false,
    });
  }
});
router.delete("/:itemId", async (req, res) => {
  try {
    const itemId = req.params.itemId;
    // const user = req.user;

    if (!itemId) {
      res.status(400).json({
        data: "[ERROR]: Invalid Inputs error",
        message: "Item Id is required!!!",
        success: false,
      });
    }
    const [menuItem] = await myDB.query(SQL.isMenuItemExists(), [itemId]);
    if (!menuItem) {
      res.status(404).json({
        data: "[ERROR]: 404 Not found ",
        message: "not found menu item!!!",
        success: false,
      });
    }
    const [deletedMenuItem] = await myDB.query(SQL.deleteMenuItem(), [
      parseInt(itemId),
    ]);
    console.log(deletedMenuItem);
    const [newItems] = await myDB.query(SQL.getAllMenuItems());
    console.log(newItems);
    res.status(200).json({
      data: newItems,
      message: "menu item was deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      data: `[ERROR]: ${error.name}`,
      message: error.message,
      success: false,
    });
  }
});
export default router;
