const mongoose = require('mongoose');

const dbPassword = process.env.DB_PASSWORD;
const db = process.env.DB.replace('<PASSWORD>', dbPassword);

mongoose.connect(db, {
    useNewUrlParser: true
}).then(() => console.log('DB connection successful!'));