<template>
	<LayoutInfo size="row-space-between" class="u-mb-48">
		<DataCard>
			<label>My Total {{ collateralToken }} Locked Collateral</label>
			<TheLoader component="h1">
				<h3>{{ myTotalLockedCollateral | toFixed | numberWithCommas }}<sup>{{ collateralToken }}</sup></h3>
			</TheLoader>
			<TheLoader component="h5">
				<h5>${{ myTotalLockedCollateralDollar | toFixed | numberWithCommas }}</h5>
			</TheLoader>
		</DataCard>
		<DataCard>
			<label>My Total NUON Minted Using {{ collateralToken }}</label>
			<TheLoader component="h1">
				<h3>{{ myTotalMintedTokens | toFixed | numberWithCommas }}<sup>NUON</sup></h3>
			</TheLoader>
			<TheLoader component="h5">
				<h5>${{ myTotalMintedTokensDollar | toFixed | numberWithCommas }}</h5>
			</TheLoader>
		</DataCard>
		<DataCard>
			<label>My {{ collateralToken }} Collateralization Ratio<TooltipIcon v-tooltip="'Enter my collateralization ratio tooltip content here.'" /></label>
			<TheLoader component="h1">
				<h3 :class="isRiskLevel">{{ myCollateralizationRatio | toFixed }}<sup>%</sup></h3>
			</TheLoader>
			<TheLoader component="h5">
				<TheBadge color="price-up">+ 0.03%</TheBadge>
			</TheLoader>
		</DataCard>
		<DataCard>
			<label>Current {{ collateralToken }} Price<TooltipIcon v-tooltip="'Enter current ETH price tooltip content here.'" /></label>
			<TheLoader component="h1">
				<h3>${{ currentPrice | toFixed | numberWithCommas }}</h3>
			</TheLoader>
			<TheLoader component="h5">
				<TheBadge color="price-down">- 4.56%</TheBadge>
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
			required: true
		},
		myTotalLockedCollateral: {
			type: Number,
			required: true
		},
		myTotalLockedCollateralDollar: {
			type: Number,
			required: true
		},
		myTotalMintedTokens: {
			type: Number,
			required: true
		},
		myTotalMintedTokensDollar: {
			type: Number,
			required: true
		},
		myCollateralizationRatio: {
			type: Number,
			required: true
		},
		currentPrice: {
			type: Number,
			required: true
		},
	},
};
</script>
