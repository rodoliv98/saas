import { z } from 'zod';
import { orderReportSchema } from '../../schemas/orders/order-reports';

export type OrderReportDTO = z.infer<typeof orderReportSchema>;