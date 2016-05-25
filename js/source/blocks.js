/* Collapsible Block Behavior: */
function rememberCollapsed(action, thing) {
  if (typeof(Storage) == undefined || localStorage == null) {
    return -1;
  }
  if (action === 'add') {
    localStorage.collapsedBlocks += thing;
  }
  if (action === 'remove') {
    localStorage.collapsedBlocks = localStorage.collapsedBlocks.split(thing).join('');
  }
  if (action === 'check') {
    if (!localStorage.collapsedBlocks) {
      localStorage.collapsedBlocks = '';
      return -1;
    } else {
      return localStorage.collapsedBlocks.indexOf(thing);
    }
  }
}

jQuery(document).ready(function($){
  if (typeof(Storage) != undefined && localStorage != null) {
    $('.block.collapsible').each(function() {
      if ( $(this).attr('id') ) {
        var isCollapsed = rememberCollapsed('check', $(this).attr('id') );
        if (isCollapsed > -1) {
          $(this).addClass('collapsed').removeClass('expanded');
        }
      }
    });
  }
  $('.block.collapsible.collapsed .content').hide().addClass('jquery-altered');
  $('.block.collapsible > h3').click(function(){
    var parent = $(this).parent('.block');
    if (!parent.hasClass('collapsed') && !parent.hasClass('expanded') ) {
      parent.addClass('expanded');
    }
    parent.toggleClass('collapsed expanded');
    $('.content', parent).slideToggle(142);

    if ( parent.hasClass('collapsed') ) {
      rememberCollapsed('add', '|' + parent.attr('id') );
    } else {
      rememberCollapsed('remove', '|' + parent.attr('id') );
    }
  });

  /* Collapsible Lists: */
  $('ul.collapsible').each(function() {
    $('li:nth-child(n+4)', this).hide();
    //$(this).height('80px'); 
    var expand = $('<div />').addClass('expand').html('See All').appendTo( $(this) );
    expand.click(function(){
      //alert('h');
      var parent = $(this).parent('ul.collapsible');
      $('li:nth-child(n+4)', parent).toggle(200);
      if ( $(this).html() === 'See All' ) {
        $(this).html('Collapse List').addClass('expanded');
      } else {
        $(this).html('See All').removeClass('expanded');
      }
    })
  });

  /* Gridblocks */
  $('.berklee-grid').each(function() {
    var grid = $(this);
    var height = $(this).attr('height');
    var minWidth = $(this).attr('data-min-width');
    
    $('.berklee-gridblock', this).each(function(){
      var gridblock = $(this);
      $(this).css('height', height).addClass('jquery-altered');
      
      if (minWidth) {
        if (typeof minWidth === 'string' || minWidth instanceof String) {
          minWidth = parseInt( minWidth.replace('px','') );
        }
        columns = parseInt( grid.attr('columns') );
        var triggerWidth = (columns * minWidth) + (columns * 5);
        // The easiest option would be to just pass the min-width along, like so: 
        // $(this).css('minWidth', minWidth);
        // but that leaves the potential for there to be excess empty space on the right.
        recalculateGridblocks(grid, gridblock, minWidth, triggerWidth);
        $(window).resize(function() { 
          recalculateGridblocks(grid, gridblock, minWidth, triggerWidth);
        });
      }

    });
  });
  function recalculateGridblocks(grid, gridblock, minWidth, triggerWidth) {
    if ( $(window).width() < 767) {
      gridblock.width('100%');
      $('img', gridblock).width('100%').height('auto');
      return;
    }
    if (grid.width() > triggerWidth) {
      columns = parseInt( grid.attr('columns') );
    } else {
      columns = Math.floor(grid.width() / minWidth);
    }
    var newWidth = (100 / columns) - 4;  //(100 - (columns * 2)) * (1 / columns);
    gridblock.width( newWidth + '%');
  }
});

