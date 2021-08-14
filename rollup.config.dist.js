import pkg from './package.json';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import svg from 'rollup-plugin-svg-import';
import builtins from 'rollup-plugin-node-builtins';
import { terser } from "rollup-plugin-terser";
import CleanCss from 'clean-css';
import css from 'rollup-plugin-css-only';
import { mkdirSync, writeFileSync } from 'fs';
import nodeGlobals from 'rollup-plugin-node-globals';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy';
import jsx from 'acorn-jsx';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

let globals = {
    'ol/Map': 'ol.Map',
    'ol/control/Control': 'ol.control.Control',
    'ol/proj': 'ol.proj',
    'ol/proj/Units': 'ol.proj.Units',
    'ol/events': 'ol.events',
    'ol/Observable': 'ol.Observable',
    'ol/source/TileWMS': 'ol.source.TileWMS',
    'ol/layer/Tile': 'ol.layer.Tile',
    'jspdf': 'jsPDF',
    'dom-to-image-improved': 'domtoimage',
    'modal-vanilla': 'Modal',
    'events': 'EventEmitter',
    'myPragma': 'myPragma',
    'pdfjs-dist': 'pdfjsLib'
};

export default function (commandOptions) {
    return {
        input: 'src/ol-pdf-printer.ts',
        output: [
            {
                dir: 'dist',
                format: 'umd',
                name: 'PdfPrinter',
                globals: globals,
                intro: 'var global = window;',
                sourcemap: true
            },
            !commandOptions.dev && {
                intro: 'var global = window;',
                file: pkg.browser,
                format: 'umd',
                plugins: [terser()],
                name: 'PdfPrinter',
                globals: globals,
                sourcemap: true
            }
        ],
        acornInjectPlugins: [jsx()],
        plugins: [
            del({ targets: 'dist/*' }),
            typescript(
                {
                    outDir: './dist',
                    declarationDir: './dist',
                    outputToFilesystem: true
                }
            ),
            copy({
                targets: [
                    { src: 'src/assets/css/bootstrap.min.css', dest: 'dist/css' },
                ]
            }),
            babel({
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
                ],
                plugins: [
                    "@babel/plugin-transform-runtime",
                    [
                        '@babel/plugin-transform-react-jsx',
                        {
                            pragma: 'myPragma',
                            pragmaFrag: "'null'"
                        }
                    ],
                    [
                        'babel-plugin-jsx-pragmatic',
                        {
                            module: 'myPragma',
                            import: 'myPragma'
                        }
                    ]
                ],
                babelHelpers: 'runtime',
                exclude: 'node_modules/**'
            }),
            nodeGlobals(),
            builtins(), // Events
            resolve({
                extensions: ['.mjs', '.js', '.ts', '.json', '.node', '.tsx', '.jsx']
            }),
            commonjs(),
            svg(),
            css({
                output: function (styles) {
                    mkdirSync('dist/css', { recursive: true });
                    writeFileSync('dist/css/ol-pdf-printer.css', styles);
                    if (!commandOptions.dev) {
                        const compressed = new CleanCss().minify(styles).styles;
                        writeFileSync('dist/css/ol-pdf-printer.min.css', compressed);
                    }
                }
            }),
            commandOptions.dev && serve({
                open: false,
                verbose: true,
                contentBase: ['', 'examples'],
                historyApiFallback: '/basic.html',
                host: 'localhost',
                port: 3000,
                // execute function after server has begun listening
                onListening: function (server) {
                    const address = server.address()
                    // by using a bound function, we can access options as `this`
                    const protocol = this.https ? 'https' : 'http'
                    console.log(`Server listening at ${protocol}://localhost:${address.port}/`)
                }
            }),
            commandOptions.dev && livereload({
                watch: ['src'],
                delay: 500
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
            'jspdf',
            'pdfjs-dist'
        ]
    }
}