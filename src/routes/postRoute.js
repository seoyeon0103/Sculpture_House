const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController')

router.post('/groups/:groupId/posts', postController.uploadPost);
router.get('/groups/:groupId/posts',postController.inquirePost);
router.put('/posts/:postId',postController.modifyPost);
router.delete('/posts/:postId',postController.deletePost);
router.get('/posts/:postId', postController.detailPostList);
router.post('/posts/:postId/verify-password',postController.checkPermission);
router.post('/posts/:postId/like',postController.empathizeLike);
router.get('/posts/:postId/is-public',postController.postIsPublic);

module.exports = router;