<template>
	<div>
		<LayoutContainer>
			<LayoutFlex direction="row-center-space-between" class="l-flex--column-start-sm u-mb-48">
				<PageTitle>
					<h4>Collateral Hub</h4>
					<h1 class="u-mb-sm-12">Borrow NUON</h1>
					<h5 v-if="mobileView" class="u-color-white u-text-decoration-underline" title="Click to view hub overview" @click="setModalVisibility('hubOverviewModal', true)">Hub Overview</h5>
				</PageTitle>
				<LayoutFlex direction="row">
					<TheButton
						size="chub"
						title="Click to mint"
						class="u-mr-24"
						@click="setModalVisibility('mintModal', true)">Mint</TheButton>
					<TheButton
						size="chub"
						title="Click to redeem"
						:disabled="isDisabled"
						@click="setModalVisibility('redeemModal', true)">Redeem</TheButton>
				</LayoutFlex>
			</LayoutFlex>
			<TheTabsImage
				:user-total-collateral-amount="userTotalLockedCollateralAmount" :user-total-minted-nuon="userTotalMintedNuon" @tab-changed="tabChanged" />
			<ComponentLoader :loaded="userCollateralizationRatio !== null && minimumCollateralizationRatio !== null" component="notification" class="u-width-auto u-mb-12">
				<TheNotification
					:my-collateralization-ratio="userCollateralizationRatio" />
			</ComponentLoader>
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
		</LayoutContainer>
		<TheModal
			v-show="isMintModalVisible"
			title="Mint"
			subtitle="Mint subtitle"
			@close-modal="setModalVisibility('mintModal', false)">
			<CollateralMint :currently-selected-collateral="currentlySelectedCollateral" />
		</TheModal>
		<TheModal
			v-show="isRedeemModalVisible"
			title="Redeem"
			subtitle="Redeem subtitle"
			@close-modal="setModalVisibility('redeemModal', false)">
			<CollateralRedeem :currently-selected-collateral="currentlySelectedCollateral" />
		</TheModal>
	</div>
</template>

<script>
import { fromWei } from "~/utils/bnTools";
import { getTotalSupplyWithToken} from "~/services/theGraph";

export default {
	name: "TheCollateralHub",
	data () {
		return {
			myCollateralizationRatio: null,
			minimumCollateralizationRatio: null,
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
			title: "Collateral Hub | NUON"
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
			return this.validCollaterals.reduce((sum, collateral) => sum + (this.collateralPrices[collateral] * this.userTotalLockedCollateralAmountStore[collateral]), 0);
		},
		userTotalMintedNuon() {
			return Object.values(this.userTotalMintedNuonStore).reduce((sum, value) => sum + value, 0);
		},
		liquidationPrice() {
			const collateralPrice = this.collateralPrices[this.currentlySelectedCollateral];
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
		},
		validCollaterals() {
			const collaterals = ["ETH"];
			if (this.isEnvDev) collaterals.push("USDC");
			return collaterals;
		},
		isMintModalVisible() {
			return this.$store.state.modalStore.modalVisible.mintModal;
		},
		isRedeemModalVisible() {
			return this.$store.state.modalStore.modalVisible.redeemModal;
		},
		isDisabled() {
			return this.userMintedAmount === 0;
		},
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
			this.currentlySelectedCollateral = e.selectedValue;
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
				const decimals = this.$store.state.erc20Store.decimals[this.currentlySelectedCollateral];
				const amount = await this.$store.getters["collateralVaultStore/getUserCollateralAmount"](this.connectedAccount);
				result = parseFloat(fromWei(amount, decimals));
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
				const collateralAddress = this.$store.getters["addressStore/tokens"][this.currentlySelectedCollateral];
				const collateralSupplyResponse = await getTotalSupplyWithToken(collateralAddress);
				result = collateralSupplyResponse.data.data.totalSupplyDayDatas;
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
		async initialize() {
			await this.$store.dispatch("collateralVaultStore/changeCollateral", this.currentlySelectedCollateral);
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
