module.exports = {
  tabWidth: 2,
  printWidth: 80,
  endOfLine: 'auto',
  arrowParens: 'avoid',
  trailingComma: 'none',
  semi: true,
  useTabs: false,
  singleQuote: true,
  bracketSpacing: true,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: [
    '^@/(.*)$',
    '^@core/(.*)$',
    '^@server/(.*)$',
    '^@ui/(.*)$',
    '^[./]'
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true
};
