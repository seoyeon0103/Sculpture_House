const commentService = require('../services/commentService');
const bcrypt = require('bcryptjs');
const prisma = require('../prismaClient');

//댓글 등록
async function registerComment(req, res) {
    try{
        const {postId} = req.params;
        const {nickname, content, password} = req.body;

        if(!nickname || !postId || !content|| !password){
            return res.status(400).json({
                message: "잘못된 요청입니다"
            })
        }

        const salt = await bcrypt.genSalt(5);
        const hashedPassword = await bcrypt.hash(password,salt);

        const isRegister = await commentService.register(postId,{
            nickname,
            content,
            password:hashedPassword,
        })

        if(isRegister){
            const incresing = await prisma.post.update({
                where:{id: postId},
                data:{
                    commentCount:{increment:1}
                }
            })
            
            res.status(200).json(isRegister);
        }

    }catch(error){
        res.status(500).json({
            message : "Server Error",
            error: error.message,
        })
    }

}

//댓글 조회
async function inquireComment(req,res) {
    try{
        const{postId} = req.params;
        const {page, pageSize} = req.query;

        if(!postId || !page|| !pageSize){
            return res.status(400).json({
                message : "잘못된 요청입니다"
            })
        }

        const commentList = await commentService.inquire(postId, {
            page,
            pageSize
        })

        res.status(200).json(commentList);
    }catch(error){
        return res.status(500).json({
            message: "Server Error",
            error: error.message,
        })
    }

}

//댓글 수정
async function modifyComment(req,res) {
    try{
        const{commentId} = req.params;
        const{nickname, content, password} = req.body;

        if(!commentId || !nickname ||  !content || !password){
            return res.status(400).json({
                message : "잘못된 요청입니다"
            })
        }

        const comment = await commentService.modify(commentId,{
            nickname,
            content,
            password
        });

        res.status(200).json(comment);
    }catch(error){
        if(error.message === '비밀번호가 틀렸습니다'){
            return res.status(403).json({
                message : "비밀번호가 틀렸습니다"
            })
        }
        else if(error.message === '존재하지 않습니다'){
            return res.status(404).json({
                message: "존재하지 않습니다"
            })
        }

        return res.status(500).json({
            message : "Server Error",
            error: error.message,
        })
    }
}

//댓글 삭제
async function deleteComment(req,res) {
    try{
        const{commentId} = req.params;
        const{password} = req.body;

        if(!commentId || !password){
            return res.status(400).json({
                message: "잘못된 요청입니다"
            })
        }

        const isDelete = await commentService.deleted(commentId, password);

        if(isDelete){
            const checking = await prisma.post.update({
                where:{id : isDelete.post_id},
                data:{
                    commentCount: {decrement:1}
                }
            })
            
            res.status(200).json({
                message: "답글 삭제 성공"
            })
        }
    }catch(error){
        if(error.message === '비밀번호가 틀렸습니다'){
            return res.status(403).json({
                message: "비밀번호가 틀렸습니다"
            })
        }
        else if(error.message === '존재하지 않습니다'){
            return res.status(404).json({
                message: '존재하지 않습니다'
            })
        }

        return res.status(500).json({
            message: 'Server Error',
            error: error.message,
        })
    }
}

module.exports={
    registerComment,
    inquireComment,
    modifyComment,
    deleteComment,

}