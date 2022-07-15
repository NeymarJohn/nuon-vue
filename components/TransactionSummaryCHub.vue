<template>
	<LayoutFlex direction="column">
		<h5 class="u-mb-12 u-color-light-grey">Transaction Summary</h5>
		<div class="l-flex l-flex--column u-full-width transaction-summary--chub">
			<p class="u-color-light-grey">{{ convertFromTitle }}</p>
			<LayoutFlex direction="row-center-space-between">
				<LayoutFlex direction="row-center">
					<img :src="require(`~/assets/images/borrow/${fromToken}.png`)" :alt="`${fromToken} logo`" height="50" width="50" class="u-mr-8">
					{{ fromToken }}
				</LayoutFlex>
				<h3>{{ convertFromAmount | toFixed | numberWithCommas }}</h3>
			</LayoutFlex>
			<ArrowDownIcon class="u-mt-24 u-ml-8 u-mb-24" />
			<p class="u-color-light-grey">{{ convertToTitle }}</p>
			<LayoutFlex direction="row-center-space-between u-pb-32 u-bb-medium-light-grey">
				<LayoutFlex direction="row-center">
					<img :src="require(`~/assets/images/borrow/${toToken}.png`)" :alt="`${toToken} logo`" height="50" width="50" class="u-mr-8">
					{{ toToken }}
				</LayoutFlex>
				<h3>{{ convertToAmount | toFixed | numberWithCommas }}</h3>
			</LayoutFlex>
			<div v-if="collateralRatio" class="u-mt-32 u-full-width l-flex l-flex--row-space-between">
				<h4>Collateral Ratio</h4>
				<h4>{{ collateralRatio | numberWithCommas }}%</h4>
			</div>
			<div v-if="liquidationPrice" class="u-full-width l-flex l-flex--row-space-between">
				<h4>Liquidation Price</h4>
				<h4>${{ liquidationPrice | toFixed | numberWithCommas }}</h4>
			</div>
			<div class="u-full-width l-flex l-flex--row-space-between">
				<h4>Fee</h4>
				<h4>{{ fee }}%</h4>
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
		convertFromAmount: {
			type: String,
			required: true
		},
		convertFromTitle: {
			type: String,
			required: true
		},
		convertToAmount: {
			type: String,
			required: true
		},
		convertToTitle: {
			type: String,
			required: true
		},
		collateralRatio: {
			type: String,
			required: false,
			default: ""
		},
		liquidationPrice: {
			type: Number,
			required: false,
			default: 0
		},
		fromToken: {
			type: String,
			required: true
		},
		toToken: {
			type: String,
			required: true
		},
		fee: {
			type: Number,
			default: 0
		}
	}
};
</script>
