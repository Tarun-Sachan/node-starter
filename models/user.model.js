import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters long"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
        },
        password: {
            type: String,
            minlength: [6, "Password must be at least 6 characters"],
            select: false,
        },
        role: {
            type: String,
            default: "user",
            immutable: true,
        },
        type: {
            type: String,
            default: "external",
            immutable: true,
        },
        authProvider: {
            type: String,
            enum: ["local", "google", "github", "facebook", "twitter", "linkedin", "apple", "microsoft"],
            default: "local",
        },
        providerId: {
            type: String,
            default: null,
        },
        refreshTokens: {
            type: [String],
            default: []
        }
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.toJSON = function () {
    const obj = this.toObject({ virtuals: true });
    delete obj.password;
    delete obj.__v;
    return obj;
};

userSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

const User = mongoose.model("User", userSchema);
export default User;
