const { getTitle, delay } = require("./legs"),
    { save } = require("./fs"),
    chalk = require("chalk"),
    exec = require("child_process").execSync;

async function guess(v){
    let addr = "http://"+exec('python src/ip.py').toString().trim();
    if(v)console.log("Guessing "+addr+" ...");
    let title = await getTitle(addr);
    if(title != 'unknown'){
        console.log(chalk.green("Successful IP guess: "+addr));
        await save([{url:addr,title:title}]);
    }
    await delay(500);
    guess(v);
}



module.exports = guess;