if (typeof require !== "undefined" && typeof module != "undefined") {
  //var chai = require("chai");
  var path = require("path");
  var fs = require("fs");
  var { checkFolderNameCase } = require("../Helpers");
  var localDirectory = process.cwd();
  var fontDirectory = path.join(localDirectory, "fonts");
}

describe("Font file validation", function () {
  it("All font file extension names are lower case", function (done) {
    fs.readdir(fontDirectory, { encoding: "utf8" }, (err, files) =>
      checkFolderNameCase(err, files, done, fontDirectory)
    );
  });
});
