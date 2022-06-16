<template>
	<div>
		<LayoutContainer>
			<PageTitle class="u-mb-16">
				<LayoutFlex direction="row-center-space-between">
					<h4>Collateral Hub</h4>
					<TheNotification
						:class="isRiskLevel"
						:my-collateralization-ratio="userCollateralizationRatio"
						:min-collateralization-ratio="minimumCollateralizationRatio" />
				</LayoutFlex>
			</PageTitle>
			<TheTabsImage size="full-width" color="dark" margin="24" @tab-changed="tabChanged">
				<TheTab v-for="(collateral, cIdx) in collaterals" :key="cIdx" :title="collateral" />
			</TheTabsImage>
			<CollateralOverview
				:collateral-token="currentlySelectedCollateral"
				:my-total-locked-collateral="userCollateralAmount"
				:my-total-locked-collateral-dollar="totalLockedCollateralDollarValue"
				:my-total-minted-tokens="userMintedAmount"
				:my-total-minted-tokens-dollar="totalMintedTokensDollarValue"
				:my-collateralization-ratio="userCollateralizationRatio"
				:current-price="collateralPrice" />
			<CollateralEcosystemStatus
				:min-collateralization-ratio="minimumCollateralizationRatio"
				:liquidation-price="1777.70"
				:nuon-price="nuonPrice" />
			<PageTitle>
				<h2>Manage Your {{currentlySelectedCollateral}} Collateral<TooltipIcon v-tooltip="`Enter manage your ${currentlySelectedCollateral} tooltip content here.`" /></h2>
				<p>Instanly mint Nuon by depositing your collateral and redeem anytime.</p>
			</PageTitle>
			<CollateralToggle :currently-selected-collateral="currentlySelectedCollateral" />
		</LayoutContainer>
	</div>
</template>

<script>
import TooltipIcon from "@/assets/images/svg/svg-tooltip.svg";
import { fromWei } from "~/utils/bnTools";

export default {
	name: "TheCollateralHub",
	components: {
		TooltipIcon
	},
	data () {
		return {
			myCollateralizationRatio: 0,
			minimumCollateralizationRatio: 0,
			collaterals: ["ETH", "BTC", "AVAX", "USDC", "USDT"],
			currentlySelectedCollateral: "ETH",
			collateralPrice: 0,
			userMintedAmount: 0,
			nuonPrice: 0,
			userCollateralAmount: 0,
			userCollateralizationRatio: 0
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
		isCollateralModalVisible() {
			return this.$store.state.modalStore.modalVisible.collateralModal;
		},
		totalMintedTokensDollarValue() {
			return this.nuonPrice * this.userMintedAmount;
		},
		totalLockedCollateralDollarValue() {
			return this.collateralPrice * this.userCollateralAmount;
		}
	},
	watch: {
		currentlySelectedCollateral() {
			this.initialize();
		},
		connectedAccount(newValue) {
			if (newValue) this.initialize();
		}
	},
	mounted() {
		this.initialize();
	},
	methods: {
		tabChanged(e) {
			this.currentlySelectedCollateral = this.collaterals[e];
		},
		async getCollateralPrice() {
			let result = 0;
			try {
				result = parseFloat(fromWei(await this.$store.getters["collateralVaultStore/getCollateralPrice"]()));
			} catch (e) {
			} finally {
				this.collateralPrice = result;
			}
		},
		async getUserMintedAmount() {
			let result = 0;
			try {
				result = parseFloat(fromWei(await this.$store.getters["collateralVaultStore/getUserMintedAmount"](this.connectedAccount)));
			} catch (e) {
			} finally {
				this.userMintedAmount = result;
			}
		},
		async getNuonPrice() {
			let result = 0;
			try {
				result = parseFloat(fromWei(await this.$store.getters["collateralVaultStore/getNuonPrice"]()));
			} catch (e) {
			} finally {
				this.nuonPrice = result;
			}
		},
		async getUserCollateralAmount() {
			let result = 0;
			try {
				result = parseFloat(fromWei(await this.$store.getters["collateralVaultStore/getUserCollateralAmount"](this.connectedAccount)));
			} catch (e) {
			} finally {
				this.userCollateralAmount = result;
			}
		},
		async getUserCollateralizationRatio() {
			let result = 0;
			try {
				result = parseFloat(fromWei(await this.$store.getters["collateralVaultStore/getUserCollateralRatioInPercent"](this.connectedAccount)));
			} catch (e) {
			} finally {
				this.userCollateralizationRatio = result;
			}
		},
		async getMinimumCollateralizationRatio() {
			let result = 0;
			try {
				const min = await this.$store.getters["collateralVaultStore/getGlobalCR"]();
				result = (10 ** 20 / min).toFixed();
			} catch (e) {
			} finally {
				this.minimumCollateralizationRatio = result;
			}
		},
		initialize() {
			this.getCollateralPrice();
			this.getNuonPrice();
			this.getMinimumCollateralizationRatio();
			setTimeout(() => {
				if (this.connectedAccount) {
					this.getUserCollateralAmount();
					this.getUserMintedAmount();
					this.getUserCollateralizationRatio();
				}
			}, 1000);
		}
	}
};
</script>
