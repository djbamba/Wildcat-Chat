"use strict"
var db = require('../db');

class Chat{

  chat(req, res){

    db.get("SELECT * FROM users WHERE id = ?", req.session.user_id, function(err, username){
      if(err) console.log(err, "Error while searching table users.");
      username = username.username;
      res.render('chat/chat', {username: username});
      console.log("Username: ",username);
        });
      }
 }
  

module.exports = exports = new Chat();
