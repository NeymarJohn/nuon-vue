<template>
	<div>
		<h2 class="u-mb-20 u-mb-lg-14">Ecosystem Status</h2>
		<LayoutGrid class="u-mb-48" :size="'3'">
			<StatCard class="u-mb-md-12">
				<label>NUON Price<TooltipIcon v-tooltip="`Current USD price of 1 NUON. NUON is supposed to match a 'target peg' that is adjusted daily based on data from an on-chain inflation oracle, shielding NUON from losing value as inflation rises. Check here to see if NUON is above or below the target peg, giving you a good measure of when is best to buy or mint NUON.`" /></label>
				<ComponentLoader component="h3" :loaded="nuonPrice !== null" slot-classes="l-flex l-flex--row-center-space-between">
					<h3>{{ computedNuonPrice }}</h3>
					<TheBadge v-if="nuonPrice > truflationPeg">Above</TheBadge>
					<TheBadge v-else-if="nuonPrice < truflationPeg">Below</TheBadge>
				</ComponentLoader>
				<TheBadge color="target-peg">Target Peg: {{ truflationPeg | toFixed }}</TheBadge>
			</StatCard>
			<StatCard class="u-mb-md-12">
				<label>Liquidation Price<TooltipIcon v-tooltip="'If the USD price of BTC / ETH / AVAX / USDC / USDT falls below this amount, you risk liquidation of your collateral.'" /></label>
				<LayoutFlex>
					<ComponentLoader component="h3" :loaded="liquidationPrice !== null">
						<h3>${{ liquidationPrice | toFixed | numberWithCommas }}</h3>
					</ComponentLoader>
				</LayoutFlex>
			</StatCard>
			<StatCard>
				<label>Liquidation Ratio<TooltipIcon
					v-tooltip="'The minimum percentage of BTC/ETH/AVAX/etc collateral that you must lock up in order to mint NUON. Because the minimum collateralization ratio is recalculated each day based on price and inflation oracles, it is strongly recommended that all users deposit more collateral than the bare minimum — the higher your ratio, the safer your collateral.'" /></label>
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
