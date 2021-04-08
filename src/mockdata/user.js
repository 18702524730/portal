import Mock from 'mockjs';
const LoginUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    avatar: 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png',
    name: 'lbc'
  }
];

const Users = [];

for (let i = 0; i < 86; i++) {
  Users.push(Mock.mock({
    id: Mock.Random.guid(),
    name: Mock.Random.cname(),
    addr: Mock.mock('@county(true)'),
    'age|18-60': 1,
    birth: Mock.Random.date(),
    sex: Mock.Random.integer(0, 1),
    test: Mock.Random.csentence(5,15)
  }));
}

//模拟商标信息
const TrademarkData = [];

for (let i = 0; i < 168; i++){
  TrademarkData.push(Mock.mock({
    id: Mock.Random.guid(),//分类号
    signNum:Mock.mock({"number|+1": 9875767}).number,//商标注册号
    trademarkName: Mock.Random.image('120x120', '#50B347', '#FFF', 'SEBE'),//商标名称/图形
    signPeople: Mock.Random.ctitle(6,12) + '有限公司',//注册人
    applyDate:Mock.Random.date(),//申请日期
    signDate:Mock.Random.date(),//注册日期
    usedPro:Mock.Random.csentence(10,50),//使用商品
    legalStatus:Mock.Random.csentence(5,15)//法律状态
  }));
}



export { LoginUsers, Users, TrademarkData };
