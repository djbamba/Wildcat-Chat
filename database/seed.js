var sqlite3 = require('sqlite3'),
    db = new sqlite3.Database('../database/shs.sqlite3'),
    encryption = require('./encryption');
// Create the database schema and populate
db.serialize(function() {
    
  // TABLE USERS: id, username, fname, lname, picture, email, admin, blocked, password_digest, salt
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE  COLLATE NOCASE, fname TEXT NOT NULL, lname TEXT NOT NULL, picture TEXT, email TEXT, admin BOOLEAN, blocked BOOLEAN, password_digest TEXT, salt TEXT)");
   // POPULATE USERS **********************************************************************************************************************************
  var salt = encryption.salt();
   db.run("INSERT INTO users (username, fname, lname, picture, email, admin, blocked, password_digest, salt) VALUES (?,?,?,?,?,?,?,?,?)",
    'sagar5589',
    'Sagar',
    'Mehta',
    '/images/protoss.png',
    'sagar5589@ksu.edu',
    true,
    false,
    encryption.digest('password' + salt),
    salt
  );
  db.run("INSERT INTO users (username, fname, lname, picture, email, admin, blocked, password_digest, salt) VALUES (?,?,?,?,?,?,?,?,?)",
   'Rhurac',
   'Zachary',
   'Cleary',
   '/images/zerg.png',
   'zcleary1@ksu.edu',
   true,
   false,
   encryption.digest('password' + salt),
   salt
 );
 db.run("INSERT INTO users (username, fname, lname, picture, email, admin, blocked, password_digest, salt) VALUES (?,?,?,?,?,?,?,?,?)",
  'jcleary1',
  'Jacob',
  'Cleary',
  '/images/terran.png',
  'jcleary1@ksu.edu',
  false,
  true,
  encryption.digest('password' + salt),
  salt
);
db.run("INSERT INTO users (username, fname, lname, picture, email, admin, blocked, password_digest, salt) VALUES (?,?,?,?,?,?,?,?,?)",
 'djbamba',
 'Daniel',
 'Bamba',
 '/images/zerg.png',
 'djbamba@ksu.edu',
 true,
 false,
 encryption.digest('password' + salt),
 salt
);
// TABLE QUESTIONS: id, course, rating, numOfReviews, shortdesc, desc, answeredBy, author, date
db.run("CREATE TABLE IF NOT EXISTS Questions(id INTEGER PRIMARY KEY, course VARCHAR(6), rating INTEGER, numOfReviews INTEGER, shortdesc TEXT NOT NULL, desc TEXT NOT NULL, answeredBy TEXT, author TEXT NOT NULL, date TEXT NOT NULL, FOREIGN KEY(author) REFERENCES users(id))");
// POPULATE QUESTIONS **********************************************************************************************************************************
db.run("INSERT INTO Questions (course, rating, numOfReviews, shortdesc, desc, answeredBy, date, author) VALUES ('CIS526', 5, 3, 'Why is the sky blue?', 'Hello Universe', 'sagar5589', CURRENT_TIMESTAMP, 'djbamba')");

db.run("INSERT INTO Questions (course, rating, numOfReviews, shortdesc, desc, answeredBy, date, author) VALUES ('CIS527', 4, 2, 'How far to the moon?', 'Hello Universe', 'sagar5589', CURRENT_TIMESTAMP, 'djbamba')");

db.run("INSERT INTO Questions (course, rating, numOfReviews, shortdesc, desc, answeredBy, date, author) VALUES ('CIS526', 4, 1, 'How hot is the sun?', 'Hello Universe', 'djbamba', CURRENT_TIMESTAMP, 'sagar5589')");

db.run("INSERT INTO Questions (course, rating, numOfReviews, shortdesc, desc, answeredBy, date, author) VALUES ('CIS526', 5, 3, 'How old is Sigourney Weaver?', 'Hello Universe', 'djbamba', CURRENT_TIMESTAMP, 'sagar5589')");

db.run("INSERT INTO Questions (course, rating, numOfReviews, shortdesc, desc, answeredBy, date, author) VALUES ('CIS301', 1, 3, 'How old is Mel Gibson?', 'Short Description', 'None', CURRENT_TIMESTAMP, 'zcleary1')");

db.run("INSERT INTO Questions (course, rating, numOfReviews, shortdesc, desc, answeredBy, date, author) VALUES ('CIS526', 5, 3, 'How deep is the ocean?', 'Hello Universe', 'None', CURRENT_TIMESTAMP, 'zcleary1')");

// TABLE COMMENTS: id, qid, userid, course, repliedTo, desc, date
db.run("CREATE TABLE IF NOT EXISTS Comments(id INTEGER PRIMARY KEY, qid INTEGER NOT NULL, userid INTEGER, course TEXT, repliedTo  TEXT,desc TEXT NOT NULL, date TEXT NOT NULL, FOREIGN KEY(userid) REFERENCES users(id), FOREIGN KEY(qid) REFERENCES Questions(id))");

// POPULATE COMMENTS ***********************************************************************************************************************************
db.run("INSERT INTO comments (qid, userid, desc, course, repliedTo, date) VALUES (1, 1, 'We never went over this part in class.', 'CIS300', 'Rhurac' ,CURRENT_TIMESTAMP)");
db.run("INSERT INTO comments (qid, userid, desc, course, repliedTo, date) VALUES (1, 2, 'We never went over this part in class.', 'CIS300', 'djbamba' ,CURRENT_TIMESTAMP)");
db.run("INSERT INTO comments (qid, userid, desc, course, repliedTo, date) VALUES (1, 3, 'We never went over this part in class.', 'CIS300', 'zcleary1' ,CURRENT_TIMESTAMP)");
db.run("INSERT INTO comments (qid, userid, desc, course, repliedTo, date) VALUES (1, 4, 'We never went over this part in class.', 'CIS300', 'foo' ,CURRENT_TIMESTAMP)");

db.run("INSERT INTO comments (qid, userid, desc, course, repliedTo,date) VALUES (2, 1, 'Take I70 West for 6 hours', 'CIS301','Rhurac',CURRENT_TIMESTAMP)");
db.run("INSERT INTO comments (qid, userid, desc, course, repliedTo,date) VALUES (2, 2, 'Take I70 West for 6 hours', 'CIS301','djbamba',CURRENT_TIMESTAMP)");
db.run("INSERT INTO comments (qid, userid, desc, course, repliedTo,date) VALUES (2, 3, 'Take I70 West for 6 hours', 'CIS301','sagar5589',CURRENT_TIMESTAMP)");
db.run("INSERT INTO comments (qid, userid, desc, course, repliedTo,date) VALUES (2, 4, 'Take I70 West for 6 hours', 'CIS301','zcleary1',CURRENT_TIMESTAMP)");

db.run("INSERT INTO comments (qid, userid, desc, course, repliedTo, date) VALUES (3, 1, 'I am more attracted to moons.','CIS501', 'Rhurac',CURRENT_TIMESTAMP)");
db.run("INSERT INTO comments (qid, userid, desc, course, repliedTo, date) VALUES (3, 2, 'I am more attracted to moons.','CIS501', 'djbamba',CURRENT_TIMESTAMP)");
db.run("INSERT INTO comments (qid, userid, desc, course, repliedTo, date) VALUES (3, 3, 'I am more attracted to moons.','CIS501', 'sagar5589',CURRENT_TIMESTAMP)");
db.run("INSERT INTO comments (qid, userid, desc, course, repliedTo, date) VALUES (3, 4, 'I am more attracted to moons.','CIS501', 'zcleary1',CURRENT_TIMESTAMP)");


db.run("INSERT INTO comments (qid, userid, desc, course, repliedTo, date) VALUES (4, 1, 'Deepest point is ~7 miles.', 'CIS450','Rhurac',CURRENT_TIMESTAMP)");
db.run("INSERT INTO comments (qid, userid, desc, course, repliedTo, date) VALUES (4, 2, 'Deepest point is ~7 miles.', 'CIS450','Rhurac',CURRENT_TIMESTAMP)");
db.run("INSERT INTO comments (qid, userid, desc, course, repliedTo, date) VALUES (4, 3, 'Deepest point is ~7 miles.', 'CIS450','Rhurac',CURRENT_TIMESTAMP)");
db.run("INSERT INTO comments (qid, userid, desc, course, repliedTo, date) VALUES (4, 4, 'Deepest point is ~7 miles.', 'CIS450','Rhurac',CURRENT_TIMESTAMP)");
});
