const mongoose = require('mongoose');
const PostSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    message: {
        type: String
    },
    comments: [{
        sendBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        message: { type: String },
        sentAt: { type: Date, default: Date.now() },
        liked: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }]
    }],
    createBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() },
    //    expiry_date:{type:Date}

});
module.exports = mongoose.model('Posts', PostSchema);