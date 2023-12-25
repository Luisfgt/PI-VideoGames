const { Router } = require('express')

const getAllGenres = require('../controllers/genresController')
const genresRoutes = Router()


genresRoutes.get('/', getAllGenres)

module.exports = genresRoutes