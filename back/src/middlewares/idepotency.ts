import { Request, Response, NextFunction } from "express";
import redis from "../lib/redis/redis-connect";

export async function idepotencyOptional(req: Request, res: Response, next: NextFunction) {
  const key = req.headers['idepotency-key'] as string | undefined;
  if(!key) return next();

  const cached = await redis.get(key);
  if(cached) return res.status(200).json(cached);

  const originalRes = res.json.bind(res);
  res.json = (body) => {
    redis.set(key, JSON.stringify(body), { EX: 86400 });
    return originalRes();
  };

  next();
}

export async function idepotencyRequired(req: Request, res: Response, next: NextFunction) {
  const key = req.headers['idepotency-key'] as string | undefined;
  if(!key) return res.status(400).json({ error: 'Chave de idepotencia faltando' });

  const cached = await redis.get(key);
  if(cached) return res.status(200).json(cached);

  const originalRes = res.json.bind(res);
  res.json = (body) => {
    redis.set(key, JSON.stringify(body), { EX: 86400 });
    return originalRes();
  };

  next();
}