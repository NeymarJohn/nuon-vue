<template>
	<div>
		<LayoutContainer>
			<LayoutFlex direction="row-center-space-between" class="u-mb-48 u-pb-32 u-bb-medium-light-grey">
				<PageTitle>
					<h4>Manage</h4>
					<h1>Manage {{sections[currentSection]}}</h1>
				</PageTitle>
				<PriceIndicator />
			</LayoutFlex>
			<TheTabs margin="24" size="govern" color="transparent" @tab-changed="tabChanged">
				<TheTab title="Nuon">
					<LayoutAction type="tabs">
						<template #left>
							<TheTabs margin="0" size="full">
								<TheTab title="Mint">
									<InputManageNuon
										user-action="Spend"
										action="Mint"
										:default-collateral="selectedCollateral" @changeCollateral="onChangeCollateral" />
								</TheTab>
								<TheTab title="Redeem">
									<InputManageNuon
										user-action="Receive"
										action="Burn"
										:default-collateral="selectedCollateral" @changeCollateral="onChangeCollateral"/>
								</TheTab>
							</TheTabs>
						</template>
						<template #right>
							<ManageSummary :collateral="selectedCollateral"/>
						</template>
					</LayoutAction>
				</TheTab>
				<TheTab title="Collateral">
					<LayoutAction type="tabs">
						<template #left>
							<TheTabs margin="0" size="full">
								<TheTab title="Deposit">
									<InputManageCollateral 
										action="Deposit" :default-collateral="selectedCollateral" @changeCollateral="onChangeCollateral" />
								</TheTab>
								<TheTab title="Withdraw">
									<InputManageCollateral action="Withdraw" :default-collateral="selectedCollateral" @changeCollateral="onChangeCollateral"/>
								</TheTab>
							</TheTabs>
						</template>
						<template #right>
							<ManageSummary :collateral="selectedCollateral" />
						</template>
					</LayoutAction>
				</TheTab>
				<TheTab title="Liquidity">
					<LayoutAction type="tabs">
						<template #left>
							<TheTabs margin="0" size="full">
								<TheTab title="Add">
									<InputManageCollateral action="Add" :default-collateral="selectedCollateral" @changeCollateral="onChangeCollateral"/>
								</TheTab>
								<TheTab title="Remove">
									<InputManageCollateral action="Remove" :default-collateral="selectedCollateral" @changeCollateral="onChangeCollateral"/>
								</TheTab>
							</TheTabs>
						</template>
						<template #right>
							<ManageSummary :collateral="selectedCollateral"/>
						</template>
					</LayoutAction>
				</TheTab>
			</TheTabs>
		</LayoutContainer>
	</div>
</template>

<script>
export default {
	name: "Manage",
	data () {
		return {
			mobileView: false,
			selectedCollateral: "WETH",
			currentSection: 0,
			sections: ["NUON", "Collateral", "Liquidity"]
			// To be implemented after mint is finished.
			// tourCallbacks: {
			// 	onSkip: () => this.setCookie("skip_collateral_hub_tour"),
			// 	onStop: () => this.setCookie("skip_collateral_hub_tour"),
			// 	onFinish: () => this.setCookie("skip_collateral_hub_tour")
			// },
		};
	},
	head () {
		return {
			title: "Collateral Hub | NUON"
		};
	},

	mounted() {
		this.initialize();
		this.mobileView = this.isMobile();
		// if (!$cookies.get("skip_collateral_hub_tour")) this.$tours.collateralHubTour.start();
	},
	methods: {
		tabChanged(e) {
			this.currentSection = e;
		},
		onChangeCollateral(collateral) {
			this.selectedCollateral = collateral.symbol;
		},
		async initialize() {
			await this.$store.dispatch("collateralVaultStore/updateStatus");
		}
	}
};
</script>
