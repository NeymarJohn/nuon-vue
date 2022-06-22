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
				<div class="chart chart--token-price">
					<div class="chart--overview">
						<p>Price</p>
						<h1>1.03<sup>Nuon</sup></h1>
						<p class="u-colour-white">Apr 14, 2022</p>
					</div>
					<TheTabs size="thin" color="light" margin="0">
						<TheTab v-for="(priceTab, priceTabIdx) in priceTabs" :key="`priceTab-${priceTabIdx}`" :title="priceTab" @tab-changed="handlePriceTabChanged">
							<TheTabs size="thin" color="light" margin="absolute">
								<TheTab title="D">
									<LineChart />
								</TheTab>
								<TheTab title="W">
									<LineChart />
								</TheTab>
								<TheTab title="M">
									<LineChart />
								</TheTab>
							</TheTabs>
						</TheTab>
					</TheTabs>
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
			tabs: ["HX", "NUON"],
			priceTabs: ["Price", "Market Cap", "Circulating Supply"],
			priceHistoryData: []
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
		}
	},
	mounted () {
		getTokenPricesDayData().then(res => {
			console.log("data", res.data.data.tokenPriceDayDatas);
		});
	},
	methods: {
		handleTabChanged(e) {
			this.currentlySelectedTab = this.tabs[e];
		},
		handlePriceTabChanged(e) {
			this.selectedPriceTab = this.priceTabs[e];
		}
	}
};
</script>
