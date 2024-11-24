const express = require('express');
const router = express.Router();
const { authenticateStudent,
        getStudentData,
        getCourseQuestions,
        countCourseSubmissions,
        submitForm} = require('../controllers/studentController');

router.post('/auth', authenticateStudent);
router.get('/courses/:course', getCourseQuestions);
router.get('/submission/:std', countCourseSubmissions);
router.post('/submit-form', submitForm);
router.get('/:id', getStudentData);

module.exports = router;
