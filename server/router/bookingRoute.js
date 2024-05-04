const express = require('express')
const router = express.Router()

const bookingController = require('../controller/bookingController')

router.route('/bookings').post(bookingController.handleUserNewBooking)
router.route('/bookings').get(bookingController.handleUserAllBooking)

router.route('/bookings/:id').get(bookingController.handleUserBookingDetails)


module.exports = router


