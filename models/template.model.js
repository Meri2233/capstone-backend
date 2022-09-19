const mongoose = require('mongoose');

const templateSchema = mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    questions:[{type:String}],
    createdAt:{
        type:Date,
        default:Date.now 
    },
    editedAt:{
        type:Date,
        default:Date.now
    },
    createdBy:{
        type:String,
        require:true
    },
    iconUrl:{
        type:String
    }
})

/*
[
        {
            question: { type: String },
            choices: [{ choice: { type: String }, isCorrect: { type: Boolean } }],
            imageUrl: { type: String },
            addedAt: { type: Date, default: Date.now },
            editedAt: { type: Date, default: Date.now }
        }]
*/
const templateModel = mongoose.model('Templates',templateSchema);
module.exports = templateModel;
