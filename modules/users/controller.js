const { userSchema } = require('../../utils/validation.js')
const { sendEmail } = require('../../utils/sender.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { User } = require('./model');
const gravatar = require('gravatar')
const { upload, UPLOAD_DIR, IMAGES_DIR } = require('../../middleware/uploads')
const path = require('path')
const fs = require('fs/promises')
const Jimp = require('jimp')
const { v4: uuidv4 } = require('uuid')


const register = async (req, res, next) => {
    const validation = userSchema.validate(req.body)
    if (validation.error) {
        res.status(400).json(validation.error);
        return 0;
    }
    const isExist = await User.findOne({ email: req.body.email });
    if (isExist) res.status(409).json({ message: "Email in use" });
    else {
        try {
            const hashedPwd = await bcrypt.hash(req.body.password, 10);
            const response = await User.create({ email: req.body.email, password: hashedPwd, avatarURL: gravatar.url(req.body.email, { s: '200', r: 'pg', d: 'retro' }), verificationToken: uuidv4() });
            sendEmail(response.email, response.verificationToken)
            res.status(201).json(response)
        } catch (error) {
            next(error);
        }
    }
};

const login = async (req, res, next) => {

    const validation = userSchema.validate(req.body)
    if (validation.error) {
        res.status(400).json(validation.error);
        return 0;
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    const isValidPwd = await bcrypt.compare(password, user.password);

    if (!user.verify) return res.status(401).json({ message: "Verify email" });

    if (!user || !isValidPwd) return res.status(401).json({ message: "Email or password is wrong" });

    const payload = {
        id: user._id,
        email: user.email,
    };

    const token = jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1h" });
    await User.findByIdAndUpdate(user.id, { token });
    return res.status(200).json({ token });
};

const logout = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) res.status(401).json({ message: "Not authorized" })
    else {
        await User.findByIdAndUpdate(user.id, { token: null });
        res.status(204).json({ message: "No content" });
    }
}

const userSubscription = async (req, res, next) => {
    const user = await User.findOne({ token: req.user.token });
    if (!user) res.status(401).json({ message: "Not authorized" });
    else res.status(200).json({ email: user.email, subscription: user.subscription })
};

const uploadAvatar = async (req, res, next) => {
    try {
        const { path: temporaryname, originalname } = req.file;
        const image = await Jimp.read(temporaryname);
        await image.resize(250, 250);
        const name = req.user.email.slice(0, req.user.email.indexOf("@")) + temporaryname.slice(temporaryname.indexOf("."))
        const filename = path.join(IMAGES_DIR, name);
        await image.writeAsync(filename)
        await fs.unlink(temporaryname);
        await User.findByIdAndUpdate(req.user.id, { avatarURL: "/avatars/" + name })
        res.status(200).json({ message: filename })
    } catch (error) {
        await fs.unlink(temporaryname);
        return res.sendStatus(500);
    }
}

const userVerification = async (req, res, next) => {
    console.log(req.params.verificationToken)
    const user = await User.findOne({ verificationToken: req.params.verificationToken });
    if (!user) res.status(404).json({ message: "User not found" });
    else {
        await User.findByIdAndUpdate(user.id, { verificationToken: null, verify: true })
        res.status(200).json({ message: "Verification successful" })
    }
}

const resendToken = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) res.status(400).json({ message: "missing required field email" })
    else if (user.verify) res.status(400).json({ message: "Bad Request" })
    else sendEmail(user.email, user.verificationToken)
}


module.exports = { register, login, logout, userSubscription, uploadAvatar, userVerification, resendToken }