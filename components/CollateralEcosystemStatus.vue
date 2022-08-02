<template>
	<div>
		<h2 class="u-mb-20 u-mb-lg-14">Ecosystem Status</h2>
		<LayoutGrid class="u-mb-48" :size="'3'">
			<StatCard class="u-mb-md-12">
				<label>NUON Price<TooltipIcon v-tooltip="`Current USD price of 1 NUON. The target peg — updated daily — is displayed below. Compare the price with the target peg to judge when it is best to mint or burn NUON.`" /></label>
				<ComponentLoader component="h3" :loaded="nuonPrice !== null" slot-classes="l-flex l-flex--row-center-space-between">
					<h3>{{ computedNuonPrice }}</h3>
					<TheBadge v-if="nuonPrice > truflationPeg">Above</TheBadge>
					<TheBadge v-else-if="nuonPrice < truflationPeg">Below</TheBadge>
				</ComponentLoader>
				<TheBadge color="target-peg">Target Peg: {{ truflationPeg | toFixed }}</TheBadge>
			</StatCard>
			<StatCard class="u-mb-md-12">
				<label>Liquidation Price<TooltipIcon v-tooltip="`If the USD price of ${collateralToken} falls below this amount, you risk liquidation of your collateral.`" /></label>
				<LayoutFlex>
					<ComponentLoader component="h3" :loaded="liquidationPrice !== null">
						<h3>${{ liquidationPrice | toFixed | numberWithCommas }}</h3>
					</ComponentLoader>
				</LayoutFlex>
			</StatCard>
			<StatCard>
				<label>Liquidation Ratio<TooltipIcon
					v-tooltip="'If your collateralization ratio falls below this number, your position will be liquidated. The Liquidation Ratio is adjusted daily.'" /></label>
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
		collateralToken: {
			type: String,
			default: null
		},
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
