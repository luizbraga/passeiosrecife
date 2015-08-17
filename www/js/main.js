var roteirosNomes = [];
var map = null;
var markers = [];
var infowindows = [];

$(document).ready(function(){

    $('#icon').click(function () {
        $('.search').toggleClass('expanded');
    });

    // Events for the tour buttons
    $('.btn').click(function(){

        $(this).toggleClass("active");
        // Toggle buttons
        for (i=0; i<$('.btn').length; i++) {
            if($('.btn')[i] != this){
                $('#'+$('.btn')[i].id).toggle(300);
            }
        }

        // Building modal...
        if(this.classList.contains("active")){
            // Show dialog
            $("#dialog").dialog({modal: true, 
                                 height: 500,
                                 width: 300,
                                 open: function() {
                                     $('.ui-widget-overlay').bind('click', function() {
                                         $('#dialog').dialog('close');
                                     })
                                 }
                                });

            document.getElementById('dialog').innerHTML = '';
            var list = document.createElement('ul');
            for (i = 0; i<routes.length; i++){
                if(routes[i].tipo == this.id){

                    // Create the list item:
                    var item = document.createElement('li');

                    // Set its contents:
                    $(item).append(
                        $('<a>').attr('href','#').append(
                            document.createTextNode(routes[i].nome)
                        )
                    );

                    item.addEventListener('click', getTour, false);

                    // Add it to the list:
                    list.appendChild(item);


                }
            }
            document.getElementById('dialog').appendChild(list);

        }

    });


    $( "#search-box" ).autocomplete({
        source: roteirosNomes
    });


    document.getElementById("search-box").addEventListener( "keydown", function( e ) {
        var keyCode = e.keyCode || e.which;
        if ( keyCode === 13 ) {
            // Find the route object from the search
            findTour(document.getElementById('search-box').value);
        }
    }, false);

});

function getTour(event) {
    findTour($(this).text());

    $('#dialog').dialog( "close" );
}

function findTour(name) {
    for (key in routes) {
        if (routes[key].nome == name) {
            document.getElementById("roteiro").innerHTML = routes[key].nome;
            setMarkers(routes[key]);
        } else {
            console.log("Rota não encontrada");
        }
    }
}


function setMarkers(route) {
    removeAllMarkers();
    infowindows = [];
    
    for(key in route.places) {
        console.log(key);
        markers[key] = new google.maps.Marker({
            position: new google.maps.LatLng(route.places[key].latitude, route.places[key].longitude),
            map: map,
            title: route.places[key].nome
        });

        infowindows[key] = new google.maps.InfoWindow({
            content : createInfoWindow(route.places[key])
        });

        google.maps.event.addListener(markers[key], 'click', function(innerKey) {
            return function() {
                infowindows[innerKey].open(map, markers[innerKey]);
                console.log(infowindows[innerKey]);
            }
        }(key));

    }
}

function createInfoWindow(place){

    var content = '<div>'+
        '<h4>'+place.nome+'</h4>'+
        '<div id="bodyContent" data-value='+place.nome+'>'+
        '<a onclick="openDetails()" href="#">Ver detalhes</a> '+
        '</div>'+
        '</div>'; 
    return content;

}

function openDetails(){
    var nome = document.getElementById('bodyContent').getAttribute('data-value');
    
    $("#dialog").dialog({modal: true, 
                         height: 500,
                         width: 300,
                         open: function() {
                             $('.ui-widget-overlay').bind('click', function() {
                                 $('#dialog').dialog('close');
                             })
                         }
                        });
    document.getElementById('dialog').innerHTML = nome;
}

function removeAllMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}


function initialize() {
    var mapCanvas = document.getElementById('map-canvas');
    var mapOptions = {
        center: new google.maps.LatLng(-8.062491, -34.872888),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    map = new google.maps.Map(mapCanvas,mapOptions);


}

google.maps.event.addDomListener(window, 'load', initialize);