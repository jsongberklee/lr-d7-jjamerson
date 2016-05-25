var breakPoint = 767;

jQuery(document).ready(function($){
  function openInOverlay(overlayImage) {
    if ($(window).width() < 490) {
      return true;
    } else {
      var berkleeOverlayContainer = $('<div />').addClass('berklee-overlay-container');
      var berkleeOverlayItem = $('<div />')
        .addClass('berklee-overlay-item')
        .css('display', 'inline-block');
      var berkleeOverlayImage = $('<img />').attr('src', overlayImage.attr('src'));

      var berkleeOverlayClose = $('<a />')
        .addClass('icon-remove')
        .addClass('berklee-overlay-close')
        .attr('href','#')
        .click(function(){
          $('.berklee-overlay').hide();
          $('.berklee-overlay .berklee-overlay-container').remove();
          return false;
      });

      if (overlayImage.attr('data-slideshow-id') > 0) {
        var slideshow = $('div[data-slideshow-id="'+slideshowId+'"]');
        var slideshowLeft = $('<div />').addClass('overlay-left fa fa-chevron-left fa-6').appendTo(berkleeOverlayContainer);
        var slideshowRight = $('<div />').addClass('overlay-right fa fa-chevron-right fa-6').appendTo(berkleeOverlayContainer);
        slideshowRight.click(function() {
          var nextImageNumber = parseInt( overlayImage.attr('data-number') ) + 1;
          if (nextImageNumber == parseInt( slideshow.attr('data-slide-count') ) ) {
            nextImageNumber = 0;
          }
          var slideshowId = overlayImage.attr('data-slideshow-id');
          berkleeOverlayItem.remove();
          $('img[data-number="'+nextImageNumber+'"]', slideshow).click();
        });
        slideshowLeft.click(function() {
          var nextImageNumber = parseInt( overlayImage.attr('data-number') ) - 1;
          if (nextImageNumber < 0) {
            nextImageNumber = parseInt( slideshow.attr('data-slide-count') ) - 1;
          }
          var slideshowId = overlayImage.attr('data-slideshow-id');
          berkleeOverlayItem.remove();
          $('div[data-slideshow-id="'+slideshowId+'"] img[data-number="'+nextImageNumber+'"]').click();
        });
      }

      berkleeOverlayItem.append(berkleeOverlayImage)
        .append(berkleeOverlayClose.clone(true));
      berkleeOverlayContainer.append(berkleeOverlayItem);
      $('.berklee-overlay').append(berkleeOverlayContainer);

      berkleeOverlayContainer.show();
      $('.berklee-overlay').show();

      return false;
    }
  }

  if ($(window).width() > 480) {
    $('body').on('DOMNodeInserted', '#page-content', function(e) {
      $(e.target).find('img').each(function() {
        performShrinkage( $(this) );
      });
    });
    $('img.shrinkage-performed').each(function() {
      performShrinkage( $(this) );
    });
  }
  function performShrinkage(image) {
    var width = false;
    if ( image.parents('.view').width() ) {
      width = image.parents('.view').width();
    } else if ( image.parent().width() > image.width() ) {
      width = image.parent().width();
    } else {
      width = 1000;
    }
    if ( width > 970) {
      image.attr('src', image.attr('large-src') );
    } else if ( width > 480) {
      if ( image.attr('medium-src') > '') {
        image.attr('src', image.attr('medium-src') );
      } else if ( image.attr('large-src') > '' ) {
        image.attr('src', image.attr('large-src') );
      }
    }
    image.removeClass('shrinkage-performed').addClass('shrinkage-undone');
  }

  slideshowId = 0;
  function createSlideshow(imageSet, inputType, classes, replacedElementName) {
    slideshowId++;
    var slideshow = $('<div />').addClass('content-slideshow ' + classes).attr('data-active-slide', 0).attr('data-slideshow-id', slideshowId);
    var slideshowChrome = $('<div />').addClass('slideshow-chrome').appendTo(slideshow);
    var slideshowLeft = $('<div />').addClass('slideshow-left fa fa-angle-left fa-6').appendTo(slideshowChrome);
    var slideshowRight = $('<div />').addClass('slideshow-right fa fa-angle-right fa-6').appendTo(slideshowChrome);
    var slideshowThumbs = $('<div />').addClass('slideshow-thumbs').appendTo(slideshow);
    var slideshowImages = $('<div />').addClass('slideshow-images').appendTo(slideshow);

    var slideCount = imageSet.length;
    slideshow.attr('data-slide-count', slideCount);
    var counter = 0;
    imageSet.each(function() {
      if ( $(this).hasClass('shrinkage-performed') || $(this).hasClass('shrinkage-undone') ) {
        if ( classes == 'full-sized') {
          $(this).attr('src', $(this).attr('medium-src') );
        }
        $(this).removeClass('shrinkage-performed').addClass('shrinkage-undone');
      }
      var slideshowFigure = $('<figure />').attr('data-number', counter);
      if (inputType === 'links') {
        var slideshowImage = $('<img />').attr('src', $(this).attr('href') ).attr('data-number', counter);
      } else {
        var slideshowImage = $('<img />').attr('src', $(this).attr('src') ).attr('data-number', counter);
      }
      slideshowImage.attr('data-slideshow-id', slideshowId);
      if ( classes.indexOf('mini') > -1) {
        slideshowImage.attr('overlay', 'true');
      } else if ( $(this).attr('overlay') == 'true') {
        slideshowImage.attr('overlay', 'true');
      }
      slideshowImage.appendTo(slideshowFigure);
      
      var figcaption = $('<figcaption />').appendTo(slideshowFigure);

      if ($(this).attr('caption') > '' ) {
        var caption = $(this).attr('caption');
      } else {
        var caption = $(this).attr('title');
      }
      if (caption.length > 0) {
        if ( $(this).attr('credit') > '') {
          caption = caption + '<div class="credit">' + $(this).attr('credit') + '</div>';
        } else {
          var captionCreditSplit = caption.split('&nbsp;  ');
          if (captionCreditSplit.length > 1) {
            caption = captionCreditSplit[0] + '<div class="credit">Image credit: ' + captionCreditSplit[1] + '</div>';
          }  
        }
      } else {
        caption = $('.field-name-field-image-caption', $(this).parent('.media-element-wrapper') ).text();
        var credit = $('.field-name-field-photo-credit', $(this).parent('.media-element-wrapper') ).text();
        caption = caption + '<div class="credit">' + credit + '</div>';
      }
      figcaption.html(caption);
      
      slideshowFigure.appendTo(slideshowImages);

      var slideshowThumb = slideshowImage.clone(false).attr('overlay', 'false').appendTo(slideshowThumbs);

      slideshowThumb.click(function() {
        activeSlide = $(this).attr('data-number');
        moveToActiveSlide();
      });
      counter++;
    });
    
    var activeSlide = 0;
    slideshowRight.click(function() {
      if (activeSlide < (slideCount-1) ) {
        activeSlide++;  
      } else {
        activeSlide = 0;
      }
      moveToActiveSlide();
    });
    slideshowLeft.click(function() {
      if (activeSlide > 0) {
        activeSlide--;
      } else {
        activeSlide = slideCount - 1;
      }
      moveToActiveSlide();
    });

    function moveToActiveSlide() {
      slideshow.attr('data-active-slide', activeSlide);
      var figureHeight = $('figure[data-number="' + activeSlide + '"]', slideshowImages).height();
      slideshow.height( figureHeight + 70);
      
      thisOffset = Math.max(0, activeSlide * (slideshowThumbsWidth / slideCount) - ( slideshow.width() / 2 ) );
      slideshowThumbs.css('transform', 'translate3d(-'+thisOffset+'px, 0, 0)');    
    }

    $(replacedElementName).replaceWith(slideshow);

    var slideshowThumbsWidth = 0;
    var slideshowThumbsLoaded = 0;
    $('.slideshow-thumbs img').load(function() {
      slideshowThumbsWidth += $(this).width();
      slideshowThumbsLoaded++;
      if (slideshowThumbsLoaded === slideCount) {
        slideshow.css('opacity', 1);
      }
    });
    slideshow.css('opacity', 0.1);
    $('figure[data-number="0"] img').load(function() {
      moveToActiveSlide();
    });

  }

  $('.node.tagged-content-slider-mini .field-name-field-image').each(function() {
    createSlideshow( $('a', this), 'links', 'mini', '.field-name-field-image'); 
  });
  $('.node.tagged-content-slider .field-name-field-image').each(function() {
    createSlideshow( $('a', this), 'links', 'full-sized', '.field-name-field-image'); 
  });


  var slidesByClass = $('.node img.slideshow, .node img.content-slider, .node img.content-slider-mini');
  if ( slidesByClass.length ) {
    slidesByClass.hide();
    if ( slidesByClass.hasClass('mini') || slidesByClass.hasClass('content-slider-mini') ) {
      var classes = 'mini';
    } else {
      var classes = 'full-sized';
    }
    if ( slidesByClass.first().parent('.media-element-wrapper').length ) {
      var parent = slidesByClass.first().parent('.media-element-wrapper');
    } else {
      var parent = slidesByClass.first();
    }
    createSlideshow( slidesByClass, 'images', classes, parent );
  }


  
  $('#page img:not(.slideshow):not(.content-slider):not(.content-slider-mini)').one("load", function(){
    // Hide external link icon on links with images
    var parentLink = $(this).parent('a');
    if (parentLink) {
      parentLink.addClass('no-external-link-icon');
    }
    // align the wrapper appropriately
    if ( $(this).parent('.media-element-wrapper') ) {
      var wrapperWidth = $(this).width();
      $(this).parent('.media-element-wrapper').css('float', $(this).css('float') );
      if ($(this).css('float') == 'right') {
        $(this).parent('.media-element-wrapper').css('marginLeft', '1.5em');
      }
      $(this).parent('.media-element-wrapper').css('clear', 'both' );
      $(this).parent('.media-element-wrapper').css('width', wrapperWidth );
    }
    // Create captions & credits from img attributes
    if ( $(this).attr('caption') || $(this).attr('credit') ) {
      if ( $(this).parent('.media-element-wrapper') ) {
        parent = $(this).parent('.media-element-wrapper');
        if ( $(this).attr('caption') ) {
          $('figcaption', parent).remove();
          $('.field-name-field-image-caption', parent).remove();  
        }
        if ( $(this).attr('credit') ) {
          $('.field-name-field-photo-credit', parent).remove();  
        }
        
        $(this).unwrap();
      }
      //var height = $(this).attr('height'); //unused
      var width = $(this).attr('width');
      var imageWrapped = $(this).wrap('<figure class="image-wrapper"/>');
      var figure = imageWrapped.parent('figure');
      figure.width(width + 'px');
      figure.addClass( $(this).attr('displayStyle') );
      var figcaption = $('<figcaption />');
      if ( $(this).attr('caption') ) {
        var caption = $('<div />').addClass('caption').html ( $(this).attr('caption') );
        caption.appendTo(figcaption);
      }
      if ( $(this).attr('credit') ) {
        var credit = $('<div />').addClass('credit').html ( $(this).attr('credit') );
        credit.appendTo(figcaption);
      }
      figcaption.appendTo(figure);
    }
    // Check for link attribute and wrap in anchor tag, if needed
    if ( $(this).attr('link') ) {
      var imageWrapped = $(this).wrap('<a href="' + $(this).attr('link') + '" target="_blank" />');
    } else {
      // Check to see if the image should be lightboxed
      if ( $(this).attr('overlay') == 'true' ) {
        $(this).addClass('overlay-element');
        $(this).click( function() { openInOverlay( $(this) ); } );
      }
    }
    if (figure) {
      setTimeout( function() { figure.css('opacity', '1') }, 50);  
    }
    $(this).parent('.media-element-wrapper').show(100);
  }).each(function() {
    if(this.complete) $(this).load();
  });

  $('.tutorial-zoom-icon').click(function() {
    $('img', $(this).parent('figure') ).click();
  });

  $('.media-element-wrapper > a').parent('.media-element-wrapper').addClass('media-link');

  setTimeout( function() { $('.media-element-wrapper').css('maxHeight', '10000px') }, 60);

  // Images with the 'image-cover' class (or whose immediate parents have the 'image-cover' class)
  // will behave like the 'cover' background-size property
  function coverImage(image) {
    if ( $(window).width() < breakPoint ) {
      image.width('100%');
      image.height('auto');
      image.css('marginLeft', 0);
      image.css('marginTop', 0);
      return;
    }
    // Get the natural width, height, and aspect ratio of the image
    var tempImg = new Image();
    tempImg.src = image.attr('src');
    var imageWidth = tempImg.width;
    var imageHeight = tempImg.height;
    var aspectRatio = imageWidth / imageHeight;

    // Clear any CSS or attribs defining width and height
    image.removeProp('width');
    image.removeProp('height');

    // Set the image width and height to 0 before getting the element's 
    // dimensions, so that the image doesn't influence/enlarge the parent's size:
    image.height(0);    
    image.width(0);
    var elementWidth = image.parent().width();
    var elementHeight = image.parent().height();
    var elementAspectRatio = elementWidth / elementHeight;

    if (aspectRatio >= elementAspectRatio) {
      image.height('100%');
      image.width('auto');
      var leftMargin = Math.min(0, (elementWidth - image.width() ) / 3);
      image.css('marginLeft', leftMargin);
      image.css('marginTop', 0);
    } else {
      image.width('100%');
      image.height('auto');
      image.css('marginLeft', 0);
      var topMargin = Math.min(0, (elementHeight - image.height() ) / 3);
      image.css('marginTop', topMargin);
    }
  }

  // Run the coverImage function on image load:
  $('img.image-cover, .image-cover > img').one('load', function() {
    coverImage( $(this) );
  }).each(function() {
    if (this.complete) {
      $(this).load();
    }
  });
  // And then again on resize:
  $(window).resize( function() {
    $('img.image-cover, .image-cover > img').each(function() {
      coverImage( $(this) );
    });
  });

});