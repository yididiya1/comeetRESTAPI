const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");


const Package = require('../models/Package');
const checkAuth = require('../middleware/check-auth');


//getAllPackage
router.get('/',checkAuth,(req,res,next) => {
    Package.find()
    .exec()
    .then(packages => {
        res.status(200).json(packages);
    })
    .catch(err =>{
        res.status(501).json({error:err});
    })
})


//getPackageById
router.get('/:packageId',checkAuth, (req,res,next) => {
    const id = req.params.packageId;
    Package.findById(id)
    .exec()
    .then(package => {
        if(package){
            res.status(200).json(package);
        }else{
            res.status(404).json({message:"Package Not Found with the given ID"});
        }
        
    })
    .catch(err =>{
        res.status(500).json({error:err});
    })
})

//deletePackage
router.delete('/:packageId',checkAuth, (req,res,next) => {
    Package.findByIdAndDelete({_id:req.params.packageId})
    .exec()
    .then(result => {
        if(result){
            res.status(200).json({
                message:"Package deleted"
            });
        }else{
            res.status(404).json({
                "message":"Package Doesn't Exist"
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

//editPackage
router.patch('/:packageId',checkAuth, (req,res,next) => {
    const id = req.params.packageId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Package.updateOne({ _id :id} ,{$set : updateOps})
    .exec()
    .then(result =>{
        res.status(200).json(result);
    })
    .catch(err =>{
        res.status(500).json({error:err});
    })
})





//createPackage
router.post('/',checkAuth,(req,res,next) => {
    const package = new Package({
        _id : new  mongoose.Types.ObjectId(),
        packageDuration:req.body.packageDuration,
        packageName:req.body.packageName
    });

    package.save()
    .then(result =>{
        res.status(200).json({result});
    })
    .catch(err => {
        res.status(500).json({error:err});
    })
})

module.exports = router;