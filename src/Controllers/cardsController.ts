import { Request, Response } from "express";
import { forbiddenError } from "../Middlewares/errorHandler.js";
import { CardInsertData, TransactionTypes } from "../repositories/cardRepository.js";
import { employeeRepository } from "../repositories/employeeRepository.js";
import { cardsService } from "../Services/cardsService.js";
import { expireDate, formatName } from "../utils/formatUtils.js";

export async function createCard(req:Request,res:Response){
    const { employeeId, type }:{ employeeId:number, type:TransactionTypes } = req.body

    let newCard:object = { employeeId, type };
    const company = res.locals.company;

    const EmployeeAtCompany = await employeeRepository.searchEmployeeAtCompany(employeeId,company.id);
    if(!EmployeeAtCompany){
        throw forbiddenError("Employee do not work at your company!");
    }

    const expirationDate = expireDate(new Date());
    newCard = {...newCard,expirationDate};

    const cardAvailability = await cardsService.cardAvailability(employeeId,type); // true = available
    if (cardAvailability){
        const cardholderName = formatName(EmployeeAtCompany.fullName);
        console.log(cardholderName);
    }

    return res.send({ company, newCard });
}