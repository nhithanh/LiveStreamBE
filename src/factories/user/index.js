import jwt from "jsonwebtoken"

import {db} from '../../db'
import {MediaProcessingFactory} from '../'

export class UserFactory {
  static async createNewUser({username, password}) {
    const rs = await Promise.all([
      db
        .User
        .create({username, password}),
      MediaProcessingFactory.createMediaProcessing({username})
    ]);

    const newUser = rs[0];
    const token = jwt.sign({
      userId: newUser.userId
    }, process.env.JWT_KEY);
    const transcoder = rs[1];
    newUser.transcoder = transcoder.id;
    newUser.pushDataServer = transcoder.source_connection_information.primary_server;
    newUser.streamName = transcoder.source_connection_information.stream_name;
    newUser.hls = transcoder.player_hls_playback_url;
    await Promise.all([
      newUser.createWallet(),
      newUser.createUserProfile(),
      newUser.save()
    ]);
    return {user: newUser.responseData, token};
  }
}