// server/routes/itemsRoutes.js
import express from "express";
import multer from "multer";
import * as ctrl from "../controllers/itemsController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // multer in memory

router.get("/items", ctrl.listItems);
router.get("/items/:id", ctrl.getItem);
router.get("/items/:id/image", ctrl.getImage);
router.get("/items/:id/download", ctrl.downloadImage);

router.post("/items", upload.single("image"), ctrl.createItem);
router.put("/items/:id", upload.single("image"), ctrl.updateItem);
router.delete("/items/:id", ctrl.deleteItem);

export default router;