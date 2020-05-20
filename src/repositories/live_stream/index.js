import { db } from '../../db'

export class LiveStreamRepository {
   // When Livestream is broadcasting return detail with streamName and HLSPlayback for view stream
   // If Livestream stopped return data for broadcaster to review

   static async getLiveStreamDetail({ liveStreamId }) {
      const liveStream = await db.LiveStream.findByPk(liveStreamId);
      if (liveStream != null) {
         if (liveStream.status == true) {
            const broadcaster = await liveStream.getBroadcaster();
            return {
               ...liveStream.get({ plain: true }),
               streamName: broadcaster.streamName,
               hlsUrl: broadcaster.hls
            };
         }
         return liveStream.get({ plain: true });

      }
      return Promise.reject(`Livestream with Id ${liveStreamId} not exist!`);

   }

   static async findOnPlayingLiveStream({ limit = 8, offset = 0 }) {
      return await db.LiveStream.findAll({
         limit,
         offset,
         attributes: ["liveStreamId", "title", "description", "thumbnailUrl", "startedTime"],
         where: {
            status: true
         },
         include: [{
            model: db.User,
            as: 'broadcaster',
            attributes: ["userId", "username", "displayName", "avatarUrl"]
         }],
         order: [
            ['startedTime', 'DESC']
         ]
      })
   }


   static async findRecommendedContents() {
      return await db.LiveStream.findAll({
         limit: 8,
         offset: 0,
         attributes: ['contentId', 'contentTitle', 'description', 'thumbnailUrl', 'channelId'],
         where: {
            status: true
         },
         include: [{
            model: 'User',
            attributes: ['userId', 'displayName', 'avatarUrl']
         }],
         raw: true,
         order: [
            ['startedTime', 'DESC']
         ]
      })
   }
}