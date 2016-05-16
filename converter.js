const glob = require('glob');
const path = require('path');
const fs = require('fs');
const flatten = require('flat');
const stringify = require('json-stable-stringify');

const args = process.argv;

if (args.length < 3) {
    console.log('Usage: node converter.js folder')
    process.exit(-1);
}

const folder = args[2];

const mergedFiles = glob.sync(path.join(folder, '**', '*.json'))
    .map((file) => ({
        key: path.basename(file),
        content: flatten(JSON.parse(fs.readFileSync(file, 'utf-8')))
    }))
    .reduce((result, file) => {
        result[file.key] = Object.assign({}, result[file.key], file.content);
        return result;
    }, {});

// Filter incompatible values
Object.keys(mergedFiles)
    .forEach((locale) => fs.writeFileSync(locale, stringify(mergedFiles[locale]).replace(/{{/g, '{').replace(/}}/g, '}'), 'utf-8'));

