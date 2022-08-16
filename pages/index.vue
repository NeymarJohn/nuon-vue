<template>
	<LayoutContainer>
		<LayoutFlex class="u-mb-48 l-flex--column-start-sm" direction="row-center-space-between">
			<PageTitle data-v-step="1">
				<h4>Ecosystem Overview</h4>
				<h1>NUON Protocol Information</h1>
			</PageTitle>
			<NuxtLink class="btn btn--lg btn--user" to="/dashboard" title="Click to view my page">
				<UserIcon />
				Dashboard
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
						title: "Welcome to the Ecosystem Overview",
					},
					content: "This page shows general information about the protocol.",
				},
				{
					target: "[data-v-step=\"2\"]",
					content: "You can track NUON's historical TVL (Total Value Locked), as well as its total collateralization ratio and the distribution of diversified collateral backing NUON.",
					params: {
						placement: "left"
					}
				},
				{
					target: "[data-v-step=\"3\"]",
					content: "View market information for the NUON and nuMINT tokens.",
					params: {
						placement: "left"
					}
				},
			],
			tourCallbacks: {
				onSkip: () => this.setCookie("skip_ecosystem_overview_tour"),
				onStop: () => this.setCookie("skip_ecosystem_overview_tour"),
				onFinish: () => this.setCookie("skip_ecosystem_overview_tour")
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
		if (!$cookies.get("skip_ecosystem_overview_tour")) this.$tours.ecosystemOverviewTour.start();
	}
};
</script>
