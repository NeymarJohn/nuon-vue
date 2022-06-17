<template>
	<div>
		<h2 class="u-mb-20 u-mb-lg-14">Ecosystem Status</h2>
		<LayoutGrid class="u-mb-48" :size="'3'">
			<StatCard class="u-mb-md-12">
				<label>NUON Price<TooltipIcon v-tooltip="'Enter NUON price tooltip content here.'" /></label>
				<TheLoader component="h3">
					<LayoutFlex direction="row-center-space-between">
						<h3>{{ nuonPrice | toFixed | numberWithCommas }}</h3>
						<TheBadge v-if="nuonPrice > 1">Above</TheBadge>
						<TheBadge v-else-if="nuonPrice < 1">Below</TheBadge>
					</LayoutFlex>
				</TheLoader>
			</StatCard>
			<StatCard class="u-mb-md-12">
				<label>Liquidation Price<TooltipIcon v-tooltip="'Enter liquidation price tooltip content here.'" /></label>
				<LayoutFlex>
					<TheLoader component="h3">
						<h3>${{ liquidationPrice | toFixed | numberWithCommas }}</h3>
					</TheLoader>
				</LayoutFlex>
			</StatCard>
			<StatCard>
				<label>Min. Collateralization Ratio<TooltipIcon v-tooltip="'Enter min collateralization ratio tooltip content here.'" /></label>
				<LayoutFlex>
					<TheLoader component="h3">
						<h3>{{ minCollateralizationRatio }}%</h3>
					</TheLoader>
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
			required: true
		},
		liquidationPrice: {
			type: Number,
			required: true
		},
		nuonPrice: {
			type: Number,
			required: true
		}
	},
};
</script>
