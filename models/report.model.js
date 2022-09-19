const mongoose = require('mongoose')

const reportSchema = mongoose.Schema({
    title: {
        type: String,
    },
    students:{type:String},
    scores:[{type:mongoose.Schema.Types.Array}],
    createdBy:{
        type:String,
        require:true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const reportModel = mongoose.model('Report', reportSchema);
module.exports = reportModel; 