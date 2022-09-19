const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const teacherModel = require('../models/teacher.model');
const jwt = require('jsonwebtoken');


router.post('/signup', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).send("All Fields Are Required");
    }
    if (password !== confirmPassword) {
        return res.status(400).send("Password doesnot match");
    }
    const exitingTeacher = await teacherModel.findOne({ email: email });

    if (exitingTeacher !== null) {
        return res.status(400).send("Email Already Exists. Please Login instead")
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newTeacher = new teacherModel({
        name: name,
        email: email,
        password: hash
    })
    try {
        const savedTeacher = await newTeacher.save();
        res.status(200).send("Added new Teacher with id: " + savedTeacher._id);
    }
    catch (e) {
        res.status(501).send(e.message);
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send("All Fields required");
    }
    const existingTeacher = await teacherModel.findOne({ email: email });
    if (existingTeacher === null) {
        return res.status(400).send("Teacher doesnot exists");
    }
    if (!bcrypt.compareSync(password, existingTeacher.password)) {
        return res.status(400).send("Incorrect Pasword");
    }
    else {
        const payload = {
            id: existingTeacher.id,
            email: existingTeacher.email
        }
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
        return res.status(200).json({ accessToken, refreshToken });
    }
})

router.post('/token', (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).send("Please provide refresh token");
    }
    try {
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);       
        delete payload.exp;
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
        res.status(200).json({ accessToken });
    }   
    catch (e) {
        res.status(501).send(e.message); 
    }
})

module.exports = router;    