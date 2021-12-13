const mongoose = require('mongoose');


const CompanySchema = mongoose.Schema({
    name: String,
    yearOfExperience: Number
});


const ProfessionSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    title:{type:String,required:true},
    yearOfExperience:Number,
    company:[CompanySchema]
});


module.exports = mongoose.model('Profession',ProfessionSchema);
