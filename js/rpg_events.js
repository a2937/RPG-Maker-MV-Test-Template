


this.triggerRubble = 0;


function updateTriggerRocks() {
  this.triggerRubble++;
}

function getRubbleTriggerCount() {
  return this.triggerRubble;
}

function writeTeaserFile() {
  /*
  * This would be where I would write 
  * my teaser file on all platforms. 
  * If I could download in GameJolt games
  var process = require('process');
  if (process.platform != "darwin") {
    let fs = require("fs");
    let path = require("path");
    if (!fs.existsSync("./code")) {
      fs.mkdirSync("./code");
    }
    let directory = path.join("code", "help me.txt");
    var truePath = path.resolve(directory);




    let data = " I̓̀́̑ͯͭ̈́̓̈́̎ͩ̂́̽ͯ̇͘҉̷͙͇͙͙̼̪̺̦̜̲͖̳̭̲̥͟ͅ ̷̸̅͊̓͐͂̿͠͏̠͙̼̦̦͙̪͚̺̙̣̗̳ͅĄ̴̛̳͕̤͔̥̦̗̜̥͇̦̩̙̍ͩͮ̈͗͊͢͠ͅ ̶̸̬̱̰̻͕̩͔̦̳͇̺͎̲͎͍͌ͭ̍̇͛ͫ̊͊ͣ͞͠M̵̵͙̼̠͙̤̬̬̤̞̘̝̾̋͆ͥ̋̑̒̃̑̚͜ ̱̳̱̲̉ͦ̓̓̊͗̊̅͗̏̈́ͥ̄ͪͩ͘͢͟͝Ḅ̛͕̫͕̗̏ͨ̎̿ͬͥ͊̎ͣͤͧ̃ͥ͌̄ͪ̐̀͘͝͝ ̷̷̴̥̱̞͈͕̮̻̟̣̗̈́̎̍ͭ͑ͥͣͩͧ̅̃̒͒͒ͭ͘͡R̵̸̬̠̱̬̭̬̪̝͚͒͗ͧ͋̔ͤ̀͛̓̚͡ ̷̵̨̖̹͉̻͍̫͇̥͎̞̖͈͎͖̿͋̋ͫ̄ͯ̏̊ͬ̆͂̀Õ̴̷̲̗̲̬̜͙̘̞ͩ͌̄̀̔͑̅̌ͦ̉͋ͦ̒̚̕͡ ̶̨̢̜̜̯̳̼ͥ̄̽̊̃̊͛ͬ͡Ǩ̢̬̮̬̥̤̘̜̪̬̘̥̳̟̞͕͙̭̰̀̏́ͭ̏̎̾͊̉͗̋̿̄̚̕ ̱̦͉̞̜̦͕̗͙̬̝̠̣̐̂̑ͦͬͩͩ̿̂̽͘E̶̠̤̳̟̳̗̻͇̲ͤ̾ͯ̽̓̈́͐ͦͤ̃ ̵̰̖̞̤̥̤̲̖̘̙̰̬̰̐̍ͧ͊ͥ̚͢N̴̵͖͚̦̙̠̲͓͕͕̞̜̞̜̪̆ͥ̎͌͝ͅ ";


    fs.writeFileSync(truePath, data);
  }
  */
}

if (typeof require !== 'undefined' && typeof module != "undefined") {
  module.exports = { updateTriggerRocks, getRubbleTriggerCount };
}
