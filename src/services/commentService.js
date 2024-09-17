//uuid 불러오기 위함
const { v4: uuidv4 } = require('uuid');
//prisma 불러오기
const prisma = require('../prismaClient');
//const { params } = require('../routes/groupRoute');
const bcrypt = require('bcryptjs');

const postService = require('./postService');

//댓글 등록
async function register(postId, commentInfo) {
    const postIdExit = await postService.verifypostId(postId);

    if(!postIdExit){
        throw new Error("Not Founded");
    }

    const commentData = {
        id : uuidv4(),
        nickname : commentInfo.nickname,
        content : commentInfo.content,
        createdAt : new Date(),
    }

    const newComment = await prisma.comment.create({
        data:{
            ...commentData,
            password: commentInfo.password,
            Post:{
                connect:{
                    id: postId
                }
            }
        }
    })

    const checking = await prisma.post.update({
        where: {id: postId},
        data:{
            commentCount : {increment : 1}
        }
    })

    return commentData;
}

//댓글 목록 조회
async function inquire(postId, {page, pageSize}) {
    const postIdExit = await postService.verifypostId(postId);
    
    if(!postIdExit){
        throw new Error("Not founed");
    }

    const where = {
        post_id : postId
    };

    const take = parseInt(pageSize);
    const skip = (parseInt(page) -1) * take;

    const comments = await prisma.comment.findMany({
        where,
        orderBy: {createdAt: 'desc'},
        skip,
        take,
        select:{
            id:true,
            nickname: true,
            content: true,
            createdAt: true,
        }
    });
    
    const totalItemCount = await prisma.comment.count({
        where
    });

    const totalPages = Math.ceil(totalItemCount/pageSize);

    console.log(postIdExit.commentCount);

    return{
        currentPage: page,
        totalPages : totalPages,
        totalItemCount : totalItemCount,
        data :comments,
    }
}

//댓글 수정
async function modify(commentId, {nickname, content, password}) {
    const commentIdExit = await prisma.comment.findUnique({
        where: {id: commentId}
    })

    if(!commentIdExit){
        throw new Error('존재하지 않습니다');
    }

    const isCommentPasswordCorrect = await bcrypt.compare(password, commentIdExit.password);

    if(!isCommentPasswordCorrect){
        throw new Error('비밀번호가 틀렸습니다');
    }

    const updateComment = await prisma.comment.update({
        where:{id : commentId},
        data:{
            nickname: nickname,
            content: content
        }
    });
    
    return{
        id: updateComment.id,
        nickname : updateComment.nickname,
        content : updateComment.content,
        createdAt : updateComment.createdAt,
    }
}

//댓글 삭제
async function deleted(commentId, password) {
    const commentIdExit = await prisma.comment.findUnique({
        where:{id: commentId}
    });

    if(!commentIdExit){
        throw new Error('존재하지 않습니다');
    }

    const isCommentPasswordCorrect = await bcrypt.compare(password,commentIdExit.password);

    if(!isCommentPasswordCorrect){
        throw new Error('비밀번호가 틀렸습니다');
    }

    const isDelete = await prisma.comment.delete({
        where:{id:commentId}
    })

    return isDelete;
}

module.exports ={
    register,
    inquire,
    modify,
    deleted,

}