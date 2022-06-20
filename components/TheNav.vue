<template>
	<ul class="nav">
		<li>
			<NuxtLink
				to="/"
				title="Click to see the Ecosystem Overview"
				:class="{'active-link': isRouteActive('/')}">
				<DashboardIcon /> Ecosystem Overview
			</NuxtLink>
		</li>
		<li>
			<NuxtLink
				to="/my-dashboard"
				title="Click to visit My Page"
				:class="{'active-link': isRouteActive('/my-dashboard')}">
				<MyTransactionsIcon /> My Dashboard
			</NuxtLink>
		</li>
		<li>
			<NuxtLink
				to="/collateral-hub"
				title="Click to visit the Collateral Hub"
				:class="{'active-link': isRouteActive('/collateral-hub')}">
				<CollateralHubIcon /> Collateral Hub
			</NuxtLink>
		</li>
		<li>
			<NuxtLink
				to="/boardroom"
				title="Click to visit the Boardroom"
				:class="{'active-link': isRouteActive('/boardroom')}">
				<BoardroomIcon /> Boardroom
			</NuxtLink>
		</li>
		<li>
			<NuxtLink
				to="/swap"
				title="Click to visit the Swap"
				:class="{'active-link': isRouteActive('/swap')}">
				<SwapIcon /> Swap
			</NuxtLink>
		</li>
		<li>
			<NuxtLink
				to="/farms"
				title="Click to visit the Farms"
				:class="{'active-link': isRouteActive('/farms')}">
				<FarmIcon /> Farms
			</NuxtLink>
		</li>
		<a href="https://hydrolabs.gitbook.io/inflation-adjusted-algorithmic-stablecoin/" title="Click to visit the documentation" target="_blank" rel="noopener noreferrer"><DocumentationIcon /> Docs <ExternalLinkIcon class="u-mr-0 u-ml-8" /></a>
	</ul>
</template>

<script>
import BoardroomIcon from "@/assets/images/svg/svg-menu-boardroom.svg";
import CollateralHubIcon from "@/assets/images/svg/svg-menu-collateral-hub.svg";
import DashboardIcon from "@/assets/images/svg/svg-menu-dashboard.svg";
import DocumentationIcon from "@/assets/images/svg/svg-menu-documentation.svg";
import ExternalLinkIcon from "@/assets/images/svg/svg-external-link.svg";
import FarmIcon from "@/assets/images/svg/svg-menu-farm.svg";
import MyTransactionsIcon from "@/assets/images/svg/svg-menu-my-transactions.svg";
import SwapIcon from "@/assets/images/svg/svg-menu-swap.svg";

export default {
	name: "TheNav",
	components: {
		BoardroomIcon,
		CollateralHubIcon,
		DashboardIcon,
		DocumentationIcon,
		ExternalLinkIcon,
		FarmIcon,
		MyTransactionsIcon,
		SwapIcon
	},
	watch: {
		"$route" () {
			if(window.innerWidth <= 990) {
				this.$store.commit("nav/toggle", null);
			}
		}
	},
	methods: {
		isRouteActive(url) {
			return url.split("/")[1] === this.$nuxt.$route.path.split("/")[1];
		}
	},
};
</script>
