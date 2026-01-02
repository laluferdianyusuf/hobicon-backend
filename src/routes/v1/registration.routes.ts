import { Router } from "express";
import { Authentication } from "@/middlewares/authentication";
import { RegistrationController } from "@/controllers";

const router = Router();
const controller = new RegistrationController();
const auth = new Authentication();

router.post(
  "/create/individual",
  auth.authenticate.bind(auth),
  controller.registerIndividual.bind(controller)
);

router.post(
  "/create/team",
  auth.authenticate.bind(auth),
  controller.registerTeam.bind(controller)
);

router.put("/update/:id/status", controller.updateStatus.bind(controller));

router.delete(
  "/delete/:id",
  auth.authenticate.bind(auth),
  controller.delete.bind(controller)
);

export default router;
