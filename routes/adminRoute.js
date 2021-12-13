const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const Admin = require('../models/Admin');
const checkAuth = require('../middleware/check-auth');
const checkRole = require('../middleware/check-role');


//getAdminById
router.get('/:adminId',checkAuth,(req,res,next) => {
    const id = req.params.adminId;
    Admin.findById(id)
    .exec()
    .then(admin => {
        if(admin){
            res.status(200).json(admin);
        }else{
            res.status(404).json({message:"Admin Not Found with the given ID"});
        }
        
    })
    .catch(err =>{
        res.status(500).json({error:err});
    })
});

//getAllAdmin
router.get("/",checkAuth,(req,res,next) =>{
    Admin.find()
    .exec()
    .then(admins =>{
        res.status(200).json(admins);
    })
    .catch(err =>{
        res.status(501).json({error:err});
    })
})


//editAdmin
router.patch("/:adminId",checkAuth, (req,res,next) =>{
    const id = req.params.adminId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Admin.updateOne({ _id :id} ,{$set : updateOps})
    .exec()
    .then(result =>{
        res.status(200).json(result);
    })
    .catch(err =>{
        res.status(500).json({error:err});
    })
})

//signupAdmin
router.post("/signup", (req,res,next) => {
    Admin.find({"profile.email":req.body.profile.email})
    .exec()
    .then(admin =>{
        if(admin.length >= 1){
            return res.status(409).json({
                message:'Mail exists'
            });
        }else{
         console.log(admin.length);
         bcrypt.hash(req.body.profile.password, 10 , (err,hash) =>{
             if(err){
                 return res.status(500).json({
                     error:err
                 });
             }else{
              const admin = new Admin({
                  _id: new mongoose.Types.ObjectId(),
                  profile:{
                     email:req.body.profile.email,
                     fullname:req.body.profile.fullname,
                     password:hash,
                  },
                  role:req.body.role
                  //  location:{
                 //      lat:req.body.location.lat,
                 //      long:req.body.location.long
                 //  }
              });
              admin
                .save()
                .then(result => {
                  console.log(result);
                  res.status(201).json({
                      message:'Admin created'
                  });
                }) 
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error:err
                    });
                })
             }
         }) 
        }
    })
 });
 
 
 //loginAdmin
 router.post("/login",(req,res,next) =>{
     Admin.find({"profile.email":req.body.profile.email})
     .exec()
     .then(admin =>{
         if(admin.length < 1){
             return res.status(401).json({
                 message:'Mail not found, admin doesn\'t exist(Auth failed)'
             });
         }
         bcrypt.compare(req.body.profile.password, admin[0].profile.password, (err,result) =>{
             if(err){
                 return res.status(401).json({
                     message:'Auth failed'
                 });
             }
             if(result){
                 const token = jwt.sign({
                     email:admin[0].profile.email,
                     fullname:admin[0].profile.fullname,
                     adminId:admin[0]._id,
                     role:admin[0].role

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
                 message:'Auth failed ( all failed)'
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
 

 //deleteAdmin
 router.delete("/:adminId",checkAuth,checkRole,(req,res,next) =>{
     Admin.findByIdAndDelete({_id:req.params.adminId})
     .exec()
     .then(result => {
         if(result){
             res.status(200).json({
                 message:"Admin deleted"
             });
         }else{
             res.status(404).json({
                 "message":"Admin Doesn't Exist"
             });
         }
     })
     .catch(err =>{
         console.log(err);
         res.status(500).json({
             error:err
         });
     });
 });
 
 
 
 
 module.exports = router;






