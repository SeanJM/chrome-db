# Chrome DB

### A script to interface with the chrome extension database using Promises.

### `.get`

#### Callback

```javascript
const db = new ChromeDB();
db.get(['object', 'path'], result => {
  // Process results
});
```

#### Promise

```javascript
const db = new ChromeDB();
db
  .get(['object', 'path'])
  .then(result => {
    // Process results
  });
```

#### Setting it using an object path

```javascript
const db = new ChromeDB();
db
  .get('object.path')
  .then(result => {
    // Process results
  });
```

### `.set`

#### Callback

```javascript
const db = new ChromeDB();
db.set({ object : { path : 'test' } }, result => {
  // Do stuff
});
```

#### Promise

```javascript
const db = new ChromeDB();
db
  .set(['object', 'path'], 'test')
  .then(result => {
    // Process results
  });
```

#### Setting it using an object path

```javascript
const db = new ChromeDB();
db
  .set('object.path', 'test')
  .then(result => {
    // Process results
  });
```