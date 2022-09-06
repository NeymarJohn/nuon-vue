<template>
	<div>
		<LayoutContainer>
			<LayoutFlex direction="row-center-space-between" class="u-mb-48 u-pb-32 u-bb-medium-light-grey">
				<PageTitle>
					<h4>Manage</h4>
					<h1>Manage NUON</h1>
				</PageTitle>
				<PriceIndicator />
			</LayoutFlex>
			<TheTabs margin="24" size="govern" color="transparent">
				<TheTab title="Nuon">
					<LayoutAction type="tabs">
						<template #left>
							<TheTabs margin="0" size="full">
								<TheTab title="Mint">
									<InputManageNuon action="Mint"/>
								</TheTab>
								<TheTab title="Burn">
									<InputManageNuon action="Burn"/>
								</TheTab>
							</TheTabs>
						</template>
						<template #right>
							<ManageSummary />
						</template>
					</LayoutAction>
				</TheTab>
				<TheTab title="Collateral">
					<LayoutAction type="tabs">
						<template #left>
							<TheTabs margin="0" size="full">
								<TheTab title="Deposite">
									<InputManageCollateral action="deposite" currrent-tab="collateral"/>
								</TheTab>
								<TheTab title="Withdraw">
									<InputManageCollateral action="withdraw" currrent-tab="collateral"/>
								</TheTab>
							</TheTabs>
						</template>
						<template #right>
							<ManageSummary />
						</template>
					</LayoutAction>
				</TheTab>
				<TheTab title="Liquidity">
					<LayoutAction type="tabs">
						<template #left>
							<TheTabs margin="0" size="full">
								<TheTab title="Add">
									<InputManageCollateral action="add" currrent-tab="liquidity"/>
								</TheTab>
								<TheTab title="Remove">
									<InputManageCollateral action="remove" currrent-tab="liquidity"/>
								</TheTab>
							</TheTabs>
						</template>
						<template #right>
							<ManageSummary />
						</template>
					</LayoutAction>
				</TheTab>
			</TheTabs>
		</LayoutContainer>
	</div>
</template>

<script>
import { fromWei, toWei } from "~/utils/bnTools";

export default {
	name: "Manage",
	data () {
		return {
			myCollateralizationRatio: null,
			minimumCollateralizationRatio: null,
			currentlySelectedCollateral: "WETH",
			nuonPrice: null,
			userCollateralizationRatioStore: {},
			userTotalLockedCollateralAmountStore: {},
			userTotalMintedNuonStore: {},
			collateralHistoricalPrices: {},
			mobileView: false,
			truflationPeg: 0,
			minimumDepositAmount: 0,
			// To be implemented after mint is finished.
			// tourCallbacks: {
			// 	onSkip: () => this.setCookie("skip_collateral_hub_tour"),
			// 	onStop: () => this.setCookie("skip_collateral_hub_tour"),
			// 	onFinish: () => this.setCookie("skip_collateral_hub_tour")
			// },
			userLiquidityCoverage: null,
			userLpValue: "0",
			adjustModalPositionTitle: "",
			adjustModalPositionSubtitle: ""
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
			const targetPeg = this.$store.state.collateralVaultStore.targetPeg;
			const mintedNuon = this.userMintedAmount;
			if (!this.userCollateralAmount) return 0;
			if ([targetPeg, mintedNuon, this.minimumCollateralizationRatio].some(v => v === null || v === undefined)) return 0;
			const minimumCollateralRatio = Math.floor(this.minimumCollateralizationRatio) + 10;
			const nounMinBacking = targetPeg * minimumCollateralRatio / 100;
			return nounMinBacking * mintedNuon / this.userCollateralAmount;
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
			return ["WETH", "USDT"];
		},
		isMintModalVisible() {
			return this.$store.state.modalStore.modalVisible.mintModal;
		},
		isRedeemModalVisible() {
			return this.$store.state.modalStore.modalVisible.redeemModal;
		},
		isAdjustPositionModalVisible() {
			return this.$store.state.modalStore.modalVisible.adjustPositionModal;
		},
		isDisabled() {
			return this.userMintedAmount === 0;
		},
		decimals() {
			return this.$store.state.erc20Store.decimals[this.currentlySelectedCollateral];
		},
		userCollateralAmount() {
			return Number(this.$store.state.collateralVaultStore.lockedAmount[this.currentlySelectedCollateral] || 0);
		},
		userMintedAmount() {
			return Number(this.$store.state.collateralVaultStore.mintedAmount[this.currentlySelectedCollateral] || 0);
		},
		collateralPrices() {
			return this.$store.state.collateralVaultStore.collateralPrices;
		},
		collateralPrice() {
			return this.collateralPrices[this.currentlySelectedCollateral];
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
		// if (!$cookies.get("skip_collateral_hub_tour")) this.$tours.collateralHubTour.start();
	},
	methods: {
		tabChanged(e) {
			this.currentlySelectedCollateral = e.selectedValue;
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
				const chubAddress = this.$store.getters["addressStore/collateralHubs"][this.$store.state.collateralVaultStore.currentCollateralToken];
				const min = await this.$store.getters["collateralVaultStore/getGlobalCR"](chubAddress);
				result = parseFloat(fromWei(min)).toFixed(0);
			} catch (e) {
			} finally {
				this.minimumCollateralizationRatio = result;
			}
		},
		async getCollateralHistoricalPrices() {
			let result = [];
			try {
				const collateralAddress = this.$store.getters["addressStore/tokens"][this.currentlySelectedCollateral];
				const collateralSupplyResponse = await getTokenData(collateralAddress);
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
		async getMinimumDepositAmount() {
			let result = 0;
			try {
				result = await this.$store.getters["collateralVaultStore/getMinimumDepositAmount"]() / (10 ** this.decimals);
			} catch (e) {
			} finally {
				this.minimumDepositAmount = result;
			}
		},
		async getUserLiquidityCoverage() {
			let result = "0";
			try {
				result = parseFloat(fromWei(await this.$store.getters["collateralVaultStore/getUserLiquidityCoverage"](toWei(0), this.connectedAccount))).toFixed(0);
			} catch (e) {
			} finally {
				this.userLiquidityCoverage = result;
			}
		},
		async getLPValueOfUser() {
			let result = "0";
			try {
				result = fromWei(await this.$store.getters["collateralVaultStore/getLPValueOfUser"](this.connectedAccount), this.$store.state.erc20Store.decimals[this.currentlySelectedCollateral]);
			} catch (e) {
			} finally {
				this.userLpValue = (result * this.collateralPrice).toFixed(2);
			}
		},
		setAdjustPositionModalTitle(obj) {
			this.adjustModalPositionTitle = obj.title;
			this.adjustModalPositionSubtitle = obj.subtitle;
		},
		async initialize() {
			await this.$store.dispatch("collateralVaultStore/changeCollateral", this.currentlySelectedCollateral);
			await this.$store.dispatch("collateralVaultStore/updateStatus");
			this.getNuonPrice();
			this.getMinimumCollateralizationRatio();
			this.getMinimumDepositAmount();
			this.getCollateralHistoricalPrices();
			this.getTruflationPeg();
			setTimeout(() => {
				this.getUserCollateralizationRatio();
				this.getUserLiquidityCoverage();
				this.getLPValueOfUser();
			}, 1000);
		}
	}
};
</script>
