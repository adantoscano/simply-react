#!/usr/bin/env node

const prompts = require('prompts');
const exec = require('child_process').exec
const fs = require('fs');
const gitTarget = "https://github.com/adantoscano/simply-react.git"

function makeDirname(name) {
  var dirname = name.toLowerCase().replace(/\s+/g, '_');
  return dirname;
}

async function installProject(name) {
  if (fs.existsSync(name)) {
    console.log('A project called ' + name + ' already exist in this directory. Please try again with a different name.');
  } else {
    console.log('Installing dependencies...')
    var folder_name = makeDirname(name);
    var action = 'git clone ' + gitTarget + ' ' + folder_name + '&& cd ' + folder_name + ' && npm install'
    exec(action, function (err, stdout, stderr) {
      if (err) {
        console.log('An error occurred. You may already have that starter kit installed.');
        console.log('Error:', err);
      } else {
        console.log('Installation complete! To start your project, type:');
        console.log('cd ' + folder_name + ' && npm start');
      }
    });
  }
}

async function getProjectName() {
  const response = await prompts([{
    type: 'text',
    name: 'name',
    message: 'Name your project:',
    validate: value => value ? true : 'Your project needs a name'
  }]);

  if (response.name === undefined) {
    process.exit();
  } else {
    return response.name;
  }
}


async function buildProject() {
  const name = await getProjectName();
  return installProject(name);
}

buildProject();