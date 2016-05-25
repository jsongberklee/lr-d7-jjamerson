jQuery(document).ready(function($){
  $('.main-menu-button').click(function() {
    if ( $(this).attr('aria-expanded') == 'false' ) {
      $(this).attr('aria-expanded', 'true');
    } else {
      $(this).attr('aria-expanded', 'false');
    }
    $('body').toggleClass('off-screen-visible');
    $('.region-header').toggleClass('open closed');
    $('.region-top-nav').toggleClass('offscreen-open');
    $('#off-screen').toggleClass('visible hidden');
    $("#page").toggleClass('open closed');
    if ( $('#video-play-pause-button i').hasClass('fa-pause') ) {
      $('#video-play-pause-button').click();  
    }
    $("#off-screen-sidebar").toggleClass('closed open');
    $('#block-system-main-menu nav li:first-child a').focus();
    return false;
  });

  $('#off-screen').click(function(event) {
    if ( event.target == this ) {
      $('.main-menu-button').click();
    }
  });
});