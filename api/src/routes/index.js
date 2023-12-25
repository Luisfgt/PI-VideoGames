const { Router } = require('express');
const videoGamesRoutes = require('./videoGamesRoutes');
const genresRoutes = require('./genresRoutes');
const userRoutes = require('./usersRoutes')
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use('/videogames', videoGamesRoutes)
router.use('/genres', genresRoutes)
router.use('/users', userRoutes)
// router.use('/genres', )

module.exports = router;
