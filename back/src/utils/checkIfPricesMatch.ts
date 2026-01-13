import { Decimal } from "@prisma/client/runtime/library";
import { CustomError } from "../middlewares/errorHandler";

export function checkIfPricesMatch (dbPrices: Array<{precoProduto: Decimal}>, bodyTotal: number, taxaEntrega: number) {
  let sumInCents = 0;
  
  for (let i = 0; i < dbPrices.length; i++) {
    sumInCents += Math.round(Number(dbPrices[i].precoProduto) * 100);
  }

  const bodyWithFee = Math.round(bodyTotal * 100);
  const realBodyPrice = bodyWithFee - Math.round(taxaEntrega * 100);
  
  if (sumInCents !== realBodyPrice) throw new CustomError('Preços não batem', 400, 'BAD_REQUEST');
}