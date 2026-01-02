import { AuthController } from "@/controllers";
import { Authentication } from "@/middlewares/authentication";
import { protection } from "@/middlewares/protection";
import { Router } from "express";

const router = Router();
const controller = new AuthController();
const authentication = new Authentication();

router.post("/register", controller.register.bind(controller));
router.post(
  "/login",
  // protection({
  //   windowSec: 60,
  //   maxRequest: 100,
  //   blockSec: 300,
  //   log: true,
  // }),
  controller.login.bind(controller)
);
router.post(
  "/refresh",
  // protection({
  //   windowSec: 60,
  //   maxRequest: 100,
  //   blockSec: 300,
  //   log: true,
  // }),
  controller.refresh.bind(controller)
);
router.post(
  "/logout",
  authentication.authenticate.bind(authentication),
  controller.logout.bind(controller)
);
router.get(
  "/me",
  authentication.authenticate.bind(authentication),
  controller.currentUser.bind(controller)
);

export default router;
