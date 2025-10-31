module.exports = (sequelize, DataTypes) => {

    const alias = "Companies_projects"
    const cols = {
       id:{
          type : DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement : true,
          allowNull: false
       },
       id_companies:{
          type: DataTypes.INTEGER,
          allowNull: false,
       },
       project:{
          type: DataTypes.STRING,
          allowNull: false,
       },
    }
    const config = {
        tableName : 'companies_projects',
        timestamps : false
    }

    const Company_project = sequelize.define(alias, cols, config)
 
    Company_project.associate = (models) => {
       Company_project.belongsTo(models.Companies,{
          as:'company_data',
          foreignKey: 'id_companies'
       })
    }
    
    return Company_project
 }