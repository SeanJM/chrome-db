function ChromeDB(target) {
  var validTargets = [
    'sync',
    'local',
    'managed'
  ];

  if (typeof target === 'undefined') {
    target = 'sync';
  } else if (validTargets.indexOf(target) == -1) {
    throw 'Invalid chrome.storage target: \'' + target + '\'';
  }

  this.storage = chrome.storage[target];
}

ChromeDB.prototype.set = function (a, b) {
  var self = this;
  var length = arguments.length;

  function wrapper(resolve) {
    if (a && b) {
      if (Array.isArray(a)) {
        self.storage.set(_.set({}, a.join('.'), b), () => resolve(b));
      } else {
        throw new Error('Invalid argument for \'ChromeDB.prototype.set\', argument is of type "' + typeof a + '". The correct argument type is an array.');
      }
    } else {
      self.storage.set(a, () => resolve(a));
    }
  }

  if (typeof a === 'object' && typeof b === 'function') {
    wrapper(b);
  } else {
    return new Promise(wrapper);
  }
};

ChromeDB.prototype.get = function (a, b) {
  var self = this;

  function wrapper(resolve) {
    self.storage.get(a, function (result) {
      if (a) {
        resolve(_.get(result, a));
      } else {
        resolve(result);
      }
    });
  }

  if (a && b) {
    wrapper(b);
  } else {
    return new Promise(wrapper);
  }
};

ChromeDB.prototype.clear = function () {
  this.storage.clear();
};
