const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require('../middleware/check-auth');


const Profession = require('../models/Profession');




//getAllProfessions
router.get('/',checkAuth,(req,res,next) => {
    Profession.find()
    .exec()
    .then(professions => {
        res.status(200).json(professions);
    })
    .catch(err =>{
        res.status(501).json({error:err});
    })
})


//getProfessionById
router.get('/:professionId',checkAuth, (req,res,next) => {
    const id = req.params.professionId;
    Profession.findById(id)
    .exec()
    .then(profession => {
        if(profession){
            res.status(200).json(profession);
        }else{
            res.status(404).json({message:"Profession Not Found with the given ID"});
        }
        
    })
    .catch(err =>{
        res.status(500).json({error:err});
    })
})

//deleteProfession
router.delete('/:professionId', checkAuth,(req,res,next) => {
    Profession.findByIdAndDelete({_id:req.params.professionId})
    .exec()
    .then(result => {
        if(result){
            res.status(200).json({
                message:"Profession deleted"
            });
        }else{
            res.status(404).json({
                "message":"Profession Doesn't Exist"
            });
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
})

//editProfession
router.patch('/:professionId', checkAuth,(req,res,next) => {
    const id = req.params.professionId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Profession.updateOne({ _id :id} ,{$set : updateOps})
    .exec()
    .then(result =>{
        res.status(200).json(result);
    })
    .catch(err =>{
        res.status(500).json({error:err});
    })
})


//createProfession
router.post('/',checkAuth,(req,res,next) => {

    const updateOps = [];
    for (const company of req.body.company){
        updateOps.push(company);
    }

    const profession = new Profession({
        _id : new  mongoose.Types.ObjectId(),
        title:req.body.title,
        yearOfExperience:req.body.yearOfExperience,
        company:updateOps
    });

    profession.save()
    .then(result =>{
        res.status(200).json({result});
    })
    .catch(err => {
        res.status(500).json({error:err});
    })
})


//getProfessionByLocation
//filterProfessionByLocation 
//filterProfessionByType


module.exports = router;