<template>
	<div>
		<h2 class="u-mb-20 u-mb-lg-14">Ecosystem Status</h2>
		<LayoutGrid class="u-mb-48" :size="'3'">
			<StatCard class="u-mb-md-12">
				<label>NUON Price<TooltipIcon v-tooltip="'Enter NUON price tooltip content here.'" /></label>
				<ComponentLoader component="h3" :loaded="nuonPrice !== null" slot-classes="l-flex--row-center-space-between">
					<h3>{{ nuonPrice | toFixed | numberWithCommas }}</h3>
					<TheBadge v-if="nuonPrice > 1">Above</TheBadge>
					<TheBadge v-else-if="nuonPrice < 1">Below</TheBadge>
				</ComponentLoader>
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
		}
	},
};
</script>
