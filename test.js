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

  test('set multiple objects with get(null)')
    .this(function () {
      const db = new ChromeDB();
      db.set('test.id', 'abc');
      db.set('test.href', 'def');
      db.get('test.href');
      return db.get(null);
    })
    .isDeepEqual(function () {
      return {
        test : {
          id : 'abc',
          href : 'def'
        }
      };
    });

  test('set with object (error)')
    .isFailure(function () {
      const db = new ChromeDB();
      db.set({ test : 'value' });
    });

  test('on')
    .this(function () {
      const db = new ChromeDB();

      let on = false;

      db.on('test', function (e) {
        on = e;
      });

      return db.set('test', true).then(() => on);
    })
    .isEqual(() => true);

  test('off')
    .this(function () {
      const db = new ChromeDB();

      let on = false;

      db.on('test', function (e) {
        on = e;
      });

      db.off('test');
      return db.set('test', true).then(() => on);
    })
    .isEqual(() => false);

  test('off (callback)')
    .this(function () {
      const db = new ChromeDB();

      let on = false;

      function ref(e) {
        on = e;
      }

      db.on('test', ref);
      db.off('test', ref);
      return db.set('test', true).then(() => on);
    })
    .isEqual(() => false);

  load();
}).then(function () {
  fs.unlink('./.temp.js');
});
