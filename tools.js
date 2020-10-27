const jsonFormat = require('json-format');
const {
    quicktype,
    InputData,
    jsonInputForTargetLanguage,
    JSONSchemaInput,
    JSONSchemaStore,
} = require("quicktype-core");
/**
 * 
 * @param {*} data schema
 * 递归处理type不支持的数据
 */
function deal(data) {
    if (data.type == 'object') {
        let _pro = data.properties;
        for (const key in _pro) {
            if (_pro.hasOwnProperty(key)) {
                const element = _pro[key];
                if (element.mock) {
                    delete element.mock
                }
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
        deal(element.items)
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
    const _req_query = [{
        required: '1',
        _id: '5f969e7864f1ac6a3ebf3edc',
        name: 'taskId',
        example: 'String',
        desc: '(String)'
    },
    {
        required: '1',
        _id: '5f969e7864f1ac1cd5bf3edb',
        name: 'age',
        example: 'number',
        desc: ''
    }];



    let { method, req_body_other, res_body, req_query, status, title, path, up_time, description } = data;
    if (method.toLowerCase() == 'get') {
        reqSchema = transformationForReqQuery(req_query)
    }
    if (method.toLowerCase() == 'post') {
        reqSchema = JSON.parse(req_body_other)
    }
    resSchema = JSON.parse(res_body);
    ;
    console.log(regVo.exec(title), path)
    const voKey = (regVo.exec(title) || []).pop()
        || path.split("/").pop()
    return {
        "type": "object",
        "title": title,
        "required": [],
        "description": description,
        "properties": {
            [voKey + 'Req']: deal(reqSchema),
            [voKey + 'Res']: deal(resSchema.properties.data)
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

async function main() {
    const { lines: swiftPerson } = await quicktypeJSON(
        "ts",
        "Person",
        jsonSchemaString
    );
    console.log(swiftPerson.join("\n"));

    // const { lines: pythonPerson } = await quicktypeJSONSchema(
    //     "ts",
    //     "Person",
    //     jsonSchemaString
    // );
    // console.log(pythonPerson.join("\n"));
}
// main();
exports.quicktypeJSONSchema = quicktypeJSONSchema;
exports.quicktypeJSON = quicktypeJSON;
exports.combineSchema = combineSchema