const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const dotenv = require('dotenv').config();
const authrouter = require('./routes/authRoutes');
const productRouter = require('./routes/productRoute')
const PORT = process.env.PORT || 4000
const {notFound , errorHandler} = require('./middlewares/errorHnadler');
const dbconnect = require('./config/dbServer');
const cookieParser = require('cookie-parser');
const morgan = require('morgan')

dbconnect();
app.use(morgan());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(cookieParser());
app.use('/api/product', productRouter);
app.use('/api/user', authrouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`port is listning on ${PORT}`);
});