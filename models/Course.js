const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: mongoose.Schema.Types.String, required: true},
    description : { type: mongoose.Schema.Types.String, required: true},
    imageUrl : { type: mongoose.Schema.Types.String, required: true},
    isPublic : { type: mongoose.Schema.Types.Boolean, default: false},
    lectures: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lecture" }],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;