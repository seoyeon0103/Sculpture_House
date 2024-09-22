//이미지 url 생성
//multer, multer-s3를 통해 url 반환
const multer = require('multer');
const path = require('path');
//uuid 불러오기 위함
const { v4: uuidv4 } = require('uuid');
// multer 설정

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        const uploadPath = path.join(__dirname, '..', '/../picture');
        cb(null, uploadPath);
    },
    filename: function(req,file,cb){
        const ext = path.extname(file.originalname);
        cb(null, Date.now().toString() + ext);
    }
});

const upload = multer({storage: storage}).single('image');


//이미지 업로드 서비스 로직
async function uploadImage(req) {
    return new Promise((resolve, reject)=>{
        upload(req, {}, error =>{
            if(error){
                reject(error);
            }else if(!req.file){
                reject(new Error('No file uploaded'));
            }else{
                const imageUrl = `${req.protocol}://${req.get('host')}/${req.file.filename}`;
                resolve(imageUrl);
            }
        });
    });
};

module.exports = {
    uploadImage,
}

