module.exports = (sequelize, DataTypes) => {

   const alias = "Vehicles"
   const cols = {
      id:{
      type : DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement : true,
      allowNull: false
      },
      vehicle_code:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_location_latitude:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_location_longitude:{
        type: DataTypes.STRING,
        allowNull: false,
      }
      ,
      last_actualization:{
        type: DataTypes.INTEGER,
        allowNull: false
      }
   }
   const config = {
   tableName : 'vehicles',
   timestamps : false
   }
   const Vehicle = sequelize.define(alias, cols, config)
   
   return Vehicle
}