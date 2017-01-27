const fs = require('fs');
const path = require('path');

const b = fs.readFileSync(path.resolve('proxy/chrome.storage.js'), 'utf8');
const c = fs.readFileSync(path.resolve('index.js'), 'utf8');

fs.writeFileSync('.temp.js', b + '\n' + c);

const tinyTest = require('tiny-test');
const ChromeDB = require('./.temp.js');

module.exports = tinyTest(function (test, load) {
  test('basic')
    .this(function () {
      const db = new ChromeDB();
      return db.set('test', 'value');
    })
    .isEqual(function () {
      return 'value';
    });

  test('set object path')
    .this(function () {
      const db = new ChromeDB();
      return db.set('test.href', 'def');
    })
    .isEqual(function () {
      return 'def';
    });

  test('set multiple objects')
    .this(function () {
      const db = new ChromeDB();
      db.set('test.id', 'abc');
      db.set('test.href', 'def');
      return db.get();
    })
    .isDeepEqual(function () {
      return {
        test : {
          id : 'abc',
          href : 'def'
        }
      };
    });

  load();
}).then(function () {
  fs.unlink('./.temp.js');
});
