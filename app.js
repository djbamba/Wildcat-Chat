var express = require('express'),
  app = express(),
  path = require('path'),
  favicon = require('serve-favicon'),
  handlebars = require('express-handlebars').create({ defaultLayout:'main' }),
  sessions = require('client-sessions'),
  collateFilteredQuestions = require('./middlewares/collateFilteredQuestions'),
  check_if_user_exists = require("./middlewares/check_if_user_exists"),
  admin_only = require("./middlewares/admin_only"),
  noGuests = require("./middlewares/noGuests"),
  load_user = require("./middlewares/load_user"),
  http = require('http').Server(app),
  socket = require('socket.io'),
  io = socket.listen(http);
  // db = require("./database/seed.js");

app.disable('x-powered-by');
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
app.use(favicon(__dirname+'/public/images/website_logo.png'));
app.use(sessions({
  cookieName: 'session',
  secret: 'StarCraftKittens1986',
  duration: 24*60*60*1000,
  activeDuration: 1000*60*5
}));
app.use(express.static(path.join(__dirname, "/client")));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/views")));
app.use(function(req, res, next) { res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'); next(); });
app.use(load_user);

/*
Index Routes
*/
var index = require('./controllers/index');
//post for login.
app.get('/login', index.landing);
app.get('/', index.landing);
app.get('/home', collateFilteredQuestions, index.home);
app.get('/about', index.about);
app.get('/contact', index.contact);

/*
Session Routes
*/
var sessions = require('./controllers/sessions');
app.get('/sessions/new', sessions.new);
app.post('/sessions/create', sessions.create);
app.get("/sessions/delete", sessions.delete);

/*
Chat Routes
*/
var chat = require('./controllers/chat');
app.get("/chat", chat.chat);
io.sockets.on('connection', function(socket) {
  console.log('User connected');
  socket.on('send message', function(data){
    io.emit('new message', data);
    console.log('Message: ', data);
  });
});

/*
User Routes
*/
var users = require("./controllers/users");
app.get("/users/index", admin_only, users.index);
app.get("/users/new", users.new);
app.post("/users/create", check_if_user_exists, users.create);
app.get("/users/show", admin_only, users.show);
app.post("/users/:id/update", users.update);
app.get("/users/:id/delete", admin_only, users.delete);
app.get("/users/:username", users.profile);

/*
Question Routes
*/
var questions = require('./controllers/questions');
app.get("/questions/:courseID/new", noGuests, questions.new);
app.post("/questions/:courseID/create", noGuests, questions.create);
app.get("/questions/:questionID/delete", noGuests, questions.delete);

/*
Comment Routes
*/
var comments = require("./controllers/comments");
app.post("/comments/:questionID", noGuests, comments.create);
app.post("/comments/:commentID/update", noGuests, comments.update);
app.get("/comments/:commentID/delete", noGuests, comments.delete);
app.get("/comments/:questionID", noGuests, comments.allComments);

http.listen(app.get('port'), function(){
  console.log('Express started. Server listening on port 3000. Press Ctrl-C to terminate');
});
