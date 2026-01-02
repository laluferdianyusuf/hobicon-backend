import { AuthRepo } from "@/repositories";
import type { NextFunction, Request, Response } from "express";

import Redis from "ioredis";
import jwt from "jsonwebtoken";

const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
});

export class Authentication {
  private authRepo: AuthRepo;

  constructor() {
    this.authRepo = new AuthRepo();
  }

  async authenticate(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized: Missing or invalid token",
      });
    }

    const token = header.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const blacklisted = await redis.get(`blacklist:${token}`);
    if (blacklisted) {
      return res.status(403).json({
        message: "Token has been revoked",
      });
    }

    try {
      const decoded = jwt.verify(
        token as string,
        process.env.ACCESS_SECRET as string
      ) as any;

      const user = await this.authRepo.fetchUserById(decoded.id);

      if (!user) {
        return res.status(401).json({
          message: "Unauthorized: User not found",
        });
      }

      (req.user as any) = user;

      next();
    } catch (error) {
      console.log(error);

      const isExpired = error instanceof jwt.TokenExpiredError;
      return res.status(401).json({
        message: isExpired
          ? "Unauthorized: Token expired. PLease refresh"
          : "Unauthorized: Invalid token",
      });
    }
  }

  async isAdmin(req: Request, res: Response, next: NextFunction) {
    const user = req.user;

    if (!user || (user.role as any) !== "ADMIN") {
      return res.status(403).json({
        message: "Forbidden: Admin access only",
      });
    }

    next();
  }
}
