"use strict";

const execFile = require("child_process").execFile;
const winston = require("winston");

exports.cmd = function (commandName, args) {
  let shellEnv = Object.create(process.env);
  shellEnv.PATH = process.env.SCAFFOLD_ORIGINAL_PATH;

  return new Promise((resolve, reject) => {
    const p = execFile(commandName, args, { env: shellEnv }, (err, stdout, stderr) => {
      if (err) return reject(err);

      process.stderr.write(stderr);

      resolve(stdout);
    });
  });
};

const LABEL_KEY = exports.LABEL_KEY = "com.github.smashwilson.scaffold";

exports.labelArg = (options) => `${LABEL_KEY}=${options.deploymentName}`;

exports.logger = new (winston.Logger)({
  level: process.env.SCAFFOLD_LOG_LEVEL || 'info',
  transports: [
    new (winston.transports.Console)({
      colorize: true
    })
  ]
});
