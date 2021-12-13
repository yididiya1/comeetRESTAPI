const mongoose = require('mongoose');


const AppAdsSchema = new mongoose.Schema({
    coFeedPackage:{type:Number,required:true},
    createdDate:{type:Date,required:true},
    expiryDate:{type:Date,required:true},
    imageLink:{type:String},
    isCoFeed :{type:Boolean,required:true},
    isProfession:{type:Boolean,required:true},
    location:{
        lat:Number,
        long:Number
    },
    locationName:{type:String},
    professionPackage:{type:String,required:true},
    updatedDate:{type:Date,required:true},
    userId:{type:String}
});


module.exports = mongoose.model('AppAds',AppAdsSchema);

