<template>
	<div>
		<LayoutContainer>
			<LayoutFlex direction="row-center-space-between" class="u-mb-48 u-pb-32 u-bb-medium-light-grey">
				<PageTitle>
					<h4>Mint</h4>
					<h1>{{ sections[currentSection ]}} NUON</h1>
				</PageTitle>
				<PriceIndicator />
			</LayoutFlex>
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
	</div>
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
			title: "Collateral Hub | NUON"
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
