(function () {

  var examplePoint = new ol.Feature({
    geometry: new ol.geom.Point([-6503744, -4115148])
  })

  examplePoint.setStyle(
    new ol.style.Style(
      {
        image: new ol.style.Icon({
          anchor: [0.32, 64],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: 'https://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png',
          size: [64, 64],
          scale: 0.5,
          crossOrigin: 'anonymous' // Important
        })
      }
    )
  )

  var layers = [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    }),
    new ol.layer.Vector({
      zIndex: 3,
      source: new ol.source.Vector({
        features: [examplePoint]
      })
    }),
    new ol.layer.Tile({
      zIndex: 2,
      source: new ol.source.TileWMS({
        url: 'http://wms.ign.gob.ar/geoserver/geodesia-demarcacion/wms',
        params: { 'LAYERS': 'nivelacion_alta_precision', 'TILED': true },
        serverType: 'geoserver',
        crossOrigin: 'anonymous' // Important
      }),
    })
  ];

  var map = new ol.Map({
    layers: layers,
    target: 'map',
    view: new ol.View({
      projection: 'EPSG:3857',
      center: [-6503744, -4115148],
      zoom: 8
    })
  });

  var options = {
    filename: 'Example export',
    language: 'en',
    paperSizes: [
      { size: [594, 420], value: 'A2' },
      { size: [420, 297], value: 'A3' },
      { size: [297, 210], value: 'A4', selected: true },
      { size: [210, 148], value: 'A5' }
    ],
    dpi: [
      { value: 72 },
      { value: 96 },
      { value: 150, selected: true },
      { value: 200 },
      { value: 300 }
    ],
    scales: [10000, 5000, 1000, 500, 250, 100, 50, 25, 10]
  }

  var pdfPrinter = new PdfPrinter(options);

  map.addControl(pdfPrinter);

  console.log(pdfPrinter);

})();
