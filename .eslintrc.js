module.exports = {
	root: true,
	env: {
		browser: true,
		node: true
	},
	extends: [
		"@nuxtjs/eslint-config-typescript",
		"plugin:nuxt/recommended",
		"plugin:vue/recommended",
		"prettier"
	],
	plugins: [
	],
	// add your custom rules here
	rules: {
		quotes: ["error", "double"],
		indent: ["error", "tab"],
		semi: ["error", "always"],
		"eol-last": ["error", "always"],
		"vue/multi-word-component-names": "off",
		"vue/html-indent": ["error", "tab"],
		"vue/html-quotes": ["error", "double"]
	}
};
