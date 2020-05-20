import { Model, DataTypes, UUIDV4 } from 'sequelize'

export const initWalletTransactionModel = sequelize => {
    class WalletTransactionModel extends Model { }
    WalletTransactionModel.init({
        walletTransactionId: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true,
            unique: true
        },
        fromWalletId: {
            type: DataTypes.UUID,
            references: {
                model: "Wallet",
                key: "walletId"
            }
        },
        amount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        toWalletId: {
            type: DataTypes.UUID,
            references: {
                model: "Wallet",
                key: "walletId"
            }
        },
        message: {
            type: DataTypes.STRING
        }
    }, {
        sequelize,
        tableName: 'WalletTransaction',
        modelName: 'WalletTransaction',
        updatedAt: false
    })
    return WalletTransactionModel
}