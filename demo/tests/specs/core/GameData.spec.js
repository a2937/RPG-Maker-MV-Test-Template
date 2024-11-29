if (typeof require !== "undefined" && typeof module != "undefined") {
  var chai = require("chai");
  var path = require("path");
  var fs = require("fs");
  var { checkFolderNameCase } = require("../Helpers");
  var localDirectory = process.cwd();
  var dataDirectory = path.join(localDirectory, "data");
}

/**
 *
 * @param {NodeJS.ErrnoException} err
 * @param {String[]} files
 * @param {Mocha.Done} done
 * @param {String} folder
 */
function checkJSONContent(err, files, done, folder) {
  if (err) {
    chai.assert.fail("An error has occurred.");
  }
  for (var fileIndex = 0; fileIndex < files.length; fileIndex++) {
    var file = files[fileIndex];
    var trueLocation = path.join(folder, file);
    var stats = fs.statSync(trueLocation);
    if (stats.isFile()) {
      if (file.endsWith(".json")) {
        try {
          var data = fs.readFileSync(trueLocation).toString();
          JSON.parse(data);
        } catch (error) {
          chai.assert.fail(file + " is not valid JSON");
        }
      }
    }
  }
  done();
}

describe("Data file validation", function () {
  it("All data file extension names are lower case", function (done) {
    fs.readdir(dataDirectory, { encoding: "utf8" }, (err, files) =>
      checkFolderNameCase(err, files, done, dataDirectory)
    );
  });

  it("All core data files are valid JSON", function (done) {
    fs.readdir(dataDirectory, { encoding: "utf8" }, (err, files) =>
      checkJSONContent(err, files, done, dataDirectory)
    );
  });
});
