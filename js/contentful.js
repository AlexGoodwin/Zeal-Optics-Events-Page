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
  featured event banner actions
*/
function addToFeaturedList(event) {
  console.log(event);
  $('ul.featuredEvents ul.other').append(event);
}

function removeFromFeaturedList(event) {

}

function featureEvent(event) {
  var featuredEvents = $('ul.featuredEvents'),
      event = $(event).first(),
      oldEvent = $('ul.featuredEvents li').first();

  if($(oldEvent).attr('id') !== $(event).attr('id')) {
    // move event to first li
    $(featuredEvents).prepend(event);

    // move old event to list on right
    $('ul.featuredEvents ul.other').append(oldEvent);
    // $(oldEvent).remove();
  }
}

/*
    Contentful grab

    TODO:
        Past events needs styling updates
        Masonry widths need responsiveness
        Needs event end date/time too?

    Using momentJS for time formatting
*/
function getEvents() {
    'use strict';

    var request = new XMLHttpRequest(),
        access_token = '7293987ea91368b8cae485aeadc4037af8253ae4706e2fa0400f9a831aa93086';

    request.open('GET', 'https://cdn.contentful.com/spaces/1kzutnf7jc3r/entries?content_type=events&access_token=' + access_token + '&include=10&order=fields.startDate');

    request.onreadystatechange = function() {
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

                // console.log(response);

            /*
                Insert each event into dom
                Since assets are delivered seperately from contentful, create a img
                    element to bookmark that image. The src is then updated by going through
                    the assets array and matching to the bookmarked img element
            */
            for (i = 0; i < response.items.length; i += 1) {
                // easy access
                event = response.items[i].fields;

                console.log(event);

                // truncate event details to first x characters
                if (event.details.length > maxDetailsChars) {
                    event.truncatedDetails = event.details.substr(0, maxDetailsChars);
                    event.truncatedDetails += '...';
                }

                // format event start date
                event.longStartDate = moment(event.startDate).format("ddd, MMM D h:mmA");
                event.shortStartDate = moment(event.startDate).format("M/D/YY hA");

                // create template element
                element = '<div class="event">' +
                    '<div class="card">' +
                    '<div class="imageBackground">' +
                    // create bookmark for assets to be loaded into
                    '<img data-photo-id="' + event.featuredImage.sys.id + '">' +
                    '</div>' +
                    '<div class="content">' +
                    '<h2>' + event.name + '</h2>' +
                    '<div class="details">' +
                    '<div class="location">' + event.locationString + '</div>' +
                    '<div class="startDate">' + event.longStartDate + '</div>' +
                    '</div>' +
                    '<h3>' + event.teaser + '</h3>' +
                    '<p class="eventDetails">' + event.truncatedDetails + '</p>' +
                    '<a href="#" class="moreDetails">Learn More</a>' +
                    '</div>' +
                    '</div>';

                // sort into upcoming or past
                if (moment(event.startDate).isAfter(moment())) {
                    // move to upcoming
                    masonry.append(element).masonry('appended', element);
                } else {
                    // is past
                    pastMasonry.append(element).masonry('appended', element);
                }

                // if featured (and in the future), make a copy in featuredImages with id=event.slug
                if (event.featuredEvent && moment(event.startDate).isAfter(moment())) {
                    element = '<li data-photo-id="' + event.featuredImage.sys.id + '" class="featuredEventTop" id="'+event.slug+'">' +
                        '<div class="bg" data-photo-id="' + event.featuredImage.sys.id + '"></div>' +
                        '<div class="content">' +
                        '<h3 class="eventName">' + event.name + '</h3>' +
                        '<h4 class="date">' + event.shortStartDate + '</h4>' +
                        '<h4 class="location">' + event.locationString + '</h4>' +
                        '<p class="eventDetails">' + event.teaser + '</p>' +
                        '<a href="#" class="moreDetails">Learn More</a>' +
                        '</div>' +
                        '</li>';

                    // insert into proper spot in dom
                    if (!$('ul.featuredEvents li').length) {
                        $('ul.featuredEvents').prepend(element);
                    } else {
                        $('ul.featuredEvents ul.other').append(element);
                    }

                    // attach click event binding
                    $('#'+event.slug).click(function(e) {
                      e.preventDefault();

                      featureEvent($(this));
                    });
                }
            }

            // insert image assets in bookmarked locations
            for (i = 0; i < response.includes.Asset.length; i += 1) {
                // console.log(response.includes.Asset[i]);
                image = response.includes.Asset[i];
                id = image.sys.id;
                url = image.fields.file.url;

                var elem = $('*[data-photo-id="' + id + '"]');

                $(elem).each(function() {
                  if ($(this).hasClass('featuredEventTop')) {
                      $(this).find('div.bg').first().css('background-image', 'url(' + url + ')');
                  } else {
                      // console.log('found this img: ');
                      // console.log($(elem));
                      $(this).attr('src', url);
                  }
                });
            }

            // once images have loaded, call masonry again to align
            $('.upcomingEvents img').on('load', function() {
                masonry.masonry('layout');
                masonry.masonry('reloadItems');
            });
            $('.pastEvents img').on('load', function() {
                pastMasonry.masonry('layout');
                pastMasonry.masonry('reloadItems');
            });
        }
    };

    request.send();
}

$(function() {
    'use strict';

    getEvents();
});
