const spawn = require("child_process").spawn;
const path = require("path");

module.exports = function (shellName, scriptName, deploymentName) {
  return new Promise((resolve, reject) => {
    const binDir = path.join(__dirname, 'bin');
    const shellEnv = Object.create(process.env);
    shellEnv.CRINGE_ORIGINAL_PATH = process.env.PATH;
    shellEnv.CRINGE_DEPLOYMENT_NAME = deploymentName;
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
        return reject(new Error(`Shell exited with status ${code}.`));
      }

      resolve();
    });
  });
}
