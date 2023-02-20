const User = require("../models/user")
const { sign } = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const generateJwtToken = (id, email) => {
    return sign({ id: id, email: email }, process.env.JWT_SECRET, { expiresIn: "1d" });

};


const signup = async (req, res) => {
    const { email, userName } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email: email }, { userName: userName }]
        })
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        password = await bcrypt.hash("", 8);

        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Welcome to MyApp',
            text: `Welcome to MyApp, ${userName}! Your password is ${password}`
        };

        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                res.status(500).json(error);

            } else {
                // Save the user to the database
                const user = new User({ userName, email, password });
                await user.save();
                res.status(200).json({ message: 'User created successfully ! Check Email' });
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // check if able to found user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not exist' });
        }

        try {
            // compare bcrypt password 
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                return res.status(400).json({ message: 'Invalid password.' });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        const token = generateJwtToken(user._id, user.email)  // method will use to generate token

        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {
    signup,
    signin,
};
