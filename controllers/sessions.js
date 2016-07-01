"use strict"
var db = require('../db'),
  formidable = require('formidable'),
  encryption = require('../database/encryption');

class Session {

  landing(req, res){
    res.render('index/landing', { layout: "landing"});
  }

  new(req, res){
    res.render("sessions/new", {layout: "landing"});
  }

  create(req, res){
    req.session.reset();
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
      if(err) return res.sendStatus(500);
      db.get("SELECT * FROM users WHERE email = ?", fields.email, function(err, user){
        if(err)
        {
          console.log("I am in --> if (err)");
          return res.render('sessions/new', {layout:"landing",message: "Email/Password1 combination not found.", user: req.user});
        }
        if(!user)
        {
          console.log("I am in --> if (!user)")
          return res.render('sessions/new', {layout:"landing",message: "Email/Password2 combination not found.", user: req.user});
        }

        if(user.password_digest != encryption.digest(fields.password + user.salt))
        {
          console.log("I am in --> if (user.password_digest.....)")
          console.log(encryption.digest(fields.password + user.salt));
          console.log(user.password_digest);
          return res.render('sessions/new', {layout:"landing",message: "Email/Password3 combination not found.", user: req.user});
        }

        if(user.blocked)
        {
          return res.render('sessions/new', {layout:"landing",message: "This user account has been blocked by an Admin", user: req.user});
        }
        req.session.user_id = user.id;
        req.session.username = user.username;

        return res.redirect('/home');
      });
    });
  }

  delete(req, res){
    req.session.reset();
    return res.redirect("/");
  }
}

module.exports = exports = new Session();
