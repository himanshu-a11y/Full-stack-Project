const FormData = require('form-data');
const fs = require('fs');
const http = require('http');

const form = new FormData();
form.append('file', fs.createReadStream('./test.csv'));

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/admin/import',
  method: 'POST',
  headers: form.getHeaders()
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Response:', data));
});

form.pipe(req);