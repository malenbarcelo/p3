module.exports = (sequelize, DataTypes) => {

    const alias = "Detected_events"
    const cols = {
       id:{
          type : DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement : true,
          allowNull: false
       },
       id_vehicles:{
          type: DataTypes.STRING,
          allowNull: false,
       },
       start_timestamp:{
          type: DataTypes.INTEGER,
          allowNull: false,
       },
       duration_seconds:{
          type: DataTypes.INTEGER,
          allowNull: false,
       },
       video:{
          type: DataTypes.STRING,
          allowNull: false,
       },
       date:{
          type: DataTypes.STRING,
          allowNull: false,
       },
       time:{
          type: DataTypes.STRING,
          allowNull: false,
       },
    }
    const config = {
        tableName : 'detected_events',
        timestamps : false
    }

    const Detected_event = sequelize.define(alias, cols, config)
 
    Detected_event.associate = (models) => {
       Detected_event.belongsTo(models.Vehicles,{
          as:'vehicle_data',
          foreignKey: 'id_vehicles'
       })
    }
    
    return Detected_event
 }