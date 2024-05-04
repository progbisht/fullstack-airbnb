// allowed origin list
const allowedOrigins = ['http://localhost:3000']

// cors options
const corsOptions = {
    origin: (origin, callback) => {
        if(allowedOrigins.indexOf(origin) !== -1 || !origin){
            callback(null, true)
        }
        else{
            callback(new Error("Not allowed by CORS!"))
        }
    },
    credentials: true,
    optionSuccessStatus: 200
}

module.exports = corsOptions