const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const User = require('../models/user-schema');
const createError = require('http-errors');
const { authSchema } = require('../helpers/validation_schema')
const { signAccessToken, } = require('../helpers/jwt_helper');



exports.login = async (req, res, next) => {
  try {
    let result;
    const userobj = {
      email: req.body.email,
      password: req.body.password
    }
    result = await authSchema.validateAsync(userobj)
    console.log(result)
    const user = await User.findOne({ email: result.email })
    const userData = await User.find({ email: result.email })
    if (!user) throw createError.NotFound('USER NOT REGISTERED')  
      const isMatch = await user.isValidPassword(result.password)
      if (!isMatch)
        throw createError.Unauthorized('USERNAME/PASSWORD NOT VALID')
      token(user.id);
  


    async function token(userId) {
      const accessToken = await signAccessToken(userId)
      res.status(200).json({
        statusCode: 200,
        message: "Login Success",
        data: 
          userData[0]
        ,
        tokens: {
          accessToken: accessToken,
        }
      });
    }
  } catch (error) {
    if (error.isJoi === true)
      return next(createError.BadRequest('INVALID USERNAME/PASSWORD'))
    next(error)
  }
}


exports.signup = async (req, res, next) => {
  let hashedPassword;
  try {
    
    const result = await authSchema.validateAsync(req.body)
    console.log(req.body)
    const doesExist = await User.findOne({ email: result.email })
    if (doesExist)
      throw createError.Conflict(`${result.email} is already been registered`)
    const salt = await bcrypt.genSalt(12);
    if (req.body.password) {
      hashedPassword = await bcrypt.hash(req.body.password, salt);
    } else {
      hashedPassword = null;
    }

    const user = new User({
      _id: mongoose.Types.ObjectId(),
      email: result.email,
      password: hashedPassword,
      hashedSalt: salt
    });
    const savedUser = await user.save()
    const accessToken = await signAccessToken(savedUser.id)
    res.status(200).json({
      statusCode: 200,
      message: "Signup Successful",
      data: {
        user: savedUser
      },
      tokens: {
        accessToken: accessToken,
      }
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422
    next(error)
  }
}


exports.logout = async (req, res, next) => {
  try {
    res.status(200).json({
      statusCode: 200,
      message: "Logout success"
    })
  } catch (error) {
    next(error)
  }
}