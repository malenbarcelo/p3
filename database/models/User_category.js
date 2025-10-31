module.exports = (sequelize, DataTypes) => {
   const alias = "Users_categories"
   const cols = {
       id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      user_category:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      enabled:{
         type: DataTypes.INTEGER,
         allowNull: false,
      }
   }
   
   const config = {
      tableName : 'users_categories',
      timestamps : false
   }

   const User_category = sequelize.define(alias, cols, config)

   return User_category

}