"use strict";

const common = require("../common");
const cmd = common.cmd;
const labelArg = common.labelArg;
const logger = common.logger;

function RunCommand(options) {
  this.args = [];
  this.singleton = false;
  this.containerName = null;
  this.options = options;
  this.state = defaultState;
};

module.exports = RunCommand;

RunCommand.prototype.accept = function (arg, wasTemplated) {
  if (arg === "run") return;

  this.state(this, arg, wasTemplated);
};

RunCommand.prototype.finalize = function () {
  if (!this.singleton) {
    this.args = [ "run", "--label", labelArg(this.options) ].concat(this.args);
  }
};

RunCommand.prototype.execute = function () {
  if (!this.singleton) {
    if (this.containerName) {
      logger.info(`Launching container "${this.containerName}".`)
    } else {
      logger.info(`Launching container ${this.args.join(' ')}.`);
    }

    return cmd('docker', this.args);
  }

  return cmd('docker', ['ps', '--quiet', '--filter', `name=${this.containerName}`]).then((output) => {
    if (output.length > 0) {
      return cmd('docker', this.args);
    } else {
      logger.info(`Singleton container "${this.containerName}" already exists.`);
    }
  });
};

const defaultState = function (cmd, arg, wasTemplated) {
  switch (arg) {
    case "--name":
      cmd.state = nameState;
      return;
  }

  cmd.args.push(arg);
};

const nameState = function (cmd, arg, wasTemplated) {
  cmd.containerName = arg;
  if (!wasTemplated) cmd.singleton = true;

  cmd.state = defaultState;
};
