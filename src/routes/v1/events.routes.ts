import { EventController } from "@/controllers";
import { Router } from "express";

const router = Router();
const controller = new EventController();

router.post("/create", controller.createEvent.bind(controller));
router.get("/fetch/:id", controller.getEventById.bind(controller));
router.get("/fetching/alls", controller.getAllEvents.bind(controller));

export default router;
