/** @typedef  {import("prettier").Config} PrettierConfig */

/** @type { PrettierConfig | import("@ianvs/prettier-plugin-sort-imports").PluginConfig} } */
const config = {
	arrowParens: 'always',
	printWidth: 80,
	singleQuote: true,
	semi: false,
	trailingComma: 'all',
	useTabs: true,
	tabWidth: 2,
	plugins: [
		'@ianvs/prettier-plugin-sort-imports',
		'prettier-plugin-tailwindcss',
	],
	// Last version that doesn't squash type and value imports
	importOrderTypeScriptVersion: '4.4.0',
	importOrder: [
		'^(react/(.*)$)|^(react$)',
		'^(next/(.*)$)|^(next$)',
		'<THIRD_PARTY_MODULES>',
		'',
		'^@coursebuilder/(.*)$',
		'^coursebuilder/(.*)$',
		'',
		'^~/(.*)$',
		'^[./]',
	],
	proseWrap: 'always', // printWidth line breaks in md/mdx
}

module.exports = config
