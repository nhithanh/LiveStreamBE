import jwt from 'jsonwebtoken'

import {UserFactory} from '../../factories'
import {UserRepository} from '../../repositories'
import {db} from '../../db'

export class UserService {

  static async register({username, password}) {
    return await UserFactory.createNewUser({username, password})
  }

  static async authByCredentials({username, password}) {
    try {
      const user = await db
        .User
        .findByCredentials({username, password});
      const token = jwt.sign({
        userId: user.userId
      }, process.env.JWT_KEY);
      return {
        ...user.responseData,
        token
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  static async authtByTokenReturnRaw({token}) {
    try {
      const {userId} = jwt.verify(token, process.env.JWT_KEY);
      const user = await db
        .User
        .findByPk(userId, {
          attributes: [
            "userId",
            "username",
            "avatarUrl",
            "pushDataServer",
            "streamName",
            "transcoder"
          ],
          raw: true
        });
      return user;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  static async authByToken({token}) {
    const {userId} = jwt.verify(token, process.env.JWT_KEY);
    return await db
      .User
      .findByPk(userId);
  }

  static async ChangePassword({oldPassword, newPassword, user}) {
    const isOldPasswordMatch = await user.comparePassword({password: oldPassword})
    if (isOldPasswordMatch) {
      user.password = newPassword,
      await user.save()
    } else 
      return Promise.reject(`Old Password incorrect!`)
  }

  static async changeAvatar({avatarUrl, user}) {
    user.avatarUrl = avatarUrl
    await user.save()
  }

  static async getFavortieBroadcasters({userId}) {
    return await UserRepository.findUserFavoriteBroadcasters({userId})
  }

  static async addFavoriteBroadcaster({user, broadcasterId}) {
    const broadcaster = await db
      .User
      .findByPk(broadcasterId)
    await user.addFavoriteBroadcaster(broadcaster)
    return true
  }

  static async removeFavoriteBroadcaster({user, broadcasterId}) {
    const broadcaster = await db
      .User
      .findByPk(broadcasterId)
    await user.removeFavoriteBroadcaster(broadcaster)
    return true
  }
}