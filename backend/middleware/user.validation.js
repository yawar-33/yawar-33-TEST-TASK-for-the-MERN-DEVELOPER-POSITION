const { isNull } = require("./isNull");

exports.isSignupRequestValidated = (req, res, next) => {
    const { userName, email } = req.body;

    if (isNull(userName)) {
        return res.status(400).json({ error: 'Enter User Name' })
    }
    if (isNull(email)) {
        return res.status(400).json({ error: 'Enter Email' })
    }

    next();
}

exports.isSignInRequestValidated = (req, res, next) => {
    const { email, password } = req.body;

    if (isNull(email)) {
        return res.status(400).json({ error: 'Enter Email' })
    }
    if (isNull(password)) {
        return res.status(400).json({ error: 'Enter Password' })
    }
    next();
}