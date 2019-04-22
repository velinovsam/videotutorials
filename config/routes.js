const controllers = require('../controllers');
const restrictedPages = require('./auth');

module.exports = app => {
    app.get('/', controllers.home.index);
    app.get('/register', restrictedPages.isAnonymous, controllers.user.registerGet);
    app.post('/register', restrictedPages.isAnonymous, controllers.user.registerPost);
    app.post('/logout', restrictedPages.isAuthed, controllers.user.logout);
    app.get('/login', restrictedPages.isAnonymous, controllers.user.loginGet);
    app.post('/login', restrictedPages.isAnonymous, controllers.user.loginPost);

    app.get('/admin/home', restrictedPages.hasRole("Admin"), controllers.admin.index);
    app.get('/admin/createCourse', restrictedPages.hasRole("Admin"), controllers.admin.createCourseGet);
    app.post('/admin/createCourse', restrictedPages.hasRole("Admin"), controllers.admin.createCoursePost);
    app.get('/admin/editCourse/:id', restrictedPages.hasRole("Admin"), controllers.admin.editCourseGet);
    app.post('/admin/editCourse/:id', restrictedPages.hasRole("Admin"), controllers.admin.editCoursePost);
    app.get('/admin/lectures/:id', restrictedPages.hasRole("Admin"), controllers.admin.lecturesGet);
    app.post('/admin/lectures/:id', restrictedPages.hasRole("Admin"), controllers.admin.lecturesPost);
    app.get('/admin/lectures/delete/:id', restrictedPages.hasRole("Admin"), controllers.admin.deleteLecture);

    app.get('/course/details/:id', restrictedPages.isAuthed, controllers.course.courseGet);
    app.post('/course/enroll/:id', restrictedPages.isAuthed, controllers.course.courseEnroll);
    app.get('/course/playLecture/:id', restrictedPages.isAuthed, controllers.course.playLecture);
    app.get('/course/search', controllers.course.search);
    
    // RESTRICTIONS!!!
    
    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};