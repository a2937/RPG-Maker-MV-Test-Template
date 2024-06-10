/// <reference path="../../../@types/rmmv-pixi.d.ts" />
var plugins = [];
if (typeof require !== "undefined" && typeof module != "undefined") {
  var chai = require("chai");
  var path = require("path");
  var fs = require("fs");
  var { trueCasePathSync } = require("true-case-path");
  var pluginLocation = path.join(__dirname, "../../../js/plugins.js");
  var pluginsFolder = path.join(__dirname, "../../../js/plugins");
  let rawdata = fs.readFileSync(pluginLocation).toString();
  let jsonStart = rawdata.indexOf("[");
  let jsonEnd = rawdata.lastIndexOf("]") + 1;
  rawdata = rawdata.substring(jsonStart, jsonEnd);
  plugins = JSON.parse(rawdata);
  var localDirectory = process.cwd();
  var pluginDirectory = path.join(localDirectory, "js", "plugins");
} else {
  //plugins = $plugins;
}

/**
 * 
 * @param {string} pluginName 
 */
function processPluginInfo(pluginName) {
  let pluginLocation = path.join(pluginsFolder, pluginName + ".js");
  chai.assert.isTrue(
    trueCasePathSync(pluginLocation) == pluginLocation,
    pluginLocation + " doesn't exist."
  );
}

function checkForSingleUsePlugin() {
  var validPlugins = plugins.filter(x => !x.name.includes("-")).map(x => x.name);
  var equalLength = (new Set(validPlugins)).size == validPlugins.length;
  if (equalLength != true) {
    var set = new Set(validPlugins);
    var duplicates = validPlugins.filter(item => {
      if (set.has(item)) {
        set.delete(item);
      } else {
        return item;
      }
    });
    console.table(duplicates);
  }
  chai.assert.isTrue(equalLength, "There appears to be of the same plugin enabled. Check the following plugin(s) : \n " + duplicates + "\n");
}


/**
 *
 * @param {NodeJS.ErrnoException} err
 * @param {Mocha.Done} done
 * @param {String[]} files
 * @param {String} folder
 */
function checkFileExtensionCase(err, files, done, folder) {
  if (err) {
    chai.assert.fail("An error has occurred.");
  }

  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    if (file == ".DS_Store") {
      continue;
    }
    var trueLocation = path.join(folder, file);
    var stats = fs.statSync(trueLocation);
    if (stats.isFile()) {
      var indexOfExtension = file.indexOf(".");
      if (indexOfExtension != -1) {
        var lowerFileName =
          file.substring(0, indexOfExtension) +
          file.substring(indexOfExtension).toLowerCase();
        trueLocation = path.join(folder, lowerFileName);
      }
      if (trueCasePathSync(trueLocation) != trueLocation) {
        chai.assert.fail(
          path.join(folder, file) +
          " has an uppercase extension and will not work on some OSes."
        );
      }
    }
  }
  done();
}


describe("Javascript plugin load information is correct", function () {
  it("There are no duplicate plugin entries", function (done) {

    checkForSingleUsePlugin(done);
    done();

  });
  it("All plugin entries match actual files", function () {
    plugins.map((x) => processPluginInfo(x.name));
  });
});


describe("Javascript file extensions are correct", function () {
  it("All root file names have lower case extensions", function (done) {
    //const promises = pluginNames.map(processPluginInfo);
    //await Promise.all(promises);
    //var pluginFolder = path.join(imgDirectory, "achievements");
    fs.readdir(localDirectory, { encoding: "utf8" }, (err, files) =>
      checkFileExtensionCase(err, files, done, localDirectory)
    );
  });

  it("All plugin file names have lower case extensions", function (done) {
    //const promises = pluginNames.map(processPluginInfo);
    //await Promise.all(promises);
    //var pluginFolder = path.join(imgDirectory, "achievements");
    fs.readdir(pluginDirectory, { encoding: "utf8" }, (err, files) =>
      checkFileExtensionCase(err, files, done, pluginDirectory)
    );
  });

  it("All Javascript lib file names are lower case", function (done) {
    //const promises = pluginNames.map(processPluginInfo);
    //await Promise.all(promises);
    //var pluginFolder = path.join(imgDirectory, "achievements");
    var libFolder = path.join(localDirectory, "js", "libs");
    fs.readdir(libFolder, { encoding: "utf8" }, (err, files) =>
      checkFileExtensionCase(err, files, done, libFolder)
    );
  });

  it("All main Javascript file names are lower case", function (done) {
    //const promises = pluginNames.map(processPluginInfo);
    //await Promise.all(promises);
    //var pluginFolder = path.join(imgDirectory, "achievements");
    var jsFolder = path.join(localDirectory, "js");
    fs.readdir(jsFolder, { encoding: "utf8" }, (err, files) =>
      checkFileExtensionCase(err, files, done, jsFolder)
    );
  });
});
