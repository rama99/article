const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// app
const app = express();


// routes
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/article');
const categoryRoutes = require('./routes/category');


// database connect
mongoose
    .connect(process.env.DATABASE_LOCAL, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true })
    .then(() => console.log('DB connected'))
    .catch(err => {
        console.log(err);
    });


// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

// cors
app.use(cors({ origin: `${process.env.CLIENT_URL}` }));

// routes middleware
app.use('/api', authRoutes);
app.use('/api', categoryRoutes);
app.use('/api', articleRoutes);

// cors
if (process.env.NODE_ENV === 'development') {
    app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
}

// port
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


