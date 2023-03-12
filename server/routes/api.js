const express = require('express');
const router = express.Router();
const authRouter = require('./apiRoutes/authRoutes');
const vehicleRouter = require('./apiRoutes/vehicleRoutes');
const userRouter = require('./apiRoutes/userRoutes');


router.use('/auth', authRouter);
// router.use('/vehicles', vehicleRouter);
// router.use('/users', userRouter);


module.exports = router;