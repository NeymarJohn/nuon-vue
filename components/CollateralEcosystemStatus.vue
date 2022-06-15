<template>
	<div>
		<h2 class="u-mb-20 u-mb-lg-14">Ecosystem Status</h2>
		<LayoutGrid class="u-mb-48" :size="'2'">
			<StatCard class="u-mb-md-12">
				<label>Min. Collateralization Ratio<TooltipIcon v-tooltip="'Enter min collateralization ratio tooltip content here.'" /></label>
				<LayoutFlex>
					<TheLoader component="h3">
						<h3>{{ minCollateralizationRatio }}%</h3>
					</TheLoader>
				</LayoutFlex>
			</StatCard>
			<StatCard>
				<label>Liquidation Price<TooltipIcon v-tooltip="'Enter liquidation price tooltip content here.'" /></label>
				<LayoutFlex>
					<TheLoader component="h3">
						<h3>${{ liquidationPrice | toFixed | numberWithCommas }}</h3>
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
			type: Number,
			required: true
		},
		liquidationPrice: {
			type: Number,
			required: true
		},
	}
};
</script>
