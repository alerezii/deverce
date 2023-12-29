const express = require('express');
const path = require('path');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const session = require('express-session');
const ejs = require('ejs');  // Agregado

const app = express();
const PORT = process.env.PORT || 8080;

// Configuración de Passport y sesión
passport.use(new DiscordStrategy({
    clientID: '1189956465197338634',
    clientSecret: 'Q0Unf3iq1bhZEYk4D1SBUqsFMWfN5LPr',
    callbackURL: 'http://localhost:8080/auth/discord/callback',
    scope: ['identify', 'guilds'], // Asegúrate de incluir 'guilds'
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));  // Agregado

// Middleware para servir archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesiones
app.use(session({
    secret: 'fylIYnLHhfRzEftfPlH1MWER9-yNh0k1',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Rutas de autenticación
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
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

// Ruta para la página principal
app.get('/', (req, res) => {
    res.render('index', { user: req.user }); // Asegúrate de que req.user esté definido si el usuario está autenticado
});

// Ruta para la página de servicios
app.get('/servicios', (req, res) => {
    res.render('src/pages/servicios', { user: req.user });
});

// Ruta para la página de servicios
app.get('/perfil', (req, res) => {
    res.render('src/pages/perfil', { user: req.user });
});

// Ruta para la página de contacto
app.get('/contacto', (req, res) => {
    res.render('src/pages/contacto', { user: req.user });
});

// Ruta para manejar todas las demás solicitudes y redirigirlas a la página principal
app.get('*', (req, res) => {
    res.render('src/pages/404', { user: req.user });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
