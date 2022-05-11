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
			<div class="chart"></div>
			<div class="chart"></div>
		</div>
	</LayoutContainer>
</template>

<script>
import UserIcon from "@/assets/images/svg/svg-user.svg";

export default {
	name: "TheDashboard",
	components: {
		UserIcon,
	},
	head () {
		return {
			title: "Dashboard | Nuon"
		};
	},
};
</script>
