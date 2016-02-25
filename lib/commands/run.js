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

RunCommand.prototype.accept = function (arg, wasTemplated, i) {
  // Omit the initial "run" so we can prepend arguments to `docker run` in finalize().
  if (arg === "run" && i === 0) return;

  this.state(this, arg, wasTemplated);
};

RunCommand.prototype.finalize = function () {
  if (!this.singleton) {
    this.args = [ "run", "--label", labelArg(this.options) ].concat(this.args);
  } else {
    this.args = [ "run" ].concat(this.args);
  }
};

RunCommand.prototype.execute = function () {
  if (!this.singleton) {
    logger.info(`Launching container "${this.containerDescriptor()}".`);

    return cmd('docker', this.args);
  }

  return cmd('docker', ['ps', '--quiet', '--filter', `name=${this.containerName}`]).then((output) => {
    if (output.length === 0) {
      logger.info(`Launching singleton container ${this.containerDescriptor()}.`);
      return cmd('docker', this.args);
    } else {
      logger.info(`Singleton container "${this.containerDescriptor()}" already exists.`);
    }
  });
};

RunCommand.prototype.containerDescriptor = function () {
  if (this.containerName) {
    return this.containerName;
  } else {
    return this.args.join(" ");
  }
};

const defaultState = function (cmd, arg, wasTemplated) {
  cmd.args.push(arg);

  switch (arg) {
    case "--name":
      cmd.state = nameState;
      return;
  }
};

const nameState = function (cmd, arg, wasTemplated) {
  cmd.args.push(arg);

  cmd.containerName = arg;
  if (!wasTemplated) cmd.singleton = true;

  cmd.state = defaultState;
};
