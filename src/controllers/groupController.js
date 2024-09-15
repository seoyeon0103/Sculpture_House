const groupService = require('../services/groupService');

//그룹 등록
async function register(req,res){
    try{
        //reqbody로 부터 받아서 각각 분해하는 코드
        const {name, password, imageUrl, isPublic, introduction } = req.body;
        
        if(!name || !password || !imageUrl || typeof isPublic !== 'boolean' || !introduction){
            return res.status(400).json({
                message: "잘못된 요청입니다."
            })
        }
        
        //서비스에서는 DB 그룹 생성하는 거 만들기
        
        const newGroup = await groupService.createGroup({
            name,
            password,
            imageUrl,
            isPublic,
            introduction
        })

        //아닐 때는
        
        return res.status(201).json(newGroup);

    }catch(error){
        console.error(error);
        return res.status(500).json({
            message: "Server Error"
        })
    }
};

//그룹 목록 조회
async function groupList(req,res) {
    try{
        const{page, pageSize, sortBy, keyword, isPublic} = req.query;

        const groups = await groupService.inquire({
            page,
            pageSize,
            sortBy,
            keyword,
            isPublic,
        });

        res.status(200).json(groups);
        
    }catch(error){
        res.status(500).json({
            message: "Server Error"
        });
    }
};

//그룹 정보 수정하기
async function modifyGroup(req,res){
    try{
        const {name, password, imageUrl, isPublic, introduction} = req.body;

        const group = await groupService.modify({
            name,
            password,
            imageUrl,
            isPublic,
            introduction
        })

        return res.status(200).json(group);
    }catch(error){
        res.status(500).json({
            message: "Server Error"
        })
    }
}



module.exports={
    register,
    groupList,
    modifyGroup,

}