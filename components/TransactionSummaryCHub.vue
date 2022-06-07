<template>
	<LayoutFlex direction="column">
		<h5 class="u-mb-12 u-color-light-grey">Transaction Summary</h5>
		<div class="l-flex l-flex--column u-full-width transaction-summary--chub">
			<p class="u-color-light-grey">Deposit</p>
			<LayoutFlex direction="row-center-space-between">
				<LayoutFlex direction="row-center">
					<img :src="require('~/assets/images/tokens/USDC.png')" alt="usdc image" height="50" width="50" class="u-mr-8">
					test
				</LayoutFlex>
				<h3>1.0</h3>
			</LayoutFlex>
			<ArrowDownIcon class="u-mt-24 u-ml-8 u-mb-24" />
			<p class="u-color-light-grey">Mint</p>
			<LayoutFlex direction="row-center-space-between u-pb-32 u-bb-medium-light-grey">
				<LayoutFlex direction="row-center">
					<img :src="require('~/assets/images/tokens/USDC.png')" alt="usdc image" height="50" width="50" class="u-mr-8">
					test
				</LayoutFlex>
				<h3>124.0</h3>
			</LayoutFlex>
			<div class="u-mt-32 u-full-width l-flex l-flex--row-space-between">
				<h4>Liquidation Price</h4>
				<h4>204%</h4>
			</div>
			<div class="u-full-width l-flex l-flex--row-space-between">
				<h4>Collateral Ratio</h4>
				<h4>$1543.03</h4>
			</div>
			<div class="u-full-width l-flex l-flex--row-space-between">
				<h4>Fee</h4>
				<h4>5%</h4>
			</div>
		</div>
	</LayoutFlex>
</template>

<script>
import ArrowDownIcon from "@/assets/images/svg/svg-arrow-down.svg";

export default {
	name: "TransactionSummaryChub",
	components: {
		ArrowDownIcon
	},
	props: {
		values: {
			type: Array,
			required: true
		}
	}
};
</script>
