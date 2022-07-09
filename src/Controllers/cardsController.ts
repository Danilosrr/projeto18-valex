import { Request, Response } from "express";
import { businessRepository } from "../repositories/businessRepository.js";

export async function createCard(req:Request,res:Response){
    const key = res.locals.apiKey;
    const test = await businessRepository.findById(2);
    const company = res.locals.company;

    res.send({ key, test, company });
}