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
    if (typeof temp[path[0]] === 'undefined') {
      return false;
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
  this.subscribers = {};

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
  if (typeof b !== 'undefined' && typeof b === 'function') {
    throw new Error('Invalid argument type \'function\' for \'ChromeDB.prototype.set\'');
  }

  if (!Array.isArray(a) && typeof a === 'object') {
    throw new Error('Invalid argument (0) type \'Object\' for \'ChromeDB.prototype.set\', first argument can be an array or a string.');
  }
  return new Promise((resolve) => {
    this.queue.push((callback) => {
      var path = Array.isArray(a) ? a.join('.') : a;
      var value = set(this.snapshot, path, b);
      this.storage.set(value, () => {
        resolve(b);
        this.trigger(path, b);
        callback();
      });
    });
    this.next();
  });
};

ChromeDB.prototype.get = function (a) {
  if (arguments.length > 1) {
    throw new Error('Invaild number of arguments for \'ChromeDB.prototype.get\'');
  }
  if (!Array.isArray(a) && typeof a !== 'string' && a != null) {
    throw new Error('Invalid type of path for \'ChromeDB.prototype.get\'');
  }
  return new Promise((resolve, reject) => {
    this.queue.push((callback) => {
      this.storage.get(a, result => {
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

ChromeDB.prototype.on = function (name, callback) {
  var s = this.subscribers;

  if (!s[name]) {
    s[name] = [];
  }

  s[name].push(callback);
};

ChromeDB.prototype.off = function (name, callback) {
  var s = this.subscribers;

  if (!s[name] || !callback) {
    s[name] = [];
  }

  if (callback) {
    s[name] = s[name].filter(a => a !== callback);
  }
};

ChromeDB.prototype.trigger = function (name, value) {
  var s = this.subscribers[name];
  if (s) {
    s.forEach(c => c(value));
  }
};

ChromeDB.prototype.next = function () {
  var p = this.queue[0];

  if (!this.waiting && this.queue.length) {
    this.queue.shift();
    p(() => {
      this.waiting = false;
      this.next();
    });
  } else if (!this.queue.length) {
    this.waiting = false;
  } else {
    this.waiting = true;
  }
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