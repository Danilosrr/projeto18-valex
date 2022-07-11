import { Request, Response } from "express";
import { badRequestError, conflictError, forbiddenError, notFoundError } from "../Middlewares/errorHandler.js";
import { Business, businessRepository } from "../repositories/businessRepository.js";
import { Card, cardRepository } from "../repositories/cardRepository.js";
import { paymentRepository } from "../repositories/paymentRepository.js";
import { buyService } from "../Services/buyService.js";
import { cardsService } from "../Services/cardsService.js";
import { dateExpired } from "../utils/formatUtils.js";

export async function createPayment(req:Request,res:Response){
    const { cardId, password, businessId, amount }:{ cardId:number, password:string, businessId:number, amount:number } = req.body;

    const selectedCard:Card | undefined = await cardRepository.findById(cardId);
    if(!selectedCard){
        notFoundError("card doesnt exist")
    }
    if(!selectedCard.password){
        throw forbiddenError("Card was not activated.");
    }
    if(selectedCard.isBlocked){
        throw forbiddenError("Card is blocked!");
    }

    const cardExpired = dateExpired(new Date(),selectedCard.expirationDate);
    if(cardExpired){
        throw forbiddenError("Card is expired.");
    }

    const pointOfSale:Business | undefined = await businessRepository.findById(businessId);
    if(!pointOfSale){
        notFoundError("point of sale doesnt exist")
    }

    const matchingType = selectedCard.type === pointOfSale.type;
    if(!matchingType){
        throw conflictError("type of expense not matching card type.");    
    }

    const matchingPassword:string | undefined  = await cardsService.checkPassword(selectedCard,+password);
    if(!matchingPassword){
        throw conflictError("password not matching.");
    }

    const cardBalance:number = await buyService.balance(cardId)
    if(cardBalance<amount){
        throw badRequestError("insufficient credit");
    }

    const pay = paymentRepository.insert({ cardId, businessId, amount });
    res.send(matchingPassword);
}