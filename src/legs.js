const cheerio = require('cheerio'),
    { save, read, checkIfExists } = require("./fs"),
    rp = require('request-promise'),
    p = require('./parse'),
    path = require("path"),
    chalk = require("chalk");

let sweepCounter = 0;

async function sweep(v) {
    let pages = await read();
    pages = shuffle(pages).splice(0,Math.ceil(pages.length / 2));
    await forEach(pages, async function (page) {
        if(v)console.log("Parsing "+page.url+" ...");
        try {
            let html = await rp(page.url);
            await parse(html, page.url);
        } catch (err) { }
    });
    sweepCounter++;
    console.log(chalk.green("Swept " + sweepCounter + " time(s)"));
    await delay(10000);
    sweep(v);
}

async function parse(res, url) {
    let $ = cheerio.load(res);
    let links = p.collectLinks($);
    let plaintext = p.collectPlaintext($);
    for (var i = 0; i < links.relative.length; i++) {
        if (links.relative[i].startsWith("//")) {
            links.absolute.push("http:" + links.relative[i]);
            continue;
        }
        links.relative[i] = path.join(url, links.relative[i]);
    }
    links = links.absolute.concat(links.relative).concat(plaintext);
    let valid = [];
    await forEach(links, async function (link) {
        if (link.includes(":\\")) {
            link = link.replace(":\\", "://");
        }
        if (await checkIfExists(link) == false) {
            valid.push(link.replace(/\\/g, "/"));
        }
    });
    valid = shuffle(valid).splice(0,Math.ceil(valid.length / 2));
    for (var i = 0; i < valid.length; i++) {
        if (await isDupe(valid, valid[i])) continue;
        let title = await getTitle(valid[i]);
        valid[i] = { url: valid[i], title: title };
    }
    save(valid);
}

async function getTitle(url) {
    try {
        let html = await rp(url);
        let $ = cheerio.load(html);
        return $('title').text();
    } catch (err) {
        return "unknown";
    }
}

async function forEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

function delay(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}

async function isDupe(list, item) {
    await forEach(list, function (i) {
        if (i.url == item.url) {
            return true;
        }
    });
    return false;
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

module.exports.sweep = sweep;
module.exports.getTitle = getTitle;
module.exports.delay = delay;