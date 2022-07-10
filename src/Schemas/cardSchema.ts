import joi from "joi";

const createCardSchema = joi.object({
    employeeId: joi.number().integer().required(),
    type: joi.string().required().valid('groceries', 'restaurant', 'transport', 'education', 'health')
})

export default createCardSchema;