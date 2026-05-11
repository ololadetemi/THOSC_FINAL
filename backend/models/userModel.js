const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String, required: [true, 'Please enter an email'],
        lowercase: true, unique: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String, required: [true, 'Please enter a password'],
        minLength: [6, 'Minimum length is 6 characters']
    },
    role: {
        type: String,
        enum: ['admin', 'doctor', 'lab_technician', 'receptionist', 'pharmacist'],
        required: true
    },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) { next(error); }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
