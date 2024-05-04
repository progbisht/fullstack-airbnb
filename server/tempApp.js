require('dotenv').config()
const express = require('express')
const cors = require('cors')

const mongoose = require('mongoose')
const dbConnection = require('./config/dbConnection')
const corsOptions = require('./config/corsOptions')
const cookieParser = require('cookie-parser')
const path = require('path')

const User = require('./models/User')
const Place = require('./models/Place')
const Booking = require('./models/Booking')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const downloader = require('image-downloader')
const multer = require('multer')
const fs = require('fs')

const app = express()

dbConnection()

app.use(cors(corsOptions))

app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/user/v1', require('./router/userRoute'));
app.use('/api/auth/v1', require('./router/authRoute'));
app.use('/api/place/v1', require('./router/placeRoute'));
app.use('/api/booking/v1', require('./router/bookingRoute'));

// app.post('/register', asyncHandler( async (req,res) => {
//     const { name, email, password } = req.body

//     const bcryptSalt = await bcrypt.genSalt(10)
//     const hashedPassword = await bcrypt.hash(password,bcryptSalt)
    

//     const userDoc = await User.create({
//         name,
//         email,
//         password: hashedPassword
//     })
//     res.json(userDoc)
    
// }) )


// app.post('/login', asyncHandler( async(req,res) => {
//     const { email, password } = req.body;

//     const userDoc = await User.findOne({email}).exec()
    
//     if(userDoc){
//         const matched = await bcrypt.compare(password, userDoc.password)
//         if(matched){
//             jwt.sign({
//                     email: userDoc.email,
//                     id: userDoc._id
//                 },
//                 process.env.ACCESS_SECRET,
//                 {
//                     // expiresIn: "60s"
//                 },
//                 (err, token)=>{
//                     if(err) return res.json({ message: 'Unauthaurized User' })
//                     res.cookie('token', token, {
//                             sameSite: false 
//                         }
//                     ).json(userDoc)
//                 }
//             )
            
//         }
//         else{
//             res.status(401).json({ message : `Wrong Credebtials.`})
//         }
//     }
//     else{
//         res.status(401).json({ message : `User not found.`})
//     }

// }))

// app.get('/profile', (req,res) => {
//     const { token } = req.cookies

//     if(token){
//         jwt.verify( token, process.env.ACCESS_SECRET, {
//             sameSite: false
//         }, 
//         async (err, userData) => {
//             if(err) throw err
//             console.log(userData)
//             const { name, email, id } = await User.findById({_id: userData.id}).exec()
//             res.json({ name, email, id })
//         })
//     }
//     else{
//         res.json(null)
//     }

// })


// app.post('/logout', (req,res) => {
//     // res.clearCookie('token', '',{
//     //     sameSite: false 
//     // }).json(true)
//     res.cookie('token', '',{
//         sameSite: false 
//     }).json(true)
// })



// app.post('/upload-by-link', async (req,res) => {
//     const { link } = req.body
    
//     const imgName = 'image' + Date.now() + '.jpg'
    
//     await downloader.image({
//         url: link,
//         dest: __dirname + '/uploads/' + imgName
//     })

//     return res.json(imgName)
// })

// const photosMiddleware = multer({ dest: 'uploads/'})
// app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
//     const uploadedFiles = []
    
//     for(let i = 0; i < req.files.length; i++){
//         const { path, originalname } = req.files[i]
//         const parts = originalname.split('.')
//         const ext = parts[parts.length - 1]
//         const newPath = path + '.' + ext
//         fs.renameSync(path, newPath)

//         uploadedFiles.push(newPath.replace('uploads', ''))
//     }
    

//     res.json(uploadedFiles)
// })


// app.post('/places', (req,res) => {
//     const { token } = req.cookies

//     const { title, address, addedPhotos, 
//             description, perks, extraInfo, 
//             checkIn, checkOut, maxGuests } = req.body

//     if(token){
//         jwt.verify( token, process.env.ACCESS_SECRET, {
//             sameSite: false
//         }, 
//         async (err, userData) => {
//             if(err) throw err
//             console.log(userData);
//             const newPlace = await Place.create({
//                 owner: userData.id,
//                 title, 
//                 address, 
//                 photos: addedPhotos, 
//                 description, 
//                 perks, 
//                 extraInfo, 
//                 checkIn, 
//                 checkOut, 
//                 maxGuests, 
//                 price
//             })
//             res.json(newPlace)
//         })

//     }
//     else{
//         res.json(null)
//     }
// })

// app.get('/user-places', (req,res) => {
//     const { token } = req.cookies

//     if(token){
//         jwt.verify( token, process.env.ACCESS_SECRET, {
//             sameSite: false
//         }, 
//         async (err, userData) => {
//             if(err) throw err
//             const places = await Place.find({ owner: userData.id }
//             )
//             res.json(places)
//         })

//     }
//     else{
//         res.json(null)
//     }
// })

// app.put('/places', (req,res) => {
//     const { token } = req.cookies

//     const { id, title, address, addedPhotos, 
//             description, perks, extraInfo, 
//             checkIn, checkOut, maxGuests, price } = req.body
    
//     if(token){
//         jwt.verify( token, process.env.ACCESS_SECRET, {
//             sameSite: false
//         }, 
//         async (err, userData) => {
//             if(err) throw err
            
//             const updatedPlace = await Place.findOne({ _id : id })
            
//             if(userData.id === updatedPlace.owner.toString()){
//                 await updatedPlace.set({
//                     title: title, 
//                     address: address, 
//                     photos: addedPhotos, 
//                     description: description, 
//                     perks: perks, 
//                     extraInfo: extraInfo, 
//                     checkIn: checkIn, 
//                     checkOut: checkOut, 
//                     maxGuests: maxGuests,
//                     price: price
//                 })
//             }

//             await updatedPlace.save()
//             console.log(updatedPlace);

//             res.json(updatedPlace)
//         })

//     }
//     else{
//         res.json(null)
//     }
// })

// app.get('/places/:id', (req,res) => {
//     const { token } = req.cookies
//     const { id } = req.params
//     if(token){
//         jwt.verify( token, process.env.ACCESS_SECRET, {
//             sameSite: false
//         }, 
//         async (err, userData) => {
//             if(err) throw err
//             const place = await Place.findOne({ _id : id })
//             res.json(place)
//         })

//     }
//     else{
//         res.json(null)
//     }
// })


// app.get('/places', async (req, res) =>{
//     const places = await Place.find().exec()

//     res.json(places)
// })

// app.get('/place/:id', async (req, res) =>{
//     const { id } = req.params

//     const place = await Place.findOne({ _id : id }).exec()

//     res.json(place)
// })

// app.post('/bookings', (req, res) => {

//     const { token } = req.cookies

//     const { place, checkIn, checkOut, maxGuests, name, phone, price} = req.body

//     if(token){
//         jwt.verify( token, process.env.ACCESS_SECRET, {
//             sameSite: false
//         }, 
//         async (err, userData) => {
//             if(err) throw err
//             const bookingDoc = await Booking.create({
//                 place, 
//                 user: userData.id,
//                 checkIn, 
//                 checkOut, 
//                 maxGuests, 
//                 name, 
//                 phone, 
//                 price
//             })

//             res.json(bookingDoc)
//         })

//     }
//     else{
//         res.json(null)
//     }
    
// })

// app.get('/bookings', (req, res) => {
//     const { token } = req.cookies
    
//     if(token){
//         jwt.verify( token, process.env.ACCESS_SECRET, {
//             sameSite: false
//         }, 
//         async (err, userData) => {
//             if(err) throw err
         
//             const allBookings = await Booking.find({ user : userData.id }).populate('place')
            
//             res.json(allBookings)
//         })

//     }
//     else{
//         res.json(null)
//     }
// })

mongoose.connection.once('open', ()=> {
    console.log(`Connected to database.`);
    app.listen(4000, ()=>{
        console.log(`Server running at port 4000`);
    })
})