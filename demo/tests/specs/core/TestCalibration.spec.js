if (typeof require !== "undefined" && typeof module != "undefined") {
  var chai = require("chai");
  var sinon = require("sinon");
  var {
    splitSentence,
    pad,
    isWordSpelledCorrectly,
    sanitizeWord,
    validateRatio,
  } = require("../Helpers");
  /**
   * @type {import("sinon").SinonFakeTimers}
   */
  var clock;
}

before(async function () {});

after(function () {
  /*
  * Only runs if it is invoked on the CLI
  if (clock != null) {
    clock.restore();
  }
  */
});

describe("Calibration: Can correctly initialize testing system", function () {
  it("1 is equal to 1", function () {
    chai.assert.equal(1, 1);
  });
});

describe("Calibration: Can manipulate time using Sinon.js", function () {
  it("Can set the date January 1st 1997", function () {
    clock = sinon.useFakeTimers({
      now: new Date(1997, 1, 1, 0, 0),
    });
    chai.assert.equal(new Date().getFullYear(), 1997, "Year not set correctly");
    chai.assert.equal(new Date().getMonth(), 1, "Month not set correctly");
    chai.assert.equal(new Date().getDate(), 1, "Day not set correctly");
    clock.restore();
  });
  it("Date time restored after manipulation", function () {
    chai.assert.notEqual(
      new Date().getFullYear(),
      1997,
      "Today's year should not be set to 1997"
    );
  });
});

describe("Calibration: Map file name is correctly padded", function () {
  it("Single digit map files should output correctly", function () {
    var paddedNumber = pad(1, 3);
    chai.assert.strictEqual(
      paddedNumber,
      "001",
      "The file name is not correct"
    );
  });
  it("Double digit map files should output correctly", function () {
    var paddedNumber = pad(10, 3);
    chai.assert.strictEqual(
      paddedNumber,
      "010",
      "The file name is not correct"
    );
  });
  it("Triple digit map files should output correctly", function () {
    var paddedNumber = pad(100, 3);
    chai.assert.strictEqual(
      paddedNumber,
      "100",
      "The file name is not correct"
    );
  });
});

describe("Calibration: Can correctly determine space count", function () {
  it("Spaces before or after a sentence should not affect space count", function () {
    var { spaces, words } = splitSentence(" Spaces before and after ");
    chai.assert.equal(
      spaces.length,
      words.length - 1,
      "Space count is not equal to the number of words minus one"
    );
  });
  it("An incorrect number of spaces in a sentence should be detected", function () {
    var { spaces, words } = splitSentence("Sentence  with   big spaces");
    chai.assert.notEqual(
      spaces.length,
      words.length - 1,
      "Space count should not be equal since there are five when two are expected"
    );
  });
});

describe("Calibration: sanitizing works correctly", function () {
  it("The word 'x-ray' should be in tact", function () {
    var betterWord = sanitizeWord("x-ray");
    chai.assert.equal(
      betterWord,
      "x-ray",
      "Something went wrong with the dash"
    );
  });
});

describe("Calibration : Ratio detection works properly", function () {
  it("64 to 48 scale is 3:4", function () {
    validateRatio(64, 64, 48, 48, 0.75);
  });
});

describe("Calibration: Can properly detect word spellings", function () {
  it("Can correctly identify words with special symbols like 'Seán' are spelled right", function () {
    var wordCorrect = isWordSpelledCorrectly("Seán");
    chai.assert.isTrue(wordCorrect);
  });
  it("Can correctly detect words with spaces are spelled correctly like ' goat ' ", function () {
    var wordCorrect = isWordSpelledCorrectly(" goat ");
    chai.assert.isTrue(wordCorrect);
  });
  it("Can correctly detect words with hyphens are spelled correctly like 'x-ray' ", function () {
    var wordCorrect = isWordSpelledCorrectly("x-ray");
    chai.assert.isTrue(wordCorrect);
  });
  it("Can correctly detect words with spaces are spelled wrong like ' biscut ' ", function () {
    var wordCorrect = isWordSpelledCorrectly("biscut");
    chai.assert.isFalse(wordCorrect);
  });
  it("Can correctly determine a word is spelled correctly regardless of case ", function () {
    var wordCorrect = isWordSpelledCorrectly("Biscuit");
    chai.assert.isTrue(wordCorrect);
  });
  it("Can correctly determine a word is spelled correctly regardless of extra punctuation ", function () {
    var wordCorrect = isWordSpelledCorrectly("biscuit.");
    chai.assert.isTrue(wordCorrect);
  });
  it("Can correctly determine that a single word in the sentence is spelled wrong like 'The fox ate the brid.' ", function () {
    var phrase = "The fox ate the brid";
    var words = phrase.split(" ");
    words.map((word) => {
      var spelledCorrectly = isWordSpelledCorrectly(word);
      if (word == "brid") {
        chai.assert.isFalse(
          spelledCorrectly,
          "The word " + word + " was falsely declared to be spelled correctly."
        );
      } else {
        chai.assert.isTrue(
          spelledCorrectly,
          "The word " + word + " was falsely declared as misspelled."
        );
      }
    });
  });
});
