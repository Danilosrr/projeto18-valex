import { Request, Response } from "express";
import { forbiddenError, notFoundError } from "../Middlewares/errorHandler.js";
import { Card, cardRepository } from "../repositories/cardRepository.js";
import { Company } from "../repositories/companyRepository.js";
import { employeeRepository } from "../repositories/employeeRepository.js";
import { rechargeRepository } from "../repositories/rechargeRepository.js";
import { dateExpired } from "../utils/formatUtils.js";

export async function rechargeCard(req:Request,res:Response){
    const company:Company = res.locals.company;
    const { amount }:{ amount:number } = req.body
    const id:number = +req.params.id;

    const cardsExists:Card = await cardRepository.findById(id)
    if(!cardsExists){
        throw notFoundError("no cards found!");
    }

    const EmployeeAtCompany = await employeeRepository.searchEmployeeAtCompany(cardsExists.employeeId,company.id);
    if(!EmployeeAtCompany){
        throw forbiddenError("Employee do not work at your company!");
    }

    const cardExpired = dateExpired(new Date(),cardsExists.expirationDate);
    if(cardExpired){
        throw forbiddenError("Card is expired!");
    }

    const cardblocked = cardsExists.isBlocked;
    if(cardblocked){
        throw forbiddenError("Card is not active!");
    }

    const recharge = await rechargeRepository.insert({cardId:id, amount});
    res.send(`${company.name} recharged ${amount} for ${EmployeeAtCompany.fullName}`);
}