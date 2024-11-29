var fs = require("fs");
var path = require("path");
var { addTextCode, changeFaceCode } = require("./Constants");
var localDirectory = process.cwd();
var dataDirectory = path.join(localDirectory, "data");
var specFolder = path.join(localDirectory, "tests", "specs");
var dialogFilePath = path.join(
  localDirectory,
  "tests",
  "specs",
  "allDialog.json"
);

const mapInfoString = fs.readFileSync(
  path.join(dataDirectory, "MapInfos.json"),
  { encoding: "utf-8" }
);
const mapInfoObject = JSON.parse(mapInfoString);



// make Promise version of fs.readdir()
fs.readdirAsync = function (dirname) {
  return new Promise(function (resolve, reject) {
    fs.readdir(dirname, function (err, filenames) {
      if (err) reject(err);
      else resolve(filenames);
    });
  });
};

// make Promise version of fs.readFile()
fs.readFileAsync = function (filename, enc) {
  return new Promise(function (resolve, reject) {
    fs.readFile(filename, enc, function (err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

// utility function, return Promise
/**
 *
 * @param {String} filename
 * @returns
 */
async function getFile(filename) {
  var content = await fs.readFileAsync(
    path.join(dataDirectory, filename),
    "utf8"
  );

  var mapId = filename.match(/[\d]{3}/).toString();
  var mapNumber = Number.parseInt(mapId);
  var mapRecord = mapInfoObject.filter(function (record) {
    if (record != null && record.id == mapNumber) {
      return record;
    }
  })[0].name;

  return { mapName: filename, actualMapName: mapRecord, mapContent: content };
}

// a function specific to my project to filter out the files I need to read and process, you can pretty much ignore or write your own filter function.
/**
 *
 * @param {String} filename
 * @returns
 */
function isDataFile(filename) {
  return filename.split(".")[1] == "json"
    && filename.startsWith("Map") && !filename.endsWith("Infos.json");
}

let command = process.argv.slice(2)[0];

if (command.toLowerCase().trim() == "extract") {
  fs.writeFile(dialogFilePath, "", function () { });
  // read all json files in the directory, filter out those needed to process, and using Promise.all to time when all async readFiles has completed.
  fs.readdirAsync(dataDirectory)
    .then(function (filenames) {
      filenames = filenames.filter(isDataFile);
      return Promise.all(filenames.map(getFile));
    })
    .then(
      /**
       *
       * @param {{mapName:String,mapContent:String }[]} files
       */
      function (files) {
        var allDialog = [];
        Promise.all(
          files
            .map(function (file) {
              var jsonData = JSON.parse(file.mapContent);
              if (jsonData.events != null) {
                jsonData.events.map((event) => {
                  if (event != null) {
                    var pageId = 0;
                    event.pages.map((page) => {
                      var faceName = "None"; 
                      var faceNum = ""; 
                      var dialog = page.list
                        .filter((event) => event.code == addTextCode || event.code == changeFaceCode)
                        .map((eventCodes) => {
                          if (eventCodes.code == changeFaceCode) {
                            faceName = eventCodes.parameters[0].trim();
                            faceNum = (eventCodes.parameters[1]);
                            return;
                          }
                          return faceName + "[" + faceNum + "]" + ":" + eventCodes.parameters[0];
                        }).filter(x => x != null);
                      allDialog.push({
                        mapFile: file.mapName,
                        mapName: file.actualMapName,
                        eventId: event.id,
                        pageId: pageId,
                        dialog: dialog,
                      });
                      pageId++;
                    });
                  }
                });
              }
            }))
          .then(
            fs.appendFile(
              dialogFilePath,
              JSON.stringify(allDialog, null, 2),
              function (err) {
                if (err) {
                  return console.log(err);
                }
                console.log("The file was appended!");
              }
            )
          );
      }
    );
} else if (command.toLowerCase().trim() == "update") {
  if (!fs.existsSync(dialogFilePath)) {
    console.error("No parsed dialog exists.");
    //return -1;
  }
  let savedDialogString = fs.readFileSync(dialogFilePath, { encoding: "utf8" });
  let savedDialogObject = JSON.parse(savedDialogString);
  for (let index = 0; index < savedDialogObject.length; index++) {
    if (savedDialogObject[index].dialog.length <= 0) {
      continue;
    }
    var mapFileName = savedDialogObject[index].mapName;
    console.log("Updating file: " + mapFileName);
    let mapFilePath = path.join(dataDirectory, mapFileName);
    let mapFileContents = fs.readFileSync(mapFilePath, { encoding: "utf8" });
    let mapFileObject = JSON.parse(mapFileContents);
    mapFileObject.events.map((event) => {
      if (event != null) {
        event.pages.map((page) => {
          page.list
            .filter((event) => event.code == addTextCode)
            .map((eventCodes, pageIndex) => {
              var dialogBundle = savedDialogObject[index].dialog[pageIndex];
              return dialogBundle.split(":").slice(1);
            });
        });
      }
    });
    fs.writeFileSync(mapFilePath, JSON.stringify(mapFileObject, null, 2), {
      encoding: "utf8",
    });
  }
} else {
  console.error("Command: " + command + " is not recognized at this time.");
}
