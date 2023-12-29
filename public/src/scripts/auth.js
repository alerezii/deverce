const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const session = require('express-session');

passport.use(new DiscordStrategy({
    clientID: '1182729676892938260',
    clientSecret: 'fylIYnLHhfRzEftfPlH1MWER9-yNh0k1',
    callbackURL: 'http://localhost:8080/auth/discord/callback',
    scope: ['identify', 'email'],
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

module.exports = (app) => {
    app.use(session({
        secret: 'fylIYnLHhfRzEftfPlH1MWER9-yNh0k1',
        resave: false,
        saveUninitialized: false,
    }));
    
    app.use(passport.initialize());
    app.use(passport.session());    

    app.get('/auth/discord', passport.authenticate('discord'));
    app.get('/auth/discord/callback',
        passport.authenticate('discord', {
            failureRedirect: '/'
        }),
        (req, res) => {
            res.redirect('/');
        }
    );

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
};
