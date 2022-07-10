import { Router } from "express";
import { activateCard, createCard } from "../Controllers/cardsController.js";
import validKey from "../Middlewares/keyValidation.js";
import validSchema from "../Middlewares/schemaValidation.js";
import { activateCardSchema, createCardSchema } from "../Schemas/cardSchema.js";

const cardsRouter = Router();

cardsRouter.post('/cards/create', validSchema(createCardSchema), validKey, createCard);
cardsRouter.post('/cards/activate', validSchema(activateCardSchema), activateCard);
cardsRouter.post('/cards/view/card',);
cardsRouter.get('/cards/view/balance',);
cardsRouter.post('/cards/block',);

export default cardsRouter;