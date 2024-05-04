const mongoose = require('mongoose')

const dbConnection = async () => {
    await mongoose.connect(process.env.DATABASE_URI,{

    })
}

module.exports = dbConnection