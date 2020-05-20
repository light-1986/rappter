const fs = require("fs-extra");
const axios = require("axios");
const spawn = require('cross-spawn');
const path = require('path');
let ejs = require('ejs');


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

function getInterface() {
    let ajaxUrl = `${host}/api/interface/list?token=${token}&project_id=${pId}&limit=${limit}`;

    if (catid) {
        ajaxUrl = `${host}/api/interface/list_cat?token=${token}&catid=${catid}&limit=${limit}`;
    }
    return axios.get(ajaxUrl);

}

module.exports = async function () {
    // 拉去接口列表
    const res = await getInterface();
    // console.log("data", Object.keys(data), data.config.url)
    let codeStr = `
import { createHttpAction } from 'redux-action-extend'
import { createAction } from 'redux-actions';

    `
    const getActionsStr = (element) => {
        let index = element.path.lastIndexOf("/");
        let actionName = element.path.slice(index + 1);
        return `
export const {
    ${actionName},
    ${actionName}_success
} = createHttpAction('${actionName}', '${element.path}', {method: '${element.method}'})
        `
    }

    const { data, msg, errcode } = res.data;
    const { list } = data;
    const iterable = [];
    if (list.length > 0) {
        list.forEach(element => {
            codeStr += getActionsStr(element)
        });
    }

    fs.outputFileSync(path.join(path.resolve(), 'actions/demo.js'), codeStr, 'utf-8')
    // 生成对应的接口文件constants/Interface.js

}