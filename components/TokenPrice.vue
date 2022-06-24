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
						<div class="chart--overview">
							<p>{{ selectedPriceTab }}</p>
							<h1>{{ graphSelection ? graphSelection : '0.00' }}</h1>
							<p class="u-colour-white">{{ dateSelection ? dateSelection : "00/00/00" }}</p>
						</div>
						<LayoutFlex direction="column-justify-between">
							<Pills :pills="priceTabs" @pill-clicked="handlePriceTabChanged" />
							<Pills v-if="selectedPriceTab !== 'Price' && selectedPriceTab !== null" :pills="periodTabs" default-active @pill-clicked="handlePeriodTabChanged" />
						</LayoutFlex>
					</LayoutFlex>
					<LineChart
						:key="`${selectedPriceTab}-${selectedPeriodTab}`"
						class="u-mt-32"
						:name="selectedPriceTab || ''"
						:x-axis-labels="xAxisLabels"
						:chart-data="yAxisData"
						@mouseOverDataPoint="handleMouseOverChart"
					/>
				</div>
			</LayoutFlex>
		</div>
	</div>
</template>

<script>
import { getTokenPricesDayData } from "~/services/theGraph";

export default {
	name: "TokenPrice",
	data() {
		return {
			currentlySelectedTab: "",
			selectedPriceTab: null,
			selectedPeriodTab: "",
			tabs: ["HX", "NUON"],
			priceTabs: ["Price", "Market Cap", "Circulating Supply"],
			periodTabs: ["D", "W", "M"],
			priceHistoryData: [],
			graphSelection: "",
			dateSelection: ""
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
			return parseFloat(this.$store.state.tokenStore.price[this.currentlySelectedTab]).toFixed(2);
		},
		graphData() {
			const tokenIdx = this.currentlySelectedTab === "NUON" ? 0 : 1;
			return this.priceHistoryData.map(d => ({
				date: new Date(d.date * 1000).toLocaleDateString(),
				price: parseFloat(d.prices[tokenIdx].price).toFixed(2)
			}));
		},
		xAxisLabels() {
			let numberOfDaysInPast = this.selectedPeriodTab === "W" ? 7 : 30;
			if (this.selectedPriceTab === "Price") numberOfDaysInPast = 0;
			const data = this.graphData.map(d => d.date).slice(this.graphData.length - numberOfDaysInPast);
			data.push("");
			data.unshift("");
			return data;
		},
		yAxisData() {
			let numberOfDaysInPast = this.selectedPeriodTab === "W" ? 7 : 30;
			if (this.selectedPriceTab === "Price") numberOfDaysInPast = 0;
			const data = this.graphData.map(d => d.price).slice(this.graphData.length - numberOfDaysInPast);
			data.push(null);
			data.unshift(null);
			return data;
		},
	},
	async mounted() {
		try {
			const response = await getTokenPricesDayData();
			this.priceHistoryData = response.data.data.tokenPriceDayDatas;
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
