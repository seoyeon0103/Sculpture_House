const express = require('express');
const router = express.Router();

const groupController = require('../controllers/groupController');

//그룹 등록
router.post('/groups', groupController.register);
router.get('/groups', groupController.groupList);
router.put('/groups/:groupId',groupController.modifyGroup);
router.delete('/groups/:groupId',groupController.deleteGroup);

module.exports = router;