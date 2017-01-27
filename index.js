function set(obj, path, b) {
  var temp = obj;

  path = path.split('.');

  while (path.length - 1) {
    if (!temp[path[0]]) {
      temp[path[0]] = {};
    }
    temp = temp[path[0]];
    path.shift();
  }

  temp[path[0]] = b;
  return obj;
}

function get(obj, path) {
  var temp = obj;

  path = path.split('.');

  while (path.length - 1) {
    if (!temp[path[0]]) {
      temp[path[0]] = {};
    }
    temp = temp[path[0]];
    path.shift();
  }

  return temp[path[0]];
}

function ChromeDB(target) {
  var validTargets = [
    'sync',
    'local',
    'managed'
  ];

  this.snapshot = {};
  this.queue = [];

  if (typeof target === 'undefined') {
    target = 'sync';
  } else if (validTargets.indexOf(target) == -1) {
    throw 'Invalid chrome.storage target: \'' + target + '\'';
  }

  this.storage = chrome.storage[target];

  this.get(null)
    .then(value => {
      if (value) {
        this.snapshot = value;
      } else {
        this.set(this.snapshot);
      }
    });
}

ChromeDB.prototype.set = function (a, b) {
  return new Promise((resolve) => {
    this.queue.push((callback) => {
      var path = Array.isArray(a) ? a.join('.') : a;
      var value = typeof a === 'object' ? a : set(this.snapshot, path, b);
      this.storage.set(value, function () {
        resolve(b);
        callback();
      });
    });
    this.next();
  });
};

ChromeDB.prototype.get = function (a) {
  return new Promise((resolve, reject) => {
    this.queue.push((callback) => {
      this.storage.get(a, (result) => {
        var value = a
          ? get(result, a)
          : result;

        try {
          resolve(value);
        } catch (err) {
          reject(err);
        }
        callback();
      });
    });
    this.next();
  });
};

ChromeDB.prototype.next = function () {
  var p = this.queue[0];
  if (!this.waiting && this.queue.length) {
    this.queue.shift();
    p(() => {
      this.waiting = false;
      this.next();
    });
  }
  this.waiting = true;
};

ChromeDB.prototype.clear = function () {
  return this.queue.push((resolve) => {
    this.storage.clear();
    this.snapshot = {};
    resolve();
  });
};

if (typeof module === 'object') {
  module.exports = ChromeDB;
}