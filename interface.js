const fs = require("fs-extra");
const axios = require("axios");
const spawn = require('cross-spawn');
const path = require('path');
const package = require(path.join(path.resolve(), 'package.json'))
const rappterConfig = package.rappter || {};

// const data = "{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"type\":\"object\",\"properties\":{\"code\":{\"type\":\"string\",\"description\":\"返回编号\",\"mock\":{\"mock\":\"1000\"}},\"msg\":{\"type\":\"string\",\"description\":\"返回消息\",\"mock\":{\"mock\":\"success\"}},\"data\":{\"type\":\"object\",\"properties\":{\"list\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"userId\":{\"type\":\"integer\",\"description\":\"主账号id\"},\"identityName\":{\"type\":\"string\",\"description\":\"主账号名称\"},\"isDeleted\":{\"type\":\"integer\",\"description\":\"删除状态 1已删除，2未删除\",\"enum\":[1,2]}},\"required\":[]}},\"pageNum\":{\"type\":\"integer\",\"description\":\"页码\"},\"pageSize\":{\"type\":\"integer\",\"description\":\"每页条数\"},\"pages\":{\"type\":\"integer\",\"description\":\"总页数\"},\"total\":{\"type\":\"integer\",\"description\":\"总条数\"}},\"required\":[\"pageNum\",\"pageSize\",\"pages\",\"total\"]}},\"required\":[\"data\",\"code\",\"msg\"]}"

const host = rappterConfig.host;
const pId = rappterConfig.projectId;
const limit = rappterConfig.limit;
const token = rappterConfig.token;

if (!host || !token) {
    console.warn("请查看当前目录下的package.json中的rappter配置,host和token不能为空")
}

const listUrl = `${host}/api/interface/list?token=${token}&project_id=${pId}&limit=${limit}`;
const getInterfaceUrlById = (host, token, id) => {
    return `${host}/api/interface/get?token=${token}&id=${id}`;
}

let i = 0,
    count = limit,
    ST = new Date().getTime();    // 启动时间，计算执行总时长

async function entry() {
    const res = await axios.get(listUrl); //.then((res) => {})
    const { data, msg, errcode } = res.data;
    const { list } = data;
    // count = data.total;
    if (list.length > 0) {
        list.forEach(element => {
            start(getInterfaceUrlById(host, token, element._id))
        });
    }
}

function start(url) {
    axios.get(url).then((res) => {

        const { data, msg, errcode } = res.data;
        const { req_body_other, res_body } = data;

        const realPath = path.join(path.resolve(), 'src/types', data.path);
        if (res_body) {
            generateSchema(realPath, 'res_body', res_body)
            generateTs(realPath, 'res_body');
        }

        if (req_body_other) {
            generateSchema(realPath, 'req_body_other', req_body_other)
            generateTs(realPath, 'req_body_other')
        }
        console.log(`剩余接口数${count--}`);
        if (count === 0) {
            console.log("总耗时: ", (new Date().getTime()) - ST);
        }
    })
}
function generateSchema(realPath, filename, data) {
    filename = `${realPath}/${filename}.json`;
    fs.outputFileSync(filename, data, 'utf-8')
}

//按schema.json文件在同一文件夹下生成.ts文件
function generateTs(realPath, filename) {
    const soure = path.join(realPath, `${filename}.json`);
    const target = path.join(realPath, `${filename}.ts`);
    spawn.sync('quicktype', [
        '--just-types',
        '-o', target,
        '--src-lang',
        'schema',
        soure
    ])
}
//后续在增加
function generateAction() {

}

module.exports = entry;