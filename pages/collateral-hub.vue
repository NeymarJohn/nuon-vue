<template>
	<div>
		<LayoutContainer>
			<PageTitle>
				<LayoutFlex direction="row-center-space-between">
					<h4>Collateral Hub</h4>
					<TheNotification
						:class="isRiskLevel"
						:my-collateralization-ratio="myCollateralizationRatio"
						:min-collateralization-ratio="minCollateralizationRatio" />
				</LayoutFlex>
			</PageTitle>
			<TheTabs size="thin" color="light" margin="24">
				<TheTab title="ETH">
					<CollateralOverview
						collateral-token="ETH"
						:my-total-locked-collateral="0"
						:my-total-locked-collateral-dollar="0"
						:my-total-minted-tokens="0"
						:my-total-minted-tokens-dollar="0"
						:my-collateralization-ratio="0"
						:current-price="1194.35" />
					<CollateralEcosystemStatus
						:min-collateralization-ratio="170"
						:liquidation-price="1777.70" />
					<PageTitle>
						<h2>Manage Your ETH Collateral<TooltipIcon v-tooltip="'Enter manage your ETH tooltip content here.'" /></h2>
						<p>Instanly mint Nuon by depositing your collateral and redeem anytime.</p>
					</PageTitle>
					<CollateralToggle :minted-tokens="0" />
				</TheTab>
				<TheTab title="BTC">
					<CollateralOverview
						collateral-token="BTC"
						:my-total-locked-collateral="0"
						:my-total-locked-collateral-dollar="0"
						:my-total-minted-tokens="0"
						:my-total-minted-tokens-dollar="0"
						:my-collateralization-ratio="0"
						:current-price="21948.85" />
					<CollateralEcosystemStatus
						:min-collateralization-ratio="170"
						:liquidation-price="1777.70" />
					<PageTitle>
						<h2>Manage Your BTC Collateral<TooltipIcon v-tooltip="'Enter manage your BTC tooltip content here.'" /></h2>
						<p>Instanly mint Nuon by depositing your collateral and redeem anytime.</p>
					</PageTitle>
					<CollateralToggle :minted-tokens="0" />
				</TheTab>
				<TheTab title="AVAX">
					<CollateralOverview
						collateral-token="AVAX"
						:my-total-locked-collateral="0"
						:my-total-locked-collateral-dollar="0"
						:my-total-minted-tokens="0"
						:my-total-minted-tokens-dollar="0"
						:my-collateralization-ratio="0"
						:current-price="16.52" />
					<CollateralEcosystemStatus
						:min-collateralization-ratio="170"
						:liquidation-price="1777.70" />
					<PageTitle>
						<h2>Manage Your AVAX Collateral<TooltipIcon v-tooltip="'Enter manage your AVAX tooltip content here.'" /></h2>
						<p>Instanly mint Nuon by depositing your collateral and redeem anytime.</p>
					</PageTitle>
					<CollateralToggle :minted-tokens="0" />
				</TheTab>
				<TheTab title="USDC">
					<CollateralOverview
						collateral-token="USDC"
						:my-total-locked-collateral="0"
						:my-total-locked-collateral-dollar="0"
						:my-total-minted-tokens="0"
						:my-total-minted-tokens-dollar="0"
						:my-collateralization-ratio="0"
						:current-price="1" />
					<CollateralEcosystemStatus
						:min-collateralization-ratio="170"
						:liquidation-price="1777.70" />
					<PageTitle>
						<h2>Manage Your USDC Collateral<TooltipIcon v-tooltip="'Enter manage your USDC tooltip content here.'" /></h2>
						<p>Instanly mint Nuon by depositing your collateral and redeem anytime.</p>
					</PageTitle>
					<CollateralToggle :minted-tokens="0" />
				</TheTab>
				<TheTab title="USDT">
					<CollateralOverview
						collateral-token="USDT"
						:my-total-locked-collateral="0"
						:my-total-locked-collateral-dollar="0"
						:my-total-minted-tokens="0"
						:my-total-minted-tokens-dollar="0"
						:my-collateralization-ratio="0"
						:current-price="0.9989" />
					<CollateralEcosystemStatus
						:min-collateralization-ratio="170"
						:liquidation-price="1777.70" />
					<PageTitle>
						<h2>Manage Your USDT Collateral<TooltipIcon v-tooltip="'Enter manage your USDT tooltip content here.'" /></h2>
						<p>Instanly mint Nuon by depositing your collateral and redeem anytime.</p>
					</PageTitle>
					<CollateralToggle :minted-tokens="0" />
				</TheTab>
			</TheTabs>
		</LayoutContainer>
	</div>
</template>

<script>
import TooltipIcon from "@/assets/images/svg/svg-tooltip.svg";

export default {
	name: "TheCollateralHub",
	components: {
		TooltipIcon
	},
	data () {
		return {
			myCollateralizationRatio: 0,
			minCollateralizationRatio: 170,
		};
	},
	head () {
		return {
			title: "Collateral Hub | Nuon"
		};
	},
	computed: {
		usxPrice() {
			return this.tokenPrices.USX;
		},
		// userJustMinted() {
		// 	return this.$store.state.collateralVaultStore.userJustMinted;
		// },
		isCollateralModalVisible() {
			return this.$store.state.modalStore.modalVisible.collateralModal;
		},
		// userMintedAmount() {
		// 	return parseFloat(this.$store.getters["erc20Store/usxBalance"]);
		// },
	},
	async mounted() {
		// this.getUserTVL(this.connectedAccount);
		// this.minCollateralizationRatio = (1 / parseFloat(fromWei(await this.$store.getters["collateralVaultStore/getGlobalCollateralRatio"]()))) * 100;
	},
	methods: {
		// async getUserTVL(userAddress) {
		// 	if (this.connectedAccount) {
		// 		this.userTVL = 0;
		// 		this.collateralAddresses = await this.$store.getters["collateralVaultStore/getCollaterals"]();
		// 		this.collateralAddresses.forEach(async (_, idx) => {
		// 			const userAmounts = await this.$store.getters["collateralVaultStore/getUserAmounts"](userAddress, idx);
		// 			const weiBalance = userAmounts[0];
		// 			const usdBalance = fromWei(weiBalance);
		// 			this.userTVL += parseFloat(usdBalance);
		// 		});
		// 	}
		// }
	}
};
</script>
