#!/usr/bin/env node
process.env.NODE_PATH=__dirname+'/../node_modules';
const res = command => {
    console.log(command);
    return resolve(__dirname,'../commands',command)
};
const  {resolve} = require('path');
const program = require('commander');

program.version(require('../package').version )
//
// program.usage('<command>')
//
program.command('init')
    .option('-f, --foo', 'enable some foo')
//     .parse(process.argv)
    .description('Generate a new project')
    .alias('i')
    .action(() => {
        console.log(require(res('init')));
    });

program.parse(process.argv);

if(!program.args.length){
    // console.log(program);
    program.help()
}