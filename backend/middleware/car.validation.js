const { isNull } = require("./isNull");

exports.isValidCar = (req, res, next) => {
    const { category, make, model, color, registrationNo } = req.body;

    if (isNull(category)) {
        return res.status(400).json({ error: 'Select Category' })
    }
    if (isNull(make)) {
        return res.status(400).json({ error: 'Make is required' })
    }
    if (isNull(model)) {
        return res.status(400).json({ error: 'Enter Model' })
    }
    if (isNull(color)) {
        return res.status(400).json({ error: 'Enter Color' })
    }
    if (isNull(registrationNo)) {
        return res.status(400).json({ error: 'Enter Reg Num' })
    }
    next();
}