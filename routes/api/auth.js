const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
// models
const User = require('../../models/User');
const Shift = require('../../models/Shift');

// @route  GET api/auth/validateUser
// @desc   validate user route
// @access Public

router.get('/validateUser', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route  POST api/auth/login
// @desc   Login route
// @access Public

router.post('/login', [
    check('email', 'please include a valid email').isEmail(),
    check('password', 'Password is required').not().isEmpty()
],
    async (req, res) => {
        //check for errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        //See if users exists
        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ errors: [{ param: 'password', msg: 'email or password are incorrect' }] });
            }

            //match password with found user
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ errors: [{ param: 'password', msg: 'email or password are incorrect' }] });
            }

            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token, userData: user });
                }
            )

        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server error');
        }
    });


// @route  POST api/auth
// @desc   Register user
// @access Public
router.post('/', [
    check('fullName', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('passwordConfirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation is incorrect');
        }
        return true;
    })
], async (req, res) => {

    //check for errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, password } = req.body;

    //See if users exists
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ errors: [{ param: 'email', msg: 'User already exists' }] });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }

    const user = new User({
        fullName,
        email,
        password
    });

    //generate hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    // save user to DB
    await user.save();

    // create default shifts settings to new user

    const { _id } = await User.findOne({ email });
    if (_id) {
        const shift = new Shift({
            userId: _id,
            name: 'Day Shift'
        });
        shift.save();
    } else {
        res.status(500).send('Cant create shifts to unfound user');
    }


    //send login credentials to user after he registers
    const payload = {
        user: {
            id: user.id
        }
    }

    jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
            if (err) throw err;
            res.json({ token, userData: user });
        }
    )

});

module.exports = router;