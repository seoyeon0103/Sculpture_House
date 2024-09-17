//uuid 불러오기 위함
const { v4: uuidv4 } = require('uuid');
//prisma 불러오기
const prisma = require('../prismaClient');
//const { params } = require('../routes/groupRoute');

const bcrypt = require('bcryptjs');

//그룹 생성하기
async function createGroup(groupData){
    const GroupData = {
        id : uuidv4(),
        name: groupData.name,
        imageUrl: groupData.imageUrl,
        isPublic: groupData.isPublic,
        likeCount: 0,
        postCount: 0,
        createdAt: new Date().toISOString(),
        introduction: groupData.introduction
    }

    //db에 저장하기
    const newGroup = await prisma.group.create({
        data: {
            ...GroupData,
            password: groupData.password,
        }
    });

    return GroupData; //response
};

//그룹 정보 조회하기
async function inquire({page, pageSize, sortBy, keyword, isPublic}) {    
    //findMany의 조건이 될 부분
    const where = {};
    
    //조건 부분 찾아보기
    if(keyword){
        where.name = {contains: keyword};
    }
    
    if(isPublic === 'true'){
        where.isPublic = true;
    }
    if(isPublic === 'false'){
        where.isPublic = false;
    }

    //orderBy 달라지는 거
    function getOrderBy(sortBy){
        switch(sortBy){
            case "lastest" :
                return {createdAt: 'desc'};
            case "mostPosted" :
                return {postCount: 'desc'};
            case "mostLiked" :
                return {likeCount : 'desc'};
            default :
                return {createdAt: 'desc'};
        }
    }

    const groupOrderBy = getOrderBy(sortBy);
    const take = parseInt(pageSize);
    const skip = (parseInt(page) -1) * take;
    
    //옵션들은 순서 상관 없이 흘러감.
    const groups = await prisma.group.findMany({
        where,
        orderBy: groupOrderBy,
        skip,
        take,
        select:{
            id: true,
            name: true,
            imageUrl: true,
            isPublic: true,
            likeCount: true,
            postCount: true,
            createdAt:true,
            introduction: true,
            password: false,
        }
    })

    const totalItems = await prisma.group.count({
        where
    })

    const totalPages = Math.ceil(totalItems/pageSize);

    return {
        currentPage: parseInt(page),
        totalPages: totalPages,
        totalItemCount: totalItems,
        data: groups,
    }
};

//password 검증 검증
async function verifyPassword(inputPassword, storedHash) {
    const isMatch = await bcrypt.compare(inputPassword, storedHash);
    return isMatch;
}

//groupId 검증
async function verifyId(groupId) {
    const groupIdExit = await prisma.group.findUnique({
        where: {id: groupId}
    })

    return groupIdExit;
}

//그룹 정보 수정하기
async function modify(groupId,modifingData) {
    //id 일치하는지 보기
    const groupIdExit = await verifyId(groupId);

    if(!groupIdExit){
        throw new Error('존재하지 않습니다');
    }

    //password 일치하는지 보기
    const isPasswordCorrect = await verifyPassword(modifingData.password, groupIdExit.password);
    if(!isPasswordCorrect){
        throw new Error('비밀번호가 틀렸습니다');
    }
    
    const updateGroup = await prisma.group.update({
        where: {id: groupId},
        data:{
            name: modifingData.name,
            isPublic: modifingData.isPublic,
            introduction: modifingData.introduction,
            imageUrl: modifingData.imageUrl,
        },
        select:{
            id: true,
            name: true,
            imageUrl: true,
            isPublic: true,
            likeCount: true,
            postCount: true,
            createdAt:true,
            introduction: true,
        }
    })

    return updateGroup;
}

//그룹 삭제하기
async function deleted(groupId, password) {
    const groupIdExit = await verifyId(groupId);

    if(!groupIdExit){
        throw new Error("존재하지 않습니다");
    }
    //해쉬 안씌워졌을 때,
    /*if(password != groupIdExit.password){
        throw new Error("비밀번호가 틀렸습니다");
    }*/

    //해쉬 씌워졌을 때
    const isPasswordCorrect = await verifyPassword(password, groupIdExit.password);
    if(!isPasswordCorrect){
        throw new Error('비밀번호가 틀렸습니다');
    }
    
    const isDelete = await prisma.group.delete({
        where: {id: groupId}
    });

    return isDelete;
}

//그룹 상세 정보 조회
async function detailInquire(groupId){
    const groupIdExit = await verifyId(groupId);

    if(!groupIdExit){
        throw new Error("존재하지 않습니다")
    }

    //password만 제외하고 추출하기
    return{
        id: groupIdExit.id,
        name: groupIdExit.name,
        imageUrl: groupIdExit.imageUrl,
        isPublic: groupIdExit.isPublic,
        likeCount: groupIdExit.likeCount,
        postCount: groupIdExit.postCount,
        createdAt: groupIdExit.createdAt,
        introduction: groupIdExit.introduction,
    }
}

//그룹 조회 권한 확인
async function check(groupId, password) {
    const groupIdExit = await verifyId(groupId);
    
    if(!groupIdExit){
        throw new Error("존재하지 않습니다");
    }

    //해쉬가 없을 경우
    /*if(password != groupIdExit.password){
        throw new Error("비밀번호가 틀렸습니다");
    }*/
    
    const isPasswordCorrect = await verifyPassword(password, groupIdExit.password);
    if(!isPasswordCorrect){
        throw new Error("비밀번호가 틀렸습니다");
    }

    return true;
}

//그룹 공감하기
async function empathize(groupId){
    const groupIdExit = await verifyId(groupId);

    if(!groupIdExit){
        throw new Error("존재하지 않습니다");
    }

    const increaseLike = await prisma.group.update({
        where: {id: groupId},
        data:{
            likeCount: {increment : 1}
        },
    })
    return increaseLike;
}

//그룹 공개 여부 확인
async function isPublic(groupId){
    const groupIdExit = await verifyId(groupId);

    if(!groupIdExit){
        throw new Error("Not Founded");
    }

    return{
        id: groupIdExit.id,
        isPublic: groupIdExit.isPublic,
    }
}

module.exports ={
    createGroup,
    inquire,
    modify,
    deleted,
    detailInquire,
    check,
    empathize,
    isPublic,
    verifyId,
    verifyPassword,

}