<template>
	<LayoutContainer>
		<PageTitle class="u-mb-48" data-v-step="1">
			<h4>Dashboard</h4>
			<h1>My Portfolio</h1>
		</PageTitle>
		<h3 class="u-mb-24">Account Balance</h3>
		<div class="l-balance">
			<div v-if="xAxisData.length" class="l-balance__chart">
				<LayoutFlex direction="row-space-between" class="l-flex--column-md">
					<span>{{graphSelectionDuraton}}</span>
					<TheTabs size="thin" color="light" margin="24" @tab-changed="handleTabChanged">
						<TheTab v-for="(period, periodIdx) in periods" :key="periodIdx" :title="period" />
					</TheTabs>
				</LayoutFlex>
				<LineChart
					:key="selectedPeriod"
					class="u-mt-16 u-mb-48"
					:x-axis-labels="xAxisData"
					:y-axis-options="{showYAxis: false, opposite: false, labels: {formatter: (val) => {}}}"
					:series-data="yAxisData"
					data-v-step="4"
					@mouseOverDataPoint="handleMouseOverChart" />
			</div>
			<div class="l-balance__control">
				<label>Total Value</label>
				<h3>${{ totalValue + balancesValue + stakedBalance | toFixed | numberWithCommas }}</h3>
				<ul class="l-balance__toggle">
					<li><span><TheDot color="lime" /><label>NUON Balance</label></span> {{ tokenBalances.NUON | toFixed | numberWithCommas }}</li>
					<li><span><TheDot color="light-green" /><label>NuMINT Balance</label></span> {{ tokenBalances.nuMINT | toFixed | numberWithCommas }}</li>
					<li><span><TheDot color="blue" /><label>My Locked Collateral</label></span> {{ myCollateralLocked | toFixed | numberWithCommas }}</li>
					<li><span><TheDot color="orange" /><label>NuMINT in Boardroom</label></span> {{ stakedBalance | toFixed | numberWithCommas }}</li>
				</ul>
			</div>
		</div>
		<LayoutFlex direction="column l-chart chart">
			<LayoutFlex direction="row-space-between" class="l-flex--column-md">
				<DataCard class="u-mb-md-16" data-v-step="2">
					<label>
						<TheDot color="light-green" />
						My Total Value Locked
						<TheBadge v-if="!isNaN(getChangePercent('collateralTokens', collateralRatioArr, true))" class="u-ml-8" :color="getPercentChangeBadgeClass('collateralTokens', collateralRatioArr, true)">{{ getUserTVLSign }}{{ Math.abs(getChangePercent('collateralTokens', collateralRatioArr, true)) }}%</TheBadge>
					</label>
					<ComponentLoader component="h1" :loaded="balanceLoaded">
						<h3>${{ (graphSelectionTVL || totalValue) | toFixed | numberWithCommas }}</h3>
					</ComponentLoader>
				</DataCard>
				<DataCard class="u-mb-md-16" data-v-step="3">
					<label>
						<TheDot color="lime" />
						Total Value of My Minted NUON
						<TheBadge v-if="!isNaN(getChangePercent('mintedNuon', collateralRatioArr, true))" class="u-ml-8" :color="getPercentChangeBadgeClass('mintedNuon', collateralRatioArr, true)">{{ getUserMintedNuonSign }}{{ Math.abs(getChangePercent('mintedNuon', collateralRatioArr, true)) }}%</TheBadge>
					</label>
					<ComponentLoader component="h1" :loaded="balanceLoaded">
						<h3>${{ (graphSelectionMintedNuon || totalMintedNuon) | toFixed | numberWithCommas }}</h3>
					</ComponentLoader>
				</DataCard>
			</LayoutFlex>
			<template v-if="xAxisData.length">
				<LayoutFlex direction="row-space-between" class="l-flex--column-md">
					<span>{{graphSelectionDuraton}}</span>
					<TheTabs size="thin" color="light" margin="24" @tab-changed="handleTabChanged">
						<TheTab v-for="(period, periodIdx) in periods" :key="periodIdx" :title="period" />
					</TheTabs>
				</LayoutFlex>
				<LineChart
					:key="selectedPeriod"
					class="u-mt-16 u-mb-48"
					:x-axis-labels="xAxisData"
					:y-axis-options="{showYAxis: false, opposite: false, labels: {formatter: (val) => {}}}"
					:series-data="yAxisData"
					data-v-step="4"
					@mouseOverDataPoint="handleMouseOverChart" />
			</template>
			<TheLoader component="table">
				<TransactionTable
					v-if="!mobileView"
					size="5"
					class="u-p-0"
					aria="Collateral Hub transactions"
					:data="chubData"
					:config="configData"
					:misc="miscConfig"
					data-v-step="5" />
				<TransactionCard
					v-else
					:data="chubData"
					:config="configData" />
			</TheLoader>
		</LayoutFlex>
		<TransactionHistory data-v-step="7" />
		<v-tour name="myDashboardTour" :steps="steps" :callbacks="tourCallbacks"></v-tour>
	</LayoutContainer>
</template>

<script>
import dayjs from "dayjs";
import { fromWei } from "~/utils/bnTools";
import { getUserTVLDayData } from "~/services/theGraph";
import { USDT, WETH } from "~/constants/tokens";

export default {
	name: "MyDashboard",
	data() {
		return {
			tvl: 0,
			totalMintedNuonValue: 0,
			myCollateralizationRatio: 0,
			configData: [{title: "Locked Collateral", id: "lockedCollateral"},
				{title: "Today's Price", id: "currentPrice"},
				{title: "Total Value Locked", id: "lockedValue"},
				{title: "Total NUON Minted", id: "mintedNuon"},
				{title: "Collateralization Ratio", id: "collateralizationRatio"}],
			miscConfig: {
				hasImage: {lockedCollateral: ["WETH", "USDT"] },
				headerTooltips: {
					lockedCollateral: "Tokens you have locked as collateral to mint NUON.",
					currentPrice: "Current price of collateral tokens, for your reference when considering how much collateral to keep locked up.",
					lockedValue: "USD value of your locked collateral.",
					mintedNuon: "Total NUON minted with your collateral.",
					collateralizationRatio: "Your collateralization ratio per collateral asset."
				}
			},
			steps: [
				{
					target: "[data-v-step=\"1\"]",
					header: {
						title: "Welcome to the Dashboard",
					},
					content: "This page gives you a breakdown of your activity within the Nuon Protocol.",
				},
				{
					target: "[data-v-step=\"2\"]",
					content: "View your total deposited collateral here.",
				},
				{
					target: "[data-v-step=\"3\"]",
					content: "View the total value of your minted NUON here.",
				},
				{
					target: "[data-v-step=\"4\"]",
					content: "This chart shows your total value locked and the total value of your minted Nuon.",
				},
				{
					target: "[data-v-step=\"5\"]",
					content: "This section gives important details about your collateral, including your collateralization ratio for each asset type deposited, as well as the daily market price for your reference.",
				},
				{
					target: "[data-v-step=\"6\"]",
					content: "This section shows the total value of your account, including all Nuon minted, collateral deposited and nuMINT staked.",
				},
				{
					target: "[data-v-step=\"7\"]",
					content: "Lastly, this section provides a full history of all your transactions.",
					params: {
						placement: "left"
					}
				},
			],
			tourCallbacks: {
				onSkip: () => this.setCookie("skip_my_dashboard_tour"),
				onStop: () => this.setCookie("skip_my_dashboard_tour"),
				onFinish: () => this.setCookie("skip_my_dashboard_tour")
			},
			mobileView: false,
			collateralPrices: {},
			userMintedAmounts: {},
			userCollateralizationRatios: {},
			userTotalLockedCollateralAmount: {},
			nuonPrice: null,
			collateralRatioArr: [],
			graphSelectionTVL: "",
			graphSelectionMintedNuon: "",
			balanceLoaded: false,
			periods: ["D", "W", "M"],
			selectedPeriod: 0,
			graphSelectionDuraton: ""
		};
	},
	head () {
		return {
			title: "Dashboard | NUON"
		};
	},
	computed: {
		collaterals() {
			const collaterals = [WETH.symbol, USDT.symbol];
			return collaterals;
		},
		pendingRewards() {
			return this.$store.state.boardroomStore.earned;
		},
		rewardsDollarValue() {
			if (!parseFloat(this.pendingRewards)) return 0;
			return this.pendingRewards * this.tokenPrices.nuMINT;
		},
		balancesValue() {
			if (this.tokenBalances.nuMINT && this.tokenPrices.nuMINT && this.tokenBalances.NUON && this.tokenPrices.NUON) {
				return parseFloat((this.tokenBalances.nuMINT * this.tokenPrices.nuMINT + this.tokenBalances.NUON * this.tokenPrices.NUON).toFixed(2));
			} else {
				return 0;
			}
		},
		stakedBalance() {
			return fromWei(this.$store.state.boardroomStore.stakedBalance);
		},
		myCollateralLocked() {
			return Object.values(this.userTotalLockedCollateralAmount).reduce((acc, val) => acc + parseFloat(val), 0);
		},
		totalValue() {
			return Object.entries(this.userTotalLockedCollateralAmount).reduce((acc, [collateral, amount]) => acc + this.collateralPrices[collateral] * parseFloat(amount), 0);
		},
		myCollateralLockedPercentage() {
			return Number(this.myCollateralLocked) / this.totalValue * 100;
		},
		totalMintedNuon() {
			if (Object.values(this.userMintedAmounts).length === 0) return 0;
			return parseFloat(Object.values(this.userMintedAmounts).reduce((acc, amount) => acc + amount, 0) * this.nuonPrice).toFixed(2);
		},
		chubData() {
			const data = [];

			for (let i = 0; i < this.collaterals.length; i++) {
				const collateral = this.collaterals[i];
				const obj = {
					lockedCollateral: collateral,
					lockedValue: `$${this.numberWithCommas((this.userTotalLockedCollateralAmount[collateral] * this.collateralPrices[collateral]).toFixed(2))}`,
					mintedNuon: this.numberWithCommas(parseFloat(this.userMintedAmounts[collateral]).toFixed(2)),
					collateralizationRatio: `${this.numberWithCommas(parseFloat(this.userCollateralizationRatios[collateral]).toFixed(2))}%`,
					currentPrice: `$${this.numberWithCommas(parseFloat(this.collateralPrices[collateral]).toFixed(2))}`
				};
				data.push(obj);
			}

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
			return this.chartData.xData || [];
		},
		yAxisData() {
			return this.chartData.yData || [];
		},
		chartData() {
			const weeks = {};
			const months = {};

			this.collateralRatioArr.forEach(item => {
				const currentDate = dayjs(new Date(item.date * 1000));
				if (!weeks[currentDate.startOf("week").format("YYYY-MM-DD")])
					weeks[currentDate.startOf("week").format("YYYY-MM-DD")] = item;
				if (!months[currentDate.startOf("month").add(1,"day").format("YYYY-MM-DD")])
					months[currentDate.startOf("month").add(1,"day").format("YYYY-MM-DD")] = item;
			});
			if (this.selectedPeriod === 1) { // week
				return {
					xData:Object.keys(weeks).map(d => new Date(d).toLocaleDateString()).reverse(),
					yData:[{
						name: "My Total Value Locked",
						data: Object.values(weeks).map(d => d.value).reverse()
					}, {
						name: "My Total Minted Value",
						data: Object.values(weeks).map(d => d.mintedValue).reverse()
					}]
				};}
			if (this.selectedPeriod === 2) { // month
				return {
					xData:Object.keys(months).map(d => new Date(d).toLocaleDateString()).reverse(),
					yData:[{
						name: "My Total Value Locked",
						data: Object.values(months).map(d => d.value).reverse()
					}, {
						name: "My Total Minted Value",
						data: Object.values(months).map(d => d.mintedValue).reverse()
					}]
				};
			};
			return {
				xData:this.collateralRatioArr.map(d => new Date(d.date * 1000).toLocaleDateString()).reverse(),
				yData:[{
					name: "My Total Value Locked",
					data: this.collateralRatioArr.map(d => d.value).reverse()
				}, {
					name: "My Total Minted Value",
					data: this.collateralRatioArr.map(d => d.mintedValue).reverse()
				}]
			};
		}
	},
	watch: {
		connectedAccount(newValue) {
			if (newValue) this.initialize(this.collaterals);
		},
		yAxisData() {
			this.handleMouseOverChart(-1);
		}
	},
	mounted() {
		this.mobileView = this.isMobile();
		this.initialize(this.collaterals);
		this.handleMouseOverChart(-1);
		if (!$cookies.get("skip_my_dashboard_tour")) this.$tours.myDashboardTour.start();
	},
	methods: {
		async initialize(collaterals) {
			try {
				for (let i = 0; i < collaterals.length; i++) {
					const collateral = collaterals[i];
					await this.$store.dispatch("collateralVaultStore/changeCollateral", collateral);
					this.getCollateralsPrices(collateral);
					this.getUserMintedAmount(collateral);
					this.getUserCollateralizationRatio(collateral);
					this.getUserCollateralAmount(collateral);
				}

				this.getNuonPrice();
				this.getDiffMinted();
			} catch (e) {
			} finally {
				setTimeout(() => {
					this.balanceLoaded = true;
				}, 500);
			}
		},
		async getCollateralsPrices(collateral) {
			let result = 0;
			try {
				result = parseFloat(fromWei(await this.$store.getters["collateralVaultStore/getCollateralPrice"]()));
				this.$set(this.collateralPrices, collateral, result);
			} catch (e) {
			} finally {
				this.collateralPrice = result;
			}
		},
		async getUserMintedAmount(collateral) {
			let result = 0;
			try {
				result = fromWei(await this.$store.getters["collateralVaultStore/getUserMintedAmount"](this.connectedAccount));
			} catch (e) {
			} finally {
				this.$set(this.userMintedAmounts, collateral, result);
			}
		},
		async getUserCollateralizationRatio(collateral) {
			let result = 0;
			try {
				const amount = fromWei(await this.$store.getters["collateralVaultStore/getUserCollateralRatioInPercent"](this.connectedAccount));
				result = parseFloat(amount);
			} catch (e) {
			} finally {
				this.$set(this.userCollateralizationRatios, collateral, result);
			}
		},
		async getUserCollateralAmount(collateral) {
			let result = 0;
			try {
				const decimals = this.$store.state.erc20Store.decimals[collateral];
				const amount = (await this.$store.getters["collateralVaultStore/getUserCollateralAmount"](this.connectedAccount));
				result = parseFloat(fromWei(amount, decimals));
			} catch (e) {
			} finally {
				this.$set(this.userTotalLockedCollateralAmount, collateral, result);
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
			getUserTVLDayData({user: this.connectedAccount}).then(res => {
				this.collateralRatioArr = res.data.data.userTVLDayDatas;
			}).catch((err) => {
				this.failureToast(() => {}, err, "An error occurred");
			}).finally(() => {
				const storageKey = `NUON-user_collateral_history_${this.connectedAccount}`;
				if (this.collateralRatioArr.length === 0) {
					const stringData = window.localStorage.getItem(storageKey);
					if (!stringData) return;
					const jsonData = JSON.parse(stringData);
					if (jsonData && jsonData.length) this.collateralRatioArr = jsonData;
				} else {
					window.localStorage.setItem(storageKey, JSON.stringify(this.collateralRatioArr));
				}
			});
		},
		handleMouseOverChart(e) {
			let idx = e;
			if (this.yAxisData.length === 0) return;
			if (e === -1) {
				idx = this.yAxisData[0]?.data?.length - 1;
				this.graphSelectionDuraton = "";
			}
			this.graphSelectionTVL = this.yAxisData[0]?.data[idx];
			this.graphSelectionMintedNuon = this.yAxisData[1]?.data[idx];
			if (e === -1) return;
			const startDate = dayjs(this.xAxisData[idx]).format("MMM D YYYY");
			if (this.selectedPeriod === 0) {
				this.graphSelectionDuraton = startDate;
			} else if (this.selectedPeriod === 1) {
				this.graphSelectionDuraton = `${startDate} - ${dayjs(this.xAxisData[idx]).add(1,"week").format("MMM D YYYY")}`;
			} else if (this.selectedPeriod === 2) {
				this.graphSelectionDuraton = `${startDate} - ${dayjs(this.xAxisData[idx]).add(1,"month").format("MMM D YYYY")}`;
			}
		},
		handleTabChanged(e) {
			this.selectedPeriod = e;
		},
	}
};
</script>
