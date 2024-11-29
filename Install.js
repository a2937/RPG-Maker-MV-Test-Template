
const fs = require("fs");
const localPackageData = fs.readFileSync("package.json", "utf8");
const { spawn } = require("child_process");

const localPackageJSON = JSON.parse(localPackageData); 

if (localPackageJSON.scripts == null)
{
  localPackageJSON.scripts = []; 
}

localPackageJSON.scripts.push({ "test": "floss --path \"tests/specs/*/*.spec.js\"" });
localPackageJSON.scripts.push({ "debug": "floss --path \"tests/specs/*/*.spec.js\" --debug" });
localPackageJSON.scripts.push({ "prune": "npm prune --production" });
localPackageJSON.scripts.push({ "lint": "eslint ." });
localPackageJSON.scripts.push({ "fix-style": "npm run lint -- --fix" });
localPackageJSON.scripts.push({ "extractDialog": "node \"tests/specs/DialogTool.js\" extract", });
localPackageJSON.scripts.push({ "updateDialog": "node \"tests/specs/DialogTool.js\" update" });

localPackageJSON.devDependencies.push({ "@types/chai": "4.2.21" });
localPackageJSON.devDependencies.push({ "chai": "4.3.4" });
localPackageJSON.devDependencies.push({ "electron": "13.1.6" });
localPackageJSON.devDependencies.push({ "eslint": "8.14.0" });
localPackageJSON.devDependencies.push({ "floss": "5.0.1" });
localPackageJSON.devDependencies.push({ "image-size": "1.0.0" });
localPackageJSON.devDependencies.push({ "jsdom": "16.6.0" });
localPackageJSON.devDependencies.push({ "sinon-chai": "3.7.0" });
localPackageJSON.devDependencies.push({ "true-case-path": "2.2.1" });

fs.writeFileSync("package.json", localPackageJSON.toString(),{"encoding":"utf8"});

fs.cpSync("./demo/tests", "./tests", { recursive: true });
fs.cpSync("./demo/@types", "./@types", { recursive: true });
fs.copyFileSync("./demo/.editorconfig", "./.editorconfig"); 
fs.copyFileSync("./demo/jsconfig.json", "./jsconfig.json"); 
fs.copyFileSync("./demo/.eslintignore", "./.eslintignore"); 

const install = spawn("npm install", ["-D"]);

install.stdout.on("data", data => {
  console.log(`stdout: ${data}`);
});

install.stderr.on("data", data => {
  console.log(`stderr: ${data}`);
});

install.on('error', (error) => {
  console.log(`error: ${error.message}`);
});

install.on("close", code => {
  console.log(`child process exited with code ${code}`);
});
