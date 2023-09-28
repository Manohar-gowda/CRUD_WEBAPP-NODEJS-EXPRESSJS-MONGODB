require('dotenv').config();
const express = require('express');
const session = require("express-session");
const flash = require("connect-flash");

const app = express();
const port = 4000;

//middlewares
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use(
    session({
        secret: "my secret key",
        saveUninitialized: true,
        resave: false,
    })
);
app.use(flash());

app.use((req, res ,next) =>{
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use(express.static("uploads"));

//set template  engine
app.set('view engine', 'ejs');

//router prefix
app.use("", require("./Routes/routes"));

app.get('/', (req, res) =>{
 res.send('Hello World!');
});

app.listen(port, ()  =>{
     console.log(`Server started at http://localhost:${port}`);
})