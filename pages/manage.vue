<template>
	<LayoutContainer>
		<LayoutFlex direction="row-justify-end">
			<PriceIndicator />
		</LayoutFlex>
		<LayoutHeader>
			<PageTitle data-v-step="1">
				<h1>Manage {{sections[currentSection]}}</h1>
			</PageTitle>
		</LayoutHeader>
		<TheTabs margin="48 tabs__header-parent" size="govern" color="transparent" @tab-changed="handleTabChanged">
			<TheTab title="Nuon">
				<LayoutAction type="tabs" class="u-mb-48">
					<template #left>
						<TheTabs margin="0" size="full">
							<TheTab title="Mint">
								<InputManageNuon
									action="Mint"
									:default-collateral="selectedCollateral"
									@changeCollateral="onChangeCollateral" />
							</TheTab>
							<TheTab title="Burn">
								<InputManageNuon
									action="Burn"
									:default-collateral="selectedCollateral"
									@changeCollateral="onChangeCollateral" />
							</TheTab>
						</TheTabs>
					</template>
					<template #right>
						<ManageSummary :collateral="selectedCollateral" data-v-step="2" />
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
		<v-tour name="manageTour" :steps="steps" :callbacks="tourCallbacks"></v-tour>
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
			sections: ["NUON", "Collateral", "Liquidity"],
			steps: [
				{
					target: "[data-v-step=\"1\"]",
					header: {
						title: "Mint and Burn Nuon",
					},
					content: "You can conveniently manage your position on this screen without adding more collateral. Choose whether you want to mint more Nuon using the collateral you already have locked, or burn a portion of the Nuon you have minted.",
					params: {
						enableScrolling: false,
					}
				},
				{
					target: "[data-v-step=\"2\"]",
					content: "Before clicking ‘Mint’, you can check the projected changes to your position, which will be highlighted in green. A transaction summary will also appear to the left.",
				},
			],
			tourCallbacks: {
				onSkip: () => this.setCookie("skip_manage_tour"),
				onStop: () => this.setCookie("skip_manage_tour"),
				onFinish: () => this.setCookie("skip_manage_tour")
			},
		};
	},
	head () {
		return {
			title: "Manage | NUON",
			meta: [
				{ hid: "manage", name: "description", content: "Manage collateral, Nuon flatcoins and liquidity pools on the Nuon Protocol to generate inflation-shielded yields." },
				{ hid: "og-type", property: "og:type", content: "website" },
				{ hid: "og-title", property: "og:title", content: "Manage | NUON" },
				{ hid: "og-desc", property: "og:description", content: "Manage collateral, Nuon flatcoins and liquidity pools on the Nuon Protocol to generate inflation-shielded yields." },
				{ hid: "og-image", property: "og:image", content: "https://nuon.fi/assets/img/opengraph-default.jpg" },
				{ hid: "og-url", property: "og:url", content: "https://app.nuon.fi/manage" },
				{ hid: "twitter", property: "twitter:card", content: "summary_large_image" },
			]
		};
	},
	mounted() {
		this.initialize();
		this.mobileView = this.isMobile();
		if (!$cookies.get("skip_manage_tour")) this.$tours.manageTour.start();
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
