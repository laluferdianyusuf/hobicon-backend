import { Router } from "express";
const router = Router();
const v1 = Router();

import eventRouter from "./v1/events.routes";
import authRouter from "./v1/auth.routes";

v1.use("/auth", authRouter);
v1.use("/events", eventRouter);

router.use("/api/v1", v1);
export default router;
