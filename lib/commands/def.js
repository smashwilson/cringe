"use strict";

const cmd = require("../common").cmd;

// Pass through all docker commands that are not explicitly processed as they are.

function DefaultCommand(options) {
  this.args = [];
};

DefaultCommand.prototype.accept = function (arg) {
  this.args.push(arg);
};

DefaultCommand.prototype.finalize = function () { };

DefaultCommand.prototype.execute = function () {
  return cmd("docker", this.args);
};

module.exports = DefaultCommand;
