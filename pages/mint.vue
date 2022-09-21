<template>
	<LayoutContainer>
		<LayoutHeader>
			<PageTitle>
				<h4>Mint</h4>
				<h1>{{ sections[currentSection ]}} NUON</h1>
			</PageTitle>
			<PriceIndicator />
		</LayoutHeader>
		<LayoutMint>
			<TheTabs margin="0" size="full" @tab-changed="handleTabChanged">
				<TheTab title="Mint">
					<CollateralMint :minimum-deposit-amount="0"  />
				</TheTab>
				<TheTab title="Redeem">
					<CollateralRedeem currently-selected-collateral="WETH"/>
				</TheTab>
			</TheTabs>
		</LayoutMint>
	</LayoutContainer>
</template>

<script>
export default {
	name: "Mint",
	data () {
		return {
			currentSection: 0,
			sections: ["Mint", "Redeem"],
		};
	},
	head () {
		return {
			title: "Mint | NUON"
		};
	},
	watch: {
		connectedAccount() {
			this.initialize();
		},
	},
	mounted() {
		this.initialize();
		this.mobileView = this.isMobile();
		// if (!$cookies.get("skip_collateral_hub_tour")) this.$tours.collateralHubTour.start();
	},
	methods: {
		async initialize() {
			await this.$store.dispatch("collateralVaultStore/updateStatus");
		}
	}
};
</script>
