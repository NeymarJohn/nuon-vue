<template>
	<ul class="nav">
		<li>
			<NuxtLink
				to="/"
				title="Click to visit the Dashboard"
				:class="{'active-link': isRouteActive('/')}">
				<DashboardIcon /> Ecosystem Dashboard
			</NuxtLink>
		</li>
		<li>
			<NuxtLink
				to="/my-page"
				title="Click to visit My Page"
				:class="{'active-link': isRouteActive('/my-page')}">
				<DashboardIcon /> My Page
			</NuxtLink>
		</li>
		<li>
			<NuxtLink
				to="/collateral-vault"
				title="Click to visit the Collateral Vault"
				:class="{'active-link': isRouteActive('/collateral-vault')}">
				<CollateralVaultIcon /> Collateral Vault
			</NuxtLink>
		</li>
		<li>
			<NuxtLink
				to="/stability-zone"
				title="Click to visit the Stability Zone"
				:class="{'active-link': isRouteActive('/stability-zone')}">
				<StabilityZoneIcon /> Stability Zone
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
		<a href="https://hydrolabs.gitbook.io/inflation-adjusted-algorithmic-stablecoin/" title="Click to visit the documentation" target="_blank" rel="noopener noreferrer"><DocumentationIcon /> Documentation <ExternalLinkIcon class="u-mr-0 u-ml-8" /></a>
	</ul>
</template>

<script>
import ExternalLinkIcon from "@/assets/images/svg/svg-external-link.svg";
import DashboardIcon from "@/assets/images/svg/svg-menu-dashboard.svg";
import FarmIcon from "@/assets/images/svg/svg-menu-farm.svg";
import StabilityZoneIcon from "@/assets/images/svg/svg-menu-stability-zone.svg";
import BoardroomIcon from "@/assets/images/svg/svg-menu-boardroom.svg";
import CollateralVaultIcon from "@/assets/images/svg/svg-menu-collateral-vault.svg";
import SwapIcon from "@/assets/images/svg/svg-menu-swap.svg";
import DocumentationIcon from "@/assets/images/svg/svg-menu-documentation.svg";

export default {
	name: "TheNav",
	components: {
		ExternalLinkIcon,
		DashboardIcon,
		FarmIcon,
		StabilityZoneIcon,
		BoardroomIcon,
		CollateralVaultIcon,
		SwapIcon,
		DocumentationIcon
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
