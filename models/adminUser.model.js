import mongoose from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema(
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
        type: {
            type: String,
            default: "internal",
            immutable: true,
        },
        role: {
            type: String,
            enum: ["admin", "superadmin"],
            default: "admin",
        },
        status: {
            type: String,
            enum: ["active", "inactive", "suspended"],
            default: "active",
        },
        authProvider: {
            type: String,
            default: "local",
            immutable: true,
        },
        refreshTokens: {
            type: [String],
            default: []
        }
    },
    { timestamps: true }
);

// Hash password before save
adminSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare entered password with stored hash
adminSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

// Clean JSON output
adminSchema.methods.toJSON = function () {
    const obj = this.toObject({ virtuals: true });
    delete obj.password;
    delete obj.__v;
    return obj;
};

// Virtual ID field
adminSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

const AdminUser = mongoose.model("AdminUser", adminSchema);
export default AdminUser;
