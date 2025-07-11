import mongoose, { Schema, model, models } from 'mongoose';
import bcrypt from 'bcryptjs';
export const ManagerSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    companyDomain: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    stage: {
        type: String,
        enum: ['Opened', 'Hoocked', 'Locked', 'Closed'],
        required: true,
    },
}, { timestamps: true });

ManagerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
export const Manager = models.Manager || model('Manager', ManagerSchema);