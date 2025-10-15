import Joi from "joi";

const UserAuthSchema = {
    Login: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),
}

export default UserAuthSchema;