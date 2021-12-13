const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    isTrueLocation:{type:Boolean,required:true},
    location:{
        lat:{type:Number},
        long:{type:Number},
    },
    postComment:[{type:String}],
    postDate:{type:Date},
    postDescription:{type:String,required:true},
    postImageLink:{type:String,required:true},
    postTitle:{type:String,required:true},
    user:{
        id:{type:String},
        name:{type:String},
    }
});

module.exports = mongoose.model('Post',PostSchema);