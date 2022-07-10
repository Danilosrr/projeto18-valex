import joi from "joi";

export const createCardSchema = joi.object({
    employeeId: joi.number().integer().required(),
    type: joi.string().required().valid('groceries', 'restaurant', 'transport', 'education', 'health')
});

export const activateCardSchema = joi.object({
    employeeId: joi.number().integer().required(),
    password: joi.string().pattern(/^([0-9]{4})$/).required(),
    CVC: joi.string().pattern(/^([0-9]{3})$/).required()
});
