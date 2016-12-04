var menuClickable = true;
var MenuHelper = {
    MenuItemAnimate: function (id, delay, meta, duration, complete){
        $("#"+id).delay(delay).animate(meta, duration, function(){
            if (complete!=null){
                complete();
            }
        });
    }
};
function clickInit(){
    $(".menu-holder .menu-icon").on("click", function(){
        if (!menuClickable) return;
        var mainMenuItemIds = ["menu-item-000","menu-item-001","menu-item-002"];
        if($(this).attr("data-button")=="menu"){
            menuClickable = false;
            $(".menu-holder").removeClass ("menu-hidden");
            $(this).attr("data-button","close");
            setTimeout(function(){
                for(var i=0; i<mainMenuItemIds.length; i++){
                    if (i<mainMenuItemIds.length-1){
                        MenuHelper.MenuItemAnimate (mainMenuItemIds[i], 100*i,{right:"0px"},600,null);
                    }else{
                        MenuHelper.MenuItemAnimate (mainMenuItemIds[i], 100*i,{right:"0px"},600,function(){menuClickable = true;});
                    }
                }
            }, 500);
        }else{
            menuClickable = false;
            for (var i=0; i<mainMenuItemIds.length; i++){
                $("#"+mainMenuItemIds[i]).animate({right:"270px"}, 600);
            }
            var sel = $(this);
            setTimeout(function() {
                sel.attr("data-button","menu");
                setTimeout(function() {
                    menuClickable = true;
                    $(".menu-holder").addClass ("menu-hidden");
                }, 700);
            }, 500);
        }
    });
}

function sliderInit (){
    var liteModeSwither;
    if (!device.mobile() && !device.tablet()){
        liteModeSwither = false;
    }else{
        liteModeSwither = true;
    }
    if ($.browser.msie && parseInt($.browser.version)<9){
        liteModeSwither = true;
    }

    $("#parallax-slider-160802").parallaxSlider({
        parallaxEffect:"parallax_effect_normal",
        parallaxInvert:false,
        animateLayout: "simple-fade-eff",
        duration: 1500,
        autoSwitcher: true,
        autoSwitcherDelay: 10000,
        scrolling_description: true,
        slider_navs: true,
        slider_pagination: "none_pagination",
        liteMote: liteModeSwither
    });
}

// ---------------------------------------------------------
// Portfolio isotope
// ---------------------------------------------------------
function portfolioIsotope (){
    var _window = $(window);
    var portfolio = $('.portfolio-shortcode .portfolio_wrapper'),
        portfolio_item_selector = '.portfolio-item',
        portfolio_item = $(portfolio_item_selector, portfolio),
        portfolio_columns_init = portfolio.data('columns'),
        transitionDuration = '0.5',
        filterButtons = $('.portfolio-shortcode .portfolio_filter_buttons > .filter_button'),
        currentCategory = '*';
    
    if(portfolio.length > 0) {
        portfolio.imagesLoaded( function() {
            setTimeout(function(){
                setColumnsNumber();
                resizePortfolioItem();
                portfolio.isotope({
                    itemSelector: portfolio_item_selector,
                    resizable : true,
                    layoutMode: 'masonry'
                }).bind("resize.rainbows", function(){
                    setColumnsNumber();
                    resizePortfolioItem();
                    portfolio.isotope('reLayout');
                });
            },10);
        });
        
        filterButtons.on( 'click', function() {
            var _this = $(this);
            var category = _this.attr('data-filter');
            
            if(currentCategory != category){
                filterButtons.removeClass('current-category');
                _this.addClass('current-category');
                currentCategory = category;
                if(category != '*') category = '.'+category;
                portfolio.isotope({ filter: category});
            }
        });
        
        
        $('.portfolio_wrapper .portfolio-item').magnificPopup({
            delegate: '.thumbnail > a',
            type: 'image',
            removalDelay: 500,
            mainClass: 'mfp-zoom-in',
            callbacks: {
                beforeOpen: function() {
                    // just a hack that adds mfp-anim class to markup 
                    this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
                },
                open: function() {
                  not_resizes = true;
                },
                close: function() {
                  not_resizes = false;
                }
            },
            gallery: {enabled:true}
        });
    }

    function setColumnsNumber() {
        if(_window.width() < 450){
            portfolio_columns = Math.ceil(portfolio_columns_init/3);  
        } else if (_window.width() < 767){
            portfolio_columns = Math.ceil(portfolio_columns_init/2);  
        } else {
            portfolio_columns = portfolio_columns_init;  
        }
    }
    
    function resizePortfolioItem(){
        item_width = parseInt(portfolio.width() / portfolio_columns);
        portfolio_item.each(function(){
            _this = $(this);
            if(_this.hasClass('portfolio-item-highlight') && portfolio_columns > 2 ){
                _this.width(item_width*2).height(item_width*2); 
            } else {
                _this.width(item_width).height(item_width*0.59375);   
            }
        })
    }
}

$(document).ready(function(){
    clickInit();
    sliderInit();
    portfolioIsotope ();
});

$(window).on("load",function(){
    var
    masonrycontainer = $('.masonry_view'),	
    itemList = $('>div', masonrycontainer),	
    filter = $('.masonry_filters'),	
    currFilterItem = 0,	
    col = masonrycontainer.attr("data-masonry-col");

    if (masonrycontainer.length !== 0) {
        masonrycontainer.isotope({
            itemSelector : '.masonry-item',	
            resizable: false,	
            masonry: { columnWidth: Math.floor(masonrycontainer.width() / col) },	
            onLayout: function( $elems, instance ) {}
        });
    }

    $("li", filter).eq(currFilterItem).addClass("active");
    $('a', filter).on('click', function(){
        var selector = $(this).attr('data-filter');

        $("li", filter).eq(currFilterItem).removeClass("active");
        currFilterItem = jQuery(this).parent().index();
        $("li", filter).eq(currFilterItem).addClass("active");

        masonrycontainer.isotope({ filter: selector });
        return false;
    });

    $(window).resize(function(){
        if($(this).width()<600){
            tmpcol = 1;
        }else{
            tmpcol = col;
        }

        $(">div", masonrycontainer).width(Math.floor(masonrycontainer.width() / tmpcol));
        if (masonrycontainer.length !== 0) {
            masonrycontainer.isotope({
                masonry: { columnWidth: Math.floor(masonrycontainer.width() / tmpcol) }
            });
        }
    }).trigger("resize");
});


