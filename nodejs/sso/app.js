'use strict';

const Keycloak = require('keycloak-connect');
const express = require('express');
const session = require('express-session');
var expressHbs = require('express-handlebars');


// Constants
/*const PORT = 8000;
cost HOST = '0.0.0.0';*/

const app = express();


// Register 'handelbars' extension with Mustache Express



app.engine('hbs', expressHbs.engine({extname:'hbs',
  defaultLayout:'layout.hbs',
  relativeTo: __dirname}));
app.set('view engine', 'hbs');



var memoryStore = new session.MemoryStore();


//session
app.use(session({
  secret:'myhellosecret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));




/*
	const myconfig = {
  clientId: "myclient",
   serverUrl: 'https://localhost:8080/',
  realm: "myrealm",
  
  realmPublicKey: "quGgNjlNNewwTJzGXcB2wRtN86UPTng4",
};
*/







//const keycloak = new Keycloak({ store: memoryStore },myconfig);
const keycloak = new Keycloak({ store: memoryStore });


app.use(keycloak.middleware({
logout: '/logout'}));


//route protected with Keycloak
app.get('/test', keycloak.protect(), function(req, res){
  res.render('test', {title:'Test'});
});

//unprotected route
app.get('/',function(req,res){
  res.render('index');
});


  




app.use(
express.static(__dirname+'/public')


);





/*
app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}/`);
});

*/

  const host = "localhost"
app.listen(3000,host, function () {
  console.log('Listening at http://localhost:3000');
});