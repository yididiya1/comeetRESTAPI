const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 
const checkAuth = require("../middleware/check-auth");

const User = require("../models/User");


//getUserById
router.get("/:userId",checkAuth ,(req,res,next) =>{
    const id = req.params.userId;
    User.findById(id)
    .exec()
    .then(user => {
        if(user){
            res.status(200).json(user);
        }else{
            res.status(404).json({message:"User Not Found with the given ID"});
        }
        
    })
    .catch(err =>{
        res.status(500).json({error:err});
    })
})


//getAllUser
router.get("/",checkAuth,(req,res,next) =>{
    User.find()
    .exec()
    .then(users =>{
        res.status(200).json(users);
    })
    .catch(err =>{
        res.status(501).json({error:err});
    })
})


//editUser
router.patch("/:userId", checkAuth,(req,res,next) =>{
    const id = req.params.userId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    User.updateOne({ _id :id} ,{$set : updateOps})
    .exec()
    .then(result =>{
        res.status(200).json(result);
    })
    .catch(err =>{
        res.status(500).json({error:err});
    })
})


//signUp
router.post("/signup", (req,res,next) => {
   User.find({"profile.email":req.body.profile.email})
   .exec()
   .then(user =>{
       if(user.length >= 1){
           return res.status(409).json({
               message:'Mail exists'
           });
       }else{
        bcrypt.hash(req.body.profile.password, 10 , (err,hash) =>{
            if(err){
                return res.status(500).json({
                    error:err
                });
            }else{
             const user = new User({
                 _id: new mongoose.Types.ObjectId(),
                 profile:{
                    email:req.body.profile.email,
                    fullname:req.body.profile.fullname,
                    password:hash,
                 },
                 location:{
                      lat:req.body.location.lat,
                      long:req.body.location.long
                 }
             });
             user
               .save()
               .then(result => {
                 console.log(result);
                 res.status(201).json({
                     message:'User created'
                 });
               }) 
               .catch(err =>{
                   console.log(err);
                   res.status(500).json({
                       error:err.message
                   });
               })
            }
        }) 
       }
   })
});


//login
router.post("/login",(req,res,next) =>{
    const email = req.body.email;
    User.find({"profile.email":email})
    .exec()
    .then(user =>{
        if(user.length < 1){
            return res.status(401).json({
                message:'Mail not found, user doesn\'t exist(Auth failed)'
            });
        }
        bcrypt.compare(req.body.password, user[0].profile.password, (err,result) =>{
            if(err){
                return res.status(401).json({
                    message:'Auth failed'
                });
            }
            if(result){
                const token = jwt.sign({
                    email:user[0].profile.email,
                    fullname:user[0].profile.fullname,
                    userId:user[0]._id
                },
                process.env.JWT_KEY,
                {
                    expiresIn:"10h"
                }
                )
                return res.status(200).json({
                    message:'Auth successful',
                    token:token
                });
            }
            res.status(401).json({
                message:'Auth failed'
            });
        });

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});


//deleteUser
router.delete("/:userId",checkAuth,(req,res,next) =>{
    if(req.params.userId == req.userData.userId){
    User.findByIdAndDelete({_id:req.params.userId})
    .exec()
    .then(result => {
        if(result){
            res.status(200).json({
                message:"User deleted"
            });
        }else{
            res.status(404).json({
                "message":"User Doesn't Exist"
            });
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
    }else{
        res.status(500).json({
            "message":"Cant delete others account"
        })
    }
});


//filterUser
router.get("/user/:username",checkAuth,(req,res,next)=> {
    username = req.params.username;
    User.find({"profile.fullname":username})
    .exec()
    .then(result => {
        if(result){
            res.status(200).json({
                result
            });
        }else{
            res.status(404).json({"message":"No User Found!"});
        }
    })
    .catch(err => {
        res.status(500).json({error:err});
    })
})

//getUserByLocation
router.get("/location/:lat/:long",checkAuth,(req,res,next) =>{
    lat = req.params.lat;
    long = req.params.long ;
    //console.log(lat,long);
    x1 = lat - 5.0;
    x2 = x1 + 10.0;
    y1 = long - 5.0;
    y2 = y1 + 10.0;
    //console.log(x1,x2);
    //console.log(y1,y2);
    User.find({"location.lat":{$gt:x1,$lt:x2},"location.long":{$gt:y1,$lt:y2}})
    .exec()
    .then(result => {
        if(result){
            res.status(200).json(result);
        }else{
            res.status(404).json(result);
        }
    })
    .catch(err => {
        res.status(500).json({error:err});
    })
})




module.exports = router;