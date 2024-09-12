//클라이언트의 요청을 처리한 후, 서버에서 처리된 결과를 반환해주는 역할
//클라이언트의 요청을 수신
//요청에 들어온 데이터 및 내용 검증
//서버에서 수행된 결과를 클라이언트에게 반환

const ImageService = require('../services/imageService');

async function createUrl(res,req){
    return res.status(200).json({
        imageUrl: req.file.location
    });
}

module.exports={
    createUrl,
}