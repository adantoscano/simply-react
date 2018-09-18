#!/usr/bin/env node

var Vorpal = require('vorpal');
var chalk = Vorpal().chalk;
var exec = require('child_process').exec
var fs = require('fs');

var cli = Vorpal()

var app_vars;

function makeDirname(name) {
  var dirname = name.toLowerCase().replace(/\s+/g, '_');
  return dirname;
}

function askAppName(i) {
  return new Promise(function (resolve, reject) {
    var self = i;
    if (app_vars.name) {
      resolve(app_vars.name);
    } else {
      self.prompt({
        type: 'input',
        name: 'name',
        message: chalk.bold('What would you like to name your app?\n> ')
      }, function (result) {
        if (result.name) {
          app_vars.name = result.name;
          resolve(result.name);
        } else {
          reject({});
        }
      });
    }
  });
}

function getAppInput(self, app_vars) {
  return new Promise(function (resolve, reject) {
    askAppName(self).then(function (name) {
      self.log(`Your app shall be called ${name}!`);
      resolve(app_vars);
    }).catch(reject);
  });
}

function buildApp(i, app_vars, cb) {
  var self = i;
  if (fs.existsSync(app_vars.name)) {
    self.log('A folder called ' + app_vars.name + ' already exist in this directory. Please try again with a different name.');
    cb();
  } else {
    self.log('Installing App...');
    var page = 'https://github.com/adantoscano/react-simple';
    var now = new Date();
    var temp_folder_name = String(now.getTime());
    var folder_name = makeDirname(app_vars.name);
    var action = 'git clone ' + page + ' ' + folder_name + '&& cd ' + folder_name + ' && npm install'
    exec(action, function (err, stdout, stderr) {
      if (err) {
        self.log('An error occured. You may already have that starter kit installed.');
        self.log('Error:', err);

        cb();
      } else {
        self.log('Installing dependencies...');
        self.log(chalk.bold('Installation complete! To start your app, type:'));
        self.log('cd ' + folder_name + ' && node .');
        cb();
      }
    });
  }
}

cli
  .command('new')
  .option('-n, --name [name]', 'Name of your App')
  .description('Configure a new React-powered application')
  .action(function (args, cb) {
    var self = this;
    switch (args.obj) {
      default:
      case 'app':
        app_vars = {};
        if (args.options.name) {
          app_vars.name = args.options.name
        }
        if (args.options.platform) {
          app_vars.platform = args.options.platform;
        }
        if (args.options.studio_token) {
          app_vars.studio_token = args.options.studio_token
        }
        getAppInput(self, app_vars).then(function (res) {
          buildApp(self, app_vars, cb);
        }).catch(function (err) {
          cb();
        });
        break;
    }
  });


cli
  .delimiter(chalk.magenta('lordevs $'))
  .show()
  .parse(process.argv)