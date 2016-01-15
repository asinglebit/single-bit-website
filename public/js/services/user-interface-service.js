angular.module('UserInterfaceService', []).factory('UserInterface', ['$location','$timeout','spinnerService', function($location, $timeout, spinnerService) {

  var userInterface = this;

  userInterface.selectedPage = 0;
  userInterface.selectedView = 'feed';
  userInterface.pages = [];
  userInterface.classes = [];
  userInterface.zoomInEnabled = false;
  userInterface.mobile = (($(window).height() <= 600) || ($(window).width() <= 600)) ? true : false;
  userInterface.scrollbarTemplate = {
    scrollButtons:{
      enable:true
    },
    advanced:{
      autoScrollOnFocus: false,
      updateOnContentResize: true
    }
  }

  userInterface.calculateDimensions = function(){
    var heightPercentageMultiplier = $(window).height()/100;
    userInterface.classes.forEach(function(element, index, array)
    {
      switch (element[1])
      {
        case 's': case 'm':{
          $(element).css({"height": heightPercentageMultiplier * parseInt(element.split('-')[2]) + "px"});
          $(element).css({"display": "block"});
          $(element).css({"overflow": "hidden"});
          break;
        }
        case 'p': {
          $(element).css({"height":'50px'});
          $(element).css({"display": "block"});
          $(element).css({"overflow": "hidden"});
          break;
        }
        case 'i' : {
          $(element).css({"height": heightPercentageMultiplier * parseInt(element.split('-')[2]) + "px"});
          $(element).css({"width":"auto"});
          $(element).css({"overflow": "hidden"});
          break;
        }
        case 'e' : {
          $(element).css({"height": '100px'});
          $(element).css({"width":"auto"});
          $(element).css({"overflow": "hidden"});
          break;
        }
      }
    });
  }

  userInterface.scrollByPageName = function(pageName, speed){
    $('html, body').animate({
      scrollTop: $('#' + pageName).offset().top
    }, speed);
  };

  userInterface.scrollByPageNumber = function(pageNumber, speed){
    $('html, body').animate({
      scrollTop: $('#' + userInterface.pages[pageNumber]).offset().top
    }, speed);
  };

  userInterface.initializePrimaryScrollbars = function(){
    if (userInterface.mobile == false){
      userInterface.scrollbarTemplate.theme = "inset-dark";
      userInterface.scrollbarTemplate.scrollbarPosition = "outside";
      $('.scrollable-dark').mCustomScrollbar(userInterface.scrollbarTemplate);
      userInterface.scrollbarTemplate.scrollbarPosition = "inside";
      $('.scrollable-dark-inside').mCustomScrollbar(userInterface.scrollbarTemplate);
      userInterface.scrollbarTemplate.theme = "inset";
      $('.scrollable-light-inside').mCustomScrollbar(userInterface.scrollbarTemplate);
    }
  };

  userInterface.initializeSecondaryScrollbars = function(){
    if (userInterface.mobile == false){
      userInterface.scrollbarTemplate.theme = "inset-dark";
      userInterface.scrollbarTemplate.scrollbarPosition = "outside";
      $('.scrollable-dark-view').mCustomScrollbar(userInterface.scrollbarTemplate);
      userInterface.scrollbarTemplate.scrollbarPosition = "inside";
      $('.scrollable-dark-inside-view').mCustomScrollbar(userInterface.scrollbarTemplate);
    }
  };

  userInterface.zoomIn = function zoom(){
    if (userInterface.mobile == false){
      if (userInterface.zoomInEnabled == false)
      setTimeout(function(){ zoom(); }, 100);
      else {
        $('.zoom-in-start').removeClass('zoom-in-start').addClass('zoom-in-end');
        userInterface.zoomInEnabled = false;
      }
    }
  }

  userInterface.zoomOut = function(){
    if (userInterface.mobile == false) $('.zoom-in-end').addClass('zoom-in-start').removeClass('zoom-in-end');
  }

  userInterface.disableResponsiveCSS = function(){
  }

  return {

    // Initialization

    initializeService : function (pages, classes, callback) {

      userInterface.classes = classes;
      userInterface.pages = pages;

      // Figure out responsiveness

      if (userInterface.mobile == false){
        $(window).load(function(){
          userInterface.initializePrimaryScrollbars();
        });
        $(window).bind('wheel', function(){
          return false;
        });
        for (var i = 0; i < userInterface.classes.length; ++i)
        {
          if ((userInterface.classes[i][1] == 'p') || (userInterface.classes[i][1] == 'e'))
          userInterface.classes.splice(i--, 1);
        }
      }
      else {
        $('.zoom-in-start').removeClass('zoom-in-start');
        $('.zoom-in-end').removeClass('zoom-in-end');

        for (var i = 0; i < userInterface.classes.length; ++i)
        {
          if ((userInterface.classes[i][1] == 's') || (userInterface.classes[i][1] == 'i'))
          userInterface.classes.splice(i--, 1);
        }
      }

      userInterface.calculateDimensions();

      // Custom slider

      $('a.page-scroll').click(function()
      {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
          if (target.length) {
            $('html,body').animate({
              scrollTop: target.offset().top - 40
            }, 900);
            return false;
          }
        }
      });

      // Subscribe to window events

      var resizeTimer;
      $(window).on('resize', function(e){
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
          userInterface.calculateDimensions();
          userInterface.scrollByPageNumber(userInterface.selectedPage, 300);
        }, 100);
      });

      $(window).bind('scroll', function(){
        var navHeight = $(window).height() - 100;
        if ($(window).scrollTop() > navHeight)
        $('.navbar-default').addClass('on');
        else $('.navbar-default').removeClass('on');

        for (var i = 0, page = 0; i < userInterface.pages.length; ++i)
        {
          if ($(document).scrollTop() > $('#' + userInterface.pages[i]).offset().top) ++page;
          else break;
        }

        userInterface.selectedPage = page;
        callback();
      });
    },

    updateService : function(){
      userInterface.calculateDimensions();
      if (userInterface.mobile == false)userInterface.initializeSecondaryScrollbars();
      else {
        userInterface.disableResponsiveCSS();
      }
    },

    // Toggling menu

    hideMenu : function(){
      $('.navbar-collapse').collapse('hide');
    },

    // Zooming page

    zoomIn : function(){
      userInterface.zoomIn();
    },

    zoomOut : function(){
      userInterface.zoomOut();
    },

    setZoomEnabled : function(){
      userInterface.zoomInEnabled = true;
    },

    // Forced scroll

    scrollByPageNumber : function(pageNumber){
      userInterface.scrollByPageNumber(pageNumber, 500);
    },
    scrollByPageName : function(pageName){
      userInterface.scrollByPageName(pageName, 500);
    },

    // Selected page

    getSelectedPage : function(){
      return userInterface.selectedPage;
    },
    setSelectedPage : function(page){
      userInterface.selectedPage = page;
    },

    // Selected view

    getSelectedView : function(){
      return userInterface.selectedView;
    },
    setSelectedView : function(view){
      userInterface.selectedView = view;
    },

    // Navigation

    gotoPage : function(page, view)
    {
      if (page == 1)
      {
        if (userInterface.selectedPage == 1)
        {
          if (userInterface.selectedView != view)
          {
            userInterface.zoomOut();
            $timeout(function()
            {
              spinnerService.show('viewSpinner');
              $location.path('/' + view);
              userInterface.selectedView = view;
              if (userInterface.mobile == true) userInterface.scrollByPageNumber(1);
              userInterface.zoomIn();
            }, 300);
          }
        }
        else
        {
          spinnerService.show('viewSpinner');
          $location.path('/' + view);
          userInterface.selectedView = view;
          userInterface.scrollByPageNumber(1);
          $timeout(function(){
            userInterface.zoomIn();
          }, 400);
        }
      } else {
        if (userInterface.selectedPage != page){
          userInterface.zoomOut();
          $timeout(function (){
            $location.path('/' + userInterface.pages[page]);
            if (!(userInterface.selectedPage == page) || (userInterface.mobile == true)) userInterface.scrollByPageNumber(page);
          }, 300);
        }
        else {
          $location.path('/' + userInterface.pages[page]);
          if (!(userInterface.selectedPage == page) || (userInterface.mobile == true)) userInterface.scrollByPageNumber(page);
        }
      }
    },

    mobile : userInterface.mobile
  }
}]);
