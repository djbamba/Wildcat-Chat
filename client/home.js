$('document').ready(function(){
  setCurrentTabActive();
});

function setCurrentTabActive(){
  if (window.location.href.split('?')[1] == 'activeTab=rating'){
    $('#rating').closest('li').attr('class', 'active');
  }
  else if (window.location.href.split('?')[1] == 'activeTab=date'){
    $('#date').closest('li').attr('class', 'active');
  }
  else if (window.location.href.split('?')[1] == 'activeTab=active'){
    $('#active').closest('li').attr('class', 'active');
  }
  else if (window.location.href.split('?')[1] == 'activeTab=answered'){
    $('#answered').closest('li').attr('class', 'active');
  }
  else{
    $('#date').closest('li').attr('class', 'active');
  }
}
