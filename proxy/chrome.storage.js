var chromeStorage = {};

var chrome = {
  storage : {
    sync : chromeStorage,
    local : chromeStorage,
    managed : chromeStorage,
  }
};

chromeStorage.set = function (value, callback) {
  setTimeout(() => {
    chromeStorage.value = value;
    callback(value);
  }, 100);
};

chromeStorage.get = function (path, callback) {
  setTimeout(() => {
    if (path) {
      callback(_.get(chromeStorage.value, path));
    } else {
      callback(chromeStorage.value);
    }
  }, 100);
};

chromeStorage.clear = function () {
  chromeStorage.value = null;
};