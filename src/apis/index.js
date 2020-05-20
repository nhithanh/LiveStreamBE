import { Router } from "express";

import * as apiRouter from "./routers";

export const api = Router();

api.use('/users', apiRouter.userRouter);
api.use('/live-streams', apiRouter.liveStreamsRouter);
api.use("/categories", apiRouter.categoryRouter);
api.use("/wallets", apiRouter.walletRouter);