if (typeof require !== "undefined" && typeof module != "undefined") {
  var chai = require("chai");
  var path = require("path");
  var { validateFaceExists, validateCharacterName } = require("../Helpers");
  var fs = require("fs");
  var localDirectory = process.cwd();
  var dataDirectory = path.join(localDirectory, "data");
  var actorFile = fs
    .readFileSync(path.join(dataDirectory, "Actors.json"))
    .toString();
  var actorData = JSON.parse(actorFile);
}

describe("All actor data works properly", function () {
  it("All actors have valid initial facial data", function (done) {
    for (var i = 0; i < actorData.length; i++) {
      var actor = actorData[i];
      if (actor != null) {
        var faceName = actor.faceName;
        try {
          validateFaceExists(faceName);
        } catch (error) {
          chai.assert.fail(
            "Actor: " +
              actor.name +
              " has an invalid face of " +
              faceName +
              " and will not work properly"
          );
        }
      }
    }
    done();
  });
  it("All actors have valid initial body data", function () {
    for (var i = 0; i < actorData.length; i++) {
      var actor = actorData[i];
      if (actor != null) {
        var bodyName = actor.characterName;
        try {
          validateCharacterName(bodyName);
        } catch (error) {
          chai.assert.fail(
            "Actor: " +
              actor.name +
              " has an invalid body of " +
              bodyName +
              " and will not work properly"
          );
        }
      }
    }
  });
});
