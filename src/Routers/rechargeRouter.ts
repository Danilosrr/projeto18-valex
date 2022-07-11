import { Router } from "express";
import { rechargeCard } from "../Controllers/rechargeController.js";
import validKey from "../Middlewares/keyValidation.js";
import validSchema from "../Middlewares/schemaValidation.js";
import { rechargeSchema } from "../Schemas/rechargeSchema.js";

const rechargeRouter = Router();

rechargeRouter.post('/recharge/:id', validSchema(rechargeSchema), validKey, rechargeCard);

export default rechargeRouter;