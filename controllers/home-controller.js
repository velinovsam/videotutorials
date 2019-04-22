const Course = require("../models/Course");
module.exports = {
    index: async(req, res) => {
        let isLogged = req.user ? true : false;
        let courses = await Course.find({isPublic: true});
        courses.isLogged = isLogged;
        res.render('home/index', {courses, isLogged});
    }
};