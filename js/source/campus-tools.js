jQuery(document).ready(function($){
  var campusTools = $('.region-top-nav .block-menu.campus-tools');
  var campusToolsNav = $('nav', campusTools);
  var tip = $('<div />').addClass('tip').appendTo( $('.content', campusTools) );
  // Campus Tools items excluding the campuses, since those are constant
  // (if we decide to remove the campuses from the menu, this selector
  // may need to be updated):
  var campusToolsItems = $('ul li:nth-child(2) ul li', campusToolsNav);

  var interval = false;
  campusTools.mouseover(function() {
    campusToolsNav.addClass('visible');
    tip.addClass('visible').css('opacity', '1');
    campusToolsNav.css('opacity', '1');
    clearInterval(interval);
  });
  campusTools.mouseout(function() {
    campusToolsNav.css('opacity', '0');
    tip.css('opacity', '0');
    interval = setInterval( 
      function() { 
        campusToolsNav.removeClass('visible');
        tip.removeClass('visible');
      },
      400
    );
  });
  if ( $('body').hasClass('logged-in') ) {
    var hostname = window.location.hostname;
    if ( hostname.indexOf('hub.berklee.edu') > -1) {
      var url = '/drupal_menu?endpoint=onelogin';
    } else if ( hostname.indexOf('berklee.edu') > -1 || hostname.indexOf('berkleedev') > -1) {
      var url = '/api/v1/onelogin/onelogin/user.json';
    } else {
      campusToolsItems.addClass('visible');
      resizeCampusTools();
      return; 
    }
    $.ajax(url).done(function(onelogin) {
      var appData = $( $.parseXML(onelogin.data) );
      var apps = $('app',appData);
      // If no apps are returned, don't do anything but resize the box
      if ( apps.length == 0) { 
        campusToolsItems.addClass('visible');
        resizeCampusTools();
        return; 
      }
      apps.each(function() {
        var appName = $('name', this).text();
        var appId = $('id', this).text();
        var appHref = "https://app.onelogin.com/client/apps/launch/" + appId;
        var matched = false;
        // Explicitly exclude some apps, like www.berklee.edu:
        if (appId === 456892 || appName === 'www.berklee.edu') {
          return;
        }
        campusToolsItems.each(function() {
          var campusToolsLink = $('a', this);
          var campusToolsLinkText = $('.text', this).text();
          if ( (campusToolsLinkText.indexOf('Calendar') > -1) || (campusToolsLinkText.indexOf('Drive') > -1) ) {
            $(this).addClass('oneloginified visible');
            campusToolsLink.attr('target', '_blank');
            return;
          }
          var campusToolName = campusToolsLinkText;
          if (campusToolName == appName) {
            campusToolsLink.attr('href', appHref);
            $(this).addClass('oneloginified visible');
            campusToolsLink.attr('target', '_blank');
            matched = true;
          }
        });
        if (matched == false) {
          var icon = $('icon', this).text();
          if (icon.indexOf('http' > -1) ) {
            var newCampusTool = $('<li />')
              .addClass('leaf no-submenu oneloginified visible')
              .appendTo('.region-top-nav .block-menu.campus-tools nav .menu li.last ul.menu');
            var newCampusToolLink = $('<a />')
              .attr('href', appHref)
              .attr('_target', 'blank')
              .appendTo(newCampusTool);
            var newCampusToolIcon = $('<img />').addClass('icon image-icon').attr('src', icon).appendTo(newCampusToolLink);
            var newCampusToolText = $('<span />').addClass('text').text(appName).appendTo(newCampusToolLink);
          }
        }
      });
      $(campusToolsItems).not('.oneloginified').removeClass('visible').hide();
      campusTools.addClass('oneloginified');
      // update the list of campus tools items so that resizeCampusTools() calculates correctly
      campusToolsItems = $('ul li:nth-child(2) ul li', campusToolsNav);
      resizeCampusTools();
    });
  } else {
    campusToolsItems.addClass('visible');
    resizeCampusTools();
  }
  function resizeCampusTools() {
    var itemCount = 0;
    campusToolsItems.each(function() {
      if ( $(this).hasClass('visible') ) {
        itemCount++;
      }
    });
    if (itemCount > 9) {
      var moreButton = $('<div />').addClass('more').appendTo(campusToolsNav);
      var moreIcon = $('<i />').addClass('fa fa-chevron-down').appendTo(moreButton);
      var moreText = $('<span />').addClass('text').text('More').appendTo(moreButton);
      moreButton.click(function() {
        moreButton.toggleClass('top');
        moreIcon.toggleClass('fa-chevron-up fa-chevron-down');
        if ( moreButton.hasClass('top') ) {
          campusToolsNav.animate({
            scrollTop: campusToolsNav.height()
          }, 400);
          // Calculate the gap from the bottom as being the number of 3-item, 100px rows, 
          // minus the first 3 rows, plus 5px of padding
          var bottom = campusToolsNav.height() - ( ( Math.ceil(itemCount / 3) - 3) * 100) + 5;
          $(this).css('bottom', bottom + 'px');
        } else {
          campusToolsNav.animate({
            scrollTop: 0
          }, 400);
          $(this).css('bottom', '0px');
        }
      });
    }
  }
});