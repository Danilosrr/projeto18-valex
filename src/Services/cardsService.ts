import { forbidden } from "joi";
import { forbiddenError } from "../Middlewares/errorHandler.js";
import { cardRepository, TransactionTypes } from "../repositories/cardRepository.js";
import { dateExpired, formatDate } from "../utils/formatUtils.js";

async function cardAvailability(employeeId:number,type:TransactionTypes){
    //true == available
    const cardExists = await cardRepository.searchEmployeeCardType(employeeId,type);

    if(!!cardExists){
        const { expirationDate, isBlocked } = cardExists;
        const cardExpired = dateExpired(new Date(),expirationDate);
        
        if( cardExpired || isBlocked ){
            console.log(`card type available! previous card ${cardExpired?'expired':''}${isBlocked?'blocked':''}`);
            return true;  
        }

        console.log(cardExpired,isBlocked);
        throw forbiddenError(`card of the same type active until ${expirationDate}, not available!`);     
    }

    console.log('no card of the same type registered yet, available!');
    return true;
}

export const cardsService = {
    cardAvailability
}