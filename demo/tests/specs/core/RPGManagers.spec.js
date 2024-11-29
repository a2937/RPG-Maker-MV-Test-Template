/// <reference path="../../../@types/rmmv-pixi.d.ts" />
"use strict";
var currentFolder = "";
if (typeof require !== "undefined" && typeof module != "undefined") {
  var chai = require("chai");
  require("../../../js/libs/pixi");
  require("../../../js/libs/pixi-tilemap");

  var { Bitmap } = require("../../../js/rpg_core");

  var { ImageManager } = require("../../../js/rpg_managers");
  var { Scene_Name } = require("../../../js/rpg_scenes");
  require("../../../js/rpg_windows");
  var path = require("path");
  currentFolder = path.join(__dirname, "../../../");
}

describe("RPG Managers: Ensure that if filenames are undefined; an empty image is loaded", function () {
  it("Ensure there are no empty images loaded", function () {
    var emptyBitmap = new Bitmap();
    var bitmap = ImageManager.requestBitmap(
      currentFolder + "img/system/",
      "undefined",
      0,
      255
    );
    var bitmap2 = ImageManager.reserveBitmap(
      currentFolder + "img/system/",
      null,
      0,
      255
    );
    var bitmap3 = ImageManager.reserveBitmap(
      currentFolder + "img/system/",
      "",
      0,
      255
    );
    chai.assert.equal(
      bitmap.url,
      emptyBitmap.url,
      "Empty bitmap not found when reserved"
    );
    chai.assert.equal(
      bitmap2.url,
      emptyBitmap.url,
      "Empty bitmap not found when loaded"
    );
    chai.assert.equal(
      bitmap3.url,
      emptyBitmap.url,
      "Empty bitmap not found when requested"
    );
  });
  it("Ensure the path is valid when requested", function () {
    var bitmap = ImageManager.requestBitmap(
      currentFolder + "img/system/",
      "Balloon",
      0,
      255
    );
    chai.assert.equal(
      bitmap.url,
      currentFolder + "img/system/Balloon.png",
      "Url not correct."
    );
  });
  it("Ensure the path is valid when reserved", function () {
    var bitmap = ImageManager.reserveBitmap(
      currentFolder + "img/system/",
      "Balloon",
      0,
      255
    );
    chai.assert.equal(
      bitmap.url,
      currentFolder + "img/system/Balloon.png",
      "Url not correct."
    );
  });
});
describe("RPG Managers: Check essential functionality", function () {
  it("Can set name and trim characters  ", function () {
    Scene_Name.prototype._actor = {
      setName: function (text) {
        this.name = text;
      },
    };
    var scene = new Scene_Name();
    scene._editWindow = {};
    scene._editWindow.name = function () {
      return "Connor   ";
    };
    scene.popScene = function () {
      return true;
    };
    var testName = "Connor";
    scene.onInputOk();
    chai.assert.equal(scene._actor.name, testName, "Didn't remove the spaces");
  });
});
