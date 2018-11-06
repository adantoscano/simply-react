const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const prompts = require('prompts');
const chalk = require('chalk');
const exec = require('child_process').exec
const fs = require('fs');
const PKG_VERSION = require('../package.json').version;
const gitTarget = "https://github.com/adantoscano/simply-react.git"

function say(args) {
  console.log(args);
}

const firstPass = commandLineArgs([{
    name: 'command',
    defaultOption: true
  },
  {
    name: 'version',
    alias: 'v',
    type: Boolean
  },
  {
    name: 'help',
    alias: 'h',
    type: Boolean
  }
], {
  stopAtFirstUnknown: true
})

const argv = firstPass._unknown || [];

if (firstPass.version) {
  say(PKG_VERSION);
} else {

  switch (firstPass.command) {
    case 'version':
      say(PKG_VERSION);
      break;
    case 'new':
      if (firstPass.help) {
        showUsageForNew();
      } else {
        const params = commandLineArgs([{
            name: 'name',
            alias: 'n',
            type: String,
          },
          {
            name: 'help',
            alias: 'h',
            type: Boolean
          }
        ], {
          argv
        });
        buildProject(params);
      }
      break;
    default:
      showUsage();
  }

}

function showUsage() {
  say(commandLineUsage(
    [{
        header: 'simply-react CLI',
        content: 'Just another react boilerplate intending to be easily understandable.'
      },
      {
        header: 'Example:',
        content: '$ simply-react new\n$ simply-react new --name coso'
      },
      {
        header: 'Command List',
        content: [{
            name: 'new',
            summary: 'Create a new React project'
          },
          {
            name: 'help',
            summary: 'Display this help information',
          },
          {
            name: 'version',
            summary: 'Display version of simply-react cli'
          }
        ]
      }
    ]
  ));
}

function showUsageForNew() {
  say(commandLineUsage(
    [{
        header: 'Create a new React project:',
        optionList: [{
            name: 'name',
            alias: 'n',
            description: 'Name for the new project',
          },
        ]
      },
      {
        header: 'Example:',
        content: '$ simply-react new --name coso'
      },
    ]
  ));
}

async function buildProject(options) {

  options.name = await getProjectName(options);

  return installProject(options);
}

async function getProjectName(options) {
  if (options.name) {
    return options.name;
  } else {
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
}


function makeDirname(name) {
  var dirname = name.toLowerCase().replace(/\s+/g, '_');
  return dirname;
}

async function installProject(opt_vars) {
  if (fs.existsSync(opt_vars.name)) {
    say('A project called ' + opt_vars.name + ' already exist in this directory. Please try again with a different name.');
  } else {
    say('Installing dependencies...')
    var folder_name = makeDirname(opt_vars.name);
    var action = 'git clone ' + gitTarget + ' ' + folder_name + '&& cd ' + folder_name + ' && npm install'
    exec(action, function (err, stdout, stderr) {
      if (err) {
        say('An error occurred. You may already have that starter kit installed.');
        say('Error:', err);
      } else {
        say(chalk.bold('Installation complete! To start your project, type:'));
        say('cd ' + folder_name + ' && npm start');
      }
    });
  }
}