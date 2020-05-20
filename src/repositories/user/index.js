import jwt from "jsonwebtoken"

import { db } from '../../db'

export class UserRepository {

   static async findUserByToken({ token, raw }) {
      const { userId } = jwt.verify(token, process.env.JWT_KEY);
      if (raw) {
         return await db.User.findByPk(userId, { raw: true });
      }
      return await db.User.findByPk(userId);
   }

   static async findUserFavoriteBroadcasters({ userId, limit = 8, offset = 0 }) {
      const user = await db.User.findByPk(userId, {
         include: [{
            model: db.User,
            as: "follower",
            limit,
            offset,
            attributes: ["userId", "username", "displayName", "avatarUrl"]
         }]
      })

      return user
   }

   static async isAlreadyFollowed({ userId, broadcasterId }) {
      const rs = await db.UserFavoriteBroadcaster.findOne({
         where: {
            userId,
            broadcasterId
         }
      })
      return rs != null
   }
}