 /* global $ */
'use strict';
(function () {

     function isMobile() {
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
           return true;
        }
        return false;
    }

    function checkProportions() {
        var windowWidth = $(window).width(),
            windowHeight = $(window).height(),
            proportions = windowWidth / windowHeight;

        if (proportions > 1.50 && windowWidth > 1024 && !isMobile()) {
            var fontSize = windowHeight * 0.135;
            $('body').addClass('full-page');
            $('body, .column').css('font-size', fontSize + 'px');
        } else {
            $('body').removeClass('full-page');
            $('body, .column').css('font-size', '9vw');
        }
    }

    function prepareShop() {
        var shop = {};

        shop.ID = 'b63497b8';
        shop.CNC = '7fb9316d08da7d87';

        shop.ui = {
            changeAmount: '.js-add, .js-remove',
            product: '.product',
            product1: '.js-product-1',
            product2: '.js-product-2',
            showAmount: '.js-amount-show',
            amountField: '.js-amount-field',
            submit: '.js-submit',
            cta: '.js-cta',
            form: '.js-form'
        };

        shop.changeProductAmount = function(e) {
            var $el = $(e.currentTarget);
            var $product = $el.siblings(shop.ui.product);
            var value = parseInt($product.val()) + parseInt($el.data('change'));
            $product.val(value >= 0 ? value : 0);
            $product.change();
        };

        shop.changeCashAmount = function() {
            var value = $(shop.ui.product1).val() * 109 + $(shop.ui.product2).val() * 139;
            $(shop.ui.showAmount).text(value + 'zł');
            $(shop.ui.amountField).val(value * 100);
        };

        shop.showForm = function() {
            $(shop.ui.form).show();
            $(shop.ui.cta).hide();
            $('.body').animate({ scrollTop: screen.height }, 300);
        };

        shop.bindEvents = function() {
            $(this.ui.changeAmount).on('click', shop.changeProductAmount);
            $(this.ui.product).on('change', shop.changeCashAmount);
            $(this.ui.submit).on('click', shop.changeCashAmount);
            $(this.ui.cta).on('click', shop.showForm);
        };

        return shop;
    }

    $(document).ready(function(){
        checkProportions();
        $('.body').show();
        var shop = prepareShop();
        shop.bindEvents();

        $(window).on('resize', function(){
            checkProportions();
        });
    });
})();
