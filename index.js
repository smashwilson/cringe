#!/usr/bin/env node
"use strict";

const path = require("path");
const fs = require("fs");

const logger = require("./lib/common").logger;

const name = require("./name");
const deploy = require("./deploy");
const cleanup = require("./cleanup");

const shellName = process.env.SHELL || "/bin/bash";
const scriptName = process.argv[2] || "cringe.sh";
let deploymentName = null;

name().then((n) => {
  deploymentName = n;
  logger.info(`Deploying ${scriptName} @ ${deploymentName}`);

  return deploy(shellName, scriptName, deploymentName);
}).then(() => {
  return cleanup(deploymentName);
}).then(() => {
  logger.info(`${scriptName} @ ${deploymentName}: success.`);
}).catch((err) => {
  logger.error(`${scriptName} @ ${deploymentName}: error.`, err);
  process.exit(1);
});
