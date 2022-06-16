<template>
	<div>
		<LayoutContainer>
			<LayoutFlex direction="row-center-space-between">
				<PageTitle class="u-mb-48">
					<h4>Collateral Hub</h4>
					<h1>Borrow NUON</h1>
				</PageTitle>
				<TheNotification
					:class="isRiskLevel"
					:my-collateralization-ratio="userCollateralizationRatio"
					:min-collateralization-ratio="minimumCollateralizationRatio" />
			</LayoutFlex>
			<TheTabsImage size="full-width" color="dark" margin="24" :user-total-collateral-amount="userTotalLockedCollateralAmount" :user-total-minted-nuon="userTotalMintedNuon" @tab-changed="tabChanged" />
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
			userCollateralizationRatio: 0,
			userTotalLockedCollateralAmountStore: {},
			userTotalMintedNuonStore: {},
			collateralPrices: {}
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
		},
		userTotalLockedCollateralAmount() {
			return Object.entries(this.userTotalLockedCollateralAmountStore).reduce((acc, [k, v]) => acc + this.collateralPrices[k] * v, 0);
		},
		userTotalMintedNuon() {
			return Object.values(this.userTotalMintedNuonStore).reduce((acc, val) => acc + val, 0);
		}
	},
	watch: {
		currentlySelectedCollateral() {
			this.initialize();
		},
		connectedAccount() {
			this.initialize();
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
				this.$set(this.collateralPrices, this.currentlySelectedCollateral, result);
			} catch (e) {
			} finally {
				this.collateralPrice = result;
			}
		},
		async getUserMintedAmount() {
			let result = 0;
			try {
				result = parseFloat(fromWei(await this.$store.getters["collateralVaultStore/getUserMintedAmount"](this.connectedAccount)));
				this.$set(this.userTotalMintedNuonStore, this.currentlySelectedCollateral, result);
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
				this.$set(this.userTotalLockedCollateralAmountStore, this.currentlySelectedCollateral, result);
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
