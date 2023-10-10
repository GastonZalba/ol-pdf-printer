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
            constrainResolution: true,
            zoom: 8,
            rotation: 0.1
        })
    });

    var opt_options = {
        showControlBtn: true,
        filename: 'Example export',
        allowReframeRegionOfInterest: true,
        zoomControlOnReframe: true,
        rotationControlOnReframe: true,
        language: 'en',
        units: 'metric',
        watermark: {
            logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL8AAAD+CAYAAABr7tTPAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGvmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIzLTEwLTA5VDE2OjQzOjI1LTAzOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMy0xMC0wOVQxODowNzo1Mi0wMzowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMy0xMC0wOVQxODowNzo1Mi0wMzowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxOTY4YTJjNi05OTNiLTc1NGMtYmVkNC01N2U4NzgxNjIxOTEiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo3NDcxZTQ1Yi0wZDE1LWRiNDEtOGRkOC04ZDUyNWRhMGFiZDgiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2ZTFmNjRlZS04YmUxLWRmNDUtYThjNC05MjlmYTE4MjE4YWEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjZlMWY2NGVlLThiZTEtZGY0NS1hOGM0LTkyOWZhMTgyMThhYSIgc3RFdnQ6d2hlbj0iMjAyMy0xMC0wOVQxNjo0MzoyNS0wMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo2YzRiNGZmMi02NzZlLTU4NDItYTg1NC1kMmM3ZmEwNWM3MjAiIHN0RXZ0OndoZW49IjIwMjMtMTAtMDlUMTg6MDc6NTItMDM6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MTk2OGEyYzYtOTkzYi03NTRjLWJlZDQtNTdlODc4MTYyMTkxIiBzdEV2dDp3aGVuPSIyMDIzLTEwLTA5VDE4OjA3OjUyLTAzOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+eb7v3QAACwVJREFU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",
            title: 'Ol Pdf Printer', 
            subtitle: 'https://github.com/GastonZalba/ol-pdf-printer'
        },
        style: {
            paperMargin: {
                left: 4,
                top: 4,
                right: 4,
                bottom: 4
            },
            url: {
                brcolor: '#000000',
                bkcolor: '#ffffff',
                txcolor: '#0077cc'
            },
            specs: {
                brcolor: '#000000',
                bkcolor: '#ffffff',
                txcolor: '#000000'
            },
            scalebar: {
                brcolor: '#000000',
                bkcolor: '#ffffff',
                txcolor: '#000000'
            },
            attributions: {
                brcolor: '#ffffff',
                bkcolor: '#ffffff',
                txcolor: '#666666',
                txcolorlink: '#0077cc'
            },
            legends: {
                brcolor: '#000000',
                bkcolor: '#ffffff',
                txcolor: '#000000'
            },
            description: {
                brcolor: '#333333',
                bkcolor: '#333333',
                txcolor: '#ffffff'
            },
            compass: {
                brcolor: '#000000',
                bkcolor: '#333333'
            }
        },
        paperSizes: [
            { size: [594, 420], value: 'A2' },
            { size: [420, 297], value: 'A3' },
            { size: [297, 210], value: 'A4', selected: true },
            { size: [210, 148], value: 'A5' }
        ],
        dpi: [
            { value: 96 },
            { value: 150, selected: true },
            { value: 200 },
            { value: 300 }
        ],
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
