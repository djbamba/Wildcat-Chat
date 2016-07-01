$('document').ready(function(){
  setCurrentNavActive();
});

function setCurrentNavActive(){
  if (window.location.pathname == '/home'){
    $('#home').closest('li').attr('class', 'active');
  }
  else if (window.location.pathname == '/about'){
    $('#about').closest('li').attr('class', 'active');
  }
  else if (window.location.pathname == '/contact'){
    $('#contact').closest('li').attr('class', 'active');
  }
  else if (window.location.pathname == '/users'){
    $('#users').closest('li').attr('class', 'active');
  }
}
