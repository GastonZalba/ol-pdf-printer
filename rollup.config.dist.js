import pkg from './package.json';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from "@rollup/plugin-json";
import image from '@rollup/plugin-image';
import { terser } from "rollup-plugin-terser";
import CleanCss from 'clean-css';
import css from 'rollup-plugin-css-only';
import { mkdirSync, writeFileSync } from 'fs';

let globals = {
    'ol/Map': 'ol.Map',
    'ol/control': 'ol.control',
    'ol/proj': 'ol.proj',
    'ol/color': 'ol.color'
};

module.exports = {
    input: 'tmp-dist/ol-pdf-printer.js',
    output: [
        {
            file: pkg.main,
            format: 'umd',
            name: 'PdfPrinter',
            globals: globals
        },
        {
            file: pkg.browser,
            format: 'umd',
            plugins: [terser()],
            name: 'PdfPrinter',
            globals: globals
        }
    ],
    plugins: [
        json(),
        resolve(),
        commonjs(),
        babel({
            babelrc: false,
            plugins: ["@babel/plugin-transform-runtime"],
            babelHelpers: 'runtime',
            exclude: 'node_modules/**',
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: {
                            browsers: [
                                "Chrome >= 52",
                                "FireFox >= 44",
                                "Safari >= 7",
                                "Explorer 11",
                                "last 4 Edge versions"
                            ]
                        }
                    }
                ]
            ]
        }),
        image(),
        css({
            output: function (styles, styleNodes) {
                mkdirSync('dist', { recursive: true });
                writeFileSync('dist/ol-pdf-printer.css', styles)
                const compressed = new CleanCss().minify(styles).styles;
                writeFileSync('dist/ol-pdf-printer.min.css', compressed)
            }
        })
    ],
    external: function (id) {
        console.log('id', id);
        return /ol\//.test(id);
    }
};