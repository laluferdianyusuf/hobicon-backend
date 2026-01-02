import { Router } from "express";
import { Authentication } from "@/middlewares/authentication";
import { ProfileController } from "@/controllers";

const router = Router();
const controller = new ProfileController();
const authentication = new Authentication();

router.post(
  "/create",
  authentication.authenticate.bind(authentication),
  controller.create.bind(controller)
);

router.get(
  "/mine",
  authentication.authenticate.bind(authentication),
  controller.mine.bind(controller)
);

router.get("/profile/:id", controller.detail.bind(controller));

router.put(
  "/update/:id",
  authentication.authenticate.bind(authentication),
  controller.update.bind(controller)
);

export default router;
