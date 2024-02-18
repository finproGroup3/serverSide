require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const router = require('./routes');
const errorHandler = require('./middleware/errorHandler');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for all routes
app.use(cors());

app.use(router);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
