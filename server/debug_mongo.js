const mongoose = require('mongoose');
const fs = require('fs');

const uri = 'mongodb://127.0.0.1:27017/roleplay_chat';

console.log('🔄 Attempting to connect to:', uri);

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        fs.writeFileSync('db_status.log', '✅ Connected successfully!');
        console.log('✅ Connected successfully!');
        process.exit(0);
    })
    .catch(err => {
        const errorLog = `❌ Connection failed!\nName: ${err.name}\nMessage: ${err.message}\nReason: ${JSON.stringify(err.reason, null, 2)}`;
        fs.writeFileSync('db_error.log', errorLog);
        console.error('Logged error to db_error.log');
        process.exit(1);
    });
