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
                ],
                [
                    'babel-plugin-jsx-pragmatic',
                    {
                        module: '/src/myPragma',
                        import: 'myPragma'
                    }
                ]
            ]
        }),
        css({
            output: function (styles, styleNodes) {
                mkdirSync('lib', { recursive: true });
                writeFileSync('lib/ol-pdf-printer.css', styles)
            }
        })
    ],
    external: [
        'ol',
        'ol/Map',
        'ol/control/Control',
        'ol/proj',
        'ol/proj/Units',
        'modal-vanilla',
        'events',
        'jspdf',
        'dom-to-image-improved'
    ]
};