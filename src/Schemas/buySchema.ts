import joi from "joi";

export const buySchema = joi.object({
    cardId: joi.number().integer().required(),
    password: joi.string().pattern(/^([0-9]{4})$/).required(),
    businessId: joi.number().integer().required(),
    amount: joi.number().integer().greater(0).required()
});