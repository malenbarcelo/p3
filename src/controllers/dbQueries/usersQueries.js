const db = require('../../../database/models')
const sequelize = require('sequelize')
const bcrypt = require('bcryptjs')

const user_user_categorysQueries = {
    findUser: async(userName) => {
        console.log(userName)
        const user = await db.Users.findOne({
            where:{email:userName},
            raw:true
        })
        return user
    },
    findUserById: async(idUser) => {
        const user = await db.Users.findOne({
            where:{id:idUser},
            raw:true
        })
        return user
    },
    allUsers: async() => {
        const users = await db.Users.findAll({
            include: [{association: 'user_user_category'}],
            order:[['first_name','ASC']],
            raw:true,
            nest:true
        })
        return users
    },
}       

module.exports = user_user_categorysQueries