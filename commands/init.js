// a collection of common interactive command line user interfaces;
const {prompt} = require('inquirer');
// The compllete solution for node.js command-line interfaces
const program = require('commander');
// 命令行颜色
const chalk = require('chalk');
// git下载操作
const download = require('download-git-repo');
// 命令行加载中效果
const ora = require('ora');
const fs = require('fs');
// const path = require('path');
const option =  program.parse(process.argv).args[0];
console.log('option',option);
const defaultName = typeof option === 'string' ? option : 'react-project';
const tplList = require(`${__dirname}/../templates`);
const tplLists = Object.keys(tplList) || [];
const question = [
    {
        type: 'input',
        name: 'name',
        message: 'Project name',
        default: defaultName,
        // filter(val) {
        //     return val.trim()
        // },
        validate(val) {// 格式化
            const validate = (val.trim().split(" ")).length === 1;
            return validate || 'Project name is not allowed to have spaces ';
        },
        transformer(val) {
            return val;
        }
    }, {
        type: 'list',
        name: 'template',
        message: 'Project template',
        choices: tplLists,
        default: tplLists[0],
        validate(val) {
            return true;
        },
        transformer(val) {
            return val;
        }
    }, {
        type: 'input',
        name: 'description',
        message: 'Project description',
        default: 'React project',
        validate (val) {
            return true;
        },
        transformer(val) {
            return val;
        }
    }, {
        type: 'input',
        name: 'author',
        message: 'Author',
        default: 'project author',
        validate (val) {
            return true;
        },
        transformer(val) {
            return val;
        }
    }
];
module.exports = prompt(question).then(({name, template, description, author}) => {
    const projectName = name;
    const templateName = template;
    const gitPlace = tplList[templateName]['place'];
    const gitBranch = tplList[templateName]['branch'];
    const spinner = ora('Downloading please wait...');
    spinner.start();
    download(`${gitPlace}${gitBranch}`, `./${projectName}`, (err) => {
        if (err) {
            console.log(chalk.red(err))
            process.exit()
        }
        fs.readFile(`./${projectName}/package.json`, 'utf8', function (err, data) {
            if(err) {
                spinner.stop();
                console.error(err);
                return;
            }
            const packageJson = JSON.parse(data);
            packageJson.name = name;
            packageJson.description = description;
            packageJson.author = author;
            var updatePackageJson = JSON.stringify(packageJson, null, 2);
            fs.writeFile(`./${projectName}/package.json`, updatePackageJson, 'utf8', function (err) {
                if(err) {
                    spinner.stop();
                    console.error(err);
                    return;
                } else {
                    spinner.stop();
                    console.log(chalk.green('project init successfully!'));
                    console.log(`
                    ${chalk.bgWhite.black('   Run Application  ')}
                    ${chalk.yellow(`cd ${name}`)}
                    ${chalk.yellow('npm install')}
                    ${chalk.yellow('npm start')}
          `         );
                }
            });
        });
    })
});
