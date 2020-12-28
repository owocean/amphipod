# amphipod
Web crawler that crawls the web

# prerequisites 
* Node.js v12.16.3
* NPM v6.14.8
* Python v3.7.4
it probably works on other versions of any of these i just havent tested it

# install
```sh
$ git clone http://github.com/owocean/amphipod.git
$ cd amphipod
$ npm i
```

# usage
```sh
$ node index
```
Arguments:
* `verbose` - Enables verbose output
* `nocrawl` - Runs without webcrawler
* `ipguess` - Enables IP Guessing

## searching
```javascript
const search = require("./search"); // relative path to search.js

(async () => {
    var result = await search('output/','lorem ipsum'); // path to output directory + search term
    console.log(result);
})();
```