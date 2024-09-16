const express = require('express');
const router = express.Router();

const groupController = require('../controllers/groupController');

//그룹 등록
router.post('/groups', groupController.register);
router.get('/groups', groupController.groupList);
router.put('/groups/:groupId',groupController.modifyGroup);
router.delete('/groups/:groupId',groupController.deleteGroup);
router.get('/groups/:groupId',groupController.detailGroupList);
router.post('/groups/:groupId/verify-password',groupController.CheckPermission);
router.post('/groups/:groupId/like', groupController.empathizeLike);
router.get('/groups/:groupId/is-public', groupController.groupIsPublic);

module.exports = router;