const Course = require("../models/Course");
const Lecture = require("../models/Lecture");

module.exports = {
    index: async(req, res) => {

        try {
            const coursesFormDb = await Course.find();
            let courses = [];

            coursesFormDb.forEach(c => courses.push({
                id: c._id,
                title: c.title,
                lectures: c.lectures.length
            }))
            res.render('admin/home', {courses});

        } catch (e) {
            console.log(e);
        }
    },
    createCourseGet: (req, res) => {
        res.render('admin/course-create');
    },
    createCoursePost: async(req, res) => {
        let newCourse = req.body;
        let isPublic = newCourse.checkBox === "on" ? true : false;

        if (newCourse.title.trim().length < 3) {
            newCourse.error = "Name is required";
            res.render('admin/course-create', newCourse);
            return;
        }

        if (newCourse.description.trim().length < 3 || newCourse.description.trim().length > 50) {
            newCourse.error = "Description must be between 3 and 50 symbols!";
            res.render('admin/course-create', newCourse);
            return;
        }
        
        if (newCourse.imageUrl.trim().length === 0) {
            newCourse.error = "Image Url is required!";
            res.render('admin/course-create', newCourse);
            return;
        }

        try {
            const course = await Course.create({
                title: newCourse.title,
                description: newCourse.description,
                imageUrl: newCourse.imageUrl,
                isPublic
            });

        res.redirect('home');

        } catch (e) {
            console.log(e);
        }
    },
    editCourseGet: async(req, res) => {
        const courseId = req.params.id;

        try {
            const currCourse = await Course.findById(courseId);
            const checked = currCourse.isPublic === true ? "checked" : "";
            const course = {
                id: currCourse._id,
                title: currCourse.title,
                description: currCourse.description,
                imageUrl: currCourse.imageUrl,
                checked
            }
            res.render('admin/course-edit', course);
        } catch (e) {
            console.log(e);
        }
    },
    editCoursePost:(req, res) => {        
        let courseData = req.body;
        let courseId = req.params.id;
        let isPublic = courseData.checkBox === "on" ? true : false;

        Course.findById(courseId)
        .then((c) => {
            c.title = courseData.title;
            c.description = courseData.description;
            c.imageUrl = courseData.imageUrl;
            c.isPublic = isPublic;

            c.save().then(() => {
                res.redirect('/admin/home');
            });
        })
        .catch(console.error);
    },
    lecturesGet: (req, res) => {
        let courseId = req.params.id;
        Course.findById(courseId).populate("lectures")
            .then((c) => {
                res.render('admin/lecture-panel', {c, count: c.lectures.length});
            })

    },
    lecturesPost: (req, res) => {
        let courseId = req.params.id;

        let lecture = {
            title: req.body.title,
            videoUrl: req.body.imageUrl,
            course: courseId
        };
        Promise.all([Lecture.create(lecture), Course.findById(courseId)])
        .then(([lec, cours]) => {
            cours.lectures.push(lec._id);
            cours.save()
            .then(() => {
                return res.redirect(`/admin/lectures/${courseId}`);                
            })
        })
        .catch(console.error);
        
    },
    deleteLecture: async(req, res) => {

        try {
            const lectId = req.params.id;
            let lect = await Lecture.findById(lectId);
            let cours = await Course.findById(lect.course);
            console.log(cours);

            cours.lectures.splice(cours.lectures.indexOf(lectId), 1);
            await cours.save();
            await Lecture.findByIdAndDelete(lectId);
            
            res.redirect('/admin/home');

        } catch (err) {
            console.log(err);
        }
    }
}