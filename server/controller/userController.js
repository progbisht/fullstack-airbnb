
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const handleUserRegister = async (req,res) => {
    try{
        const { name, email, password } = req.body
    
        const bcryptSalt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,bcryptSalt)
        
    
        const userDoc = await User.create({
            name,
            email,
            password: hashedPassword
        })
        res.status(201).json(userDoc)

    }catch(err){
        return res.status(500).json({
            message: "Something went wrong."
        })
    }
    
}

const handleUserProfile = (req,res) => {
        const { token } = req.cookies
    
        if(token){
            jwt.verify( token, process.env.ACCESS_SECRET, {
                sameSite: false
            }, 
            async (err, userData) => {
                if(err) throw err
                
                const { name, email, id } = await User.findById({_id: userData.id}).exec()
                res.status(200).json({ name, email, id })
            })
        }
        else{
            res.status(204).json(null)
        }
    
    }




module.exports = {
    handleUserRegister,
    handleUserProfile
}