const express = require('express');
const router = express.Router();
const authRouter = require('./apiRoutes/authRoutes');
const userRouter = require('./apiRoutes/userRoutes');
const vehicleRouter = require('./apiRoutes/vehicleRoutes');
const vehicleHireRoutes = require('./apiRoutes/vehicleHireRoutes');
const paymentRouter = require('./apiRoutes/paymentRoutes');
const userLocationRouter = require('./apiRoutes/userLocationRoutes');
const vehicleLocationRoutes = require('./apiRoutes/vehicleLocationRoutes')


router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/vehicles', vehicleRouter);
router.use('/vehicle-hires', vehicleHireRoutes);
router.use('/payments', paymentRouter);
router.use('/user-locations', userLocationRouter);
router.use('/vehicle-locations', vehicleLocationRoutes);


module.exports = router;