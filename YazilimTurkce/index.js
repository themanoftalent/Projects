const express = require('express');
const app = express();

app.use(express.json({limit : 100000000})); //gelen istekleri Json olarak ayırır
app.use(express.urlencoded({ extended: false})); // şifreleme yapar

const fileUpload = require('express-fileupload');
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

const database = require('./models/database'); //database bağlantısı 
database.connector();

const router = require('./routes'); //router bağlantısı
app.use('/api',router);

app.listen(5005);//port 