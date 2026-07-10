// Simple script to seed MCQs into the database
// Run with: node seed-mcqs.js

const http = require('http');

const data = JSON.stringify({ count: 500 });

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/seed/mcqs',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
  },
};

console.log('🌱 Seeding 500 MCQs into database...\n');

const req = http.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('✅ Response Status:', res.statusCode);
    console.log('📊 Response Data:\n');
    try {
      const json = JSON.parse(responseData);
      console.log(JSON.stringify(json, null, 2));
    } catch {
      console.log(responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});

req.write(data);
req.end();
