"use strict";

// Translate the command-line arguments that were supplied to the Docker interceptor to the arguments
// that should be sent to the actual, underlying Docker command.

const commands = require("./commands");

module.exports = function (options, args) {
  if (args.length <= 2) {
    return ["docker"].concat(args);
  }

  // Dispatch on the top-level argument to Docker.
  let Command = commands[args[2]];
  if (!Command) {
    Command = commands.def;
  }

  let cmd = new Command(options);
  for (let i = 2; i < args.length; i++) {
    let templated = args[i].replace(/DNAME/, options.deploymentName);

    cmd.accept(args[i], templated !== args[i]);
  }

  cmd.finalize();

  return cmd;
};
