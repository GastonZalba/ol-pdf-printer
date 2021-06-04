(function () {

  var features = [];

  var pointsCoords = [
    [-6721313, -4349376],
    [-6708959, -4313138],
    [-6600246, -4406203],
    [-6702371, -4500916]
  ]

  for (i = 0; i < pointsCoords.length; i++) {
    var examplePoint = new ol.Feature({
      geometry: new ol.geom.Point(pointsCoords[i])
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

    features.push(examplePoint);

  }


  var layers = [
    new ol.layer.Tile({
      source: new ol.source.OSM({
        maxZoom: 19,
        url:
          'https://mt{0-3}.google.com/vt/?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}',
        attributions:
          '&copy; ' +
          new Date().getFullYear() +
          ' Google Maps ' +
          '<a href="https://www.google.com/intl/en/help/terms_maps" target="_blank">Terms of Service</a>'
      })
    }),
    new ol.layer.Vector({
      zIndex: 3,
      source: new ol.source.Vector({
        features: features
      })
    }),
    new ol.layer.Tile({
      zIndex: 2,
      source: new ol.source.TileWMS({
        url: 'http://wms.ign.gob.ar/geoserver/geodesia-demarcacion/wms',
        params: { 'LAYERS': 'nivelacion_alta_precision,nivelacion_precision,nivelacion_topografica', 'TILED': true },
        serverType: 'geoserver',
        attributions: '<a href="https://mapa.ign.gob.ar/">Instituto Geográfico Nacional</a>',
        crossOrigin: 'anonymous' // Important
      }),
    })
  ];

  var map = new ol.Map({
    layers: layers,
    target: 'map',
    view: new ol.View({
      projection: 'EPSG:3857',
      center: [-6721313, -4349376],
      zoom: 8,
      rotation: 0.1
    })
  });

  var options = {
    filename: 'Example export',
    language: 'en',
    watermark: {
      title: 'Example Ol Pdf Printer'
    },
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
