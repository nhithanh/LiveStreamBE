import { now } from 'moment';

import { db } from '../../db'

export class ViewerService {

   static async joinLiveStream({ userId, liveStreamId, joinTime }) {
      const liveStream = await db.LiveStream.findByPk(liveStreamId);
      if (liveStream.status === true) {
         return await db.ViewerTracker.create({
            viewerId: userId,
            liveStreamId,
            joinTime
         })
      }
      return Promise.reject(`Livestream stopped already!`);
   }

   static async chatToLiveStream({ liveStreamId, userId, content }) {
      const liveStream = await db.LiveStream.findByPk(liveStreamId);
      const user = await db.User.findByPk(userId)
      if (liveStream.status == true) {
         const chat = await user.createChat({ content });
         await liveStream.addChat(chat);
         chat.liveStreamId = liveStream.liveStreamId;
         return chat;
      }
      return Promise.reject(`Livestream stopped already!`);
   }

   static async leaveLiveStream({ userId, liveStreamId, joinTime }) {
      return await db.ViewerTracker.update({
         outTime: now()
      }, {
         where: {
            viewerId: userId,
            liveStreamId,
            joinTime
         }
      });
   }
}