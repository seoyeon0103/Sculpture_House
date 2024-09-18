const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
//uuid 불러오기 위함
const { v4: uuidv4 } = require('uuid');
const ImageController = require('../controllers/imageController');

router.post('/image',ImageController.createUrl);

module.exports = router;