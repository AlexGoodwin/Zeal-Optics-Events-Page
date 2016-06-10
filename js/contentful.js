/*global
    console, $, moment
*/

/* 
    Masonry Objects 
*/
var masonry = $('.upcomingEvents').masonry({
        itemSelector: '.event',
        gutter: 0,
        percentPosition: true
    }),
    pastMasonry = $('.pastEvents').masonry({
        itemSelector: '.event',
        gutter: 0,
        percentPosition: true
    });

/* 
    Contentful grab
    
    TODO:
        Needs "featured event" support
        Past events needs styling updates
        Masonry widths need responsiveness
        Add "poster" support to contentful
        Needs event end date/time too?
        
    Using momentJS for time formatting
*/
function getEvents() {
    'use strict';

    var request = new XMLHttpRequest(),
        access_token = '7293987ea91368b8cae485aeadc4037af8253ae4706e2fa0400f9a831aa93086';

    request.open('GET', 'https://cdn.contentful.com/spaces/1kzutnf7jc3r/entries?content_type=events&access_token=' + access_token + '&include=10&order=fields.startDate');

    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            // console.log('Status:', this.status);
            // console.log('Headers:', this.getAllResponseHeaders());
            // console.log('Body:', this.responseText);
            
            var i,
                event,
                element,
                image,
                id,
                url,
                maxDetailsChars = 150, // number of characters to allow before truncating
                response = JSON.parse(this.responseText);

            /* 
                Insert each event into dom
                Since assets are delivered seperately from contentful, create a img
                    element to bookmark that image. The src is then updated by going through 
                    the assets array and matching to the bookmarked img element
            */
            for (i = 0; i < response.items.length; i += 1) {
                // easy access
                event = response.items[i].fields;

                // truncate event details to first x characters
                if (event.details.length > maxDetailsChars) {
                    event.details = event.details.substr(0, maxDetailsChars);
                    event.details += '...';
                }
                
                // format event start date
                event.startDate = moment(event.startDate).format("ddd, MMM D h:mmA");

                // create template element
                element = '<div class="event">' +
                    '<div class="card">' +
                    '<div class="imageBackground">' +
                    // create bookmark for assets to be loaded into
                    '<img id="' + event.featuredImage.sys.id + '">' +
                    '</div>' +
                    '<div class="content">' +
                    '<h2>' + event.name + '</h2>' +
                    '<div class="details">' +
                    '<div class="location">' + event.locationString + '</div>' +
                    '<div class="startDate">' + event.startDate + '</div>' +
                    '</div>' +
                    '<h3>' + event.teaser + '</h3>' +
                    '<p class="eventDetails">' + event.details + '</p>' +
                    '<a href="#" class="moreDetails">Learn More</a>' +
                    '</div>' +
                    '</div>';

                // sort into upcoming or past
                if (moment(event.startDate, "ddd, MMM D h:mmA").isAfter(moment())) {
                    // move to upcoming
                    masonry.append(element).masonry('appended', element);
                } else {
                    // is past
                    pastMasonry.append(element).masonry('appended', element);
                }
            }

            // insert image assets in bookmarked locations
            for (i = 0; i < response.includes.Asset.length; i += 1) {
                // console.log(response.includes.Asset[i]);
                image = response.includes.Asset[i];
                id = image.sys.id;
                url = image.fields.file.url;

                $('#' + id).attr('src', url);
            }

            // once images have loaded, call masonry again to align
            $('.upcomingEvents img').on('load', function () {
                masonry.masonry('layout');
                masonry.masonry('reloadItems');
            });
            $('.pastEvents img').on('load', function () {
                pastMasonry.masonry('layout');
                pastMasonry.masonry('reloadItems');
            });
        }
    };

    request.send();
}

$(function () {
    'use strict';

    getEvents();
});
