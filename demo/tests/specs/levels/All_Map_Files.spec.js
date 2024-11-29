if (typeof require !== "undefined" && typeof module != "undefined") {
  var chai = require("chai");
  var {
    validateFaceExists,
    validatePictureName,
    validateCharacterName,
    validateAnimationExists,
    validateWordSpace,
    validateSentenceSpelledRight,
    getFullDialog,
    validateSideViewActorExists,
    getTilesetDirectories,
    validateEveryMap
  } = require("../Helpers");
  var constants = require("../Constants");
  var fs = require("fs");
  var process = require("process");
  var path = require("path");
  var sizeOf = require("image-size");
  var localDirectory = process.cwd();
  var dataDirectory = path.join(localDirectory, "data");
  var tilesetInfoString = fs.readFileSync(
    path.join(dataDirectory, "Tilesets.json"),
    { encoding: "utf-8" }
  );
  var tilesetInfo = JSON.parse(tilesetInfoString);

  var commonEventInfoString = fs.readFileSync(
    path.join(dataDirectory, "CommonEvents.json"),
    { encoding: "utf-8" }
  );
  var commonEventInfo = JSON.parse(commonEventInfoString);

  const animationFileString = fs.readFileSync(
    path.join(dataDirectory, "Animations.json"),
    { encoding: "utf-8" }
  );
  var animationInfo = JSON.parse(animationFileString);

  const mapInfoString = fs.readFileSync(
    path.join(dataDirectory, "MapInfos.json"),
    { encoding: "utf-8" }
  );
  var mapInfoObject = JSON.parse(mapInfoString);

  var systemInfoPath = fs.readFileSync(path.join(dataDirectory, "System.json"), { encoding: "utf-8" });

  var systemData = JSON.parse(systemInfoPath);
}
//var defaultParallaxDirectory = path.join(localDirectory, "img", "parallaxes");

var oddParallaxes = ["pl_003", "pl_007", "pl_012", "pl_013", "StarlitSky", "Byteon", "!pl_btc_002", "pl_001"];

var parallaxDirectories = getParallaxDirectories(
  path.join(localDirectory, "img")
);
var tilesetDirectories = getTilesetDirectories(
  path.join(localDirectory, "img")
);


// make Promise version of fs.readdir()
/**
 *
 * @param {fs.PathLike} dirname
 * @returns
 */
fs.readdirAsync = function (dirname) {
  return new Promise(function (resolve, reject) {
    fs.readdir(dirname, function (err, filenames) {
      if (err) reject(err);
      else resolve(filenames);
    });
  });
};

// make Promise version of fs.readFile()
/**
 *
 * @param {String} filename
 * @param {{encoding:String}} enc
 * @returns
 */
fs.readFileAsync = function (filename, enc) {
  return new Promise(function (resolve, reject) {
    fs.readFile(filename, enc, function (err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

// example of using promised version of getFile
// getFile('./fish1.json', 'utf8').then(function (data){
// console.log(data);
// });

// a function specific to my project to filter out the files I need to read and process, you can pretty much ignore or write your own filter function.

/**
 *
 * @param {String} data
 */
function validateJSON(data) {
  var file = data.toString();
  try {
    JSON.parse(file);
  } catch (error) {
    chai.assert.fail("Processed file is not valid json: ");
  }
}

// TODO: figure out if the 48x parallaxes actually are the right size.  
function validateParallaxHeight(data) {
  var file = data.toString();
  var mapFile = JSON.parse(file);
  if (mapFile.parallaxName != "" && !oddParallaxes.contains(mapFile.parallaxName)) {
    var altParallaxDirectory = parallaxDirectories[0];
    var multiplier = parseInt(altParallaxDirectory.match(/\d+/)[0]);
    var parallaxPath = path.join("img", altParallaxDirectory, mapFile.parallaxName + ".png");
    var dimensions = sizeOf(parallaxPath);
    var idealHeight = mapFile.height * multiplier;
    chai.assert.equal(idealHeight, dimensions.height, "The height of the used parallax : " + mapFile.parallaxName + " does not equal the expected Height : " + idealHeight);
  }
}

// TODO: figure out if the 48x parallaxes actually are the right size.  
function validateParallaxWidth(data) {
  var file = data.toString();
  var mapFile = JSON.parse(file);
  if (mapFile.parallaxName != "" && !oddParallaxes.contains(mapFile.parallaxName)) {
    var altParallaxDirectory = parallaxDirectories[0];
    var multiplier = parseInt(altParallaxDirectory.match(/\d+/)[0]);
    var parallaxPath = path.join("img", altParallaxDirectory, mapFile.parallaxName + ".png");
    var dimensions = sizeOf(parallaxPath);
    var idealWidth = mapFile.width * multiplier;
    chai.assert.equal(idealWidth, dimensions.width, "The width of the used parallax :" + mapFile.parallaxName + " does not equal the expected Width : " + idealWidth);
  }
}
/**
 *
 * @param {String} data
 */
function validateEventShowPicture(data) {
  var file = data.toString();
  var mapFile = JSON.parse(file);
  if (mapFile.events != null) {
    for (var eventIndex = 0; eventIndex < mapFile.events.length; eventIndex++) {
      //mapFile.events.map((event) => {
      if (event != null) {
        for (let i = 0; i < event.pages.length; i++) {
          var list = event.pages[i].list;
          var showPictures = list.filter(
            (x) => x.code == constants.showPictureCode
          );

          for (
            var pictureId = 0;
            pictureId < showPictures.length;
            pictureId++
          ) {
            var picEvent = showPictures[pictureId];
            try {
              validatePictureName(picEvent.parameters[1]);
            } catch (exception) {
              chai.assert.fail(
                exception.message +
                " " +
                " for event " +
                event.name +
                " : page " +
                (i + 1)
              );
            }
          }
        }
      }
    }
  }
}

/**
 *
 * @param {String} data
 * @param {Number} code
 * @param {CallableFunction} callback
 */
function validateEvent(data, code, callback) {
  var file = data.toString();
  var mapFile = JSON.parse(file);
  if (mapFile.events != null) {
    for (var eventIndex = 0; eventIndex < mapFile.events.length; eventIndex++) {
      var event = mapFile.events[eventIndex];
      if (event != null) {
        for (let i = 0; i < event.pages.length; i++) {
          var list = event.pages[i].list;
          var changes = list.filter((x) => x.code == code);
          for (
            var changeIndex = 0;
            changeIndex < changes.length;
            changeIndex++
          ) {
            var change = changes[changeIndex];
            try {
              callback(change.parameters[0]);
            } catch (exception) {
              chai.assert.fail(
                exception.message +
                " " +
                " for event " +
                event.name +
                " : page " +
                (i + 1) +
                " Event location ; X : " +
                event.x +
                ", Y: " +
                event.y
              );
            }
          }
        }
      }
    }
  }
}

function validateMapTransferLocation(data) {
  var file = data.toString();
  var mapFile = JSON.parse(file);
  if (mapFile.events != null) {
    mapFile.events.forEach((event) => {
      if (event != null) {
        for (let i = 0; i < event.pages.length; i++) {
          var list = event.pages[i].list;
          var changes = list.filter(
            (x) => x.code == constants.transferPlayerCode
          );
          changes.forEach((change) => {
            try {
              var id = parseInt(
                change.parameters[1].toString().match(/\d+/)[0]
              );
              var match = mapInfoObject.find((x) => {
                if (x != null) {
                  return x.id == id;
                }
              });
              chai.assert.isDefined(
                match,
                "No record found for map with id of '" + id + "'."
              );
            } catch (exception) {
              chai.assert.fail(
                exception.message +
                " " +
                " for event " +
                event.name +
                " : page " +
                (i + 1) +
                " Event location ; X : " +
                event.x +
                ", Y: " +
                event.y
              );
            }
          });
        }
      }
    });
  }
}

function validateEventImage(data) {
  var file = data.toString();
  var mapFile = JSON.parse(file);
  if (mapFile.events != null) {
    var eventLength = mapFile.events.length;
    for (let eventIndex = 0; eventIndex < eventLength; eventIndex++) {
      var event = mapFile.events[eventIndex];
      if (event != null) {
        for (let i = 0; i < event.pages.length; i++) {
          var imageName = event.pages[i].image.characterName;
          if (imageName.trim() != "") {
            try {
              validateCharacterName(imageName);
            } catch (exception) {
              chai.assert.fail(
                exception.message +
                " " +
                " for event " +
                event.name +
                " : page " +
                (i + 1) +
                " Event location ; X : " +
                event.x +
                ", Y: " +
                event.y
              );
            }
          }
        }
      }
    }
  }
}

/**
 *
 * @param {String} data
 * @param {Number} audioCode
 * @param {CallableFunction} audioCallback
 */
function validateEventAudioChange(data, audioCode, audioCallback) {
  var file = data.toString();
  var mapFile = JSON.parse(file);
  if (mapFile.events != null) {
    mapFile.events.map((event) => {
      if (event != null) {
        for (let i = 0; i < event.pages.length; i++) {
          var list = event.pages[i].list;
          var audioChanges = list.filter((x) => x.code == audioCode);
          audioChanges.map((change) => {
            try {
              audioCallback(change.parameters[0].name);
            } catch (exception) {
              chai.assert.fail(
                exception.message +
                " " +
                " for event " +
                event.name +
                " : page " +
                (i + 1) +
                " Event location ; X : " +
                event.x +
                ", Y: " +
                event.y
              );
            }
          });
        }
      }
    });
  }
}




/**
 *
 * @param {String} movieName
 */
function validateMovieName(movieName) {
  if (movieName != "") {
    var movieLocation = path.join(
      localDirectory,
      "movies",
      movieName + ".webm"
    );
    if (!fs.existsSync(movieLocation)) {
      chai.assert.fail("Movie not found: " + movieLocation);
    }
  }
}

/**
 *
 * @param {String} source
 * @returns {String[]}
 */
function getParallaxDirectories(source) {
  return fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .filter(
      (x) =>
        x.startsWith("parallax") ||
        x.startsWith("Parallax") ||
        x.endsWith("parallax") ||
        x.endsWith("Parallax")
    );
}


/**
 *
 * @param {String} parallaxName
 */
function validateParallaxName(parallaxName) {
  if (parallaxName != "") {
    parallaxDirectories.map((directory) => {
      var parallaxLocation = path.join(
        localDirectory,
        "img",
        directory,
        parallaxName + ".png"
      );
      if (!fs.existsSync(parallaxLocation)) {
        chai.assert.fail("Parallax not found: " + parallaxLocation);
      }
    });
  }
}

/**
 *
 * @param {String} data
 */
function validateEventSwitchName(data) {
  var file = data.toString();
  var mapFile = JSON.parse(file);
  if (mapFile.events != null) {
    mapFile.events.map((event) => {
      if (event != null) {
        for (let i = 0; i < event.pages.length; i++) {
          var list = event.pages[i].list;
          if (list != null) {
            var switchInfo = list.filter(
              (x) => x.code == constants.controlSwitchCode
            );
            switchInfo.map(function (switchData) {
              var index = switchData.parameters[1];
              try {
                validateSwitchName(index);
              }
              catch (ex) {
                chai.assert.fail(ex.message + " on event " + event.id + "(" + event.x + "," +
                  event.y + ")" + "page: " + i + " is empty. ");
              }
            });
          }
        }
      }
    });
  }
}

/**
 * 
 * @param {number} switchId 
 */
function validateSwitchName(switchId) {
  var switchName = systemData.switches[switchId];
  chai.assert.isNotEmpty(switchName.trim(), "Switch: " + (switchId));
}

/**
 * 
 * @param {number} variableId 
 */
function validateVariableName(variableId) {
  var switchName = systemData.variables[variableId];
  chai.assert.isNotEmpty(switchName.trim(), "Variables: " + (variableId));
}

/**
 *
 * @param {String} data
 */
function validateEventVariableName(data) {
  var file = data.toString();
  var mapFile = JSON.parse(file);
  if (mapFile.events != null) {
    mapFile.events.map((event) => {
      if (event != null) {
        for (let i = 0; i < event.pages.length; i++) {
          var list = event.pages[i].list;
          if (list != null) {
            var variableInfo = list.filter(
              (x) => x.code == constants.controlVariablesCode
            );
            variableInfo.map(function (variableData) {
              var index = variableData.parameters[1];
              try {
                validateVariableName(index);
              }
              catch (ex) {
                chai.assert.fail(ex.message + " on event " + event.id + "(" + event.x + "," +
                  event.y + ")" + "page: " + i + " is empty. ");
              }
            });
          }
        }
      }
    });
  }
}

/**
 *
 * @param {String} data
 */
function validateEventChangeActorImage(data) {
  var file = data.toString();
  var mapFile = JSON.parse(file);
  if (mapFile.events != null) {
    mapFile.events.map((event) => {
      if (event != null) {
        for (let i = 0; i < event.pages.length; i++) {
          var list = event.pages[i].list;
          if (list != null) {
            var actorImages = list.filter(
              (x) => x.code == constants.changeActorImageCode
            );
            actorImages.map(function (change) {
              try {
                var params = change.parameters;
                validateCharacterName(params[1]);
                validateFaceExists(params[3]);
                validateSideViewActorExists(params[5]);
              } catch (error) {
                chai.assert.fail(error.message + "; event: " + event.id);
              }
            });
          }
        }
      }
    });
  }
}

/**
 *
 * @param {String} data
 */
function validateEventSpaceTalk(data) {
  var file = data.toString();
  var mapFile = JSON.parse(file);
  if (mapFile.events != null) {
    for (var eventIndex = 0; eventIndex < mapFile.events.length; eventIndex++) {
      var event = mapFile.events[eventIndex];
      if (event != null) {
        for (let i = 0; i < event.pages.length; i++) {
          var list = event.pages[i].list;
          if (list != null) {
            var dialogs = getFullDialog(list);
            for (
              var dialogIndex = 0;
              dialogIndex < dialogs.length;
              dialogIndex++
            ) {
              var dialog = dialogs[dialogIndex];
              try {
                /** 
                @type {String}
                */
                var sentence = dialog.trim();
                validateWordSpace(sentence);
              } catch (error) {
                chai.assert.fail(
                  error +
                  "\n" +
                  event.name +
                  " ; page: " +
                  (i + 1) +
                  "\n " +
                  " Located at: " +
                  event.x +
                  "," +
                  event.y +
                  "\n"
                );
              }
            }
          }
        }
      }
    }
  }
}

/**
 *
 * @param {String} data
 */
function validateEventWordSpell(data) {
  var file = data.toString();
  var mapFile = JSON.parse(file);
  if (mapFile.events != null) {
    for (var eventIndex = 0; eventIndex < mapFile.events.length; eventIndex++) {
      var event = mapFile.events[eventIndex];

      if (event != null) {
        for (let i = 0; i < event.pages.length; i++) {
          var list = event.pages[i].list;
          if (list != null) {
            var dialogs = getFullDialog(list);
            for (
              var dialogIndex = 0;
              dialogIndex < dialogs.length;
              dialogIndex++
            ) {
              var dialog = dialogs[dialogIndex];
              try {
                /** 
                @type {String}
                */
                var sentence = dialog.trim();
                validateSentenceSpelledRight(sentence);
              } catch (error) {
                chai.assert.fail(
                  error +
                  "\n" +
                  event.name +
                  " ; page: " +
                  (i + 1) +
                  "\n " +
                  " Located at: " +
                  event.x +
                  "," +
                  event.y +
                  "\n"
                );
              }
            }
          }
        }
      }
    }
  }
}

/**
 *
 * @param {String} data
 */
function validateEventShowAnimation(data) {
  var file = data.toString();
  var mapFile = JSON.parse(file);
  if (mapFile.events != null) {
    var events = mapFile.events;
    for (var i = 0; i < events.length; i++) {
      var event = events[i];
      if (event != null) {
        for (let i = 0; i < event.pages.length; i++) {
          var list = event.pages[i].list;
          if (list != null) {
            var animations = list.filter(
              (x) => x.code == constants.showAnimation
            );
            for (
              var changeIndex = 0;
              changeIndex < animations.length;
              changeIndex++
            ) {
              var change = animations[changeIndex];
              var animationPictures = animationInfo.filter((x) => {
                if (x != null) {
                  return x.id == change.parameters[1];
                }
              });

              for (
                var pictureIndex = 0;
                pictureIndex < animationPictures.length;
                pictureIndex++
              ) {
                var anim = animationPictures[pictureIndex];
                try {
                  validateAnimationExists(anim);
                } catch (error) {
                  chai.assert.fail(error.message + "; event: " + event.id);
                }
              }
            }
          }
        }
      }
    }
  }
}

/**
 *
 * @param {Number} tilesetId
 */
function validateTilesetID(tilesetId) {
  if (tilesetId != null) {
    /**
     * @type {String[]}
     */
    var tiles = tilesetInfo.find(
      (tile) => tile != null && tile.id == tilesetId
    ).tilesetNames;
    tiles.map((tile) => {
      if (tile != "") {
        tilesetDirectories.map((tileDirectory) => {
          var tileLocation = path.join(
            localDirectory,
            "img",
            tileDirectory,
            tile + ".png"
          );
          if (!fs.existsSync(tileLocation)) {
            chai.assert.fail("tileSet not found: " + tileLocation);
          }
        });
      }
    });
  }
}

/**
 *
 * @param {String} data
 * @param {String} fileName
 */
function validateMapBgm(data) {
  var file = data.toString();
  var mapFile = JSON.parse(file);
  var bgm = mapFile.bgm;
  validateBgmName(bgm.name);
}

/**
 *
 * @param {String} data
 * @param {String} fileName
 */
function validateMapSize(data) {
  var file = data.toString();
  var mapFile = JSON.parse(file);
  var width = mapFile.width;
  var height = mapFile.height;
  chai.assert.isTrue(
    width <= 256,
    "A map file has a width bigger than 256. It will be difficult to edit."
  );
  chai.assert.isTrue(
    height <= 256,
    "A map file has a height bigger than 256. It will be difficult to edit."
  );
}

/**
 *
 * @param {String} data
 * @param {String} fileName
 */
function validateMapParallax(data) {
  var file = data.toString();
  var mapFile = JSON.parse(file);
  var parallax = mapFile.parallaxName;
  validateParallaxName(parallax);
}

/**
 *
 * @param {String} data
 * @param {String} fileName
 */
function validateMapTileset(data) {
  var file = data.toString();
  var mapFile = JSON.parse(file);
  var tileset = mapFile.tilesetId;
  validateTilesetID(tileset);
}

/**
 *
 * @param {String} bgmName
 */
function validateBgmName(bgmName) {
  if (bgmName != "") {
    var bgmFileLocation = path.join(
      localDirectory,
      "audio",
      "bgm",
      bgmName + ".ogg"
    );
    if (!fs.existsSync(bgmFileLocation)) {
      chai.assert.fail(
        "Bgm file not found.\n" + " Chosen bgm should be at " + bgmFileLocation
      );
    }
  }
}

/**
 *
 * @param {String} seName
 */
function validateSeName(seName) {
  if (seName != "") {
    var seFileLocation = path.join(
      localDirectory,
      "audio",
      "se",
      seName + ".ogg"
    );
    if (!fs.existsSync(seFileLocation)) {
      chai.assert.fail(
        "Se file not found.\n" + " Chosen bgm should be at " + seFileLocation
      );
    }
  }
}

/**
 *
 * @param {String} meName
 */
function validateMeName(meName) {
  if (meName != "") {
    var meFileLocation = path.join(
      localDirectory,
      "audio",
      "me",
      meName + ".ogg"
    );
    if (!fs.existsSync(meFileLocation)) {
      chai.assert.fail(
        "Me file not found.\n" + " Chosen bgm should be at " + meFileLocation
      );
    }
  }
}

/**
 *
 * @param {String} data
 */
function validateMapBgs(data) {
  var file = data.toString();
  var mapFile = JSON.parse(file);
  var bgs = mapFile.bgs;
  validateBgsName(bgs.name);
}

/**
 *
 * @param {String} bgsName
 */
function validateBgsName(bgsName) {
  if (bgsName != "") {
    var bgsFileLocation = path.join(
      localDirectory,
      "audio",
      "bgs",
      bgsName + ".ogg"
    );
    if (!fs.existsSync(bgsFileLocation)) {
      chai.assert.fail(
        "Bgs file not found: " + ". Chosen bgs should be at " + bgsFileLocation
      );
    }
  }
}


/**
 * A specialized version of the common event
 * validation because it is picture id based.
 * @param {String} data
 */
function validateCommonEventShowPicture() {
  commonEventInfo.map((event) => {
    if (event != null) {
      var list = event.list;
      var showPictures = list.filter(
        (x) => x.code == constants.showPictureCode
      );
      try {
        showPictures.map((picEvent) =>
          validatePictureName(picEvent.parameters[1])
        );
      } catch (ex) {
        chai.assert.fail(ex.message + "; common event: " + event.id);
      }
    }
  });
}

/**
 * This is a specialized version of common event
 * validation due to a slight parameter difference.
 * @param {Number} code
 * @param {CallableFunction} callback
 */
function validateCommonEventPlayAudio(code, callback) {
  commonEventInfo.map((event) => {
    if (event != null) {
      var list = event.list;
      var playedMovies = list.filter((x) => x.code == code);
      try {
        playedMovies.map((change) => callback(change.parameters[0].name));
      } catch (ex) {
        chai.assert.fail(ex.message + "; common event: " + event.id);
      }
    }
  });
}

/**
 * This is a specialized version of common event
 * validation due to a slight parameter difference.
 */
function validateCommonEventChangeActorImage() {
  commonEventInfo.map((event) => {
    if (event != null) {
      var list = event.list;
      if (list != null) {
        var actorImages = list.filter(
          (x) => x.code == constants.changeActorImageCode
        );
        actorImages.map(function (change) {
          try {
            var params = change.parameters;
            validateCharacterName(params[1]);
            validateFaceExists(params[3]);
            validateSideViewActorExists(params[5]);
          } catch (error) {
            chai.assert.fail(error.message + "; event: " + event.id);
          }
        });
      }
    }
  });
}

/**
 * This is a specialized version of common event
 * validation due to a slight parameter difference.
 */
function validateCommonEventShowAnimation() {
  commonEventInfo.map((event) => {
    if (event != null) {
      var list = event.list;
      if (list != null) {
        var animations = list.filter((x) => x.code == constants.showAnimation);
        animations.map(function (change) {
          var animationPictures = animationInfo.filter((x) => {
            if (x != null) {
              return x.id == change.parameters[1];
            }
          });
          animationPictures.map((anim) => {
            try {
              validateAnimationExists(anim);
            } catch (error) {
              chai.assert.fail(error.message + "; event: " + event.id);
            }
          });
        });
      }
    }
  });
}

/**
 *
 * @param {Number} code
 * @param {CallableFunction} callback
 */
function validateCommonEvent(code, callback) {
  commonEventInfo.map((event) => {
    if (event != null) {
      var list = event.list;
      var matches = list.filter((x) => x.code == code);
      try {
        matches.map((change) => callback(change.parameters[0].trim()));
      } catch (exception) {
        chai.assert.fail(
          exception.message +
          "; common event: " +
          event.id +
          " (" +
          event.name +
          ")"
        );
      }
    }
  });
}

/**
 *
 * @param {Number} code
 * @param {CallableFunction} callback
 */
function validateCommonEventUseParamOne(code, callback) {
  commonEventInfo.map((event) => {
    if (event != null) {
      var list = event.list;
      var matches = list.filter((x) => x.code == code);
      try {
        matches.map((change) => callback(change.parameters[1]));
      } catch (exception) {
        chai.assert.fail(
          exception.message +
          "; common event: " +
          event.id +
          " (" +
          event.name +
          ")"
        );
      }
    }
  });
}

describe("Proofread all maps", function () {
  it("In zero sentences are there extra white space.", function (done) {
    fs.readdir(dataDirectory, { encoding: "utf-8" }, (err, files) =>
      validateEveryMap(err, validateEventSpaceTalk, files, done)
    );
  });
  it("In zero sentences are there misspelled words.", function (done) {
    fs.readdir(dataDirectory, { encoding: "utf-8" }, (err, files) =>
      validateEveryMap(err, validateEventWordSpell, files, done)
    );
  });
});

describe("Check all the maps for working content", function () {
  it("Every map is valid JSON", function (done) {
    fs.readdir(dataDirectory, { encoding: "utf-8" }, (err, files) =>
      validateEveryMap(err, validateJSON, files, done)
    );
  });
  it("Every map that has a starting parallax; must have a parallax that is the correct width", function (done) {
    fs.readdir(dataDirectory, { encoding: "utf-8" }, (err, files) =>
      validateEveryMap(err, validateParallaxWidth, files, done)
    );
  });
  it("Every map that has a starting parallax; must have a parallax that is the correct height", function (done) {
    fs.readdir(dataDirectory, { encoding: "utf-8" }, (err, files) =>
      validateEveryMap(err, validateParallaxHeight, files, done)
    );
  });

  it("Every conversation has to have valid face", function (done) {
    fs.readdir(dataDirectory, { encoding: "utf-8" }, (err, files) =>
      validateEveryMap(
        err,
        validateEvent,
        files,
        done,
        constants.changeFaceCode,
        validateFaceExists
      )
    );
  });
  it("Every game event must have an art file that exists", function (done) {
    fs.readdir(dataDirectory, { encoding: "utf-8" }, (err, files) =>
      validateEveryMap(err, validateEventImage, files, done)
    );
  });
  it("Every changed parallax has to be valid", function (done) {
    fs.readdir(dataDirectory, { encoding: "utf-8" }, (err, files) =>
      validateEveryMap(
        err,
        validateEvent,
        files,
        done,
        constants.changeParallaxCode,
        validateParallaxName
      )
    );
  });
  it("Every changed tileset has to be valid", function (done) {
    fs.readdir(dataDirectory, { encoding: "utf-8" }, (err, files) =>
      validateEveryMap(
        err,
        validateEvent,
        files,
        done,
        constants.changeTilesetCode,
        validateTilesetID
      )
    );
  });
  it("Every played video has to be valid", function (done) {
    fs.readdir(dataDirectory, { encoding: "utf-8" }, (err, files) =>
      validateEveryMap(
        err,
        validateEvent,
        files,
        done,
        constants.playMovieCode,
        validateMovieName
      )
    );
  });
  it("Every played bgm has to be valid", function (done) {
    fs.readdir(dataDirectory, { encoding: "utf-8" }, (err, files) =>
      validateEveryMap(
        err,
        validateEventAudioChange,
        files,
        done,
        constants.playBGMCode,
        validateBgmName
      )
    );
  });
  it("Every played bgs has to be valid", function (done) {
    fs.readdir(dataDirectory, { encoding: "utf-8" }, (err, files) =>
      validateEveryMap(
        err,
        validateEventAudioChange,
        files,
        done,
        constants.playBGSCode,
        validateBgsName
      )
    );
  });
  it("Every played se has to be valid", function (done) {
    fs.readdir(dataDirectory, { encoding: "utf-8" }, (err, files) =>
      validateEveryMap(
        err,
        validateEventAudioChange,
        files,
        done,
        constants.playSeCode,
        validateSeName
      )
    );
  });
  it("Every played me has to be valid", function (done) {
    fs.readdir(dataDirectory, { encoding: "utf-8" }, (err, files) =>
      validateEveryMap(
        err,
        validateEventAudioChange,
        files,
        done,
        constants.playMeCode,
        validateMeName
      )
    );
  });
  it("Every shown picture has to be valid", function (done) {
    fs.readdir(dataDirectory, { encoding: "utf-8" }, (err, files) =>
      validateEveryMap(err, validateEventShowPicture, files, done)
    );
  });
  it("Every used switch has to be named", function (done) {
    fs.readdir(dataDirectory, { encoding: "utf-8" }, (err, files) =>
      validateEveryMap(err, validateEventSwitchName, files, done)
    );
  });
  it("Every used variable has to be named", function (done) {
    fs.readdir(dataDirectory, { encoding: "utf-8" }, (err, files) =>
      validateEveryMap(err, validateEventVariableName, files, done)
    );
  });
  it("Every shown animation has to be valid", function (done) {
    fs.readdir(dataDirectory, { encoding: "utf-8" }, (err, files) =>
      validateEveryMap(err, validateEventShowAnimation, files, done)
    );
  });
  it("Every map that starts with a parallax must have one that exists", function (done) {
    fs.readdir(dataDirectory, { encoding: "utf-8" }, (err, files) =>
      validateEveryMap(err, validateMapParallax, files, done)
    );
  });
  it("Every map tileset must have one that exists", function (done) {
    fs.readdir(dataDirectory, { encoding: "utf-8" }, (err, files) =>
      validateEveryMap(err, validateMapTileset, files, done)
    );
  });
  it("Every map that starts with background music must have one that exists", function (done) {
    fs.readdir(dataDirectory, { encoding: "utf-8" }, (err, files) =>
      validateEveryMap(err, validateMapBgm, files, done)
    );
  });
  it("Every map transfer position is known", function (done) {
    fs.readdir(dataDirectory, { encoding: "utf-8" }, (err, files) =>
      validateEveryMap(err, validateMapTransferLocation, files, done)
    );
  });
  it("Every map should be smaller than 256 by 256", function (done) {
    fs.readdir(dataDirectory, { encoding: "utf-8" }, (err, files) =>
      validateEveryMap(err, validateMapSize, files, done)
    );
  });
  it("Every map with background sounds must have one that exists", function (done) {
    fs.readdir(dataDirectory, { encoding: "utf-8" }, (err, files) =>
      validateEveryMap(err, validateMapBgs, files, done)
    );
  });
  it("On every map that game actors are changed the actor images have to exist", function (done) {
    fs.readdir(dataDirectory, { encoding: "utf-8" }, (err, files) =>
      validateEveryMap(err, validateEventChangeActorImage, files, done)
    );
  });
});

describe("Check all the common events for working content", function () {
  it("Every conversation has to have valid face", function () {
    validateCommonEvent(constants.changeFaceCode, validateFaceExists);
  });
  it("Every conversation has to have one space between words", function () {
    validateCommonEvent(constants.addTextCode, validateWordSpace);
  });
  it("Every conversation has spelled correct words", function () {
    validateCommonEvent(constants.addTextCode, validateSentenceSpelledRight);
  });
  it("Every used switch has to be named", function () {
    validateCommonEventUseParamOne(constants.controlSwitchCode, validateSwitchName);
  });
  it("Every used variable has to be named", function () {
    validateCommonEventUseParamOne(constants.controlVariablesCode, validateVariableName);
  });
  it("Every changed tileset has to be valid", function () {
    validateCommonEvent(constants.changeTilesetCode, validateTilesetID);
  });
  it("Every changed parallax has to be valid", function () {
    validateCommonEvent(constants.changeParallaxCode, validateParallaxName);
  });
  it("Every played Animation has to exist", function () {
    validateCommonEventShowAnimation();
  });
  it("Every shown picture has to exist", function () {
    validateCommonEventShowPicture();
  });
  it("Every played bgm has to exist", function () {
    validateCommonEventPlayAudio(constants.playBGMCode, validateBgmName);
  });
  it("Every played bgs has to exist", function () {
    validateCommonEventPlayAudio(constants.playBGSCode, validateBgsName);
  });
  it("Every played se has to exist", function () {
    validateCommonEventPlayAudio(constants.playSeCode, validateSeName);
  });
  it("Every played me has to exist", function () {
    validateCommonEventPlayAudio(constants.playMeCode, validateMeName);
  });
  it("Every played movie has to exist", function () {
    validateCommonEvent(constants.playMovieCode, validateMovieName);
  });
  it("Every changed Game Actor image has to exist", function () {
    validateCommonEventChangeActorImage();
  });
});
