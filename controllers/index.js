"use strict"
var db = require('../db');

class Index{
  landing(req, res){
    res.render('index/landing', { layout: "landing"});
  }

  home(req, res){
    db.get("SELECT username FROM users WHERE id = ?", req.session.user_id, function(err, username){
      if(err) console.log(err, "Error while searching table users.");
      username = username.username;
      db.all('SELECT * FROM questions WHERE author = ?', username, function(err, myQuestions){
        db.get('SELECT picture FROM users WHERE username = ?', username, function(err, data){
          db.all("SELECT * FROM questions WHERE id = ?", req.session.user_id, function(err, questionsIveAnswered){
            var picture = data.picture;
            res.render('index/home', { questionsIveAnswered: questionsIveAnswered, username: username, picture: picture, questions: res.locals.questions, myQuestions: myQuestions });
          });
        });
      });
    });
  }

  about(req, res){
    res.render('index/about');
  }

  contact(req, res){
    res.render('index/contact');
  }
}

module.exports = exports = new Index();
