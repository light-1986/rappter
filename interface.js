const fs = require("fs-extra");
const axios = require("axios");
const spawn = require('cross-spawn');
const path = require('path');
const dealSchema = require('./tools')
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

let i = 0,
    count = limit,
    ST = new Date().getTime();    // 启动时间，计算执行总时长

async function entry() {
    let ajaxUrl = `${host}/api/interface/list?token=${token}&project_id=${pId}&limit=${limit}`;

    if (catid) {
        ajaxUrl = `${host}/api/interface/list_cat?token=${token}&catid=${catid}&limit=${limit}`;
    }

    if (interfaceIds.length > 0) {
        interfaceIds.forEach(_id => {
            start(getInterfaceUrlById(host, token, _id))
        });
    } else {
        const res = await axios.get(ajaxUrl); //.then((res) => {})
        const { data, msg, errcode } = res.data;
        const { list } = data;
        count = list.length;
        const iterable = [];
        if (list.length > 0) {
            list.forEach(element => {
                iterable.push(start(getInterfaceUrlById(host, token, element._id)));
            });
        }

    }

}

function start(url) {
    return axios.get(url).then(async (res) => {

        const { data, msg, errcode } = res.data;
        const _path = data.path.split("/");
        const dataReplaceKey = _path.pop();
        const realPath = path.join(path.resolve(), 'src/types', _path.join("/"));
        const __data = dealSchema.combineSchema(data);
        const { lines } = await dealSchema.quicktypeJSONSchema(
            "ts",
            dataReplaceKey,
            JSON.stringify(__data)
        );

        fs.outputFileSync(`${realPath}/${dataReplaceKey}.ts`, lines.join("\n"), 'utf-8')
    })
}

module.exports = entry;