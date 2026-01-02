import { Router } from "express";
const router = Router();
const v1 = Router();

import eventRouter from "./v1/events.routes";
import authRouter from "./v1/auth.routes";
import profileRouter from "./v1/profile.routes";
import teamRouter from "./v1/team.routes";
import registrationRouter from "./v1/registration.routes";

v1.use("/auth", authRouter);
v1.use("/events", eventRouter);
v1.use("/profiles", profileRouter);
v1.use("/teams", teamRouter);
v1.use("/registration", registrationRouter);

router.use("/api/v1", v1);
export default router;
