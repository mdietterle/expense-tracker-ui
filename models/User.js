const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String } // 添加这个字段来存储照片的 URL
});

module.exports = mongoose.model('User', userSchema);