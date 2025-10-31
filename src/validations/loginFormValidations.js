const {body} = require('express-validator')
const bcrypt = require('bcryptjs')
const usersQueries = require('../dbQueries/usersQueries')

const loginFormValidations = {
    login: [
        body('email')
            .notEmpty().withMessage('Debe ingresar un email').bail()
            .custom(async(value,{ req }) => {
                const email = req.body.email
                const idCompanies = req.brand.id
                let userToLogin = await usersQueries.get({undefined,undefined,filters:{email:email,id_companies: idCompanies,enabled:1}})
                userToLogin = userToLogin.rows
                if (userToLogin.length == 0) {
                    throw new Error('Usuario inválido')
                }
                return true
            }),
        body('password')
            .notEmpty().withMessage('Debe ingresar una contraseña').bail()
            .custom(async(value,{ req }) => {
                const password = req.body.password
                const email = req.body.email
                const idCompanies = req.brand.id
                let userToLogin = {}

                if (email != '') {
                    userToLogin = await usersQueries.get({undefined,undefined,filters:{email:email,id_companies: idCompanies,enabled:1}})
                    userToLogin = userToLogin.rows[0]
                }                

                if(userToLogin && userToLogin.password){
                    if (!bcrypt.compareSync(password, userToLogin.password)) {
                        throw new Error('Contraseña inválida')
                    }
                }
                return true
            })
    ],
}

module.exports = loginFormValidations