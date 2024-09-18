const ImageService = require('../services/imageService');

async function createUrl(req,res){
    try{
        const imageUrl = await ImageService.uploadImage(req);
        res.status(200).json({
            imageUrl: imageUrl}
        )
    }catch(error){
        return res.status(500).json({
            message : "Server Error",
            error: error.message
        });
    }
}

module.exports={
    createUrl,
}