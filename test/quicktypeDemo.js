const {
    quicktype,
    InputData,
    jsonInputForTargetLanguage,
    JSONSchemaInput,
    JSONSchemaStore,
} = require("quicktype-core");

let jsonSchemaString = require("./data/aa.json");
jsonSchemaString = JSON.stringify(jsonSchemaString)

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
            'runtime-typecheck': false
        }
    });
}

async function main() {
    // const { lines: swiftPerson } = await quicktypeJSON(
    //     "ts",
    //     "Person",
    //     jsonSchemaString
    // );
    // console.log(swiftPerson.join("\n"));

    const { lines: pythonPerson } = await quicktypeJSONSchema(
        "ts",
        "Person",
        jsonSchemaString
    );
    console.log(pythonPerson.join("\n"));
}
main();
exports.quicktypeJSONSchema = quicktypeJSONSchema;
exports.quicktypeJSON = quicktypeJSON;