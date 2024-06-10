if (typeof require !== "undefined" && typeof module != "undefined") {
  var chai = require("chai");
  var path = require("path");
  var fs = require("fs");
  var { getTilesetDirectories } = require("../Helpers");
  var localDirectory = process.cwd();
  var dataDirectory = path.join(localDirectory, "data");
  var tilesetFile = fs
    .readFileSync(path.join(dataDirectory, "Tilesets.json"))
    .toString();
  var tilesetData = JSON.parse(tilesetFile);
}


var tilesetDirectories = getTilesetDirectories(
  path.join(localDirectory, "img")
);


describe("All tileset are proper", function () {
  it("All tileset images exist", function (done) {
    for (let i = 0; i < tilesetData.length; i++) {
      if (tilesetData[i] != null) {
        let tilesetNames = tilesetData[i].tilesetNames.filter(x => x.trim() != "");
        tilesetNames.map((tile) => {
          tilesetDirectories.map((tileDirectory) => {
            var tileLocation = path.join(
              localDirectory,
              "img",
              tileDirectory,
              tile + ".png"
            );
            if (!fs.existsSync(tileLocation)) {
              chai.assert.fail("tileSet not found: " + tileLocation + " required for Tileset " + tilesetData[i].name + " (" + i.toString() + ")");
            }
          });
        });
      }
    }
    done();
  });
});
