import { Request, Response } from "express";
import { forbiddenError } from "../Middlewares/errorHandler.js";
import { businessRepository } from "../repositories/businessRepository.js";
import { CardInsertData } from "../repositories/cardRepository.js";
import { employeeRepository } from "../repositories/employeeRepository.js";
import { expireDate, formatDate } from "../utils/dateUtils.js";

export async function createCard(req:Request,res:Response){
    const { employeeId, type }:{ employeeId:number, type:string } = req.body

    let newCard:object = { employeeId, type };
    const company = res.locals.company;

    const EmployeeAtCompany = await employeeRepository.searchEmployeeAtCompany(employeeId,company.id);
    if(!EmployeeAtCompany){
        throw forbiddenError("Employee do not work at your company!");
    }

    const expirationDate = expireDate(new Date());
    
    newCard = {...newCard,expirationDate};
    return res.send({ company, newCard });
}