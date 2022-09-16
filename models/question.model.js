const mongoose = require('mongoose')

const questionSchema = mongoose.Schema({
    question: {
        type: String,
        require: true
    },
    choices: [{ choice: { type: String }, isCorrect: { type: Boolean } }],
    imageUrl: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    templateId:{
        type:mongoose.Types.ObjectId
    }
})

const questionModel = mongoose.model('Question', questionSchema);
module.exports = questionModel; 