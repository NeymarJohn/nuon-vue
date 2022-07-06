<template>
	<LayoutContainer>
		<PageTitle class="u-mb-48">
			<h4>My Dashboard</h4>
			<h1>Portfolio Details</h1>
		</PageTitle>
		<h2 class="u-mb-24">Account Balance</h2>
		<LayoutAccountBalance>
			<template #panel-one>
				<DataCard>
					<label>Total Value</label>
					<ComponentLoader component="h1" :loaded="totalValue !== null">
						<h3>${{ totalValue | toFixed | numberWithCommas }}</h3>
					</ComponentLoader>
				</DataCard>
			</template>
			<template #panel-two>
				<DonutChartBalance
					:key="`balances-${balancesValue}-${totalValue}-${stakedBalance}`"
					:chart-data="[balancesValue, parseFloat(totalValue), parseFloat(stakedBalance)]" />
			</template>
			<template #panel-three>
				<DataCard>
					<label><TheDot color="light-green" /> My Balance</label>
					<ComponentLoader component="h1" :loaded="balancesValue !== null">
						<h4>${{ balancesValue | toFixed | numberWithCommas }}</h4>
					</ComponentLoader>
				</DataCard>
			</template>
			<template #panel-four>
				<DataCard>
					<label><TheDot color="blue" /> My Collateral Locked</label>
					<ComponentLoader component="h1" :loaded="totalValue !== null">
						<h4>${{ totalValue | toFixed | numberWithCommas }}</h4>
					</ComponentLoader>
				</DataCard>
			</template>
			<template #panel-five>
				<DataCard>
					<label><TheDot color="orange" /> My Staked</label>
					<ComponentLoader component="h1" :loaded="stakedBalance !== null">
						<h4>${{ stakedBalance | toFixed | numberWithCommas }}</h4>
					</ComponentLoader>
				</DataCard>
			</template>
			<template #panel-six>
				<DataCard>
					<label>Pending Rewards</label>
					<ComponentLoader component="h1" :loaded="pendingRewards !== null">
						<h3>{{ pendingRewards | toFixed | numberWithCommas }}<sup>HX</sup></h3>
					</ComponentLoader>
					<ComponentLoader component="h5" :loaded="rewardsDollarValue !== null">
						<h5>${{ rewardsDollarValue | toFixed | numberWithCommas }}</h5>
					</ComponentLoader>
				</DataCard>
			</template>
		</LayoutAccountBalance>
		<h2 class="u-mb-24">My Collateral Hub</h2>
		<LayoutFlex direction="column l-chart chart">
			<LayoutFlex direction="row-space-between">
				<DataCard>
					<label>
						<TheDot color="light-green" />
						My Total Value Locked
						<TheBadge class="u-ml-8" color="price-up">+ 0.03%</TheBadge>
					</label>
					<ComponentLoader component="h1" :loaded="totalValue !== null">
						<h3>${{ totalValue | toFixed | numberWithCommas }}</h3>
					</ComponentLoader>
				</DataCard>
				<DataCard>
					<label>
						<TheDot color="lime" />
						My Total Minted Value (NUON)
						<TheBadge class="u-ml-8" color="price-up">+ 0.03%</TheBadge>
					</label>
					<ComponentLoader component="h1" :loaded="totalMintedNuon !== null">
						<h3>${{ totalMintedNuon | toFixed | numberWithCommas }}</h3>
					</ComponentLoader>
				</DataCard>
				<DataCard>
					<label>My Collateralization Ratio<TooltipIcon v-tooltip="'Enter My Collateralization Ratio tooltip content here.'" /></label>
					<ComponentLoader component="h1" :loaded=" userCollateralizationRatios.ETH !== null">
						<h3>{{ userCollateralizationRatios.ETH | numberWithCommas }}%</h3>
					</ComponentLoader>
				</DataCard>
			</LayoutFlex>
			<LineChart
				class="u-mt-16 u-mb-48"
				:x-axis-labels="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']"
				:series-data="[
					{
						name: 'My Total Minted Value (NUON)',
						data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
					},
					{
						name: 'My Total Value Locked',
						data: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
					}
				]"
				@mouseOverDataPoint="handleMouseOverChart" />
			<TheLoader component="table">
				<TransactionTable
					v-if="!mobileView"
					size="5"
					class="u-p-0"
					aria="Collateral Hub transactions"
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
import TooltipIcon from "@/assets/images/svg/svg-tooltip.svg";

export default {
	name: "MyDashboard",
	components: {
		TooltipIcon
	},
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
