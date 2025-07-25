const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config({ path: './config.env' });

require('./db/db');

const app = express();
const port = process.env.PORT || 3000;

const taskRouter = require('./routes/task-router');
const userRouter = require('./routes/user-router');

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json());
app.use('/task', taskRouter);
app.use('/user', userRouter);

app.listen(port, () => {
    console.log(`listening on port ${port}`)
});
