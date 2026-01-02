import type { Request, Response, NextFunction, RequestHandler } from "express";
import Redis from "ioredis";

const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
});

interface DDoSOptions {
  windowSec: number;
  maxRequest: number;
  keyPrefix?: string;
  blockSec?: number;
  log?: boolean;
}

const getClientIp = (req: Request) => {
  return (
    (req.headers["cf-connecting-ip"] as string) ||
    (req.headers["x-forwarded-for"] as string) ||
    req.ip
  );
};

export const protection = (options: DDoSOptions): RequestHandler => {
  console.log("DDoS protection is running");
  const {
    windowSec,
    maxRequest,
    keyPrefix = "ddos:",
    blockSec = 300,
    log = true,
  } = options;

  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const ip = getClientIp(req);
      const userId = (req as any)?.user?.id;

      const key = userId
        ? `${keyPrefix}user:${userId}`
        : `${keyPrefix}ip:${ip}`;

      const blockKey = `${key}:block`;
      const now = Date.now();

      const isBlocked = await redis.get(blockKey);
      if (isBlocked) {
        if (log) console.warn(`Blocked: ${key}`);

        res.status(429).json({
          message: "Temporarily blocked. Try again later",
        });

        return;
      }

      await redis.zadd(key, now, now.toString());
      await redis.zremrangebyscore(key, 0, now - windowSec * 1000);
      const count = await redis.zcard(key);

      if (count > maxRequest) {
        await redis.set(blockKey, "1", "EX", blockSec);

        res.status(429).json({
          message: `Too many requests. Blocked for ${blockSec} seconds.`,
        });

        return;
      }

      await redis.expire(key, windowSec + 10);

      next();
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
};
