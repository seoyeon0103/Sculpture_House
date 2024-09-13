/*//이미지 url 생성
//AWS SDK를 불러옴. 이를 통해 AWS S3 서비스에 접근 가능
const AWS = require('aws-sdk');
//multer, multer-s3를 통해 url 반환
const multer = require('multer');
const multerS3 = require('multer-s3');

//multer s3를 접근할 수 있는 객체 생성
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

//데이터 형식 설정
const upload = multer({
    storage: multerS3({
        s3:s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        acl: 'public-read',
        key: (req, file, cb)=> {
            cb(null, `image/${Date.now()}_${file.originalname}`);
        },
    }),
});

module.exports = {
    upload,
}
*/
