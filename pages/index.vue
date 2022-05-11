<template>
	<LayoutContainer>
		<LayoutFlex class="u-mb-48 l-flex-column-start-sm" direction="row-center-space-between">
			<PageTitle>
				<h4>Dashboard</h4>
				<h1>Nuon Protocol Information</h1>
			</PageTitle>
			<NuxtLink class="btn btn--lg btn--user" to="/my-page" title="Click to view my page">
				<UserIcon />
				My Page
			</NuxtLink>
		</LayoutFlex>
		<h2 class="u-mb-24">Vault Overview</h2>
		<div class="l-chart">
			<div class="chart">
				<LineChart />
			</div>
			<div class="chart chart--donut">
				<p class="u-mb-4">Collateral Distribution</p>
				<p class="u-colour-white u-mb-16">Apr 14, 2022</p>
				<DonutChart class="u-mb-24" />
				<p>APY <TooltipIcon v-tooltip="'Enter APY tooltip content here.'" /></p>
				<h3 class="u-mb-24">Inflation 34.3%</h3>
				<p>Collateralization Ratio <TooltipIcon v-tooltip="'Enter collateralization ratio tooltip content here.'" /></p>
				<h3>150%</h3>
			</div>
		</div>
		<h2>Token Price</h2>
	</LayoutContainer>
</template>

<script>
import UserIcon from "@/assets/images/svg/svg-user.svg";
import TooltipIcon from "@/assets/images/svg/svg-tooltip.svg";

export default {
	name: "TheDashboard",
	components: {
		UserIcon,
		TooltipIcon
	},
	head () {
		return {
			title: "Dashboard | Nuon"
		};
	},
};
</script>
