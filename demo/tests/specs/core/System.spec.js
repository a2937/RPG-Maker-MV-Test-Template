if (typeof require !== "undefined" && typeof module != "undefined") {
  var chai = require("chai");
  var path = require("path");
  var { pad } = require("../Helpers");
  var fs = require("fs");
  var localDirectory = process.cwd();
  var dataDirectory = path.join(localDirectory, "data");
  var systemFile = fs
    .readFileSync(path.join(dataDirectory, "System.json"))
    .toString();
  var systemData = JSON.parse(systemFile);
  var mapFile = fs
    .readFileSync(path.join(dataDirectory, "MapInfos.json"))
    .toString();
  var mapInfoData = JSON.parse(mapFile);
}

// TODO: Set for the game itself
const startingMapId = 1;


describe("System: Ensure the player can spawn correctly", function () {
  it("The regular starting map file actually exists", function () {
    /**
     * @type {Number}
     */
    var startingMapFile = pad(systemData.startMapId, 3);
    var mapPath = path.join(dataDirectory, "Map" + startingMapFile + ".json");
    chai.assert.isTrue(
      fs.existsSync(mapPath),
      "The starting map " +
      "Map" +
      startingMapFile +
      ".json" +
      " does not exist"
    );
  });
});

describe("System: Ensure the game is ready for publishing", function () {
  it("Ensure the right map is used", function () {
    var systemMapStartId = parseInt(systemData.startMapId);
    var systemMapName = mapInfoData.filter(x => x != undefined && x.id == systemMapStartId)[0].name;
    var systemMapFile = pad(systemData.startMapId, 3);

    var correctMapFile = pad(startingMapId, 3);
    var correctMapName = mapInfoData.filter(x => x != undefined && x.id == startingMapId)[0].name;

    chai.assert.equal(parseInt(systemMapStartId), startingMapId, "The starting map file is not set to Map " + correctMapFile + "(" + correctMapName + ")"
      + " and is instead set to Map " + systemMapFile + " (" + systemMapName + ")");
  });
  it("Ensure the player starts transparent", function () {
    chai.assert.equal(systemData.optTransparent, true, "The player doesn't start transparent");
  });
});
