


var fs = require("fs");
var path = require("path");
var chai = require("chai");
var localDirectory = process.cwd();
var dataDirectory = path.join(localDirectory, "data");
var animationsFile = path.join(dataDirectory, "Animations.json");
require("../../js/rpg_core");
const sizeOf = require("image-size");
var constants = require("./Constants");
require("../../js/rpg_core");
require("../../js/rpg_objects");

var {
  ImageManager,
} = require("../../js/rpg_managers");
var { trueCasePathSync } = require("true-case-path");
var animations = fs.readFileSync(animationsFile, { encoding: "utf8" });

const dictionaryPath = path.join(
  localDirectory,
  "tests",
  "specs",
  "dictionaries"
);

const britDictionaryPath = path.join(dictionaryPath, "brit-a-z.txt");
const britDictionaryList = fs.readFileSync(britDictionaryPath, {
  encoding: "utf8",
});
const britishWords = britDictionaryList
  .split("\n")
  .map((x) => sanitizeWord(x.toLocaleLowerCase().trim()));

const germanDictionaryPath = path.join(dictionaryPath, "german-a-m.txt");
const germanDictionaryList = fs.readFileSync(germanDictionaryPath, {
  encoding: "utf8",
});
const germanWords = germanDictionaryList
  .split("\n")
  .map((x) => sanitizeWord(x.toLocaleLowerCase().trim()));

const germanSecondDictionaryPath = path.join(dictionaryPath, "german-n-z.txt");
const germanSecondDictionaryList = fs.readFileSync(germanSecondDictionaryPath, {
  encoding: "utf8",
});
const germanSecondWords = germanSecondDictionaryList
  .split("\n")
  .map((x) => sanitizeWord(x.toLocaleLowerCase().trim()));

const britNamesPath = path.join(dictionaryPath, "britcaps.txt");
const britNamesList = fs.readFileSync(britNamesPath, { encoding: "utf8" });
const britNames = britNamesList
  .split("\n")
  .map((x) => sanitizeWord(x.toLocaleLowerCase().trim()));

const customDictionaryPath = path.join(dictionaryPath, "custom.txt");
const customWordsList = fs.readFileSync(customDictionaryPath, {
  encoding: "utf8",
});
const customWords = customWordsList
  .split("\n")
  .map((x) => sanitizeWord(x.trim().toLocaleLowerCase()));

const curseDictionaryPath = path.join(dictionaryPath, "curse-words.txt");
const curseDictionaryList = fs.readFileSync(curseDictionaryPath, {
  encoding: "utf8",
});
const curseWords = curseDictionaryList
  .split("\n")
  .map((x) => sanitizeWord(x.toLocaleLowerCase().trim()));

const spanishDictionaryPath = path.join(dictionaryPath, "spanish.txt");
const spanishDictionaryList = fs.readFileSync(spanishDictionaryPath, {
  encoding: "utf8",
});
const spanishWords = spanishDictionaryList
  .split("\n")
  .map((x) => sanitizeWord(x.toLocaleLowerCase().trim()));

const mapsToSkip = [
];

const mapInfoString = fs.readFileSync(
  path.join(dataDirectory, "MapInfos.json"),
  { encoding: "utf-8" }
);
var mapInfoObject = JSON.parse(mapInfoString);

function validateFaceExists(faceFile) {
  if (faceFile != "") {
    var facePath = path.join(localDirectory, "img", "faces", faceFile + ".png");
    if (!fs.existsSync(facePath)) {
      chai.assert.fail("Face file not found: " + facePath);
    }
  }
}

function validateSideViewActorExists(actor) {
  if (actor != "") {
    var facePath = path.join(
      localDirectory,
      "img",
      "sv_actors",
      actor + ".png"
    );
    if (!fs.existsSync(facePath)) {
      chai.assert.fail("Side View Actor file not found: " + facePath);
    }
  }
}

/**
 * TODO: Make it not so concerned with the "GitHub" vs "Github" folder situation
 * @param {NodeJS.ErrnoException} err
 * @param {String[]} files
 * @param {Mocha.Done} done
 * @param {String} folder
 */
function checkFolderNameCase(err, files, done, folder) {
  if (err) {
    chai.assert.fail(err.message);
  }

  for (var index = 0; index < files.length; index++) {
    var file = files[index];
    var trueLocation = path.join(folder, file);
    var stats = fs.statSync(trueLocation);
    if (stats.isFile()) {
      var indexOfExtension = file.lastIndexOf(".");
      if (indexOfExtension != -1) {
        var lowerFileName =
          file.substring(0, indexOfExtension) +
          file.substring(indexOfExtension).toLowerCase();
        trueLocation = path.join(folder, lowerFileName);
      }
      if (trueCasePathSync(trueLocation).trim() !== trueLocation.trim()) {
        console.log("Regular path: " + trueLocation);
        console.log("True path: " + trueCasePathSync(trueLocation));
        chai.assert.fail(
          trueLocation +
          " has an uppercase extension and will not work on some OSes. \n"
        );
      }
    }
  }

  done();
}

/**
 *
 * @param {*} page
 * @param {Number} pageId
 */
function validateNonWalkingPage(page, pageId) {
  chai.assert.isFalse(
    page.walkAnime,
    "Page " + pageId + " is doing a walk animation"
  );
  chai.assert.isFalse(
    page.stepAnime,
    "Page " + pageId + " is doing a step animation"
  );
}

/**
 *
 * @param {String} filename
 * @returns
 */
function isMapFile(filename) {
  // var regex = /Map[\d]{3}.json/
  return (
    filename.split(".")[1] == "json" &&
    filename.split(".")[0].startsWith("Map") &&
    filename != "MapInfos.json"
  );
}

/**
 *
 * @param {{animation1Name : String, animation2Name : String}} anim : The pictures the animation is in
 */
function validateAnimationExists(anim) {
  var anim1Name = anim.animation1Name;
  var anim2Name = anim.animation2Name;
  var animLocation = "";
  if (anim1Name != "") {
    animLocation = path.join(
      localDirectory,
      "img",
      "animations",
      anim1Name + ".png"
    );

    if (!fs.existsSync(animLocation)) {
      chai.assert.fail("Animation Name not found: " + animLocation);
    }
  }
  if (anim2Name != "") {
    animLocation = path.join(
      localDirectory,
      "img",
      "animations",
      anim2Name + ".png"
    );

    if (!fs.existsSync(animLocation)) {
      chai.assert.fail("Animation Name not found: " + animLocation);
    }
  }
}

/**
 *
 * @param {String} picName
 */
function validateCharacterName(charName) {
  if (charName != "") {
    var charLocation = path.join(
      localDirectory,
      "img",
      "characters",
      charName + ".png"
    );

    if (!fs.existsSync(charLocation)) {
      chai.assert.fail("Character Name not found: " + charLocation);
    }
  }
}

/**
 *
 * @param {String} sentence
 */
function validateWordSpace(sentence) {
  var { spaces, words, betterSentence } = splitSentence(sentence);
  //If there is actually dialog
  try {
    if (spaces.length >= 1) {
      //If there is a space
      chai.assert.equal(words.length - 1, spaces.length);
    }
  } catch (error) {
    console.log("Original : " + sentence);
    console.log("Better : " + betterSentence);
    console.table(words);
    console.log("Word Count: " + words.length);
    console.log(spaces);
    console.log("Space Count:" + spaces.length);
    throw error;
  }
}

/**
 *
 * @param {{code:number,parameters : string[]}[]} list
 * @returns {string[]}
 */
function getFullDialog(list) {
  var groups = [];
  var currentGroup = -1;
  for (var index = 0; index < list.length; index++) {
    if (list[index].code == constants.changeFaceCode) {
      currentGroup++;
      groups[currentGroup] = "";
    } else if (list[index].code == constants.addTextCode) {
      groups[currentGroup] += " " + list[index].parameters[0].trim();
    }
  }
  return groups;
}


/**
 *
 * @param {number} num
 * @param {number} size
 * @returns
 */
function pad(num, size) {
  var loopTimes = 0;
  var numString = num.toString();
  while (numString.length < size || loopTimes > size) {
    numString = "0" + numString;
    loopTimes++;
  }
  return numString;
}

/**
 *
 * @param {String} sentence
 * @returns {{words: string[],betterSentence:string,spaces:string}}
 */
function splitSentence(sentence) {
  var betterSentence = sentence
    .replace("—", "-") // Dashes
    .replace(/\\+fi(.+)\\+fi\.\.\./g, "$1") // ...\fi..\fi(space) tags
    .replace(/\\+fi(.+)\.\.\.\\+fi/g, "$1") // ...\fi..\fi(space) tags
    .replaceAll(" ... ", " ") //Ellipses typically indicate a pause in talking
    .replaceAll("... ", " ")
    .replaceAll(" ...", " ")
    .replaceAll("...", " ")
    .replace(/\s*<br> <br>\s*/g, " ")
    .replace(/\s+-{2}/g, " ")
    .replace(/-{2}\s+/g, " ")
    .replace(/-{2}/g, " ") // 2 dashes is a space
    .replaceAll(" <br> <br>...", " ")
    .replaceAll("’", "'") // Use the normal single quote
    .replaceAll("`", "'") // Use the normal single quote
    .replaceAll(" <br> ", " ")
    .replaceAll(" <br>", " ") // Line breaks mean there technically is a space
    .replaceAll("<br> ", " ")
    .replaceAll(/\\+fi(.+)\\+fi/g, "$1") // \fi..\fi tags
    .replaceAll(/\\+fb(.+)\\+fb\s/g, "$1") // ...\fb..\fb(space) tags
    .replaceAll(/\\+fb(.+)\\+fb/g, "$1") // ...\fb..\fb tags
    .replaceAll(/\\+...fb(.+)\\+fb/g, "$1") // ...\fb..\fb tags
    .replaceAll("<br>", " ")
    .replaceAll(/[-]{2}/g, "")
    .replaceAll(/(\\{)*\\Shake/g, "") // \{\{\Shake
    .replaceAll(/\d+-/g, ""); // 1-255-843-929-9428-47-69-5433-38337-2-
  //.replaceAll(/([a-zA-Z])-([a-zA-Z])/g, "$1 $2"); // x-ray
  var spaceRegex = new RegExp(/[\s]/g);
  //All letters and numbers and all punctuation except dashes
  var letterRegex = new RegExp(
    /[\w\u00C0-\u00FF.,/*#!$%^&*;:{}=_`~()?`'[\]'{}<>\\\\+’…”'',“|"—Ψ]/gi
  );
  var words = betterSentence
    .trim()
    .split(spaceRegex)
    .filter((x) => x != "");
  var spaces = betterSentence
    .trim()
    .replaceAll(letterRegex, "")
    .replace(/-/g, "")
    .replaceAll("\n", "")
    .replace(/[^\x20-\x7E]/g, "");
  return { spaces, words, betterSentence };
}

/**
 *
 * @param {String} picName
 */
function validatePictureName(picName) {
  if (picName != "") {
    var picLocation = path.join(
      localDirectory,
      "img",
      "pictures",
      picName + ".png"
    );

    if (!fs.existsSync(picLocation)) {
      chai.assert.fail("Picture Name not found: " + picLocation);
    }
  }
}

/**
 *
 * @param {String} folder - Name of the folder in the img folder
 * @param {String} picName
 * @param {Number} width
 */
function validatePictureWidth(folder, picName, width) {
  if (picName != "") {
    var imageFile = path.join(localDirectory, "img", folder, picName + ".png");
    const dimensions = sizeOf(imageFile);
    //var bitmap = ImageManager.reserveBitmap(directory, picName, 0, 255);
    chai.assert.equal(
      dimensions.width,
      width,
      "Bitmap is not the correct width"
    );
  }
}

/**
 *
 * @param {String} source
 * @returns {String[]}
 */
function getTilesetDirectories(source) {
  return fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .filter(
      (x) =>
        x.startsWith("tileset") ||
        x.startsWith("Tileset") ||
        x.endsWith("tileset") ||
        x.endsWith("Tileset")
    );
}


/**
 *
 * @param {NodeJS.ErrnoException} error
 * @param {string[]} fileNames
 * @param {Function} callback
 * @param {Mocha.Done} done
 * @param {Number} eventCode
 * @param {CallableFunction} eventValidateFunction
 */
function validateEveryMap(
  error,
  callback,
  fileNames,
  done,
  eventCode = -1,
  eventValidateFunction = null
) {
  if (error) {
    console.error(error);
  }
  var maps = fileNames
    .filter((name) => {
      return name.startsWith("Map");
    })
    .sort();

  for (var mapIndex = 0; mapIndex < maps.length; mapIndex++) {
    var fileName = maps[mapIndex];
    if (isMapFile(fileName) && !mapsToSkip.contains(fileName)) {
      var data = fs.readFileSync(path.join(dataDirectory, fileName), {
        encoding: "utf-8",
      });
      try {
        if (eventCode != -1 && eventValidateFunction != null) {
          callback(data, eventCode, eventValidateFunction);
        } else {
          callback(data);
        }
      } catch (error) {
        var mapId = fileName.match(/[\d]{3}/).toString();
        var mapNumber = Number.parseInt(mapId);
        var mapRecord = mapInfoObject.filter(function (record) {
          if (record != null && record.id == mapNumber) {
            return record;
          }
        })[0];
        chai.assert.fail(
          error.message + " " + fileName + "(" + mapRecord.name + ")"
        );
      }
    }
  }
  done();
}


/**
 * @param {String} folder
 * @param {String} picName
 * @param {Number} height
 */
function validatePictureHeight(folder, picName, height) {
  if (picName != "") {
    var imageFile = path.join(localDirectory, "img", folder, picName + ".png");
    const dimensions = sizeOf(imageFile);
    chai.assert.equal(
      dimensions.height,
      height,
      "Bitmap is not the correct height"
    );
  }
}

/**
 * Completely ignores accent symbols when determining spelling
 * correctness.
 * @param {string} word
 * @returns {boolean}
 */
function isWordSpelledCorrectly(word) {
  var trimmedWord = sanitizeWord(word);
  if (
    britNames.contains(trimmedWord) ||
    britishWords.contains(trimmedWord) ||
    curseWords.contains(trimmedWord) ||
    customWords.contains(trimmedWord) ||
    germanWords.contains(trimmedWord) ||
    germanSecondWords.contains(trimmedWord) ||
    spanishWords.contains(trimmedWord)
  ) {
    return true;
  } else {
    return false;
  }
}

/**
 *
 * @param {string} word
 * @returns {string}
 */
function sanitizeWord(word) {
  try {
    return (
      word
        .normalize("NFD")
        .replaceAll(/[\u0300-\u036f]/g, "") // Accent characters
        .replaceAll(/<.+>/g, "") //Any tags need to go
        .replaceAll(/“/g, "")
        .replaceAll(/”/g, "")
        .replaceAll(/"/g, "")
        .replaceAll(/"/g, "")
        // .replaceAll(/\\+fi(.+)\\+fi/g, "$1") // \fi...\fi tags
        .replaceAll(/\\+fb(.+)\\+fb/g, "$1") // \fb..\fb tags
        .replaceAll("\\fi", "")
        .replace(/'.+'/g, "") // Any quotes

        .replace(/^'/g, "") // All starting quotes
        .replace(/'$/g, "") // All end quotes
        .replaceAll(/\\*\D.+\[\d+\]/g, "") // Escaped values
        .replaceAll(/[*!$%^&*(!)_+|~={"}[\]:;\\?,./>]/g, "") // All punctuation except dashes
        .replace(/^\d*/g, "") // All leftover numbers
        .replace("…", "") // Hesitation gets removed
        .replace(/-*$/g, " ") // end dashes
        .replace(/^-*/g, " ") // start dashes
        .toLocaleLowerCase()
        .trim()
    );
  } catch (ex) {
    console.error(ex.message + " was thrown because of word: " + word);
  }
}

/**
 *
 * @param {string} sentence
 */
function validateSentenceSpelledRight(sentence) {
  var words = splitSentence(sentence).words;
  words.map((word) => {
    var safeWord = sanitizeWord(word);
    var spelledCorrectly = isWordSpelledCorrectly(safeWord);
    chai.assert.isTrue(
      spelledCorrectly,
      "The word originally '" +
      word +
      "'" +
      " which was sanitized to '" +
      safeWord +
      "' appears to be misspelled" +
      " \n" +
      "In the sentence : " +
      words.join(" ") +
      "\n" +
      " original sentence : " +
      sentence
    );
  });
}

/**
 *
 * @param {number} bigWidth
 * @param {number} bigHeight
 * @param {number} smallWidth
 * @param {number} smallHeight
 * @param {number} bigToSmallRatio
 */
function validateRatio(
  bigWidth,
  bigHeight,
  smallWidth,
  smallHeight,
  bigToSmallRatio
) {
  var actualXRatio = smallWidth / bigWidth;
  var actualYRatio = smallHeight / bigHeight;
  chai.assert.equal(
    actualXRatio,
    bigToSmallRatio,
    "The expected ratio (" +
    bigToSmallRatio +
    ") does not equal the actual width ratio: " +
    actualXRatio +
    "\n Small Width: " +
    smallWidth +
    "\n Big width: " +
    bigWidth
  );
  chai.assert.equal(
    actualYRatio,
    bigToSmallRatio,
    "The expected ratio (" +
    bigToSmallRatio +
    ") does not equal the actual height ratio: " +
    actualYRatio +
    "\n Small Height: " +
    smallHeight +
    "\n Big height: " +
    bigHeight
  );
}

/**
 *
 * @param {Number} itemId
 * @param {Number} quantity
 * @param {Number} pageId
 * @param {RPG.EventPage} pageList
 */
function itemQuantityIsDecreased(itemId, quantity, pageId, pageList) {
  var itemCommands = pageList.filter((x) => x.code == constants.changeItemCode);
  var itemCommand = itemCommands.filter((x) => x.parameters[0] == itemId)[0];
  chai.assert.isNotNull(
    itemCommand,
    "Item id " +
    itemId +
    " is not referenced on this page when it should be removed."
  );
  chai.assert.strictEqual(
    itemCommand.parameters[1],
    constants.decrease,
    "The value of the item is not going down"
  );
  chai.assert.strictEqual(
    itemCommand.parameters[3],
    quantity,
    "The value of the item is not going down by the expected amount on page " +
    pageId +
    ": Current value is " +
    itemCommand.parameters[3] +
    "; expected is " +
    quantity
  );
}


/**
 *
 * @param {Number} itemId
 * @param {Number} quantity
 * @param {Number} pageId
 * @param {RPG.EventPage} pageList
 */
function itemQuantityIsIncreased(itemId, quantity, pageId, pageList) {
  var itemCommands = pageList.filter((x) => x.code == constants.changeItemCode);
  var itemCommand = itemCommands.filter((x) => x.parameters[0] == itemId)[0];
  chai.assert.isNotNull(
    itemCommand,
    "Item id " +
    itemId +
    " is not referenced on this page when it should be added."
  );
  chai.assert.strictEqual(
    itemCommand.parameters[1],
    constants.increase,
    "The value of the item is not going up"
  );
  chai.assert.strictEqual(
    itemCommand.parameters[3],
    quantity,
    "The value of the item is not going up by the expected amount on page " +
    pageId +
    ": Current value is " +
    itemCommand.parameters[3] +
    "; expected is " +
    quantity
  );
}



/**
 * 
 * @param {Game_Event} event 
 */
function checkForTextOutlineSetForCuphead(event) {
  for (var pageIndex = 0; pageIndex < event.pages.length; pageIndex++) {
    var dialogLine = "";
    for (var codeIndex = 0; codeIndex < event.pages[pageIndex].list.length; codeIndex++) {
      if (event.pages[pageIndex].list[codeIndex].code == constants.addTextCode) {
        dialogLine += event.pages[pageIndex].list[codeIndex].parameters[0];
      }
      else if (event.pages[pageIndex].list[codeIndex].code == constants.changeFaceCode) {
        if (!dialogLine.startsWith("\\ow[1]") && dialogLine != "") {
          chai.assert.fail(dialogLine + " : does not start with an '\\ow'");
        }
        dialogLine = "";
      }
    }
  }
}




/**
 * TODO: Make it not so concerned with the "GitHub" vs "Github" folder situation
 * @param {NodeJS.ErrnoException} err
 * @param {String[]} files
 * @param {Mocha.Done} done
 * @param {String} folder
 * @param {expectedExtension} string
 */
function ensureProperExtension(err, files, done, folder, expectedExtension) {
  if (err) {
    chai.assert.fail(err.message);
  }

  for (var index = 0; index < files.length; index++) {
    var file = files[index];
    var trueLocation = path.join(folder, file);
    var stats = fs.statSync(trueLocation);
    if (stats.isFile()) {
      var indexOfExtension = file.lastIndexOf(".");
      var fileName = file.substring(0, indexOfExtension);
      var extension = file.substring(indexOfExtension).toLowerCase();
      if (indexOfExtension != -1) {
        chai.assert.equal(extension, expectedExtension, "The file " + fileName + extension + " should have an extension of " + expectedExtension)
      }
    }
  }

  done();
}



///TODO: Use SinonJS to do the replacements
// Worth looking into? https://nodejs.org/api/vm.html#new-vmscriptcode-options
function initializeGameDataFakes() {
  global.$dataCommonEvents = {

  };

  global.ImageManager = ImageManager;
  global.AudioManager = {
    playBgm: function () { },
    playBgs: function () { },
    playSe: function () { },
    stopSe: function () { },
    stopBgs: function () { },
  };
  global.$gameScreen = {
    startTint: function () { },
    erasePicture: function (pictureId) { },
    startFadeOut: function () { },
    startFadeIn: function () { }
  };
  global.$gameMessage = {
    _texts: [],
    _choices: [],
    _faceName: "",
    _faceIndex: 0,
    _background: 0,
    _positionType: 2,
    _choiceDefaultType: 0,
    _choiceCancelType: 0,
    _choiceBackground: 0,
    _choicePositionType: 2,
    _numInputVariableId: 0,
    _numInputMaxDigits: 0,
    _itemChoiceVariableId: 0,
    _itemChoiceItypeId: 0,
    _scrollMode: false,
    _scrollSpeed: 2,
    _scrollNoFast: false,
    _choiceCallback: null,
    isBusy: function () {
      return false;
    },
    requestImages: function (list) {

    },
    setFaceImage: function (faceName) {
      return;
    },
    setBackground: function () {
      return;
    },
    setPositionType: function () {
      return;
    },
    add: function () {
      return;
    },
    setChoices(choices, defaultType, cancelType) {
      this._choices = choices;
      this._choiceDefaultType = defaultType;
      this._choiceCancelType = cancelType;
    },
    setChoiceBackground(background) {
      this._choiceBackground = background;
    },
    setChoicePositionType(positionType) {
      this._positionType = positionType;
    },
    setChoiceCallback(callback) {
      this._choiceCallback = callback;
    },
    onChoice: function (n) {
      if (this._choiceCallback) {
        this._choiceCallback(n);
        this._choiceCallback = null;
      }
    },
  };
  global.$gameDvLyon = {
    currentSaveFont: "",
    setSaveFont: function (fontName) {
      this.currentSaveFont = fontName;
    },
  };
  global.$gameSwitches = {
    data: [],
    setValue: function (switchId, value) {
      if (switchId > 0) {
        this.data[switchId] = value;
      }
    },
    value: function (switchId) {
      return !!this.data[switchId];
    },
  };
  global.$gameVariables = {
    data: [],
    setValue: function (variableId, value) {
      this.data[variableId] = value;
    },
    value: function (variableId) {
      return this.data[variableId] || 0;
    },
  };
  global.$dataActors = {};
  global.$dataItems = {};
  global.$dataAnimations = JSON.parse(animations);
  global.$gameActors = {
    actor: function (id) {
      return {
        name: function () {
          return "Nugget";
        },
      };
    },
  };
  global.$gameMap = {
    mapId: function () {
      return -1;
    },
  };
  global.$gameParty = {
    hasItem: function (itemId) {
      return true;
    },
    gainItem: function (itemId, quantity, includeEquip) {
      return;
    },
    inBattle: function () {
      return false;
    },
  };
}

module.exports = {
  validateNonWalkingPage,
  validateAnimationExists,
  validateFaceExists,
  validateCharacterName,
  validateWordSpace,
  validatePictureName,
  validatePictureHeight,
  validatePictureWidth,
  itemQuantityIsDecreased,
  initializeGameDataFakes,
  splitSentence,
  pad,
  isWordSpelledCorrectly,
  validateSentenceSpelledRight,
  sanitizeWord,
  isMapFile,
  checkFolderNameCase,
  getFullDialog,
  validateSideViewActorExists,
  validateRatio,
  checkForTextOutlineSetForCuphead,
  ensureProperExtension,
  itemQuantityIsIncreased,
  getTilesetDirectories,
  validateEveryMap
};
