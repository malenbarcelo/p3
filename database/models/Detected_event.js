module.exports = (sequelize, DataTypes) => {

   const alias = "Detected_events"
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
      event:{
         type: DataTypes.STRING,
         allowNull: false,
       },
       start_date_time:{
         type: DataTypes.INTEGER,
         allowNull: false,
       },
       start_location_latitude:{
         type: DataTypes.STRING,
         allowNull: false,
       },
       start_location_longitude:{
         type: DataTypes.STRING,
         allowNull: false,
       },
       event_duration_seconds:{
         type: DataTypes.INTEGER,
         allowNull: false,
       },
       video:{
         type: DataTypes.STRING,
         allowNull: false,
       },
   }
   const config = {
   tableName : 'detected_events',
   timestamps : false
   }
   const Detected_event = sequelize.define(alias, cols, config)

   return Detected_event
}