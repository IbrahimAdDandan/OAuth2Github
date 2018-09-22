var express = require("express");
var session = require('express-session');
var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
require('./api/models/db');
var usersController = require('./api/controllers/users.controller');
var answersController = require('./api/controllers/answers.controller');

var GITHUB_CLIENT_ID = "YOUR_CLIENT_ID";
var GITHUB_CLIENT_SECRET = "YOUR_CLIENT_SECRET";

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(new GitHubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/oauth/callback"
    },
    function (accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
            // To keep the example simple, the user's GitHub profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the GitHub account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
        });
    }
));

var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(session({ secret: 'session secret key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', ensureAuthenticated, function (req, res) {
    res.render('index', {
        user: req.user
    });
});

app.get('/account', ensureAuthenticated, function (req, res) {
    res.render('account', {
        user: req.user
    });
});

app.get('/login', function (req, res) {
    res.render('login', {
        user: req.user
    });
});

app.get('/auth/github',
    passport.authenticate('github', {
        scope: ['user:email']
    }),
    function (req, res) {
        // The request will be redirected to GitHub for authentication, so this
        // function will not be called.
    });

app.get('/oauth/callback',
    passport.authenticate('github', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        var payload = {
            status: 'success'
        };
        var token = jwt.sign(payload, 'secretKey', { expiresIn: 3600 });
        req.user.token = token;
        res.redirect('/');
    });

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/api/users', usersController.getAllUsers);
app.post('/api/users', usersController.addUser);
app.get('/api/answers', answersController.getAllAnswers);
app.post('/api/answers', authenticate, answersController.addAnswer);
app.get('/api/answers/:answerId', answersController.getOneAnswer);
app.put('/api/answers/:answerId', authenticate, answersController.updateOneAnswer);
app.delete('/api/answers/:answerId', authenticate, answersController.deleteOneAnswer);

app.listen(3000);
console.log('Server started successfully on port 3000');

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function authenticate (req, res, next) {
    var headerExist = req.headers.authorization;
    if (headerExist) {
        var token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, 'secretKey', function (error, decoded) {
            if (error) {
                console.log('no header authorized!');
                res
                    .status(401)
                    .json('Unauthorized!');
            } else {
                next();
            }
        });
    } else {
        console.log('No token provided!');
        res
            .status(403)
            .json('No token provided!!');
    }
}