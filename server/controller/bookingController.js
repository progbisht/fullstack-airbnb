
const Booking = require('../models/Booking')
const jwt = require('jsonwebtoken')



const handleUserNewBooking = (req, res) => {

    const { token } = req.cookies

    const { place, checkIn, checkOut, maxGuests, name, phone, price} = req.body

    if(token){
        jwt.verify( token, process.env.ACCESS_SECRET, {
            sameSite: false
        }, 
        async (err, userData) => {
            if(err) throw err
            const bookingDoc = await Booking.create({
                place, 
                user: userData.id,
                checkIn, 
                checkOut, 
                maxGuests, 
                name, 
                phone, 
                price
            })

            res.status(200).json(bookingDoc)
        })

    }
    else{
        res.status(401).json("Unauthorized Access")
    }
    
}

const handleUserAllBooking = (req, res) => {
    const { token } = req.cookies
    
    if(token){
        jwt.verify( token, process.env.ACCESS_SECRET, {
            sameSite: false
        }, 
        async (err, userData) => {
            if(err) throw err
         
            const allBookings = await Booking.find({ user : userData.id }).populate('place').lean()

            res.status(200).json(allBookings)
        })

    }
    else{
        res.status(401).json("Unauthorized Access")
    }
}

const handleUserBookingDetails = (req, res) => {
    const { token } = req.cookies
    const {id} = req.params

    
    if(token){
        jwt.verify( token, process.env.ACCESS_SECRET, {
            sameSite: false
        }, 
        async (err, userData) => {
            if(err) throw err
         
            const booking = await Booking.find({ _id : id }).populate('place')
            
            res.status(200).json(booking)
        })

    }
    else{
        res.status(401).json("Unauthorized Access")
    }
}

module.exports = {
    handleUserNewBooking,
    handleUserAllBooking,
    handleUserBookingDetails
}
