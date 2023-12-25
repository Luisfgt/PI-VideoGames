const { User } = require('../db')

const createUser = async (req, res) => {
    try {
        const { name, passwordUse, email } = req.body
        const createdUser = await User.findOrCreate({
            where: { name, password: passwordUse, email }
        })
        if (createdUser) {
            return res.status(200).json({
                status: true,
                createdUser
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'No se pudo crear el usuario'
            })
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.findAll()
        if (allUsers) {
            return res.status(200).json({
                status: true,
                allUsers
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'No se trajeron los usuarios'
            })
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

const showUsers = async(req, res) => {
    try {
        const { data } = req.body
        const { email, password } = data
        console.log(data);
        const getUser = await User.findOne({where: {email, password}})
        if(getUser){
            return res.status(200).json({
                status: true,
                getUser
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'No existe el usuario'
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
    createUser,
    getAllUsers,
    showUsers
}