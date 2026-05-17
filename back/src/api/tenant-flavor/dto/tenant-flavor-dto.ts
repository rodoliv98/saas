import { z } from 'zod';
import { createProductSchema } from '../../../schemas/products/products-schemas';

type FlavorData = z.infer<typeof createProductSchema>;
export interface PatchFlavorDTO {
  data: FlavorData;
  tenantId: string;
  tenantSlug: string;
  flavorId: string;
  multerImagePath: string | undefined;
}

export interface CreateFlavorDTO {
  data: FlavorData;
  tenantId: string;
  tenantSlug: string;
  productId: string;
  multerImagePath: string | undefined;
}