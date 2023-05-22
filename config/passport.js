let JwtStrategy = require("passport-jwt").Strategy;
let ExtraJwt = require("passport-jwt").ExtractJwt;
const User = require("../models").user;

module.exports = (passport) =>
{
    // Create an empty object for storing data from client
    let opts = {};
    opts.jwtFromRequest = ExtraJwt.fromAuthHeaderWithScheme("jwt");
    opts.secretOrKey = process.env.PASSPORT_SECRET;

    passport.use(new JwtStrategy(opts, async function(jwt_payload, done)
    {
        // jwt_payload => The content of JWT _id + email
        try
        {
            let foundUser = await User.findOne({ _id: jwt_payload._id}).exec();
            if (foundUser)
            {
                return done(null, foundUser);
            }
            else
            {
                return done(null, false);
            }
        }
        catch (err)
        {
            return done(err, false);
        }
    }));
}