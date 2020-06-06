const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
// models
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

module.exports = router;