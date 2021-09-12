const mongoose = require('mongoose');
const Posts = require('../models/post-schema');
const createError = require('http-errors');
exports.getAllPosts = async (req, res, next) => {
    try {
        const posts = await Posts.find().populate({path:'createBy comments',select : '-password -__v -hashedSalt',populate:{
            path : 'sendBy',
            select : '-password -__v -hashedSalt'
        }})
        const totalPosts = await Posts.countDocuments({})
        if (!posts) throw createError.NotFound('NO POSTS FOUND')

        res.status(200).json({
            statusCode: 200,
            message: "success",
            data: {
                posts: posts,
                totalPosts: totalPosts
            }
        });
    } catch (error) {
        next(error)
    }
}

exports.createPosts = async (req, res, next) => {
    //if post is empty
    const body = req.body
    if (!body) {
        const error = new Error("Body is Empty");
        error.statusCode = 422;
        return next(error);
    }


    const posts = new Posts({
        _id: new mongoose.Types.ObjectId(),
        message: body.message,
        createBy: req.payload.userId,
        comments: [],
    })

    posts.save()
        .then(data => {
            res.status(200).json({
                statusCode: 200,
                message: "Post Created Successfully",
                data: data
            });
        }).catch(err => {
            next(err)
        });
}
exports.editPosts = async (req, res, next) => {
    if (!req.body) {
        const error = new Error("No Body Found");
        error.statusCode = 422;
        return next(error);
    }

    try {
        const exist = await Posts.findOne({ createBy:req.payload.userId })
        if (!exist) throw createError.Unauthorized('You Are Not Authorised')
        Posts.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, (err, docs) => {

            if (err) {
                res.status(500).json({
                    error: err
                });
            } else {
                docs['message'] = req.body.message
                res.status(200).json({
                    statusCode: 200,
                    message: "Updated Success",
                    data: docs
                });
            }
        })
    } catch (err) {
        next(err);
    }
}

exports.addCommentToPosts = async (req, res, next) => {
    if (!req.body) {
        const error = new Error("No Body Found");
        error.statusCode = 422;
        return next(error);
    }

    try {
        let comment = {
            _id: mongoose.Schema.Types.ObjectId,
            message: req.body.message,
            sendBy: req.payload.userId,
            liked: []
        }

        const post = await Posts.find({ _id: req.params.id })
        post[0].comments.push(comment)
        await Posts.findOneAndUpdate({ _id: req.params.id }, { $set: post[0] }, (err, docs) => {

            if (err) {
                res.status(500).json({
                    error: err
                });
            } else {
                docs.comments.push(req.body.comment)
                res.status(200).json({
                    statusCode: 200,
                    message: "Comment Added",
                    data: post[0]
                });
            }
        })
    } catch (err) {
        next(err);
    }
}

exports.postdelById = async (req, res, next) => {
    try {
        const exist = await Posts.findOne({ createBy:req.payload.userId })
        if (!exist) throw createError.Unauthorized('You Are Not Authorised')
        const post = await Posts.findById(req.params.id);
        if (!post) {
            resourceNotFound(`No Post Found with ID = ${req.params.id}`);
        }
        const deletedPost = await Posts.findByIdAndRemove(req.params.id);

        res.status(200).json({
            statusCode: 200,
            message: "Post Deleted Successfully",
            data: deletedPost
        });
    } catch (err) {
        next(err);
    }
}
