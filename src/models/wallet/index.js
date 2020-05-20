import { Model, DataTypes, UUIDV4 } from 'sequelize'

export const initWalletModel = sequelize => {
   class WalletModel extends Model { }
   WalletModel.init({
      walletId: {
         type: DataTypes.UUID,
         defaultValue: UUIDV4,
         primaryKey: true,
         unique: true
      },
      userId: {
         type: DataTypes.UUID,
         references: {
             model: "User",
             key: "userId"
         }
      },
      amount: {
          type: DataTypes.INTEGER,
          defaultValue: 0
      }
   }, {
      sequelize,
      tableName: 'Wallet',
      modelName: 'Wallet',
      updatedAt:false,
      createdAt: false
   })
   return WalletModel
}