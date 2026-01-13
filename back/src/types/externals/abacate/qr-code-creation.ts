export interface AbacateChargeResponse {
  data: {
    id: string;
    amount: number;
    status: 'PENDING',
    devMode: true | false,
    brCode: string,
    brCodeBase64: string,
    platformFee: number;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;
  },
  error: string;
}