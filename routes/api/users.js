const express = require('express');
const { auth } = require('../../middleware/middleware.js');
const { register, login } = require('../../modules/users/controller.js')
const router = express.Router()


router.post('/signup', register);

router.post('/login', login);

router.get('/auth', auth)


// router.get('/:contactId', getContactById)

// router.post('/', createContact)

// router.delete('/:contactId', deleteContact)

// router.put('/:contactId', updateContact)

// router.patch('/:id/favorite', updateStatusContact)

module.exports = router  
