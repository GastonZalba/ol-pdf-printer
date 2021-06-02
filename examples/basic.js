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
  
  
    var opt_options = {
      urlProxy: 'https://api.allorigins.win/raw?url=',
      drone: 'mavic-2',
      country: 'AR',
      displayLevels: [2, 6, 1, 0, 3, 4, 7],
      activeLevels: [0, 1, 2, 3, 4, 6, 7],
      createPanel: 'full',
      language: 'en',
      startCollapsed: false,
      startActive: true,
      theme: 'light',
      i18n: {
        labels: {
          djiGeoZones: 'My Geozones'
        }
      }
    };
  
    var pdfPrinter = new PdfPrinter(map, opt_options);
  
    console.log(pdfPrinter);
  
  })();
  