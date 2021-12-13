const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
   
   
    location:{
        lat:{type:Number},
        long:{type:Number}
    },
    profile:{
        email:{
            type:String,
            required:true,
            unique:true,
            match :/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        },
        photoLink:{type:String},
        fullname:{type:String,required:true},
        password:{type:String},
    },
    measurementUnit:{type:String},
    profession:{type:String},
    locationRange:{type:Number}
    
});

module.exports = mongoose.model('User',userSchema);