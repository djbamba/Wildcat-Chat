"use strict"
var db = require('../db');
var formidable = require('formidable');

class Question{

  create(req, res){
    var form = formidable.IncomingForm();
    var fields = res.locals.fields;
    var url = req.url;
    var courseID = "CIS "+req.params.courseID;
    var redirectID = "CIS"+req.params.courseID;
    form.parse(req, function(err, fields, files){
      //console.log(fields);
      if(err) res.sendStatus(500);
      db.run("INSERT INTO QUESTIONS (course, desc, shortdesc, date, author, numOfReviews) VALUES (?,?,?,CURRENT_TIMESTAMP,?,?)",
      courseID,
      fields.question,
      fields.short,
      req.user.username,
      fields.numOfReviews
      );
      res.redirect("/questions/" + redirectID + "/new");
    });
  }

  new(req, res){
    var regExp = /CIS\d\d\d/i;
    var course = "CIS " + String(req.url.match(regExp)).split("CIS")[1];
    var courseNumber = course.split(" ")[1];
    var user_id = req.session.user_id;
    db.get("SELECT username FROM users WHERE id = ?", req.session.user_id, function(err, username){
      if(err) console.error(err, "Error while searching table users.");
      username = username.username;
      db.all('SELECT * FROM questions WHERE author = ?', username, function(err, myQuestions){
        db.get('SELECT picture FROM users WHERE username = ?', username, function(err, data){
          var picture = data.picture;
          db.all("SELECT * FROM questions WHERE course = ?", course, function(err, questions){
            db.all("SELECT * FROM questions WHERE id = ?", user_id, function(err, questionsIveAnswered){
              res.render('questions/new', { questionsIveAnswered: questionsIveAnswered, user_id: user_id, course: course, courseID: courseNumber, username: username, picture: picture, questions: questions, myQuestions: myQuestions });
            });
          });
        });
      });
    });
  }


  delete(req, res){
      db.run("DELETE FROM questions WHERE id=?", req.params.questionID, (err)=>{
         if(err) return console.error(err);
        res.redirect('back');
      });
  }
}

module.exports = exports = new Question();
