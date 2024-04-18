module.exports = (sequelize, DataTypes) => {

   const alias = "Detected_events_steps"
   const cols = {
      id:{
      type : DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement : true,
      allowNull: false
      },
      id_detected_events:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      step:{
         type: DataTypes.STRING,
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
       start_date_time:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
       speed:{
         type: DataTypes.DECIMAL,
         allowNull: false,
       }
   }
   const config = {
   tableName : 'detected_events_steps',
   timestamps : false
   }
   const Detected_event_step = sequelize.define(alias, cols, config)

   Detected_event_step.associate = (models) => {
    Detected_event_step.belongsTo(models.Detected_events,{
       as:'detected_events_steps_detected_events',
       foreignKey: 'id_detected_events'
    })
 }
   
   return Detected_event_step
}