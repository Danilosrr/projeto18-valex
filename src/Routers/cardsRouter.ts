import { Router } from "express";
import { createCard } from "../Controllers/cardsController.js";
import validKey from "../Middlewares/keyValidation.js";

const cardsRouter = Router();

cardsRouter.post('/cards/create',validKey,createCard);
cardsRouter.post('/cards/activate',);
cardsRouter.post('/cards/view/card',);
cardsRouter.get('/cards/view/balance',);
cardsRouter.post('/cards/block',);

export default cardsRouter;