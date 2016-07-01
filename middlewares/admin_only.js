"use strict"

function admin_only(req, res, next) {
  console.log(req.session);
  if(req.user && req.user.admin) return next();
  else
  return res.render('sessions/new', {message: "Sorry! Only admins have privileges to access this page", user: req.user}); 
  //res.sendStatus('403');
}

module.exports = exports = admin_only;
