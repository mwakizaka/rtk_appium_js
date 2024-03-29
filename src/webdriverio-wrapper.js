const url = require('url');
const webdriverio = require("webdriverio");

const createWdIOByInit = async function (driverUrl, isW3c, caps) {
  const remoteOptions = generateRemoteOptions(driverUrl, isW3c, caps);
  return webdriverio.remote(remoteOptions);
}

const generateRemoteOptions = function (driverUrl, isW3c, caps) {
  const options = generateBaseOptions(driverUrl, isW3c);
  return Object.assign(options, {capabilities: caps});
}

const generateBaseOptions = function (driverUrl, isW3c) {
  const parsedUrl = url.parse(driverUrl);
  return {
    // logLevel: 'silent',
    protocol: parsedUrl.protocol.substring(0, parsedUrl.protocol.length - 1),
    hostname: parsedUrl.hostname,
    path: parsedUrl.pathname,
    isW3C: isW3c,
    port: 443,
    connectionRetryTimeout: 1200000, // to avoid Timeout awaiting 'request' like https://app.hubspot.com/live-messages/21173256/inbox/4396764332#comment, TODO: specify based on platforms/environments
    connectionRetryCount: 0
  };
}

exports.createWdIOByInit = createWdIOByInit