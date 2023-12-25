const { Router } = require('express')
const { getAllVideogames, getVideogameById, getVideoGamesByName, updateVideogame, createVideoGames, deleteVideoGames } = require('../controllers/videogamesController')
const videoGamesRoutes = Router()


videoGamesRoutes.get('/', getAllVideogames)
videoGamesRoutes.get('/name', getVideoGamesByName)
videoGamesRoutes.get('/:id', getVideogameById)
videoGamesRoutes.post('/', createVideoGames)
videoGamesRoutes.delete('/:id', deleteVideoGames)
videoGamesRoutes.patch('/:id', updateVideogame)

module.exports = videoGamesRoutes

