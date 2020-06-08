const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
// models
const User = require('../../models/User');
const Employee = require('../../models/Employee');

// @route  POST api/employees
// @desc   Add employee
// @access Private

router.post('/', [
    auth,
    check('userId', 'userId is required').not().isEmpty(),
    check('fullName', 'Name is required').not().isEmpty()
], async (req, res) => {

    //check for errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, fullName, phone, title } = req.body;

    //See if employee exists
    try {
        let employee = await Employee.findOne({ fullName });
        if (employee) {
            return res.status(400).json({ errors: [{ param: 'fullName', msg: 'Employee already exists' }] });
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
    res.send({ status: 200 });

});


// @route  GET api/employees/getEmployees
// @desc   get employees list
// @access Private

router.get('/getEmployees', [
    auth
], async (req, res) => {

    //check for errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { skip, limit, userId } = req.query;

    try {
        let user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({ errors: [{ param: '', msg: 'User not Found' }] });
        }

        let employees = await Employee.find({ userId }).skip(Number(skip)).limit(Number(limit));
        res.send({ status: 200, data: employees });
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }

});

module.exports = router;


// @route  GET api/employees/autoComplete
// @desc   get employees name list for auto complete
// @access Private

router.get('/autoComplete', [
    auth
], async (req, res) => {

    //check for errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { searchQuery, userId } = req.query;

    try {
        let user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({ errors: [{ param: '', msg: 'User not Found' }] });
        }

        let employees = await Employee.find({ userId, 'fullName': { $regex: `.*${searchQuery}.*`, '$options': 'i' } })
            .limit(5)
            .select(['-_id', 'fullName']);

        employees = employees.map(employee => employee.fullName);

        res.send({ status: 200, data: employees });
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }

});


// @route  GET api/employees/getByName
// @desc   get employees list by name
// @access Private

router.get('/getByName', [
    auth
], async (req, res) => {

    //check for errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { searchQuery, userId } = req.query;

    try {
        let user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({ errors: [{ param: '', msg: 'User not Found' }] });
        }

        let employees = await Employee.find({ userId, 'fullName': { $regex: `.*${searchQuery}.*`, '$options': 'i' } })
            .select(['-date', '-__v']);
        res.send({ status: 200, data: employees });
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }

});

module.exports = router;