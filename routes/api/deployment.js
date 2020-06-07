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

            //search for deployment to update, if not found create new
            // let deployment = await Deployment.findOne({ userId, deployDate, shiftId });
            // if (deployment) {
            //     deployment.employees.push(employee);
            //     await Deployment.findByIdAndUpdate(deployment._id, deployment);
            //     res.send({ status: 200, msg: 'sss' });
            // } else {
            //     let newDeployment = new Deployment({
            //         userId,
            //         deployDate,
            //         shiftId,
            //         employees: [employee]
            //     });
            //     await newDeployment.save();
            //     res.send({ status: 200 });
            // }

            let newDeployment = new Deployment({
                userId,
                deployDate,
                shiftId,
                employee
            });
            await newDeployment.save();
            res.send({ status: 200, data: newDeployment });

        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server error');
        }
    });


// @route  GET api/deployment
// @desc   Create/update deployments of employees
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
            // //fetch all required deployments
            // let deployments = await Deployment.find({ userId, deployDate: { "$gte": startDate, "$lt": endDate } }).select(['-date', '-__v']);
            // //fetch all employees data from deployments to send to the client
            // deployments = await Promise.all(deployments.map(async (deploy) => {

            //     const promises = deploy.employees.map(async (_id) => {
            //         let newEmployeeObject = await Employee.findById({ _id }).select(['-date', '-__v']);
            //         return newEmployeeObject;
            //     });

            //     return {
            //         ...deploy.toObject(),
            //         employees: await Promise.all(promises)
            //     }
            // }));

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

module.exports = router;