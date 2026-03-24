import { z } from 'zod';
import { createProductSchema } from '../../../schemas/products/products-schemas';

const partialFlavorDataSchema = createProductSchema.partial();
type PartialFlavorData = z.infer<typeof partialFlavorDataSchema>;

/* export interface PatchFlavorDTO {
  flavorId: string;
  data: PartialFlavorData;
  tenantId: string;
} */

type FlavorData = z.infer<typeof createProductSchema>;
export interface PatchFlavorDTO {
  data: FlavorData;
  tenantId: string;
  flavorId: string;
  multerImagePath: string | undefined;
}

export interface CreateFlavorDTO {
  data: FlavorData;
  tenantId: string;
  productId: string;
  multerImagePath: string | undefined;
}