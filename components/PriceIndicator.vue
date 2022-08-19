<template>
	<ul class="price-indicator">
		<li>NUON Price:
			<ComponentLoader component="nuon-price" :loaded="nuonPrice !== null && truflationPeg !== null">
				<span>${{ computedNuonPrice }}</span>
				<TheBadge v-if="nuonPrice > truflationPeg">Above</TheBadge>
				<TheBadge v-else-if="nuonPrice < truflationPeg">Below</TheBadge>
			</ComponentLoader>
		</li>
		<li>Target Peg:
			<ComponentLoader component="target-peg" :loaded="truflationPeg !== 0">
				<span>${{ truflationPeg | toFixed }}</span>
			</ComponentLoader>
		</li>
		<li>Health Status:
			<ComponentLoader component="health-status" :loaded="nuonPrice !== null && truflationPeg !== null">
				<span :class="getColorForHealth(nuonPrice, truflationPeg)">
					{{healthMetrics( truflationPeg, nuonPrice)>0?"+":""}}{{ healthMetrics( truflationPeg, nuonPrice) | toFixed }} %
				</span>
				<TheBadge :color="getColorForHealth(nuonPrice, truflationPeg)">{{ getColorForHealth( truflationPeg, nuonPrice) }}</TheBadge>
			</ComponentLoader>
		</li>
	</ul>
</template>

<script>
export default {
	name: "PriceIndicator",
	props: {
		nuonPrice: {
			type: Number,
			required: true,
			default: 0
		},
		truflationPeg: {
			type: Number,
			required: true,
			default: 0
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
