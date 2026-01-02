import { Router } from "express";
import { Authentication } from "@/middlewares/authentication";
import { TeamController } from "@/controllers";

const router = Router();
const controller = new TeamController();
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

router.get("/detail/:id", controller.detail.bind(controller));

router.put(
  "/update/:id",
  authentication.authenticate.bind(authentication),
  controller.update.bind(controller)
);

router.post(
  "/create/:id/members",
  authentication.authenticate.bind(authentication),
  controller.addMember.bind(controller)
);

router.delete(
  "/cerate/:id/members",
  authentication.authenticate.bind(authentication),
  controller.removeMember.bind(controller)
);

export default router;
