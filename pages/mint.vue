<template>
	<LayoutContainer v-if="connectedAccount">
		<LayoutHeader data-v-step="1">
			<PageTitle>
				<h1>{{ sections[currentSection ]}} NUON</h1>
			</PageTitle>
			<PriceIndicator />
		</LayoutHeader>
		<LayoutMint>
			<TheTabs margin="0" size="full" :default-selected="defaultAction" @tab-changed="handleTabChanged">
				<TheTab title="Mint">
					<CollateralMint :minimum-deposit-amount="0" :steps="steps" :callbacks="tourCallbacks" :default-collateral="selectedCollateral"/>
				</TheTab>
				<TheTab title="Redeem">
					<CollateralRedeem :default-collateral="selectedCollateral" />
				</TheTab>
			</TheTabs>
		</LayoutMint>
		<v-tour name="mintTour" :steps="steps" :callbacks="tourCallbacks"></v-tour>
	</LayoutContainer>
	<Welcome v-else/>
</template>

<script>
export default {
	name: "Mint",
	data () {
		return {
			currentSection: 0,
			sections: ["Mint", "Redeem"],
			defaultAction: 0,  // From Url 
			selectedCollateral: "WETH", // Updated from Url
			steps: [
				{
					target: "[data-v-step=\"1\"]",
					header: {
						title: "Mint and Redeem",
					},
					content: "This page is where you can deposit collateral and mint or redeem Nuon.",
					params: {
						enableScrolling: false
					}
				},
				{
					target: "[data-v-step=\"2\"]",
					header: {
						title: "Deposit Collateral",
					},
					content: "To mint Nuon, first select which asset and how much collateral you want to deposit.",
				},
				{
					target: "[data-v-step=\"3\"]",
					content: "The amount of Nuon you can mint based on your Collateral Ratio is shown here.",
				},
				{
					target: "[data-v-step=\"4\"]",
					content: "Then set your Collateral Ratio here.",
				},
				{
					target: "[data-v-step=\"5\"]",
					header: {
						title: "Advanced Collateral Ratio",
					},
					content: "You also have the option of setting a custom collateral ratio by clicking ‘Advanced’. You can set your collateral ratio with the slider, or by typing a custom amount. The minimum collateral ratio varies by asset.",
				},
			],
			tourCallbacks: {
				onSkip: () => this.setCookie("skip_mint_tour"),
				onStop: () => this.setCookie("skip_mint_tour"),
				onFinish: () => this.setCookie("skip_mint_tour"),
			},
		};
	},
	head () {
		return {
			title: "Mint | NUON",
			meta: [
				{ hid: "mint", name: "description", content: "Deposit collateral and mint Nuon flatcoins on the Nuon Protocol. Nuon is the perfect inflation hedge, appreciating with inflation rates." },
				{ hid: "og-type", property: "og:type", content: "website" },
				{ hid: "og-title", property: "og:title", content: "Mint | NUON" },
				{ hid: "og-desc", property: "og:description", content: "Deposit collateral and mint Nuon flatcoins on the Nuon Protocol. Nuon is the perfect inflation hedge, appreciating with inflation rates." },
				{ hid: "og-image", property: "og:image", content: "https://nuon.fi/assets/img/opengraph-default.jpg" },
				{ hid: "og-url", property: "og:url", content: "https://app.nuon.fi/mint" },
				{ hid: "twitter", property: "twitter:card", content: "summary_large_image" },
			]
		};
	},
	watch: {
		connectedAccount() {
			this.initialize();
		},
	},
	mounted() {
		this.mobileView = this.isMobile();
		if (!this.connectedAccount) return;
		this.initialize();
		if (!$cookies.get("skip_mint_tour")) this.$tours.mintTour.start();
		if (this.$route.query.action) {
			this.defaultAction = Number(this.$route.query.action); // set as tab index
		}
		if (this.$route.query.collateral) {
			this.selectedCollateral = this.$route.query.collateral;
		}
		this.$gtm.push({ event: "visited", name: "Mint"  });
	},
	methods: {
		async initialize() {
			this.$store.dispatch("collateralVaultStore/getAllowance", this.selectedCollateral);
			await this.$store.dispatch("collateralVaultStore/updateStatus");

		},
	}
};
</script>
