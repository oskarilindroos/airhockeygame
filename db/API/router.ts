import express  from 'express';
import { controller } from "./controller.js";

export const router = express.Router();

router.get("/", controller.getAllRooms);
router.get("/:roomID", controller.getRoomById);
router.delete("/delete/:roomID", controller.deleteRoom);
router.post("/create/:url", controller.createRoom);
router.put("/update/:roomID", controller.updateRoomStatus);

