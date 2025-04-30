const express = require('express');
const User = require('../modules/user');
const route = express.Router(); //Creates an Express router — a mini version of an Express app — used to define routes like POST, GET, etc.
const { body, validationResult } = require('express-validator');
const b = require('bcryptjs');

route.post('/', [
    //Defines a POST request at the root (/). This means when someone sends data to this route, this block of code will execute.
    body('name').isLength({min:6}),
    body('email').isEmail(),
    body('password').isLength({min:6})
    ], async (req, res) => {
        const errors = validationResult(req);
        //Collects any validation errors from the checks above.
        // If there are no errors, it returns: { errors: [] }
        // If there are errors, it returns: { errors: [ { value: '...', msg: '...', param: '...', location: '...' } ] }
        if (!errors.isEmpty()){
            return res.status(500).json({errors: errors.array()});
        }
        try {
            let user = await User.findOne({email: req.body.email});
            console.log(user);
            if (user) {
                return res.status(404).json({error: "user already exists"});
            }
            const salt = await b.genSalt(10);
            const spass = await b.hash(req.body.password, salt);
            console.log(spass);
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: spass
            })
            res.json(user);
        }
        catch (error) {
            console.log(error.massage);
            res.status(600).send("Some Error Occured");
        }
    })

module.exports = route;
