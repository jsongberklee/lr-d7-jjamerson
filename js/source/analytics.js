jQuery(document).ready(function($){

  // General tracking based on class:
  $('.track').each(function() {
    // See if a Google Analytics event category is specified, and if not, give a
    // default category.
    if ( $(this).attr('data-tracking-category') > '' ) {
      var category = $(this).attr('data-tracking-category');
    } else {
      var category = 'General Click Tracking';
    }

    // See if a target value is specified. If not, try to use the href. If there's
    // no href, try to use the element's ID. 
    var value = false;
    if ( $(this).attr('data-tracking-value') > '' ) {
      value = $(this).attr('data-tracking-value');
    } else if ( $(this).hasClass('track-value-text') ) {
      if ( $('.text', this).length ) {
        value = $('.text', this).text();
      } else {
        value = $(this).text();
      }
    } else if ( $(this).attr('href') > '') {
      if ( $(this).hasClass('track-value-text-and-url') ) {
        if ( $('.text', this).length ) {
          var text = $('.text', this).text();
        } else {
          var text = $(this).text();
        }
        value = text + ' | ' + $(this).attr('href');
      } else {
        value = $(this).attr('href');
      }
    } else if ( $(this).attr('id') > '') {
      value = $(this).attr('id');
    }

    if ( $(this).hasClass('track-click') ) {
      $(this).click(function() {
        // Check to make sure that the Google Analytics JS is loaded. Putting this
        // inside the click function in case the Analytics JS gets loaded after
        // the event binding.
        if(typeof(ga) != "undefined") { 
          if (value) {
            ga('send', 'event', category, 'Click', value);
          }
        }
      });
    }
  }); 

  // Track Homepage slider clicks:
  $('.front .view-hero-images .views-row').each(function(position,slider) {
    var img = $('img',slider).first(), // first, just so we get one
      link = $('a',slider).last(); // last, just so we get one and skip the slider teaser text
    if(img && link) {
      $(link).click(function() {
        if(typeof(ga) != "undefined") { // Check to make sure that the Google Analytics JS is loaded
          real_position = position+1; // Because people don't get computers starting at zero
          // separate vars for logging & testing
          position_label = 'Slider '+real_position;
          slider_href = $(this).attr('href');
          position_url_label = real_position+':'+slider_href;
          img_name = $(img).attr('src').split('/'); // Split the slider image source URL by slashes
          img_name = (img_name[img_name.length-1])+':'+slider_href; // Get the last thing in the URL which should be the image name
          // As of Apr 1, 2014, these events can be found in Analytics under Behavior > Events
          ga('send', 'event', 'Homepage Slider Positions', 'Click', position_label);
          ga('send', 'event', 'Homepage Slider Content', 'Click', position_url_label);
          ga('send', 'event', 'Homepage Slider Imagery', 'Click', img_name);
        }
      });
    }
  });
});