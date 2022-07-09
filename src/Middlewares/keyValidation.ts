import { NextFunction, Request, Response } from "express";
import { companyRepository } from "../repositories/companyRepository.js";
import { notFoundError } from "./errorHandler.js";

export default async function validKey(req:Request,res:Response,next:NextFunction){
    const key = req.headers["x-api-key"].toString();

    const company = await companyRepository.findByApiKey(key)
    if (!company){
        throw notFoundError();
    }
    res.locals.apiKey = key;
    res.locals.company = company;
    next();
}