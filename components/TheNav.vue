<template>
	<ul class="nav">
		<li v-for="(link, index) in links" :key="index">
			<NuxtLink
				:to="link.url"
				:title="`Click to visit the ${link.name}`"
				:class="{'active-link': isRouteActive(link.url)}">
				<NavIcon /> {{ link.name }}
			</NuxtLink>
		</li>
		<a href="https://hydrolabs.gitbook.io/inflation-adjusted-algorithmic-stablecoin/" title="Click to visit the documentation" target="_blank" rel="noopener noreferrer"><NavIcon /> Documentation <ExternalLinkIcon /></a>
	</ul>
</template>

<script>
import ExternalLinkIcon from "@/assets/images/svg/svg-external-link.svg";
import NavIcon from "@/assets/images/svg/svg-nav.svg";

export default {
	name: "TheNav",
	components: {
		ExternalLinkIcon,
		NavIcon
	},
	data() {
		return {
			links: [
				{
					name: "Dashboard",
					url: "/"
				},
				{
					name: "Collateral Vault",
					url: "/collateral-vault"
				},
				{
					name: "Stability Zone",
					url: "/stability-zone"
				},
				{
					name: "Boardroom",
					url: "/boardroom"
				},
				{
					name: "Swap",
					url: "/swap"
				},
				{
					name: "Farms",
					url: "/farms"
				}
			]
		};
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
