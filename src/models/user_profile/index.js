import { Model, DataTypes, Sequelize } from 'sequelize'

export const initUserProfileModel = sequelize => {
   class UserProfileModel extends Model {}
   UserProfileModel.init({
      profileId: {
         type: DataTypes.UUID,
         defaultValue: Sequelize.UUIDV4,
         primaryKey: true
      },
      userId: {
         type: DataTypes.UUID,
         references: {
            model: 'User',
            key: 'userId'
         }
      },
      birthday: {
         type: DataTypes.DATE,
      }
   }, {
      sequelize,
      tableName: 'UserProfile',
      modelName: 'UserProfile'
   })
   return UserProfileModel
}