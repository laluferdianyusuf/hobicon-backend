import { AuthController } from "@/controllers";
import { Router } from "express";

const router = Router();
const controller = new AuthController();

router.post("/register", controller.register.bind(controller));

router.post("/login", controller.login.bind(controller));

export default router;
