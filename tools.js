const jsonFormat = require('json-format');
const {
    quicktype,
    InputData,
    jsonInputForTargetLanguage,
    JSONSchemaInput,
    JSONSchemaStore,
} = require("quicktype-core");

function dealBaseType(data) {
    if (data.type === 'String') {
        data.type = 'string'
    } else {
        switch (data.type.toLowerCase()) {
            case "int":
            case "int[]":
            case "integer":
            case "date":
            case "long":
            case "number":
                data.type = 'number'
                break;

            default:
                break;
        }
    }
    if (data.mock) {
        delete data.mock
    }
}
/**
 * 
 * @param {*} data schema
 * 递归处理type不支持的数据
 */
function deal(data) {
    if (!data) {
        return {};
    }
    if (data.type == 'object') {
        let _pro = data.properties;
        for (const key in _pro) {
            if (_pro.hasOwnProperty(key)) {
                const element = _pro[key];
                if (element.type === 'object') {
                    deal(element)
                } else if (element.type === 'array') {
                    deal(element.items)
                } else {
                    dealBaseType(element)
                }
            }
        }
    } else if (data.type === 'array') {
        deal(data.items)
    } else {
        dealBaseType(data)
    }
    return data;
}
function transformationForReqQuery(req_query = []) {
    let schema = {
        "type": "object",
        "required": [],
        "description": "PageReq<UrlMonitorTaskReqVO> :PageReq",
        "properties": {

        }
    }
    req_query.forEach((item) => {
        if (item.required) {
            schema.required.push(item.name)
        }
        schema.properties[item.name] = {
            type: item.example,
            description: item.desc
        }
    })

    return schema
}

function combineSchema(data) {
    let reqSchema, resSchema;
    let regVo = /\<(\w+)\>/;

    let { method, req_body_other, res_body, req_query, status, title, path, up_time, description } = data;
    if (method.toLowerCase() == 'get') {
        reqSchema = transformationForReqQuery(req_query)
    }
    if (method.toLowerCase() == 'post') {
        reqSchema = JSON.parse(req_body_other)
    }
    resSchema = JSON.parse(res_body);
    ;


    //这里因为后端title返回的vo存在重复的现象，所以使用文件名作为接口唯一标示
    // const voKey = (regVo.exec(title) || []).pop() 
    //     || path.split("/").pop()
    const voKey = path.split("/").pop();
    return {
        "type": "object",
        "title": title,
        "required": [],
        "description": description,
        "properties": {
            ['I' + voKey + 'Req']: deal(reqSchema),
            ['I' + voKey + 'Res']: deal(resSchema.properties.data)
        }
    }
}


// module.exports = (data, key) => {
//     let newData = (typeof data == 'string') ? JSON.parse(data) : data;
//     newData = deal(newData);
//     if (key) {
//         // newData.properties["I" + key] = newData.properties.data;
//         // delete newData.properties.data;
//         newData = newData.properties.data;
//     }
//     newData = jsonFormat(newData)
//     return newData
// }

/**
 * 使用json生成ts文件
 * @param {*} targetLanguage 
 * @param {*} typeName 
 * @param {*} jsonSchemaString 
 */
async function quicktypeJSON(targetLanguage, typeName, jsonString) {
    const jsonInput = jsonInputForTargetLanguage(targetLanguage);

    // We could add multiple samples for the same desired
    // type, or many sources for other types. Here we're
    // just making one type from one piece of sample JSON.
    await jsonInput.addSource({
        name: typeName,
        samples: [jsonString],
    });

    const inputData = new InputData();
    inputData.addInput(jsonInput);

    return await quicktype({
        inputData,
        lang: targetLanguage,
        rendererOptions: {
            'just-types': true,
            'runtime-typecheck': false
        },
    });
}
/**
 * 使用jsonSchema生成ts文件
 * @param {*} targetLanguage 
 * @param {*} typeName 
 * @param {*} jsonSchemaString
 * @param {*} justTypes 
 */
async function quicktypeJSONSchema(targetLanguage, typeName, jsonSchemaString, justTypes = true) {
    const schemaInput = new JSONSchemaInput(new JSONSchemaStore());

    // We could add multiple schemas for multiple types,
    // but here we're just making one type from JSON schema.
    await schemaInput.addSource({ name: typeName, justTypes: true, schema: jsonSchemaString });

    const inputData = new InputData();
    inputData.addInput(schemaInput);

    return await quicktype({
        inputData,
        lang: targetLanguage,
        rendererOptions: {
            'just-types': justTypes,
            'runtime-typecheck': true
        }
    });
}
function writeIndex() {
    const data = {

    }
    writeFile(`${realPath}/${dataReplaceKey}.ts`, lines.join("\n"))
}

function writeFile(path, content) {
    fs.outputFileSync(path, content, 'utf-8')
}
exports.quicktypeJSONSchema = quicktypeJSONSchema;
exports.quicktypeJSON = quicktypeJSON;
exports.combineSchema = combineSchema