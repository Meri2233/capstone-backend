const express = require('express');
const router = express.Router();
const reportModel = require('../models/report.model');

router.post('/add', async (req, res) => {
    const { title, students, scores, winner } = req.body;

    const newReport = new reportModel({
        title: title,
        students: students,
        scores: scores,
        winner: winner,
        createdBy: req.userInfo.id
    })
    try {
        const savedReport = await newReport.save();
        res.status(200).send("Added new Report with id: " + savedReport._id);
    }
    catch (e) {
        res.status(501).send(e.message);
    }
})

router.get('/list', async (req, res) => {
    const myReports = await reportModel.find({ createdBy: req.userInfo.id });
    res.status(200).send(myReports);
})

module.exports = router;
