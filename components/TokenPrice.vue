<template>
	<div>
		<h2 class="u-mb-24">Token Price</h2>
		<div class="l-chart l-chart--token-price">
			<TheTabs margin="24" @tab-changed="handleTabChanged">
				<TheTab title="nuMINT" />
				<TheTab title="NUON" />
			</TheTabs>
			<LayoutFlex class="l-flex--column-md">
				<div class="chart">
					<LayoutFlex class="u-mb-md-4">
						<p>Market Cap</p><TheBadge v-if="!isNaN(getChangePercent('marketVal', dataToUse))" :color="getPercentChangeBadgeClass('marketVal', dataToUse)" class="u-ml-8">{{ getChangePercent('marketVal', dataToUse) }}%</TheBadge>
					</LayoutFlex>
					<ComponentLoader class="u-mb-48" component="h3" :loaded="marketCap !== null">
						<h3>${{ marketCap | numberWithCommas }}</h3>
					</ComponentLoader>
					<LayoutFlex class="u-mb-md-4">
						<p>Circulating Supply</p><TheBadge v-if="!isNaN(getChangePercent('value', dataToUse))" :color="getPercentChangeBadgeClass('value', dataToUse)" class="u-ml-8">{{ getChangePercent('value', dataToUse) }}%</TheBadge>
					</LayoutFlex>
					<ComponentLoader class="u-mb-48" component="h3" :loaded="circulatingSupply !== null">
						<h3>{{ circulatingSupply | toFixed | numberWithCommas }}</h3>
					</ComponentLoader>
					<LayoutFlex class="u-mb-md-4">
						<p>Price</p><TheBadge v-if="!isNaN(getChangePercent('priceUSD', dataToUse))" :color="getPercentChangeBadgeClass('priceUSD', dataToUse)" class="u-ml-8">{{ getChangePercent('priceUSD', dataToUse) }}%</TheBadge>
					</LayoutFlex>
					<ComponentLoader component="h3" :loaded="tokenPrice !== null" class="u-mb-24">
						<h3>${{ tokenPrice && tokenPrice.indexOf("0.") === 0 ? formatSubOneDecimals(tokenPrice) : numberWithCommas(parseFloat(tokenPrice).toFixed(2)) }}</h3>
					</ComponentLoader>
					<script src="https://truflation.com/truflation-widget.js"></script>
					<truflation-widget></truflation-widget>
				</div>
				<div class="chart">
					<LayoutFlex direction="column-justify-between" class="u-mb-24">
						<ThePills
							class="u-mb-8"
							:pills="priceTabs"
							default-active
							@pill-clicked="handlePriceTabChanged" />
						<ThePills
							class="u-mb-md-16"
							:pills="periodTabs"
							default-active
							@pill-clicked="handlePeriodTabChanged" />
					</LayoutFlex>
					<LayoutFlex direction="row-space-between" class="l-flex--column-reverse-md">
						<DataCard>
							<label>{{ selectedPriceTab }}</label>
							<ComponentLoader component="h1" :loaded="graphSelection !== null">
								<h3 class="u-font-size-h2-1440" :style="{color: graphSelection ? '#ffffff' : '#3a3a3e'}">${{ graphSelection && graphSelection.indexOf("0.") === 0 ? formatSubOneDecimals(graphSelection) : numberWithCommas(parseFloat(graphSelection).toFixed(2)) }}</h3>
							</ComponentLoader>
							<ComponentLoader component="h5" :loaded="dateSelection !== null">
								<h5 :style="{color: dateSelection ? '#ffffff' : '#3a3a3e'}">{{ dateSelection ? dateSelection : 0 }}</h5>
							</ComponentLoader>
						</DataCard>
					</LayoutFlex>
					<LineChart
						:key="`${currentlySelectedTab}-${selectedPriceTab}-${selectedPeriodTab}`"
						class="u-mt-32"
						:x-axis-labels="xAxisLabels"
						:series-data="[
							{
								name: selectedPriceTab || '',
								data: yAxisData
							},
							{
								name: 'Latest',
								data: dottedYAxisData
							}
						]"
						:animate="false"
						:y-axis-options="{showYAxis: false, opposite: false, labels: {formatter: (val) => {}}}"
						:show-tooltip="true"
						:dash-array="[0, 4]"
						:colors="['#DFFF65', 'grey']"
						@mouseOverDataPoint="handleMouseOverChart" />
				</div>
			</LayoutFlex>
		</div>
	</div>
</template>

<script>
import { getTokenData } from "~/services/theGraph";
import nuonData from "@/assets/json/nuon.json";
import numintData from "@/assets/json/numint.json";
export default {
	name: "TokenPrice",
	data() {
		return {
			currentlySelectedTab: "",
			selectedPriceTab: "Price",
			selectedPeriodTab: "",
			tabs: ["nuMINT", "NUON"],
			priceTabs: ["Price", "Market Cap", "Circulating Supply"],
			periodTabs: ["D", "W", "M"],
			priceHistoryData: [],
			graphSelection: "",
			dateSelection: "",
			nuonSupplyInfo: [],
			hydroSupplyInfo: [],
			milliSecondsInDay: 86400000
		};
	},
	computed: {
		dataToUse() {
			return this.currentlySelectedTab === "NUON" ? this.nuonSupplyInfo : this.hydroSupplyInfo;
		},
		marketCap() {
			if ([this.tokenPrice, this.circulatingSupply].some(v => [undefined, null].includes(v))) return null;
			return parseFloat(this.tokenPrice * this.circulatingSupply).toFixed(2);
		},
		circulatingSupply() {
			if ([undefined, null].includes(this.$store.state.erc20Store.supply[this.currentlySelectedTab])) return null;
			return this.$store.state.erc20Store.supply[this.currentlySelectedTab];
		},
		tokenPrice() {
			if ([undefined, null].includes(this.$store.state.tokenStore.price[this.currentlySelectedTab])) return null;
			let data = parseFloat(this.$store.state.tokenStore.price[this.currentlySelectedTab]).toFixed(2);
			if (data === "0.00") data = parseFloat(this.$store.state.tokenStore.price[this.currentlySelectedTab]).toFixed(9);
			return data;
		},
		graphData() {
			let dataKey;
			if (this.selectedPriceTab === "Price") dataKey = "priceUSD";
			if (this.selectedPriceTab === "Market Cap") dataKey = "marketVal";
			if (this.selectedPriceTab === "Circulating Supply") dataKey = "value";

			return this.dataToUse.map(d => ({
				date: new Date(d.date * 1000),
				data: d[dataKey]
			}));
		},
		xAxisLabels() {
			let data = this.graphData.map(d => d.date);

			if (this.selectedPeriodTab === "D") {
				data = data.map(d => d.toLocaleDateString());
			} else if (this.selectedPeriodTab === "W") {
				const mondaysOfWeekOfDates = data.reduce((acc, d) => {
					const day = d.getDay();
					const mondayOfWeek = new Date(d.getTime() - (day - 1) * this.milliSecondsInDay).setUTCHours(0,0,0,0);

					if (!acc[mondayOfWeek]) {
						acc[mondayOfWeek] = [d];
					} else {
						acc[mondayOfWeek].push(d);
					}

					return acc;
				}, {});

				const labels = Object.keys(mondaysOfWeekOfDates).map(monday => `${new Date(parseInt(monday)).toLocaleDateString()} - ${new Date(parseInt(monday) + (6 * this.milliSecondsInDay)).toLocaleDateString()}`);
				data = labels;
			} else {
				const yearAndMonthsOfDates = data.reduce((acc, d) => {
					const year = d.getFullYear();
					const month = d.getMonth();

					if (!acc[year] || !acc[year][month]) {
						acc[year] = {[month]: [d]};
					} else {
						acc[year][month].push(d);
					}

					return acc;
				}, {});

				const sortedDataOverYearAndMonth = Object.entries(yearAndMonthsOfDates).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
				const labels = sortedDataOverYearAndMonth.flatMap(([year, monthsWithData]) => {
					const sortedMonths = Object.keys(monthsWithData).map(month => parseInt(month)).sort((a, b) => a - b);
					const monthWithYear	=	sortedMonths.map(month => `${parseInt(month) + 1}/${year}`);
					return monthWithYear;
				});
				data = labels;
			}

			data.push("");
			data.unshift("");
			return data;
		},
		yAxisData() {
			let data = this.graphData.map(d => d.data);

			if (this.selectedPeriodTab === "W") {
				const mondaysOfWeekOfDates = this.graphData.reduce((acc, graphData) => {
					const d = graphData.date;
					const day = d.getDay();
					const mondayOfWeek = new Date(d.getTime() - (day - 1) * this.milliSecondsInDay).setUTCHours(0,0,0,0);
					const graphDataValue = graphData.data;

					if (!acc[mondayOfWeek]) {
						acc[mondayOfWeek] = [graphDataValue];
					} else {
						acc[mondayOfWeek].push(graphDataValue);
					}

					return acc;
				}, {});

				const sortedData = Object.entries(mondaysOfWeekOfDates).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
				const sortedDataWithLastClosingPrice = sortedData.map(([_monday, weekData]) => weekData[weekData.length - 1]);
				data = sortedDataWithLastClosingPrice;
			} else if (this.selectedPeriodTab === "M") {
				const yearAndMonthsOfDates = this.graphData.reduce((acc, graphData) => {
					const year = graphData.date.getFullYear();
					const month = graphData.date.getMonth();
					const graphDataValue = graphData.data;

					if (!acc[year] || !acc[year][month]) {
						acc[year] = {[month]: [graphDataValue]};
					} else {
						acc[year][month].push(graphDataValue);
					}

					return acc;
				}, {});

				const sortedDataOverYearWithMonths = Object.entries(yearAndMonthsOfDates).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
				const closingPriceForMonths = sortedDataOverYearWithMonths.flatMap(([_year, monthsWithData]) => {
					const sortedMonthsData = Object.entries(monthsWithData).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
					const closingPriceForMonth = sortedMonthsData.map(([_month, data]) => data[data.length - 1]);
					return closingPriceForMonth;
				});
				data = closingPriceForMonths;
			}

			data.push(null);
			data.unshift(null);
			return data;
		},
		dottedYAxisData() {
			return this.yAxisData.map(d => d ? this.yAxisData[this.yAxisData.length - 2] : null);
		}
	},
	mounted() {
		try {
			const nuonPlaceholderData = nuonData;
			const hydroPlaceholderData = numintData;

			// const nuonAddress = this.$store.getters["addressStore/tokens"].NUON;
			// const hydroAddress = this.$store.getters["addressStore/tokens"].HX;

			// const nuonSupplyResponse = await getTokenData(nuonAddress);
			// const hydroSupplyResponse = await getTokenData(hydroAddress);

			// if (nuonSupplyResponse.status === 200 && nuonSupplyResponse.data.data.token) {
			// 	nuonPlaceholderData = nuonSupplyResponse.data.data.token.tokenDayData.reverse();
			// }
			// if (hydroSupplyResponse.status === 200 && hydroSupplyResponse.data.data.token) {
			// 	hydroPlaceholderData = hydroSupplyResponse.data.data.token.tokenDayData.reverse();
			// }
			this.nuonSupplyInfo = nuonPlaceholderData.map(item => {
				return {
					...item,
					"marketVal": item.marketVal || item.totalLiquidityUSD,
					"value": item.value || item.totalLiquidityToken,
					"priceUSD": item.price && item.price.price ? item.price.price : item.priceUSD
				};
			});
			this.hydroSupplyInfo = hydroPlaceholderData.map(item => {
				return {
					...item,
					"marketVal": item.marketVal || item.totalLiquidityUSD,
					"value": item.value || item.totalLiquidityToken,
					"priceUSD": item.price && item.price.price ? item.price.price : item.priceUSD
				};
			});

			this.handlePeriodTabChanged(0);
		} catch (e) {
			this.failureToast(null, e, "An error occurred when fetching data");
		}
	},
	methods: {
		handleTabChanged(e) {
			this.currentlySelectedTab = this.tabs[e];
			this.handleMouseOverChart(this.yAxisData.length - 2);
		},
		handlePriceTabChanged(e) {
			this.selectedPriceTab = this.priceTabs[e];
			this.handleMouseOverChart(this.yAxisData.length - 2);
		},
		handlePeriodTabChanged(e) {
			this.selectedPeriodTab = this.periodTabs[e];
			this.handleMouseOverChart(this.yAxisData.length - 2);
		},
		handleMouseOverChart(e) {
			let idx = e;
			if (e === 0 || e === this.yAxisData.length - 1) {
				idx = this.yAxisData.length - 2;
			}
			this.graphSelection = this.yAxisData[idx];
			this.dateSelection = this.xAxisLabels[idx];
		},
	}
};
</script>
