const express = require('express');
const { auth } = require('../../middleware/authorization.js');
const { register, login, logout, userSubscription, uploadAvatar } = require('../../modules/users/controller.js')
const router = express.Router()
const { upload } = require('../../middleware/uploads')



router.post('/signup', register);

router.post('/login', login);

router.get('/logout', auth, logout);

router.get('/current', auth, userSubscription);

router.patch('/avatar', auth, upload.single('avatar'), uploadAvatar);


module.exports = router  
