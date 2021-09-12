const mongoose = require('mongoose');
const User = require('../models/user-schema');
const createError = require('http-errors');
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password -__v');
        if (!users) throw createError.NotFound('NO USER FOUND')

        res.status(200).json({
            statusCode: 200,
            message: "success",
            data: {
                user: users
            }
        });
    } catch (error) {
        next(error)
    }
}

exports.editUser = (req, res, next) => {
    if (!req.body) {
        const error = new Error("No Body Found");
        error.statusCode = 422;
        return next(error);
    }
    try {
        User.findOneAndUpdate({ _id: req.payload.userId }, { $set: req.body }, (err, docs) => {
            if (err) {
                res.status(500).json({
                    error: err
                });
            } else {    
                docs['email'] = req.body.email
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

exports.userdelById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            resourceNotFound(`No User Found with ID = ${req.params.id}`);
        }
        const deletedUser = await User.findByIdAndRemove(req.params.id);

        res.status(200).json({
            statusCode: 200,
            message: "User Deleted Successfully",
            data: deletedUser
        });
    } catch (err) {
        next(err);
    }
}