import babel from '@rollup/plugin-babel';
import svg from 'rollup-plugin-svg-import';
import postcss from 'rollup-plugin-postcss';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import path from 'path';

export default {
    input: 'src/ol-pdf-printer.ts',
    output: [
        {
            dir: 'lib',
            format: 'es',
            sourcemap: true
        }
    ],
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
            exclude: "node_modules/**"
        }),
        postcss({
            extensions: ['.css', '.sass', '.scss'], 
            inject: false,
            extract: path.resolve('lib/css/ol-pdf-printer.css')
        }),
    ],
    external: id => !(path.isAbsolute(id) || id.startsWith("."))
};