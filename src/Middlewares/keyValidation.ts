import { NextFunction, Request, Response } from "express";
import { Company, companyRepository } from "../repositories/companyRepository.js";
import { invalidTokenError } from "./errorHandler.js";

export default async function validKey(req:Request,res:Response,next:NextFunction){
    
    const key = req.headers["x-api-key"];
    if(!key){
        throw invalidTokenError("missing key");
    }

    const company:Company | undefined = await companyRepository.findByApiKey(key.toString())
    if (!company){
        throw invalidTokenError("unregistered key");
    }

    res.locals.company = company;
    next();
}