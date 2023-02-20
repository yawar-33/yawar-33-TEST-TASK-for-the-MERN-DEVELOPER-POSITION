const Car = require('../models/car');

// Create a new car
const createCar = async (req, res) => {
    const { category, make, model, color, registrationNo } = req.body;
    const car = new Car({ category, make, model, color, registrationNo });
    try {
        const newCar = await car.save();
        res.status(200).json(newCar);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all cars
const getAllCars = async (req, res) => {
    const pageNum = parseInt(req.query.pageNum) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    try {
        const totalCount = await Car.countDocuments();

        const cars = await Car.find({}).populate({
            path: 'category',
            select:
                '_id name',
        }).skip((pageNum - 1) * pageSize)
            .limit(pageSize);
        const totalPages = Math.ceil(totalCount / pageSize);

        res.status(200).json({ cars, totalCount, totalPages });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get register Car 
const getRegisterCars = async (req, res) => {
    try {
        const totalCount = await Car.countDocuments();
        res.status(200).json(totalCount);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}
// Get a single car
const getCarId = async (req, res) => {
    const { id } = req.params;
    if (id) {
        try {
            const car = await Car.findById(id).populate({
                path: 'category',
                select:
                    '_id name',
            });
            if (!car) {
                return res.status(400).json({ message: 'Car not found' });
            }
            res.status(200).json(car);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else {
        return res.status(400).json({ error: "Params required" });
    }
};

// Update a category
const updateCar = async (req, res) => {
    const { id } = req.params;
    const { category, make, model, color, registrationNo } = req.body
    try {
        const car = await Car.findByIdAndUpdate(id,
            { category: category, make: make, model: model, color: color, registrationNo: registrationNo },
            { new: true });
        if (!car) {
            return res.status(400).json({ message: 'Car not found' });
        }
        res.status(200).json(car);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a category
const deleteCar = async (req, res) => {
    const { id } = req.params;
    try {
        const car = await Car.findByIdAndDelete(id);
        if (!car) {
            return res.status(400).json({ message: 'Car not found' });
        }
        res.status(200).json({ message: 'Car deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createCar,
    getAllCars,
    getCarId,
    updateCar,
    deleteCar,
    getRegisterCars
};
