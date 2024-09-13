//uuid 불러오기 위함
const { v4: uuidv4 } = require('uuid');
//prisma 불러오기
const prisma = require('../prismaClient');

//그룹 생성하기
async function createGroup(groupData){
    const GroupData = {
        group_id : uuidv4(),
        name: groupData.name,
        groupImageUrl: groupData.imageUrl,
        groupIsPublic: groupData.isPublic,
        groupLikeCount: 0,
        groupPostCount: 0,
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

async function inquire(groupInquire) {
    //ispublic 부터 걸러내기
    //orderby 시키기
    //page별로 끊기
    //group으로 만들어서 return 하기
}

module.exports ={
    createGroup,
    inquire,
}