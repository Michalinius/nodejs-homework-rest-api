const { userSchema } = require('../../utils/validation.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { User } = require('./model');

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
            const response = await User.create({ email: req.body.email, password: hashedPwd });
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




module.exports = { register, login, logout, userSubscription }