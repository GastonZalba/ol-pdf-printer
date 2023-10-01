(function () {
    var features = [];

    var pointsCoords = [
        [-6721313, -4349376],
        [-6708959, -4313138],
        [-6600246, -4406203],
        [-6702371, -4500916]
    ];

    features.push(
        new ol.Feature({
            geometry: new ol.geom.Polygon([pointsCoords])
        })
    );

    for (i = 0; i < pointsCoords.length; i++) {
        var examplePoint = new ol.Feature({
            geometry: new ol.geom.Point(pointsCoords[i])
        });

        examplePoint.setStyle(
            new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.32, 64],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    src: 'https://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png',
                    size: [64, 64],
                    scale: 0.5,
                    crossOrigin: 'anonymous' // Important
                })
            })
        );

        features.push(examplePoint);
    }

    var layers = [
        new ol.layer.Tile({
            //source: new ol.source.OSM()
            source: new ol.source.OSM({
                url: 'https://mt{0-3}.google.com/vt/?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}',
                maxZoom: 19,
                attributions:
                    '&copy; ' +
                    new Date().getFullYear() +
                    ' Google Maps <a href="https://www.google.com/help/terms_maps.html" target="_blank">Terms of service</a>'
            })
        }),
        new ol.layer.Vector({
            zIndex: 4,
            source: new ol.source.Vector({
                features: features
            })
        }),
        new ol.layer.Tile({
            zIndex: 3,
            source: new ol.source.TileWMS({
                url: 'https://wms.ign.gob.ar/geoserver/geodesia-demarcacion/wms',
                params: {
                    LAYERS: 'nivelacion_alta_precision',
                    TILED: true
                },
                serverType: 'geoserver',
                attributions:
                    '<a href="https://mapa.ign.gob.ar/">Instituto Geográfico Nacional</a>',
                crossOrigin: 'anonymous' // Important
            })
        }),        
        new ol.layer.Tile({
            zIndex: 1,
            source: new ol.source.TileWMS({
                url: 'https://wms.ign.gob.ar/geoserver/geodesia-demarcacion/wms',
                params: {
                    LAYERS: 'nivelacion_precision',
                    TILED: true
                },
                serverType: 'geoserver',
                attributions:
                    '<a href="https://mapa.ign.gob.ar/">Instituto Geográfico Nacional</a>',
                crossOrigin: 'anonymous' // Important
            })
        }),
        new ol.layer.Tile({
            zIndex: 2,
            source: new ol.source.TileWMS({
                url: 'https://wms.ign.gob.ar/geoserver/geodesia-demarcacion/wms',
                params: {
                    LAYERS: 'nivelacion_topografica',
                    TILED: true
                },
                serverType: 'geoserver',
                attributions:
                    '<a href="https://mapa.ign.gob.ar/">Instituto Geográfico Nacional</a>',
                crossOrigin: 'anonymous' // Important
            })
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

    var opt_options = {
        showControlBtn: true,
        filename: 'Example export',
        language: 'en',
        units: 'imperial',
        style: {
            paperMargin: 10
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
        scales: [10000, 5000, 1000, 500, 250, 100, 50, 25, 10],
        mimeTypeExports: [
            { value: 'pdf', selected: true },
            { value: 'png' },
            { value: 'jpeg' },
            { value: 'webp' }
        ]
    };

    var pdfPrinter = new PdfPrinter(opt_options);

    map.addControl(pdfPrinter);

    var btn = document.createElement('button');
    btn.type='button';
    btn.innerText = 'TEST: createPdf()';
    btn.className = 'test';
    btn.onclick = () => pdfPrinter.createPdf();
    document.body.appendChild(btn);
})();
