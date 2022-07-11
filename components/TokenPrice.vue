<template>
	<div>
		<h2 class="u-mb-24">Token Price</h2>
		<div class="l-chart l-chart--token-price">
			<TheTabs margin="24" @tab-changed="handleTabChanged">
				<TheTab title="HX" />
				<TheTab title="NUON" />
			</TheTabs>
			<LayoutFlex class="l-flex--column-md">
				<div class="chart">
					<LayoutFlex class="u-mb-md-4">
						<p>Market Cap</p><TheBadge :color="getPercentChangeBadgeClass('marketVal', dataToUse)" class="u-ml-8">{{ getChangePercent('marketVal', dataToUse) }}%</TheBadge>
					</LayoutFlex>
					<ComponentLoader component="h3" :loaded="marketCap !== null">
						<h3 class="u-mb-48">${{ marketCap | numberWithCommas }}</h3>
					</ComponentLoader>
					<LayoutFlex class="u-mb-md-4">
						<p>Circulating Supply</p><TheBadge :color="getPercentChangeBadgeClass('value', dataToUse)" class="u-ml-8">{{ getChangePercent('value', dataToUse) }}%</TheBadge>
					</LayoutFlex>
					<ComponentLoader component="h3" :loaded="circulatingSupply !== null">
						<h3 class="u-mb-48">{{ circulatingSupply | numberWithCommas }}</h3>
					</ComponentLoader>
					<LayoutFlex class="u-mb-md-4">
						<p>Price</p><TheBadge :color="getPercentChangeBadgeClass('price', dataToUse)" class="u-ml-8">{{ getChangePercent('price', dataToUse) }}%</TheBadge>
					</LayoutFlex>
					<ComponentLoader component="h3" :loaded="tokenPrice !== null">
						<h3>${{ tokenPrice && tokenPrice.includes("0.") ? tokenPrice : numberWithCommas(tokenPrice) }}</h3>
					</ComponentLoader>
				</div>
				<div class="chart">
					<LayoutFlex direction="row-space-between" class="l-flex--column-reverse-md">
						<DataCard>
							<label>{{ selectedPriceTab }}</label>
							<ComponentLoader component="h1" :loaded="graphSelection !== null">
								<h3 class="u-font-size-h2-1440" :style="{color: graphSelection ? 'white' : '#3a3a3e'}">{{ graphSelection ? numberWithCommas(graphSelection) : 0 }}<sup :style="{color: graphSelection ? 'white' : '#3a3a3e'}">{{ currentlySelectedTab }}</sup></h3>
							</ComponentLoader>
							<ComponentLoader component="h5" :loaded="dateSelection !== null">
								<h5 :style="{color: dateSelection ? 'white' : '#3a3a3e'}">{{ dateSelection ? dateSelection : 0 }}</h5>
							</ComponentLoader>
						</DataCard>
						<LayoutFlex direction="column-justify-between">
							<ThePills
								class="u-mb-8"
								:pills="priceTabs"
								default-active
								@pill-clicked="handlePriceTabChanged" />
							<ThePills
								v-show="selectedPriceTab !== 'Price' && selectedPriceTab !== null"
								class="l-flex--align-self-end l-flex--align-self-start-md u-mb-md-16"
								:pills="periodTabs"
								default-active
								@pill-clicked="handlePeriodTabChanged" />
						</LayoutFlex>
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
import { getTotalSupplyWithToken} from "~/services/theGraph";

export default {
	name: "TokenPrice",
	data() {
		return {
			currentlySelectedTab: "",
			selectedPriceTab: "Price",
			selectedPeriodTab: "",
			tabs: ["HX", "NUON"],
			priceTabs: ["Price", "Market Cap", "Circulating Supply"],
			periodTabs: ["D", "W", "M"],
			priceHistoryData: [],
			graphSelection: "",
			dateSelection: "",
			nuonSupplyInfo: [],
			hydroSupplyInfo: []
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
			if (this.selectedPriceTab === "Price") dataKey = "price";
			if (this.selectedPriceTab === "Market Cap") dataKey = "marketVal";
			if (this.selectedPriceTab === "Circulating Supply") dataKey = "value";

			return this.dataToUse.map(d => ({
				date: new Date(d.date * 1000).toLocaleDateString(),
				data: d[dataKey]
			}));
		},
		xAxisLabels() {
			const data = this.graphData.map(d => d.date);
			if (this.selectedPriceTab !== "Price") {
				let numberOfDaysInPast = this.selectedPeriodTab === "W" ? 7 : 30;
				if (this.selectedPeriodTab === "D") numberOfDaysInPast = 0;
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
				let numberOfDaysInPast = this.selectedPeriodTab === "W" ? 7 : 30;
				if (this.selectedPeriodTab === "D") numberOfDaysInPast = 0;
				data.slice(this.graphData.length - numberOfDaysInPast);
			}
			data = data.map(d => parseFloat(d).toFixed(2));
			data.push(null);
			data.unshift(null);
			return data;
		},
		dottedYAxisData() {
			return this.yAxisData.map(d => d ? this.yAxisData[this.yAxisData.length - 2] : null);
		}
	},
	async mounted() {
		try {
			
			const nuonAddress = this.$store.getters["addressStore/tokens"].NUON;
			const hydroAddress = this.$store.getters["addressStore/tokens"].HX;

			const nuonSupplyResponse = await getTotalSupplyWithToken(nuonAddress);
			this.nuonSupplyInfo = nuonSupplyResponse.data.data.totalSupplyDayDatas;

			const hydroSupplyResponse = await getTotalSupplyWithToken(hydroAddress);
			this.hydroSupplyInfo = hydroSupplyResponse.data.data.totalSupplyDayDatas;

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
