const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");


const AppAds = require('../models/appAds');
const checkAuth = require('../middleware/check-auth');


//create
router.post("/",checkAuth,(req,res,next) =>{
    
    var date = new Date();
    const appAds = new AppAds({
        coFeedPackage:req.body.coFeedPackage,
        createdDate:new Date(),
        expiryDate:date.setDate(date.getDate() + 4),
        imageLink:req.body.imageLink,
        isCoFeed:req.body.isCoFeed,
        isProfession:req.body.isProfession,
        location:{
            lat:req.body.location.lat,
            long:req.body.location.long
        },
        professionPackage:req.body.professionPackage,
        updatedDate:new Date(),
        userId:req.userData.userId
    });

    appAds
    .save()
    .then(result =>{
        res.status(200).json({result});
    })
    .catch(err => {
        res.status(500).json({error:err});
    })


});




//edit
router.patch("/:appAdId",checkAuth, (req,res,next) =>{
    const id = req.params.appAdId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    AppAds.updateOne({ _id :id} ,{$set : updateOps})
    .exec()
    .then(result =>{
        res.status(200).json(result);
    })
    .catch(err =>{
        res.status(500).json({error:err});
    })
})


//getAll
router.get("/", checkAuth, (req,res,next) =>{
    AppAds.find()
    .exec()
    .then(posts =>{
        res.status(200).json(posts);
    })
    .catch(err => {
        res.status(500).json({error:err});
    })
})


//getByUserId
router.get("/:userId",checkAuth, (req,res,next) =>{
    const userID = req.params.userId;
    AppAds.find({userId:userID})
    .exec()
    .then(appAd =>{
        if(appAd){
            res.status(200).json(appAd);
        }else{
            res.status(404).json(appAd);
        }
    })
    .catch(err =>{
        res.status(500).json({error:err});
    })
})


//deleteSpecific
router.delete("/:userId",checkAuth, (req,res,next) =>{
    //const postId = req.params.postId;
    AppAds.findByIdAndDelete({_id:req.params.userId})
    .exec()
    .then(result => {
        //console.log(result);
        if(result){
            res.status(200).json({
                "message":"AppAd Successfully deleted !"
            });
           
        }
        else{
            res.status(404).json({"message":"AppAd Not Found"}); 
        }
       
    })
    .catch(err => {
        res.status(500).json({error:err});
    })
})

//deleteExpired





//

module.exports = router;