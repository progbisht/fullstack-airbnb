
const User = require('../models/User')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const handleUserAuth = async(req,res) => {
    try{
        const { email, password } = req.body;

        const userDoc = await User.findOne({email}).exec()
        
        if(userDoc){
            const matched = await bcrypt.compare(password, userDoc.password)
            
            if(matched){
                jwt.sign({
                        email: userDoc.email,
                        id: userDoc._id
                    },
                    process.env.ACCESS_SECRET,
                    {
                        // expiresIn: "60s"
                    },
                    (err, token)=>{
                        if(err) return res.status(401).json({ message: 'Unauthaurized User' })
                        res.cookie('token', token, {
                                sameSite: false 
                            }
                        )
                        res.status(200).json(userDoc)
                    }
                )
                
            }
            else{
                res.status(401).json({ message : `Wrong Credebtials.`})
            }
        }
        else{
            res.status(401).json({ message : `User not found.`})
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message: "Something went wrong."
        })
    }

}

const handleLogout = (req,res) => {
    
    res.cookie('token', '',{
        sameSite: false 
    })
    
    res.status(204).json(true)
}

module.exports = {
    handleUserAuth,
    handleLogout
}