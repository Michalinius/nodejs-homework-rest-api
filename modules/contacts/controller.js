const ContactsService = require('./service');
const { schema } = require('../../utils/validation.js')

const getAllContacts = async (req, res) => {
    const allContacts = await ContactsService.getAll();
    return res.status(200).json(allContacts);
};

const getContactById = async (req, res) => {
    const id = req.params.contactId;
    console.log(id)
    const requestedContact = await ContactsService.getById(id);
    console.log(requestedContact)
    if (!requestedContact) return res.sendStatus(404);
    return res.status(200).json(requestedContact);
};

const createContact = async (req, res) => {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) return res.sendStatus(400);

    const validation = schema.validate(req.body)
    if (validation.error) {
        res.json(validation.error);
        return 0;
    }

    const contact = await ContactsService.create(req.body);
    console.log(contact)

    return res.status(201).json(contact);
};

const updateContact = async (req, res) => {
    const id = req.params.contactId;

    const exists = await ContactsService.exists(id);

    if (!exists) return res.sendStatus(404);

    const validation = schema.validate(req.body)
    if (validation.error) {
        res.json(validation.error);
        return 0;
    }

    const updatedContact = await ContactsService.update(id, req.body);

    res.status(200).json(updatedContact);
};

const deleteContact = async (req, res) => {
    const id = req.params.contactId;

    const exists = await ContactsService.exists(id);

    if (!exists) return res.sendStatus(404);

    const deletedContact = await ContactsService.deleteById(id);

    res.status(200).json(deletedContact);
};

const updateStatusContact = async (req, res) => {
    const id = req.params.id;
    console.log(id)
    const exists = await ContactsService.exists(id);
    console.log(exists)
    if (!exists) return res.status(404).json({ message: "Not found" });

    const validation = schema.validate(req.body)
    if (validation.error) {
        res.json(validation.error);
        return 0;
    }

    const updatedContact = await ContactsService.updateStatus(id, req.body);

    res.status(200).json(updatedContact);
};

module.exports = { getAllContacts, getContactById, createContact, updateContact, deleteContact, updateStatusContact }