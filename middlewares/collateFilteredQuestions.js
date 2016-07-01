var db = require('../db');


function collateFilteredQuestions(req, res, next) {
  if(req.query.activeTab == 'rating'){
    db.all('SELECT * FROM Questions ORDER BY rating DESC', function(err, filtered){
      res.locals.questions = filtered;
      next();
    });
  }
  else if(req.query.activeTab == 'date'){
    db.all('SELECT * FROM Questions ORDER BY date DESC', function(err, filtered){
      res.locals.questions = filtered;
      next();
    });
  }
  else if(req.query.activeTab == 'active'){
    db.all("SELECT * FROM Questions WHERE answeredBy = ?", 'None', function(err, filtered){
      res.locals.questions = filtered;
      next();
    });
  }
  else if(req.query.activeTab == 'answered'){
    db.all('SELECT * FROM Questions WHERE answeredBy != ?', 'None', function(err, filtered){
      res.locals.questions = filtered;
      next();
    });
  }
  else{
    db.all('SELECT * FROM Questions ORDER BY date DESC', function(err, filtered){
      res.locals.questions = filtered;
      next();
    });
  }
}

module.exports = exports = collateFilteredQuestions;
