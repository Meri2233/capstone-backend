const mongoose = require('mongoose');

const teacherSchema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    templates:[{type:mongoose.Types.ObjectId}], 
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAT:{
        type:Date,
        default:Date.now
    }
})

const teacherModel = mongoose.model('Teachers',teacherSchema);
module.exports = teacherModel;