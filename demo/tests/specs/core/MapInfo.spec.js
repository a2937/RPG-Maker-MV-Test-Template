if (typeof require !== "undefined" && typeof module != "undefined") {
  var { isMapFile } = require("../Helpers");
  var chai = require("chai");
  var path = require("path");
  var fs = require("fs");
  var localDirectory = process.cwd();
  var dataDirectory = path.join(localDirectory, "data");
  var mapInfoPath = path.join(dataDirectory, "MapInfos.json");
  var mapInfoData = fs.readFileSync(mapInfoPath, { encoding: "utf8" });
  /**
   * @type {{id:number}[]} : An array of map data
   */
  var mapInfoObject = JSON.parse(mapInfoData);
}

/**
 *
 * @param {NodeJS.ErrnoException} err
 * @param {String[]} files
 * @param {Function} done
 */
function validateAllMapsExist(err, files, done) {
  Promise.all(
    files.map((fileName) => {
      if (isMapFile(fileName)) {
        var id = parseInt(fileName.match(/\d+/)[0]);
        var match = mapInfoObject.find((x) => {
          if (x != null) {
            return x.id == id;
          }
        });
        chai.assert.isDefined(match, "No map with id: " + id + " found");
      }
    })
  ).then(done());
}

describe("MapInfo: everything is valid", function () {
  it("Every map file is listed in the map info", function (done) {
    fs.readdir(dataDirectory, { encoding: "utf-8" }, (err, files) =>
      validateAllMapsExist(err, files, done)
    );
  });
});
