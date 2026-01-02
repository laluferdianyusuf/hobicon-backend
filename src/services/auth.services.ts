import { AuthRepo } from "@/repositories/auth.repo";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Redis from "ioredis";
import { HttpError } from "@/utils/http.error";

const redis = new Redis();

interface JWTPayload {
  id: string;
  email: string;
  role: "STUDENT" | "COACH" | "ADMIN" | "PARENT";
}

export class AuthServices {
  private authRepo: AuthRepo;

  constructor() {
    this.authRepo = new AuthRepo();

    if (!process.env.ACCESS_SECRET || !process.env.REFRESH_SECRET) {
      throw new Error("JWT secrets are not configured");
    }
  }

  async register(data: {
    email: string;
    password: string;
    role?: "STUDENT" | "COACH" | "ADMIN" | "PARENT";
  }) {
    const existing = await this.authRepo.fetchUserByEmail(data.email);
    if (existing) throw new HttpError("Email already in use", 409);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.authRepo.register({
      email: data.email,
      password: hashedPassword,
      role: data.role ?? "STUDENT",
    });
  }

  async login(data: { email: string; password: string }) {
    const existing = await this.authRepo.fetchUserByEmail(data.email);
    if (!existing) throw new HttpError("Invalid credentials", 401);

    const isPasswordCorrect = await bcrypt.compare(
      data.password,
      existing.password
    );

    if (!isPasswordCorrect) throw new HttpError("Invalid credentials", 401);

    const payload: JWTPayload = {
      id: existing.id,
      email: existing.email,
      role: existing.role as any,
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET!, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET!, {
      expiresIn: "30d",
    });

    await redis.set(
      `refresh:${existing.id}`,
      refreshToken,
      "EX",
      30 * 24 * 60 * 60
    );

    return { accessToken, refreshToken };
  }

  async refreshToken(token: string) {
    let decoded: JWTPayload;

    try {
      decoded = jwt.verify(token, process.env.REFRESH_SECRET!) as JWTPayload;
    } catch {
      throw new HttpError("Invalid refresh token", 401);
    }

    const storedToken = await redis.get(`refresh:${decoded.id}`);

    if (!storedToken || storedToken !== token) {
      throw new HttpError("Invalid or expired refresh token", 401);
    }

    const user = await this.authRepo.fetchUserById(decoded.id);
    if (!user) throw new HttpError("User not found", 404);

    const payload: JWTPayload = {
      id: user.id,
      email: user.email,
      role: user.role as any,
    };

    const newAccess = jwt.sign(payload, process.env.ACCESS_SECRET!, {
      expiresIn: "15m",
    });

    const newRefresh = jwt.sign(payload, process.env.REFRESH_SECRET!, {
      expiresIn: "30d",
    });

    await redis.set(`refresh:${user.id}`, newRefresh, "EX", 30 * 24 * 60 * 60);

    return { accessToken: newAccess, refreshToken: newRefresh };
  }

  async logout(userId: string) {
    await redis.del(`refresh:${userId}`);
  }
}
