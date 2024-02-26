const express = require('express');
const router = express.Router();
const passwordController = require('./../Controller/changePAsswordController');

// Change password endpoint
router.post('/change-password', passwordController.changeTeacherPassword);

module.exports = router;
