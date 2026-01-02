import { refreshSchema } from "./../validations/auth";
import { AuthServices } from "@/services/auth.services";
import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "@/validations/auth";
import { HttpError } from "@/utils/http.error";
import { AuthRepo } from "@/repositories";

export class AuthController {
  private authServices = new AuthServices();
  private authRepo = new AuthRepo();

  async register(req: Request, res: Response) {
    try {
      const data = registerSchema.parse(req.body);
      const user = await this.authServices.register(data);
      res.status(201).json({ success: true, data: user });
    } catch (error: any) {
      console.error("Register Error:", error);

      if (error instanceof HttpError) {
        return res
          .status(error.status)
          .json({ success: false, message: error.message });
      }

      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const data = loginSchema.parse(req.body);
      const tokens = await this.authServices.login(data);
      res.status(200).json({ success: true, data: tokens });
    } catch (error: any) {
      console.error("Login Error:", error.message);

      if (error instanceof HttpError) {
        return res
          .status(error.status)
          .json({ success: false, message: error.message });
      }

      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const { token } = refreshSchema.parse(req.body);
      const tokens = await this.authServices.refreshToken(token);
      res.status(200).json({ success: true, data: tokens });
    } catch (error: any) {
      console.error("Refresh Error:", error);

      if (error instanceof HttpError) {
        return res
          .status(error.status)
          .json({ success: false, message: error.message });
      }

      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      await this.authServices.logout(userId);
      res.status(200).json({ success: true });
    } catch (error) {
      console.log(error);

      res.status(500).json({ success: false });
    }
  }

  async currentUser(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const user = await this.authRepo.fetchUserById(req.user.id);

      if (!user) return res.status(404).json({ message: "User not found" });

      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });
    } catch {
      res.status(500).json({ success: false });
    }
  }
}
