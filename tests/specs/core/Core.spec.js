/// <reference path="../../../@types/rmmv-pixi.d.ts" />

if (typeof require !== "undefined" && typeof module != "undefined") {
  var { JsonEx } = require("../../../js/rpg_core");
  var chai = require("chai");
}

describe("JsonEx Tests", function () {

  it("should keep duplicated array references", function () {
    let array = [1, 2, 3];
    let obj = { a1: array, a2: array };
    array[4] = 5;
    let result = JsonEx.parse(JsonEx.stringify(obj));
    chai.expect(result.a1).to.equal(result.a2);
    chai.expect(obj.a1).to.equal(obj.a2);
  });

  it("should handle circular references correctly", function () {
    let a = {};
    let b = { a };
    a.b = b;
    let obj = { a1: a, a2: a };
    let result = JsonEx.parse(JsonEx.stringify(obj));
    chai.expect(result.a1).to.equal(result.a2);
    chai.expect(obj.a1).to.equal(obj.a2);
  });

});
