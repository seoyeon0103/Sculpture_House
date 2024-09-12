import express from 'express';
require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.listen(port,()=> console.log('Server Started'));

app.post('/image', function(req,res){
    res.send('image 작동 되었음');
});
