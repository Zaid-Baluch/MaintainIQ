const https = require('https');

const data = JSON.stringify({
  email: 'admin@maintainiq.com',
  password: 'password123'
});

const options = {
  hostname: 'hakathon-flame.vercel.app',
  port: 443,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('Sending login request to https://hakathon-flame.vercel.app/api/auth/login...');

const req = https.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  
  let responseBody = '';
  res.on('data', (d) => {
    responseBody += d;
  });

  res.on('end', () => {
    console.log('Response body:');
    try {
      console.log(JSON.stringify(JSON.parse(responseBody), null, 2));
    } catch (e) {
      console.log(responseBody);
    }
  });
});

req.on('error', (error) => {
  console.error('Error with request:', error);
});

req.write(data);
req.end();
