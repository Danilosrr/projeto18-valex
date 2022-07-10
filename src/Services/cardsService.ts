import { faker } from "@faker-js/faker";
import Cryptr from "cryptr";
import { forbiddenError } from "../Middlewares/errorHandler.js";
import { Card, CardInsertData, cardRepository, TransactionTypes } from "../repositories/cardRepository.js";
import { Employee } from "../repositories/employeeRepository.js";
import { dateExpired, expireDate, formatDate, formatName } from "../utils/formatUtils.js";

const cryptrKey = process.env.CRYPTR_KEY || 'cryptr'
const cryptr = new Cryptr(cryptrKey)

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

async function insertCard(employee:Employee,type:TransactionTypes){
    const number = faker.finance.creditCardNumber("#### #### #### ####");
    const unincryptedCVV = faker.finance.creditCardCVV();
    const cardCVV = cryptr.encrypt(unincryptedCVV);
  
    const card:CardInsertData = {
      number,
      expirationDate: expireDate(new Date()),
      isBlocked: false,
      employeeId: employee.id,
      cardholderName: formatName(employee.fullName),
      securityCode: cardCVV,
      password: null,
      isVirtual: true,
      originalCardId: null,
      type,
    };
  
    const newCard = await cardRepository.insert(card);
    console.log(number, unincryptedCVV);
    return newCard
}

export const cardsService = {
    cardAvailability,
    insertCard
}