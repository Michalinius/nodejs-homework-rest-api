const { Contact } = require('./model')

const getAll = async () => Contact.find();

const getById = async (id) => Contact.findById(id);

const create = async (body) => Contact.create(body);

const exists = async (id) => Contact.exists({ _id: id });

const update = async (id, { name, email, phone }) => {
    let upsert = {};
    if (name) upsert.name = name;
    if (email) upsert.email = email;
    if (phone) upsert.phone = phone;

    return Contact.findByIdAndUpdate(id, upsert, { new: true });
};

const updateStatus = async (id, body) => {
    return Contact.findByIdAndUpdate(id, { favorite: body.favorite }, { new: true });
}

const deleteById = async (id) => Contact.findByIdAndDelete(id);

module.exports = { getAll, getById, create, exists, update, deleteById, updateStatus };

