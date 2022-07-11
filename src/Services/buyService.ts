import { paymentRepository } from "../repositories/paymentRepository.js";
import { rechargeRepository } from "../repositories/rechargeRepository.js";

async function balance(cardId:number) {
    const credit:number = await rechargeRepository.balanceByCardId(cardId);
    const debt:number = await paymentRepository.balanceByCardId(cardId);
    
    return (credit-debt);
}

export const buyService = {
    balance
};