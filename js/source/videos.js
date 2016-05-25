jQuery(document).ready(function($){
  $(window).resize(function() { resizeVideos() });
  resizeVideos();

  function resizeVideos() {
    $('iframe[src*="youtube.com"], embed[src*="brightcove.com"]').each(function() {
      var video = $(this);
      if (video.hasClass('overlay') ) { return; }
      if ( video.attr('height') > 0) {
        height = video.attr('height');
      } else {
        height = video.height();
      }
      if ( video.attr('width') > 0) {
        width = video.attr('width');
      } else {
        width = video.width();
      }
      var aspectRatio = height / width;
      video.width('100%');
      var actualWidth = video.width();
      var newHeight = actualWidth * aspectRatio;
      video.height(newHeight);
    });
  }
});