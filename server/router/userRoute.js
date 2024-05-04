const express = require('express')

const router = express.Router()
const userController = require('../controller/userController')

router.route('/register').post(userController.handleUserRegister)

router.route('/profile').get(userController.handleUserProfile)


module.exports = router