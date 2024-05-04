const express = require('express')

const router = express.Router()
const authController = require('../controller/authController')

router.route('/login').post(authController.handleUserAuth)
router.route('/logout').post(authController.handleLogout)


module.exports = router