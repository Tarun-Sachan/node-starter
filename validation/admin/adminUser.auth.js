import Joi from "joi";

const AdminUserAuthSchema = {
    Login: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),
    Signup: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),
}

export default AdminUserAuthSchema;