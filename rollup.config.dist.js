import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import svg from 'rollup-plugin-svg-import';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import css from 'rollup-plugin-css-only';
import CleanCss from 'clean-css';
import { mkdirSync, writeFileSync } from 'fs';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import banner2 from 'rollup-plugin-banner2'
import { readFileSync } from 'fs';
const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

const banner =
`/*!
 * ${pkg.name} - v${pkg.version}
 * ${pkg.homepage}
 * Built: ${new Date()}
*/
`;

const globals = (id) => {
    const globals = {
        'jspdf': 'jsPDF',
        'dom-to-image-improved': 'domtoimage',
        'modal-vanilla': 'Modal',
        'events': 'EventEmitter',
        'myPragma': 'myPragma',
        'pdfjs-dist': 'pdfjsLib'
    }

    if (/ol(\\|\/)/.test(id)) {
        return id.replace(/\//g, '.').replace('.js', '');
    } else if (id in globals) {
        return globals[id];
    }

    return id;
}

export default function (commandOptions) {
    return {
        input: 'src/ol-pdf-printer.ts',
        output: [
            {
                file: 'dist/ol-pdf-printer.js',
                format: 'umd',
                name: 'PdfPrinter',
                globals: globals,
                intro: 'var global = window;',
                sourcemap: true
            },
            !commandOptions.dev && {
                intro: 'var global = window;',
                file: 'dist/ol-pdf-printer.min.js',
                format: 'umd',
                plugins: [terser()],
                name: 'PdfPrinter',
                globals: globals,
                sourcemap: true
            }
        ],
        plugins: [
            banner2(() => banner),
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
            nodePolyfills(), // Events
            resolve({
                extensions: ['.mjs', '.js', '.ts', '.json', '.node', '.tsx', '.jsx']
            }),
            commonjs(),
            svg(),
            commandOptions.dev && postcss({
                extensions: ['.css', '.sass', '.scss'],
                inject: true,
                extract: false
            }),
            !commandOptions.dev && css({
                output: function (styles) {
                    mkdirSync('dist/css', { recursive: true });
                    writeFileSync('dist/css/ol-pdf-printer.css', styles);
                    const compressed = new CleanCss().minify(styles).styles;
                    writeFileSync('dist/css/ol-pdf-printer.min.css', compressed);
                }
            }),
            commandOptions.dev && serve({
                open: false,
                verbose: true,
                contentBase: ['', 'examples'],
                historyApiFallback: '/basic.html',
                host: 'localhost',
                port: 3007,
                // execute function after server has begun listening
                onListening: function (server) {
                    const address = server.address()
                    // by using a bound function, we can access options as `this`
                    const protocol = this.https ? 'https' : 'http'
                    console.log(`Server listening at ${protocol}://localhost:${address.port}/`)
                }
            }),
            commandOptions.dev && livereload({
                watch: ['dist'],
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