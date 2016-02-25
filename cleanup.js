"use strict";

const common = require("./lib/common");
const logger = common.logger;
const cmd = common.cmd;
const LABEL_KEY = common.LABEL_KEY;

module.exports = function (deploymentName) {
  const psArgs = [
    "ps", "--quiet",
    "--filter", `label=${LABEL_KEY}`,
    "--format", `{{ .ID }} {{ .Label "${LABEL_KEY}"}}`
  ];
  return cmd("docker", psArgs).then((stdout) => {
    let ids = stdout.split(/\n/)
      .filter((line) => line.length > 0)
      .map((line) => {
        let parts = line.split(/\s+/);
        return { id: parts[0], deployment: parts[1] };
      })
      .filter((c) => c.deployment !== deploymentName)
      .map((c) => c.id);

    if (ids.length === 0) {
      logger.verbose("No containers to clean up.");
      return;
    }

    logger.info(`Cleaning up ${ids.length} containers.`);
    logger.verbose("Container IDs", ids);

    let rmArgs = ["rm", "-f"].concat(ids);
    return cmd("docker", rmArgs);
  });
};
