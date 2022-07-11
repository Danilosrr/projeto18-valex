import { Router } from "express";
import { activateCard, blockCard, createCard, unblockCard } from "../Controllers/cardsController.js";
import validKey from "../Middlewares/keyValidation.js";
import validSchema from "../Middlewares/schemaValidation.js";
import { activateCardSchema, blockCardSchema, createCardSchema } from "../Schemas/cardSchema.js";

const cardsRouter = Router();

cardsRouter.post('/cards/create', validSchema(createCardSchema), validKey, createCard);
cardsRouter.post('/cards/activate/:id', validSchema(activateCardSchema), activateCard);
cardsRouter.post('/cards/view/card',);
cardsRouter.get('/cards/view/balance',);
cardsRouter.post('/cards/block/:id', validSchema(blockCardSchema), blockCard);
cardsRouter.post('/cards/unblock/:id', validSchema(blockCardSchema), unblockCard);

export default cardsRouter;