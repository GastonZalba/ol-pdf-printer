import svg from 'rollup-plugin-svg-import';
import postcss from 'rollup-plugin-postcss';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy';
import path from 'path';
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

export default {
    input: 'src/ol-pdf-printer.ts',
    output: [
        {
            file: 'lib/ol-pdf-printer.js',
            format: 'es',
            sourcemap: true
        }
    ],
    plugins: [
        banner2(() => banner),
        del({ targets: 'lib/*' }),
        typescript({
            outDir: './lib',
            declarationDir: './lib',
            outputToFilesystem: true,
            incremental: false                       
        }),
        svg(),
        postcss({
            include: 'src/assets/scss/-ol-pdf-printer.bootstrap5.scss',
            extensions: ['.css', '.sass', '.scss'],
            extract: path.resolve('lib/style/css/ol-pdf-printer.bootstrap5.css'),
            config: {
                path: './postcss.config.cjs',
                ctx: {
                    isDev: false
                }
            }
        }),
        postcss({
            include: 'src/assets/scss/ol-pdf-printer.scss',
            extensions: ['.css', '.sass', '.scss'], 
            inject: false,
            extract: path.resolve('lib/style/css/ol-pdf-printer.css'),
            config: {
                path: './postcss.config.cjs',
                ctx: {
                    isDev: false
                }
            }
        }),
        copy({
            targets: [
                { src: 'src/assets/scss', dest: 'lib/style' }
            ]
        })
    ],
    external: id => !(path.isAbsolute(id) || id.startsWith("."))
};