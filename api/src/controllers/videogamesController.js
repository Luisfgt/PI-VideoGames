require('dotenv').config();
const { Videogame, Genre, videogameGenre } = require('../db')
const axios = require("axios")
const {
    API_KEY
} = process.env;

const URL_API = `https://api.rawg.io/api/games`



const getAllVideogames = async (req, res) => {
    try {
        let count = 1
        let allVideoGamesApi = []
        while (count <= 5) {
            const allVideoGames = await axios.get(`${URL_API}${API_KEY}&page=${count}`)
            if (!allVideoGames) {
                res.status(500).json({
                    status: false,
                    message: 'Error al traer los videoJuegos'
                })
            }

            allVideoGamesApi.push(...allVideoGames.data.results)
            count++
        }
        var getAllVideogamesDb = await Videogame.findAll({
            include: Genre
        })

        if (getAllVideogamesDb) {
            const allDbGames = getAllVideogamesDb.map((videoGame) => {
                const finalGenresTo = videoGame.genres.map(genre => genre.nombre).join(', ')
                const dataDb = {
                    id: videoGame.id,
                    nombre: videoGame.nombre,
                    descripción: videoGame.descripción,
                    imagen: videoGame.imagen,
                    plataformas: videoGame.plataformas,
                    lanzamiento: videoGame.lanzamiento,
                    rating: videoGame.rating,
                    genres: finalGenresTo
                }

                return dataDb
            })


            getAllVideogamesDb = allDbGames
        }


        const dataApi = await Promise.all(allVideoGamesApi.map(async (videogame) => {

            const platformsApi = videogame.platforms.map(platform => platform.platform.name).join(', ')
            const genresApi = videogame.genres.map(genre => genre.name).join(', ')
            const description = (await axios.get(`${URL_API}/${videogame.id}${API_KEY}`)).data.description
            

            return {
                id: videogame.id,
                nombre: videogame.name,
                descripción: description,
                imagen: videogame.background_image,
                plataformas: platformsApi,
                lanzamiento: videogame.released,
                rating: videogame.rating,
                genres: genresApi
            }
        }))

        return res.status(200).json({
            status: true,
            data: [...dataApi, ...getAllVideogamesDb]
        })


    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

const getVideogameById = async (req, res) => {
    try {
        const { id } = req.params

        if (id.length < 5) {
            const videoGameApi = (await axios.get(`${URL_API}/${id}${API_KEY}`)).data
            if (videoGameApi) {

                const platformsApi = videoGameApi.platforms.map(platform => platform.platform.name).join(', ')
                const genresApi = videoGameApi.genres.map(genre => genre.name).join(', ')

                const data = {
                    id: videoGameApi.id,
                    nombre: videoGameApi.name,
                    descripción: videoGameApi.description,
                    plataformas: platformsApi,
                    imagen: videoGameApi.background_image,
                    lanzamiento: videoGameApi.released,
                    rating: videoGameApi.rating,
                    genres: genresApi
                }

                return res.status(200).json({
                    status: true,
                    data: data
                })
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'No hay juegos con ese Id'
                })
            }
        } else {
            const videoGameForId = await Videogame.findOne({
                where: { id },
                include: Genre
            })
            if (videoGameForId) {
                return res.status(200).json({
                    status: true,
                    data: videoGameForId
                })
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'No hay juegos con ese Id'
                })
            }
        }

    } catch (error) {
        const { name } = req.query

        res.status(500).json({
            status: false,
            message: error.message,
            name
        })
    }
}

const getVideoGamesByName = async (req, res) => {
    try {
        const { name } = req.query;
        const URL = `https://api.rawg.io/api/games?search=${name}`;
        const APIKEY = '&key=1ade96c0542647f38c72a4c8f6a3766a';
        console.log(name);
        const videoGameByQuery = (await axios.get(`${URL}${APIKEY}`)).data.results;

        if (videoGameByQuery) {

            const finalData = await Promise.all(videoGameByQuery.map(async (videoGame) => {

                const platformsApi = videoGame.platforms.map(platform => platform.platform.name).join(', ')
                const genresApi = videoGame.genres.map(genre => genre.name).join(', ')
                const description = (await axios.get(`${URL_API}/${videoGame.id}${API_KEY}`)).data.description

                const data = {
                    id: videoGame.id,
                    nombre: videoGame.name,
                    descripción: description,
                    plataformas: platformsApi,
                    imagen: videoGame.image,
                    lanzamiento: videoGame.released,
                    rating: videoGame.rating,
                    genres: genresApi
                }
                return data
            }))

            return res.status(200).json({
                status: true,
                videoGame: finalData
            });
        } else {
            const videoGameFromDb = await Videogame.findOne({
                where: { nombre },
                include: Genre
            });
            if (videoGameFromDb) {
                return res.status(200).json({
                    status: true,
                    videoGameFromDb
                });
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'No hay videojuegos con ese nombre'
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

const createVideoGames = async (req, res) => {
    try {
        const { data } = req.body;
        const { nombre, descripción, plataformas, imagen, lanzamiento, rating, Genres } = data
        if (Genres.length < 1) {
            console.log(nombre);
            return res.status(200).json({
                status: false,
                message: 'debes elegir al menos un género'
            })
        }


        const createVideoGame = await Videogame.create({ nombre, descripción, plataformas, imagen, lanzamiento, rating })


        if (createVideoGame) {
            console.log(createVideoGame.id);
            await Promise.all(Genres.map(async (Genres) => {
                const genresId = await Genre.findOne({ where: { nombre: Genres } })
                if (genresId) {
                    await videogameGenre.create({
                        videogameId: createVideoGame.id,
                        genreId: genresId.id
                    })
                }
            }))

            return res.status(200).json({
                status: true,
                createVideoGame,
                message: 'Videojuego creado correctamente'
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'el Videojuego no pudo crearse'
            })
        }

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        })
    }

}

const deleteVideoGames = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteVideoGame = await Videogame.destroy({ where: { id } });
        if (deleteVideoGame) {
            return res.status(200).json({
                status: true,
                message: 'Videojuego eliminado correctamente'
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'El videojuego no se ha podido eliminar'
            })
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

const updateVideogame = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripción, plataformas, imagen, lanzamiento, rating } = req.body;
        const updateVideoGame = await Videogame.update({ nombre, descripción, plataformas, imagen, lanzamiento, rating }, { where: { id } });
        if (updateVideoGame) {
            return res.status(200).json({
                status: true,
                message: 'Videojuego actualizado correctamente'
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'El juego no se ha podido actualizar'
            })
        }

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

module.exports = {
    getAllVideogames,
    getVideogameById,
    getVideoGamesByName,
    createVideoGames,
    deleteVideoGames,
    updateVideogame
}