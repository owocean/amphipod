let urlRegex = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/g;

function collectLinks($) {
    let absolute = [];
    let relative = [];

    let absoluteLinks = $("a[href^='http']");
    absoluteLinks.each(function () {
        absolute.push($(this).attr('href'));
    });

    let relativeLinks = $("a[href^='/']");
    relativeLinks.each(function () {
        relative.push($(this).attr('href'));
    });

    return { absolute, relative };
}

function collectPlaintext($) {
    let bodyText = $('html > body').text();
    let res = bodyText.match(urlRegex);
    if (res != null) {
        return res;
    } else {
        return [];
    }
}

module.exports = {
    collectLinks: collectLinks,
    collectPlaintext: collectPlaintext
}