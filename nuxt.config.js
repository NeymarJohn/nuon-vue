import axios from "axios";

export default {
	target: "static",
	// Global page headers: https://go.nuxtjs.dev/config-head
	server: {
		host: "0.0.0.0" // default: localhost
	},
	head: {
		title: "NUON",
		htmlAttrs: {
			lang: "en"
		},
		meta: [
			{ charset: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ hid: "description", name: "description", content: "" },
			{ name: "format-detection", content: "telephone=no" },
			{ name: "msapplication-TileColor", content: "#18181a" },
			{ name: "theme-color", content: "#18181a" },
		],
		link: [
			{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
			{ rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
			{ rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
			{ rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
			{ rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#5bbad5" },
			{ rel: "manifest", href: "/site.webmanifest" }
		]
	},

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: [
		"@/assets/stylesheets/main.scss"
	],

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
		"~/plugins/helpers",
		"~/plugins/floating-vue",
		"~/plugins/vue-tour",
		"~/plugins/vue-cookies",
		"~/plugins/vue-apexcharts.client"
	],

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		// https://go.nuxtjs.dev/typescript
		"@nuxt/typescript-build",
		// https://typed-vuex.roe.dev/getting-started/getting-started-nuxt
		"nuxt-typed-vuex"
	],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
		"@nuxtjs/axios",
		"vue-social-sharing/nuxt"
	],

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {
		loaders: {
			sass: {
				implementation: require("sass")
			},
			scss: {
				implementation: require("sass")
			}
		},
		extend: (config, ctx) => {
			const svgRule = config.module.rules.find(rule => rule.test.test(".svg"));

			if (ctx.isDev) {
				config.devtool = ctx.isClient ? "source-map" : "inline-source-map";
			}
			svgRule.test = /\.(png|jpe?g|gif|webp)$/;

			config.module.rules.push({
				test: /\.svg$/,
				use: ["babel-loader", "vue-svg-loader"]
			});
		}
	},
	vue: {
		config: {
			productionTip: false,
			devtools: true
		}
	},
	env: {
		NODE_ENV: process.env.NODE_ENV
	},
	publicRuntimeConfig: {
		NODE_ENV: process.env.NODE_ENV,
		development: {
			blockExplorerUrl: "http://13.251.9.172:4000/",
			infuraId: "0b78809457cf4190a7919f375644dd9b",
			bscscanUrl: "https://bscscan.com",
			pancakeswapUrl: "https://pancakeswap.finance",
		},
		staging: {
			blockExplorerUrl: "http://13.251.9.172:4000/",
			infuraId: "0b78809457cf4190a7919f375644dd9b",
			bscscanUrl: "https://bscscan.com",
			pancakeswapUrl: "https://pancakeswap.finance",
		},
		production: {
			blockExplorerUrl: "http://13.251.9.172:4000/",
			infuraId: "0b78809457cf4190a7919f375644dd9b",
			bscscanUrl: "https://bscscan.com",
			pancakeswapUrl: "https://pancakeswap.finance",
		}
	},
	generate: {
		async routes() {
			let allProposals = null;
			let page = 0;
			let totalProposals = [];

			try {
				do {
					allProposals = await axios.post("https://hub.snapshot.org/graphql", {
						query: `
							query Proposals($numberToSkip: Int!) {
								proposals(
									first: 20000,
									skip: $numberToSkip,
									where: {
										space_in: ["calon.eth"]
									}
								) {
									id
								}
							}`,
						variables: {
							numberToSkip: page * 20000
						}
					});

					if (allProposals.status === 200) {
						totalProposals = [...totalProposals, ...allProposals.data.data.proposals.map(p => `/govern/${p.id}`)];
					}

					page += 1;
				} while (allProposals.data.data.proposals.length === 20000);

				return totalProposals;
			} catch (e) {
				console.error(e);
			}
		}
	}
};
