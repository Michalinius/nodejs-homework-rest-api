const contacts = require("../../models/contacts")
const express = require('express')
const { v4: idMaker } = require('uuid')
const { schema } = require("../../utils/validation")

const router = express.Router()

router.get('/', async (req, res, next) => {
  const list = await contacts.listContacts();
  res.status(200).json(list);
})

router.get('/:contactId', async (req, res, next) => {
  const contact = await contacts.getContactById(req.params.contactId);
  console.log(contact.length)
  if (contact.length) res.status(200).json(contact)
  else res.status(404).json({ message: "Not found" })
})

router.post('/', async (req, res, next) => {
  const validation = schema.validate(req.body)
  if (validation.error) {
    res.json(validation.error);
    return 0;
  }
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) res.status(400).json({ message: "missing required name field" })
  else {
    const newContact = { id: idMaker(), name, email, phone };
    await contacts.addContact(newContact);
    res.status(201).json(newContact)
  }
})

router.delete('/:contactId', async (req, res, next) => {
  const list = await contacts.listContacts();
  const removeID = req.params.contactId;
  if (list.find((contact) => contact.id == removeID)) {
    await contacts.removeContact(removeID);
    res.status(200).json({ message: 'contact deleted' })
  } else res.status(404).json({ message: 'Not found' })
})

router.put('/:contactId', async (req, res, next) => {
  const validation = schema.validate(req.body)
  if (validation.error) {
    res.json(validation.error);
    return 0;
  }
  if (!Object.keys(req.body).length) res.status(400).json({ message: "missing fields" })
  else {
    let contact = await contacts.updateContact(req.params.contactId, req.body)
    console.log(contact)
    if (contact != "") res.status(200).json(contact)
    else res.status(404).json({ message: "Not found" })
  }
})

module.exports = router
