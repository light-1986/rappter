const fs = require("fs-extra");
const axios = require("axios");
const spawn = require('cross-spawn');
const path = require('path');
const dealSchema = require('./dealSchema')
const package = require(path.join(path.resolve(), 'package.json'))
const rappterConfig = package.rappter || {};

const { host, pId, catid, limit, token, interfaceIds = [] } = rappterConfig

if (!host || !token) {
    console.warn("请查看当前目录下的package.json中的rappter配置,host和token不能为空")
}

// const listUrl = `${host}/api/interface/list?token=${token}&project_id=${pId}&limit=${limit}`;
const getInterfaceUrlById = (host, token, id) => {
    return `${host}/api/interface/get?token=${token}&id=${id}`;
}
const jsonPaths = {
    res_body: [],
    req_body_other: []
}

let i = 0,
    count = limit,
    ST = new Date().getTime();    // 启动时间，计算执行总时长

async function entry() {
    let ajaxUrl = `${host}/api/interface/list?token=${token}&project_id=${pId}&limit=${limit}`;

    if (catid) {
        ajaxUrl = `${host}/api/interface/list_cat?token=${token}&catid=${catid}&limit=${limit}`;
    }
    // console.log("catid", catid, !!catid, ajaxUrl)
    if (interfaceIds.length > 0) {
        interfaceIds.forEach(_id => {
            start(getInterfaceUrlById(host, token, _id)).then(() => {
                transSchemaToTs(jsonPaths);
            })

        });
    } else {
        const res = await axios.get(ajaxUrl); //.then((res) => {})
        const { data, msg, errcode } = res.data;
        const { list } = data;
        count = list.length;
        const iterable = [];
        if (list.length > 0) {
            list.forEach(element => {
                console.log("start", element._id)
                iterable.push(start(getInterfaceUrlById(host, token, element._id)));
            });
        }
        Promise.all(iterable).then((values) => {
            transSchemaToTs(jsonPaths)
        })
    }

}



function start(url) {
    return axios.get(url).then((res) => {

        const { data, msg, errcode } = res.data;
        let { req_body_other, res_body } = data;


        const realPath = path.join(path.resolve(), 'src/types', data.path);

        if (res_body) {
            res_body = dealSchema(res_body);
            jsonPaths.res_body.push(realPath)
            generateSchema(realPath, 'res_body', res_body)
        }

        if (req_body_other) {
            req_body_other = dealSchema(req_body_other)
            jsonPaths.req_body_other.push(realPath)
            generateSchema(realPath, 'req_body_other', req_body_other)
        }
        console.log(`当前接口：${data.path}, 剩余接口数${count--}`);
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
    // console.log("generateTs", realPath, filename)
    spawn.sync('quicktype', [
        '--just-types',
        '-o', target,
        '--src-lang',
        'schema',
        soure
    ])
    // console.log('quicktype --just-types -o ' + target + ' --src-lang schema ' + soure)
}
function transSchemaToTs(jsonPaths) {
    const filenames = Object.keys(jsonPaths);
    filenames.forEach(filename => {
        jsonPaths[filename].forEach(path => {
            generateTs(path, filename)
        })
    })
}

//后续在增加
function generateAction() {

}

module.exports = entry;