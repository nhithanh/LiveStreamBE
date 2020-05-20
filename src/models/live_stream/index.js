import { Model, DataTypes, Sequelize } from 'sequelize'
import { now } from 'moment'

export const initLiveStreamModel = sequelize => {
   class LiveStreamModel extends Model {}
   LiveStreamModel.init({

      liveStreamId: {
         type: DataTypes.UUID,
         primaryKey: true,
         defaultValue: Sequelize.UUIDV4,
         unique: true
      },

      streamerId: {
         type: DataTypes.UUID,
         references: {
            model: 'User',
            key: 'userId'
         }
      },

      title: {
         type: DataTypes.STRING,
         allowNull: false
      },
      categoryId: {
         type: DataTypes.INTEGER,
         references: {
            model: 'Category',
            key: 'categoryId'
         }
      },

      thumbnailUrl: {
         type: DataTypes.STRING,
         defaultValue: 'https://www.fgttw.com/images/Chinese_new_year_2020.jpeg'
      },

      playbackUrl: {
         type: DataTypes.STRING
      },

      startedTime: {
         type: DataTypes.DATE,
         defaultValue: now()
      },

      endedTime: {
         type: DataTypes.DATE,
      }
   }, {
      sequelize,
      tableName: 'LiveStream',
      modelName: 'LiveStream',
      createdAt: false,
      updatedAt: false
   })
   return LiveStreamModel
}