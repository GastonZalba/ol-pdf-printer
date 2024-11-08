import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import typescriptEslintParser from '@typescript-eslint/parser';

export default [
    {
        files: ['**/*.js', '**/*.ts'],
        ignores: ['/node_modules/', 'src/myPragma.js', 'src/assets/'],
        languageOptions: {
            parser: typescriptEslintParser,
            globals: {
                ol: 'readonly',
                document: 'writable',
                StreetView: 'readonly'
            }
        },
        plugins: {
            '@typescript-eslint': typescriptEslintPlugin
        },
        rules: {
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^[A-Z]|^myPragma$'
                }
            ]
        }
    }
];
