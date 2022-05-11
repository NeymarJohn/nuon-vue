<template>
	<div>
		<LayoutContainer>
			<h1>Dashboard</h1>
			<LayoutDataCardContainer>
				<LayoutDataCard>
					<DataCard>
						<p>USX price:</p>
						<TheLoader component="h3">
							<h3>{{ numberWithCommas(usxPrice.toFixed(2)) }}</h3>
						</TheLoader>
					</DataCard>
					<DataCard>
						<p>HX price:</p>
						<TheLoader component="h3">
							<h3>{{ numberWithCommas(hxPrice.toFixed(2)) }}</h3>
						</TheLoader>
					</DataCard>
					<DataCard v-for="(item, index) in items" :key="index">
						<p>{{ item.label }}:</p>
						<h3>{{ item.statistic }}</h3>
					</DataCard>
				</LayoutDataCard>
			</LayoutDataCardContainer>
		</LayoutContainer>
	</div>
</template>

<script>
import { HX, USX } from "~/constants/tokens";
export default {
	name: "TheDashboard",
	data () {
		return {
			items: [
				{
					label: "Peg range",
					statistic: "5% around the peg"
				},
				{
					label: "HX minted last year",
					statistic: "8,302"
				},
				{
					label: "USX volatility last year",
					statistic: "2%"
				},
				{
					label: "HX burnt last year",
					statistic: "10,479"
				},
				{
					label: "USX time in peg range",
					statistic: "97%"
				},
				{
					label: "Average APY on vested HX",
					statistic: "917%"
				},
				{
					label: "Average ROI by stability arbitragers",
					statistic: "369%"
				}
			]
		};
	},
	head () {
		return {
			title: "Dashboard | Nuon"
		};
	},
	computed: {
		usxPrice() {
			return this.tokenPrices[USX.symbol]; 
		},
		hxPrice() {
			return this.tokenPrices[HX.symbol];
		}
	},
	mounted () {
		this.$store.commit("rootStore/setIsLoaded", true);
		this.$store.commit("rootStore/setInfuraId", this.$config.infuraId);
	},

};
</script>
