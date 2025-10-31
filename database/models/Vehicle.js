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
       id_companies:{
          type: DataTypes.STRING,
          allowNull: false,
       },

       enabled:{
         type: DataTypes.INTEGER,
         allowNull: false,
       },
    }
    const config = {
        tableName : 'vehicles',
        timestamps : false
    }

    const Vehicle = sequelize.define(alias, cols, config)
 
    Vehicle.associate = (models) => {
       Vehicle.belongsTo(models.Companies,{
          as:'company_data',
          foreignKey: 'id_companies'
       }),
       Vehicle.hasMany(models.Detected_events,{
          as:'detected_events',
          foreignKey: 'id_vehicles',
          sourceKey:'id'
       })
    }
    
    return Vehicle
 }