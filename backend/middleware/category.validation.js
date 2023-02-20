const { isNull } = require("./isNull");

exports.isValidCategory = (req, res, next) => {
    const { name } = req.body;

    if (isNull(name)) {
        return res.status(400).json({ error: 'Enter Category Name' })
    }
   

    next();
}