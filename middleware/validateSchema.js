import JoiValidationError from "../utils/joiValidationError.js";

const ValidateRequest = (schema, property) => {
    if (!schema?.validate) {
        throw new Error("ValidateRequest: invalid Joi schema provided");
    }

    return (req, res, next) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false,
            stripUnknown: true,
        });

        if (!error) {
            req[property] = value;
            return next();
        }

        const messages = error.details.map(d => d.message);

        return next(new JoiValidationError(messages));
    };
};

export default ValidateRequest;
