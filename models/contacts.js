const fs = require('fs/promises')
const path = require('path')

const contactsPath = path.resolve("models/contacts.json")

const listContacts = async () => {
  try {
    const contacts = await fs.readFile(contactsPath, { encoding: "UTF-8" });
    const contactsList = JSON.parse(contacts);
    return contactsList;
  } catch (error) {
    console.log(error.message);
  }
}

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    return contacts.filter(contact => contact.id == contactId);
  } catch (error) {
    console.log(error.message);
  }
}

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const filteredContacts = contacts.filter(({ id }) => id !== contactId);
  await fs.writeFile(contactsPath, JSON.stringify(filteredContacts, null, 2), { encoding: "utf-8" });
}

const addContact = async (newContact) => {
  try {
    const contacts = await listContacts();
    const updatedContacts = JSON.stringify([...contacts, newContact], null, 2);
    await fs.writeFile(contactsPath, updatedContacts, { encoding: "utf-8" })
  } catch (error) {
    console.log(error)
  }
}

const updateContact = async (contactId, body) => {
  try {
    const contacts = await listContacts();
    let updatedContact = "";
    const newList = contacts.map((contact) => {
      if (contact.id == contactId) {
        if (body.name) contact.name = body.name;
        if (body.email) contact.email = body.email;
        if (body.phone) contact.phone = body.phone;
        updatedContact = contact;
      }
      return contact;
    })
    if (updatedContact != "") await fs.writeFile(contactsPath, JSON.stringify(newList, null, 2), { encoding: "utf-8" })
    return updatedContact;
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
