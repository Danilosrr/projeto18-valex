import { Request, Response } from "express";
import { failedDependencyError, forbiddenError } from "../Middlewares/errorHandler.js";
import { CardInsertData, cardRepository, TransactionTypes } from "../repositories/cardRepository.js";
import { employeeRepository } from "../repositories/employeeRepository.js";
import { cardsService } from "../Services/cardsService.js";
import { expireDate, formatName } from "../utils/formatUtils.js";

export async function createCard(req:Request,res:Response){
    const { employeeId, type }:{ employeeId:number, type:TransactionTypes } = req.body
    const company = res.locals.company;

    const EmployeeAtCompany = await employeeRepository.searchEmployeeAtCompany(employeeId,company.id);
    if(!EmployeeAtCompany){
        throw forbiddenError("Employee do not work at your company!");
    }

    const cardAvailability = await cardsService.cardAvailability(employeeId,type); // true = available
    if (!cardAvailability){
        throw failedDependencyError("card type not availabe, creation failed!");
    }

    const insertCard = await cardsService.insertCard(EmployeeAtCompany,type);
    return res.send(insertCard);
}