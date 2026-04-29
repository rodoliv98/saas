import { AdminRefresh } from "../../admin/types/admin-types";
import { TenantRefresh } from "../../login/entities/tenant";
import { UserRefresh } from "../../login/entities/user";

export type Identity = TenantRefresh | UserRefresh | AdminRefresh;