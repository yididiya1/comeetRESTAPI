const mongoose = require('mongoose');


const adminSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    profile:{
        email:{type:String,required:true},
        fullname:{type:String,required:true},
        password:{type:String,required:true},
        photoLink:{type:String}
    },
    role:{type:String,required:true}
});


module.exports = mongoose.model('Admin',adminSchema);

