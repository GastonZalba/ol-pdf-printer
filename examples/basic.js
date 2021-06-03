(function () {

  var map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    target: 'map',
    view: new ol.View({
      projection: 'EPSG:3857',
      center: [-6503744, -4115148],
      zoom: 11
    })
  });

  var pdfPrinter = new PdfPrinter(map);

  map.addControl(pdfPrinter);
  
  console.log(pdfPrinter);

})();
