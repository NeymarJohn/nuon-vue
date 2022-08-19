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
				<TheBadge :color="calculateHealthStatus(nuonPrice, truflationPeg)">{{ calculateHealthStatus(nuonPrice, truflationPeg) }}</TheBadge>
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
			required: true
		},
		truflationPeg: {
			type: Number,
			required: true
		}
	},
	methods: {
		calculateHealthStatus(a, b) {
			const difference = Math.abs(a, b);
			if (difference >= 0.5) {
				return "average";
			} else if (difference >= 1) {
				return "unhealthy";
			} else {
				return "healthy";
			}
		},
	}
};
</script>
