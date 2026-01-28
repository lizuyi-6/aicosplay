require('dotenv').config();
const mongoose = require('mongoose');

async function clearSvgs() {
    await mongoose.connect(process.env.MONGO_URI);
    const result = await mongoose.connection.db.collection('roles').updateMany(
        { isSystem: true },
        { $set: { backgroundSvg: '' } }
    );
    console.log('Cleared SVGs:', result.modifiedCount);
    await mongoose.disconnect();
}

clearSvgs();
