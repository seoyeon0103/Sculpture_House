const groupService = require('../services/groupService');
const bcrypt = require('bcryptjs');

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

        //비밀번호 해시 처리
        const salt = await bcrypt.genSalt(5); //솔트 생성, 더 높은 숫자로 더 많은 보안처리(너무 높아도 문제긴 함)
        const hashedPassword = await bcrypt.hash(password, salt);
        
        //서비스에서는 DB 그룹 생성하는 거 만들기
        const newGroup = await groupService.createGroup({
            name,
            //password: hashedPassword,
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
            message: "Server Error",
            error: error.message,
        });
    }
};

//그룹 정보 수정하기
async function modifyGroup(req,res){
    try{
        const {groupId} = req.params;
        const {name, password, imageUrl, isPublic, introduction} = req.body;

        if(!groupId|| !name || !password || !imageUrl || typeof isPublic !== 'boolean' || !introduction){
            return res.status(400).json({
                message: "잘못된 요청입니다"
            })
        }

        const group = await groupService.modify(groupId, {name, password, imageUrl, isPublic, introduction});

        res.status(200).json(group);

    }catch(error){
        console.log(error);

        if(error.message == "비밀번호가 틀렸습니다"){
            res.status(403).json({
                message: "비밀번호가 틀렸습니다"
            })
        }

        else if(error.message == "존재하지 않습니다"){
            res.status(404).json({
                message: "존재하지 않습니다"
            })
        }

        res.status(500).json({
            message: "Server Error",
            error: error.message,
        })
    }
}

//그룹 삭제하기
async function deleteGroup(req,res) {
    try{
        const{groupId} = req.params;
        const password = req.body.password;

        if(!groupId || !password){
            return res.status(400).json({
                message: "잘못된 요청입니다"
            })
        }

        const isDelete = await groupService.deleted(groupId, password);

        res.status(200).json({
            message: "그룹 삭제 성공"
        })

    }catch(error){
        if(error.message == "비밀번호가 틀렸습니다"){
            res.status(403).json({
                message: "비밀번호가 틀렸습니다"
            })
        }

        else if(error.message == "존재하지 않습니다"){
            res.status(404).json({
                message: "존재하지 않습니다"
            })
        }

        res.status(500).json({
            message: "Server Error",
            error: error.message,
        })
    }
}

//그룹 상세 정보 조회하기
async function detailGroupList(req,res) {
    try{
        const {groupId} = req.params;

        if(!groupId){
            res.status(400).json({
                message: "잘못된 요청입니다"
            })
        }

        const detail = await groupService.detailInquire(groupId);

        if(detail){
            res.status(200).json(detail);
        }

    }catch(error){
        if(error.message == "존재하지 않습니다"){
            res.status(404).json({
                message: "존재하지 않습니다"
            })
        }
        
        res.status(500).json({
            message: "Server Error",
            error: error.message,
        })
    }
}

module.exports={
    register,
    groupList,
    modifyGroup,
    deleteGroup,
    detailGroupList,

}