const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const checkAuth = require("../middleware/check-auth");

const Post = require("../models/Post");


//createPost
router.post("/",checkAuth,(req,res,next) =>{
    const post = new Post({
        _id : new  mongoose.Types.ObjectId(),
        isTrueLocation:req.body.isTrueLocation,
        postDate:new Date().toISOString().split('T')[0],
        postDescription:req.body.postDescription,
        postImageLink:req.body.postImageLink,
        postTitle:req.body.postTitle,
        user:{
            id:req.userData.userId,
            name:req.userData.fullname
        },
        location:{
            lat:req.body.location.lat,
            long:req.body.location.long
        }
    });

    post
    .save()
    .then(result =>{
        res.status(200).json({result});
    })
    .catch(err => {
        res.status(500).json({error:err});
    })


});

//getAllPost
router.get("/", checkAuth,(req,res,next) =>{
    Post.find()
    .exec()
    .then(posts =>{
        res.status(200).json(posts);
    })
    .catch(err => {
        res.status(500).json({error:err});
    })
})


//editPost
router.patch("/:postId", checkAuth,(req,res,next) =>{
    const id = req.params.postId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Post.updateOne({ _id :id} ,{$set : updateOps})
    .exec()
    .then(result =>{
        res.status(200).json(result);
    })
    .catch(err =>{
        res.status(500).json({error:err});
    })
})


//getPostById
router.get("/:postId",checkAuth, (req,res,next) =>{
    const postId = req.params.postId;
    Post.findById(postId)
    .exec()
    .then(user =>{
        if(user){
            res.status(200).json(user);
        }else{
            res.status(404).json(user);
        }
    })
    .catch(err =>{
        res.status(500).json({error:err});
    })
})


//deletePost
router.delete("/:postId",checkAuth, (req,res,next) =>{
    //const postId = req.params.postId;
    
    Post.findByIdAndDelete({_id:req.params.postId})
    .exec()
    .then(result => {
        //console.log(result);
        if(result){
            res.status(200).json({
                "message":"Post Successfully deleted !"
            });
           
        }
        else{
            res.status(404).json({"message":"Post Not Found"}); 
        }
       
    })
    .catch(err => {
        res.status(500).json({error:err});
    })
})


//filterPostByDate
router.get("/date/:date", checkAuth,(req,res,next)=>{
    dateParam = req.params.date;
    var date = new Date(dateParam);
    Post.find({"postDate":date})
    .exec()
    .then(result => {
        if(result){
            res.status(200).json({
                result
            });
        }else{
            res.status(404).json({"message":"No Posts Found!"});
        }
    })
    .catch(err => {
        res.status(500).json({error:err});
    }) 
})

//filterPostByUsername
router.get("/users/:username",checkAuth,(req,res,next)=>{
    username = req.params.username;
    Post.find({"user.name":username})
    .exec()
    .then(result => {
        if(result){
            res.status(200).json({
                result
            });
        }else{
            res.status(404).json({"message":"No Posts Found!"});
        }
    })
    .catch(err => {
        res.status(500).json({error:err});
    })
})


//getPostByLocation
router.get("/:lat/:long",checkAuth,(req,res,next)=>{
    lat = req.params.lat;
    long = req.params.long ;
    //console.log(lat,long);
    x1 = lat - 5.0;
    x2 = x1 + 10.0;
    y1 = long - 5.0;
    y2 = y1 + 10.0;
    //console.log(x1,x2);
    //console.log(y1,y2);
    Post.find({"location.lat":{$gt:x1,$lt:x2},"location.long":{$gt:y1,$lt:y2}})
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
// const { getPost,
//     getPosts,
//     createPost,
//     updatePost,
//     deletePost
//   } = require('../controllers/postsController');

// const postrouter = express.Router();

// router
//     .route('/')
//     .get(getPosts)
//     .post(createPost);

// router
//     .route('/:id')
//     .get(getPost)
//     .put(updatePost)
//     .delete(deletePost);

///// module.exports = postroutewwr