<template>
	<LayoutContainer>
		<LayoutFlex class="u-mb-48 l-flex-column-start-sm" direction="row-center-space-between">
			<PageTitle>
				<h4>Dashboard</h4>
				<h1>Nuon Protocol Information</h1>
			</PageTitle>
			<NuxtLink class="btn btn--md" to="/my-page" title="Click to view my page">My Page</NuxtLink>
		</LayoutFlex>
		<h2>Account Balance</h2>
	</LayoutContainer>
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
