# Chrome DB

### A script to interface with the chrome extension database using Promises.

### `.get`

```javascript
const db = new ChromeDB();
db
  .get(['object', 'path'])
  .then(result => {
    // Process results
  });
```

#### Getting it using an object path

```javascript
const db = new ChromeDB();
db
  .get('object.path')
  .then(result => {
    // Process results
  });
```

### `.set`

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