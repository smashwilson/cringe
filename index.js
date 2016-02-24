#!/usr/bin/env node
"use strict";

const path = require("path");
const fs = require("fs");

const shellName = process.env.SHELL || "/bin/bash";
const scriptName = process.argv[2] || "scaffold.sh";

const name = require("./name");
const deploy = require("./deploy");

let deploymentName = null;

name().then((n) => {
  deploymentName = n;
  console.log(`Deploying scaffolding ${scriptName} @ ${deploymentName}`);

  return deploy(shellName, scriptName, deploymentName);
}).then(() => {
  console.log(`Scaffolding ${scriptName} @ ${deploymentName}: success.`);
}).catch((err) => {
  console.error(`Scaffolding ${scriptName} @ ${deploymentName}: error.`);
  console.error(err);

  process.exit(1);
});
