require('dotenv').config()
const express = require('express')
const cors = require('cors')

const mongoose = require('mongoose')
const dbConnection = require('./config/dbConnection')
const corsOptions = require('./config/corsOptions')
const cookieParser = require('cookie-parser')
const path = require('path')

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



mongoose.connection.once('open', ()=> {
    console.log(`Connected to database.`);
    app.listen(4000, ()=>{
        console.log(`Server running at port 4000`);
    })
})