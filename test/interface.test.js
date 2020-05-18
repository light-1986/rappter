const fs = require("fs-extra");
const dealSchema = require('../dealSchema')
const aJson = require("./data/a.json")
const bJson = require("./data/b.json")
const cJson = require("./data/c.json")

describe('', () => {
    it('ajson 测试', () => {
        const result = dealSchema(aJson);
        console.log(result.properties.platformName)
        // expect(result).toBeNull();
    })
    it('bjson 测试', () => {
        const result = dealSchema(bJson);
        console.log(result.properties.data.items.properties.platformName)
        // expect(result).toBeNull();
    })
    it('cjson 测试', () => {
        const result = dealSchema(cJson);
        fs.outputFileSync('./build/cJson.json', JSON.stringify(result), 'utf-8')
        expect(result.properties.code.type == 'string');
        console.log(result.properties.code.type, "cccc")
        // expect(result).toBeNull();
    })
})