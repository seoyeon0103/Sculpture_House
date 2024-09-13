const express = require('express');
const router = express.Router();

const groupController = require('../controllers/groupController');

//그룹 등록
router.post('/groups', groupController.register);
router.get('/groups', groupController.inquire);

module.exports = router;