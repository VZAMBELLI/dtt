import "server-only";

/**
 * Camada de pagamento.
 * Hoje: provedor "simulado" (para desenvolvimento e demonstração).
 * Para produção, implemente um adaptador com split de pagamento — Pagar.me (recebedores)
 * ou Mercado Pago (Marketplace / split) — mantendo esta mesma interface.
 */
export type SplitRule = { storeId: string; amountCents: number };
export type ChargeInput = { orderCode: string; totalCents: number; platformFeeCents: number; splits: SplitRule[]; method: "PIX" | "CARTAO" | "BOLETO" };
export type ChargeResult = { ref: string; status: "PENDING" | "PAID"; instructions?: string };

export interface PaymentProvider {
  name: string;
  createCharge(input: ChargeInput): Promise<ChargeResult>;
}

const simulated: PaymentProvider = {
  name: "simulado",
  async createCharge(input) {
    const ref = `SIM-${input.orderCode}`;
    const instructions = input.method === "PIX"
      ? "Ambiente de demonstração: use o botão “Confirmar pagamento (simulação)” para concluir."
      : "Ambiente de demonstração: nenhum valor é cobrado.";
    return { ref, status: "PENDING", instructions };
  }
};

export function paymentProvider(): PaymentProvider {
  const p = process.env.PAYMENT_PROVIDER ?? "simulado";
  if (p !== "simulado") {
    throw new Error(`Provedor de pagamento "${p}" ainda não implementado. Veja src/lib/payments.ts.`);
  }
  return simulated;
}

export const isSimulated = () => (process.env.PAYMENT_PROVIDER ?? "simulado") === "simulado";
