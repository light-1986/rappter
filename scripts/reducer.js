const fs = require("fs-extra");
const path = require('path');
const getInterface = require("../util/getInterface")

module.exports = async function () {
    // 拉去接口列表
    const res = await getInterface();
    // console.log("data", Object.keys(data), data.config.url)
    let codeStr = `
import { combineReducers } from 'redux'
import { handleAction, handleActions, combineActions } from 'redux-actions';
    `;

    const getActionName = (element) => {
        let index = element.path.lastIndexOf("/");
        return element.path.slice(index + 1);
    }
    //在actionname的基础上，去掉了get
    const getReducerName = (item) => {
        let actionName = getActionName(item)
        if (/^get/.test(actionName)) {
            actionName = actionName.slice(3);
            actionName = actionName.replace(actionName[0], actionName[0].toLowerCase());
            return actionName;
        }
        return actionName;
    }

    const getImportActions = (list) => {
        const str = list.map(item => `\t${getActionName(item)}_success`).join(",\n");
        return ['\nimport {', str, '} from \'../actions\''].join("\n")
    }

    const getReducerStr = (list) => {
        return list.map(item => {
            let actionName = getActionName(item)
            let actionReducerName = getReducerName(item);
            return `
export const ${actionReducerName}_data = handleAction(${actionName}_success, (state, action) => {
	return { ...state, ...action.payload.data }
}, {})        
        `}).join("\n");
    }

    const getExportStr = (list) => {
        let str = list.map(item => {
            let actionName = getReducerName(item);

            return `\t${actionName}_data`
        }).join(",\n");

        return ['\nexport default combineReducers({', str, '})'].join('\n')
    }

    const { data } = res.data;
    const { list } = data;

    if (list.length > 0) {
        codeStr += getImportActions(list);
        codeStr += getReducerStr(list);
        codeStr += getExportStr(list)
        codeStr += `
//handleActions示例，可以删掉
/*
export const loginConfig = handleActions({
	[combineActions(getLoginConfig_success, login_success, verifysms_success)]: (state, action) => {
		return {}
	},
	[resetNeed_verify]: (state) => ({})
}, {})*/
        `
    }

    fs.outputFileSync(path.join(path.resolve(), 'reducer/demo.js'), codeStr, 'utf-8')
    // 生成对应的接口文件constants/Interface.js

}