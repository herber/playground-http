const autocannon = require('autocannon');
const http = require('http');
const turbo = require('turbo-http');
const fs = require('fs');
const path = require('path');

const th = (next) => {
  const server = turbo.createServer(function (req, res) {
    res.setHeader('Content-Length', '11');
    res.write(Buffer.from('hello world'));
  })

  server.listen(9001);

  autocannon({
    url: 'http://localhost:9001',
    connections: 25,
    duration: 5
  }, (...result) => {
    console.log('Turbo: Done!');
    fs.writeFileSync(path.join(__dirname, './turbo.json'), JSON.stringify(result));
    next();
  });
};

const h = (next) => {
  const server = http.createServer(function (req, res) {
    res.setHeader('Content-Length', '11');
    res.write(Buffer.from('hello world'));
  })

  server.listen(9002);

  autocannon({
    url: 'http://localhost:9002',
    connections: 25,
    duration: 5
  }, (...result) => {
    console.log('Vanilla: Done!');
    fs.writeFileSync(path.join(__dirname, './vanilla.json'), JSON.stringify(result));
    next();
  });
};

th(() => {
  h(() => {
    console.log('Done!');
    process.exit(0);
  })
});
