const passport = require('passport');
const passportJWT = require('passport-jwt');
const { User } = require('../modules/users/model')

const dotenv = require('dotenv');
dotenv.config();


const params = {
    secretOrKey: process.env.jwtSecret,
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(new passportJWT.Strategy(params, (payload, done) => {
    User.find({ _id: payload.id })
        .then(([user]) =>
            !user
                ? done(new Error("User not found!"))
                : done(null, user)
        ).catch(done);
}));

const auth = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (error, user) => {
        console.log(req.headers);
        if (!req.headers.authorization) res.status(401).json({ message: "Not authorized" })
        // else {}
    })(req, res, next);
};

module.exports = { auth };