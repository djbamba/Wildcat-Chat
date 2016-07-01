"use strict"

var db = require('../db')

function load_user(req, res, next){
  if(req.session && req.session.user_id){
    db.get("SELECT * FROM users WHERE id = ?", req.session.user_id, function(err, user){
      if(err) return res.sendStatus(500);
      req.user = user;
      return next();
    });
  }
  else{
    req.user = { username: "Guest" }
    next();
  }
}

module.exports = exports = load_user;
