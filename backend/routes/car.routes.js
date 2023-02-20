const express = require("express");
const { createCar, getAllCars, getCarId, deleteCar, updateCar, getRegisterCars } = require("../controllers/car.controller");
const { isValidCar } = require("../middleware/car.validation");
const { requireSignin } = require("../middleware/token.validation");
const router = express.Router();


router.post('/car/save', requireSignin, isValidCar, createCar)
router.get('/car/get', requireSignin, getAllCars)
router.get('/car/getbyid/:id', requireSignin, getCarId)
router.patch('/car/update/:id', requireSignin, isValidCar, updateCar)
router.delete('/car/deletebyid/:id', requireSignin, deleteCar)
router.get('/car/getregistercars', requireSignin, getRegisterCars)
module.exports = router;