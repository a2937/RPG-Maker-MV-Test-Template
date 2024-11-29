if (typeof require !== "undefined" && typeof module != "undefined") {

  var path = require("path");
  var fs = require("fs");
  var { checkFolderNameCase, ensureProperExtension } = require("../Helpers");
  var localDirectory = process.cwd();
  var imgDirectory = path.join(localDirectory, "img");
}

describe("All artwork file name extensions should end in lower case", function () {
  it("Game icon should have a lower case extension", function (done) {
    var iconFolder = path.join(localDirectory, "icon");
    fs.readdir(iconFolder, { encoding: "utf8" }, (err, files) => checkFolderNameCase(err, files, done, iconFolder));
  });

  it("Animations should have lower case extensions", function (done) {
    var animationsFolder = path.join(imgDirectory, "animations");
    fs.readdir(animationsFolder, { encoding: "utf8" }, (err, files) => checkFolderNameCase(err, files, done, animationsFolder));
  });
  it("Battle background folder One should have lower case extensions", function (done) {
    var battleBackFolder1 = path.join(imgDirectory, "battlebacks1");
    fs.readdir(battleBackFolder1, { encoding: "utf8" }, (err, files) => checkFolderNameCase(err, files, done, battleBackFolder1));
  });
  it("Battle background folder Two should have lower case extensions", function (done) {
    var battleBackFolder2 = path.join(imgDirectory, "battlebacks2");
    fs.readdir(battleBackFolder2, { encoding: "utf8" }, (err, files) => checkFolderNameCase(err, files, done, battleBackFolder2));
  });
  it("Characters folder should have lower case extensions", function (done) {
    var characterFolder = path.join(imgDirectory, "characters");
    fs.readdir(characterFolder, { encoding: "utf8" }, (err, files) => checkFolderNameCase(err, files, done, characterFolder));
  });
  it("Enemies folder should have lower case extensions", function (done) {
    var enemyFolder = path.join(imgDirectory, "enemies");
    fs.readdir(enemyFolder, { encoding: "utf8" }, (err, files) => checkFolderNameCase(err, files, done, enemyFolder));
  });
  it("Faces folder should have lower case extensions", function (done) {
    var faceFolder = path.join(imgDirectory, "faces");
    fs.readdir(faceFolder, { encoding: "utf8" }, (err, files) => checkFolderNameCase(err, files, done, faceFolder));
  });

  it("Parallaxes folder should have lower case extensions", function (done) {
    var parallaxFolder = path.join(imgDirectory, "parallaxes");
    fs.readdir(parallaxFolder, { encoding: "utf8" }, (err, files) => checkFolderNameCase(err, files, done, parallaxFolder));
  });
  it("Pictures should have lower case extensions", function (done) {
    var picturesFolder = path.join(imgDirectory, "pictures");
    fs.readdir(picturesFolder, { encoding: "utf8" }, (err, files) => checkFolderNameCase(err, files, done, picturesFolder));
  });
  it("Sv_Actors should have lower case extensions", function (done) {
    var svActorFolder = path.join(imgDirectory, "sv_actors");
    fs.readdir(svActorFolder, { encoding: "utf8" }, (err, files) => checkFolderNameCase(err, files, done, svActorFolder));
  });
  it("Sv_Enemies should have lower case extensions", function (done) {
    var svEnemyFolder = path.join(imgDirectory, "sv_enemies");
    fs.readdir(svEnemyFolder, { encoding: "utf8" }, (err, files) => checkFolderNameCase(err, files, done, svEnemyFolder));
  });
  it("System should have lower case extensions", function (done) {
    var systemFolder = path.join(imgDirectory, "system");
    fs.readdir(systemFolder, { encoding: "utf8" }, (err, files) => checkFolderNameCase(err, files, done, systemFolder));
  });
  it("Tilesets should have lower case extensions", function (done) {
    var tileSetFolder = path.join(imgDirectory, "tilesets");
    fs.readdir(tileSetFolder, { encoding: "utf8" }, (err, files) => checkFolderNameCase(err, files, done, tileSetFolder));
  });

  it("Title folder One should have lower case extensions", function (done) {
    var titleFolderOne = path.join(imgDirectory, "titles1");
    fs.readdir(titleFolderOne, { encoding: "utf8" }, (err, files) => checkFolderNameCase(err, files, done, titleFolderOne));
  });
  it("Title folder Two should have lower case extensions", function (done) {
    var titleFolderTwo = path.join(imgDirectory, "titles2");
    fs.readdir(titleFolderTwo, { encoding: "utf8" }, (err, files) => checkFolderNameCase(err, files, done, titleFolderTwo));
  });
});

describe("Artwork: Game is ready for publishing", function () {
  it("Only PNG files are in the characters folder", function (done) {
    var characterFolder = path.join(imgDirectory, "characters");
    fs.readdir(characterFolder, { encoding: "utf8" }, (err, files) =>
      ensureProperExtension(err, files, done, characterFolder, ".png")
    );
  });
  it("Only PNG files are in the faces folder", function (done) {
    var faceFolder = path.join(imgDirectory, "faces");
    fs.readdir(faceFolder, { encoding: "utf8" }, (err, files) =>
      ensureProperExtension(err, files, done, faceFolder, ".png")
    );
  });
});
