import pkg from './package.json';
import babel from '@rollup/plugin-babel';
import json from "@rollup/plugin-json";
import image from '@rollup/plugin-image';
import { mkdirSync, writeFileSync } from 'fs';
import css from 'rollup-plugin-css-only';

let globals = {
    'ol/Map': 'ol.Map',
    'ol/control': 'ol.control',
    'ol/proj': 'ol.proj',
    'ol/color': 'ol.color'
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
        json(),
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
            exclude: ["node_modules/**", "src/assets/**"]
        }),
        css({
            output: function (styles, styleNodes) {
                mkdirSync('lib', { recursive: true });
                writeFileSync('lib/ol-pdf-printer.css', styles)
            }
        })
    ],
    external: function (id) {
        console.log('id', id);
        return /ol\//.test(id);
    }
};