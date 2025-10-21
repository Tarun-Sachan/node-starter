import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import { AdminUser, User } from "../../models/index.js";
import config from "../../config/index.js";

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.JWT_SECRET,
    passReqToCallback: true,
}


const jwtStrategy = new JwtStrategy(options, async (req, jwt_payload, done) => {
    try {
        let userModel = jwt_payload.role === "admin" || jwt_payload.role === "superadmin"
            ? AdminUser
            : User;

        const user = await userModel.findById(jwt_payload.id);

        if (!user) return done(null, false);
        if (user.role !== jwt_payload.role) {
            return done(null, false, { message: "Role mismatch" });
        }

        req.token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

        return done(null, user);
    } catch (err) {
        return done(err, false);
    }
});

export default jwtStrategy;