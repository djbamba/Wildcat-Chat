"use strict"
var db = require('../db'),
    formidable = require("formidable"),
    session = require("client-sessions");

class Comment{
    create(req, res){
        var form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) =>{
            if(err){
                res.sendStatus(500);
                return console.error("Error in Comment create.\n",err);
            }
            db.run("INSERT INTO comments (qId, userId, desc, course, repliedTo, date) VALUES (?,?,?,?,?,CURRENT_TIMESTAMP)",
                req.params.questionID,
                req.session.user_id,
                fields.comment,
                fields.course,
                fields.user,
            (err, data)=>{
                if (err) console.error(err);

                return res.redirect('back');
            });
        });
    }

    allComments(req, res){
        db.all("SELECT * FROM comments WHERE qid=?", req.params.questionID, (err, comments)=>{
            if(err){res.sendStatus(500); console.error(err);}
            comments.forEach((comment)=>{
                if(comment.userid === req.session.user_id){
                    comment.show = true;
                }
                else{
                    comment.other = true;
                }
            });
            return res.render("comments/forQuestions", {layout:"comments", comments: comments});
        });
    }

    update(req, res){
        // var form = new formidable.IncomingForm();
        // form.parse(req, (err, fields, files) =>{
        //     if(err) return console.error(err);
        //     db.run("UPDATE comments SET desc=? WHERE id=?",
        //         fields.comment,
        //         req.commentID,
        //         (err, success)=>{
        //         if(err) return console.log(err);
        //         res.redirect('back');
        //     });
        // });

      var form = formidable.IncomingForm();
      form.parse(req, function(err, fields, files){
        if (err) return console.error(err, "Unable to retrieve incoming form");
        console.log(fields);
        var id = fields.id;
        var answer = fields.answer;
        db.run("INSERT INTO comments (qid, userid, desc, course, repliedTo, date) VALUES (?,?,?,?,?,CURRENT_TIMESTAMP)",
          fields.qid,
          fields.user_id,
          fields.desc,
          fields.course,
          fields.repliedTo,
          function(err){
            if (err) return console.error(err, "Unable to insert data into table comments");
            var url = "/questions/CIS" + fields.course.split(" ")[1] + "/new";
            res.redirect(url);
          });
      });

    }

    delete(req, res){
        db.run("DELETE FROM comments WHERE id=?",req.params.commentID);
        // "/questions/"+req.params.qID+"/comments"
        res.redirect('back');
    }
}

module.exports = exports = new Comment();
