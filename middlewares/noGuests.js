"use strict"

function noGuests(req, res, next) {
  console.log(req.session);
  if(!req.user || !req.user.admin)
  // res.sendStatus('403');
  // res.render("error/noGuest",{layout:"error", message:"You must be logged in."});
  return res.render('sessions/new', {message: "You must be signed in to access this page", user: req.user});
  else
  return next();
}

module.exports = exports = noGuests;
