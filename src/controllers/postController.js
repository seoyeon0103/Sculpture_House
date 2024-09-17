const postService = require('../services/postService');
const bcrypt = require('bcryptjs');

//게시글 등록
async function uploadPost(req,res) {
    try{
        const {groupId} = req.params;

        const {nickname, title, content, postPassword, groupPassword, imageUrl, tags, location, moment, isPublic} = req.body;

        if(!groupId || !nickname|| !title|| !content || !imageUrl || !tags|| !location || !moment || !isPublic){
            res.status(400).json({
                message : "잘못된 요청입니다"
            })
        }

        //비밀번호 해시처리
        const salt = await bcrypt.genSalt(5);
        const hashedPassword = await bcrypt.hash(postPassword,salt);

        const isUploading = await postService.upload(groupId, {
            nickname,
            title,
            content,
            postPassword : hashedPassword,
            groupPassword,
            imageUrl,
            tags,
            location,
            moment,
            isPublic,
        })

        res.status(200).json(isUploading);
    }catch(error){
        if(error.message == "비밀번호가 틀렸습니다"){
            res.status(403).json({
                message : "비밀번호가 틀렸습니다"
            })
        }

        res.status(500).json({
            message: "Server Error",
            error : error.message,
        })
    }
}

//게시글 목록 조회
async function inquirePost(req,res){
    try{   
        const{groupId} = req.params;
        const{page, pageSize, sortBy, keyword, isPublic} = req.query;

        if(!page ||!pageSize || isNaN(parseInt(page)) || isNaN(parseInt(pageSize))){
            return res.status(400).json({
                message: "잘못된 요청입니다"
            });
        }
        const postList = await postService.inquire(groupId,{
            page,
            pageSize,
            sortBy,
            keyword,
            isPublic,
        })
        
        res.status(200).json(postList);
    }catch(error){
        res.status(500).json({
            message: "Server Error",
            error: error.message,
        })
    }
}

//게시글 수정
async function modifyPost(req, res) {
    try{
        const {postId} = req.params;

    const{nickname, title, content, postPassword, imageUrl, tags, location, moment, isPublic} = req.body;

    if(!nickname || !title || !content || !imageUrl || !tags || !location || !moment || !isPublic){
        return res.status(400).json({
            message : "잘못된 요청입니다"
        })
    }

    const post = await postService.modify(postId, {
        nickname,
        title,
        content,
        imageUrl,
        postPassword,
        tags,
        location,
        moment,
        isPublic,
    })

    res.status(200).json(post);
    }catch(error){
        if(error.message == "비밀번호가 틀렸습니다"){
            return res.status(403).json({
                message : "비밀번호가 틀렸습니다"
            })
        }

        else if(error.message == "존재하지 않습니다"){
            return res.status(404).json({
                message: "존재하지 않습니다"
            })
        }

        res.status(500).json({
            message :"Server Error",
            error: error.message,
        })
    }
}

//게시글 삭제
async function deletePost(req,res) {
    try{
        const {postId} = req.params;
        const {postPassword} = req.body;

        if(!postId || !postPassword){
            return res.status(400).json({
                message : "잘못된 요청입니다"
            })
        }

        const isDelete = await postService.deleted(postId, postPassword);

        res.status(200).json({
            message: "게시글 삭제 성공"
        })
    }catch(error){
        if(error.message === '비밀번호가 틀렸습니다'){
            return res.status(403).json({
                message : "비밀번호가 틀렸습니다"
            })
        }

        else if(error.message === "존재하지 않습니다"){
            return res.status(404).json({
                message : "존재하지 않습니다"
            })
        }

        res.status(500).json({
            message: "Server Error",
            error: error.message,
        })
    }
}

//게시글 상세 조회
async function detailPostList(req,res) {
    try{
        const{postId} = req.params;

        if(!postId){
            return res.status(400).json({
                message:"잘못된 요청입니다"
            })
        }

        const detail = await postService.detailInquire(postId);
        res.status(200).json(detail);
    }catch(error){
        res.status(500).json({
            message: "Server Error",
            error: error.message,
        })
    }
}

//게시글 조회 권한
async function checkPermission(req,res) {
    try{
        const {postId} = req.params;
        const {password} = req.body;
        
        const checking = await postService.check(postId,password);

        res.status(200).json({
            message: "비밀번호가 확인되었습니다"
        })
    }catch(error){
        if(error.message === '비밀번호가 틀렸습니다'){
            return res.status(401).json({
                message : "비밀번호가 틀렸습니다"
            })
        }

        res.status(500).json({
            message : "Server Error",
            error: error.message,
        })
    }

}

//게시글 공감하기
async function empathizeLike(req,res) {
    try{
        const {postId} = req.params;

        const isLike = await postService.empathize(postId);

        res.status(200).json({
            message: "게시글 공감하기 성공"
        })
    }catch(error){
        if(error.message === '존재하지 않습니다'){
            return res.status(404).json({
                message: "존재하지 않습니다"
            })
        }

        res.status(500).json({
            message : "Server Error",
            error: error.message,
        })
    }

}

//게시글 공개 여부
async function postIsPublic(req,res) {
    try{
        const {postId} = req.params;

        const checking = await postService.isPublic(postId);

        res.status(200).json(checking);
    }catch(error){
        res.status(500).json({
            message : "Server Error",
            error : error.message,
        })
    }
}

module.exports={
    uploadPost,
    inquirePost,
    modifyPost,
    deletePost,
    detailPostList,
    checkPermission,
    empathizeLike,
    postIsPublic,
}