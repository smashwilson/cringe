#!/usr/bin/env node
"use strict";

const path = require("path");
const fs = require("fs");

const shellName = process.env.SHELL || "/bin/bash";
const scriptName = process.argv[2] || "scaffold.sh";

const name = require("./name");
const deploy = require("./deploy");
const logger = require("./lib/common").logger;

let deploymentName = null;

name().then((n) => {
  deploymentName = n;
  logger.info(`Deploying scaffolding ${scriptName} @ ${deploymentName}`);

  return deploy(shellName, scriptName, deploymentName);
}).then(() => {
  logger.info(`Scaffolding ${scriptName} @ ${deploymentName}: success.`);
}).catch((err) => {
  logger.error(`Scaffolding ${scriptName} @ ${deploymentName}: error.`, err);
  process.exit(1);
});
