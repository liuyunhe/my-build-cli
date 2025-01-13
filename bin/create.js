const path = require('path');
/**
 * 提供文件操作方法
*/
const fs = require('fs-extra');
/**
 * 命令行交互工具，用来询问用户的操作，让用户输入指定的信息，或给出对应的选项让用户选择
 * 
 * 此处 inquirer 的运用场景有 2 个:
 * 
  1）场景 1：当用户要创建的项目目录已存在时，提示用户是否要覆盖 or 取消

  2）场景 2：让用户输入项目的author作者和项目description描述
*/
const inquirer = require('inquirer');
const Generator = require('./generator');

module.exports = async function (name, options) {
  // process.cwd获取当前的工作目录
  const cwd = process.cwd();
  // path.join拼接 要创建项目的目录
  const targetAir = path.join(cwd, name);

  // 如果该目录已存在
  if (fs.existsSync(targetAir)) {
    // 强制删除
    if (options.force) {
      await fs.remove(targetAir);
    } else {
      // 通过inquirer：询问用户是否确定要覆盖 or 取消
      let { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: 'Target already exists',
          choices: [
            {
              name: 'overwrite',
              value: 'overwrite'
            },
            {
              name: 'cancel',
              value: false
            }
          ]
        }
      ]);
      if (!action) {
        return;
      } else {
        // 删除文件夹
        await fs.remove(targetAir);
      }
    }
  }

  const args = require('./ask');

  // 通过inquirer，让用户的输入的项目内容：作者和描述
  const ask = await inquirer.prompt(args);
  // 创建项目
  const generator = new Generator(name, targetAir, ask);
  generator.create();
};
