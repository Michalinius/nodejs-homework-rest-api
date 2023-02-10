const UserService = require('./service');
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
        username: user.email,
    };

    console.log(user.id)

    const token = jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1h" });
    console.log(token)
    await User.findByIdAndUpdate(user.id, { token });
    return res.json({ token });
};

const authorization = async (req, res, next) => {
    {
        const { username } = req.user;
        return res.json({
            message: `Authorization successful: ${username}`, data: {
                secret: "Najpierw mleko potem płatki"
            }
        });
    };
}


module.exports = { register, login }