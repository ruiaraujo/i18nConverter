const glob = require('glob');
const path = require('path');
const fs = require('fs');
const flatten = require('flat');
const stringify = require('json-stable-stringify');

const args = process.argv;

if (args.length < 4) {
    console.log('Usage: node converter.js folder locale')
}

const folder = args[2],
    locale = args[3] + '.json';

const mergedFiles = glob.sync(path.join(folder, '**', locale))
    .map((file) => flatten(JSON.parse(fs.readFileSync(file, 'utf-8'))))
    .reduce((result, file) => Object.assign({}, result, file));

fs.writeFileSync(locale, stringify(mergedFiles), 'utf-8');
