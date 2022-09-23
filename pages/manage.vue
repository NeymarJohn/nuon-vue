<template>
	<LayoutContainer>
		<LayoutFlex direction="row-justify-end">
			<PriceIndicator />
		</LayoutFlex>
		<LayoutHeader>
			<PageTitle>
				<h4>Manage</h4>
				<h1>Manage {{sections[currentSection]}}</h1>
			</PageTitle>
		</LayoutHeader>
		<TheTabs margin="48 tabs__header-parent" size="govern" color="transparent" @tab-changed="handleTabChanged">
			<TheTab title="Nuon">
				<LayoutAction type="tabs" class="u-mb-48">
					<template #left>
						<TheTabs margin="0" size="full">
							<TheTab title="Mint">
								<InputManageCollateral
									action="Mint"
									:default-collateral="selectedCollateral"
									@changeCollateral="onChangeCollateral" />
							</TheTab>
							<TheTab title="Burn">
								<InputManageCollateral
									action="Burn"
									:default-collateral="selectedCollateral"
									@changeCollateral="onChangeCollateral" />
							</TheTab>
						</TheTabs>
					</template>
					<template #right>
						<ManageSummary :collateral="selectedCollateral" />
					</template>
				</LayoutAction>
			</TheTab>
			<TheTab title="Collateral">
				<LayoutAction type="tabs" class="u-mb-48">
					<template #left>
						<TheTabs margin="0" size="full">
							<TheTab title="Deposit">
								<InputManageCollateral
									action="Deposit"
									:default-collateral="selectedCollateral"
									@changeCollateral="onChangeCollateral" />
							</TheTab>
							<TheTab title="Withdraw">
								<InputManageCollateral
									action="Withdraw"
									:default-collateral="selectedCollateral"
									@changeCollateral="onChangeCollateral" />
							</TheTab>
						</TheTabs>
					</template>
					<template #right>
						<ManageSummary :collateral="selectedCollateral" />
					</template>
				</LayoutAction>
			</TheTab>
			<TheTab title="Liquidity">
				<LayoutAction type="tabs" class="u-mb-48">
					<template #left>
						<TheTabs margin="0" size="full">
							<TheTab title="Add">
								<InputManageCollateral
									action="Add"
									:default-collateral="selectedCollateral"
									@changeCollateral="onChangeCollateral" />
							</TheTab>
							<TheTab title="Remove">
								<InputManageCollateral
									action="Remove"
									:default-collateral="selectedCollateral"
									@changeCollateral="onChangeCollateral" />
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
			title: "Manage | NUON",
			meta: [
				{ hid: "manage", name: "description", content: "NUON Manage" },
				{ hid: "og-type", property: "og:type", content: "website" },
				{ hid: "og-title", property: "og:title", content: "Manage | NUON" },
				{ hid: "og-desc", property: "og:description", content: "NUON Manage" },
				{ hid: "og-image", property: "og:image", content: "https://nuon.fi/assets/img/opengraph-default.jpg" },
				{ hid: "og-url", property: "og:url", content: "https://app.nuon.fi/manage" },
				{ hid: "twitter", property: "twitter:card", content: "summary_large_image" },
			]
		};
	},
	mounted() {
		this.initialize();
		this.mobileView = this.isMobile();
		// if (!$cookies.get("skip_collateral_hub_tour")) this.$tours.collateralHubTour.start();
	},
	methods: {
		onChangeCollateral(collateral) {
			this.selectedCollateral = collateral.symbol;
		},
		async initialize() {
			await this.$store.dispatch("collateralVaultStore/updateStatus");
		}
	}
};
</script>
