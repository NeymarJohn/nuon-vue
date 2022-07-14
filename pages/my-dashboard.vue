<template>
	<LayoutContainer>
		<PageTitle class="u-mb-24">
			<h4>My Dashboard</h4>
		</PageTitle>
		<h2 class="u-mb-24">My Collateral Hub</h2>
		<LayoutFlex direction="column l-chart chart">
			<LayoutFlex direction="row-space-between" class="l-flex--column-md">
				<DataCard class="u-mb-md-16">
					<label>
						<TheDot color="light-green" />
						My Total Value Locked
						<TheBadge class="u-ml-8" :color="getPercentChangeBadgeClass('collateralTokens', collateralRatioArr, true)">{{ getUserTVLSign }}{{ Math.abs(getChangePercent('collateralTokens', collateralRatioArr, true)) }}%</TheBadge>
					</label>
					<ComponentLoader component="h1" :loaded="totalValue !== null">
						<h3>${{ (graphSelectionTVL || totalValue) | toFixed | numberWithCommas }}</h3>
					</ComponentLoader>
				</DataCard>
				<DataCard class="u-mb-md-16">
					<label>
						<TheDot color="lime" />
						Total Value of My Minted NUON
						<TheBadge class="u-ml-8" :color="getPercentChangeBadgeClass('mintedNuon', collateralRatioArr, true)">{{ getUserMintedNuonSign }}{{ Math.abs(getChangePercent('mintedNuon', collateralRatioArr, true)) }}%</TheBadge>
					</label>
					<ComponentLoader component="h1" :loaded="totalMintedNuon !== null">
						<h3>${{ (graphSelectionMintedNuon || totalMintedNuon) | toFixed | numberWithCommas }}</h3>
					</ComponentLoader>
				</DataCard>
				<DataCard>
					<label>My Collateralization Ratio<TooltipIcon v-tooltip="'The percentage of collateral you’ve locked to back your minted NUON. A minimum collateralization ratio is recalculated each day for each collateral asset, based on data from decentralized price oracles and an on-chain inflation oracle. The higher your collateralization ratio is above this minimum, the safer your collateral is from being liquidated.'" /></label>
					<ComponentLoader component="h1" :loaded=" userCollateralizationRatios.ETH !== null">
						<h3>{{ userCollateralizationRatios.ETH | toFixed | numberWithCommas }}%</h3>
					</ComponentLoader>
				</DataCard>
			</LayoutFlex>
			<LineChart
				:key="`${collateralRatioArr}`"
				class="u-mt-16 u-mb-48"
				:x-axis-labels="xAxisData"
				:y-axis-options="{showYAxis: false, opposite: false, labels: {formatter: (val) => {}}}"
				:series-data="yAxisData"
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
		<h2 class="u-mb-24">Account Balance</h2>
		<LayoutAccountBalance>
			<template #panel-one>
				<DataCard>
					<label>Total Value</label>
					<ComponentLoader component="h1" :loaded="totalValue !== null">
						<h3>${{ totalValue + balancesValue + stakedBalance | toFixed | numberWithCommas }}</h3>
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
					<label><TheDot color="orange" />NUON &#38; nuMINT balance<TooltipIcon v-tooltip="'Total USD value of NUON & nuMINT in wallet.'" /></label>
					<ComponentLoader component="h1" :loaded="balancesValue !== null">
						<h4>${{ balancesValue | toFixed | numberWithCommas }}</h4>
					</ComponentLoader>
				</DataCard>
			</template>
			<template #panel-four>
				<DataCard>
					<label><TheDot color="blue" /> My Locked Collateral<TooltipIcon v-tooltip="'Total USD value of assets locked as collateral for minted NUON.'" /></label>
					<ComponentLoader component="h1" :loaded="totalValue !== null">
						<h4>${{ totalValue | toFixed | numberWithCommas }}</h4>
					</ComponentLoader>
				</DataCard>
			</template>
			<template #panel-five>
				<DataCard>
					<label><TheDot color="tourquise" /> My Staked Tokens<TooltipIcon v-tooltip="'Total USD value of staked tokens.'" /></label>
					<ComponentLoader component="h1" :loaded="stakedBalance !== null">
						<h4>${{ stakedBalance | toFixed | numberWithCommas }}</h4>
					</ComponentLoader>
				</DataCard>
			</template>
			<template #panel-six>
				<DataCard>
					<label>Pending Rewards</label>
					<ComponentLoader component="h1" :loaded="pendingRewards !== null">
						<h3>{{ pendingRewards | toFixed | numberWithCommas }}<sup>nuMINT</sup></h3>
					</ComponentLoader>
					<ComponentLoader component="h5" :loaded="rewardsDollarValue !== null">
						<h5>${{ rewardsDollarValue | toFixed | numberWithCommas }}</h5>
					</ComponentLoader>
				</DataCard>
			</template>
		</LayoutAccountBalance>
		<TransactionHistory />
	</LayoutContainer>
</template>

<script>
import { fromWei } from "~/utils/bnTools";
import TooltipIcon from "@/assets/images/svg/svg-tooltip.svg";
import { getUserCollateralHistoryData } from "~/services/theGraph";

export default {
	name: "MyDashboard",
	components: {
		TooltipIcon
	},
	data() {
		return {
			tvl: 0,
			totalMintedNuonValue: 0,
			myCollateralizationRatio: 0,
			configData: [{title: "Locked Collateral", id: "lockedCollateral"},
				{title: "Today's Price", id: "currentPrice"},
				{title: "Total Value Locked", id: "lockedValue"},
				{title: "Total Minted", id: "mintedNuon"},
				{title: "Collateralization Ratio", id: "collateralizationRatio"}],
			miscConfig: {
				hasImage: {lockedCollateral: "ETH"},
				headerTooltips: {
					lockedCollateral: "All the tokens you have locked as collateral to mint NUON.",
					currentPrice: "Current price of collateral tokens, for your reference when considering how much collateral to keep locked up.",
					lockedValue: "USD value of your locked collateral.",
					mintedNuon: "Amount of Nuon minted with your collateral.",
					collateralizationRatio: "Your collateralization ratio per collateral asset."
				}
			},
			mobileView: false,
			collaterals: ["ETH"],
			collateralPrices: {},
			userMintedAmounts: {},
			userCollateralizationRatios: {},
			userTotalLockedCollateralAmount: {},
			nuonPrice: null,
			collateralRatioArr: [],
			graphSelectionTVL: "",
			graphSelectionMintedNuon: ""
		};
	},
	head () {
		return {
			title: "My Dashboard | Nuon"
		};
	},
	computed: {
		pendingRewards() {
			return this.$store.state.boardroomStore.earned;
		},
		rewardsDollarValue() {
			if (!parseFloat(this.pendingRewards)) return 0;
			return this.pendingRewards * this.tokenPrices.HX;
		},
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
				lockedValue: `$${this.numberWithCommas((this.myCollateralLocked * this.collateralPrices.ETH).toFixed(2))}`,
				mintedNuon: this.numberWithCommas(parseFloat(this.userMintedAmounts.ETH).toFixed(2)),
				collateralizationRatio: `${this.numberWithCommas(parseFloat(this.userCollateralizationRatios.ETH).toFixed(2))}%`,
				currentPrice: `$${this.numberWithCommas(parseFloat(this.collateralPrices.ETH).toFixed(2))}`
			};
			data.push(obj);

			return data;
		},
		getUserMintedNuonSign() {
			const changePercent = this.getChangePercent("mintedNuon", this.collateralRatioArr, true);
			if (parseFloat(changePercent) === 0) return "";
			return changePercent > 0 ? "+ ":"- ";
		},
		getUserTVLSign() {
			const changePercent = this.getChangePercent("collateralTokens", this.collateralRatioArr, true);
			if (parseFloat(changePercent) === 0) return "";
			return changePercent > 0 ? "+ ":"- ";
		},
		xAxisData() {
			return [...new Set(this.collateralRatioArr.map(d => new Date(d.dateTime * 1000).toLocaleDateString()).reverse())];
		},
		yAxisData() {
			// the following block groups together all the data by their day
			const aggregatedData = this.collateralRatioArr.reduce((acc, val) => {
				const day = new Date(val.dateTime * 1000).toLocaleDateString();
				const arr = acc[day];
				if (arr === undefined) acc[day] = [];
				acc[day].push(val);
				return acc;
			}, {});

			// for data on any day, we only care about the last value of the day, not the others before it.
			const lastDataOfDay = Object.entries(aggregatedData).reduce((acc, [day, values]) => {acc[day] = values.sort((a, b) => b.dateTime - a.dateTime)[0]; return acc;}, {});
			// now we need to recreate the sorted array using the xAxisData
			const reducedData = [];
			for (let i = 0; i < this.xAxisData.length; i++) {
				reducedData.push(lastDataOfDay[this.xAxisData[i]]);
			}

			return [{
				name: "My Total Value Locked",
				data: reducedData.map(d => d.collateralTokens.reduce((acc, collateralToken) => acc + parseFloat(collateralToken.value) , 0))
			}, {
				name: "My Total Minted Value",
				data: reducedData.map(d => parseFloat(d.mintedNuon))
			}];
		}
	},
	watch: {
		connectedAccount(newValue) {
			if (newValue) this.initialize();
		}
	},
	mounted() {
		this.mobileView = this.isMobile();
		this.initialize();
	},
	methods: {
		initialize() {
			this.getCollateralsPrices();
			this.getUserMintedAmount();
			this.getUserCollateralizationRatio();
			this.getUserCollateralAmount();
			this.getNuonPrice();
			this.getDiffMinted();
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
		getDiffMinted() {
			getUserCollateralHistoryData({user: this.connectedAccount}).then(res => {
				this.collateralRatioArr = res.data.data.userCollateralHistories;
			}).catch((err) => {
				this.failureToast(() => {}, err, "An error occurred");
			});
		},
		handleMouseOverChart(e) {
			let idx = e;
			if (e === -1) {
				idx = this.xAxisData.length - 1;
			}
			this.graphSelectionTVL = this.yAxisData[0].data[idx];
			this.graphSelectionMintedNuon = this.yAxisData[1].data[idx];
		}
	}
};
</script>
