var mongoose = require('mongoose');

var chatSchema = ({
    name: String,
    chat: String
}, {versionKey: false});


module.exports = mongoose.model('Chat', chatSchema);