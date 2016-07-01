var db = require("../db"),
  formidable = require("formidable");

function check_if_user_exists(req, res, next){
  var form = formidable.IncomingForm();
  form.parse(req, function(err, fields, files){
    res.locals.fields = fields;
    if(err) return console.error(err, "Error while parsing incoming form data.");
    db.get("SELECT * FROM users WHERE username=?", fields.username, function(err, user){
      if(err) return console.error(err, "Error while querying database: users.");
      if(user){
        req.session.reset();
        res.render("index/landing", {message: "That username already exists!", layout: "landing"});
      }
      else{
        db.get("SELECT * FROM users WHERE email=?", fields.username, function(err, email){
          if(err) return console.error(err, "Error while querying database: users.");
          if(email){
            req.session.reset();
            res.render("index/landing", {message: "That email address already exists!", layout: "landing"});
          }
          else{
            next();
          }
        });
      }
    });
  });
}

module.exports = exports = check_if_user_exists;
