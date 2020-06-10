const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
// models
const User = require('../../models/User');
const Employee = require('../../models/Employee');
const Deployment = require('../../models/Deployment');

// @route  POST api/deployment
// @desc   Create/update deployments of employees
// @access Private

router.post('/', [
    auth,
    check('userId', 'Missing userId').not().isEmpty(),
    check('deployDate', 'Missing deployment date').not().isEmpty(),
    check('shiftId', 'Missing shift Id').not().isEmpty()
],
    async (req, res) => {
        //check for errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId, deployDate, shiftId, employee } = req.body;

        //See if users exists
        try {
            let user = await User.findOne({ _id: userId });
            if (!user) {
                return res.status(400).json({ errors: [{ param: '', msg: 'User not Found' }] });
            }

            let newDeployment = new Deployment({
                userId,
                deployDate,
                shiftId,
                employee
            });

            await newDeployment.save();

            //fetch employee data from deployment to send to the client
            let employeeData = await Employee.findById({ _id: employee }).select(['-date', '-__v']);

            res.send({ status: 200, data: { ...newDeployment.toObject(), employee: employeeData } });

        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server error');
        }
    });


// @route  GET api/deployment/getDeployments
// @desc   Create deployments of employees
// @access Private

router.get('/getDeployments', [
    auth,
    check('userId', 'Missing userId').not().isEmpty(),
    check('startDate', 'Missing start date').not().isEmpty(),
    check('endDate', 'Missing end date').not().isEmpty()
],
    async (req, res) => {
        //check for errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId, startDate, endDate } = req.query;

        //See if users exists
        try {
            let user = await User.findOne({ _id: userId });
            if (!user) {
                return res.status(400).json({ errors: [{ param: '', msg: 'User not Found' }] });
            }

            //fetch all required deployments
            let deployments = await Deployment.find({ userId, deployDate: { "$gte": startDate, "$lt": endDate } }).select(['-date', '-__v']);

            //fetch employee data from deployments to send to the client
            deployments = await Promise.all(deployments.map(async (deploy) => {
                const promise = await Employee.findById({ _id: deploy.employee._id }).select(['-date', '-__v']);
                return {
                    ...deploy.toObject(),
                    employee: await promise
                }
            }));

            res.send({ status: 200, data: deployments });
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server error');
        }
    });


// @route  POST api/deployment/redeploy
// @desc   Update deployments of employees
// @access Private

router.post('/redeploy', [
    auth,
    check('_id', 'Missing id of deployment').not().isEmpty(),
    check('deployDate', 'Missing new deploy date').not().isEmpty(),
    check('shiftId', 'Missing shift Id').not().isEmpty()
],
    async (req, res) => {
        //check for errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { _id, deployDate, shiftId } = req.body;

        //See if deployment exists
        try {
            let deployment = await Deployment.findByIdAndUpdate(_id, { shiftId, deployDate });

            if (!deployment) {
                return res.status(400).json({ errors: [{ param: '', msg: 'deployment not Found' }] });
            }

            //fetch employee data from deployment to send to the client
            let employeeData = await Employee.findById({ _id: deployment.employee }).select(['-date', '-__v']);
            res.send({ status: 200, data: { ...deployment.toObject(), employee: employeeData } });

        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server error');
        }
    });

module.exports = router;