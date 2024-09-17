const { v4: uuidv4 } = require('uuid');
const prisma = require('../prismaClient');
const bcrypt = require('bcryptjs');
const groupService = require('./groupService');

//게시글 등록
async function upload(groupId, postInfo){
    const groupIdExit = await groupService.verifyId(groupId);
    
    if(!groupIdExit){
        throw new Error("Not Founded");
    }

    const isPasswordCorrect = await groupService.verifyPassword(postInfo.groupPassword, groupIdExit.password);
    if(!isPasswordCorrect){
        throw new Error("비밀번호가 틀렸습니다");
    }

    const postData = {
        id : uuidv4(),
        nickname : postInfo.nickname,
        title : postInfo.title,
        content : postInfo.content,
        imageUrl : postInfo.imageUrl,
        tags : postInfo.tags,
        location : postInfo.location,
        moment : postInfo.moment,
        isPublic : postInfo.isPublic,
        likeCount : 0,
        commentCount : 0,
        createdAt : new Date(),
    }

    const newPost = await prisma.post.create({
        data: {
            ...postData,
            password : postInfo.postPassword,
            Group: {
                connect:{
                    id: groupId
                }
            }
        }
    })

    await prisma.group.update({
        where: {id:groupId},
        data:{
            postCount : {increment : 1}
        }
    })

    return postData;
}

//게시글 목록 조회
async function inquire(groupId, {page, pageSize, sortBy, keyword, isPublic,}){
    const groupIdExit = await groupService.verifyId(groupId);

    const where = {};

    if(keyword){
        where.name = {contains:keyword};
    }

    if(isPublic === 'true'){
        where.isPublic = true;
    }
    else if(isPublic === 'false'){
        where.isPublic = false;
    }
    else if(isPublic === null){
        where.isPublic = true;
    }

    function getOrderBy(sortBy){
        switch(sortBy){
            case "latest" :
                return {createdAt:'desc'};
            case "mostCommented":
                return {commentCount : 'desc'};
            case "mostLiked" : 
                return {likeCount : 'desc'};
            default : 
                return {createdAt : 'desc'};
        }
    }

    const postOrderBy = getOrderBy(sortBy);
    const take = parseInt(pageSize);
    const skip = (parseInt(page) -1) * take;

    const posts = await prisma.post.findMany({
        where,
        orderBy: postOrderBy,
        skip,
        take,
        select:{
            id: true,
            nickname: true,
            title : true,
            imageUrl: true,
            tags: true,
            location: true,
            moment : true,
            isPublic: true,
            likeCount: true,
            commentCount: true,
            createdAt : true,
        }
    })

    const totalItems = await prisma.post.count({
        where
    })
    const totalPages = Math.ceil(totalItems/pageSize);

    return{
        currentPage : parseInt(page),
        totalPages : totalPages,
        totalItemCount : totalItems,
        data: posts,
    }
}

//게시글 Id 확인
async function verifypostId(postId) {
    const postIdExit = await prisma.post.findUnique({
        where: {id: postId}
    })

    return postIdExit;
}

//게시글 pw 확인
async function verifypostPassword(inputPassword, storedHash) {
    const isMatch = await bcrypt.compare(inputPassword,storedHash);

    return isMatch;
}

//게시글 수정
async function modify(postId, modifingData) {
    //postId 확인
    const postIdExit = await verifypostId(postId);

    if(!postIdExit){
        throw new Error('존재하지 않습니다')
    }

    //비번 맞는지 수정
    const ispostPasswordCorrect = await verifypostPassword(modifingData.postPassword,postIdExit.password);

    if(!ispostPasswordCorrect){
        throw new Error("비밀번호가 틀렸습니다");
    }

    //update 하기
    const updatePost = await prisma.post.update({
        where: {id: postId},
        data:{
            nickname: modifingData.nickname,
            title: modifingData.title,
            content : modifingData.content,
            imageUrl : modifingData.imageUrl,
            tags: modifingData.tags,
            location: modifingData.location,
            moment: modifingData.moment,
            isPublic: modifingData.isPublic,
        },
        select:{
            id:true,
            group_id: true,
            nickname: true,
            title: true,
            content : true,
            imageUrl: true,
            tags: true,
            location: true,
            moment: true,
            isPublic: true,
            likeCount: true,
            commentCount: true,
            createdAt: true,
        }
    })

    //원하는 부분만 내보내기
    return updatePost;
}

//게시글 삭제
async function deleted(postId, password){
    const postIdExit = await verifypostId(postId);

    if(!postIdExit){
        throw new Error('존재하지 않습니다')
    }

    const ispostPasswordCorrect = await verifypostPassword(password, postIdExit.password);

    if(!ispostPasswordCorrect){
        throw new Error('비밀번혹 틀렸습니다');
    }

    const isDelete = await prisma.post.delete({
        where:{id : postId}
    });

    await prisma.group.update({
        where: {id : isDelete.group_id},
        data:{
            postCount: {decrement: 1}
        }
    })

    return isDelete;
}

//게시글 상세 정보 조회
async function detailInquire(postId) {
    const postIdExit = await verifypostId(postId);

    if(!postIdExit){
        throw new Error('Not Founded');
    }

    return{
        id: postIdExit.id,
        group_id: postIdExit.group_id,
        nickname : postIdExit.nickname,
        title : postIdExit.title,
        content : postIdExit.content,
        imageUrl : postIdExit.imageUrl,
        tags: postIdExit.tags,
        location : postIdExit.location,
        moment: postIdExit.moment,
        isPublic : postIdExit.isPublic,
        likeCount: postIdExit.likeCount,
        commentCount : postIdExit.commentCount,
        createdAt : postIdExit.createdAt
    }
}

//게시글 조회 권한
async function check(postId, password) {
    const postIdExit = await verifypostId(postId);

    if(!postIdExit){
        throw new Error("존재하지 않습니다")
    }

    const ispostPasswordCorrect = await verifypostPassword(password, postIdExit.password);
    
    if(!ispostPasswordCorrect){
        throw new Error("비밀번호가 틀렸습니다")
    }

    return true;
}

//게시글 공감하기 
async function empathize(postId) {
    const postIdExit = await verifypostId(postId);
    
    if(!postIdExit){
        throw new Error("존재하지 않습니다");
    }

    const increaseLike = await prisma.post.update({
        where: {id : postId},
        data:{
            likeCount: {increment: 1}
        },
    })
    
    console.log(increaseLike.likeCount);
    return increaseLike;
}

//게시글 공개 여부 확인
async function isPublic(postId) {
    const postIdExit = await verifypostId(postId);

    if(!postIdExit){
        throw new Error("Not founded");
    }

    return{
        id:postIdExit.id,
        isPublic: postIdExit.isPublic,
    }
}

module.exports = {
    upload,
    inquire,
    modify,
    deleted,
    detailInquire,
    check,
    empathize,
    isPublic,

}