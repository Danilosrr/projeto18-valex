import { connection } from "../../database.js";

export interface Sum {
  sum: number;
}
export interface Payment {
  id: number;
  cardId: number;
  businessId: number;
  timestamp: Date;
  amount: number;
}
export type PaymentWithBusinessName = Payment & { businessName: string };
export type PaymentInsertData = Omit<Payment, "id" | "timestamp">;

export async function findByCardId(cardId: number) {
  const result = await connection.query<PaymentWithBusinessName, [number]>(
    `SELECT 
      payments.*,
      businesses.name as "businessName"
     FROM payments 
      JOIN businesses ON businesses.id=payments."businessId"
     WHERE "cardId"=$1
    `,
    [cardId]
  );

  return result.rows;
}

export async function insert(paymentData: PaymentInsertData) {
  const { cardId, businessId, amount } = paymentData;

  connection.query<any, [number, number, number]>(
    `INSERT INTO payments ("cardId", "businessId", amount) VALUES ($1, $2, $3)`,
    [cardId, businessId, amount]
  );
}

export async function balanceByCardId(cardId: number) {
  const result = await connection.query<Sum, [number]>(
    `SELECT SUM(amount) FROM payments WHERE "cardId"=$1`,
    [cardId]
  );

  return result.rows[0].sum;
}

export const paymentRepository = {
  findByCardId,
  balanceByCardId,
  insert
};