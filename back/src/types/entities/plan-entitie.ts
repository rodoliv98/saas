export interface BasicPlanFeatures {
  reports: string;
  support: string;
  kdsSystem: string;
  orderLimit: string;
  digitalMenu: string;
  telegramBot: string;
}

export interface Plan<T> {
  id: number;
  name: string;
  price: {
    monthly: {
      price: number; 
      months: number;
    },
    annually: {
      price: number; 
      months: number;
      discount: number;
    }
  };
  features: T;
  createdAt: Date;
  updatedAt: Date;
}