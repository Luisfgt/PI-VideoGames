require('dotenv').config();
const { Genre } = require('../db')
const axios = require("axios")
const {
    API_KEY
} = process.env;

const URL_API = `https://api.rawg.io/api/genres`

const getAllGenres = async (req, res) => {
    try {
        const getGenresByApi = (await axios.get(`${URL_API}${API_KEY}`)).data.results
        if (getGenresByApi) {
            const createGenre = await Promise.all(getGenresByApi.map((async (genre) => {
                const getGenre = await Genre.findOrCreate({ where: {nombre: genre.name} })
                return getGenre
            }
            )))
            if (createGenre) {
                return res.status(200).json({
                    status: true,
                    genres: createGenre
                })
            }
        } else {
            return res.status(200).json({
                status: false,
                message: 'No se pudo'
            })
        }

    } catch (error) {
        return error.message
    }
}

module.exports = getAllGenres


