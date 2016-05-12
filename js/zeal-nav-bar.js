/*global $*/
/*jslint node:true */

'use strict';

$(function () {
    // close side bar on window resize
    $(window)
        .on('resize', function () {
            $('.navbar').removeClass('slide-active');
        })
        .on('scroll', function () {
            if ($(window).width() > 991 && $(window).scrollTop() >= $('.nav-container').height()) {
                $('.nav-container').addClass('fixed');
            } else {
                $('.nav-container').removeClass('fixed');
            }
        });

    // top-level desktop nav
    $('.nav-container > ul > li > a').click(function (e) {
        e.preventDefault();

        // close search
        $('#nav-search').parent().removeClass('open-search').removeClass('open-country');

        // open this drop-down
        if ($(this).parent().hasClass('open')) {
            $(this).parent().removeClass('open');
        } else {
            // close other drop-downs
            $('.nav-container > ul > li').removeClass('open');

            // open this drop-down
            $(this).parent().addClass('open');
        }
    });

    // open side menu
    $('#openSlideMenu').click(function (e) {
        e.preventDefault();

        $('.navbar').toggleClass('slide-active');

        // close sub-menus
        $('.slide-menu > li > ul').slideUp();
        $('.slide-menu > li > a').removeClass('open');
    });

    // side menu sub-menus
    $('.slide-menu > li > a').click(function (e) {
        e.preventDefault();

        if ($(this).hasClass('open')) {
            $(this).siblings('ul').slideUp();
            $(this).removeClass('open');
        } else {
            $(this).siblings('ul').slideDown();
            $(this).addClass('open');
        }

        // close other sub-menus
        $(this).parent().siblings().children('ul').slideUp();
        $(this).parent().siblings().children('a').removeClass('open');
    });

    // desktop search
    $('#nav-search').click(function (e) {
        e.preventDefault();

        // close menu sub-menus
        $('.nav-container > ul > li').removeClass('open');

        $(this).parent().toggleClass('open-search').removeClass('open-country');

        if ($(this).parent().hasClass('open-search')) {
            $('#searchInput').focus();
        } else {
            $('#searchInput').blur();
        }
    });

    // desktop country selector
    $('#nav-country').click(function (e) {
        e.preventDefault();
        $('.nav-container > ul > li').removeClass('open');
        $(this).parent().toggleClass('open-country').removeClass('open-search');
    });

    // bind input clear x
    $('a#search-delete').click(function (e) {
        e.preventDefault();

        $('#input_ZOSearchBoxComponent #searchInput').val('').focus();
    });
});
