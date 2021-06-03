(function () {

  var layers = [
    new ol.layer.Tile({
      source: new ol.source.OSM(),
    }),
    new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url: 'http://wms.ign.gob.ar/geoserver/geodesia-demarcacion/wms',
        params: { 'LAYERS': 'nivelacion_alta_precision', 'TILED': true },
        serverType: 'geoserver'
      }),
    })
  ];

  var map = new ol.Map({
    layers: layers,
    target: 'map',
    view: new ol.View({
      projection: 'EPSG:3857',
      center: [-6503744, -4115148],
      zoom: 13
    })
  });

  var pdfPrinter = new PdfPrinter(map);

  map.addControl(pdfPrinter);

  console.log(pdfPrinter);

})();
