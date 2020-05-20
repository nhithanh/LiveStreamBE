import { Router } from 'express'
import multer from "multer"

import { LiveStreamService, ViewerService, UploadImageService } from '../../../services'
import { UserRepository } from '../../../repositories';
import { db } from '../../../db';
export const liveStreamsRouter = Router()

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage })
// Return a list of LivesStream which is now broadcasting

liveStreamsRouter.post("/", upload.single("thumbnailImage"), async (req, res) => {
  const { categoryId, title } = req.body;
  const token = req.header('auth');
  try {
    const newLiveStream = await LiveStreamService.createNewLiveStream({ categoryId, title, token, filePath: req.file.path });
    res
      .status(201)
      .send(newLiveStream);
  } catch (error) {
    console.log(error)
  }
})

liveStreamsRouter.post("/:liveStreamId/stop", async (req, res) => {
  const {liveStreamId} = req.params;
  const token = req.header("auth");
  LiveStreamService.stopLiveStream({liveStreamId, token})
  res.send({
    status: "success"
  })
})


// Return a LivesStream info contain streamName and HLSPlayback for playback
// purpose

liveStreamsRouter.get('/:liveStreamId', async (req, res) => {
  let isAlreadyFollowed = false
  const { liveStreamId, viewerId } = req.params;
  const liveStream = await LiveStreamService.getLiveStreamDetailInfo({ liveStreamId })
  if (viewerId) {
    isAlreadyFollowed = await UserRepository.isAlreadyFollowed({ userId, broadcasterId: content.userId })
  }
  res
    .status(200)
    .send({
      ...liveStream,
      isAlreadyFollowed
    });
})

// This will implement later



// Start a new LiveStream (1 user 1 instance Livestream only) Stop a
// broadcasting Livestream (return error when Livestream with provide Id already
// stop)

liveStreamsRouter.post("/now-playing/:livestreamId/report", async (req, res) => {
  const { livestreamId } = req.params
  const token = req.header("auth");
  const { userId } = await UserRepository.findUserByToken({ token, raw: true })
  const { reason } = req.body
  let isReport = await db.Report.findOne({
    where: {
      livestreamId,
      userId
    }
  }) === null ? false: true

  if (isReport === true) {
    return res.status(200).send({
      status: "error",
      message: "already report this livestream!"
    });
  } else {
    let report = await db.Report.create({
      reason,
      userId,
      livestreamId
    })
    return res.status(200).send(report)
  }
});