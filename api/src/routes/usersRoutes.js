const { Router } = require('express')
const { getAllUsers, createUser, showUsers } = require('../controllers/usersController')
const userRoutes = Router()


userRoutes.get('/', getAllUsers)
userRoutes.post('/users', showUsers)
userRoutes.post('/', createUser)


module.exports = userRoutes
