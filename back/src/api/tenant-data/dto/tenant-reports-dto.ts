import { z } from 'zod';
import { tenantReportSchema } from '../schemas/tenant-reports-schema';

export type TenantReportDTO = z.infer<typeof tenantReportSchema>;