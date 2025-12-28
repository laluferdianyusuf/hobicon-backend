import { AuthServices } from "@/services/auth.services";
import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "@/validations/auth";

export class AuthController {
  private authServices: AuthServices;

  constructor() {
    this.authServices = new AuthServices();
  }

  async register(req: Request, res: Response) {
    try {
      const data = registerSchema.parse(req.body);
      const user = await this.authServices.register(data);
      res.status(201).json({ success: true, data: user });
    } catch (error: any) {
      console.error("Create Event Error:", error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const data = loginSchema.parse(req.body);
      const user = await this.authServices.login(data);
      res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      console.error("Create Event Error:", error);
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
