<template>
	<div>
		<h2 class="u-mb-20 u-mb-lg-14">Ecosystem Status</h2>
		<LayoutGrid class="u-mb-48" :size="'3'">
			<StatCard class="u-mb-md-12">
				<label>NUON Price<TooltipIcon v-tooltip="'Enter NUON price tooltip content here.'" /></label>
				<ComponentLoader component="h3" :loaded="nuonPrice !== null" slot-classes="l-flex l-flex--row-center-space-between">
					<h3>{{ computedNuonPrice }}</h3>
					<TheBadge v-if="nuonPrice > truflationPeg">Above</TheBadge>
					<TheBadge v-else-if="nuonPrice < truflationPeg">Below</TheBadge>
				</ComponentLoader>
				<TheBadge color="target-peg">Target Peg: {{ truflationPeg }}</TheBadge>
			</StatCard>
			<StatCard class="u-mb-md-12">
				<label>Liquidation Price<TooltipIcon v-tooltip="'Enter liquidation price tooltip content here.'" /></label>
				<LayoutFlex>
					<ComponentLoader component="h3" :loaded="liquidationPrice !== null">
						<h3>${{ liquidationPrice | toFixed | numberWithCommas }}</h3>
					</ComponentLoader>
				</LayoutFlex>
			</StatCard>
			<StatCard>
				<label>Min. Collateralization Ratio<TooltipIcon v-tooltip="'Enter min collateralization ratio tooltip content here.'" /></label>
				<LayoutFlex>
					<ComponentLoader component="h3" :loaded="minCollateralizationRatio !== null">
						<h3>{{ minCollateralizationRatio }}%</h3>
					</ComponentLoader>
				</LayoutFlex>
			</StatCard>
		</LayoutGrid>
	</div>
</template>

<script>
import TooltipIcon from "@/assets/images/svg/svg-tooltip.svg";

export default {
	name: "CollateralEcosystemStatus",
	components: {
		TooltipIcon
	},
	props: {
		minCollateralizationRatio: {
			type: [Number, String],
			default: null
		},
		liquidationPrice: {
			type: Number,
			default: null
		},
		nuonPrice: {
			type: Number,
			default: null
		},
		truflationPeg: {
			type: Number,
			default: null
		}
	},
	computed: {
		computedNuonPrice() {
			if (!this.nuonPrice) return 0;
			if (this.nuonPrice < 1) return this.nuonPrice.toFixed(9);
			if (this.nuonPrice > 1) return this.numberWithCommas(this.nuonPrice.toFixed(2));
			return 0;
		}
	},
};
</script>
