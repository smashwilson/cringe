const fs = require("fs");
const crypto = require("crypto");

module.exports = function () {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(8, (err, buf) => {
      if (err) return reject(err);

      resolve(buf.toString('hex'));
    });
  });
};
