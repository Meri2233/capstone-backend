const express = require('express');
const router = express.Router();
const templateModel = require('../models/template.model');
const questionModel = require('../models/question.model');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploadicon')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
})

const storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploadimage')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
})

//const uploads = multer({ storage: storage });
const uploads1 = multer({ storage: storage2 });

router.post('/createnew', async (req, res) => {
    const { title, description } = req.body;
    //let uploadedFile = process.env.BASE_URL + '/uploadicon' + req.file.filename;

    if (!title) {
        res.status(400).send("Provide title to template");
    }
    if (!description) {
        return res.status(400).send("Provide description to template")
    }

    const newTemplate = new templateModel({
        title: title,
        description: description,
        createdBy: req.userInfo.id,
        //iconUrl: uploadedFile 
    })

    try {
        const savedTemplate = await newTemplate.save();
        res.status(200).send("Template Created with id" + savedTemplate._id);
    }
    catch (e) {
        res.status(501).send(e.message)
    }
})

router.post('/createnew/addquestion/:id', uploads1.single('image'), async(req, res) => {
    const { id } = req.params;
    const { question, option1, option2, option3, option4 } = req.body;
    let uploadedFile = process.env.BASE_URL + '/uploadimage' + req.file.filename;

    if (!question || !option1 || !option2) { 
        res.status(400).send("Provide question and options")
    }
    const op1 ={
        choice:option1,
        isCorrect:true
    }
    const op2 ={
        choice:option2,
        isCorrect:false
    }
    const op3 ={
        choice:option3,
        isCorrect:false
    }
    const op4 ={
        choice:option4,
        isCorrect:false
    }
    const existingtemplate = await templateModel.findById(id)
    console.log(existingtemplate); 
    const newQuestion = new questionModel({
        question:question,
        imageUrl:uploadedFile,
        templateId: id
    })
    const savedQuestion = await newQuestion.save();
    existingtemplate.questions.push(savedQuestion._id);
    await savedQuestion.save();
    savedQuestion.choices.push(op1,op2,op3,op4);
    await savedQuestion.save();
})

module.exports = router