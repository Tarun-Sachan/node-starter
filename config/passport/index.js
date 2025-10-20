import passport from "passport";
import jwtStrategy from "./passport.js";

passport.use(jwtStrategy);

export default passport;
