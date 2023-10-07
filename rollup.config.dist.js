import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import svg from 'rollup-plugin-svg-import';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import postcss from 'rollup-plugin-postcss';
import path from 'path';
import banner2 from 'rollup-plugin-banner2';
import { readFileSync } from 'fs';
const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

const banner = `/*!
 * ${pkg.name} - v${pkg.version}
 * ${pkg.homepage}
 * Built: ${new Date()}
*/
`;

const globals = (id) => {
    const globals = {
        'jspdf': 'jsPDF',
        'dom-to-image-more': 'domtoimage',
        'modal-vanilla': 'Modal',
        'events': 'EventEmitter',
        'pdfjs-dist': 'pdfjsLib'
    };

    if (/ol(\\|\/)/.test(id)) {
        return id.replace(/\//g, '.').replace('.js', '');
    } else if (id in globals) {
        return globals[id];
    }

    return id;
};

export default function (commandOptions) {
    return [
        {
            input: 'src/index-umd.ts',
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
                resolve({ browser: true }),
                typescript({
                    outDir: 'dist',
                    outputToFilesystem: true,
                    declarationMap: true,
                    incremental: false                       
                }),
                nodePolyfills(), // Events
                commonjs(),
                svg(),
                postcss({
                    include: 'src/assets/scss/-ol-pdf-printer.bootstrap5.scss',
                    extensions: ['.css', '.sass', '.scss'],
                    inject: commandOptions.dev,
                    extract: commandOptions.dev
                        ? false
                        : path.resolve(
                              'dist/css/ol-pdf-printer.bootstrap5.css'
                          ),
                    config: {
                        path: './postcss.config.cjs',
                        ctx: {
                            isDev: commandOptions.dev ? true : false
                        }
                    }
                }),
                postcss({
                    include: 'src/assets/scss/ol-pdf-printer.scss',
                    extensions: ['.css', '.sass', '.scss'],
                    inject: commandOptions.dev ? true : false,
                    extract: commandOptions.dev
                        ? false
                        : path.resolve('dist/css/ol-pdf-printer.css'),
                    sourceMap: commandOptions.dev ? true : false,
                    minimize: false,
                    config: {
                        path: './postcss.config.cjs',
                        ctx: {
                            isDev: commandOptions.dev ? true : false
                        }
                    }
                }),
                commandOptions.dev &&
                    serve({
                        open: false,
                        verbose: true,
                        contentBase: ['', 'examples'],
                        historyApiFallback: '/basic.html',
                        host: 'localhost',
                        port: 3007,
                        // execute function after server has begun listening
                        onListening: function (server) {
                            const address = server.address();
                            // by using a bound function, we can access options as `this`
                            const protocol = this.https ? 'https' : 'http';
                            console.log(
                                `Server listening at ${protocol}://localhost:${address.port}/`
                            );
                        }
                    }),
                commandOptions.dev &&
                    livereload({
                        watch: ['dist'],
                        delay: 500
                    })
            ],
            external: (id) => {
                return /(?!ol\/TileState)(^ol|jspdf|pdfjs-dist(\\|\/))/.test(
                    id
                );
            }
        },
        ...(!commandOptions.dev
            ? [
                  {
                      input: path.resolve('dist/css/ol-pdf-printer.css'),
                      plugins: [
                          postcss({
                              extract: true,
                              minimize: true,
                              config: {
                                  path: './postcss.config.cjs',
                                  ctx: {
                                      isDev: commandOptions.dev ? true : false
                                  }
                              }
                          })
                      ],
                      output: {
                          file: path.resolve('dist/css/ol-pdf-printer.min.css')
                      },
                      onwarn(warning, warn) {
                          if (warning.code === 'FILE_NAME_CONFLICT') return;
                          warn(warning);
                      }
                  },
                  {
                      input: path.resolve(
                          'dist/css/ol-pdf-printer.bootstrap5.css'
                      ),
                      plugins: [
                          postcss({
                              extract: true,
                              minimize: true,
                              config: {
                                  path: './postcss.config.cjs',
                                  ctx: {
                                      isDev: commandOptions.dev ? true : false
                                  }
                              }
                          })
                      ],
                      output: {
                          file: path.resolve(
                              'dist/css/ol-pdf-printer.bootstrap5.min.css'
                          )
                      },
                      onwarn(warning, warn) {
                          if (warning.code === 'FILE_NAME_CONFLICT') return;
                          warn(warning);
                      }
                  }
              ]
            : [])
    ];
}
