const fs = require('fs-extra');


fs.ensureFile  //创建不存在的目录和文件，但是不写入内容

```
    const fs = require('fs-extra')

    const file = '/tmp/this/path/does/not/exist/file.txt'
    fs.ensureFileSync(file)
    // file has now been created, including the directory it is to be placed in
```

fs.outputFileSync  //父目录不存在也可以写入文件。
几乎与writeFileSync（即覆盖）相同，除了如果父目录不存在，则创建它

```
    const fs = require('fs-extra')

    const file = '/tmp/this/path/does/not/exist/file.txt'
    fs.outputFileSync(file, 'hello!')

    const data = fs.readFileSync(file, 'utf8')
    console.log(data) // => hello!
```

// quicktype --just-types -o 129_req_body_other.ts --src-lang schema 129_req_body_other.json

## 添加配置

在当前项目目录下的package.json中添加下面配置
```
"rapper": {
    "host": "http://yapi.ops.tst-weiboyi.com",
    "token": "cdaa704992a8f30f1bbb9521a67f9d937d91021f2ea0bb50fb2f3ee62b45c3ec",
    "projectId": 129,
    "limit": 5
}
```
