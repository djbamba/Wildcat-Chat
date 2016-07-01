"use strict"
var db = require('../db'),
  formidable = require('formidable'),
  encryption = require("../database/encryption"),
  fs = require("fs-extra"),
  http = require('http');

class User {

  index(req, res){
    db.all("SELECT * FROM users", function(err, all){
      res.render("users/index", {users: all});
    });
  }

  new(req, res){
    res.render("users/new", {layout:"landing"});
  }

  create(req, res){
    var salt = encryption.salt();
    var fields = res.locals.fields;
    db.run("INSERT INTO users (fname, lname, picture, username, email, admin, blocked, password_digest, salt) VALUES (?,?,?,?,?,?,?,?,?)",
    fields.fname,
    fields.lname,
    "/images/zerg.png",
    fields.username,
    fields.email,
    false,
    false,
    encryption.digest(fields.password + salt),
    salt
    );
    res.render("index/landing", {layout: "landing", message: "User " + fields.username + " created!"});
}

  show(req, res){
    db.get("SELECT * FROM users WHERE username = ?", req.query.username, function(err, user){
      if(err) return console.error("Error retrieving data from table users.");
      return res.render("users/show", {user: user});
    });
  }

  update(req, res){
    var form = formidable.IncomingForm();
    var file_name;
    form.on("error", function(err){
      console.log("An error has occurred during the form upload.");
      console.error(err);
      req.resume();
    });
    form.on("aborted", function(err){
      console.log("User aborted the upload.");
      console.log(err);
      req.resume();
    });
    form.on("end", function(fields, files) {
      var temp_path = this.openedFiles[0].path;
      file_name = this.openedFiles[0].name;
      // var file_name = this.openedFiles[0].path.split("tmp")[0] + this.openedFiles[0].name;
      var new_location = __dirname + "/../public/images/";
      fs.copy(temp_path, new_location + file_name, function(err) {
        if(err) console.error(err);
      });
      return;
    });
    form.parse(req, function(err, fields, files){
      if(err) return res.sendStatus(500) && console.error(err, "Error parsing incoming form.");
      db.get("SELECT * FROM users WHERE id = ?", req.params.id, function(err, user){
        if(err) return res.sendStatus(500) && console.error(err, "Error querying table 'users'.");
        var salt = encryption.salt();
        var password = user.password_digest;
        var picture = user.picture;
        console.log("picture before: " + user.picture);
        if(user.salt) salt = user.salt;
        if(fields.password) password = encryption.digest(fields.password + salt);
        if(file_name.length > 3) picture = "/images/" + file_name;
        console.log("file_name: " + file_name);
        db.run("UPDATE users SET username=?, fname=?, lname=?, picture=?, email=?, admin=?, blocked=?, password_digest=?, salt=? WHERE id=?",
          fields.username,
          fields.fname,
          fields.lname,
          picture,
          fields.email,
          fields.admin,
          fields.blocked,
          password,
          salt,
          req.params.id,
          function(err){
            if(err) return console.err(err, "Error while updating table users.");
            return res.redirect("/users/index");
        });
      });
    });
  }

  delete(req, res){
    db.run("DELETE FROM users WHERE id = ?", req.params.id, function(err){
      if(err) return res.sendStatus(500) && console.error(err, "error while querying table 'users'");
      res.redirect("/users/index");
    });
  }

  profile(req, res){
      let userName = req.params.username;
      db.get("SELECT * FROM users WHERE username = ?",userName, function(err, user){
         if(err|!user){
             console.error("Error in Users.profile, no user in db:", err);
            return res.render('error/noUser',{layout: "error", message : "No such user exists: "+userName});
         }

        let allQuestions = {};
        db.serialize(function(){
            db.all("SELECT * FROM questions WHERE author=?",userName, function(err, questions){
                if(err){
                    res.sendStatus(500);
                    return console.error("Error in user.profile questions",err);
                }
                allQuestions = questions;
                });
                db.all("SELECT * FROM comments WHERE userid=?",user.id, function(err, comments){
                    if(err){
                        res.sendStatus(500);
                        return console.error("Error in user.profile comments",err);
                    }
                    comments.forEach((comm)=>{
                        if(comm.userid === req.session.user_id){
                            comm.show = true;
                        }
                    });

                    allQuestions.forEach((question)=>{
                        if(question.author === req.session.username){
                            question.show = true;
                        }
                        else{
                            question.other = true;
                        }
                });

                res.render('users/profile', {user : user, questions: allQuestions, comments: comments});
        });

      });
  });
}
}

module.exports = exports = new User();
