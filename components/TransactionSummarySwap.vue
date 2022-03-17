<template>
	<div>
		<h4 class="u-mb-xs">Transaction Summary</h4>
		<div class="transaction-summary">
			<LayoutFlex direction="row-center-space-between" class="u-mb-xxxs">
				<LayoutFlex direction="row-center">
					<img :src="require(`~/assets/images/tokens/Hydro.png`)" alt="Hydro logo">
					<h2>HX</h2>
				</LayoutFlex>
				<LayoutFlex direction="column-end">
					<h2>{{ numberWithCommas(tokenInput.in.toFixed(2)) }}</h2>
					<p class="u-colour-grey-dark">~ ${{ numberWithCommas(tokenInput.dollar.toFixed(2)) }}</p>
				</LayoutFlex>
			</LayoutFlex>
			<LayoutFlex class="u-mb-xxxs">
				<ArrowDownIcon />
			</LayoutFlex>
			<LayoutFlex direction="row-center-space-between" class="u-mb-sm">
				<LayoutFlex direction="row-center">
					<img :src="require(`~/assets/images/tokens/Ethereum.png`)" alt="Ethereum logo">
					<h2>ETH</h2>
				</LayoutFlex>
				<LayoutFlex direction="column-end">
					<h2>{{ numberWithCommas(tokenOutput.out.toFixed(2)) }}</h2>
					<p class="u-colour-grey-dark">~ ${{ numberWithCommas(tokenOutput.dollar.toFixed(2)) }}</p>
				</LayoutFlex>
			</LayoutFlex>
			<div v-if="priceUpdate" class="transaction__update">
				<LayoutFlex direction="column">
					<h4>Price Updated</h4>
					<h4>1 ETH = 2,454.00 HX</h4>
				</LayoutFlex>
				<TheButton
					size="md"
					title="Click to accept"
					@click="acceptNewPrice">Accept</TheButton>
			</div>
			<LayoutFlex v-else class="u-bb-black u-pb-xs u-mb-xs">
				<h4>1 ETH = 2,454.00 HX</h4>
			</LayoutFlex>
			<LayoutFlex
				v-for="(value, index) in values"
				:key="index"
				direction="row-start-space-between"
				class="u-mb-xs">
				<p>{{ value.title }}</p>
				<LayoutFlex direction="column-end">
					<p>{{ value.val }} {{ value.currency && value.currency }}</p>
					<p class="u-colour-grey-dark">~ ${{ value.dollar }}</p>
				</LayoutFlex>
			</LayoutFlex>
		</div>
	</div>
</template>

<script>
import ArrowDownIcon from "@/assets/images/svg/svg-arrow-down.svg";

export default {
	name: "TransactionSummarySwap",
	components: {
		ArrowDownIcon
	},
	props: {
		values: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			tokenInput: {
				in: 200,
				dollar: 100
			},
			tokenOutput: {
				out: 0.497,
				dollar: 0.76
			},
			priceUpdate: true
		};
	},
	methods: {
		acceptNewPrice() {
			this.priceUpdate = false;
		}
	}
};
</script>
