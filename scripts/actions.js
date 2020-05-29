const fs = require("fs-extra");
const path = require('path');
const getInterface = require("../util/getInterface")
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

    const { data } = res.data;
    const { list } = data;
    if (list.length > 0) {
        list.forEach(element => {
            codeStr += getActionsStr(element)
        });
    }

    fs.outputFileSync(path.join(path.resolve(), 'actions/demo.js'), codeStr, 'utf-8')
    // 生成对应的接口文件constants/Interface.js

}