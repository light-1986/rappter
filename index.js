#!/usr/bin/env node


const spawn = require('cross-spawn');

// Spawn NPM asynchronously
// const child = spawn('npm', ['list', '-g', '-depth', '0'], { stdio: 'inherit' });

// // Spawn NPM synchronously
// const result = spawn.sync('npm', ['list', '-g', '-depth', '0'], { stdio: 'inherit' })

//quicktype --just-types -o 129_req_body_other.ts --src-lang schema 129_req_body_other.json
// const result = spawn.sync('quicktype', ['--just-types', '-o', '129_req_body_other.ts', '--src-lang', 'schema', '129_req_body_other.json'])

// console.log("result ", result)
const program = require('commander');
const path = require('path')

const { version } = { version: '0.0.1' }

// console.log("-----", process.cwd("/etc"), path.resolve(__dirname, "etc/host"), __dirname)
// return;
const actionsMap = {
    // create: {
    //     description: 'crate project',
    //     alias: 'cr',
    //     examples: [
    //         'wby create <template-name>'
    //     ],
    // },
    // config: {
    //     description: 'config info',
    //     alias: 'c',
    //     examples: [
    //         'wby config get <k>',
    //         'wby config set <k> <v>'
    //     ]
    // },
    // build: {
    //     description: 'build',
    //     alias: 'bu',
    //     examples: [
    //         'wby build'
    //     ]
    // },
    // start: {
    //     description: 'start',
    //     alias: 's',
    //     examples: [
    //         'wby start'
    //     ]
    // },
    interface: {
        description: '生成接口约束文件.ts',
        alias: 'inter',
        examples: [
            'rappter interface'
        ]
    },
    actions: {
        description: '生成action creator.ts',
        alias: 'act',
        examples: [
            'rappter actions'
        ]
    }
}

Object.keys(actionsMap).forEach((key) => {
    const action = actionsMap[key]
    console.log(action)
    program
        .command(key)
        .alias(action.alias)
        .description(action.description)
        .action(() => {
            if (action === '*') {
                console.log(action.description)
            } else {

                console.log("===", process.argv.slice(3))
                require(path.resolve(__dirname, key))(...process.argv.slice(3))
            }
        });
})

program.on('--help', () => {
    Object.keys(actionsMap).forEach((key) => {
        const action = actionsMap[key];
        (action.examples || []).forEach((example) => {
            console.log(` ${example}`)
        })
    })
})

program
    .version(version)
    .parse(process.argv);

