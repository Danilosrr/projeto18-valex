import { Request, Response } from "express";
import { conflictError, failedDependencyError, forbiddenError, notFoundError } from "../Middlewares/errorHandler.js";
import { Card, cardRepository, TransactionTypes } from "../repositories/cardRepository.js";
import { employeeRepository } from "../repositories/employeeRepository.js";
import { cardsService } from "../Services/cardsService.js";
import { dateExpired } from "../utils/formatUtils.js";

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
    const id:number = +req.params.id;
    const { CVC, password }:{ CVC:number, password:string } = req.body;

    const cardsExists:Card = await cardRepository.findById(id)
    if(!cardsExists){
        throw notFoundError("no cards found!");
    }

    const cardExpired = dateExpired(new Date(),cardsExists.expirationDate);
    if(cardExpired){
        throw forbiddenError("Card is expired!");
    }

    const matchingCVC:Card | undefined = await cardsService.checkCVC(cardsExists,+CVC);
    if(!matchingCVC){
        throw notFoundError("no cards matching CVC found!");
    }

    const matchingCard:Card = matchingCVC;
    if(matchingCard.password != null){
        throw conflictError("matching card has already been activated!");
    }

    const createCardPassword = await cardsService.createCardPassword(matchingCard.id, password)
    return res.send('Card is now Active.');
}

export async function blockCard(req:Request,res:Response){
    const id:number = +req.params.id;
    const { CVC, password }:{ CVC:number, password:string } = req.body;

    const cardsExists:Card = await cardRepository.findById(id)
    if(!cardsExists){
        throw notFoundError("no cards found!");
    }

    if(cardsExists.isBlocked){
        throw forbiddenError("Card is already blocked!");
    }

    const cardExpired = dateExpired(new Date(),cardsExists.expirationDate);
    if(cardExpired){
        throw forbiddenError("Card is expired!");
    }

    const matchingCVC:Card | undefined = await cardsService.checkCVC(cardsExists,+CVC);
    if(!matchingCVC){
        throw notFoundError("no cards matching CVC found!");
    }
    
    const matchingPassword:string | undefined = await cardsService.checkPassword(cardsExists,+password);
    if(!matchingPassword){
        throw conflictError("password not matching.");
    }

    const blockCard = await cardRepository.update(id,{ isBlocked:true });
    return res.send({ message: 'Card is now blocked', password: matchingPassword });
}

export async function unblockCard(req:Request,res:Response){
    const id:number = +req.params.id;
    const { CVC, password }:{ CVC:number, password:string } = req.body;

    const cardsExists:Card = await cardRepository.findById(id)
    if(!cardsExists){
        throw notFoundError("no cards found!");
    }

    if(!cardsExists.isBlocked){
        throw forbiddenError("Card is already unblocked!");
    }

    const cardExpired = dateExpired(new Date(),cardsExists.expirationDate);
    if(cardExpired){
        throw forbiddenError("Card is expired!");
    }

    const matchingCVC:Card | undefined = await cardsService.checkCVC(cardsExists,+CVC);
    if(!matchingCVC){
        throw notFoundError("no cards matching CVC found!");
    }
    
    const matchingPassword:string | undefined = await cardsService.checkPassword(cardsExists,+password);
    if(!matchingPassword){
        throw conflictError("password not matching.");
    }

    const blockCard = await cardRepository.update(id,{ isBlocked:false });
    return res.send({ message: 'Card is now unblocked', password: matchingPassword });
}

export async function cardBalance(req:Request,res:Response){
    const cardId:number = +req.params.id;
    
    const balance = await cardsService.cardBalance(cardId);
    if(!balance){
        throw notFoundError('could not retrive card balance');
    }
    
    res.send(balance);
}