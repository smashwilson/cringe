#!/usr/bin/env node
"use strict";

const path = require("path");
const fs = require("fs");

const logger = require("./lib/common").logger;

const name = require("./name");
const deploy = require("./deploy");
const cleanup = require("./cleanup");

const shellName = process.env.SHELL || "/bin/bash";
const scriptName = process.argv[2] || "scaffold.sh";
let deploymentName = null;

name().then((n) => {
  deploymentName = n;
  logger.info(`Deploying scaffolding ${scriptName} @ ${deploymentName}`);

  return deploy(shellName, scriptName, deploymentName);
}).then(() => {
  return cleanup(deploymentName);
}).then(() => {
  logger.info(`Scaffolding ${scriptName} @ ${deploymentName}: success.`);
}).catch((err) => {
  logger.error(`Scaffolding ${scriptName} @ ${deploymentName}: error.`, err);
  process.exit(1);
});
