
const axios = require("axios");
const path = require('path');
const package = require(path.join(path.resolve(), 'package.json'))
const rappterConfig = package.rappter || {};

const { host, pId, catid, limit, token } = rappterConfig

if (!host || !token) {
    console.warn("请查看当前目录下的package.json中的rappter配置,host和token不能为空")
}

function getInterface() {
    let ajaxUrl = `${host}/api/interface/list?token=${token}&project_id=${pId}&limit=${limit}`;

    if (catid) {
        ajaxUrl = `${host}/api/interface/list_cat?token=${token}&catid=${catid}&limit=${limit}`;
    }
    return axios.get(ajaxUrl);

}

module.exports = getInterface;