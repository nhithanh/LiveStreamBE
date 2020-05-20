import { Model, DataTypes, Sequelize } from 'sequelize'

export const initChatModel = sequelize => {
   class ChatModel extends Model {}
   ChatModel.init({

      chatId: {
         type: DataTypes.UUID,
         defaultValue: Sequelize.UUIDV4,
         primaryKey: true,
         unique: true
      },

      userId: {
         type: DataTypes.UUID,
         references: {
            model: 'User',
            key: 'userId'
         }
      },

      liveStreamId: {
         type: DataTypes.UUID,
         references: {
            model: 'LiveStream',
            key: 'liveStreamId'
         }
      },
      
      content: {
         type: DataTypes.STRING,
         allowNull: false
      }
   }, { sequelize, tableName: 'Chat', modelName: 'Chat' })
   return ChatModel
}