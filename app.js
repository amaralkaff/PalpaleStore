const express = require('express');
const app = express();
const port = 3000;
const router = require('./routers/router');
const expressSession = require('express-session');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./uploads'));

app.use(expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        sameSite: true
    }
}))

app.use(express.json());

app.get('/webhook', (req, res) => {
    res.status(200).json({
        message: 'webhook'
    })
})


app.use(router);
app.listen(port, () => {
    console.log(`run away ${port}`);
});

module.exports = app;