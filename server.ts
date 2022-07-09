import express from "express";
import "express-async-errors";
import cors from "cors";
import cardsRouter from "./src/Routers/cardsRouter.js";
import rechargeRouter from "./src/Routers/rechargeRouter.js";
import buyRouter from "./src/Routers/buyRouter.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(cardsRouter);
app.use(rechargeRouter);
app.use(buyRouter);

const port = +process.env.PORT || 4000;
app.listen(port,() => {
    console.log(`server is listening on port ${port}`)
});