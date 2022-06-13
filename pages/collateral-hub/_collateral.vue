<template>
	<div>
		<LayoutContainer>
			<LayoutFlex class="u-mb-48" direction="row-end-space-between">
				<PageTitle>
					<h4>Collateral Hub</h4>
					<LayoutFlex direction="row-center">
						<TheButton
							size="icon"
							class="u-mr-24 u-no-transition u-p-0"
							title="Click to go back"
							@click="getPreviousPage"><ChevronLeftIcon /></TheButton>
						<img src="~/assets/images/borrow/eth.png" :alt="`${collateralToken } logo`" height="48" width="48" class="u-mr-24">
						<h1>{{ collateralToken }}</h1>
					</LayoutFlex>
				</PageTitle>
				<TheNotification :class="isRiskLevel">
					<p v-if="myCollateralizationRatio > minCollateralizationRatio">Your collateralization ratio is good and at low risk of liquidation.</p>
					<p v-if="myCollateralizationRatio <= minCollateralizationRatio && myCollateralizationRatio != 0">Your collateralization ratio is low and at high risk of liquidation. Please deposit more collateral.</p>
					<p v-if="myCollateralizationRatio === 0">Hi there, please deposit your {{ collateralToken }} to mint NUON.</p>
				</TheNotification>
			</LayoutFlex>
			<LayoutInfo size="row-space-between">
				<DataCard>
					<label>My Total Locked Collateral</label>
					<TheLoader component="h1">
						<h3>{{ myTotalLockedCollateral | toFixed | numberWithCommas }}<sup>{{ collateralToken }}</sup></h3>
					</TheLoader>
					<TheLoader component="h5">
						<h5>${{ myTotalLockedCollateralDollar | toFixed | numberWithCommas }}</h5>
					</TheLoader>
				</DataCard>
				<DataCard>
					<label>My Total Minted Tokens</label>
					<TheLoader component="h1">
						<h3>{{ myTotalMintedTokens | toFixed | numberWithCommas }}<sup>NUON</sup></h3>
					</TheLoader>
					<TheLoader component="h5">
						<h5>${{ myTotalMintedTokensDollar | toFixed | numberWithCommas }}</h5>
					</TheLoader>
				</DataCard>
				<DataCard>
					<label>My Collateralization Ratio<TooltipIcon v-tooltip="'Enter my collateralization ratio tooltip content here.'" /></label>
					<TheLoader component="h1">
						<h3 :class="isRiskLevel">{{ myCollateralizationRatio | toFixed }}<sup>%</sup></h3>
					</TheLoader>
					<TheLoader component="h5">
						<TheBadge color="price-up">+ 0.03%</TheBadge>
					</TheLoader>
				</DataCard>
				<DataCard>
					<label>Current {{ collateralToken }} Price<TooltipIcon v-tooltip="'Enter current ETH price tooltip content here.'" /></label>
					<TheLoader component="h1">
						<h3>${{ currentEthPrice | toFixed | numberWithCommas }}</h3>
					</TheLoader>
					<TheLoader component="h5">
						<TheBadge color="price-down">- 4.56%</TheBadge>
					</TheLoader>
				</DataCard>
			</LayoutInfo>
		</LayoutContainer>
		<LayoutContainer class="u-pt-48">
			<h2 class="u-mb-20 u-mb-lg-14">Ecosystem Status</h2>
			<LayoutGrid class="u-mb-48" :size="'2'">
				<StatCard class="u-mb-md-12">
					<label>Min. Collateralization Ratio<TooltipIcon v-tooltip="'Enter min collateralization ratio tooltip content here.'" /></label>
					<LayoutFlex>
						<TheLoader component="h3">
							<h3>{{ minCollateralizationRatio }}%</h3>
						</TheLoader>
					</LayoutFlex>
				</StatCard>
				<StatCard>
					<label>Liquidation Price<TooltipIcon v-tooltip="'Enter liquidation price tooltip content here.'" /></label>
					<LayoutFlex>
						<TheLoader component="h3">
							<h3>${{ liquidationPrice | toFixed | numberWithCommas }}</h3>
						</TheLoader>
					</LayoutFlex>
				</StatCard>
			</LayoutGrid>
			<PageTitle>
				<h2>Manage Your {{ collateralToken }}<TooltipIcon v-tooltip="'Enter manage your ETH tooltip content here.'" /></h2>
				<p>Instanly mint Nuon by depositing your collateral and redeem anytime.</p>
			</PageTitle>
		</LayoutContainer>
		<LayoutContainer size="sm">
			<CollateralToggle :minted-tokens="0" />
		</LayoutContainer>
	</div>
</template>

<script>
import ChevronLeftIcon from "@/assets/images/svg/svg-chevron-left.svg";
import TooltipIcon from "@/assets/images/svg/svg-tooltip.svg";

export default {
	name: "TheCollateral",
	components: {
		ChevronLeftIcon,
		TooltipIcon
	},
	data () {
		return {
			collateralToken: "ETH",
			myTotalLockedCollateral: 0,
			myTotalLockedCollateralDollar: 0,
			myTotalMintedTokens: 0,
			myTotalMintedTokensDollar: 0,
			myCollateralizationRatio: 0,
			currentEthPrice: 1777.7,
			minCollateralizationRatio: 170,
			liquidationPrice: 1777.7,
			collateralAddresses: []
		};
	},
	head () {
		return {
			title: "Collateral Hub | Nuon"
		};
	},
	computed: {
		isRiskLevel() {
			return {
				low: this.myCollateralizationRatio > this.minCollateralizationRatio,
				high: this.myCollateralizationRatio <= this.minCollateralizationRatio && this.myCollateralizationRatio !== 0,
				normal: this.myCollateralizationRatio === 0
			};
		},
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
