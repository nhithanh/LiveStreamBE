import cloudinary from "cloudinary"
import fs from "fs"

import {db} from '../../db'
import {UserRepository, TranscoderRepository} from '../../repositories'

export class LiveStreamFactory {
  static async createNewLiveStream({token, title, categoryId, filePath}) {
    const user = await UserRepository.findUserByToken({token});
    if (user) {
      user.isLivestream = true;
      user.save();
      const newLiveStream = await db
        .LiveStream
        .create({streamerId: user.userId, title, categoryId, playbackUrl: user.hls});
      TranscoderRepository.startTranscoder({transcoderId: user.transcoder});
      cloudinary
        .v2
        .uploader
        .upload(filePath)
        .then(rs => {
          newLiveStream.thumbnailUrl = rs.secure_url
          newLiveStream.save()
          fs.unlink(filePath, error => {
            if (error) {
              console.log(error)
            }
          })
        });

      return newLiveStream;

      // if (user.isLivestream === false) {    const newLiveStream = await
      // db.LiveStream.create({       streamerId: user.userId,       title,
      // description,       categoryId,       thumbnailUrl,       status: true    }, {
      // raw: true })    user.isLivestream = true;    await user.save();    return
      // newLiveStream; } else {    return Promise.reject({ err: `User can't have 2
      // Livestream content!` }); }
    }
  }
}