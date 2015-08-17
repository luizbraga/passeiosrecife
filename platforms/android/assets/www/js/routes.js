var routes = [];

function Place(nome,latitude, longitude){
	this.nome = nome;
	this.latitude = latitude;
	this.longitude = longitude;
}

function Roteiro(nome, tipo, places){
	this.nome = nome;
	this.tipo = tipo;
	this.places = places;
}

/*
* Get JSON file to build objects
*/
$.getJSON('resource/rotas.json', function(data){

	$.each( data, function( key, roteiros ) {

		for (key in roteiros){
			var places = [];

			for (var i = 0; i < roteiros[key].locais.length; i++) {
				var place = new Place( roteiros[key].locais[i], 
									   roteiros[key].coordenadas[i][0],
									   roteiros[key].coordenadas[i][1]);
				places.push(place);
			};

			var roteiro = new Roteiro(  roteiros[key].nome,
										roteiros[key].tipo,
										places );
			routes.push(roteiro);

			// Load roteirosNomes array with strings
			roteirosNomes.push(roteiros[key].nome);
		}

	});
});

