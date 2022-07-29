<template>
	<LayoutContainer>
		<LayoutFlex class="u-mb-48 l-flex--column-start-sm" direction="row-center-space-between">
			<PageTitle data-v-step="1">
				<h4>Ecosystem Overview</h4>
				<h1>NUON Protocol Information</h1>
			</PageTitle>
			<NuxtLink class="btn btn--lg btn--user" to="/my-dashboard" title="Click to view my page">
				<UserIcon />
				My Dashboard
			</NuxtLink>
		</LayoutFlex>
		<CollateralHubOverview data-v-step="2" />
		<TokenPrice data-v-step="3" />
		<v-tour name="ecosystemOverviewTour" :steps="steps" :callbacks="tourCallbacks"></v-tour>
	</LayoutContainer>
</template>

<script>
import UserIcon from "@/assets/images/svg/svg-user.svg";

export default {
	name: "EcosystemOverview",
	components: {
		UserIcon,
	},
	data() {
		return {
			steps: [
				{
					target: "[data-v-step=\"1\"]",
					header: {
						title: "Welcome to Ecosystem Overview",
					},
					content: "This page showcases the protocol general information.",
				},
				{
					target: "[data-v-step=\"2\"]",
					content: "You can track the historical TVL (Total Value Locked) as well as the Nuon collateralization ratio & collateral distribution (a basket of diversified collaterals is backing Nuon).",
					params: {
						placement: "left"
					}
				},
				{
					target: "[data-v-step=\"3\"]",
					content: "View the nuMINT and NUON tokens market information.",
					params: {
						placement: "left"
					}
				},
			],
			tourCallbacks: {
				onSkip: this.skipTourCallback
			},
		};
	},
	head () {
		return {
			title: "Ecosystem Overview | NUON",
			script: [
				{ src: "https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js" },
			]
		};
	},
	mounted() {
		if (!$cookies.get("skip_tour")) this.$tours.ecosystemOverviewTour.start();
	}
};
</script>
