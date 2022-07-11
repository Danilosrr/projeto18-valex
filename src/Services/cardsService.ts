import { faker } from "@faker-js/faker";
import { forbiddenError } from "../Middlewares/errorHandler.js";
import { Card, CardInsertData, cardRepository, TransactionTypes } from "../repositories/cardRepository.js";
import { Employee } from "../repositories/employeeRepository.js";
import { dateExpired, decrypt, encrypt, expireDate, formatName } from "../utils/formatUtils.js";


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
    const unincryptedCVC = faker.finance.creditCardCVV();
    const cardCVC = encrypt(unincryptedCVC);
  
    const card:CardInsertData = {
      number,
      expirationDate: expireDate(new Date()),
      isBlocked: false,
      employeeId: employee.id,
      cardholderName: formatName(employee.fullName),
      securityCode: cardCVC,
      password: null,
      isVirtual: true,
      originalCardId: null,
      type,
    };
  
    const newCard = await cardRepository.insert(card);

    console.log(number, unincryptedCVC);
    return { number, unincryptedCVC };
}

async function checkCVC(card:Card,CVV:number){
    const decryptedCVV = decrypt(card.securityCode);

    if(+decryptedCVV == CVV){
        return card;
    }
    return undefined;
}

async function checkPassword(card:Card,password:number){
    const decryptedPassword = decrypt(card.password);

    if(+decryptedPassword == password){
        return decryptedPassword;
    }
    return undefined;
}

async function createCardPassword(id:number,newPassword:string){
    const password = encrypt(newPassword);
    const updatePassword = await cardRepository.update(id, { password });

    return updatePassword;
}

export const cardsService = {
    cardAvailability,
    createCardPassword,
    insertCard,
    checkCVC,
    checkPassword,
}