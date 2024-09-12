const express = require('express');
const router = express.Router();

const ImageController = require('../controllers/imageController');
const ImageService = require('../services/imageService');

router.post('/image',ImageService.upload.single('image'),ImageController.createUrl);

module.exports = router;