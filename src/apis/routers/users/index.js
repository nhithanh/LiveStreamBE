import { Router } from 'express'

import { auth } from '../../middlewares'
import { UserService } from '../../../services'

export const userRouter = Router()

userRouter.post('/', async (req, res) => {

   // Create a new user

   try {
      const { username, password } = req.body
      const rs = await UserService.register({ username, password })
      res
         .status(201)
         .send(rs)
   } catch (error) {
      console.log(error)
      res
         .status(400)
         .send(error)
   }
})

userRouter.post('/login', async (req, res) => {
   //Login a registered user
   try {
      const { username, password } = req.body
      const rs = await UserService.authByCredentials({ username, password });
      res
         .status(200)
         .send(rs)
   } catch (error) {
      console.log(error)
      res
         .status(401)
         .send({
            error: {
               msg: error
            }
         })
   }
});

userRouter.post('/me/change_password', auth, async (req, res) => {
   const { oldPassword, newPassword } = req.body
   const user = req.user
   try {
      await UserService.ChangePassword({ oldPassword, newPassword, user })
      res.status(201).send({ msg: 'Change Password Success!' })
   } catch (error) {
      res
         .status(500)
         .send({ error: { msg: error } })
   }
})

userRouter.get('/me', async (req, res) => {
   const token = req.header('auth');
   if (token) {
      try {
         const user = await UserService.authtByTokenReturnRaw({ token });
         return res.status(200).send(user);
      } catch (error) {
         return res.status(401).send({ error });
      }
   } else {
      return res.status(401).send({ error: 'Not provide any token' });
   }
});

// Return a list of favorite broadcaster that user subscribe in the past

userRouter.get("/me/follow-broadcasters", auth, async (req, res) => {
   const user = req.user;
   const favoriteBroadcasters = await UserService.getFavortieBroadcasters({ userId: user.userId });
   res.status(200).send(favoriteBroadcasters);
})

// Subscribe new broadcaster who user interest in

userRouter.put("/me/follow-broadcasters/add", auth, async (req, res) => {
   const { broadcasterId } = req.body;
   const user = req.user;
   UserService.addFavoriteBroadcaster({ user, broadcasterId });
   res.status(201).send({
      status: "success"
   });
})

// Unsubcribe broadcaster

userRouter.put("/me/follow-broadcasters/remove", auth, async (req, res) => {
   const { broadcasterId } = req.body;
   const user = req.user;
   UserService.removeFavoriteBroadcaster({ user, broadcasterId });
   res.status(201).send({
      status: "success"
   });
});