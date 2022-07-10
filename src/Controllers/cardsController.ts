import { Request, Response } from "express";
import { conflictError, failedDependencyError, forbiddenError, notFoundError } from "../Middlewares/errorHandler.js";
import { Card, cardRepository, TransactionTypes } from "../repositories/cardRepository.js";
import { employeeRepository } from "../repositories/employeeRepository.js";
import { cardsService } from "../Services/cardsService.js";

export async function createCard(req:Request,res:Response){
    const { employeeId, type }:{ employeeId:number, type:TransactionTypes } = req.body;
    const company = res.locals.company;

    const EmployeeAtCompany = await employeeRepository.searchEmployeeAtCompany(employeeId,company.id);
    if(!EmployeeAtCompany){
        throw forbiddenError("Employee do not work at your company!");
    }

    const cardAvailability = await cardsService.cardAvailability(employeeId,type); // true = available
    if (!cardAvailability){
        throw failedDependencyError("card availability error, creation failed!");
    }

    const insertCard = await cardsService.insertCard(EmployeeAtCompany,type);
    if (!insertCard){
        throw failedDependencyError("card info registry error, creation failed!");
    }

    return res.send(insertCard);
}

export async function activateCard(req:Request,res:Response){
    const { employeeId, CVC, password }:{ employeeId:number, CVC:number, password:string } = req.body;

    const cardsExists = await cardRepository.findByEmployeeId(employeeId)
    if(cardsExists.length<1){
        throw notFoundError("no cards found!");
    }

    const matchingCVC = await cardsService.checkCVC(cardsExists,+CVC);
    if(matchingCVC.length<1){
        throw notFoundError("no cards matching CVC found!");
    }

    const matchingCard:Card = matchingCVC[0];
    if(matchingCard.password != null){
        throw conflictError("matching card has already been activated!");
    }

    const createCardPassword = await cardsService.createCardPassword(matchingCard.id, password)
    return res.send('Card is now Active.');
}