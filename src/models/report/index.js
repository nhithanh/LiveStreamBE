import { Model, DataTypes, Sequelize } from 'sequelize'
export const initReportModel = sequelize => {
    class ReportModel extends Model { }
    ReportModel.init({

        reportId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        livestreamId: {
            type: DataTypes.UUID,
            references: {
                model: "LiveStream",
                key: "liveStreamId"
            }
        },
        userId: {
            type: DataTypes.UUID,
            references: {
                model: "User",
                key: "userId"
            }
        },
        reason: {
            type: DataTypes.STRING
        }
    }, {
        sequelize,
        tableName: 'Report',
        modelName: 'Report',
        updatedAt: false
    })
    return ReportModel
}