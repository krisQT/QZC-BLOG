require("bable-core/register")({
    presets:["es2015","stage-0"]
});

require("bable-polyfill");

module.exports = require("./index.js")