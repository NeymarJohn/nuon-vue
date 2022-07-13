<template>
	<div>
		<LayoutContainer>
			<LayoutFlex direction="row-center-space-between" class="l-flex--column-start-sm u-mb-48">
				<PageTitle>
					<h4>Collateral Hub</h4>
					<h1 class="u-mb-sm-12">Borrow NUON</h1>
					<h5 v-if="mobileView" class="u-color-white u-text-decoration-underline" title="Click to view hub overview" @click="setModalVisibility('hubOverviewModal', true)">Hub Overview</h5>
				</PageTitle>
				<ComponentLoader :loaded="userCollateralizationRatio !== null && minimumCollateralizationRatio !== null" component="notification" slot-classes="u-width-auto">
					<TheNotification
						:my-collateralization-ratio="userCollateralizationRatio"
						:min-collateralization-ratio="minimumCollateralizationRatio" />
				</ComponentLoader>
			</LayoutFlex>
			<TheTabsImage
				:user-total-collateral-amount="userTotalLockedCollateralAmount" :user-total-minted-nuon="userTotalMintedNuon" @tab-changed="tabChanged" />
			<CollateralOverview
				:collateral-token="currentlySelectedCollateral"
				:my-total-locked-collateral="userCollateralAmount"
				:my-total-locked-collateral-dollar="totalLockedCollateralDollarValue"
				:my-total-minted-tokens="userMintedAmount"
				:my-total-minted-tokens-dollar="totalMintedTokensDollarValue"
				:my-collateralization-ratio="userCollateralizationRatio"
				:current-price="collateralPrice"
				:collateral-price-change="collateralPriceChange" />
			<CollateralEcosystemStatus
				:min-collateralization-ratio="minimumCollateralizationRatio"
				:liquidation-price="liquidationPrice"
				:nuon-price="nuonPrice"
				:truflation-peg="truflationPeg" />
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
			myCollateralizationRatio: null,
			minimumCollateralizationRatio: null,
			collaterals: ["ETH", "BTC", "AVAX", "USDC", "USDT"],
			currentlySelectedCollateral: "ETH",
			collateralPrice: null,
			userMintedAmount: null,
			nuonPrice: null,
			userCollateralAmount: null,
			userCollateralizationRatioStore: {},
			userTotalLockedCollateralAmountStore: {},
			userTotalMintedNuonStore: {},
			collateralPrices: {},
			collateralHistoricalPrices: {},
			mobileView: false,
			truflationPeg: 0
		};
	},
	head () {
		return {
			title: "Collateral Hub | Nuon"
		};
	},
	computed: {
		totalMintedTokensDollarValue() {
			return this.nuonPrice * this.userMintedAmount;
		},
		totalLockedCollateralDollarValue() {
			return this.collateralPrice * this.userCollateralAmount;
		},
		userTotalLockedCollateralAmount() {
			// Object.entries(this.userTotalLockedCollateralAmountStore).reduce((acc, [collateral, amount]) => acc + this.collateralPrices[collateral] * amount, 0);
			return this.collateralPrices.ETH * this.userTotalLockedCollateralAmountStore.ETH;
		},
		userTotalMintedNuon() {
			// Object.values(this.userTotalMintedNuonStore).reduce((acc, val) => acc + val, 0);
			return this.userTotalMintedNuonStore.ETH;
		},
		liquidationPrice() {
			const collateralPrice = this.collateralPrices[this.currentlySelectedCollateral];
			// const collateralAmount = this.userTotalLockedCollateralAmountStore[this.currentlySelectedCollateral];
			const collateralRatio = this.userCollateralizationRatioStore[this.currentlySelectedCollateral];
			if (collateralRatio === 0) return 0;
			return [collateralPrice, collateralRatio].includes(undefined) ? null : parseFloat(((collateralPrice) / (collateralRatio / 100)).toFixed(2));
		},
		userCollateralizationRatio() {
			const collateralRatio = this.userCollateralizationRatioStore[this.currentlySelectedCollateral];
			return collateralRatio === undefined ? null : collateralRatio;
		},
		collateralPriceChange() {
			const dataToUse = this.collateralHistoricalPrices[this.currentlySelectedCollateral];
			return [this.getChangePercent("price", dataToUse), this.getPercentChangeBadgeClass("price", dataToUse)];
		},
		userJustMinted() {
			return this.$store.state.collateralVaultStore.userJustMinted;
		}
	},
	watch: {
		currentlySelectedCollateral() {
			this.initialize();
		},
		connectedAccount() {
			this.initialize();
		},
		userJustMinted() {
			if (this.userJustMinted) this.initialize();
			this.$store.commit("collateralVaultStore/setUserJustMinted", false);
		}
	},
	mounted() {
		this.initialize();
		this.mobileView = this.isMobile();
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
				this.$set(this.collateralPrices, this.currentlySelectedCollateral, result);
				this.collateralPrice = result;
			}
		},
		async getUserMintedAmount() {
			let result = 0;
			try {
				result = parseFloat(fromWei(await this.$store.getters["collateralVaultStore/getUserMintedAmount"](this.connectedAccount)));
			} catch (e) {
			} finally {
				this.$set(this.userTotalMintedNuonStore, this.currentlySelectedCollateral, result);
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
				this.$set(this.userTotalLockedCollateralAmountStore, this.currentlySelectedCollateral, result);
				this.userCollateralAmount = result;
			}
		},
		async getUserCollateralizationRatio() {
			let result = 0;
			try {
				result = parseFloat(fromWei(await this.$store.getters["collateralVaultStore/getUserCollateralRatioInPercent"](this.connectedAccount)));
			} catch (e) {
			} finally {
				this.$set(this.userCollateralizationRatioStore, this.currentlySelectedCollateral, result);
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
		async getCollateralHistoricalPrices() {
			let result = [];
			try {
				const hydroSupplyResponse = await getTotalSupplyWithToken(HYDRO_ADDRESS);
				result = hydroSupplyResponse.data.data.totalSupplyDayDatas;
			} catch (e) {
			} finally {
				this.$set(this.collateralHistoricalPrices, this.currentlySelectedCollateral, result);
			}
		},
		async getTruflationPeg() {
			let result = 0;
			try {
				result = parseFloat(fromWei(await this.$store.getters["collateralVaultStore/getTruflationPeg"]()));
			} catch (e) {
			} finally {
				this.truflationPeg = result;
			}
		},
		initialize() {
			this.getCollateralPrice();
			this.getNuonPrice();
			this.getMinimumCollateralizationRatio();
			this.getCollateralHistoricalPrices();
			this.getTruflationPeg();
			setTimeout(() => {
				this.getUserCollateralAmount();
				this.getUserMintedAmount();
				this.getUserCollateralizationRatio();
			}, 1000);
		}
	}
};
</script>
