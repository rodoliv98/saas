import { Request, Response, NextFunction } from "express"
import { ZodError } from "zod"

export class CustomError extends Error {
  public status: number;
  public code: string | undefined;

  constructor (message = 'Internal Server Error', status = 500, code?: string) {
    super(message); // chama o construtor da classe erro, ex: throw new Error('testando');
    this.name = this.constructor.name; // err.name vai vir o nome, nesse caso CustomErrors
    this.status = status; // adiciona um .status no err
    this.code = code;
    Error.captureStackTrace(this, this.constructor); // limpa a stack, meio inútil mas é bom ter
  }
}

function parseZodError(err: any) {
  return err.errors.map((err: any) => ({
      field: err.path.join('.'),
      message: err.message
  }));
}

export function errorHandler (err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    const simplified = parseZodError(err);
    return res.status(400).json({ validationError: true, error: simplified });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }

  if (err.code === 'P2002') {
    console.log('Erro p2002\n', err);
    const errorName = err.meta.target[0]
    return res.status(400).json({ error: errorName });
  }

  if (err.code === undefined || err.status === undefined) {
    console.log('Vai ser enviado como erro genérico\n', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
  
  res.status(err.status).json({ error: err.message });
}