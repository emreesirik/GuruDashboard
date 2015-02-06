/**
 * Created by emre on 5.2.2015.
 */
InfoGraphic = function() {
    this.retrieveValues();
};

InfoGraphic.prototype.retrieveValues = function() {
    $.getJSON( "data/infographic.json", function( data ) {
        $("#plantValue")[0].innerHTML = data.plant;
        $("#energyValue")[0].innerHTML = data.energy;
        $("#meltingValue")[0].innerHTML = data.melting;
        $("#radioactiveValue")[0].innerHTML = data.matter;
        $("#diseaseValue")[0].innerHTML = data.disease;

    });
};

new InfoGraphic();