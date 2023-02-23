const asyncbox = require('asyncbox');
const wrapper = require('./webdriverio-wrapper');

const accessToken = process.env.RTK_ACCESS_TOKEN;
const appUrl = process.env.RTK_APP_URL;
const bundleId = process.env.RTK_BUNDLE_ID;
const sleep = async function (milliSeconds) {
  return new Promise(resolve => setTimeout(resolve, milliSeconds));
};

async function runRtkTest () {
  const capabilities = {
    "appium:noReset": true, // when commenting this out for `iPhone 14 (A)` it fails to initialize an appium session with an error like
    /**
    2023-02-23T04:21:30.967Z ERROR webdriver: unknown error: An unknown server-side error occurred while processing the command. Original error: Could not install '/var/folders/0r/td3rpr9j7110dy1rwm5lg7rm0000gn/T/2023123-50097-1qs2889.8zry/iOSWebView.app':
      - Unexpected data: {"Error":"ApplicationVerificationFailed","ErrorDetail":-402620395,"ErrorDescription":"Failed to verify code signature of /var/installd/Library/Caches/com.apple.mobile.installd.staging/temp.Kb8mIv/extracted/com.trident-qa.iOSWebView.app : 0xe8008015 (A valid provisioning profile for this executable was not found.)"}
      - 'ios-deploy' utility has not been found in PATH. Is it installed?
        at getErrorFromResponseBody (/Users/mwakizaka/Documents/10_projects/external_services/remotetestkit/rtk_webdriverio/node_modules/webdriver/build/utils.js:197:12)
        at NodeJSRequest._request (/Users/mwakizaka/Documents/10_projects/external_services/remotetestkit/rtk_webdriverio/node_modules/webdriver/build/request/index.js:158:60)
        at processTicksAndRejections (node:internal/process/task_queues:96:5)
        at startWebDriverSession (/Users/mwakizaka/Documents/10_projects/external_services/remotetestkit/rtk_webdriverio/node_modules/webdriver/build/utils.js:67:20)
        at Function.newSession (/Users/mwakizaka/Documents/10_projects/external_services/remotetestkit/rtk_webdriverio/node_modules/webdriver/build/index.js:46:45)
        at Object.remote (/Users/mwakizaka/Documents/10_projects/external_services/remotetestkit/rtk_webdriverio/node_modules/webdriverio/build/index.js:77:22)
        at runRtkTest (/Users/mwakizaka/Documents/10_projects/external_services/remotetestkit/rtk_webdriverio/src/reset.js:22:14)
    Error: Failed to create session.
    An unknown server-side error occurred while processing the command. Original error: Could not install '/var/folders/0r/td3rpr9j7110dy1rwm5lg7rm0000gn/T/2023123-50097-1qs2889.8zry/iOSWebView.app':
      - Unexpected data: {"Error":"ApplicationVerificationFailed","ErrorDetail":-402620395,"ErrorDescription":"Failed to verify code signature of /var/installd/Library/Caches/com.apple.mobile.installd.staging/temp.Kb8mIv/extracted/com.trident-qa.iOSWebView.app : 0xe8008015 (A valid provisioning profile for this executable was not found.)"}
      - 'ios-deploy' utility has not been found in PATH. Is it installed?
     */
    // note that the above error can happen with `iPhone 8 (F)` and `iPhone SE3 (A)` as well
    "appium:accessToken": accessToken,
    "platformName": "iOS",
    "appium:automationName": "XCUITest",
    "appium:platformVersion": "15",
    "appium:deviceName": "iPhone",
    "appium:app": appUrl,
    "appium:bundleId": bundleId,
    "appium:logLevel": "debug"
  }
  let driver;
  try {
    driver = await wrapper.createWdIOByInit('https://gwjp.appkitbox.com/wd/hub', capabilities);
    const deviceTime = await driver.getDeviceTime();
    console.log('deviceTime: ' + deviceTime);
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
