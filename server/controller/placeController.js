const Place = require('../models/Place')
const jwt = require('jsonwebtoken')
const downloader = require('image-downloader')
const fs = require('fs')


const handleUploadImageByLink = async (req,res) => {
    try{
        const { link } = req.body
    
        const imgName = 'image' + Date.now() + '.jpg'
        
        await downloader.image({
            url: link,
            dest: __dirname + '/uploads/' + imgName
        })

        res.status(200).json(imgName)

    }
    catch(err){
        return res.status(500).json({
            message: "Something went wrong."
        })
    }
}


const handleUploadPlaceImage = (req, res) => {
    const uploadedFiles = []
    
    for(let i = 0; i < req.files.length; i++){
        const { path, originalname } = req.files[i]
        const parts = originalname.split('.')
        const ext = parts[parts.length - 1]
        const newPath = path + '.' + ext
        fs.renameSync(path, newPath)

        uploadedFiles.push(newPath.replace('uploads', ''))
    }
    

    res.status(200).json(uploadedFiles)
}


const handleAddNewPlace = (req,res) => {
    const { token } = req.cookies

    const { title, address, addedPhotos, 
            description, perks, extraInfo, 
            checkIn, checkOut, maxGuests } = req.body

    if(token){
        jwt.verify( token, process.env.ACCESS_SECRET, {
            sameSite: false
        }, 
        async (err, userData) => {
            if(err) throw err
            
            const newPlace = await Place.create({
                owner: userData.id,
                title, 
                address, 
                photos: addedPhotos, 
                description, 
                perks, 
                extraInfo, 
                checkIn, 
                checkOut, 
                maxGuests, 
                price
            })
            res.status(200).json(newPlace)
        })

    }
    else{
        res.status(400).json("Unauthorized Access")
    }
}

const handleUserPlaces = (req,res) => {
    const { token } = req.cookies

    if(token){
        jwt.verify( token, process.env.ACCESS_SECRET, {
            sameSite: false
        }, 
        async (err, userData) => {
            if(err) throw err
            const places = await Place.find({ owner: userData.id }
            )
            res.status(200).json(places)
        })

    }
    else{
        res.status(401).json("Unauthorized Access")
    }
}

const handleUpdatePlaces = (req,res) => {
    const { token } = req.cookies

    const { id, title, address, addedPhotos, 
            description, perks, extraInfo, 
            checkIn, checkOut, maxGuests, price } = req.body
    
    if(token){
        jwt.verify( token, process.env.ACCESS_SECRET, {
            sameSite: false
        }, 
        async (err, userData) => {
            if(err) throw err
            
            const updatedPlace = await Place.findOne({ _id : id })
            
            if(userData.id === updatedPlace.owner.toString()){
                await updatedPlace.set({
                    title: title, 
                    address: address, 
                    photos: addedPhotos, 
                    description: description, 
                    perks: perks, 
                    extraInfo: extraInfo, 
                    checkIn: checkIn, 
                    checkOut: checkOut, 
                    maxGuests: maxGuests,
                    price: price
                })
            }

            await updatedPlace.save()
            console.log(updatedPlace);

            res.status(200).json(updatedPlace)
        })

    }
    else{
        res.status(401).json("Unauthorized Access")
    }
}

const handleGetSingleUserPlace = (req,res) => {
    const { token } = req.cookies
    const { id } = req.params
    
    if(token){
        jwt.verify( token, process.env.ACCESS_SECRET, {
            sameSite: false
        }, 
        async (err, userData) => {
            if(err) throw err
            const place = await Place.findOne({ _id : id })
            res.status(200).json(place)
        })

    }
    else{
        res.status(401).json("Unauthorized Access")
    }
}


const handleGetAllPlaces = async (req, res) =>{
    try{
        const places = await Place.find().exec()
        res.status(200).json(places)
    }
    catch(err){
        return res.status(500).json({
            message: "Something went wrong."
        })
    }
}

const handleGetSinglePlace = async (req, res) =>{
    try{
        const { id } = req.params

        const place = await Place.findOne({ _id : id }).exec()
        res.status(200).json(place)
    }
    catch(err){
        return res.status(500).json({
            message: "Something went wrong."
        })
    }
}

module.exports = {
    handleUploadImageByLink,
    handleUploadPlaceImage,
    handleAddNewPlace,
    handleUserPlaces,
    handleUpdatePlaces,
    handleGetSingleUserPlace,
    handleGetAllPlaces,
    handleGetSinglePlace
}