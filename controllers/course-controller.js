const Course = require("../models/Course");
const User = require("../models/User");
const Lecture = require("../models/Lecture");

module.exports = {
    courseGet: async(req, res) => {
        const courseId = req.params.id;
        const userId = req.user._id;

        try {            
            const user = await User.findById(userId);
            let course = await Course.findById(courseId).populate("lectures");
            console.log(course);
            if (user.enrolledCourses.indexOf(courseId) > -1) {
                course.isEnrolled = true;
            }

            res.render('course/details', course);

        } catch (e) {
            console.log(e);
        }
    },
    courseEnroll: async(req, res) => {
        const userId = req.user._id;
        const courseId = req.params.id;
        
        
        try {
            let user = await User.findById(userId);
            let course = await Course.findById(courseId);

            if (user.enrolledCourses.indexOf(courseId) < 0) {
                user.enrolledCourses.push(courseId);
                if (course.users.indexOf(userId) < 0) {
                    course.users.push(userId);
                }
            }
    
            await user.save();
            await course.save();
            
            res.redirect(`/course/details/${courseId}`);

        } catch (e) {
            console.log(e);
        }        
    },
    playLecture: async(req, res) => {
        const lectureId = req.params.id;
        const currLecture = await Lecture.findById(lectureId);
        const courseId = currLecture.course;
        const course = await Course.findById(courseId).populate("lectures");

        res.render('course/play-video', {course, currLecture});
    },
    search: (req, res) => {
        let searchModel = req.query.coursename;

        
        if (!searchModel) {
            res.redirect('/');
            return;
        }

        if (searchModel.trim() === '') {
            res.redirect('/');
            return;
        }

        Course.find({}).then((course) => {
            let isLogged = req.user ? true : false;

            let courses = course
                .filter(c =>
                    c.title.toLowerCase().includes(searchModel.toLowerCase()));
                    
            console.log(courses);

            courses.isLogged = isLogged;
            res.render('home/index', {courses, isLogged});
        }).catch((err) => {
            console.log(err);
            res.redirect('/');
        });
    }
};