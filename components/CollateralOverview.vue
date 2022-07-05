<template>
	<LayoutInfo size="row-space-between" class="u-mb-48 l-info--chub">
		<DataCard align="min-width">
			<label>My Total Locked Collateral</label>
			<ComponentLoader component="h1" :loaded="myTotalLockedCollateral !== null">
				<h3>{{ myTotalLockedCollateral | toFixed | numberWithCommas }}<sup>{{ collateralToken }}</sup></h3>
			</ComponentLoader>
			<ComponentLoader component="h5" :loaded="myTotalLockedCollateralDollar !== null">
				<h5>${{ myTotalLockedCollateralDollar | toFixed | numberWithCommas }}</h5>
			</ComponentLoader>
		</DataCard>
		<DataCard align="min-width">
			<label>My Total NUON Minted</label>
			<ComponentLoader component="h1" :loaded="myTotalMintedTokens !== null">
				<h3>{{ myTotalMintedTokens | toFixed | numberWithCommas }}<sup>NUON</sup></h3>
			</ComponentLoader>
			<ComponentLoader component="h5" :loaded="myTotalMintedTokensDollar !== null">
				<h5>${{ myTotalMintedTokensDollar | toFixed | numberWithCommas }}</h5>
			</ComponentLoader>
		</DataCard>
		<DataCard align="min-width">
			<label>My Collateralization Ratio<TooltipIcon v-tooltip="'Enter my collateralization ratio tooltip content here.'" /></label>
			<ComponentLoader component="h1" :loaded="myCollateralizationRatio !== null">
				<h3 :class="myCollateralizationRatio < 730 ? myCollateralizationRatio < 460 ? 'u-is-warning' : 'u-is-caution' : 'u-is-success'">{{ myCollateralizationRatio | toFixed }}<sup>%</sup></h3>
			</ComponentLoader>
			<TheLoader component="h5">
				<TheBadge class="u-half-width u-text-center" color="price-up">+ 0.03%</TheBadge>
			</TheLoader>
		</DataCard>
		<DataCard align="min-width">
			<label>Current {{ collateralToken }} Price<TooltipIcon v-tooltip="'Enter current ETH price tooltip content here.'" /></label>
			<ComponentLoader component="h1" :loaded="currentPrice !== null">
				<h3>${{ currentPrice | toFixed | numberWithCommas }}</h3>
			</ComponentLoader>
			<TheLoader component="h5">
				<TheBadge class="u-half-width u-text-center" :color="collateralPriceChange[1]">{{collateralPriceChange[0]}}%</TheBadge>
			</TheLoader>
		</DataCard>
	</LayoutInfo>
</template>

<script>
import TooltipIcon from "@/assets/images/svg/svg-tooltip.svg";

export default {
	name: "CollateralOverview",
	components: {
		TooltipIcon
	},
	props: {
		collateralToken: {
			type: String,
			default: null
		},
		myTotalLockedCollateral: {
			type: Number,
			default: null
		},
		myTotalLockedCollateralDollar: {
			type: Number,
			default: null
		},
		myTotalMintedTokens: {
			type: Number,
			default: null
		},
		myTotalMintedTokensDollar: {
			type: Number,
			default: null
		},
		myCollateralizationRatio: {
			type: Number,
			default: null
		},
		currentPrice: {
			type: Number,
			default: null
		},
		collateralPriceChange: {
			type: Array,
			required: true
		}
	},
};
</script>
