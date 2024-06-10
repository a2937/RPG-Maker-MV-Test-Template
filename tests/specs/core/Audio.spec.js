if (typeof require !== "undefined" && typeof module != "undefined") {
  //var chai = require("chai");
  var path = require("path");
  var fs = require("fs");
  var { checkFolderNameCase } = require("../Helpers");
  var localDirectory = process.cwd();
  var audioDirectory = path.join(localDirectory, "audio");
}

describe("All audio file name extensions should end in lower case", function () {
  it("Movies should have lower case extensions", function (done) {
    var movieFolder = path.join(localDirectory, "movies");
    fs.readdir(movieFolder, { encoding: "utf8" }, (err, files) =>
      checkFolderNameCase(err, files, done, movieFolder)
    );
  });
  it("BGMs should have lower case extensions", function (done) {
    var bgmFolder = path.join(audioDirectory, "bgm");
    fs.readdir(bgmFolder, { encoding: "utf8" }, (err, files) =>
      checkFolderNameCase(err, files, done, bgmFolder)
    );
  });
  it("BGSs should have lower case extensions", function (done) {
    var bgsFolder = path.join(audioDirectory, "bgs");
    fs.readdir(bgsFolder, { encoding: "utf8" }, (err, files) =>
      checkFolderNameCase(err, files, done, bgsFolder)
    );
  });
  it("MEs should have lower case extensions", function (done) {
    var meFolder = path.join(audioDirectory, "me");
    fs.readdir(meFolder, { encoding: "utf8" }, (err, files) =>
      checkFolderNameCase(err, files, done, meFolder)
    );
  });
  it("SEs should have lower case extensions", function (done) {
    var seFolder = path.join(audioDirectory, "se");
    fs.readdir(seFolder, { encoding: "utf8" }, (err, files) =>
      checkFolderNameCase(err, files, done, seFolder)
    );
  });
});
