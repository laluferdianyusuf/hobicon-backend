import { AuthRepo } from "@/repositories/auth.repo";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Redis from "ioredis";

const redis = new Redis();

export class AuthServices {
  private authRepo: AuthRepo;

  constructor() {
    this.authRepo = new AuthRepo();
  }

  async register(data: {
    email: string;
    password: string;
    role?: "STUDENT" | "COACH" | undefined;
  }) {
    const existing = await this.authRepo.fetchUserByEmail(data.email);
    if (existing) throw new Error("Email already in use");

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.authRepo.register({
      email: data.email,
      password: hashedPassword,
      role: data.role || "STUDENT",
    });
  }

  async login(data: { email: string; password: string }) {
    const existing = await this.authRepo.fetchUserByEmail(data.email);
    if (!existing) throw new Error("Email not found");

    const isPasswordCorrect = bcrypt.compareSync(
      data.password,
      existing.password
    );
    if (!isPasswordCorrect) throw new Error("Password doesn't match");

    const accessToken = jwt.sign(
      { id: existing.id, email: existing.email, role: existing.role },
      process.env.ACCESS_SECRET || "access_secret",
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: existing.id, email: existing.email, role: existing.role },
      process.env.REFRESH_SECRET || "refresh_secret",
      { expiresIn: "30d" }
    );

    await redis.set(
      `refresh:${existing.id}`,
      refreshToken,
      "EX",
      30 * 24 * 60 * 60
    );

    return { accessToken, refreshToken };
  }
}
