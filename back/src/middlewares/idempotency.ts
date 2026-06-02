import { Request, Response, NextFunction } from "express";
import redis from "../lib/redis/redis-connect";

export async function idempotencyOptional(req: Request, res: Response, next: NextFunction) {
  const key = req.headers['idempotency-key'] as string | undefined;
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

export async function idempotencyRequired(req: Request, res: Response, next: NextFunction) {
  const key = req.headers['idempotency-key'] as string | undefined;
  if(!key) return res.status(400).json({ error: 'Chave de idempotencia faltando' });

  const cached = await redis.get(key);
  if(cached){
    const parsed = JSON.parse(cached);
    return res.status(parsed.status).json(parsed.body);
  }

  const originalRes = res.json.bind(res);
  res.json = (body) => {
    const status = res.statusCode;
    if(status >= 200 && status < 300){
      redis.set(key, JSON.stringify({ status, body }), { EX: 86400 });
    }
    
    return originalRes(body);
  };

  next();
}