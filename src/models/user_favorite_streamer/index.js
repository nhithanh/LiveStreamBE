import { Model, DataTypes } from 'sequelize'

export const initUserFavoriteStreamerModel = sequelize => {
   class UserFavoriteStreamerModel extends Model {}
   UserFavoriteStreamerModel.init({
      userId: {
         type: DataTypes.UUID,
         references: {
            model: "User",
            key: "userId"
         }
      },
      streamerId: {
         type: DataTypes.UUID,
         references: {
            model: "User",
            key: "userId"
         }
      }
   }, {
      sequelize,
      tableName: 'UserFavoriteStreamer',
      modelName: 'UserFavoriteStreamer'
   })
   return UserFavoriteStreamerModel
}