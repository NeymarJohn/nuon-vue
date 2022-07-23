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
						<TheBadge v-if="!isNaN(getChangePercent('collateralTokens', collateralRatioArr, true))" class="u-ml-8" :color="getPercentChangeBadgeClass('collateralTokens', collateralRatioArr, true)">{{ getUserTVLSign }}{{ Math.abs(getChangePercent('collateralTokens', collateralRatioArr, true)) }}%</TheBadge>
					</label>
					<ComponentLoader component="h1" :loaded="totalValue ? true : false">
						<h3>${{ (graphSelectionTVL || totalValue) | toFixed | numberWithCommas }}</h3>
					</ComponentLoader>
				</DataCard>
				<DataCard class="u-mb-md-16">
					<label>
						<TheDot color="lime" />
						Total Value of My Minted NUON
						<TheBadge v-if="!isNaN(getChangePercent('mintedNuon', collateralRatioArr, true))" class="u-ml-8" :color="getPercentChangeBadgeClass('mintedNuon', collateralRatioArr, true)">{{ getUserMintedNuonSign }}{{ Math.abs(getChangePercent('mintedNuon', collateralRatioArr, true)) }}%</TheBadge>
					</label>
					<ComponentLoader component="h1" :loaded="totalMintedNuon ? true : false">
						<h3>${{ (graphSelectionMintedNuon || totalMintedNuon) | toFixed | numberWithCommas }}</h3>
					</ComponentLoader>
				</DataCard>
			</LayoutFlex>
			<LineChart
				v-if="xAxisData.length"
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
					<ComponentLoader component="h1" :loaded="(totalValue && balancesValue && stakedBalance) ? true : false">
						<h3>${{ totalValue + balancesValue + stakedBalance | toFixed | numberWithCommas }}</h3>
					</ComponentLoader>
				</DataCard>
			</template>
			<template #panel-two>
				<ComponentLoader class="donut-chart-balance" :loaded="(totalValue && balancesValue && stakedBalance)?true:false">
					<DonutChartBalance
						:key="`balances-${balancesValue}-${totalValue}-${stakedBalance}`"
						:chart-data="[balancesValue, parseFloat(totalValue), parseFloat(stakedBalance)]" />
				</ComponentLoader>
			</template>
			<template #panel-three>
				<DataCard>
					<label><TheDot color="orange" />NUON &amp; nuMINT balance<TooltipIcon v-tooltip="'Total number of NUON and nuMINT tokens in your wallet.'" /></label>
					<ComponentLoader component="h1" :loaded="balancesValue ? true : false">
						<h4>{{ tokenBalances.NUON | toFixed | numberWithCommas }} NUON</h4>
						<h4>{{ tokenBalances.HX | toFixed | numberWithCommas }} nuMINT</h4>
					</ComponentLoader>
				</DataCard>
			</template>
			<template #panel-four>
				<DataCard>
					<label><TheDot color="blue" /> My Locked Collateral<TooltipIcon v-tooltip="'Total number of tokens locked as collateral.'" /></label>
					<ComponentLoader component="h1" :loaded="totalValue ? true : false">
						<h4>{{myCollateralLocked | toFixed | numberWithCommas }} ETH</h4>
					</ComponentLoader>
				</DataCard>
			</template>
			<template #panel-five>
				<DataCard>
					<label><TheDot color="tourquise" /> My Staked Tokens<TooltipIcon v-tooltip="'Total number of nuMINT tokens staked in the Nuon protocol.'" /></label>
					<ComponentLoader component="h1" :loaded="stakedBalance ? true : false">
						<h4>{{ stakedBalance | toFixed | numberWithCommas }} nuMINT</h4>
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
				{title: "Total NUON Minted", id: "mintedNuon"},
				{title: "Collateralization Ratio", id: "collateralizationRatio"}],
			miscConfig: {
				hasImage: {lockedCollateral: ["ETH", "USDC"] },
				headerTooltips: {
					lockedCollateral: "Tokens you have locked as collateral to mint NUON.",
					currentPrice: "Current price of collateral tokens, for your reference when considering how much collateral to keep locked up.",
					lockedValue: "USD value of your locked collateral.",
					mintedNuon: "Total NUON minted with your collateral.",
					collateralizationRatio: "Your collateralization ratio per collateral asset."
				}
			},
			mobileView: false,
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
			title: "My Dashboard | NUON"
		};
	},
	computed: {
		collaterals() {
			const collaterals = ["ETH"];
			if (this.isEnvDev) collaterals.push("USDC");
			return collaterals;
		},
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
			return fromWei(this.$store.state.boardroomStore.stakedBalance);
		},
		myCollateralLocked() {
			return Object.values(this.userTotalLockedCollateralAmount).reduce((acc, val) => acc + parseFloat(val), 0);
		},
		totalValue() {
			if (Object.entries(this.userTotalLockedCollateralAmount).length === 0) return 0;
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
				data: reducedData.map(d => d.mintedNuon)
			}];
		}
	},
	watch: {
		connectedAccount(newValue) {
			if (newValue) this.initialize(this.collaterals);
		}
	},
	mounted() {
		this.mobileView = this.isMobile();
		this.initialize(this.collaterals);
		this.handleMouseOverChart(-1);
	},
	methods: {
		async initialize(collaterals) {
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
				const decimals = 10 ** this.$store.state.erc20Store.decimals[collateral];
				const amount = (await this.$store.getters["collateralVaultStore/getUserCollateralAmount"](this.connectedAccount)) / decimals;
				result = parseFloat(amount);
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
