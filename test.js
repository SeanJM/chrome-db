const fs = require('fs');
const path = require('path');

const b = fs.readFileSync(path.resolve('proxy/chrome.storage.js'), 'utf8');
const c = fs.readFileSync(path.resolve('index.js'), 'utf8');

fs.writeFileSync('.temp.js', b + '\n' + c);

const tinyTest = require('tiny-test');
const ChromeDB = require('./.temp.js');
const db = new ChromeDB();

module.exports = tinyTest(function (test, load) {
  test('basic')
    .this(function () {
      return db.set('test', 'value');
    })
    .isEqual(function () {
      return 'value';
    });

  load();
}).then(function () {
  fs.unlink('./.temp.js');
});
