<template>
	<div>
		<h2 class="u-mb-24">Token Price</h2>
		<div class="l-chart l-chart--token-price">
			<TheTabs margin="24" @tab-changed="handleTabChanged">
				<TheTab title="HX" />
				<TheTab title="Nuon" />
			</TheTabs>
			<LayoutFlex>
				<div class="chart">
					<p>Market Cap <TheBadge color="price-down" class="u-ml-8">-1.79%</TheBadge></p>
					<ComponentLoader component="h3" :loaded="marketCap !== null">
						<h3 class="u-mb-48">${{ marketCap | numberWithCommas }}</h3>
					</ComponentLoader>
					<p>Circulating Supply <TheBadge color="price-up" class="u-ml-8">+1.79%</TheBadge></p>
					<ComponentLoader component="h3" :loaded="circulatingSupply !== null">
						<h3 class="u-mb-48">{{ circulatingSupply | numberWithCommas }}</h3>
					</ComponentLoader>
					<p>Price <TheBadge color="price-up" class="u-ml-8">+1.79%</TheBadge></p>
					<ComponentLoader component="h3" :loaded="tokenPrice !== null">
						<h3>{{ tokenPrice }}<sup>Nuon</sup></h3>
					</ComponentLoader>
				</div>
				<div class="chart u-min-height-600">
					<LayoutFlex direction="row-space-between">
						<div class="u-min-height-96">
							<p>{{ selectedPriceTab }}</p>
							<h1 v-show="graphSelection">{{ graphSelection }}</h1>
							<p v-show="graphSelection" class="u-colour-white">{{ dateSelection }}</p>
						</div>
						<LayoutFlex direction="column-justify-between">
							<Pills :pills="priceTabs" default-active @pill-clicked="handlePriceTabChanged" />
							<Pills v-if="selectedPriceTab !== 'Price' && selectedPriceTab !== null" :pills="periodTabs" default-active @pill-clicked="handlePeriodTabChanged" />
						</LayoutFlex>
					</LayoutFlex>
					<LineChart
						:key="`${currentlySelectedTab}-${selectedPriceTab}-${selectedPeriodTab}`"
						class="u-mt-32"
						:x-axis-labels="xAxisLabels"
						:series-data="[{name: selectedPriceTab || '',  data: yAxisData}]"
						:animate="false"
						@mouseOverDataPoint="handleMouseOverChart"
					/>
				</div>
			</LayoutFlex>
		</div>
	</div>
</template>

<script>
import { getTotalSupplyWithToken} from "~/services/theGraph";
import { NUON_ADDRESS, HYDRO_ADDRESS } from "~/constants/addresses";

export default {
	name: "TokenPrice",
	data() {
		return {
			currentlySelectedTab: "",
			selectedPriceTab: "Price",
			selectedPeriodTab: "",
			tabs: ["HX", "NUON"],
			priceTabs: ["Price", "Market Cap", "Circulating Supply"],
			periodTabs: ["W", "M"],
			priceHistoryData: [],
			graphSelection: "",
			dateSelection: "",
			nuonSupplyInfo: [],
			hydroSupplyInfo: []
		};
	},
	computed: {
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
			const dataToUse = this.currentlySelectedTab === "NUON" ? this.nuonSupplyInfo : this.hydroSupplyInfo;
			let dataKey;
			if (this.selectedPriceTab === "Price") dataKey = "price";
			if (this.selectedPriceTab === "Market Cap") dataKey = "marketVal";
			if (this.selectedPriceTab === "Circulating Supply") dataKey = "value";

			return dataToUse.map(d => ({
				date: new Date(d.date * 1000).toLocaleDateString(),
				data: d[dataKey]
			}));
		},
		xAxisLabels() {
			const data = this.graphData.map(d => d.date);
			if (this.selectedPriceTab !== "Price") {
				const numberOfDaysInPast = this.selectedPeriodTab === "W" ? 7 : 30;
				data.slice(this.graphData.length - numberOfDaysInPast);
			}
			data.push("");
			data.unshift("");
			return data;
		},
		yAxisData() {
			let data = this.graphData.map(d => d.data);
			if (this.selectedPriceTab === "Price") {
				data = data.map(d => d.price);
			} else {
				const numberOfDaysInPast = this.selectedPeriodTab === "W" ? 7 : 30;
				data.slice(this.graphData.length - numberOfDaysInPast);
			}
			data = data.map(d => parseFloat(d).toFixed(2));
			data.push(null);
			data.unshift(null);
			return data;
		},
	},
	async mounted() {
		try {
			const nuonSupplyResponse = await getTotalSupplyWithToken(NUON_ADDRESS);
			this.nuonSupplyInfo = nuonSupplyResponse.data.data.totalSupplyDayDatas;

			const hydroSupplyResponse = await getTotalSupplyWithToken(HYDRO_ADDRESS);
			this.hydroSupplyInfo = hydroSupplyResponse.data.data.totalSupplyDayDatas;
			this.handlePeriodTabChanged(0);
		} catch (e) {
			this.failureToast(null, e, "An error occurred when fetching data");
		}
	},
	methods: {
		handleTabChanged(e) {
			this.currentlySelectedTab = this.tabs[e];
		},
		handlePriceTabChanged(e) {
			this.selectedPriceTab = this.priceTabs[e];
		},
		handlePeriodTabChanged(e) {
			this.selectedPeriodTab = this.periodTabs[e];
		},
		handleMouseOverChart(e) {
			this.graphSelection = this.yAxisData[e];
			this.dateSelection = this.xAxisLabels[e];
		}
	}
};
</script>
