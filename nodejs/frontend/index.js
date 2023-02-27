

const Keycloak = require('keycloak-connect')
const hogan = require('hogan-express')
const express = require('express')
const session = require('express-session')

const app = express()

const server = app.listen(3000, function () {
  const host = "0.0.0.0"
  const port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
})

// Register '.mustache' extension with The Mustache Express
app.set('view engine', 'html')
app.set('views', require('path').join(__dirname, '/view'))
app.engine('html', hogan)

/*
const PERMISSIONS = new Permissions([
    ['/customers', 'post', 'res:customer', 'scopes:create'],
    ['/customers(*)', 'get', 'res:customer', 'scopes:view'],
    ['/campaigns', 'post', 'res:campaign', 'scopes:create'],
    ['/campaigns(*)', 'get', 'res:campaign', 'scopes:view'],
    ['/reports', 'post', 'res:report', 'scopes:create'],
    ['/reports(*)', 'get', 'res:report', 'scopes:view']
]).notProtect(
    '/favicon.ico', // just to not log requests
    '/login(*)',
    '/accessDenied',
    '/adminClient',
    '/adminApi(*)',

    
    '/permissions',
    '/checkPermission'
);

var keyCloak = new KeyCloakService(PERMISSIONS);
*/



app.get('/', function (req, res) {
  res.render('index')
})

// Create a session-store to be used by both the express-session
// middleware and the keycloak middleware.

const memoryStore = new session.MemoryStore()

app.use(session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}))





	/*const myconfig = {
  clientId: "myclient",
   serverUrl: 'http://localhost:8080/',
  realm: "myrealm",
  
  realmPublicKey: "V7QtJg7aPNjMZKXCu8xmFc2LYOado2UL",
};
*/



/*const keycloak = new Keycloak({
  store: memoryStore ,myconfig
})*/
const keycloak = new Keycloak({
  store: memoryStore 
})

  



app.use(keycloak.middleware({
  logout: '/logout',
  admin: '/',
  protected: '/protected/resource'
}))

app.get('/login', keycloak.protect(), function (req, res) {
  res.render('index', {
    result: JSON.stringify(JSON.parse(req.session['keycloak-token']), null, 4),
    event: '1. Authentication\n 2. Login'
  })
})



app.get('/main', keycloak.protect('user'), function (req, res) {
  res.render('main', {title:'protected'});
})

app.get('/protected/resource', keycloak.protect(['admin','user'], {
  resource_server_id: 'nodejs-apiserver'
}), function (req, res) {
  res.render('index', {
    result: JSON.stringify(JSON.parse(req.session['keycloak-token']), null, 4),
    event: '1. Access granted to Default Resource\n'
  })
})

