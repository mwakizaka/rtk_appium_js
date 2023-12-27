const assert = require('assert');
const asyncbox = require('asyncbox');
const wrapper = require('./webdriverio-wrapper');
const path = require("path");
const shelljs = require("shelljs");
const fse = require("fs-extra");

const accessToken = process.env.RTK_ACCESS_TOKEN;
const appUrl = process.env.RTK_APP_URL;
const bundleId = process.env.RTK_BUNDLE_ID;
assert(accessToken, 'accessToken is empty');
assert(appUrl, 'appUrl is empty');
assert(bundleId, 'bundleId is empty');

const sleep = async function (milliSeconds) {
  return new Promise(resolve => setTimeout(resolve, milliSeconds));
};

async function runRtkTest () {
    const capabilities = {
    "appium:noReset": false,
    "appium:accessToken": accessToken,
    "platformName": "iOS",
    "appium:automationName": "XCUITest",
    "appium:platformVersion": "16",
    "appium:deviceName": "iPhone",
    "appium:app": appUrl,
    "appium:bundleId": bundleId,
    "appium:logLevel": "debug",
    "appium:appiumVersion": "2.0.0"
  }
  let driver;
  try {
    driver = await wrapper.createWdIOByInit('https://gwjp.appkitbox.com/wd/hub', true, capabilities);

    const deviceTime = await driver.getDeviceTime();
    const image = await driver.takeScreenshot();
    const captureFilePath = path.join(__dirname, '..', '..', 'screenshots', 'webdriverio', 'no-reset-false-w3c', `${deviceTime}.png`);
    shelljs.mkdir("-p", path.dirname(captureFilePath));
    await fse.writeFile(captureFilePath, image, 'base64');

    await sleep(5000);
  } catch (e) {
    console.log(e.toString());
  } finally {
    if (driver) {
      console.log("driver.capabilities: " + JSON.stringify(driver.capabilities));
      await driver.deleteSession();
    }
  }
}

if (require.main === module) {
  asyncbox.asyncify(runRtkTest);
}
