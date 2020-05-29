const jsonFormat = require('json-format');
/**
 * 
 * @param {*} data schema
 * 递归处理type不支持的数据
 */

function deal(data) {
    if (data.type == 'object') {
        let _pro = data.properties;
        for (const key in _pro) {
            if (Object.prototype.hasOwnProperty.call(_pro, key)) {
                const element = _pro[key];
                if (element.type === 'String') {
                    element.type = 'string'
                } else if (element.type === 'object') {
                    deal(element)
                } else if (element.type === 'array') {
                    deal(element.items)
                } else {
                    switch (element.type.toLowerCase()) {
                        case "int":
                        case "int[]":
                        case "integer":
                        case "date":
                        case "long":
                        case "number":
                            element.type = 'number'
                            break;

                        default:
                            break;
                    }
                }
            }
        }
    } else if (data.type === 'array') {
        deal(data.items)
    }
    return data;
}


module.exports = (data) => {
    let newData = (typeof data == 'string') ? JSON.parse(data) : data;
    return jsonFormat(deal(newData))
}
