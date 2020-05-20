import socketIO from 'socket.io'

import { ViewerService, UserService, LiveStreamService } from '../services'
import { now } from 'moment';

export async function initSocketIO(server) {
   
   let wm = new WeakMap();

   // Streamer
   const CREATE_NEW_BROADCASTING = "CREATE_NEW_BROADCASTING";
   const CREATE_NEW_BROADCASTING_SUCCESS = "CREATE_NEW_BROADCASTING_SUCCESS";
   const CREATE_NEW_BROADCASTING_FAILED = "CREATE_NEW_BROADCASTING_FAILED";
   const STOP_BROADCASTING = "STOP_BROADCASTING";
   const STOP_BROADCASTING_SUCCESS = "STOP_BROADCASTING_SUCCESS";
   const STOP_BROADCASTING_FAILED = "STOP_BROADCASTING_FAILED";

   // Viewer
   const JOIN_LIVE_STREAM = "JOIN_LIVE_STREAM";
   const LEAVE_LIVE_STREAM = "LEAVE_LIVE_STREAM";
   const CHAT_TO_LIVE_STREAM = "CHAT"

   const io = socketIO(server)
   io.on('connection', (socket) => {

      // Streamer

      socket.on(CREATE_NEW_BROADCASTING, async ({ token, title, description, thumbnailUrl, categoryId }) => {
         try {
            const newLiveStream = await LiveStreamService.createNewLiveStream({
               token,
               categoryId,
               description,
               thumbnailUrl,
               title
            });
            socket.emit(CREATE_NEW_BROADCASTING_SUCCESS, newLiveStream);
            socket.join(newLiveStream.liveStreamId);
         } catch (error) {
            socket.emit(CREATE_NEW_BROADCASTING_FAILED, error);
         }
      });

      socket.on(STOP_BROADCASTING, async ({ token, liveStreamId }) => {
         const isStop = await LiveStreamService.stopLiveStream({ token, liveStreamId });
         if (isStop) {
            socket.emit(STOP_BROADCASTING_SUCCESS);
         } else {
            socket.emit(STOP_BROADCASTING_FAILED);
         }
      })

      // Viewer

      socket.on(JOIN_LIVE_STREAM, async ({ token, liveStreamId }) => {
         socket.join(liveStreamId);
         if (token) {
            const joinTime = now();
            wm.set(socket.id, {
               ...wm.get(socket.id),
               joinTime,
               token
            });
            user = await UserService.authtByToken({ token });
            ViewerService.joinLiveStream({ joinTime, liveStreamId, userId: user.userId });
            socket
               .to(roomName)
               .emit(JOIN_LIVE_STREAM, { displayName })
         }
      });

      // invoke when user leave LiveStream room

      socket.on(LEAVE_LIVE_STREAM, async ({ token, liveStreamId }) => {
         socket.leave(liveStreamId);
         socket
            .to(liveStreamId)
            .emit(LEAVE_LIVE_STREAM);
         if (token) {
            if (!user)
               user = await UserService.authtByToken({ token });
            ViewerService.leaveLiveStream({ joinTime: joinTime, liveStreamId, userId: user.UserId })
         }
         ViewerService.outLiveStream();
      });

      // invoke when user chat to broadcaster and others in LiveStream room

      socket.on(CHAT_TO_LIVE_STREAM, async ({ token, content, liveStreamId }) => {
         if (!user)
            user = await UserService.authtByToken({ token });
         ViewerService.chatToLiveStream({ liveStreamId, content, userId: user.userId })
         socket
            .to(liveStreamId)
            .emit(CHAT_TO_LIVE_STREAM, {
               userId: user.UserId,
               username: user.username,
               displayName: user.displayName,
               avatarUrl: user.avatarUrl,
               content
            })
      });

      socket.on('disconnecting', async function() {
         const joined_rooms = socket.rooms
         const socketData = wm.get(socket.id);
         if (socketData.token) {
            ViewerService.leaveLiveStream({
               joinTime,
               liveStreamId: joined_rooms[Object.keys(joined_rooms)[0]],
               token
            })
         }
         socket.to(joined_rooms[Object.keys(joined_rooms)[0]]).emit('userLeaveRoom')
      });
   });

}