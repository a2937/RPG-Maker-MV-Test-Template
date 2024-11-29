if (typeof require !== "undefined" && typeof module != "undefined") {
  var chai = require("chai");
  var path = require("path");
  var fs = require("fs");
  var localDirectory = process.cwd();
  var dataDirectory = path.join(localDirectory, "data");
  var skillFile = fs
    .readFileSync(path.join(dataDirectory, "Skills.json"))
    .toString();
  var skillData = JSON.parse(skillFile);
  var animationsFile = fs
    .readFileSync(path.join(dataDirectory, "Animations.json"))
    .toString();
  var animationData = JSON.parse(animationsFile);
  var stateFile = fs
    .readFileSync(path.join(dataDirectory, "States.json"))
    .toString();
  var stateData = JSON.parse(stateFile);
}

describe("All skills display perfectly", function () {
  it("All skills have correct default animations", function () {
    skillData.map((element) => {
      if (element != null) {
        if (element.animationId > 0) {
          chai.assert.isNotNull(
            animationData[element.animationId],
            "Missing animation with id: " + element.animationId
          );
        }
      }
    });
  });
});

describe("All skill states are correct", function () {
  it("No states are undefined", function () {
    skillData.map((element) => {
      if (element != null) {
        if (element.effects != null) {
          var effectId = element.effects.dataId;
          chai.assert.isNotNull(stateData[effectId]);
        }
      }
    });
  });
});
