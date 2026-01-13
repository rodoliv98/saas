import { Request, Response, NextFunction } from "express";
import { cpf, cnpj } from "cpf-cnpj-validator";

export function dataValidator (req: Request, res: Response, next: NextFunction) {
  const data = req.body;
  
  const cnpjIsValid = cnpj.isValid(data.CNPJ);
  if (cnpjIsValid == false) return res.status(400).json({ error: 'CNPJ inválido' });
  
  const cpfIsValid = cpf.isValid(data.CPF);
  if (cpfIsValid == false) return res.status(400).json({ error: 'CPF inválido' }); 

  next();
}