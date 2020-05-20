import {now} from 'moment';

import {db} from "../../db"
import {LiveStreamRepository, UserRepository, TranscoderRepository} from '../../repositories'
import {LiveStreamFactory} from '../../factories'

export class LiveStreamService {

  static async getLiveBroadcastingContents({limit, offset}) {
    return await LiveStreamRepository.findLiveBroadcastingContents({limit, offset});
  }

  static async getRecommendedContents() {
    return await LiveStreamRepository.findRecommendedContents();
  }
  static async getLiveStreamDetailInfo({liveStreamId}) {
    return await LiveStreamRepository.getLiveStreamDetail({liveStreamId})
  }

  static async createNewLiveStream({token, title, categoryId, filePath}) {
    const newLiveStream = await LiveStreamFactory.createNewLiveStream({title, filePath, categoryId, token});
    return newLiveStream;
  }

  static async stopLiveStream({token, liveStreamId}) {
    const rs = await Promise.all([
      db
        .LiveStream
        .findByPk(liveStreamId),
      UserRepository.findUserByToken({token})
    ])
    const liveStream = rs[0];
    const user = rs[1];
    if (liveStream.streamerId === user.userId) {
      if (liveStream.endedTime == null) {
        liveStream.endedTime = now();
        user.isLivestream = false;
        await Promise.all([
          liveStream.save(),
          user.save()
        ]);
        TranscoderRepository.stopTranscoder({transcoderId: user.transcoder})
        return true;
      }
      return Promise.reject(`Livestream with id ${liveStream.liveStreamId} is already stop!`)
    }
    return Promise.reject('No Authorize!');
  }

}