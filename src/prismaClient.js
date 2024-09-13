//prisma client 클래스를 가져옴
//구조분해할당으ㅗㄹ prismaClient만 추출해서 가져오는거임
const{ PrismaClient } = require('@prisma/client'); 

//prismaclient 클라스는 db와 상호작용하는 클라이언트 객체를 만듦
//prismaclient의 인스턴스를 생성
const prisma = new PrismaClient();
module.exports = prisma;