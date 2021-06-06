import pkg from './package.json';
import babel from '@rollup/plugin-babel';
import image from '@rollup/plugin-image';
import { mkdirSync, writeFileSync } from 'fs';
import css from 'rollup-plugin-css-only';

let globals = {
    'ol/Map': 'ol.Map',
    'ol/control/Control': 'ol.control.Control',
    'ol/proj': 'ol.proj',
    'ol/proj/Units': 'ol.proj.Units',
    'ol/events': 'ol.events',
    'ol/Observable' : 'ol.Observable',
    'ol/source/TileWMS': 'ol.source.TileWMS',
    'ol/layer/Tile': 'ol.layer.Tile',
    'modal-vanilla': 'Modal',
    'jsPDF': 'jspdf',
    'dom-to-image-improved': 'domtoimage',
    'events': 'EventEmitter'
};

module.exports = {
    input: 'tmp-lib/ol-pdf-printer.js',
    output: [
        {
            file: pkg.module,
            format: 'es',
            name: 'PdfPrinter',
            globals: globals
        }
    ],
    plugins: [
        image(),
        babel({
            presets: [
                [
                    "@babel/preset-env",
                    {
                        "targets": {
                            "esmodules": true
                        }
                    }
                ]
            ],
            babelHelpers: 'bundled',
            exclude: ["node_modules/**", "src/assets/**"],
            plugins: [
                [
                    '@babel/plugin-transform-react-jsx',
                    {
                        pragma: 'myPragma',
                        pragmaFrag: "'fragment'"
                    }
                ]
            ]
        }),
        css({
            output: function (styles, styleNodes) {
                mkdirSync('lib/css', { recursive: true });
                writeFileSync('lib/css/ol-pdf-printer.css', styles)
            }
        })
    ],
    external: [
        'ol',
        'ol/Map',
        'ol/control/Control',
        'ol/proj',
        'ol/proj/Units',
        'ol/events',
        'ol/Observable',
        'ol/source/TileWMS',
        'ol/layer/Tile',
        'modal-vanilla',
        'events',
        'jspdf',
        'dom-to-image-improved'
    ]
};