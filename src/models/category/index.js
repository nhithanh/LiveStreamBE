import { Model, DataTypes } from 'sequelize'

export const initCategoryModel = sequelize => {
   class CategoryModel extends Model { }
   CategoryModel.init({
      categoryId: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true
      },
      categoryName: {
         type: DataTypes.STRING(50),
         allowNull: false
      },
      imageUrl: {
         type: DataTypes.STRING,
         allowNull: false
      },
      smallImageUrl: {
         type: DataTypes.STRING,
      },
      type: {
         type: DataTypes.INTEGER,
         allowNull: false
      }
   }, {
      sequelize,
      tableName: 'Category',
      modelName: 'Category',
      updatedAt: false,
      createdAt: false
   })
   return CategoryModel
}