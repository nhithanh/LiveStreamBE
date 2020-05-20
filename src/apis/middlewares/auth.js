import { UserService } from '../../services'

export const auth = async (req, res, next) => {
   const token = req.header('auth');
   if (token) {
      try {
         req.user =  await UserService.authByToken({ token })
         req.token = token
         next();
      } catch (error) {
         return res.status(401).send({ error })
      }
   } else {
      return res.status(401).send({ error: 'Not provide any token' })
   }
}