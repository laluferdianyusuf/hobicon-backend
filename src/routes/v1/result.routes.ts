import { Router } from "express";
import { ResultController } from "@/controllers";
import { upload } from "@/middlewares/upload";

const router = Router();
const controller = new ResultController();

router.post(
  "/:registrationId/results",
  upload.single("image"),
  controller.createResult.bind(controller)
);

router.patch("/update/:id", controller.update.bind(controller));

router.delete("/delete/:id", controller.delete.bind(controller));

export default router;
