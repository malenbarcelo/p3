const {body} = require('express-validator')
const bcrypt = require('bcryptjs')
const usersQueries = require('../controllers/dbQueries/usersQueries')

const userFormsValidations = {
    login: [
        body('userName')
            .notEmpty().withMessage('Ingrese un usuario').bail()
            .custom(async(value,{ req }) => {
                const userName = req.body.userName
                const userToLogin = await usersQueries.findUser(userName)
                if (!userToLogin) {
                throw new Error('Usuario inválido')
                }
                return true
            }),
        body('password')
            .notEmpty().withMessage('Ingrese una contraseña')
            .custom(async(value,{ req }) => {
                const userName = req.body.userName
                const userToLogin = await usersQueries.findUser(userName)
                if(userToLogin){
                    if (!bcrypt.compareSync(req.body.password, userToLogin.password)) {
                        throw new Error('Contraseña inválida')
                    }
                }else{
                    throw new Error('Contraseña inválida')
                }
                return true
        })
    ],
}

module.exports = userFormsValidations