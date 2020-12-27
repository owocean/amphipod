const fs = require("fs"),
    util = require("util"),
    path = require("path");

const fsReaddir = util.promisify(fs.readdir),
    fsReadFile = util.promisify(fs.readFile),
    fsLstat = util.promisify(fs.lstat),
    fsWriteFile = util.promisify(fs.writeFile);

async function save(json) {
    let latest = await getLatest();
    if (!fs.existsSync('output/' + latest)) {
        await fsWriteFile('output/' + latest, '[]');
    }
    let j = JSON.parse(await fsReadFile('output/'+latest));
    fsWriteFile("output/" + latest, JSON.stringify(j.concat(json),null,4));
}

async function read() {
    let output = fs.readdirSync("output/");
    if (output.length == 0) {
        let contents = fs.readFileSync("defaults.txt").toString().replace(/\r/g, "");
        let j = [];
        contents = contents.split("\n");
        contents.forEach(function(l){
            j.push({url:l});
        });
        return j;
    }
    let selected = output[Math.floor(Math.random() * output.length)];
    let contents = fs.readFileSync("output/" + selected).toString();
    return JSON.parse(contents);
}

async function checkIfExists(url){
    let res = await searchFilesInDirectory('output/', '"'+url+'"', '');
    return res;
}

async function getLatest() {
    let output = fs.readdirSync("output/");
    if (output.length == 0) {
        let name = Date.now().toString();
        fs.writeFileSync("output/" + name, '[]');
        return name;
    } else {
        let f = biggest(output).toString();
        if (await countFileLines("output/" + f) > 1000) {
            let name = Date.now().toString();
            fs.writeFileSync("output/" + name, '[]');
            return name;
        } else {
            return f;
        }
    }
}

function biggest(arr) {
    let largest = arr[0] || null;
    let number = null;
    for (var i = 0; i < arr.length; i++) {
        number = parseInt(arr[i]);
        largest = Math.max(largest, number);
    }
    return largest;
}

function countFileLines(filePath) {
    return new Promise((resolve, reject) => {
        let lineCount = 0;
        fs.createReadStream(filePath)
            .on("data", (buffer) => {
                let idx = -1;
                lineCount--;
                do {
                    idx = buffer.indexOf(10, idx + 1);
                    lineCount++;
                } while (idx !== -1);
            }).on("end", () => {
                resolve(lineCount);
            }).on("error", reject);
    });
}

async function searchFilesInDirectory(dir, filter, ext) {
    const found = await getFilesInDirectory(dir, ext);
    for (let file of found) {
        const fileContent = await fsReadFile(file);
        const regex = new RegExp('\\b' + filter + '\\b');
        if (regex.test(fileContent)) {
            return true;
        }
    }
    return false;
}

async function getFilesInDirectory(dir, ext) {
    let files = [];
    const filesFromDirectory = await fsReaddir(dir).catch(err => {
        throw new Error(err.message);
    });
    for (let file of filesFromDirectory) {
        const filePath = path.join(dir, file);
        const stat = await fsLstat(filePath);
        if (stat.isDirectory()) {
            const nestedFiles = await getFilesInDirectory(filePath, ext);
            files = files.concat(nestedFiles);
        } else {
            if (path.extname(file) === ext) {
                files.push(filePath);
            }
        }
    }
    return files;
}

module.exports = {
    save: save,
    read: read,
    checkIfExists: checkIfExists
}