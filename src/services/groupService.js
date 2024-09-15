//uuid 불러오기 위함
const { v4: uuidv4 } = require('uuid');
//prisma 불러오기
const prisma = require('../prismaClient');
//const { params } = require('../routes/groupRoute');

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
        take
    })

    const totalItems = await prisma.group.count({
        where
    })

    const totalPages = Math.ceil(totalItems/pageSize);

    return {
        currentPage: parseInt(page),
        totalPages: totalPages,
        tatalItemCount: parseInt(pageSize),
        data: groups,
    }
};

//그룹 정보 수정하기
async function modify(modifingData) {
    
}

module.exports ={
    createGroup,
    inquire,
    modify,

}