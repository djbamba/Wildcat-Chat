$(document).ready(function(){
  $("#signinBtn").click(function(){
    $.get("/sessions/new", function(data){
      $("#loginFormAnchor").html(data);
    });
  });

  $("#signupBtn").click(function(){
    $.get("/users/new", function(data){
      $("#loginFormAnchor").html(data);
    });
  });
});
