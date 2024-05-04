const express = require('express')

const router = express.Router()
const multer = require('multer')
const placeController = require('../controller/placeController')


router.route('/upload-by-link').post(placeController.handleUploadImageByLink)

const photosMiddleware = multer({ dest: 'uploads/'})
router.route('/upload').post(photosMiddleware.array('photos', 100), placeController.handleUploadPlaceImage)
router.route('/places').post(placeController.handleAddNewPlace)
router.route('/places').put(placeController.handleUpdatePlaces)
router.route('/places').get(placeController.handleGetAllPlaces)
router.route('/user-places').get(placeController.handleUserPlaces)
router.route('/places/:id').get(placeController.handleGetSingleUserPlace)
router.route('/place/:id').get(placeController.handleGetSinglePlace)


module.exports = router