<template>
	<ul class="price-indicator">
		<li>NUON Price:
			<ComponentLoader component="nuon-price" :loaded="nuonPrice !== 0 && targetPeg !== 0">
				<span>${{ computedNuonPrice }}</span>
				<TheBadge v-if="nuonPrice > targetPeg">Above</TheBadge>
				<TheBadge v-else-if="nuonPrice < targetPeg">Below</TheBadge>
			</ComponentLoader>
		</li>
		<li>Target Peg:
			<ComponentLoader component="target-peg" :loaded="targetPeg !== 0">
				<span>${{ targetPeg | toFixed }}</span>
			</ComponentLoader>
		</li>
		<li>Health Status:
			<ComponentLoader component="health-status" :loaded="nuonPrice !== 0 && targetPeg !== 0">
				<span :class="getColorForHealth(nuonPrice, targetPeg)">
					{{healthMetrics( targetPeg, nuonPrice) > 0 ? "+" : ""}}{{ healthMetrics( targetPeg, nuonPrice) | toFixed }} %
				</span>
			</ComponentLoader>
		</li>
	</ul>
</template>

<script>
import { NUON } from "~/constants/tokens";
export default {
	name: "PriceIndicator",
	computed: {
		nuonPrice() {
			return this.tokenPrices[NUON.symbol];
		},
		targetPeg() {
			return this.$store.state.collateralVaultStore.targetPeg || 0;
		}
	},
	methods: {
		healthMetrics(target, current) {
			const difference = (current - target) / target * 100;
			return difference;
		},
		getColorForHealth(target, current) {
			if (Math.abs(this.healthMetrics(target, current)) < this.healthStatusMetrics.healthy) {
				return "healthy";
			} else if (Math.abs(this.healthMetrics(target, current)) < this.healthStatusMetrics.average) {
				return "average";
			} else {
				return "unhealthy";
			}
		}
	}
};
</script>
