const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};


//User Schema
const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        lowercase: true,
        default : null
    },
    password: {
        type: String,
        default : null
    },
    
    hashedSalt : {
        type : String,
        default : null
    }

});


UserSchema.methods.isValidPassword = async function (password) {
    try {
      return await bcrypt.compare(password, this.password)
    } catch (error) {
      throw error
    }
  }
  

module.exports = mongoose.model('User', UserSchema);