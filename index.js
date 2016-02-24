#!/usr/bin/env node
"use strict";

const path = require("path");
const spawn = require("child_process").spawn;

const shellName = process.env.SHELL || "/bin/bash";
const scriptName = process.argv[2] || "scaffold.sh";
const binDir = path.join(__dirname, 'bin');

const shellEnv = Object.create(process.env);
shellEnv.PATH = `${binDir}:${shellEnv.PATH}`;

const shell = spawn(shellName, [scriptName], {
  env: shellEnv
});

shell.stdout.on("data", (chunk) => {
  process.stdout.write(chunk);
});

shell.stderr.on("data", (chunk) => {
  process.stderr.write(chunk);
});

shell.on("close", (code) => {
  if (code !== 0) {
    console.error(`Shell exited with status ${code}.`);
    process.exit(code);
  }
});
