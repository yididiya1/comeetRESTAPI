
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @Desc        Get all posts
// @route       Get /api/v1/posts
// @access      Public
exports.getPosts = asyncHandler(async (req, res, next) => {
        const posts = await Bootcamp.find();
        res.status(200).json({success: true, count: posts.length ,data : posts});
});

// @Desc        Get single post
// @route       Get /api/v1/posts/:id
// @access      Public
exports.getPost = asyncHandler(async (req, res, next) => {
    
        const post = await Bootcamp.findById(req.params.id);
        if(!post){
            return new ErrorResponse(`Post not found with id of ${req.params.id}`, 404);
        }
        res.status(200).json({success: true, data: bootcamp});
    
});

// @Desc        Create new posts
// @route       POST /api/v1/posts
// @access      Private
exports.createPost = asyncHandler(async (req, res, next) => {

    
        const post = await Bootcamp.create(req.body);

        res.status(201).json({
            success: true,
            data: post
        });
});

// @Desc        Update new post
// @route       PUT /api/v1/posts/:id
// @access      Private
exports.updatePost = asyncHandler(async (req, res, next) => {
        const post = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if(!post) {
            return ErrorResponse(`Post not found with id of ${req.params.id}`, 404);
        }
        res.status(200).json({success: true,data: bootcamp});

    
});

// @Desc        Delete new post
// @route       DELETE /api/v1/posts/:id
// @access      Private
exports.deletePost = asyncHandler(async (req, res, next) => {
        const post = await Bootcamp.findOneAndDelete(req.params.id);

        if(!post) {
            return ErrorResponse(`Post not found with id of ${req.params.id}`, 404);
        }
        res.status(200).json({success: true,data: {}});

});