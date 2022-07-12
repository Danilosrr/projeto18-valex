import { Router } from "express";
import { createPayment } from "../Controllers/buyController.js";
import validSchema from "../Middlewares/schemaValidation.js";
import { buySchema } from "../Schemas/buySchema.js";

const buyRouter = Router();

buyRouter.post('/buy', validSchema(buySchema), createPayment);

export default buyRouter;