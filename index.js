var fs = require("fs");

if (!fs.existsSync('output/')) {
    fs.mkdirSync('output');
}

const { sweep } = require("./src/legs");
const guess = require("./src/ipguess");

let verbose = false;

if(process.argv.join(" ").includes("verbose")){
    verbose = true;
    console.log("Verbose output enabled");
}

if (process.argv[2] == undefined || !process.argv.join(" ").includes("nocrawl")) {
    console.log("Begin crawling");
    sweep(verbose);
} else {
    console.log("Crawler disabled");
}

if(process.argv.join(" ").includes("ipguess")){
    console.log("Begin IP Guessing");
    guess(verbose);
}