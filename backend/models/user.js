const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    userName: {
        type: String, require: true, unique: true, lowercase: true,
    },
    email: {
        type: String, require: true, unique: true, lowercase: true
    },
    password: {
        type: String, require: true,
    },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

module.exports = mongoose.model("user", userSchema)