import {Router} from "express"

import {TranscoderRepository} from "../../../repositories"

export const transcoderRouter = Router()

transcoderRouter.get("/:transcoderId/state", async(req, res) => {
  const {transcoderId} = req.params;
  const state = await TranscoderRepository.fetchTranscoderState({transcoderId});
  return res.send(state);
})