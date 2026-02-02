import { z } from 'zod';
import { createProductSchema } from '../../../schemas/products/products-schemas';

const partialFlavorDataSchema = createProductSchema.partial();
type PartialFlavorData = z.infer<typeof partialFlavorDataSchema>;

export interface PatchFlavorDTO {
  flavorId: string;
  data: PartialFlavorData;
  tenantId: string;
}