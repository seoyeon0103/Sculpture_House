const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();

const groupRoute = require('./routes/groupRoute');
const postRoute = require('./routes/postRoute');
const commentRoute = require('./routes/commentRoute');
//const imageRoute = require('./routes/imageRoute');

//json 데이터를 파싱하는 미들웨어
app.use('/api',express.json());

app.use('/api', groupRoute);
app.use('/api', postRoute);
app.use('/api',commentRoute);
//app.use('/api',imageRoute);


app.listen(port,()=> console.log('Server Started'));

