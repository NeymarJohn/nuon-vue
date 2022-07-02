<template>
	<LayoutContainer>
		<PageTitle class="u-mb-48">
			<h4>My Dashboard</h4>
			<h1>Portfolio Details</h1>
		</PageTitle>
		<h2 class="u-mb-24">Account Balance</h2>
		<LayoutFlex direction="row l-chart chart">
			<LayoutFlex direction="column" class="balance-first">
				<LayoutFlex direction="column">
					<p>Total value</p>
					<h1 class="u-mb-24">${{totalValue | toFixed | numberWithCommas}}</h1>
				</LayoutFlex>
				<LayoutFlex direction="row-center-space-around l-flex--wrap">
					<div><DonutChartBalance :key="`balances-${balancesValue}-${totalValue}-${stakedBalance}`" :chart-data="[balancesValue, parseFloat(totalValue), parseFloat(stakedBalance)]" /></div>
					<div>
						<LayoutFlex direction="row-center">
							<div class="dot orange"></div>
							<p>Balance</p>
						</LayoutFlex>
						<h3>${{balancesValue | toFixed | numberWithCommas}}</h3>
					</div>
					<div>
						<LayoutFlex direction="row-center">
							<div class="dot blue"></div>
							<p>Collateral locked</p>
						</LayoutFlex>
						<h3>${{totalValue | toFixed | numberWithCommas}}</h3>
					</div>
					<div>
						<LayoutFlex direction="row-center">
							<div class="dot tourquise"></div>
							<p>Staked</p>
						</LayoutFlex>
						<h3>${{stakedBalance | toFixed | numberWithCommas}}</h3>
					</div>
				</LayoutFlex>
			</LayoutFlex>
			<div class="balance-second">
				<p>Pending Rewards</p>
				<h1>{{pendingRewards | toFixed | numberWithCommas}}<sup>HX</sup></h1>
				<h3>${{rewardsDollarValue | toFixed | numberWithCommas }}</h3>
			</div>
		</LayoutFlex>
		<h2 class="u-mb-24">My Collateral Hub</h2>
		<LayoutFlex direction="column l-chart chart">
			<LayoutFlex direction="row">
				<LayoutFlex direction="column" class="u-flex-1">
					<p>My Total Value Locked</p>
					<h1 class="u-mb-24">${{totalValue | toFixed | numberWithCommas}}</h1>
				</LayoutFlex>
				<LayoutFlex direction="column" class="u-flex-1">
					<p>My Total Minted Nuon Value</p>
					<h1 class="u-mb-24">${{totalMintedNuon | toFixed | numberWithCommas}}</h1>
				</LayoutFlex>
				<LayoutFlex direction="column" class="u-flex-1">
					<p>My Collateralization Ratio</p>
					<h1 class="u-mb-24">{{userCollateralizationRatios.ETH | toFixed | numberWithCommas}}%</h1>
				</LayoutFlex>
			</LayoutFlex>
			<LineChart
				class="u-mt-32"
				:x-axis-labels="['a', 'b', 'c']"
				:series-data="[{name: 'test1', data: [1, 2, 3]}, {name: 'test2', data: [2, 3, 4]}]"
				@mouseOverDataPoint="handleMouseOverChart"
			/>
			<TheLoader component="table">
				<TransactionTable
					v-if="!mobileView"
					size="4"
					aria=""
					:data="chubData"
					:config="configData"
					:misc="miscConfig" />
				<TransactionCard
					v-else
					:data="chubData"
					:config="configData" />
			</TheLoader>
		</LayoutFlex>
		<TransactionHistory />
	</LayoutContainer>
</template>

<script>
import { fromWei } from "~/utils/bnTools";
export default {
	name: "MyDashboard",
	data() {
		return {
			pendingRewards: 0,
			rewardsDollarValue: 0,
			tvl: 0,
			totalMintedNuonValue: 0,
			myCollateralizationRatio: 0,
			configData: [{title: "My Locked Collateral", id: "lockedCollateral"},
				{title: "My Total Locked Value", id: "lockedValue"},
				{title: "My Total Minted Nuon", id: "mintedNuon"},
				{title: "My Collateralization Ratio", id: "collateralizationRatio"},
				{title: "Collateral Current Price", id: "currentPrice"}],
			miscConfig: {hasImage: {lockedCollateral: "ETH"}},
			mobileView: false,
			collaterals: ["ETH"],
			collateralPrices: {},
			userMintedAmounts: {},
			userCollateralizationRatios: {},
			userTotalLockedCollateralAmount: {},
			nuonPrice: null
		};
	},
	head () {
		return {
			title: "My Dashboard | Nuon"
		};
	},
	computed: {
		balancesValue() {
			if (this.tokenBalances.HX && this.tokenPrices.HX && this.tokenBalances.NUON && this.tokenPrices.NUON) {
				return parseFloat((this.tokenBalances.HX * this.tokenPrices.HX + this.tokenBalances.NUON * this.tokenPrices.NUON).toFixed(2));
			} else {
				return 0;
			}
		},
		stakedBalance() {
			const stakedBalance = this.$store.state.boardroomStore.stakedBalance;
			if (stakedBalance && this.collateralPrices.ETH) {
				return fromWei(stakedBalance) * this.collateralPrices.ETH;
			} else {
				return 0;
			}
		},
		myCollateralLocked() {
			return this.userTotalLockedCollateralAmount.ETH;
		},
		totalValue() {
			if (Object.entries(this.userTotalLockedCollateralAmount).length === 0) return 0;
			return Object.entries(this.userTotalLockedCollateralAmount).reduce((acc, [collateral, amount]) => acc + this.collateralPrices[collateral] * amount, 0);
		},
		myCollateralLockedPercentage() {
			return Number(this.myCollateralLocked) / this.totalValue * 100;
		},
		totalMintedNuon() {
			return parseFloat(Object.values(this.userMintedAmounts).reduce((acc, amount) => acc + amount, 0) * this.nuonPrice).toFixed(2);
		},
		chubData() {
			const data = [];

			const obj = {
				lockedCollateral: "ETH",
				lockedValue: this.myCollateralLocked * this.collateralPrices.ETH,
				mintedNuon: this.userMintedAmounts.ETH,
				collateralizationRatio: this.userCollateralizationRatios.ETH,
				currentPrice: this.collateralPrices.ETH
			};
			data.push(obj);

			return data;
		}
	},
	mounted() {
		this.mobileView = this.isMobile();
		this.getCollateralsPrices();
		this.getUserMintedAmount();
		this.getUserCollateralizationRatio();
		this.getUserCollateralAmount();
		this.getNuonPrice();
	},
	methods: {
		handleMouseOverChart(e) {
			console.log(e);
		},
		async getCollateralsPrices() {
			for (let i = 0; i < this.collaterals.length; i++) {
				let result = 0;
				try {
					result = parseFloat(fromWei(await this.$store.getters["collateralVaultStore/getCollateralPrice"]()));
					this.$set(this.collateralPrices, this.collaterals[i], result);
				} catch (e) {
				} finally {
					this.collateralPrice = result;
				}
			}
		},
		async getUserMintedAmount() {
			for (let i = 0; i < this.collaterals.length; i++) {
				let result = 0;
				try {
					result = fromWei(await this.$store.getters["collateralVaultStore/getUserMintedAmount"](this.connectedAccount));
				} catch (e) {
				} finally {
					this.$set(this.userMintedAmounts, this.collaterals[i], result);
				}
			}
		},
		async getUserCollateralizationRatio() {
			for (let i = 0; i < this.collaterals.length; i++) {
				let result = 0;
				try {
					result = parseFloat(fromWei(await this.$store.getters["collateralVaultStore/getUserCollateralRatioInPercent"](this.connectedAccount)));
				} catch (e) {
				} finally {
					this.$set(this.userCollateralizationRatios, this.collaterals[i], result);
				}
			}
		},
		async getUserCollateralAmount() {
			for (let i = 0; i < this.collaterals.length; i++) {
				let result = 0;
				try {
					result = parseFloat(fromWei(await this.$store.getters["collateralVaultStore/getUserCollateralAmount"](this.connectedAccount)));
				} catch (e) {
				} finally {
					this.$set(this.userTotalLockedCollateralAmount, this.collaterals[i], result);
				}
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
	}
};
</script>
