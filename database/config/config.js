const {username, password, database,host} = require('../../src/data/databaseConfig.js')

module.exports = 
  {
    "development": {
      "username": username,
      "password": password,
      "database": database,
      "host": host,
      "dialect": "mysql"
    },
    "test": {
      "username": username,
      "password": password,
      "database": database,
      "host": host,
      "dialect": "mysql"
    },
    "production": {
      "username": username,
      "password": password,
      "database": database,
      "host": host,
      "dialect": "mysql"
    }
  }

