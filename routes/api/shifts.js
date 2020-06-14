const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
// models
const User = require('../../models/User');
const Shift = require('../../models/Shift');
const Deployment = require('../../models/Deployment');

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

            let shifts = await Shift.find({ userId }).select(['name', 'numberOfEmployees', 'startHour', 'endHour']).sort('date');
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

            // //delete shifts that didnt came back from client (means the client deleted it)
            let shiftsToDelete = Shift.find({ userId });
            let shiftIdsFromClient = shifts.map(shift => shift._id ? shift._id.toString() : null);
            let shiftIdsForUser = await Promise.resolve(shiftsToDelete);
            shiftIdsForUser = shiftIdsForUser.map(shift => shift._id);

            await shiftIdsForUser.map(shift => shift._id).map(async (_id) => {
                if (!shiftIdsFromClient.includes(_id.toString())) {
                    await Shift.findByIdAndDelete({ _id });
                    let deploymentsToDelete = await Deployment.find({ shiftId: _id }).select('_id');
                    deploymentsToDelete.map(deploy => {
                        Promise.resolve(Deployment.findByIdAndDelete({ _id: deploy._id }))
                    });
                }
            });

            Promise.all(shifts.map(async (shift) => {
                if (shift._id) {
                    await Shift.findByIdAndUpdate(shift._id, shift);
                } else {
                    let newShift = new Shift({ ...shift, userId });
                    await newShift.save();
                }
            })).then(async () => {
                let shiftsToSend = await Shift.find({ userId }).select(['name', 'numberOfEmployees', 'startHour', 'endHour']).sort('date');
                res.send({ status: 200, data: shiftsToSend });
            });

        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server error');
        }

    });

module.exports = router;