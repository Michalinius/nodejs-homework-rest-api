const express = require('express')
const { schema } = require("../../utils/validation")
const { getAllContacts, getContactById, createContact, updateContact, deleteContact, updateStatusContact } = require('../../modules/contacts/controller.js')
const router = express.Router()


router.get('/', getAllContacts)

router.get('/:contactId', getContactById)

router.post('/', createContact)

router.delete('/:contactId', deleteContact)

router.put('/:contactId', updateContact)

router.patch('/:id/favorite', updateStatusContact)

module.exports = router
