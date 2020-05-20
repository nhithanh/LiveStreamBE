import { Model, DataTypes, Sequelize } from 'sequelize'
import { now } from 'moment'

export const initViewerLiveStreamModel = sequelize => {
   class ViewerLiveStreamModel extends Model {}
   ViewerLiveStreamModel.init({

      id: {
         type: DataTypes.UUID,
         primaryKey: true,
         unique: true,
         defaultValue: Sequelize.UUIDV4
      },

      viewerId: {
         type: DataTypes.UUID,
         references: {
            model: "User",
            key: "userId"
         }
      },

      liveStreamId: {
         type: DataTypes.UUID,
         references: {
            model: "LiveStream",
            key: "liveStreamId"
         }
      },

      joinTime: {
         type: DataTypes.DATE,
         defaultValue: now()
      },

      leaveTime: {
         type: DataTypes.DATE,
      }
      
   }, {
      sequelize,
      tableName: 'LiveStreamViewer',
      modelName: 'LiveStreamViewer',
      createdAt: false,
      updatedAt: false
   })
   return ViewerLiveStreamModel
}