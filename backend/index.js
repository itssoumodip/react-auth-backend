const express = require('express');
const connectToMongodb = require('./db');
const User = require('./modules/user');
const {body, validationResult} = require('express-validator');
const b = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwt_str = 'React JS';
const ejs = require('ejs');
require('dotenv').config();

connectToMongodb();
const app = express();
const port = process.env.PORT || 9999; 

app.use (cors({origin: 'http://localhost:3000'})); 

app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}))
app.use('/api/auth', require('./routes/auth'));


app.post('/register', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(500).json({errors: errors.array()});
    try {
        let user = await User.findOne({email: req.body.email});
        if (user)
            return res.status(400).json({error: "User Already Exists"});
        const salt = await b.genSalt(10);
        const spass = await b.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: spass
        });
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, jwt_str);
        // res.json(authtoken);
        res.status(200).json({x: "User Created Successfully"});
        // res.json(user)  

        
    }
    catch (error) {
        console.error(error);
        res.status(404).send("Some Error Occured !!");
    }
})

// app.get('/', (req, res) => {
//     res.send('Hello World');
// })

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})

app.post('/login', 
    [
        body('email', 'Enter a Valid Email Address').isEmail(),
        body('password', 'Password cannot be Empty').exists(),
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({errors: errors.array()}); // 400 Bad Request

        const {email, password} = req.body;
        try {
            let user = await User.findOne({email:email});
            if (!user)
                return res.status(404).json({message: "notExists"}); // 404 Not Found

            const passcom = await b.compare(password, user.password);
            if (!passcom) 
                return res.status(401).json({message: "Password Missmatch"}); // 401 Unauthorized
            
            const data = {
                user: {
                    id: user.id
                }
            }
            const authtoken = jwt.sign(data, jwt_str);
            res.status(200).json({message: "success"}); // Changed to 200 (OK)
        }
        catch (error) {
            console.error(error);
            res.status(500).json({message: "failed"}); // 500 Internal Server Error
        }
    }
)

app.get("/fetch-details", 
    async (req, res) => {
        try{
            const allUser = await User.find({}); 
            res.status(200).json({data:allUser}) // First response
        }
        catch (error) {
            console.log(error)
        }
    }
)

app.post("/update-user", 
    async (req, res) => {
        const {id, name, email, password} = req.body;
        let update = {};
        if (name && name!=="")
            update.name = name;
        if (email && email!=="")
            update.email = email;
        if (password && password!=="") {
            const salt = await b.genSalt(10);
            const spass = await b.hash(password, salt);
            update.password = spass;
        }
        console.log(id);
        try {
            const demo = await User.updateOne({_id: id},{$set:update});
            console.log("Success");
            res.status(200).json({message: "updated"});
        }
        catch (error) {
            console.log(error);
            res.status(404).send("Some Error Occured");
        }
    }
)

app.post("/delete-user",
    async (req, res) => {
        const {id} = req.body;
        try {
            const delUser = await User.findOne({_id: id});
            console.log(delUser);
            const demo = await User.deleteOne({_id: id});
            console.log(demo);
            if (demo) {
                console.log("Deleted");
                res.status(200).json({message: "User Deleted Successfully"});
            } else {
                console.log("Not Deleted");
                res.status(404).json({message: "User Deleted Unsuccessfully!!"});
            }
            
        }
        catch (error) {
            console.log(error);
            res.status(404).send("Some Error Occured");
        }
    }
)

app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    
    try {
        const oldUser = await User.findOne({ email });
        if (!oldUser) {
            return res.status(404).json({ message: "user not found" });
        }
        
        const secret = jwt_str + oldUser.password;
        const token = jwt.sign(
            { email: oldUser.email, id: oldUser._id }, 
            secret, 
            { expiresIn: '5m' }
        );
    
        const link = `http://localhost:${port}/reset-password/${oldUser._id}/${token}`;
        console.log("Reset link generated:", link);
        
        // In a production app, you would send an email here
        
        res.status(200).json({ 
            message: "update", 
            info: "Password reset link generated successfully" 
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
})

app.get("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    console.log(req.params);
    
    // Verify the user exists
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
        return res.status(404).send("User not found");
    }
    
    // Redirect to React frontend instead of rendering EJS template
    res.redirect(`http://localhost:3000/reset-password/${id}/${token}`);
});

app.post("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;
    
    try {
        const oldUser = await User.findOne({ _id: id });
        if (!oldUser) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const secret = jwt_str + oldUser.password;
        const verify = jwt.verify(token, secret);
        
        const encryptedPassword = await b.hash(password, 10);
        await User.updateOne({ _id: id }, { $set: { password: encryptedPassword } });
        
        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Invalid or expired token" });
    }
});