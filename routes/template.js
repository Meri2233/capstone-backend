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

router.post('/addquestion/:id', uploads1.single('image'), async (req, res) => {
    const { id } = req.params;
    console.log(id)
    const { question, value1, value2, value3, value4, choice1, choice2, choice3, choice4 } = req.body;
    console.log(req.body)
    //let uploadedFile = process.env.BASE_URL + 'uploadimage/' + req.file.filename;
    let op1, op2, op3, op4
    try {
        const existingtemplate = await templateModel.findById(id.substring(1))
        console.log(existingtemplate);
        const newQuestion = new questionModel({
            question: question,
            //imageUrl: uploadedFile,
            templateId: id
        })
        const savedQuestion = await newQuestion.save();
        existingtemplate.questions.push(savedQuestion._id);
        await existingtemplate.save();

        if (!value1 && !value2 && !value3 && !value4) {
            if (choice1 === 'true') {
                op1 = {
                    choice: "True",
                    isCorrect: true
                }
                op2 = {
                    choice: "False",
                    isChorrect: false
                }
            }
            else if (choice2 === "false") {
                op1 = {
                    choice: 'True',
                    isCorrect: false
                }
                op2 = {
                    choice: "False",
                    isCorrect: true
                }
            }
            savedQuestion.choices.push(op1, op2);
        }
        else {
            if (choice1 === "on") {
                op1 = {
                    choice: value1,
                    isCorrect: true
                }
                op2 = {
                    choice: value2,
                    isCorrect: false
                }
                op3 = {
                    choice: value3,
                    isCorrect: false
                }
                op4 = {
                    choice: value4,
                    isCorrect: false
                }
            }
            else if (choice2 === "on") {
                op1 = {
                    choice: value1,
                    isCorrect: false
                }
                op2 = {
                    choice: value2,
                    isCorrect: true
                }
                op3 = {
                    choice: value3,
                    isCorrect: false
                }
                op4 = {
                    choice: value4,
                    isCorrect: false
                }
            }
            else if (choice3 === "on") {
                op1 = {
                    choice: value1,
                    isCorrect: false
                }
                op2 = {
                    choice: value2,
                    isCorrect: false
                }
                op3 = {
                    choice: value3,
                    isCorrect: true
                }
                op4 = {
                    choice: value4,
                    isCorrect: false
                }
            }
            else if (choice4 === "on") {
                op1 = {
                    choice: value1,
                    isCorrect: false
                }
                op2 = {
                    choice: value2,
                    isCorrect: false
                }
                op3 = {
                    choice: value3,
                    isCorrect: false
                }
                op4 = {
                    choice: value4,
                    isCorrect: true
                }
            }
            savedQuestion.choices.push(op1, op2, op3, op4);
        }
        await savedQuestion.save();
        res.status(200).send("Question Added with id:" + savedQuestion._id);
    } 
    catch (e) {
        res.status(501).send(e.message);
    }
})

router.get('/mylist', async (req, res) => {
    const myTemplates = await templateModel.find({ createdBy: req.userInfo.id });
    res.status(200).send(myTemplates);
})

router.get('/detail/:id', async (req, res) => {
    const {id} = req.params
    const myTemplate = await templateModel.findById(id.substring(1));
    res.status(200).send(myTemplate);
})

router.get('/myquestions/:id', async (req, res) => {
    const { id } = req.params;
    const myTemplate = await templateModel.findById(id.substring(1));
    try {
        const questions = myTemplate.questions;
        let list = [];
        for (let i = 0; i < questions.length; i++) {
            let question = await questionModel.findById(questions[i]);
            list.push(question);
        }
        res.status(200).send(list);
    }
    catch (e) {
        res.status(501).send(e.message);
    }
})

module.exports = router
