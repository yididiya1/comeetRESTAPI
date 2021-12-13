const mongoose = require('mongoose');


const PackageSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    packageDuration:{type:Number,required:true},
    packageName:{type:String,required:true}
});


module.exports = mongoose.model('Package',PackageSchema);