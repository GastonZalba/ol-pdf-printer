import babel from '@rollup/plugin-babel';
import svg from 'rollup-plugin-svg-import';
import { mkdirSync, writeFileSync } from 'fs';
import css from 'rollup-plugin-css-only';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy';
import jsx from 'acorn-jsx';
import resolve from '@rollup/plugin-node-resolve';
import path from 'path';

module.exports = {
    input: 'src/ol-pdf-printer.ts',
    output: [
        {
            dir: 'lib',
            format: 'es',
            sourcemap: true
        }
    ],
    acornInjectPlugins: [ jsx() ],
    plugins: [
        del({ targets: 'lib/*' }),
        typescript({
            outDir: './lib',
            declarationDir: './lib',
            outputToFilesystem: true
        }),
        copy({
            targets: [
                { src: 'src/assets/css/bootstrap.min.css', dest: 'lib/css' },
            ]
        }),
        resolve({
            extensions: ['.mjs', '.js', '.ts', '.json', '.node', '.tsx ', '.jsx']
        }),
        svg(),
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
            exclude: "node_modules/**",
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
                        module: 'myPragma',
                        import: 'myPragma'
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
    external: id => !(path.isAbsolute(id) || id.startsWith("."))
};