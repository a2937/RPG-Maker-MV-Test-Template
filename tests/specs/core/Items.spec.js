if (typeof require !== "undefined" && typeof module != "undefined") {
  var chai = require("chai");
  var path = require("path");
  var fs = require("fs");
  var localDirectory = process.cwd();
  var dataDirectory = path.join(localDirectory, "data");
  var itemFile = fs
    .readFileSync(path.join(dataDirectory, "Items.json"))
    .toString();
  var itemData = JSON.parse(itemFile);
}

describe("Determine if items are valid", function () {
  it("No items should be using an icon id of 0 as it is reserved for empty stuff", function (done) {
    Promise.all(
      itemData
        .map((item) => {
          if (item == null) {
            return;
          } else {
            if (item.name.trim() != "" || item.description.trim() != "") {
              chai.assert.notEqual(
                item.iconIndex,
                0,
                "Item " +
                  item.id +
                  " (" +
                  item.name +
                  ") " +
                  " uses an icon of 0 which is not allowed."
              );
            }
          }
        })
        .then(done())
    );
  });
});
