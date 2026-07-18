const http = require('http');

const data = JSON.stringify({ name: "testgateway", email: "testgateway@test.com", password: "testpassword" });
const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
    }
};

const req = http.request(options, res => {
    let responseData = '';
    res.on('data', chunk => responseData += chunk);
    res.on('end', () => console.log(`Status: ${res.statusCode}, Body: ${responseData}`));
});
req.on('error', error => console.error(error));
req.write(data);
req.end();
