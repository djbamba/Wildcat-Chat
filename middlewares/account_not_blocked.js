var db = require("../db");

// check that the user is not blocked
function account_not_blocked(req, res, next){
  db.get("SELECT * FROM users WHERE id = ?", req.session.user_id, function(err, user){
    if(err) res.sendStatus(500) && console.error(err, "Error querying table 'users'");
    if(user.blocked) return res.sendStatus(403);
    next();
  });
}

module.exports = exports = account_not_blocked;
