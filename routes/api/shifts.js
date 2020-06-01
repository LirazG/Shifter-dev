const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
// models
const User = require('../../models/User');
const Shift = require('../../models/Shift');

// @route  GET api/shifts/getShiftsForUser
// @desc   Fetch all shifts for user route
// @access Private

router.get('/getShiftsForUser', [
    auth,
    check('userId', 'Missing userId').not().isEmpty()
],
    async (req, res) => {
        //check for errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId } = req.query;

        //See if users exists
        try {
            let user = await User.findOne({ _id: userId });
            if (!user) {
                return res.status(400).json({ errors: [{ param: '', msg: 'User not Found' }] });
            }

            let shifts = await Shift.find({ userId }).select(['name', 'numberOfWorkers', 'startHour', 'endHour']).sort('date');
            res.send({ status: 200, data: shifts });

        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server error');
        }
    });


// @route  PUT api/shifts/updateShifts
// @desc   Update shifts
// @access Private

router.put('/updateShifts', [
    auth,
    check('userId', 'Missing userId').not().isEmpty(),
    check('shifts').custom((value, { req }) => {
        if (!Array.isArray(req.body.shifts)) {
            throw new Error('Shifts must be array type');
        }
        if (req.body.length === 0) {
            throw new Error('Shifts must not be empty');
        }
        return true;
    })
],
    async (req, res) => {
        //check for errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { shifts, userId } = req.body;

        //See if users exists
        try {
            let user = await User.findOne({ _id: userId });
            if (!user) {
                return res.status(400).json({ errors: [{ param: '', msg: 'User not Found' }] });
            }

            Promise.all(shifts.map(async (shift) => {
                if (shift._id) {
                    Shift.findByIdAndUpdate(shift._id, shift).exec();
                } else {
                    let newShift = new Shift({ ...shift, userId });
                    await newShift.save();
                }
            })).then(async () => {
                let shiftsToSend = await Shift.find({ userId }).select(['name', 'numberOfWorkers', 'startHour', 'endHour']).sort('date');
                res.send({ status: 200, data: shiftsToSend });
            });

        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server error');
        }

    });

module.exports = router;