import * as express from 'express';
import { controller } from "./controller.js";

export const router = express.Router();

router.get("/", controller.getAllRooms);

