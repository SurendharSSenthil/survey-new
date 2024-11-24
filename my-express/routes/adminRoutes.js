const express = require('express');
const router = express.Router();
const { getCourseList,
        getMarkData,
        getResponseData,
        countStudentSubmissions,
        getStudentList,
    addData} = require('../controllers/adminController');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.fields([{ name: 'studentDetailsFile' }, { name: 'courseListFile' }]), addData);


router.get('/courses', getCourseList);
router.post('/markdata', getMarkData);
router.post('/responsedata', getResponseData);
router.get('/studentList/:sem', getStudentList);
router.get('/:sub', countStudentSubmissions);

module.exports = router;
