const express = require('express');
const router = express.Router();

const commentController = require('../controllers/commentController')

router.post('/posts/:postId/comments',commentController.registerComment);
router.get('/posts/:postId/comments',commentController.inquireComment);
router.put('/comments/:commentId',commentController.modifyComment);
router.delete('/comments/:commentId',commentController.deleteComment);


module.exports =router;