const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
// models
const User = require('../../models/User');


// @route  POST api/auth
// @desc   Register user
// @access Public
router.post('/', [
    check('userId', 'userId is required').not().isEmpty()
    check('fullName', 'Name is required').not().isEmpty()
], async (req, res) => {

    //check for errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, fullName, phone, title } = req.body;

    //See if users exists
    try {
        let user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({ errors: [{ param: 'userId', msg: 'No user found for employer' }] });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }

    const employee = new Employee({
        userId,
        fullName,
        phone,
        title
    });

    await employee.save();
    res.send({ success: true });

    //res.json / res.send

});

module.exports = router;