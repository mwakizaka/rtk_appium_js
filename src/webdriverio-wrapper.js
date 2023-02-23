const url = require('url');
const webdriverio = require("webdriverio");

const createWdIOByInit = async function (driverUrl, w3cCaps) {
  const remoteOptions = generateRemoteOptions(driverUrl, w3cCaps);
  return webdriverio.remote(remoteOptions);
}

const generateRemoteOptions = function (driverUrl, w3cCaps) {
  const options = generateBaseOptions(driverUrl);
  return Object.assign(options, {capabilities: w3cCaps});
}

const generateBaseOptions = function (driverUrl) {
  const parsedUrl = url.parse(driverUrl);
  return {
    // logLevel: 'silent',
    protocol: parsedUrl.protocol.substring(0, parsedUrl.protocol.length - 1),
    hostname: parsedUrl.hostname,
    path: parsedUrl.pathname,
    isW3C: true,
    port: 443,
    connectionRetryCount: 0
  };
}

exports.createWdIOByInit = createWdIOByInit