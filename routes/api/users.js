const express = require('express');
const { auth } = require('../../middleware/middleware.js');
const { register, login, logout, userSubscription } = require('../../modules/users/controller.js')
const router = express.Router()


router.post('/signup', register);

router.post('/login', login);

router.get('/logout', auth, logout)

router.get('/current', auth, userSubscription)


module.exports = router  
